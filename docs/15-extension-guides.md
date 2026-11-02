Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Architectuur en uitbreidingsgrenzen](04-architecture.md), [regels](02-game-rules.md), [tegenstanders](06-opponents.md), [ML](07-neural-network.md), [frontend](08-frontend.md), [design brief](09-design-brief.md), [Figma-playbook](10-figma-mcp-playbook.md), [kwaliteit](12-quality-testing.md), [ADR 0049](adr/0049-extension-scaffolding.md)

# Zelfstandig uitbreiden

Deze gidsen beschrijven de gewenste werkwijze na implementatie van de genoemde bouwstenen. De workspacegrenzen en de quick start bestaan; de domeincodepaden en uitbreidingsscripts hieronder blijven geplande contracten. De bouwtaken leveren én verifiëren ze. Een uitbreiding is pas zelfstandig uitvoerbaar bewezen wanneer de ontwikkelaar de proef zonder AI kan doen en de feitelijke diff binnen de aangegeven grenzen blijft.

## Voor elke uitbreiding

Begin bij de package-README (doel, publieke API, voorbeeld en uitbreidstappen), lees het gekoppelde contract en werk op één taakbranch volgens [AGENTS.md](../AGENTS.md). Leg vast welke publieke gedragseigenschap verandert en welke bestaande invarianten gelijk blijven. Nieuwe dependencies of een nieuw contract vragen een ADR; bestaande portimplementaties binnen het contract niet opnieuw een architectuurontwerp.

De impactgrenzen tellen handmatig gewijzigde productcode; tests, documentatie, fixtures en automatisch gegenereerde catalogi worden apart zichtbaar gerapporteerd. Dit is geen uitzondering om verborgen codewijzigingen niet te tellen. Voor de maximaal toegestane impact uit NFR-01 moet de code-diff aantonen dat core/UI niet ongemerkt meeveranderen. Een nieuwe businessregel, encoding, provider of accountfunctie valt buiten de eenvoudige extensieproeven.

| Uitbreiding | Handmatige productwijziging | Bewijs dat de grens werkt |
|---|---|---|
| Tegenstander binnen bestaande ports | Eén nieuwe module + één builtin-registratie | Engine/presentational UI ongewijzigd; registry en gedeelde tests vinden hem |
| Preset binnen enginecontract | Eén config-object + vertalingen | Ontdekt in keuzeregistry; Easy/Normal/Hard werken zonder presetbranch |
| Getraind model binnen encoding/runtime | Eén nieuwe modelmap | Manifestdiscovery en resolver werken zonder app-/corecodewijziging |
| Taal | Eén compleet locale-bestand | Taal verschijnt na build met alle keys; geen selectorwijziging |
| Scherm | Eén route-module + registratie | Navigatie/deeplink/errorguard via de bestaande router |
| Figma-component | Eén componentmodule/export + mapping; benodigde tests/specimens | Hergebruik tokens, overeenkomstige props, visueel bewijs |
| Online sessie later | Nieuwe adapters/transport en roomfeaturecompositie | Gedeelde core en presentational UI blijven ongewijzigd; zie 11 |

Een extra preset/scherm/niveau kan de vrijgegeven productinventory uitbreiden. Het extensiemechanisme staat dat technisch toe; de huidige v1-inventory uit 01/02/08 wordt alleen na productreview aangepast. Doe de extensieproeven eerst in een tijdelijke branch/fixturecatalogus, zonder demo-uitbreidingen ongemerkt mee te releasen.

## Een tegenstander of moeilijkheid toevoegen

