Status: Geaccepteerd

Versie: 1.5

Laatst gewijzigd: 2026-11-04

Gerelateerd: [Scope](01-product-vision-scope.md), [stories](03-user-stories.md), [begrippen](glossary.md), [presets-ADR](adr/0022-v1-presets.md), [signaturen-ADR](adr/0023-rule-signatures.md), [validatie-ADR](adr/0024-ruleset-validation.md)

# Spelregels en regelsets

Dit document is de normatieve bron voor regels, regeldata en de betekenis van uitkomsten. Het beschrijft het enginecontract; de UI geeft in v1 uitsluitend de verderop genoemde configuraties vrij. Engine-state, commands en events staan in [05](05-game-engine.md), zonder deze regels opnieuw te definiëren.

## Bord, vloot en coördinaten

Er zijn twee spelers, intern `player-1` en `player-2`; in v1 is de mens `player-1`. Iedere speler heeft een eigen bord met dezelfde dimensies en vlootspecificatie. Schepen zijn rechte, aaneengesloten reeksen cellen, horizontaal of verticaal. Schepen overlappen nooit; de aanraakregel bepaalt of verschillende schepen aangrenzend mogen liggen.

Intern is een coördinaat `{ row, col }`, vanaf nul. `row` groeit naar beneden, `col` naar rechts. In de UI zijn kolommen A–Z en rijen 1–26. A1 is `{ row: 0, col: 0 }`, B1 is `{ row: 0, col: 1 }` en A2 is `{ row: 1, col: 0 }`. Bij het klassieke bord is J10 `{ row: 9, col: 9 }`.

De startcoördinaat van een schip is de meest linkse of bovenste cel; de oriëntatie groeit naar rechts of beneden. Roteren wisselt horizontaal en verticaal rond die startcel. Een rotatie die buiten het bord komt is ongeldig en verschuift het schip niet ongemerkt. Een schip van lengte 1 wordt canoniek horizontaal opgeslagen om dubbele representaties te vermijden.

## Formeel datacontract

Onderstaande TypeScript-signaturen zijn specificatie, geen implementatie. `readonly` drukt de API-afspraak uit; onbekende JSON wordt daarnaast runtime gevalideerd. De TypeScript-documentatie bevestigt dat readonly op zichzelf geen runtimebescherming is: [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html), via Context7 geraadpleegd op 2026-10-31.

```ts
type PlayerId = "player-1" | "player-2";
type ContactRule = "allow" | "no-orthogonal" | "no-touch";
type HitDisclosure = "hit-only" | "ship-type";
type SunkDisclosure = "sunk-only" | "ship-type" | "ship-cells";

interface Coord {
  readonly row: number;
  readonly col: number;
}

interface ShipSpec {
  readonly id: string;
  readonly nameKey: string;
  readonly length: number;
}

interface ShipPlacement {
  readonly shipId: string;
  readonly start: Coord;
  readonly orientation: "horizontal" | "vertical";
}

interface Placement {
  readonly ships: readonly ShipPlacement[];
}

interface TurnConfiguration {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly quota:
    | { readonly kind: "fixed"; readonly count: number }
    | { readonly kind: "own-afloat" };
  readonly extraShotOnHit: boolean;
}

interface RuleSet {
  readonly schemaVersion: 1;
  readonly board: { readonly rows: number; readonly cols: number };
  readonly fleet: readonly ShipSpec[];
  readonly contactRule: ContactRule;
  readonly turn: TurnConfiguration;
  readonly information: {
    readonly hit: HitDisclosure;
    readonly sunk: SunkDisclosure;
  };
  readonly startingPlayer: "random" | PlayerId;
}

interface RuleSignatures {
  readonly rulesSignature: string;
  readonly strategySignature: string;
}

interface RuleIssue {
  readonly code:
    | "INVALID_SHAPE"
    | "INVALID_VALUE"
    | "DUPLICATE_SHIP_ID"
    | "SHIP_TOO_LONG"
    | "FLEET_TOO_LARGE"
    | "INCONSISTENT_TURN_CONFIG"
    | "NO_VALID_PLACEMENT";
  readonly path: string;
}

type RuleValidationResult =
  | {
      readonly status: "valid";
      readonly rules: RuleSet;
      readonly signatures: RuleSignatures;
      readonly witness: Placement;
    }
  | { readonly status: "invalid"; readonly issues: readonly RuleIssue[] }
  | {
      readonly status: "unsupported";
      readonly reason: "schema-version" | "turn-policy";
    }
  | { readonly status: "inconclusive"; readonly reason: "search-budget" };

declare function validateRuleSet(
  input: unknown,
  limits: { readonly maxSearchNodes: number },
): RuleValidationResult;

declare function getRuleSignatures(rules: RuleSet): RuleSignatures;
```

