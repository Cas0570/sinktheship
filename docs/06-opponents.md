Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Regels](02-game-rules.md), [architectuur](04-architecture.md), [engine](05-game-engine.md), [stories](03-user-stories.md), [ADR 0030](adr/0030-benchmark-and-promotion.md)

# Tegenstanders en benchmark

De niveaus verschillen in schotkeuze. Zij krijgen dezelfde informatie en gebruiken dezelfde uniforme vlootverdeling. Een naam als Hard of Impossible is een beoogde moeilijkheid, geen al bewezen prestatie. De benchmark hieronder moet de volgorde aantonen voordat een release die claim doet.

## Tegenstandercontract

De hoofdmethoden uit de masterprompt blijven herkenbaar. Een optionele vierde parameter voegt annulering en inzicht toe zonder browsertypen in de strategie te brengen. `PlayerView`, `Rng`, `ShotOutcome` en enginegedrag komen uit 05; regels en geometrie uit 02.

```ts
interface Cancellation {
  readonly cancelled: boolean;
  subscribe(listener: () => void): () => void;
}

interface DecisionInsight {
  readonly kind: "placement-density" | "model-score";
  readonly values: readonly number[];
  readonly selected: Coord;
  readonly policyVersion: string;
}

interface Clock {
  nowMs(): number;
  sleep(ms: number, cancellation: Cancellation): Promise<void>;
}

interface WorkScheduler {
  yield(cancellation: Cancellation): Promise<void>;
}

interface OpponentContext {
  readonly requestId: string;
  readonly cancellation: Cancellation;
  readonly scheduler: WorkScheduler;
  readonly recordInsight?: (insight: DecisionInsight) => void;
}

interface Opponent {
  readonly id: string;
  readonly version: string;
  supports(rules: RuleSet): boolean;
  placeFleet(rules: RuleSet, rng: Rng, context?: OpponentContext): Promise<Placement>;
  chooseShot(
    view: PlayerView,
    rules: RuleSet,
    rng: Rng,
    context?: OpponentContext,
  ): Promise<Coord>;
  dispose?(): void | Promise<void>;
}

interface OpponentDefinition {
  readonly id: string;
  readonly version: string;
  readonly labelKey: string;
  readonly messages: Readonly<Record<"en" | "nl", Readonly<Record<string, string>>>>;
  readonly create: () => Opponent;
}

interface OpponentRegistry {
  register(definition: OpponentDefinition): void;
  list(): readonly OpponentDefinition[];
  create(id: string): Opponent;
}

declare function withThinkingDelay(
  opponent: Opponent,
  clock: Clock,
  delayMs: number,
): Opponent;

declare function sampleUniformFleet(
  rules: RuleSet,
  rng: Rng,
  context?: OpponentContext,
): Promise<Placement>;
```

`Cancellation`, `Clock` en `WorkScheduler` zijn minimale ports van deze package; de browser-/Node-compositie implementeert ze. De sessie importeert ze vanuit `opponents`, nooit andersom.

Registratie weigert dubbele IDs. `create` sluit over geïnjecteerde dependencies; er is geen globale service locator. Eén ingebouwde catalogus registreert Easy/Normal/Hard voor zowel web als benchmark. Neural voegt zijn descriptor toe vanuit de eigen package. Een modelmap wordt door de modelcatalogus ontdekt, niet door een nieuwe `switch` in de UI.

`supports` is synchroon, zonder I/O en deterministisch voor de meegegeven geldige regels en vaste instanceconfiguratie. Easy/Normal/Hard ondersteunen het volledige geldige v1-enginecontract, inclusief afwijkende bordmaten, lengtes en onthullingen. Neural controleert vooraf beschikbare gevalideerde manifestmetadata; laden gebeurt apart. Een fout tijdens laden of inferentie is geen verandering van spelregels en geen toestemming voor automatische downgrade.

`chooseShot` wordt alleen aangeroepen met een playing-view van de actieve speler, overeenkomende regelsignatuur en minstens één legaal schot. Het resultaat moet in `view.legalShots` liggen. Bij ongeldige invoer of een contractfout wordt een getypeerde fout gebruikt, geen sentinelcoördinaat. Namen voor de foutcodes: `UNSUPPORTED_RULES`, `INVALID_OBSERVATION`, `NO_LEGAL_ACTION`, `CANCELLED`, `MODEL_UNAVAILABLE`, `INFERENCE_FAILED` en `INCONSISTENT_OBSERVATION`.

