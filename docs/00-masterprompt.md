Status: Geaccepteerd (aangeleverde opdracht; uitwerking per fase nog te reviewen)  
Versie: 1.0  
Laatst gewijzigd: 2026-10-31  
Gerelateerd: [Leeswijzer en voortgang](README.md)

De oorspronkelijke opdracht volgt hieronder ongewijzigd. Alleen deze metadata is toegevoegd.

<!-- BEGIN ORIGINAL MASTERPROMPT -->
# Masterprompt: projectdocumentatie voor *SinkTheShip*

## 1. Rol

Je bent een senior multidisciplinair team in één:

- **Product owner**: scope, user stories, prioriteiten
- **Software-architect**: TypeScript, React, modulaire architectuur, realtime systemen
- **ML-engineer**: PyTorch, supervised en reinforcement learning, ONNX
- **UX/UI-designer**: design systems, Figma, toegankelijkheid
- **QA-engineer**: teststrategie en kwaliteitseisen

Je schrijft voor twee lezers tegelijk: AI-coding-agents die het project taak voor taak bouwen, en een menselijke ontwikkelaar die alle code reviewt en later **zonder AI** features moet kunnen toevoegen.

## 2. Opdracht

Maak de complete projectdocumentatie (Markdown, docs-as-code in de repository) waarmee dit project stap voor stap samen met AI gebouwd kan worden: **wat** we bouwen, **hoe** het in elkaar zit, **in welke volgorde** we bouwen en **hoe** we samenwerken. Installeer en verifieer daarna, na akkoord, eerst alle MCP-servers en richt dan via die servers het takenbord in GitHub Projects en het handboek in Notion in (fase 4).

Schrijf in deze opdracht nog geen implementatiecode. Wel toegestaan: TypeScript-signaturen en interfaces, config-schema's, mappenstructuren, Mermaid-diagrammen en korte pseudocode waar dat iets verduidelijkt.

## 3. Projectcontext

- **Waarom:** de ontwikkelaar wil hands-on ervaring opdoen met neural networks, gecombineerd met webdevelopment. Het spel is het voertuig; het neural network is het leerdoel.
- **Wat:** Zeeslag (Battleship) in de browser, met twee speelvormen: tegen de computer (v1) en multiplayer (later).
- **Werkwijze:** de AI bouwt, de ontwikkelaar reviewt. Alles moet daarom begrijpelijk en reviewbaar zijn, en zo modulair dat de ontwikkelaar later zelf, zonder AI, eenvoudig features kan toevoegen.

## 4. Vastgestelde beslissingen

Deze keuzes liggen vast. Wil je ervan afwijken, doe dan een expliciet voorstel (ADR) en wacht op akkoord.

