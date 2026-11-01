Status: Geaccepteerd

Versie: 1.3

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Scope](01-product-vision-scope.md), [spelregels](02-game-rules.md), [stories](03-user-stories.md), [leeswijzer](README.md)

# Begrippen Nederlands ↔ Engels

Gebruik Nederlands in documentatie en Engels in code, identifiers, comments en commits. Een code-identifier blijft ook in Nederlandse tekst Engels. Hieronder staan de geaccepteerde begrippen uit batches A–C; de exacte ML-definities staan in document 07. Versie 1.3 voegt de goedgekeurde frontend-/designbegrippen uit batch D toe.

| Nederlands | Engels / code | Betekenis |
|---|---|---|
| Zeeslag | Battleship | Het speltype; de productnaam blijft SinkTheShip. |
| Bord | board | Rechthoekig raster van één speler. |
| Rij | row | Horizontale reeks cellen; index groeit omlaag vanaf 0. |
| Kolom | column / `col` | Verticale reeks cellen; index groeit naar rechts vanaf 0. |
| Coördinaat | coordinate / `Coord` | `{ row, col }`; UI-kolommen A–Z, rijen 1–26. |
| Cel / vak | cell | Eén bordpositie; gebruik cel in specificaties. |
| Schip | ship / `ShipSpec` | Eén uniek benoemd vlootexemplaar met lengte; gelijke lengtes hoeven geen gelijk ID te hebben. |
| Vloot | fleet | De volledige verzameling vereiste schepen van een speler. |
| Plaatsing | placement / `Placement` | Complete vloot met positie en oriëntatie per schip. |
| Conceptplaatsing | draft placement / `PlacementDraft` | Nog bewerkbare, mogelijk onvolledige vloot in de editor. |
| Oriëntatie | orientation | `horizontal` naar rechts of `vertical` naar beneden vanaf de startcel. |
| Aanraakregel | contact rule / `ContactRule` | Overlap is altijd verboden; de regel bepaalt zij-/hoekcontact tussen verschillende schepen. |
| Opstellingsbewijs | witness | Eén gecontroleerde geldige complete plaatsing die aantoont dat een regelset plaatsbaar is. |
| Uniform willekeurig | uniform random | Iedere complete geldige gelabelde vloot heeft dezelfde kans; willekeurig kiezen per schip bewijst dit niet. |
| Regelset | rule set / `RuleSet` | De volledige semantische spelregels, los van UI-namen en vertalingen. |
| Preset | preset | Een geregistreerd benoemd config-object; Aangepast kan equivalent zijn aan zo'n preset. |
| Volledige regelsignatuur | `rulesSignature` | Geversioneerde canonieke representatie van alle semantische spelregels. |
| Strategiesignatuur | `strategySignature` | Geversioneerde projectie van bord, vloot, contactregel en informatievrijgave voor het schietprobleem. |
| Canonicalisatie | canonicalization | Vastleggen van velden, sortering en serialisatie zodat equivalente data dezelfde string oplevert. |
| Speler | player / `PlayerId` | `player-1` of `player-2`, los van gastidentiteit of besturing. |
| Gastidentiteit | guest identity / `IdentityProvider` | Lokale anonieme identiteit achter een vervangbare port; geen spelbord of spelersslot. |
| Wedstrijd / potje | match / game | Eén plaatsings-/speelcyclus met eigen regels, state en winnaar. |
| Sessie | session | Coördinatie van één lokaal of later remote spel, views, acties, async werk en opslag. |
| Beurt | turn | Periode waarin één speler één of meer schoten mag doen. |
| Schotquota | shot quota | Het aantal toegestane resterende schoten binnen de huidige beurt. |
| Beurtbeleid | turn policy / `TurnPolicy` | Beslist quota en beurtwisseling; kiest geen schotcoördinaat. |
| Beurtconfiguratie | `TurnConfiguration` | Serialiseerbare instellingen voor een geversioneerde beurtpolicy. |
| Salvo | salvo | Toekomstige beurtvariant met meerdere schoten; het plan reserveert sequentiële schoten met feedback. |
| Schot | shot | Eén geaccepteerde poging op een nog niet door die speler beschoten cel. |
| Schotuitkomst | shot outcome / `ShotOutcome` | Mis, raak of gezonken, plus uitsluitend de toegestane onthullingen; contract in document 05. |
| Mis | miss | Een geaccepteerd schot op water. |
| Raak / treffer | hit | Een schot op een nog ongeraakte scheepscel; een zinkend schot telt ook als treffer. |
| Gezonken | sunk | Alle cellen van één schip zijn geraakt; welke posities de schutter kent is een afzonderlijke vraag. |
| Onbekend | unknown | Niet beschoten en niet rechtstreeks onthuld; een kansinschatting is geen onthulling. |
| Spelstate | game state / `GameState` | Volledige interne seriële toestand, inclusief informatie die niet in een spelersview mag komen. |
| Spelersview | player view / `PlayerView` | Eigen bord volledig en tegenstander volgens toegestane informatie; geen globale state. |
| Verborgen informatie | hidden information / fog of war | Informatie die een speler nog niet volgens de regels mag ontvangen. |
| Publieke observatie | observation | Beschikbare informatie van één schutter op een bepaald moment; input voor bot en encoder. |
| Command | `GameCommand` | Verzoek om een actie; kan worden afgewezen zonder statewijziging. |
| Gebeurtenis | domain event / `GameEvent` | Vastgelegd gevolg van een geaccepteerde actie; interne en publieke payloads kunnen verschillen. |
| Momentopname | snapshot | Vastgelegde toestand op één moment; `SessionSnapshot` is de publieke sessieweergave, een checkpoint bevat private hervatdata. |
| Hervatpunt | checkpoint | Geversioneerde private game-state, RNG-stromen, controller-/modelversies, receipts en eventuele inzichtdata. |
| Publieke gebeurtenis | `PublicGameEvent` | Gefilterd event met uitsluitend toegestane payload en een publiek herleidbaar ID. |
| Requestbewijs | receipt | Opgeslagen request-ID, intentinhoud en revision om herhaalde verwerking te voorkomen. |
| Annulering | cancellation / `Cancellation` | Signaal om onafgemaakt werk te stoppen; stale resultaten worden ook bij late reactie genegeerd. |
| Replay | replay | Dezelfde beginsituatie en commandvolgorde opnieuw uitvoeren met dezelfde versies en randomness. |
| Tegenstander | opponent / `Opponent` | Strategie die via publieke contracten acties kiest. |
| Register | registry | Verzameling modules of configuraties die via IDs worden gevonden. |
| Willekeurigheidsbron | random number generator / `Rng` | Geïnjecteerde seedbare bron; private plaatsingsrandomness wordt niet aan de schutter doorgegeven. |
| Startwaarde | seed | Invoer voor een reproduceerbare RNG; niet gelijk aan zijn volledige huidige toestand. |
| Port / adapter | port / adapter | Een port beschrijft een grens; een adapter implementeert die voor bijvoorbeeld opslag of model-runtime. |
| Composition root | composition root | De plek in `apps/web` die modules, registries en adapters samenvoegt. |
| Opslagadapter | `StorageAdapter` | Vervangbare opslaggrens voor lezen, bewaren en verwijderen; migraties worden expliciet geversioneerd. |
| Kansdichtheid | probability density | Hard-score gebaseerd op plaatsingen die bij observaties passen; niet vanzelf een gekalibreerde kans. |
| Pariteit | parity | Zoekpatroon dat rekening houdt met de lengtes van resterende mogelijke schepen. |
| Zoek-/afmaakstrategie | hunt/target | Eerst zoeken; na een treffer kandidaten rondom bekende treffers onderzoeken. |
| Heatmap | heatmap | Weergave van scores per cel; bevat legenda en mag geen extra verborgen informatie gebruiken. |
| Neural network | neural network | Trainbaar model dat uit observaties bruikbare scores leert. |
| CNN | convolutional neural network | Netwerk met convolutionele lagen dat de ruimtelijke structuur van het bord benut. |
| Tensor | tensor | Meer-dimensionale getallenarray; vorm, dtype en assen horen bij het encoding-contract. |
| Encoder | observation encoder | Zet uitsluitend de beschikbare observatie om naar modelinput. |
| Logit | logit | Ruwe modelscore vóór een eventuele omzetting naar kans. |
| Actiemasker | legal-action mask | Markering van cellen waarop volgens de huidige view geschoten mag worden. |
| Dilation | dilation | Afstand tussen filterpunten in een convolutie; vergroot het contextbereik zonder extra gewichten. |
| Ontwikkelset | development set | Data voor modelvergelijking en experimentselectie; niet de definitieve holdout. |
| Holdout | release holdout | Vooraf afgezonderde evaluatieset die geen training, early stopping of modelselectie heeft gestuurd. |
| Numerieke pariteit | numerical parity | Outputs vallen per waarde binnen vooraf bepaalde toleranties. |
| Beslispariteit | decision parity | Dezelfde input en RNG leveren dezelfde gekozen actie én volgende RNG-state. |
| Label | label / target | Gewenst trainingsantwoord, bijvoorbeeld de echte schepenkaart; geen toegestane modelinput. |
| Supervised learning | supervised learning | Leren uit invoer met bekende labels. |
| Reinforcement learning | reinforcement learning | Optioneel vervolg waarin beleid leert uit beloning; alleen na gemeten verbetering. |
| Runtimeprofiel | runtime profile / `RuntimeProfile` | Exacte inferentieruntime, provider, flags en assetset waarvoor het model is gekwalificeerd. |
| Modelmanifest | `ModelManifest` | Geversioneerde metadata over artefact, compatibiliteit, encoding, training en evaluatie. |
| Modeluitvoerder | `ModelRunner` | Runtimeport voor dezelfde modelinterface in browser en Node. |
| Modelkaart | model card / `MODEL_CARD.md` | Menselijke toelichting op doel, trainingsdata, beperkingen en evaluatie van een model. |
| Modelpromotie | model promotion | Een getoetste kandidaat expliciet tot nieuwe standaard maken. |
| Golden fixture | golden fixture | Gedeeld geval met vastgelegde invoer en verwachte uitvoer, gebruikt in TS en Python. |
| Pariteit tussen runtimes | export parity | Overeenkomst tussen modeloutputs binnen een vooraf vastgelegde tolerantie. |
| Benchmark | benchmark | Reproduceerbare vergelijking met gelijke omstandigheden en vastgelegde metrics. |
| Blokbootstrap | block bootstrap | Herhaald trekken van volledige gepaarde benchmarkblokken; de twee starters blijven samen. |
| Head-to-head | head-to-head | Twee tegenstanders in een volledige wedstrijd vergelijken, met gebalanceerde starter. |
| p90 / p95 | percentile | Grens waaronder 90% / 95% van de gemeten waarden ligt; niet het gemiddelde. |
| Betrouwbaarheidsinterval | confidence interval | Statistische onzekerheidsmarge volgens een vooraf gekozen methode. |
| Requirement | `FR-xx` / `NFR-xx` | Functionele eis of kwaliteitsnorm; de definitie staat in document 01. |
| User story | `US-xx` | Een gebruikers-/ontwikkelaarsdoel met toetsbare acceptatiecriteria. |
| Acceptatietest | `AT-xx-yy` | Gegeven/Als/Dan-definitie in document 03; pas later uitvoerbare testcode of menselijke controle. |
| Taak | `Txx` | Reviewbare eenheid werk in de backlog; uitvoeringstatus staat alleen in GitHub Projects. |
| Architectuurbesluit | ADR | Afgebakend besluit met context, alternatieven, gevolgen en verificatie. |
| Publieke view-store | external view-store | React-onafhankelijk abonnement op toegestane snapshots; bevat geen private checkpointdata. |
| Verplaatsbare bordfocus | roving tabindex | Eén tabstop per bord; pijltjes verplaatsen de focus binnen het grid. |
| Live-melding | live region | Vooraf aanwezige statusregio die nieuwe publieke uitkomsten voor hulpmiddelen aankondigt. |
| Opslagmigratie | schema migration | Expliciete omzetting van een ondersteunde oudere recordversie, gevolgd door inhoudelijke validatie. |
| Schrijvende tab | session writer | De tab die de exclusieve sessielock bezit en het actieve checkpoint mag bijwerken. |
| Locale-bestand | `LocaleFile` | Geversioneerde taalmetadata en vertaalkeys; automatisch gevonden bij de build. |
| Ontwerptoken | design token | Benoemde atomaire kleur-/maat-/stijlwaarde, als Figma-variable en overeenkomstige CSS-variable. |
| Semantisch token | semantic alias | Token voor een gebruiksrol, bijvoorbeeld content of action, dat naar een primitive verwijst. |
| Componentvoorbeeld | specimen | Reviewweergave van een componentstate; hoeft geen extra publieke React-prop te betekenen. |
| Design-codemapping | design-code mapping | Vastgelegde relatie tussen een Figma-node en code-export, props, commit en verificatie. |
| Werk-kopie | working copy | Afzonderlijk Figma-bestand/draft voor gecontroleerde wijzigingen vóór publicatie. |

## Eenheden en schrijfafspraken

- `1 MB` voor het modelbudget betekent 1.000.000 bytes; `1 KiB` voor het JS-budget betekent 1.024 bytes.
- `ms` is milliseconde; `fps` is beelden per seconde; CSS-pixels zijn layout-eenheden, geen fysieke schermpixels.
- Een schotenteller telt geaccepteerde schoten. Afgewezen invoer is geen schot en verandert geen statistiek.
- Trefpercentage = treffers / geaccepteerde schoten × 100; bij nul schoten wordt 0% getoond. Een gezonken schip telt niet als extra treffer bovenop het zinkende schot.
- `valid`, `invalid`, `unsupported` en `inconclusive` zijn verschillende validatie-uitkomsten. Alleen `valid` staat spelstart toe.
- In documenten is “geregistreerd” niet gelijk aan “beschikbaar”: een neural tegenstander kan geregistreerd zijn maar wegens incompatibiliteit uitgeschakeld blijven.