Alle methoden behandelen view/rules als immutable. Alleen de verstrekte lokale RNG mag muteren. De strategie ziet geen `GameState`, opponentplaatsing, masterseed, opslag of andere RNG-stromen. De sessie controleert en commit het resultaat zoals beschreven in 05. Async callbacks voor inzicht worden bij annulering eveneens weggegooid.

`Cancellation.subscribe` meldt annulering precies eenmaal, ook direct wanneer de token al geannuleerd is. Een unsubscribe verwijdert de listener. Afwezigheid van context betekent een niet-annuleerbare call zonder inzicht. CPU-lussen controleren iedere 256 verwerkte kandidaten en gebruiken dan `WorkScheduler.yield` om de uitvoeradapter ruimte te laten geven aan andere taken, waaronder annulering. Browser- en Node-compositie injecteren elk een scheduler; de package importeert geen platformtimer. Die yieldfrequentie verandert geen kandidatenvolgorde of randomness; de klok bepaalt nooit welk spelresultaat wordt gekozen. `requestId` dient alleen voor correlatie en mag de strategie niet beïnvloeden.

Bots zijn vanuit view, regels, eigen versie en schot-RNG reproduceerbaar. Een cache mag een berekening versnellen, maar mag geen noodzakelijk verborgen geheugen bevatten. Na refresh reconstrueert Normal zijn targetinformatie uit de historie en Hard zijn dichtheid uit dezelfde observatie. Neural heeft een vaste runtime-/modelversie; de numerieke en beslispariteit wordt in batch C gespecificeerd.

## Uniforme plaatsingsstrategie

Een vloot is **gelabeld**: cruiser en submarine hebben dezelfde lengte, maar verschillende IDs. Uniform betekent dat iedere complete geldige gelabelde vloot even waarschijnlijk is. De knop Willekeurig plaatsen gebruikt exact dezelfde sampler als de vier bots; deze vervangt de hele conceptvloot.

Het voorgestelde algoritme:

1. Sorteer schepen op ASCII-ID. Maak per schip de lijst van alle plaatsingen die individueel binnen het bord passen: horizontaal vóór verticaal, binnen die oriëntatie rij-major. Voor lengte 1 bestaat uitsluitend horizontaal.
2. Trek per schip onafhankelijk één lijstindex met `Rng.int`. Dit levert een volledig tuple op zonder al rekening te houden met andere schepen.
3. Controleer het volledige tuple op overlap en contactregels. Accepteer het alleen als het compleet geldig is; verwerp anders **het hele tuple**, niet alleen het laatste schip.
4. Na 10.000 afgewezen tuples schakelt de sampler over op volledige deterministische enumeratie met reservoir sampling. Enumeratie bezoekt iedere complete geldige gelabelde vloot precies eenmaal; bij de k-de oplossing vervangt deze de bewaarde oplossing met kans 1/k. Pas na uitputting wordt de gekozen vloot teruggegeven.

Iedere onafhankelijke trekking heeft kans `1 / product(aantal individuele plaatsingen)`. Conditioneren op geldigheid maakt alle geldige tuples even waarschijnlijk. De fallback is ook uniform over dezelfde verzameling; de overstap na een vast aantal afwijzingen verandert de verdeling dus niet. Dit veronderstelt de uniforme-drawabstractie van `Rng`; een concrete eindige PRNG is de reproduceerbare benadering daarvan.

De enumeratie gebruikt DFS, dezelfde scheeps-/kandidatenvolgorde en pruning uitsluitend bij reeds bewezen overlap/contact. Een oplossing wordt niet meerdere keren via omgekeerde oriëntaties geteld. Grote tellers zijn exact; de helper uit 05 vermijdt modulo-bias ook boven 2^32. De eerste validator-witness en de eerste gevonden oplossing zijn geen willekeurige fallback.

Voor dichtbezette grote engineconfiguraties kan exacte sampling zeer traag zijn. De operatie is annuleerbaar en draait in de Worker; na annulering wordt geen gedeeltelijke oplossing uitgegeven of RNG gecommit. De vier v1-configuraties krijgen een afzonderlijke meting vóór MVP-vrijgave. Een eventuele optimalisatie vereist hetzelfde distributiebewijs en een ADR; een snellere greedy verdeling is geen onzichtbare optimalisatie. Zie [ADR 0027](adr/0027-rng-and-fleet-sampling.md).