`nameKey` is een vertaalkey, geen vertaalde tekst of spelregel. Elk vlootexemplaar heeft een unieke `id`; twee schepen met dezelfde lengte blijven verschillende exemplaren. `Placement` is een complete vloot. De plaatsingseditor mag tijdelijk een deelverzameling bijhouden, maar een wedstrijd start uitsluitend met twee complete geldige plaatsingen.

## Beschikbare voorcontrole in T05

De [publieke game-core-API](../packages/game-core/README.md) levert `validateRuleSetSchema(input: unknown): RuleSchemaValidationResult`. Deze doorloopt de hieronder vastgelegde controles tot en met lengte en oppervlakte, maar bewijst geen plaatsbaarheid. De aanvullende typevorm is:

```ts
type RuleSchemaValidationResult =
  | {
      readonly status: "schema-valid";
      readonly rules: RuleSet;
      readonly signatures: RuleSignatures;
    }
  | Extract<RuleValidationResult, { readonly status: "invalid" | "unsupported" }>;
```

`schema-valid` staat geen spelstart toe en bevat geen witness. Het volledige `validateRuleSet` hierboven levert nu het plaatsbaarheidsbewijs. De voorcontrole geeft de eerste fout in vaste volgorde, met `$` als rootpad, punten voor velden en `[index]` voor vlootelementen; bij succes krijgt de caller een onafhankelijke kopie. `getRuleSignatures` vereist schema-gecontroleerde data, muteert niets en bewijst zelf geen geldigheid. De typed factory `createV1RuleSet(contactRule = "allow", extraShotOnHit = false)` accepteert `allow`/`no-touch` en levert verse v1-data; onbekende JSON gaat altijd eerst door de voorcontrole. Deze gefaseerde API is goedgekeurd in [ADR 0051](adr/0051-staged-rule-validation.md).

## Validatie en toegestane combinaties

Een regelset is **geldig voor gebruik** uitsluitend bij `status: valid`; schema-correct, onbekend of niet afdoende onderzocht is onvoldoende. De core heeft hiervoor geen externe dependency nodig. De grenzen hieronder zijn met batch A goedgekeurd; de v1-UI blijft beperkt tot 10 × 10.

| Onderdeel | Norm |
|---|---|
| Invoer | Eerst een JSON-object met een leesbare positieve gehele `schemaVersion` vereisen. Een onbekende versie geeft `unsupported` vóór controle tegen het v1-veldschema. Bij versie 1 uitsluitend de beschreven velden; geen impliciete defaults, coercion van strings naar getallen of stilzwijgend negeren van onbekende keys. |
| Getallen | Alle dimensies, lengtes, quotums en versies zijn eindige gehele getallen. Canonieke coördinaten normaliseren `-0` naar `0`. |
| Bord | `rows` en `cols` elk 2–26. Een toekomstig groter domein krijgt een schema-/contractreview. |
| Vloot | 1–32 schepen; unieke IDs volgens `[a-z][a-z0-9-]{0,31}`; `nameKey` volgens `ships\.[a-z][a-z0-9-]{0,31}`. |
| Lengte | Minimaal 1; maximaal de grootste borddimensie en passend in ten minste één oriëntatie. De som van lengtes mag de bordoppervlakte niet overschrijden. |
| Aanraken | `allow`: alleen overlap verboden. `no-orthogonal`: verschillende schepen mogen geen celzijde delen; diagonaal mag. `no-touch`: zijden én hoeken tussen verschillende schepen verboden. |
| Policy-identificatie | `policyId` volgt `[a-z][a-z0-9-]{0,31}`; `policyVersion` is een positief geheel getal tot en met 2.147.483.647. Een correct gevormde maar niet geregistreerde ID/versie geeft `unsupported`. |
| Beurtconfiguratie in v1 | De geregistreerde policy `fixed`, versie 1, vereist `quota.kind: fixed` en `count` van 1 tot en met de bordoppervlakte; `extraShotOnHit` is boolean. |
| Gereserveerde uitbreiding | De vorm `quota.kind: own-afloat` is bedoeld voor Salvo; `salvo` is in v1 geen geregistreerde policy en geeft `unsupported`. Een verkeerde quota bij de bekende policy `fixed` geeft `INCONSISTENT_TURN_CONFIG`. |
| Informatie en starter | Alleen de genoemde enumwaarden; beide informatiekeuzes zijn onafhankelijk, eerdere onthullingen worden niet teruggedraaid. |
| Plaatsbaarheid | Er moet een complete geldige vlootopstelling als witness bestaan. Oppervlaktecontrole alleen is niet voldoende. |