Voorwaarden: de gedeelde Opponent-suite, builtin-catalogus, uniforme sampler en browser/benchmark-composities bestaan. Lees [het contract](06-opponents.md#tegenstandercontract) en de module-README.

1. Kies een unieke kebab-case ID en algoritmeversie. Definieer één schotstrategie, bijvoorbeeld een alternatieve hunt-keuze, binnen de bestaande RuleSet-/PlayerView-/Rng-ports.
2. Maak `packages/opponents/src/strategies/<id>/index.ts`. De module bevat algoritme, factory/descriptor en EN/NL-labels. `placeFleet` gebruikt de gedeelde uniforme sampler; alleen `chooseShot` verandert.
3. Registreer de descriptor eenmaal in de builtin-catalogus, gepland als `packages/opponents/src/catalog.ts`. De package-export ontsluit die catalogus al; geen extra deep import in web/benchmark of een tweede niveau-switch.
4. Behandel rules/view als immutable, kies alleen uit legalShots, gebruik uitsluitend de verstrekte RNG, controleer cancellation en yield via de bestaande scheduler. `supports` is synchroon en deterministisch. Laat ongeldige input herkenbaar falen; geen stille Easy-fallback.
5. Sluit de factory aan op de gedeelde contract-suite en voeg eigen strategiegevallen toe: rand/hit-ambiguïteit, einde, deterministische ties en alle ondersteunde regelvarianten. Test botviews met verschillende verborgen vijandelijke vloten.
6. Draai `pnpm test`, `pnpm lint`, `pnpm typecheck` en `pnpm benchmark:smoke`. De volledige benchmark uit 06 is nodig vóór een nieuwe moeilijkheidsclaim; een rooktest bewijst geen rangorde.
7. Controleer in de app dat beide taalnamen en compatibiliteit vanzelf verschijnen, zonder engine-/UI-edit. Werk module-README en reviewsamenvatting bij; rapporteer de exacte nieuwe module en enige registratiewijziging.

**Generatorvoorstel:** `pnpm new:opponent smart-hunt` maakt module en teststartpunt en voegt de ene registratie toe. `--dry-run` toont eerst paden/diff; zonder overschrijven, netwerk of dependencies installeren. Weiger ongeldige IDs, padtraversal, naamconflicten en dubbele registratie voordat er iets wordt geschreven. De onafgemaakte strategie faalt expliciet in haar tests; de generator beweert geen nieuwe werkende bot te leveren. Als de catalogusvorm niet herkenbaar is, stop de generator met concrete instructie voor handmatige registratie in plaats van losse tekst te beschadigen. Deze generator wordt pas tijdens de scaffoldtaak gebouwd; zie ADR 0049.

## Een regel-preset toevoegen

Voorwaarden: configdiscovery en de validator/witness uit 02 bestaan. Een preset is data, geen nieuwe TurnPolicy-implementatie.

1. Maak één object onder de geplande map `packages/game-core/src/presets/` met ID, labelkey en volledige RuleSet-data. De build/composition ontdekt configbestanden; de pure core gebruikt de resulterende registry zonder runtime-filesystemtoegang.
2. Voeg de label-/uitlegvertalingen toe volgens de bestaande EN/NL-keystructuur. Gebruik nooit de zichtbare presetnaam in de signature.
3. Controleer schema, geldigheid en plaatsbaarheid; maak een kleine expliciete witness of gebruik de bewezen equivalente configuratie. `inconclusive` is geen geldige preset om te publiceren.
4. Vergelijk canonical rulesSignature en strategySignature met bestaande presets. Gelijke semantiek geeft gelijke signatures, ook met een andere naam/JSON-volgorde. Test beide informatievrijgave en contactregel waar die verschillen.
5. Draai dezelfde Easy/Normal/Hard-contractsuite op de preset, plus schot-/beurtfixtures. Impossible wordt alleen beschikbaar met expliciet compatibel, gekwalificeerd manifest; voeg geen UI-uitzondering toe om hem toch aan te zetten.
6. Laat de keuze in een fixturecatalogus verschijnen. Voor vrijgave pas scope/regelbeschrijving en relevante AT-coverage expliciet aan; de v1-custom-editor blijft beperkt totdat die productwijziging is goedgekeurd.

Verificatie: `pnpm test`, `pnpm test:parity`, `pnpm build`; diff bevat één configobject en vertalingen, geen engine-/botbranch op preset-ID. Een nieuwe policy zoals Salvo is geen eenvoudige preset: daarvoor moeten eerst de policy, TS/Python-fixtures en het contract worden uitgebreid.

## Een getraind model toevoegen of promoveren

Lees 07 voor de concrete pipelinecommando's; deze gids herhaalt geen tweede versie daarvan. Het model moet dezelfde bekende encoding-/policy-/runtimecontracten gebruiken. Nieuwe channels/operators/providers zijn een afzonderlijke implementatie-/ADR-wijziging.

1. Train/evalueer met vastgelegde config, seeds en gescheiden dataset-/development-/releaseplannen. Bewaar W&B-run of expliciete offline-runreferentie en artefactdigests; upload geen echte gebruikerspotjes.
2. Export levert lokaal een kandidaatmap met `model.onnx`, `manifest.json` en `MODEL_CARD.md`, bestemd voor `models/<model-id>/<version>/`. Het exportdossier vermeldt eerlijk welke kwalificatie nog ontbreekt; gebruik voor browsermetingen de expliciete testcompositie uit 07. Een eenmaal gepubliceerde versie is immutable: vervang geen modelbytes onder dezelfde ID/versie. Vóór publicatie wordt het kandidaatdossier met de echte kwalificatierapporten aangevuld.
3. Controleer bestandslengte/digest, encodingvorm, mask, regels/turn-/startercompatibiliteit en exact runtimeprofiel. Laat PyTorch/ORT-Python/ORT-TS en de browserprofielen de vastgelegde numerieke én beslispariteit passeren.
4. Gebruik de developmentvergelijking om de kandidaat vast te zetten. Voer daarna de volledige holdoutbenchmark en fysieke telefoonkwalificatie uit 06/07/12 uit. Noteer ook de iPhone- en middenklasseresultaten; CPU-simulatie is geen vervanging voor de inferentie-eis.
5. Publicatievoorbereiding maakt alleen een lokale map/promotiediff. Een kandidaat blijft buiten de productie-levelkeuze. De promotieverwijzing noemt de bestaande voorganger(s) volgens het manifest; er is exact één terminale default per compatibele context.
6. Voeg uitsluitend de nieuwe modelmap toe en bouw de catalogus opnieuw. Bewaar oude modellen die nog door hervatbare checkpoints gebruikt kunnen worden. Test een nieuw spel én hervatten met de oude exacte model-/runtimeverwijzing.
7. Review manifest/modelkaart, echte rapporten en compatibiliteit. Deployment volgt de normale releaseworkflow; geen UI-code of handmatige model-switch nodig.

Verificatie: pipelinekwalificatie uit 07, `pnpm test:parity`, `pnpm build`, catalogusfoutgevallen (fork/cycle/dubbele default/digestfout) en model-load-/restoretests. De implementatiediff buiten `models/` bevat geen code-edit; gerelateerde documentatie en reportreferenties worden wel bijgewerkt. Een nieuwe modelmap mag ontbrekend kwalificatiebewijs niet maskeren.

## Een taal toevoegen

1. Kopieer de metadata-/keystructuur naar één nieuw bestand `apps/web/src/locales/<locale>.json`, bijvoorbeeld `de.json`, met schemaVersion, BCP-47-locale, nativeName en messages volgens 08.
2. Lever alle logische basiskeys uit de resulterende catalogus, inclusief modulelabels, fout-/aria-/live-teksten. Gebruik voor pluralgroepen de categorieën van de nieuwe locale volgens 08; kopieer niet blind alleen de EN/NL-suffixen. Houd de gedeclareerde interpolatievariabelen gelijk; vertaal volledige zinnen en geen HTML.
3. Run `pnpm build` en de localevalidatie binnen `pnpm test`. Ontbrekende keys/placeholders/ongeldige locale geven een fout vóór publicatie. Maak geen handmatige wijziging aan taalmenu, enum of importlijst.
4. Kies de taal tijdens een spel, herlaad en controleer spelstate/signatures/RNG. Meet lange labels op 320/390/768/1440 en controleer documenttaal/nummernotatie.
5. Test een laadfout en ontbrekend asset: bestaande taal blijft bruikbaar en er verschijnt geen rauwe key. Registreer de taal als vrijgegeven nadat de vertaling inhoudelijk is gereviewd.

Eén bestand is de volledige productwijziging; benodigde checks/docs tellen apart. Een latere nieuwe bot moet zijn vertaalcontent leveren voor alle dan vrijgegeven talen; wijzigingen in vertaalinhoud zijn expliciet onderdeel van die productreview, geen reden voor wijzigingen aan de taalselector. Voor de huidige EN/NL-extensieproef staan die basisteksten in de botmodule volgens 06.

## Een scherm toevoegen

1. Maak één route-module onder `apps/web/src/routes/<screen>/`. Zij bevat de container en uitsluitend schermspecifieke presentatie; hergebruik `packages/ui` en de publieke store. Gebruik geen private checkpointtypes of rechtstreekse Worker-/storagecalls.
2. Voeg één registratie toe aan de geplande `apps/web/src/routes/catalog.ts`: stabiele route-ID, path, lazy module en noodzakelijke guard. Een route is geen tweede bron van sessiestate.
3. Gebruik het bestaande i18n-mechanisme voor schermteksten. De impactnorm betreft module/registratie; vertaalcontent, tests en docs worden zichtbaar meegeleverd. Een extra navigatie-item wordt via die registratie beschreven, niet op meerdere plekken hardcoded.
4. Test directe URL, Back/Forward, ontbrekende sessie, lazy-loadfout, paginatitelfocus en terugkeer naar het spel. Gebruik `React.lazy` voor deze Declarative Mode, geen ongemerkt geïntroduceerde Data Router-loader.
5. Werk route-inventaris, screenmatrix en relevante acceptatiecriteria bij. Controleer de SPA-fallback op de echte statische preview en dat onbekende routes de app-404 blijven tonen.

Verificatie: componenttests, gerichte Playwright-flow, `pnpm build` en initiële JS-inventory. De productiecode-diff heeft één route-module en één registratie; bestaande spelregels/sessie/core zijn ongewijzigd.

## Een component uit Figma toevoegen

Voorwaarde: expliciet gekozen stijl, goedgekeurde tokens, echte node-URL en rechten volgens 10. Deze gids verkort de volgorde, maar vervangt de skill-/toolvoorwaarden niet.

1. Lees de componentprops en bestaande library; hergebruik wat al bestaat. Maak het design eerst als tokengebonden main component met vereiste states, met dezelfde export-/propnamen als in 09.
2. Vraag volledige `get_design_context`, variable defs en screenshot op volgens de design-to-code-skill. Sparse context wordt aangevuld met relevante child nodes; metadata of een screenshot alleen is onvoldoende implementatiebron.
3. Voeg de componentmodule aan `packages/ui` toe met publieke export. Houd domainafhankelijkheden buiten de package; geef gewone props/callbacks. Een nieuw zichtbaar label wordt door de container vertaald.
4. Gebruik tokens en correcte vector-/imageassets; geen tijdelijke Figma-URLs of designscreenshot als renderachtergrond. Bouw focus, aria, keyboard en reduced-motiongedrag mee.
5. Voeg de echte node-/code-/prop-/commitkoppeling toe aan het register in 10 en, indien beschikbaar, Code Connect. Publicatie en mapping worden alleen als voltooid aangemerkt na teruglezen/controle.
6. Vergelijk een Playwright-screenshot met dezelfde Figma-state/viewport/locale, test gedrag en lange NL-tekst, en leg afwijkingen gericht vast. Documenteer de API en het voorbeeld in de package-README.

Een visuele pixelmatch zonder werkende bediening is geen afgeronde component. Een gewijzigde prop of token verandert ook de mapping en bijbehorende states; dupliceer de component niet onder een bijna gelijke naam om dat te ontwijken.

## Verificatieproeven zonder AI

| ID | Menselijke proef na implementatie | Geslaagd als |
|---|---|---|
| EXT-01 | Maak een eenvoudige nieuwe bot met de generator of handleiding | Eén module/registratie; shared suite vindt hem; UI/engine ongewijzigd |
| EXT-02 | Voeg een benoemde semantisch equivalente preset toe in fixturecatalogus | Alleen config/vertalingen; signatures gelijk; klassieke bots blijven werken |
| EXT-03 | Voeg een reeds gekwalificeerde nieuwe modelmap toe | Nieuwe default via promotie; oud checkpoint blijft exact hervatbaar |
| EXT-04 | Voeg één volledige nieuwe locale toe | Build ontdekt taal; ontbrekende key faalt; geen codemenu-edit |
| EXT-05 | Voeg een kleine informatiepagina met route toe | Eén module/registratie; deeplink, Back en focus werken |
| EXT-06 | Bouw één nieuwe goedgekeurde Figma-component | Props/tokens/mapping kloppen; visueel en keyboard gecontroleerd |

Per proef bewaart het rapport uitgangscommit, gevolgde stappen, werkelijke diffbestanden, uitgevoerde controles en waar de handleiding niet voldoende was. Herstel de gids in dezelfde review. Verwijder tijdelijke demo-inventory na de proef tenzij die als productwijziging is geautoriseerd. De [backlog](14-backlog.md) bevat afzonderlijke taken voor de generator (T48), module-README-audit (T49) en menselijke proeven (T50–T52), met voorlopige MVP-proeven in T33.