## Easy — willekeurig

Kies uniform uit `legalShots`, gesorteerd rij-major, met één `Rng.int`. Easy gebruikt geen treffers, pariteit of logisch afgeleid water. Het actiemasker voorkomt alleen ongeldige/dubbele schoten. Daardoor vormt Easy een controleerbare baseline voor simulator en benchmark.

## Normal — hunt/target

Normal houdt een zoekmodus en een afmaakmodus aan, maar bewaart geen onherstelbare queue. Iedere beslissing reconstrueert uit de eigen schothistorie:

- Bewezen gezonken cellen volgens 05; overige treffers blijven mogelijke actieve treffers.
- Eerst legale verlengingen aan beide uiteinden van een horizontaal of verticaal aaneengesloten rij van minstens twee actieve treffers.
- Daarna legale orthogonale buren van actieve treffers.
- Als beide verzamelingen leeg zijn: alle legale cellen voor hunt.

Binnen een tier krijgen kandidaten naast de meest recente bijdragende treffer voorrang; gelijke prioriteiten worden rij-major gesorteerd en uniform gekozen. Een kandidaat die via meerdere treffers voorkomt telt één keer, met de hoogste prioriteit. De hunt-fase is volledig willekeurig. Ook bij één kandidaat verbruikt `Rng.int(1)` een draw.

Een lijn is een zoekhypothese, geen bewezen schip: bij rakende schepen kunnen aangrenzende treffers tot verschillende schepen horen. Een zinkbericht wist daarom niet het hele verbonden cluster. Bij `ship-cells` kan de bewezen complete gezonken vlootpositie wel worden verwijderd uit targetinformatie. Lengte 1 en een volledig opgebruikt targetgebied vallen vanzelf terug op hunt.

## Hard — plaatsingsdichtheid en pariteit

Hard telt plausibele individuele scheepsplaatsingen. Het resultaat is een **heuristische dichtheid**, geen exacte posterior over alle gezamenlijk mogelijke vloten en geen gekalibreerd percentage.

Voor ieder vlootexemplaar worden alle individuele plaatsingen van de passende lengte onderzocht. Een kandidaat wordt verwijderd wanneer hij:

- een bekende mis bevat, een publiek aan een ander schip toegewezen cel bevat of niet alle publiek aan dit schip toegewezen treffers bevat;
- met expliciet onthulde posities van dit schip strijdig is;
- onder de contactregel grenst aan een bekende scheepscel buiten zijn eigen cellen;
- bij reconstructie van de schothistorie al volledig geraakt zou zijn op een schot dat geen passend zinkbericht gaf; een bekend gezonken ID moet een volledige kandidaat hebben met dat zinkmoment;
- nog onbeschoten cellen bevat maar ook een bewezen gezonken cel bevat, of een publiek reeds gezonken schip-ID vertegenwoordigt.

“Passend zinkbericht” betekent hetzelfde ID wanneer bekend, anders een anoniem zinkbericht. Er wordt geen verborgen ID uit een hit-only-bericht gehaald. Bij een anoniem zinkbericht wordt niet geraden welk vloottype moet worden verwijderd. Mogelijke toewijzingen blijven bestaan; de lokale telling hoeft niet alle globale toewijzingen te enumereren. Complete kandidaten dragen geen score aan onbekende cellen bij.

Voor iedere legale cel is hunt-density het aantal resterende onvolledige kandidaten dat de cel bevat. Target-density telt alleen zulke kandidaten die ook minstens één nog niet bewezen gezonken treffer bevatten. Meervoudige kandidaten van hetzelfde type tellen afzonderlijk. Er is geen verborgen weging met de werkelijke vloot.

Selectie:

1. Als ergens target-density positief is, kies de maximale target-density.
2. Anders neem `m`, de kleinste lengte van een schip met een resterende onvolledige kandidaat. Beperk hunt tot cellen met `(row + col) mod m = 0` en positieve hunt-density, en kies daarin de maximale hunt-density.
3. Is die maskerverzameling leeg, gebruik dan alle positieve hunt-densitycellen. Bij lengte 1 is `m = 1` en is de beperking leeg van betekenis.
4. Sorteer gelijke maxima rij-major en kies uniform via de schot-RNG.