Validatie gebeurt in vaste volgorde: JSON-object en geldige schemaVersion-vorm → bekende versie → volledige v1-vorm/velden → waarden en unieke IDs → bekende en consistente beurtpolicy → eenvoudige geometrische controles → plaatsbaarheidsbewijs. Zo kan `{ "schemaVersion": 2, "futureField": true }` als `unsupported` worden herkend zonder onbekende toekomstige velden aan v1-regels te toetsen. Een ontbrekende, niet-gehele of niet-positieve schemaVersion is `invalid`. Een plaatsing wordt gecontroleerd op juiste IDs en aantallen, geldige coördinaten/oriëntatie, grenzen, overlap en contactregel. Fouten krijgen een vaste code en veldpad; UI-tekst komt uit vertalingen.

Plaatsbaarheid wordt bewezen met een gevalideerde preset-witness of een deterministische eindige zoekprocedure. De caller geeft een positief geheel `maxSearchNodes` op. Dezelfde regels en dezelfde limiet leveren dezelfde uitkomst; de zoeklimiet is een aantal knopen, geen tijdslimiet. Als de limiet vóór bewijs of uitputting wordt bereikt, volgt `inconclusive`, nooit `valid` en nooit de onjuiste claim dat geen plaatsing bestaat. De compositielaag biedt dan geen startknop. De zoekmethode en limiet staan in [05](05-game-engine.md#plaatsbaarheidsvalidatie); de vier vrijgegeven v1-combinaties hebben al een witness en behoeven geen brede zoekopdracht.

Een validator-witness is alleen een bewijs, geen willekeurige spelersopstelling. Alle niveaus en de knop Willekeurig plaatsen gebruiken dezelfde uniforme verdeling over gelabelde complete geldige vloten. RNG en sampler staan in [05](05-game-engine.md#randomness-en-seeds) en [06](06-opponents.md#uniforme-plaatsingsstrategie); willekeurig greedy plaatsen mag niet als uniform worden voorgesteld.

Willekeurig plaatsen vervangt na bevestiging de gehele conceptvloot; alleen de lege plekken vullen zou een andere, voorwaardelijke verdeling opleveren. Reset verwijdert de hele conceptvloot. Beide acties behouden regels en niveau; de computerplaatsing wordt niet aan de speler onthuld.

## V1-vloot en presets

| `id` | `nameKey` | Nederlandse naam | Lengte |
|---|---|---|---|
| `carrier` | `ships.carrier` | Vliegdekschip | 5 |
| `battleship` | `ships.battleship` | Slagschip | 4 |
| `cruiser` | `ships.cruiser` | Kruiser | 3 |
| `submarine` | `ships.submarine` | Onderzeeër | 3 |
| `destroyer` | `ships.destroyer` | Torpedobootjager | 2 |

Klassiek is volledig als volgt gedefinieerd. Preset-ID, displaynaam en vertalingen staan in registrymetadata buiten `RuleSet`.

```json
{
  "schemaVersion": 1,
  "board": { "rows": 10, "cols": 10 },
  "fleet": [
    { "id": "carrier", "nameKey": "ships.carrier", "length": 5 },
    { "id": "battleship", "nameKey": "ships.battleship", "length": 4 },
    { "id": "cruiser", "nameKey": "ships.cruiser", "length": 3 },
    { "id": "submarine", "nameKey": "ships.submarine", "length": 3 },
    { "id": "destroyer", "nameKey": "ships.destroyer", "length": 2 }
  ],
  "contactRule": "allow",
  "turn": {
    "policyId": "fixed",
    "policyVersion": 1,
    "quota": { "kind": "fixed", "count": 1 },
    "extraShotOnHit": false
  },
  "information": { "hit": "hit-only", "sunk": "ship-type" },
  "startingPlayer": "random"
}
```

Alle v1-keuzes hebben precies dit bord, deze vloot, informatievrijgave, starter en vaste quota. Alleen de volgende twee velden variëren:

| UI-keuze | `contactRule` | `turn.extraShotOnHit` |
|---|---|---|
| Klassiek (`classic`) | `allow` | `false` |
| Nog eens bij raak (`hit-again`) | `allow` | `true` |
| Ruimte tussen schepen (`spaced`) | `no-touch` | `false` |
| Aangepast (`custom`) | `allow` of `no-touch` | `false` of `true` |

De vierde unieke combinatie is `no-touch` plus `true`. Aangepast met `allow` plus `false` is speltechnisch exact Klassiek; het krijgt dezelfde signaturen. `no-orthogonal`, andere vloten, andere bordmaten, andere quotums en andere informatiekeuzes zijn onderdeel van het configureerbare enginecontract, maar krijgen geen v1-editor. Salvo wordt alleen ontworpen en later via `TurnPolicy` toegevoegd; v1 bevat geen Salvo-algoritme.

### Constructief bewijs van plaatsbaarheid

Onderstaande horizontale opstelling voldoet aan `no-touch` op 10 × 10. De schepen liggen op verschillende rijen, steeds met één volledige lege rij ertussen. Zij voldoet daarmee ook aan `no-orthogonal` en `allow`; beurt- en informatiekeuzes beïnvloeden de geometrie niet.

| Schip | Start intern | Bezette cellen |
|---|---|---|
| `carrier` | `{ row: 0, col: 0 }` | A1, B1, C1, D1, E1 |
| `battleship` | `{ row: 2, col: 0 }` | A3, B3, C3, D3 |
| `cruiser` | `{ row: 4, col: 0 }` | A5, B5, C5 |
| `submarine` | `{ row: 6, col: 0 }` | A7, B7, C7 |
| `destroyer` | `{ row: 8, col: 0 }` | A9, B9 |

De witness telt 17 verschillende bezette cellen en alle vijf vereiste IDs. Daardoor is voor elk van de vier toegestane v1-combinaties een geldige opstelling aangetoond.

## Start, beurt en afloop

Regels en niveau worden vóór plaatsing gekozen. Een wijziging na conceptplaatsing vraagt bevestiging om die plaatsing te wissen. Een begonnen wedstrijd accepteert geen regelwijzigingen; daarvoor wordt een nieuw spel gestart.

Na beide bevestigde vloten wordt de starter eenmaal geloot met de aparte starter-RNG en opgeslagen. Een expliciete `startingPlayer` slaat de loting over. De UI toont wie begint; hervatten loot niet opnieuw. Een rematch houdt regels en niveau, maar krijgt een nieuwe wedstrijd-ID en RNG-toestanden en vraagt een nieuwe plaatsing.

Bij `fixed@1` krijgt de speler aan het begin van een beurt `quota.count` schoten. Per geldig schot:

1. De engine controleert fase, actieve speler, coördinaat en of die speler het vak al beschoten heeft.
2. Een geaccepteerd schot registreert één unieke poging en verbruikt één schot uit de quota.
3. De engine bepaalt mis, raak of gezonken en projecteert alleen toegestane informatie.
4. Zijn alle schepen van de tegenstander gezonken, dan eindigt de wedstrijd meteen. Niemand schiet daarna nog.
5. Anders voegt `extraShotOnHit: true` bij raak of gezonken één schot toe. Dat geldt ook als de resterende quota zojuist nul werd; bij de v1-quota van één betekent dit opnieuw dezelfde speler.
6. Bij resterende quota nul wisselt de beurt; anders blijft dezelfde speler actief. In v1 zijn er geen tijdslimieten of passen.

De beleidspoort `TurnPolicy` gaat over de quota en spelerwisseling. `Opponent.chooseShot` blijft één coördinaat asynchroon kiezen op basis van de actuele view; herhaald aanroepen kan later meerdere schoten afhandelen. Voor toekomstige Salvo moet expliciet worden vastgelegd of nieuwe feedback tussen schoten beschikbaar is. Het huidige ontwerp reserveert **sequentiële Salvo met feedback**; gelijktijdig vooraf ingediende salvo's zijn een afzonderlijke latere keuze.

## Wat de schutter mag weten

De eigen vloot is volledig zichtbaar. Van de tegenstander zijn alleen de bordafmetingen, aanvankelijke vlootspecificatie, eigen schoten en toegestane publieke resultaten zichtbaar. Uitkomsten:

| Situatie | Openbare uitkomst |
|---|---|
| Geen schip op de cel | `miss`, met de beschoten coördinaat |
| Schip geraakt, nog niet volledig geraakt | `hit`; bij `hit-only` geen ID/type, bij `ship-type` ook het betreffende vloot-ID |
| Laatste nog ongeraakte cel van een schip geraakt | `sunk`; bij `sunk-only` alleen het feit, bij `ship-type` ook het vloot-ID, bij `ship-cells` ook alle cellen van dat schip |
| Laatste schip gezonken | De zinkuitkomst plus het publieke feit dat de wedstrijd is afgelopen en wie won |

Een zinkuitkomst telt voor quota en statistieken als treffer. Bij zinken gelden zowel de informatie die een treffer volgens `information.hit` mag geven als de toevoegingen uit `information.sunk`; een rijkere trefferinstelling wordt niet door `sunk-only` teruggedraaid. De keuze `ship-cells` omvat het vloot-ID en de volledige positie. Niet-geschoten cellen die een speler logisch kan uitsluiten, blijven onbeschoten; een inferentie telt niet als schot.

Klassiek onthult bij zinken het type, niet de volledige positie. Een trefferscluster bij rakende schepen mag dus niet volledig als dat gezonken schip worden gemarkeerd. Alleen ondubbelzinnig bekende cellen krijgen die betekenis; overige treffers blijven als niet-toegewezen treffers zichtbaar. Normal, Hard en Impossible werken met dezelfde ambiguïteit. Bij `sunk-only` mag de resterende vloot niet stilzwijgend met een geheim type worden bijgewerkt.

Na afloop mag de eindview beide vloten tonen. Een heatmap bij een eerdere beurt blijft gebaseerd op de view die vóór dat schot beschikbaar was; zij wordt niet achteraf aangepast aan de onthulde vloot. De seed waarmee de vijandelijke plaatsing is gemaakt is geen publieke informatie. De informatiegrens voor views en events staat in [05](05-game-engine.md#playerview-en-projectie).

## Stabiele signaturen

`rulesSignature` identificeert de volledige betekenis van de regels voor opslag, replay en later matchmaking. `strategySignature` groepeert het schietprobleem voor modelcompatibiliteit. Beide zijn in v1 deterministische strings, **geen cryptografische handtekeningen** en geen bewijs dat aangeleverde data betrouwbaar is.

De norm voor canonieke data:

1. Begin met een gevalideerde `RuleSet`; neem exact de semantische velden over. Verwijder `nameKey` uit ieder vlootelement; een preset-ID, UI-naam en taal maken geen deel uit van de invoer.
2. Sorteer de vloot oplopend op ASCII `id`. Sorteer alle objectkeys recursief oplopend op ASCII; behoud de vastgelegde arrayvolgorde. Serialiseer als compacte JSON zonder whitespace, met de beschreven enum-/ID-strings en gewone decimale gehele getallen.
3. De volledige payload bevat `schemaVersion`, `board`, de geprojecteerde `fleet`, `contactRule`, `turn`, `information` en `startingPlayer`. `rulesSignature` is letterlijk `rules/v1:` gevolgd door deze canonieke JSON.
4. De strategiepayload bevat alleen `board`, `fleet`, `contactRule` en `information`, met dezelfde canonicalisatie. `strategySignature` is letterlijk `strategy/v1:` gevolgd door deze canonieke JSON. De prefix versieert de betekenis van deze projectie.

Er wordt in v1 geen digest berekend; exacte canonieke strings vermijden een hashingdependency in de core en zijn controleerbaar in fixtures. Manifests hoeven de strings niet met de hand samen te stellen. De langere representatie is acceptabel voor lokale snapshots en kleine manifests; een toekomstige compacte hash krijgt een eigen geversioneerde ADR.

| Wijziging | Volledige signatuur | Strategiesignatuur |
|---|---|---|
| Taal, `nameKey`, veldvolgorde, vlootarrayvolgorde of equivalente presetkeuze | Gelijk | Gelijk |
| Starter, vaste quota of extra schot bij raak | Anders | Gelijk |
| Bord, vloot-ID/-lengte, contactregel of informatievrijgave | Anders | Anders |
| Nieuwe canonicalisatie-/projectieversie | Nieuwe prefix | Nieuwe prefix waar de projectie verandert |

Een gelijke strategiesignatuur is noodzakelijk maar niet voldoende voor modelgebruik. Het manifest moet ook de encoding, runtimevoorwaarden en toegestane beurtpolicy/-versie, quota en extra-schotvarianten dekken. Onbekende policies zijn niet automatisch ondersteund. De compatibiliteitsresolver vergelijkt gevalideerde data, niet alleen door een extern bestand opgegeven strings. De eerste modelrelease ondersteunt Klassiek; hergebruik voor Nog eens bij raak wordt per variant geëvalueerd.

## Geometrie-API

De [game-core-README](../packages/game-core/README.md#plaatsing-en-bewijs) beschrijft de uitgewerkte aanroepvoorbeelden. `validatePlacement(rules, input, complete = true)` vereist schema-gecontroleerde regels en valideert onbekende plaatsingsdata. Succes levert `{ status: "valid", placement }` met een onafhankelijke kopie; mislukking levert `{ status: "invalid", issues }`. In de expliciete gedeeltelijke modus (`complete = false`) betekent succes uitsluitend geldige draftgeometrie. De bestaande complete `Placement`-vorm verandert niet; de engine bewaakt in T08 bevestiging en spelstart.

De eerste fout volgt de invoervolgorde van schepen: vorm → bekend/uniek ID → startvorm/gehele coördinaten → oriëntatie → grenzen → overlap → contact; na alle schepen volgt compleetheid. `PlacementIssue.code` is `INVALID_SHAPE`, `UNKNOWN_SHIP_ID`, `DUPLICATE_SHIP_ID`, `MISSING_SHIP`, `INVALID_COORDINATE`, `INVALID_ORIENTATION`, `OUT_OF_BOUNDS`, `OVERLAP` of `FORBIDDEN_CONTACT`. Paden gebruiken `$`, `$.ships[index]` en waar relevant `.shipId`, `.start` of `.orientation`; ontbrekende schepen gebruiken `$.ships`. Het zijn gegevens voor vertalingen, geen gebruikerscopy.

`isWithinBoard(coord, board)` controleert gehele coördinaten en bordgrenzen. `getShipCells(ship, length)` geeft cellen zonder clipping voor geldige getypeerde scheepsdata en positieve gehele lengte. `rotateShip(ship)` retourneert een verse plaatsing met dezelfde startcel en verwisselde richting. Een caller valideert de voorgestelde draft vóór vervanging; bij afwijzing blijft de oude draft intact. Zie [ADR 0052](adr/0052-placement-validation-api.md).

## Randgevallen en referentiegevallen

RULE-01–06 staan als onafhankelijke JSON-gevallen in [plaatsingsfixtures](../fixtures/rules/placement.json) en worden in TypeScript getest; RULE-17/18 hebben expliciete bewijs-/budgettests. De [enginesuite](../packages/game-core/test/engine.test.ts) dekt RULE-07–11/19/22, met rematch als nieuwe corestate uit aangeleverde ID/randomness. De sessie- en UI-integratie van rematch blijft afzonderlijk. Overige IDs blijven referentiegevallen voor hun implementatietaken. Pythonpariteit wordt later toegevoegd.

| ID | Gegeven / actie | Verwachte uitkomst |
|---|---|---|
| RULE-01 | De bovenstaande witness onder elk van de vier v1-combinaties | Geldige complete plaatsing; 17 unieke cellen |
| RULE-02 | Op 10 × 10 een horizontaal schip van lengte 2 met start J1 | Buiten bord; vorige conceptplaatsing blijft behouden |
| RULE-03 | Twee verschillende schepen delen A1 | Ongeldig bij alle contactregels |
| RULE-04 | Verschillende schepen bezetten A1 en B1 | Alleen geldig bij `allow`, mits de rest van de vloot geldig is |
| RULE-05 | Verschillende schepen bezetten A1 en B2 | Geldig bij `allow` en `no-orthogonal`; ongeldig bij `no-touch` |
| RULE-06 | Een ship-ID ontbreekt, staat dubbel of komt niet in de vloot voor | Complete plaatsing afgewezen; wedstrijd start niet |
| RULE-07 | De actieve speler schiet op dezelfde coördinaat als eerder | Afgewezen; geen nieuwe uitkomst, teller-, quota- of RNG-wijziging |
| RULE-08 | Een inactieve speler schiet, of iemand schiet vóór start/na einde | Afgewezen; volledige state en RNG blijven gelijk |
| RULE-09 | `fixed@1`, quota 1, extra schot uit; geldige treffer | Treffer en vervolgens andere speler, behalve bij winst |
| RULE-10 | `fixed@1`, quota 1, extra schot aan; raak en daarna mis | Na raak dezelfde speler; na mis de andere speler |
| RULE-11 | Zinkend schot op het laatste vijandelijke schip met extra schot aan | Direct winst; geen extra actie of beurtwisseling meer |
| RULE-12 | Klassiek: rakende schepen met een ambigu cluster, één schip zinkt | Type bekend, geen volledige posities of geheime koppeling in de schuttersview |
| RULE-13 | Refresh na een geaccepteerd schot met succesvolle snapshot | Zelfde starter, quota, historie en volgende RNG-toestand; geen dubbel schot |
| RULE-14 | Taal-/naamkeywisseling of herschikking van velden/vloot | Beide signaturen ongewijzigd |
| RULE-15 | Alleen extra schot aan versus uit | Volledige signatuur verschilt; strategiesignatuur gelijk |
| RULE-16 | Contactregel of informatievrijgave verandert | Beide signaturen verschillen |
| RULE-17 | Schematisch correcte vloot zonder geldige plaatsing | `invalid` met `NO_VALID_PLACEMENT` na volledig bewijs; geen spelstart |
| RULE-18 | Plaatsbaarheidzoekopdracht bereikt haar knopenlimiet | `inconclusive`; geen geldigheidsclaim of spelstart |
| RULE-19 | `fixed@1`, quota 3, extra schot aan; mis, raak, mis, mis | Resterende quota 2, 2, 1, 0; daarna beurtwissel |
| RULE-20 | Bekende `fixed@1` met `own-afloat`, of onbekende policy | Respectievelijk `invalid` met configuratiefout, of `unsupported` |
| RULE-21 | Onder `hit-only` en `sunk-only` zinkt een schip | Zinkfeit zonder schip-ID; geen verborgen vermindering van een specifiek vloottype |
| RULE-22 | Rematch na einde | Zelfde regels/niveau, nieuw spel en nieuwe randomness; geen hergebruik van oude schoten |

Een ingetrokken drag/touchactie verplaatst niets. Een ongeldige schotcoördinaat, niet-geheel getal of dubbele input door snel klikken wordt afgewezen vóór stateverandering; de UI gebruikt dezelfde validatie-uitkomst als de engine. Opslagmislukking draait een geaccepteerd schot niet terug, maar toont dat alleen de vorige succesvolle snapshot hervatbaar is. De sessielaag bewaakt deze volgorde volgens [05](05-game-engine.md#checkpoints-en-async-transacties).