| Onderwerp | Beslissing |
|---|---|
| Frontend | React + Vite + TypeScript (`strict`) + Tailwind CSS. Tailwind sluit aan op de React + Tailwind-output van de Figma MCP |
| Repository | Monorepo met pnpm workspaces; elke bouwsteen is een eigen package |
| Game-engine | Losse, framework-vrije TypeScript-package zonder DOM-afhankelijkheden |
| Neural network | Trainen in Python met PyTorch → export naar ONNX → inferentie in de browser met ONNX Runtime Web in een Web Worker |
| Backend en hosting v1 | Geen backend: v1 is een statische webapp. Kies de host in een ADR (custom headers moeten mogelijk zijn) |
| Spelregels | De speler kiest de regels vóór het spel (presets + opties). De engine is volledig configureerbaar via een `RuleSet` |
| Tegenstanders v1 | Easy, Normal, Hard en Impossible (neural network) |
| Multiplayer | Niet in v1, maar het ontwerp moet het later eenvoudig toe te voegen maken |
| Gebruikersaccounts | Nu niet (zie 6.3) |
| Design | Figma, gegenereerd en uitgelezen via de Figma MCP-server |
| Documentatie | Technische docs (specs, ADR's, backlog-definities, `AGENTS.md`) staan in de repo en zijn leidend. Het handboek (werken met de codebase, gidsen, release notes, experimentverslagen) staat in Notion en wordt beheerd via de Notion MCP |
| Takenbord | GitHub Projects met GitHub Issues, beheerd via de GitHub MCP |
| MCP-servers | Figma, GitHub, Notion, Context7, Playwright, Chrome DevTools en Weights & Biases; wanneer je welke gebruikt staat in 13.2 |

Voorkeuren die je beargumenteerd mag vervangen via een ADR: React Router, Zustand (of een eigen store via `useSyncExternalStore`), react-i18next, Vitest + Testing Library, Playwright, fast-check, ESLint + Prettier, dependency-cruiser. Python: uv, ruff, pytest.

## 5. Aanvullende beslissingen

Ook deze punten liggen vast; voor afwijken geldt dezelfde regel als in hoofdstuk 4.

- Documentatie in het Nederlands; code, identifiers, commit messages en code-comments in het Engels.
- UI tweetalig via i18n: Engels (standaard) en Nederlands.
- Desktop en mobiel (responsive, touch), moderne evergreen browsers.
- Geen tracking, analytics of cookies van derden in v1.
- Visuele stijl nog open: het design brief stelt drie richtingen voor, de ontwikkelaar kiest.
- Projectnaam: SinkTheShip; domein: `sinktheship.com`.

## 6. Productscope

### 6.1 Release v1: speler tegen computer

Kernflow: Home → regels kiezen → moeilijkheid kiezen → schepen plaatsen → spelen → einde (statistieken, rematch, instellingen wijzigen).

| Niveau | Strategie (uitgangspunt, exact uitwerken in `06-opponents.md`) |
|---|---|
| Easy | Schiet willekeurig op nog niet beschoten vakjes |
| Normal | Hunt/target: willekeurig zoeken; na een treffer de buren afwerken en de lijn volgen |
| Hard | Probability density met pariteit: een heatmap van alle geldige plaatsingen van de resterende schepen die passen bij wat bekend is |
| Impossible | Neural network, specifiek getraind op Zeeslag |

Eisen voor alle tegenstanders:

- Ze spelen eerlijk: ze zien alleen wat een menselijke speler ziet. Dit wordt afgedwongen door de architectuur (zie 7), niet door afspraken.
- Easy, Normal en Hard werken met elke geldige `RuleSet`. Impossible alleen met regelsets waarvoor een compatibel model bestaat; anders is Impossible zichtbaar uitgeschakeld, met uitleg.
- De moeilijkheid is meetbaar: Easy < Normal < Hard < Impossible, aangetoond met een benchmark (zie 9.4).
- Wees eerlijk over de naam: ook Impossible is te verslaan, omdat geluk een rol blijft spelen. Leg dat uit op een pagina "Hoe werkt de AI?".
- Schepen plaatsen gebeurt in v1 voor alle niveaus uniform willekeurig (en geldig). Slimmere plaatsing is een idee voor later.

Prioriteiten v1 (MoSCoW, uitwerken in `01-product-vision-scope.md`):

- **Must:** spelen tegen de vier niveaus; regels kiezen; schepen plaatsen (drag & drop, roteren, willekeurig plaatsen, reset; met muis, touch en toetsenbord); uitleg van de spelregels; instellingen (taal, geluid, animaties); hervatten na een refresh; responsive; toegankelijk.
- **Should:** animaties en geluid (met respect voor reduced motion); statistieken per potje; **AI-inzicht**: na het spel of via een toggle de heatmap tonen van wat de AI dacht (Hard: kansdichtheid, Impossible: modeloutput), als showcase van het neural network.
- **Could:** lokale statistiekgeschiedenis, PWA/offline spelen, dark mode.
- **Won't (v1):** multiplayer, accounts, chat, leaderboards.

### 6.2 Later: multiplayer (ontwerpen, niet bouwen)

- **Quick play:** in een wachtrij stappen en gekoppeld worden aan een willekeurige tegenstander.
- **Private match:** een room aanmaken en delen via een link, of de room key zelf in de URL typen: `sinktheship.com/<prefix>/<roomKey>`. De prefix is één letter of een kort woord (bijvoorbeeld `/r/K7QX2M` of `/room/K7QX2M`), zodat de routes netjes blijven. Leg de keuze vast in een ADR en reserveer de routes al in de v1-router; v1 toont daar een nette "binnenkort"-pagina.
- Werk in `11-multiplayer-future.md` uit:
  - een server-autoritatief model: de server draait dezelfde `game-core`;
  - een WebSocket-protocol met getypeerde, gevalideerde en geversioneerde berichten;
  - de room-lifecycle als state machine;
  - het room-key-formaat: kort, hoofdletterongevoelig, zonder verwarrende tekens (0/O, 1/I/L) en met een verlooptijd;
  - matchmaking, reconnect via een anoniem sessietoken, turn-timers, opgeven en rematch;
  - rate limiting en anti-cheat: de server stuurt nooit schepen van de tegenstander mee vóór het einde;
  - regels: bij een private match kiest de host; quick play gebruikt eerst één standaardpreset, zodat de wachtrij niet versnippert.
- Neem een lijst **uitbreidingspunten in v1** op: welke interfaces en naden v1 al heeft, zodat multiplayer later een adapter wordt en geen herbouw.

### 6.3 Gebruikersaccounts: nu niet

- Formuleer dit in alle documenten zo: *"Gebruikersaccounts worden in v1 en de eerstvolgende releases niet gebouwd of gebruikt. Dit is een bewuste keuze voor nu; accounts kunnen in een latere release worden toegevoegd."* Schrijf nergens dat accounts er nooit komen.
- Ontwerpgevolgen: identiteit loopt via een `IdentityProvider`-interface (v1: een anonieme gast-ID, lokaal opgeslagen); er worden geen persoonsgegevens verwerkt; opslag loopt via adapters. Maak geen ontwerpkeuzes die accounts later blokkeren.

## 7. Architectuur: bouwen met bouwstenen

Modulariteit is de belangrijkste niet-functionele eis. Werk deze principes uit in `04-architecture.md`:

1. **Eén verantwoordelijkheid per bouwsteen.** Elke package heeft een publieke API via `index.ts`, een README (doel, API, voorbeeld, hoe uit te breiden) en eigen tests. Geen deep imports.
2. **Afhankelijkheden wijzen naar binnen.** `game-core` hangt nergens van af; UI, tegenstanders en adapters hangen af van de core, nooit andersom. Dwing dit automatisch af (dependency-cruiser of eslint-plugin-boundaries, plus TypeScript project references).
3. **Pure, deterministische core.** Geen DOM, geen timers, geen `Math.random()`: randomness komt binnen via een geïnjecteerde, seedbare `Rng`. Zo is elk potje reproduceerbaar voor tests, simulaties en ML-datasets.
4. **Verborgen informatie als harde grens.** Tegenstanders en UI krijgen alleen een `PlayerView`: het eigen bord volledig, het bord van de tegenstander als fog of war. De engine geeft nooit meer door. Valsspelen is daardoor technisch onmogelijk, en dezelfde grens werkt later voor een speler op afstand.
5. **Ports & adapters.** Opslag, randomness, tijd, model-runtime en (later) netwerktransport zitten achter interfaces met uitwisselbare implementaties.
6. **Registries in plaats van switch-statements.** Tegenstanders, regel-presets, modellen en talen worden geregistreerd. Toevoegen is een nieuwe module plus een registratie.
7. **Serialiseerbare state en events.** Commands gaan erin, domain events komen eruit, state is data. Dat maakt hervatten na een refresh, replays, debugging en later netwerksync mogelijk.
8. **Eén composition root.** `apps/web` koppelt alles aan elkaar; packages kennen elkaar alleen via gedeclareerde afhankelijkheden.
9. **Geen speculatieve code (YAGNI).** Multiplayer en accounts krijgen naden (interfaces) die in v1 al een functie hebben, maar geen servercode of accountcode.
10. **Leesbaarheid boven slimmigheid.** Duidelijke namen, kleine bestanden, comments die het *waarom* uitleggen, geen magie. De ontwikkelaar moet alles kunnen reviewen en zelf uitbreiden.

**Meetbare modulariteitsdoelen.** Laat in de architectuur en in de uitbreidingsgidsen zien hoe je deze haalt:

| Uitbreiding | Maximale impact |
|---|---|
| Nieuwe tegenstander of moeilijkheid | 1 nieuwe module + 1 registratie + tests; engine en UI-componenten blijven ongewijzigd |
| Nieuwe regel-preset | 1 config-object + vertalingen; engine en Easy/Normal/Hard werken direct |
| Nieuw getraind model | Een modelmap met `model.onnx` + `manifest.json` toevoegen; geen codewijziging |
| Nieuwe taal | 1 vertaalbestand |
| Nieuw scherm | 1 route-module + registratie |
| Later: online tegenstander | Een nieuwe `Opponent`-adapter + transport; engine en UI blijven ongewijzigd |

Overweeg generators voor terugkerende bouwstenen (bijvoorbeeld `pnpm new:opponent <naam>`), zodat uitbreiden zonder AI neerkomt op één commando en het invullen van de gegenereerde bestanden.

Voorstel voor de structuur (verfijn via een ADR):

```text
apps/
  web/               React-app: routes, schermen, composition root
  server/            (later) realtime en matchmaking; in v1 alleen een README met de bedoeling
packages/
  game-core/         regels, RuleSet, presets, types, engine (state machine), views; zero dependencies
  opponents/         contract-testsuite + Easy, Normal, Hard + registry
  opponent-neural/   Impossible: model-registry, observation-encoding, ModelRunner-port (web + node)
  ui/                design system: tokens + presentational components uit Figma
  benchmark/         CLI: tegenstanders tegen elkaar simuleren, metrics en rapporten
  tsconfig/          gedeelde TypeScript-configuratie
  eslint-config/     gedeelde lintconfiguratie
ml/                  Python-project (uv): simulator, datasetgeneratie, training, evaluatie, export
models/              getrainde modellen: per versie model.onnx + manifest.json + MODEL_CARD.md
fixtures/            golden test vectors, gedeeld door TypeScript en Python
docs/
```

Leg minimaal deze contracten vast als TypeScript-signaturen: `RuleSet`, `ShipSpec`, `Coord`, `Placement`, `ShotOutcome`, `TurnPolicy`, `GameState`, `GameCommand`, `GameEvent`, `PlayerView`, `Opponent`, `OpponentRegistry`, `Rng`, `StorageAdapter`, `IdentityProvider`, `ModelManifest`, `ModelRunner`.

Uitgangspunt voor het tegenstander-contract:

```ts
interface Opponent {
  readonly id: string;                                      // bv. 'easy' | 'impossible'
  supports(rules: RuleSet): boolean;                        // kan deze tegenstander met deze regels spelen?
  placeFleet(rules: RuleSet, rng: Rng): Promise<Placement>;
  chooseShot(view: PlayerView, rules: RuleSet, rng: Rng): Promise<Coord>;
  dispose?(): void;                                         // bv. een Web Worker opruimen
}
```

- `async` is bewust: zo passen een model in een Web Worker en later een speler via het netwerk in hetzelfde contract.
- Tegenstanders zijn bij voorkeur stateless (alles is af te leiden uit de view). Dat houdt hervatten en multiplayer eenvoudig.
- Zorg dat het contract later meerdere schoten per beurt (Salvo) aankan zonder breaking change.
- UX-zaken zoals een "denkpauze" horen in een decorator (bijvoorbeeld `withThinkingDelay(opponent)`), niet in het algoritme, zodat benchmarks zonder vertraging draaien.

## 8. Spelregels en regelvarianten

De speler kiest de regels vooraf. Werk dit uit in `02-game-rules.md`:

- **Een formeel `RuleSet`-schema met validatie.** Minimale parameters: bordgrootte; vloot (namen en lengtes); aanraakregel (schepen mogen raken / mogen niet raken / mogen ook diagonaal niet raken); schoten per beurt; extra schot bij raak; welke informatie de schutter krijgt bij een treffer en bij zinken (alleen "gezonken", met scheepstype, of de volledige positie); wie begint.
- **Stabiele ID's.** Elke regelset krijgt een `rulesSignature`. Die komt terug in model-manifests, opgeslagen spellen en later in matchmaking.
- **Voorstel voor v1** (bevestigen in fase 1):
  - **Klassiek:** 10×10; vloot vliegdekschip 5, slagschip 4, kruiser 3, onderzeeër 3, torpedobootjager 2; schepen mogen elkaar raken; om de beurt één schot; bij zinken hoort de schutter welk schip gezonken is.
  - **Nog eens bij raak:** Klassiek, maar na een treffer mag je meteen opnieuw schieten.
  - **Ruimte tussen schepen:** Klassiek, maar schepen mogen elkaar niet raken, ook niet diagonaal.
  - **Aangepast:** een beperkte modus die alleen bovenstaande opties combineert.
  - Later, zonder herbouw: andere bordgroottes en vloten, en Salvo (beurtvolgorde als uitwisselbare `TurnPolicy`).
- **Splits de parameters in twee groepen** en gebruik die indeling in het ML-ontwerp:
  1. *Strategie-relevant voor de schutter* (bord, vloot, aanraakregel, informatie bij zinken): kan een eigen of geconditioneerd model vereisen.
  2. *Alleen beurtvolgorde* (wie begint, extra schot bij raak): verandert de beste schietkeuze niet. Ook bij "nog eens bij raak" geldt: minder missers betekent minder schoten, dus hetzelfde model werkt.
- **Precisie.** Leg het coördinatensysteem vast (intern 0-based rij/kolom, weergave A1–J10), beschrijf alle randgevallen (dubbel schieten, ongeldige plaatsing, einde midden in een beurt) en garandeer dat elke toegestane combinatie een geldige opstelling heeft.

## 9. Neural network (Impossible)

Werk dit uit in `07-neural-network.md`. De ontwikkelaar bouwt dit deel niet zelf, maar wil het wel begrijpen. Geef daarom bij elke stap een korte uitleg in gewone taal (wat het is, waarom deze keuze, waar je bij review op let) en een paar experimenten die de ontwikkelaar zelf kan uitvoeren, zoals een laag toevoegen, hertrainen en het resultaat vergelijken in de benchmark.

### 9.1 Probleemformulering

Dit is het uitgangspunt; beargumenteerde alternatieven mag je voorstellen.

- **Fase A, supervised baseline:** voorspel per vakje de kans dat er een schip ligt, gegeven de huidige observatie.
  - Input: een tensor met kanalen voor onbekend, mis, raak en gezonken, plus informatie over de resterende schepen (en de regelparameters als het model geconditioneerd is).
  - Output: één logit per vakje. Al beschoten vakjes worden gemaskeerd; de policy kiest het vakje met de hoogste kans.
  - Labels: de echte schepenkaart.
  - Data: zelf gegenereerd met de simulator. Willekeurige geldige opstellingen, met observaties uit potjes die gespeeld worden door een mix van strategieën (random, hunt/target, density en later het model zelf).
- **Fase B, optioneel:** fine-tunen met reinforcement learning (bijvoorbeeld policy gradient of PPO, vanuit het supervised model) om direct het aantal schoten te minimaliseren. Alleen doorvoeren als de benchmark een meetbare verbetering laat zien.
- **Model:** een klein, volledig convolutioneel netwerk (CNN). Startdoelen: modelbestand ≤ 1 MB en inferentie p95 ≤ 50 ms in een Web Worker op een gemiddelde telefoon. Stel ze bij na meting.

### 9.2 Meerdere regelsets

- Vergelijk in een ADR: één model per strategie-relevante `rulesSignature`, of één model dat geconditioneerd is op de regels. Begin met Klassiek.
- Elk model heeft een `manifest.json` met id, versie, ondersteunde regelsets, input/output-specificatie, encoding-versie, trainingsconfig, metrics en datum. De app ontdekt modellen via deze manifests. Impossible is alleen beschikbaar voor regelsets die een manifest dekt.

### 9.3 Eén waarheid over regels en encoding

De spelregels bestaan zowel in TypeScript (het spel) als in Python (de training). Voorkom dat ze uit elkaar lopen:

- **Golden fixtures** in `fixtures/` (JSON) voor plaatsingsvaliditeit, schotuitkomsten en zinken, per regelset. Zowel de TS-engine als de Python-simulator moet ze in CI passeren.
- **Een observation-encoding-contract:** exacte tensorvorm, dtype, asvolgorde, betekenis van elk kanaal en oriëntatie, met een versienummer en fixtures (bord → verwachte tensor) die in beide talen getest worden.
- **Export-pariteit:** PyTorch, ONNX Runtime in Python en ONNX Runtime in TypeScript geven op de fixtures dezelfde output, binnen een vastgelegde tolerantie.
- **Eindevaluatie in TypeScript:** het geëxporteerde model draait in dezelfde benchmark-harness als alle andere tegenstanders (via een Node-implementatie van `ModelRunner`), met dezelfde seeds.

### 9.4 Benchmark en acceptatie

- Een CLI-harness speelt N potjes met vaste seeds per tegenstander en per regelset. Metrics: gemiddelde, mediaan en p90 van het aantal schoten tot winst, de verdeling, de head-to-head-winrate (afwisselend wie begint) en de beslistijd.
- Ter indicatie, uit de bekende DataGenetics-analyse (klassieke opstelling, mediaan aantal schoten): random ≈ 96, hunt/target ≈ 65, met pariteit ≈ 62, probability density ≈ 42. Meet dit na met de eigen engine.
- Acceptatie: elk niveau is statistisch significant sterker dan het vorige. Startdoel voor Impossible: minstens 55% head-to-head-winrate tegen Hard over minstens 10.000 potjes, en een lager gemiddeld aantal schoten (95%-betrouwbaarheidsinterval). Stel dit doel bij na de eerste baselinemeting.
- Een nieuw model wordt pas de standaard als het het huidige model verslaat. Leg dit promotieproces vast.

### 9.5 Pipeline en browserintegratie

- Eén commando per stap (dataset genereren, trainen, evalueren, exporteren, model publiceren), met een configbestand per experiment en vaste seeds. Zo kan de ontwikkelaar zonder AI hertrainen en vergelijken.
- Log elke run in Weights & Biases (config, metrics, modelartefact) en koppel elk model-manifest aan zijn run. Training moet ook zonder W&B-account of netwerk werken (offline-modus).
- De baseline moet op een laptop-CPU te trainen zijn. Beschrijf een GPU (bijvoorbeeld Colab) als optie.
- In de browser worden runtime en model pas geladen als Impossible gekozen wordt, met voortgang en caching. Meet de bundle-impact (de WASM-runtime kan meerdere MB zijn). Multi-threaded WASM vereist cross-origin isolation (COOP/COEP-headers); beoordeel of single-threaded volstaat.
- Faalgedrag: kan het model niet laden of is het incompatibel, toon dan een duidelijke melding en bied Hard aan. Geen stille fallback.
- Hergebruik de modeloutput (heatmap) voor de AI-inzicht-feature.

## 10. Frontend

Werk dit uit in `08-frontend.md`:

- Een route-inventaris inclusief de gereserveerde multiplayer-routes, en de schermflow als Mermaid-diagram.
- Schermen: Home (modus kiezen, multiplayer zichtbaar als "binnenkort"), regels kiezen, moeilijkheid kiezen, schepen plaatsen, spel, einde, spelregels, "Hoe werkt de AI?", instellingen en 404.
- State: de engine-state leeft buiten React en de UI abonneert zich erop. Presentational components staan in `packages/ui`, schermen en containers in `apps/web`.
- Interactie: pointer events (muis en touch), roteren (knop en toets), plaatsen en schieten met het toetsenbord, directe validatiefeedback.
- Toegankelijkheid (WCAG 2.2 AA): borden als ARIA-grid met pijltjestoetsen; uitslagen via `aria-live`; nooit alleen kleur (iconen of patronen voor mis, raak en gezonken); reduced motion; focusbeheer tussen beurten; voldoende grote touch targets (op mobiel bijvoorbeeld één bord tegelijk, met een wisselknop).
- i18n vanaf dag één: alle teksten via keys.
- Opslag via `StorageAdapter`, met een geversioneerd schema en migraties (instellingen en het lopende spel).
- Performancebudgetten met concrete waarden: initiële JS exclusief model, Lighthouse-scores, 60 fps-animaties.

## 11. Design via de Figma MCP

De designs worden gegenereerd met de **remote Figma MCP-server** (`https://mcp.figma.com/mcp`):

- Schrijven op het canvas gaat via `use_figma`. Die tool werkt via de Figma Plugin API en bouwt bij voorkeur met bestaande variabelen en componenten.
- Afbeeldingen komen erbij via `upload_assets` of `generate_image`, want `use_figma` kan zelf geen afbeeldingen toevoegen.
- Implementeren gaat via `get_design_context` (standaardoutput React + Tailwind), `get_variable_defs`, `get_screenshot`, `get_metadata` en Code Connect.
- Controleer altijd de actuele documentatie: https://developers.figma.com/docs/figma-mcp-server/

**`09-design-brief.md`**, direct bruikbaar als input voor de Figma MCP:

- **Drie stijlrichtingen**, elk met palet, typografie (fonts die in Figma beschikbaar zijn), iconografie, illustratie- en motion-principes en sfeer. De ontwikkelaar kiest er één voordat er iets gegenereerd wordt.
- **Design tokens als Figma-variabelen**: collecties voor kleur (primitives + semantisch, eventueel light/dark-modes), spacing, radius, typografie en motion. De namen mappen 1-op-1 op CSS-variabelen en het Tailwind-theme.
- **Componentinventaris** met props, varianten en states. Minimaal: Button, IconButton, Toggle, SegmentedControl, Card, Badge, Dialog, Toast, Tooltip, Board, Cell (leeg, hover, focus, mis, raak, gezonken, schip, ongeldig, uitgeschakeld), Ship (lengte 2–5, horizontaal/verticaal, states), FleetStatus, TurnIndicator, ShotLog, StatTile, HeatmapOverlay, RuleSetPicker en DifficultyPicker. **Figma-namen zijn gelijk aan de React-componentnamen; variant-properties zijn gelijk aan de React-props.**
- **Scherminventaris** met alle states (leeg, model laden, fout, winst, verlies) op mobiel (390), tablet (768) en desktop (1440), plus de prototype-flows.

**`10-figma-mcp-playbook.md`**, een stappenplan met kant-en-klare prompts per stap:

1. Setup: de remote server koppelen (`codex mcp add figma --url https://mcp.figma.com/mcp`), de Figma-skills zoals `figma-use` toevoegen (dat commando installeert ze niet; download ze uit Figma's `mcp-server-guide`-repository), de bestandsstructuur opzetten (pagina's Foundations, Components, Screens, Prototype, Archive).
2. Eerst variabelen, dan componenten, dan schermen, die alleen uit componenten worden opgebouwd. Werk in kleine stappen, review na elke stap in Figma en werk op een kopie.
3. Afbeeldingen en illustraties toevoegen.
4. Componenten publiceren (nodig voor Code Connect), design-system-regels genereren met `create_design_system_rules` en die opslaan in de repo.
5. Per component implementeren met `get_design_context` en `get_variable_defs`, met de instructie om de output aan te passen aan onze structuur en tokens (geen hardcoded waarden). Daarna de Code Connect-koppelingen leggen en het resultaat controleren met de Playwright MCP: een screenshot van het gebouwde component naast `get_screenshot` uit Figma.
6. Optioneel: de gebouwde UI terugzetten in Figma met `generate_figma_design`, voor review.

Noteer de randvoorwaarden in het playbook:

- Schrijven op het canvas vraagt een Full seat op een Professional-, Education-, Organization- of Enterprise-plan; met een Dev seat kan het alleen in drafts.
- Er gelden rate limits per plan en de functie is in bèta. Plan het werk daarom in batches.
- Code Connect en `create_design_system_rules` zijn niet op elk plan beschikbaar. Beschrijf een fallback: componentnamen en props gelijk houden en de koppeling Figma ↔ code vastleggen in een mappingtabel in de repo.

## 12. Kwaliteit

Werk dit uit in `12-quality-testing.md`:

- **Teststrategie per laag:**
  - unit tests (Vitest) en property-based tests voor de invarianten van de engine (fast-check);
  - een gedeelde **contract-testsuite** die elke `Opponent` moet passeren: nooit ongeldige schoten, respecteert de regels, deterministisch met een seed, gebruikt alleen de view;
  - fixture-pariteit TypeScript ↔ Python, ML-tests (pytest), export-pariteit en benchmark-regressie (kleine N in CI);
  - componenttests, e2e-tests (Playwright: een volledig potje tegen Easy met een vaste seed via een dev-only instelling) en a11y-tests (axe).
- **CI** (GitHub Actions): lint, typecheck, tests, build, een Python-job en de pariteitstests.
- **Verifiëren tijdens de bouw:** de Playwright MCP voor verkennend testen en visuele vergelijking met Figma; de Chrome DevTools MCP voor performance-traces (de budgetten uit hoofdstuk 10) en console- en netwerkfouten. De vaste e2e-suite blijft code (Playwright Test) die in CI draait, los van de MCP.
- Codeconventies, Conventional Commits met taak-ID, het branch- en reviewproces en een Definition of Done, inclusief de bord- en handboekupdates uit 13.3.
- Niet-functionele eisen met meetbare waarden: performance, toegankelijkheid, browsersupport, privacy, security (bijvoorbeeld CSP) en betrouwbaarheid.

## 13. Samenwerking tussen AI en ontwikkelaar

Werk dit uit in `AGENTS.md`, de instructies die Codex bij elke sessie automatisch inleest. Codex laadt samen maximaal 32 KiB aan `AGENTS.md`-bestanden (`project_doc_max_bytes`); houd het root-bestand daarom compact en verwijs naar de docs. Afspraken die maar voor één bouwsteen gelden, zet je in een eigen `AGENTS.md` in die map (bijvoorbeeld `ml/AGENTS.md`).

### 13.1 Werkafspraken

- De AI werkt aan één taak tegelijk (`T01`, `T02`, …) en leest eerst de gekoppelde documenten.
- Elke taak levert een kleine, reviewbare wijziging op, plus een **reviewsamenvatting**: wat er gebouwd is, waarom (met link naar doc of ADR), hoe je het test (commando's en handmatige stappen), waar je bij review op moet letten, welke docs zijn bijgewerkt en welke wijzigingen je op het bord en in Notion hebt gedaan.
- Geen nieuwe dependencies zonder ADR. Publieke API's alleen wijzigen samen met de README en de docs. Tests nooit afzwakken om ze groen te krijgen. Geen ongerelateerde wijzigingen.
- Zijn de docs tegenstrijdig of onvolledig, stop dan en stel een doc-wijziging voor in plaats van stilletjes af te wijken.
- Docs bijwerken hoort bij elke taak.

### 13.2 MCP-servers: welke en wanneer

| Server | Waarvoor | Wanneer |
|---|---|---|
| **GitHub MCP** (`https://api.githubcopilot.com/mcp/`) | Issues, het Projects-bord, PR's en CI-status. Zet naast de standaard-toolsets ook `projects` en `actions` aan; die staan standaard uit | Begin en einde van elke taak, bij blokkades, bij nieuw ontdekt werk en bij elke PR |
| **Notion MCP** (`https://mcp.notion.com/mcp`) | Het handboek | Na elke taak die de werkwijze, setup of uitbreidingsstappen verandert; na elk ML-experiment (verslag); bij elke release (release notes) |
| **Figma MCP** (`https://mcp.figma.com/mcp`) | Designs maken en uitlezen | In de designfase (playbook) en bij elke taak die UI bouwt of wijzigt |
| **Context7** (`https://mcp.context7.com/mcp`) | Actuele documentatie van libraries | Vóór je een API gebruikt die je niet zeker kent of die recent veranderd is, en bij elke dependency-upgrade |
| **Playwright MCP** (`npx @playwright/mcp@latest`) | De draaiende app bedienen en screenshots maken | Na elke UI-taak (flow doorlopen, vergelijken met Figma) en bij het debuggen van e2e-fouten |
| **Chrome DevTools MCP** (`npx chrome-devtools-mcp@latest`) | Performance-traces, console- en netwerkanalyse | Bij performance-taken, bij runtime-fouten en vóór elke release |
| **Weights & Biases MCP** (`https://mcp.withwandb.com/mcp`) | Trainingsruns opvragen en vergelijken | Bij elk trainings- of evaluatie-experiment en bij elke model-promotie |

Regels:

- Configureer alle servers project-scoped in `.codex/config.toml`. Codex laadt dat bestand alleen in een vertrouwde projectmap; de VS Code-extensie gebruikt dezelfde configuratie. Geen secrets in de repo: tokens lopen via omgevingsvariabelen met `bearer_token_env_var` (zoals `GITHUB_PAT`, `WANDB_API_KEY` en optioneel `CONTEXT7_API_KEY`); Notion en Figma loggen in via OAuth met `codex mcp login <naam>`. Geef servers die via `npx` starten een ruimere `startup_timeout_sec` dan de standaard 10 seconden.
- Gebruik alleen deze servers. Een nieuwe server komt er alleen bij via een ADR.
- Lees vóór je schrijft: haal de actuele versie van een issue of Notion-pagina op, zodat je geen wijzigingen van de ontwikkelaar overschrijft.
- Het bord is de enige plek voor status. Houd status nooit dubbel bij in Markdown.
- Notion legt uit en verwijst; de repo specificeert. Alles wat met de code meeverandert (paden, commando's, API's, specificaties) staat alleen in de repo; Notion linkt ernaar in plaats van het te kopiëren.
- Valt een server tijdens de ontwikkeling uit, meld dat dan, ga verder met het werk in de repo en zet de gemiste update als open punt in de reviewsamenvatting. Sla zo'n update nooit stilzwijgend over.

**Verificatie.** Test elke server bij de installatie en na elke wijziging in `.codex/config.toml` met een lezende testcall:

| Server | Testcall | Geslaagd als |
|---|---|---|
| GitHub MCP | Ingelogde gebruiker opvragen en de tools van `projects` en `actions` tonen | Je GitHub-account verschijnt en beide toolsets zijn beschikbaar |
| Notion MCP | Eigen account opvragen en de beoogde locatie van het handboek openen | De workspace en die pagina zijn zichtbaar |
| Figma MCP | `whoami` | Een Full seat op een plan dat schrijven op het canvas toestaat, en `use_figma` is beschikbaar |
| Context7 | Documentatie van React ophalen | Er komt een actueel fragment terug |
| Playwright MCP | Een pagina openen en een snapshot maken | Er komt een snapshot terug |
| Chrome DevTools MCP | Een pagina openen en de consoleberichten ophalen | Er komt console-output terug |
| Weights & Biases MCP | Je W&B-entities opvragen | Je entity verschijnt |

### 13.3 Taak-lifecycle

Bordstatussen: **Backlog → Ready → In progress → Review → Done**, plus **Blocked**. Velden: taak-ID in de titel (bijvoorbeeld `T05 · Probability-density-bot`), mijlpaal (M0–M6), type (feature / ML / design / infra / docs) en grootte (S/M/L). Elk issue bevat een korte samenvatting en een link naar de definitie in `docs/14-backlog.md`; de definitie zelf staat alleen in de repo.

1. **Start van een sessie:** lees het bord. Staat er iets op In progress of Review, maak dat dan eerst af. Pak anders de bovenste taak uit Ready waarvan alle afhankelijkheden Done zijn.
2. **Start van een taak:** zet het issue op In progress, maak een branch (bijvoorbeeld `t05-density-bot`) en lees de gekoppelde docs in de repo.
3. **Tijdens de taak:** gebruik Context7, Figma, Playwright, Chrome DevTools en W&B volgens 13.2. Bij een blokkade zet je het issue op Blocked, met een comment over de oorzaak en je vraag. Ontdek je nieuw werk, maak dan een nieuw issue in Backlog met context en pak het niet zelf op.
4. **Einde van een taak:** tests, lint en typecheck zijn groen; de repo-docs zijn bijgewerkt; de PR staat open met `Closes #<issue>`; de reviewsamenvatting staat in de PR en als comment op het issue; het issue staat op Review; het handboek in Notion is bijgewerkt als de werkwijze, setup of uitbreidingsstappen veranderd zijn.
5. **Na review en merge:** verwerk feedback in dezelfde PR. Na de merge sluit het issue en zetten de ingebouwde Projects-workflows het op Done.
6. **Na een ML-experiment:** de run staat in W&B; in Notion komt een kort verslag met de vraag, de aanpak, het resultaat en een link naar de run; bij een model-promotie wordt het manifest bijgewerkt.
7. **Einde van een mijlpaal of release:** release notes in Notion, de roadmap in de repo bijwerken en het bord opschonen.

## 14. Op te leveren documenten

| Pad | Inhoud |
|---|---|
| `README.md` | Projectoverzicht, quick start, links naar de docs |
| `AGENTS.md` | Zie 13 |
| `docs/README.md` | Leeswijzer, status per document, voortgang van deze opdracht (fase en batch), centrale lijst met open vragen en aannames, traceerbaarheidsmatrix, links naar bord, Notion-handboek, Figma en W&B |
| `docs/01-product-vision-scope.md` | Visie, doelen en niet-doelen, doelgroep, releases, MoSCoW, succescriteria, de formulering over accounts |
| `docs/02-game-rules.md` | Formele regels, `RuleSet`-schema, presets, randgevallen |
| `docs/03-user-stories.md` | User stories (`US-xx`) met acceptatiecriteria in Gegeven/Als/Dan-vorm |
| `docs/04-architecture.md` | C4-diagrammen (context, containers, componenten), modulecatalogus, afhankelijkheidsregels, contracten, uitbreidingspunten |
| `docs/05-game-engine.md` | State machine, commands, events, invarianten, serialisatie, seeds |
| `docs/06-opponents.md` | Contract, algoritme per niveau, plaatsingsstrategie, denkpauze, benchmark |
| `docs/07-neural-network.md` | Hoofdstuk 9 volledig uitgewerkt, inclusief encoding-contract, uitleg en experimenten |
| `docs/08-frontend.md` | Hoofdstuk 10 |
| `docs/09-design-brief.md` | Hoofdstuk 11 |
| `docs/10-figma-mcp-playbook.md` | Hoofdstuk 11 |
| `docs/11-multiplayer-future.md` | Paragraaf 6.2, met status "Toekomst" |
| `docs/12-quality-testing.md` | Hoofdstuk 12 |
| `docs/13-roadmap.md` | Mijlpalen en releases, inclusief een parallel ML-spoor |
| `docs/14-backlog.md` | Genummerde taken `T01` … `Tnn` |
| `docs/15-extension-guides.md` | Stappenplannen voor het toevoegen van een tegenstander, regel-preset, model, taal, scherm en component uit Figma |
| `docs/16-tooling-mcp.md` | Per MCP-server: doel, installatie en authenticatie, scope, verificatie (testcall en verwacht resultaat, zie 13.2), wanneer te gebruiken (verwijst naar `AGENTS.md`) en troubleshooting. Daarnaast de benodigde Codex-instellingen: approval-modus en netwerktoegang in de sandbox (die staat standaard uit, terwijl onder meer `pnpm install`, `gh` en `git push` netwerk nodig hebben) |
| `docs/glossary.md` | Begrippen Nederlands ↔ Engels (domein en code) |
| `docs/adr/0000-template.md` + eerste ADR's | Eén ADR per vastgestelde beslissing en per keuze die je zelf maakt |
| `.codex/config.toml` | Project-scoped Codex-configuratie met de MCP-servers, zonder secrets (zie 13.2) |
| GitHub Projects-bord | Statussen, velden en labels uit 13.3, met elke backlog-taak als issue (fase 4) |
| Notion-handboek | Hoofdpagina met links naar repo, bord, Figma en W&B; pagina's *Start hier*, *Werken met de codebase*, *Uitbreiden* (verwijst naar `docs/15-extension-guides.md`), *Beslissingen* (per ADR één regel en een link) en *Release notes*; een database *ML-experimenten* (fase 4) |

**Backlog-format per taak:** ID, titel, mijlpaal, type (feature / ML / design / infra / docs), doel, links naar docs en `US-xx`, scope (in en uit), acceptatiecriteria als checklist, afhankelijkheden, grootte (S/M/L; een taak is in één reviewsessie te overzien), testaanpak en reviewfocus. Neem ook taken op om de module-README's te schrijven en de uitbreidingsgidsen na de implementatie te verifiëren. Statussen staan niet in dit document maar op het bord (zie 13.3); vermeld per taak wel het issuenummer zodra dat bestaat.

**Roadmap (uitgangspunt):**

1. M0: fundament (repo, tooling, CI)
2. M1: game-core en regels
3. M2: Easy, Normal en Hard + benchmark
4. M3: design system in Figma
5. M4: speelbaar tegen de computer, als MVP-release met Easy t/m Hard
6. M5: ML-spoor, kan parallel starten na M1 (simulator, fixtures, dataset, baseline, evaluatie, export, integratie)
7. M6: afwerking (toegankelijkheid, i18n, geluid, AI-inzicht, performance)
8. **v1.0**
9. Later: multiplayer (private match en quick play); daarna accounts heroverwegen

**Traceerbaarheid:** requirements (`FR-xx`, `NFR-xx`) → user stories (`US-xx`) → taken (`Txx`) → tests.

## 15. Werkwijze voor deze opdracht

Werk in fasen en wacht na elke fase op akkoord.

- **Fase 0, intake:** vat je begrip samen in maximaal 10 bullets. Stel alleen vragen die echt blokkeren (maximaal 5) en ga anders verder met expliciet gemarkeerde aannames. Controleer ook welke MCP-servers uit 13.2 verbonden zijn; ontbreekt er een, geef dan de setup-stappen en ga verder met de documentatie. Vóór fase 4 moeten alle servers werken.
- **Fase 1, plan:** de documentstructuur met per document 1–2 zinnen, de lijst met ADR's, je voorstel voor de v1-regelpresets en de open vragen.
- **Fase 2, schrijven in batches.** Geef na elke batch een korte samenvatting, de genomen beslissingen en de open vragen, en werk `docs/README.md` bij.
  - A: `docs/README.md`, 01, 02, 03, glossary
  - B: 04, 05, 06 + de bijbehorende ADR's
  - C: 07
  - D: 08, 09, 10
  - E: 11, 12, 15, 16
  - F: 13, 14, `AGENTS.md`, `README.md`, `.codex/config.toml`
- **Fase 3, consistentiecheck:** controleer alle documenten op tegenstrijdigheden, ontbrekende verwijzingen en terminologie. Herstel wat nodig is en rapporteer wat je hebt aangepast.
- **Fase 4, project opzetten:**
  - **Eerst de MCP-servers.** Installeer en configureer alle servers uit 13.2 via `.codex/config.toml`. De ontwikkelaar markeert de projectmap als vertrouwd, zet de tokens als omgevingsvariabelen, logt in waar OAuth nodig is (`codex mcp login <naam>`) en start een nieuwe Codex-sessie zodat de servers geladen worden. Controleer met `codex mcp list` of in de MCP-instellingen van de extensie dat alle servers actief zijn. Verifieer daarna elke server met de testcall uit 13.2 en lever een verificatierapport (per server: status, testcall en resultaat). Ga pas verder als alle servers geslaagd zijn. Lukt een server niet, stop dan, leg uit wat er mis is en wat de ontwikkelaar moet doen, en wacht.
  - Zorg dat de GitHub-repository bestaat (vraag het na of maak hem na akkoord aan) en push de lokale commits.
  - Richt via de GitHub MCP (en waar die tekortschiet de `gh` CLI) het Projects-bord in volgens 13.3: statussen, velden, labels en mijlpalen. Maak elke backlog-taak aan als issue met de juiste status en zet de issuenummers in `docs/14-backlog.md`.
  - Controleer dat de ingebouwde Projects-workflows gesloten issues en gemergde PR's op Done zetten; vraag de ontwikkelaar ze aan te zetten als dat via de MCP niet lukt.
  - Richt via de Notion MCP het handboek in (zie hoofdstuk 14).
  - Rapporteer wat je hebt aangemaakt, met links. Pas daarna begint de bouw met de eerste taak van het bord.

**Uitvoer:** je draait in de projectmap, de root van de repository. Schrijf elk bestand direct op het pad uit hoofdstuk 14, altijd volledig (geen "…" of "rest gelijk"). Werk in git: voer `git init` uit als de map nog geen repository is, en commit na elke goedgekeurde batch, zodat de ontwikkelaar elke batch als diff kan reviewen. Sla deze prompt bij de start op als `docs/00-masterprompt.md` en houd in `docs/README.md` bij welke fase en batch af zijn. Zo kan een nieuwe Codex-sessie verdergaan door die twee bestanden te lezen, bijvoorbeeld na de herstart in fase 4.

## 16. Kwaliteitseisen voor de documenten

- Elk document begint met: status (Concept / Geaccepteerd / Toekomst), versie, datum van laatste wijziging en gerelateerde documenten.
- Concreet en toetsbaar: geen "snel" of "gebruiksvriendelijk" zonder meetbaar criterium.
- Consistente terminologie volgens de glossary: Nederlands in de docs, Engels in de code (bijvoorbeeld schip = `ship`, schot = `shot`, gezonken = `sunk`, regelset = `RuleSet`, tegenstander = `Opponent`).
- Elke keuze met onderbouwing en overwogen alternatieven (ADR). Aannames markeer je als `> Aanname:`; open vragen staan centraal in `docs/README.md`; geen losse "TBD".
- Diagrammen in Mermaid, contracten als TypeScript-signaturen, vergelijkingen in tabellen.
- Zo kort als kan, zo volledig als nodig. Geen marketingtaal.

## 17. Zelfcontrole vóór afronding

- [ ] Elke `FR` heeft minstens één user story, taak en test.
- [ ] Elke taak verwijst naar docs en heeft acceptatiecriteria.
- [ ] Elke bouwsteen in de modulecatalogus heeft een verantwoordelijkheid, publieke API, afhankelijkheden en uitbreidingspunten.
- [ ] De modulariteitsdoelen uit hoofdstuk 7 zijn aantoonbaar gehaald in de uitbreidingsgidsen.
- [ ] De compatibiliteit tussen regelsets, tegenstanders en modellen is eenduidig.
- [ ] Het encoding-contract en de fixtures zijn gedefinieerd en worden in beide talen getest.
- [ ] Accounts staan overal als "nu niet, later mogelijk", nergens als "nooit".
- [ ] Multiplayer: routes gereserveerd, uitbreidingspunten benoemd, geen speculatieve multiplayercode in de v1-backlog.
- [ ] Het design brief bevat tokens, componenten (met varianten en states) en schermen (met states en breakpoints), met namen gelijk aan de code.
- [ ] `AGENTS.md` bevat per MCP-server een duidelijk moment van gebruik en de taak-lifecycle met bordstatussen.
- [ ] Alle MCP-servers uit 13.2 zijn geïnstalleerd, aangesloten en geverifieerd voordat het bord en het handboek zijn ingericht.
- [ ] Elke backlog-taak bestaat als issue op het bord, met een link naar de definitie in de repo.
- [ ] Het Notion-handboek linkt naar repo, bord, Figma en W&B en kopieert geen specificaties.
- [ ] Er zijn geen tegenstrijdigheden tussen documenten.

Begin met fase 0.