Het pariteitspatroon snijdt iedere horizontale of verticale strook van minimaal m cellen; het is een zoekheuristiek, geen reden om andere cellen als water te onthullen. Als geen enkele legale cel positieve dichtheid heeft terwijl het spel actief is, volgt `INCONSISTENT_OBSERVATION`: een echte nog niet gezonken plaatsing moet minstens één kandidaat opleveren. Dit krijgt een regressiefixture en wordt niet stil opgelost met Easy.

De heatmap bewaart de gebruikte target- of hunt-density vóór de beslissing, met de gekozen cel en algoritmeversie. Een masker/pariteitskeuze moet in de toelichting worden vermeld; scores zijn niet automatisch een probabilistische verklaring van iedere tie-break.

## Impossible — neural strategie

Impossible gebruikt dezelfde sampler, view en legal-actiongrens. Een compatibele modelinstance encodeert uitsluitend de observatie, laat de geïnjecteerde `ModelRunner` scores berekenen, maskeert ongeldige cellen en kiest de hoogste geldige score. Gelijke scores worden rij-major geordend en met de eigen schot-RNG gekozen. Niet-eindige output, verkeerde shape of geen geldig maximum is een fout.

Batch C specificeert de kanalen, shapes, normalisatie, training, maskering, toleranties en manifestselectie. De `strategySignature` alleen is onvoldoende: ook beurtconfiguratie, encoding, modelintegriteit en runtime moeten compatibel zijn. Een manifest met vier ondersteunde v1-configuraties moet die vier afzonderlijk hebben geëvalueerd. Er is geen stille Hard-fallback bij laad- of inferentiefouten.

De naam Impossible betekent moeilijk en verslaanbaar. Een model krijgt die productrol pas na de releasecriteria; een nog niet kwalificerend model blijft een experiment.

## Denkpauze en AI-inzicht

`withThinkingDelay` wordt alleen in de web-compositie aangebracht. Voorstel: een vaste minimale denktijd van 400 ms, gemeten vanaf het begin van een schotaanvraag; als berekenen langer duurt volgt geen extra wachttijd. De decorator slaapt alleen het resterende interval via `Clock.sleep`. Annulering stopt ook de pauze. Plaatsing heeft geen kunstmatige vertraging. Een instelling of reduced-motionkeuze mag de presentatiepauze verkorten zonder RNG of spelverloop te veranderen.

Benchmark en tests gebruiken de kale opponent of een fake clock. Berekening, model-loading en presentatiepauze worden afzonderlijk gemeten. Inzichtdata krijgt rij-major `rows * cols` eindige scores; reeds ongeldige cellen krijgen 0 en blijven via het opgeslagen actiemasker als uitgesloten herkenbaar. De sessie koppelt inzicht aan de view en request van vóór de commit, toont het uitsluitend na afloop en voorkomt koppeling van een stale resultaat aan een ander schot. Easy en Normal leveren geen verzonnen heatmap.

## Benchmarkprotocol

### Twee verschillende vragen

| Modus | Opzet | Uitkomst |
|---|---|---|
| Solo completion | Iedere bot schiet een identieke vooraf gesamplede vijandelijke vloot volledig leeg, met uitsluitend zijn eigen publieke feedback | Aantal eigen schoten tot alle schepen zijn gezonken; geen afgebroken verliezersruns |
| Head-to-head | Twee bots spelen volgens de volledige beurtregels; per blok tweemaal dezelfde spelersvloten, eenmaal elke starter | Winst/verlies, echte beurten, schoten en runtime |

Solo completion is een afzonderlijke benchmarkdriver voor hetzelfde schot-/feedbackcontract; hij simuleert geen eindeloze kunstmatige tegenstander die het schotenaantal beïnvloedt. Hij gebruikt de gedeelde coregeometrie en uitkomstprojectie. Head-to-head gebruikt de gewone engine en sessie. De implementatie moet de solo-feedback in fixtures vergelijken met dezelfde schoten in de echte engine. De schotgemiddelden komen uit solo, nooit uit onvoltooide head-to-headverliezers.

### Seeds, pairing en foutbeleid

Per unieke vrijgegeven regelconfiguratie en vergelijking worden 5.000 onafhankelijke vlootblokken vastgelegd. Elk blok bevat twee uniform gesamplede vloten en afzonderlijke schot-RNG-startstates. De bots houden hun eigen vloot bij het omwisselen van de starter; beide wedstrijden starten met dezelfde bijbehorende schot-RNG-state. Dat levert **10.000 wedstrijden per vergelijking per regelconfiguratie** op. De engine krijgt hiervoor de expliciete starteroverride in een benchmarkkopie van de regels; het rapport bewaart zowel de oorspronkelijke release-regelsignatuur als de twee uitvoeringssignaturen. De strategie-/modelresolver moet beide starters ondersteunen.

Solo gebruikt de twee doelvloten uit elk blok voor beide kandidaten, dus eveneens 10.000 voltooiingen per bot. Vergelijkingen delen dezelfde doelvloten en vastgelegde RNG-inputs, zonder eis dat verschillende algoritmen evenveel randomness verbruiken. CI-bootstrap behandelt de twee vloten uit één blok gezamenlijk als cluster. Training, ontwikkeling/selectie en definitieve holdout hebben verschillende seedplannen; testseeds worden niet naar de bot doorgegeven.

Een ongeldige zet, fout, timeout of contractschending faalt de run. Rapporteer het aantal, de seed, versie en reden; verwijder geen mislukte partijen uit de noemer en tel ze niet stil als verlies of winst. Per speler zijn maximaal `rows * cols` verschillende schoten mogelijk. Een lokale benchmarkwatchdog is een diagnose-/resourcegrens, geen spelregel. Waarden en hardwareprofiel worden vóór de run vastgelegd.

### Metrics en onzekerheid

Per bot en regelconfiguratie: aantal pogingen/successen/fouten; gemiddelde, mediaan, p90 en volledige frequentieverdeling van solo-schoten; head-to-head-winrate; totale duur en beslisduur. Mediaan is bij even n het gemiddelde van de twee middelste waarden. p90/p95 gebruikt de nearest-rankwaarde op index `ceil(p * n)` in een 1-based gesorteerde lijst. Verzamel geen verschillende presets in één gemiddelde dat een zwakke variant verbergt.

Voor de releasevergelijking worden 10.000 bootstrap-replicaties van de 5.000 hele blokken met teruglegging getrokken, met een afzonderlijke vastgelegde RNG. Per replicatie: gemiddelde blokwinrate en gemiddelde gepaarde solo-schotdelta kandidaat minus controle. Het 95%-percentielinterval gebruikt dezelfde nearest-rankdefinitie op 2,5% en 97,5%. Negatieve schotdelta betekent verbetering. Door hele blokken te resamplen blijven de twee starters en gepaarde vloten samen.

Dit is een vooraf gekozen benadering voor steekproefonzekerheid; het interval omvat geen modelselectiebias, runtimebugs of andere plaatsingsverdelingen. De intervallen zijn per vergelijking, geen gezamenlijke 95%-garantie over alle tests. Statistische achtergrond: [NIST over betrouwbaarheidsintervallen](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm). De concrete clusterindeling en aantallen hierboven zijn projectbeslissingen.

### Release- en promotiecriteria

| Vergelijking / poort | Vereiste op iedere betreffende vrijgegeven regelconfiguratie |
|---|---|
| Normal tegen Easy; Hard tegen Normal | Ondergrens 95%-interval head-to-head-winrate > 50%; bovengrens 95%-interval gepaarde solo-schotdelta < 0 |
| Impossible tegen Hard | Dezelfde twee voorwaarden, plus geobserveerde winrate ≥ 55% over minstens 10.000 head-to-headwedstrijden |
| Nieuw standaardmodel tegen bestaand standaardmodel | Dezelfde twee significantievoorwaarden; daarnaast behoud van alle Hard-, compatibiliteits-, export- en performancecriteria |
| Eerste modelpromotie | Hard dient als controle; er is nog geen fictieve neural champion |

De criteria gelden op de vrijgegeven v1-configuraties, niet als universele rangorde op iedere mogelijke engineconfiguratie. Een 2 × 2-bord kan bijvoorbeeld geen betekenisvol moeilijkheidsverschil toelaten. Houd algoritme/model, seeds, aantal blokken, methode en criteria vast vóór de holdout-run. Na tunen op zo'n resultaat is die set geen ongebruikte holdout meer; een volgende definitieve toets krijgt een nieuw vooraf vastgelegd seedplan.

Een korte CI-run kan 100 blokken/200 partijen per vergelijking gebruiken voor reproduceerbaarheid en regressies. Zij vervangt nooit de releasebenchmark. De runtimecheck warmt iedere klassieke strategie/runner eerst op met 20 niet meegetelde beslissingen en rapporteert daarna p50/p95 plus hardware, OS, runtime, provider, threads en git/modelversie. Laadtijd, vlootsampling, inferentie en totale beslisduur zijn afzonderlijke metrics. Node-resultaten bewijzen geen telefoonbudget; batch E legt het browserreferentieprofiel vast.

### Rapport en referentiecontrole

De toekomstige benchmark-CLI neemt een geversioneerde config met modes, kandidaten/versies, regelsets, seedplan, blokken, bootstrapseed/-aantal, watchdog en uitvoermap. Hij produceert een machineleesbaar JSON-rapport, ruwe resultaten per blok en een Markdown-samenvatting. Het rapport verwijst naar codecommit, config en volledige seedplans; deze geprivilegieerde evaluatiedata hoort niet in de productie-app. Dit is een interfacebeschrijving; er bestaat nog geen benchmarkscript.

De masterprompt noemt ongeveer 96/65/62/42 schoten als historische oriëntatie. [DataGenetics](https://www.datagenetics.com/blog/december32011/) bespreekt meerdere strategieën en medianen onder zijn eigen aannames. Deze getallen zijn geen acceptatiegrenzen en worden niet zonder gelijke regels, definities en meetmethode overgenomen.

Voor Easy bestaat een onafhankelijke analytische sanitycheck. Bij 100 cellen met 17 scheepscellen en een willekeurige permutatie van alle schoten geldt voor de laatste treffer M:

`P(M ≤ m) = C(m, 17) / C(100, 17)` en `E[M] = 17 * 101 / 18 ≈ 95,389`.

De mediaan is 97. Dit betreft eigen schoten tot voltooiing, ongeacht ligging/contactregel, omdat Easy iedere schotvolgorde uniform kiest. Het is een afleiding, geen gemeten implementatieresultaat. Een structurele afwijking in grote Easy-runs wijst op een fout in sampling, stoppen of statistiek.

## Contract- en algoritmetests

| ID | Geval | Verwachting |
|---|---|---|
| OPP-01 | Iedere bot met dezelfde geldige regels | Complete geldige plaatsing; gedeelde sampler, geen niveauafhankelijke verdeling |
| OPP-02 | Kleine uitputtelijk telbare borden met gelabelde lengte-1/-2-schepen | Alle vlootuitkomsten eenmaal in enumeratie; exact uniform theoretisch gewicht, ook bij fallback |
| OPP-03 | Zelfde view en RNG; andere verborgen vijandelijke vloot | Identieke zet/inzicht; verboden imports falen |
| OPP-04 | Ambigue clusters, anonieme sunk, ship-type-hit en ship-cells-sunk | Geen geheime ID-inferentie; Normal/Hard behouden alle niet-weerlegde hypothesen |
| OPP-05 | Niet-vierkant bord, lengte 1, aangepaste quota/contact/informatie | Geen hardcoded 10, vloot-ID of presetbranch; geldige schotkeuze |
| OPP-06 | Restore, cache leeg, cancellation en stale callback | Zelfde volgende zet bij gelijke input; geen effect van afgebroken werk |
| OPP-07 | Fake-clock met en zonder denkpauze | Zelfde schoten/RNG; alleen presentatie verandert |
| OPP-08 | Deterministische synthetische benchmarkresultaten | Correcte pairing, percentielen, foutbeleid en reproduceerbare intervallen |
| OPP-09 | Grote Easy-run tegenover analytische verdeling | Vooraf bepaalde tolerantie voor Monte Carlo-ruis; geen fixture die één toevallige sample als wet gebruikt |
| OPP-10 | Model-/runtimefout of ontbrekende compatibiliteit | Geen stille downgrade; herproberen of expliciete alternatieve keuze |

Deze geplande tests onderbouwen US-03, US-07, US-13, US-17, US-19, US-20, US-28 en US-29. De statistische releasecriteria zijn nog niet behaald: er bestaan nog geen implementatie en getraind model.
