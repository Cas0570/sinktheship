Status: Geaccepteerd

Versie: 0.4

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Masterprompt](00-masterprompt.md)

# SinkTheShip — leeswijzer en voortgang

Dit bestand is het hervatpunt voor de documentatieopdracht. Lees eerst de [masterprompt](00-masterprompt.md), daarna deze leeswijzer. Technische specificaties staan in de repository; het toekomstige Notion-handboek legt de werkwijze uit en verwijst ernaar. GitHub Projects wordt de enige bron voor de status van implementatietaken. De onderstaande voortgang betreft uitsluitend deze documentatieopdracht.

## Fase 0: begrip van de opdracht

- Het leerdoel is neural networks begrijpen door een browsergame te bouwen. De AI werkt taak voor taak; de ontwikkelaar reviewt en moet later zelfstandig kunnen uitbreiden.
- De huidige opdracht levert volledige Nederlandstalige docs-as-code, contracten, ADR's, een roadmap en een traceerbare backlog. Implementatiecode valt buiten deze opdracht.
- De vaste basis is React, Vite, strict TypeScript en Tailwind in een pnpm-monorepo; v1 is een statische app zonder backend. Code, identifiers, comments en commits zijn Engels.
- Een configureerbare, deterministische `game-core` zonder dependencies vormt het centrum. `PlayerView`, geïnjecteerde randomness, ports, adapters en registries bewaken eerlijk spel en modulariteit.
- V1 biedt regelkeuze en Easy, Normal, Hard en Impossible. De eerdere MVP bevat Easy tot en met Hard. De UI is Engels en Nederlands, responsive, toegankelijk en hervatbaar na een refresh.
- Impossible wordt met PyTorch getraind, naar ONNX geëxporteerd en in een Web Worker uitgevoerd. Compatibele regelsets, gedeelde fixtures, export-pariteit en meetbare benchmarkresultaten zijn acceptatievoorwaarden; betere prestaties worden niet vooraf als bewezen beschouwd.
- Multiplayer wordt alleen ontworpen, met gereserveerde routes en bruikbare uitbreidingspunten. Gebruikersaccounts worden in v1 en de eerstvolgende releases niet gebouwd of gebruikt. Dit is een bewuste keuze voor nu; accounts kunnen in een latere release worden toegevoegd.
- We werken in fasen met akkoordmomenten. Na de documentatie en consistentiecheck worden eerst alle zeven MCP-servers geverifieerd en daarna het GitHub Projects-bord en Notion-handboek ingericht. Bouwen begint pas daarna.

## Voortgang en hervatten

| Onderdeel | Voortgang van de documentatieopdracht |
|---|---|
| Fase 0 — intake | Goedgekeurd door de ontwikkelaar op 2026-10-31 |
| Fase 1 — plan | Goedgekeurd door de ontwikkelaar op 2026-10-31 |
| Fase 2 — batches A–F | Nog niet gestart |
| Fase 3 — consistentiecheck | Nog niet gestart |
| Fase 4 — MCP-verificatie, bord en handboek | Nog niet gestart |

De ontwikkelaar heeft fase 1 op 2026-10-31 goedgekeurd. Volgende actie: batch A schrijven. Tijdens fase 2 na iedere batch deze leeswijzer bijwerken en de batch ter review aanbieden; pas na goedkeuring committen en de volgende batch starten. Dit plan keurt de latere uitgewerkte ADR's en specificaties niet vooraf goed.

Beginsituatie: bestaande Git-repository op branch `main`, zonder commits, zonder geconfigureerde remote en zonder projectbestanden. `git init` was niet nodig. De goedgekeurde fase 0 staat in commit `7799fc8` (`docs: record approved SinkTheShip intake`). De goedgekeurde fase 1 wordt als afzonderlijke commit vastgelegd. Er zijn geen dependencies geïnstalleerd, MCP-configuraties gewijzigd of externe projectgegevens aangemaakt.

## Documentinventaris en plan voor fase 1

Alle paden hieronder zijn relatief aan de repositoryroot. Alleen de twee gelinkte bestanden bestaan al; de andere paden zijn geplande leveringen, geen lege documenten. Elk document krijgt status, versie, wijzigingsdatum en gerelateerde documenten. `docs/11-multiplayer-future.md` krijgt status **Toekomst**; nieuwe uitwerkingen beginnen als **Concept**.

| Document | Documentstatus | Toelichting |
|---|---|---|
| [00-masterprompt.md](00-masterprompt.md) | Geaccepteerd als opdracht | Volledige originele opdracht, voorafgegaan door metadata |
| [README.md](README.md) | Concept | Goedgekeurde intake en goedgekeurd plan voor fase 1 |

### Documentstructuur

| Pad | Batch | Inhoud en afbakening |
|---|---|---|
| `README.md` | F | Projectoverzicht, leerdoel, releasegrenzen en ingang naar de technische docs. De quick start maakt onderscheid tussen beschikbare commando's en stappen die pas na implementatie werken. |
| `AGENTS.md` | F | Compacte werkinstructies met taak-lifecycle, reviewregels, verplichte MCP-momenten en verwijzingen naar de specificaties. De aangeleverde Context7-regel blijft behouden: actuele docs raadplegen bij library- en platformafhankelijke werkzaamheden. |
| `docs/00-masterprompt.md` | Intake | Ongewijzigde bronopdracht met metadata. Eventuele latere afwijkingen worden expliciet in een goedgekeurde ADR vastgelegd. |
| `docs/README.md` | A; iedere batch bijwerken | Leesroutes, documentstatussen, voortgang van deze opdracht, open punten, aannames, traceerbaarheid en externe projectlinks. Deze pagina houdt geen implementatietaakstatussen bij. |
| `docs/01-product-vision-scope.md` | A | Leer- en productdoelen, doelgroep, MVP versus v1.0, MoSCoW en meetbare succescriteria. Hier staan de requirements met stabiele `FR-xx`- en `NFR-xx`-IDs en de voorgeschreven formulering over accounts. |
| `docs/02-game-rules.md` | A | Formeel `RuleSet`-schema met validatie, presets, coördinaten, informatievrijgave, beurtregels en foutgevallen. Onderscheid tussen toegestane v1-keuzes en de uitbreidbaarheid van het schema; geldige vlootplaatsing moet aantoonbaar mogelijk zijn. |
| `docs/03-user-stories.md` | A | `US-xx`-stories met Gegeven/Als/Dan-criteria en requirementverwijzingen. Ook toetsenbordbediening, hervatten, modelproblemen, instellingen en toekomstige routes worden afgedekt. |
| `docs/04-architecture.md` | B | C4-context-, container- en componentdiagrammen in Mermaid, packagecatalogus, importgrenzen, ports en composition root. Alle gevraagde contracten krijgen een vindplaats; de modulariteitsdoelen worden gekoppeld aan concrete uitbreidingspunten. |
| `docs/05-game-engine.md` | B | State machine, commands, events, invarianten, beurtverloop, seeds en geversioneerde serialisatie. Beschrijft ook foutafhandeling, einde midden in een beurt en de projectie naar `PlayerView`. |
| `docs/06-opponents.md` | B | Algoritmen en contractvoorwaarden voor Easy, Normal, Hard en de neural adapter; inclusief uniforme plaatsing, zichtbare informatie, determinisme en denkpauzes. De benchmark definieert seeds, meeteenheden, statistiek en rapportage. |
| `docs/07-neural-network.md` | C | Supervised baseline, mogelijke RL-vervolgstap, dataset, exact encoding-contract, manifest, modelkeuze en browserintegratie. Bevat begrijpelijke uitleg, reviewpunten, reproduceerbare experimenten, W&B/offline-werkwijze, pariteitstoleranties en promotiecriteria. |
| `docs/08-frontend.md` | D | Route-inventaris en schermflow, externe state, interactie met muis/touch/toetsenbord, i18n en opslagmigraties. Behandelt loading-, fout- en herstelstates, AI-inzicht en de toepassing van de centrale performancebudgetten. |
| `docs/09-design-brief.md` | D | Drie stijlrichtingen ter keuze, tokens en volledige componentinventaris met props, varianten en states. Alle schermen en prototype-flows worden beschreven op 390, 768 en 1440 pixels; naamgeving sluit aan op React. |
| `docs/10-figma-mcp-playbook.md` | D | Uitvoerbare prompts voor setup, variabelen, componenten, schermen, assets, implementatie en visuele verificatie. Beschrijft seats, rechten, batches, skills, Code Connect en een mappingtabel als fallback. |
| `docs/11-multiplayer-future.md` | E | Toekomstontwerp voor serverautoriteit, getypeerd en geversioneerd WebSocket-protocol, room-state-machine, matchmaking en reconnect. Legt room keys, timers, opgeven, rematch, anti-cheat en de reeds nuttige v1-interfaces vast zonder servercode te plannen voor v1. |
| `docs/12-quality-testing.md` | E | Testmatrix per laag, CI, fixture- en export-pariteit, accessibility, browserondersteuning, privacy, beveiliging en betrouwbaarheid. Is de centrale specificatie voor meetbare kwaliteitsbudgetten en de Definition of Done. |
| `docs/13-roadmap.md` | F | M0–M6, MVP, v1.0 en latere releases met afhankelijkheden en releasevoorwaarden. Het ML-spoor kan na M1 starten; de definitieve evaluatie gebruikt de benchmark uit M2. |
| `docs/14-backlog.md` | F | Kleine, genummerde taken met het volledige gevraagde taakformat, dependencies, reviewfocus, tests en links naar requirements en stories. Bevat ook module-README's en verificatie van uitbreidingsgidsen; issuenummers volgen in fase 4, taakstatussen blijven op het bord. |
| `docs/15-extension-guides.md` | E | Stappenplannen voor tegenstander, preset, model, taal, scherm en Figma-component. Per uitbreiding staat welke bestanden veranderen, welke controles nodig zijn en hoe de maximale impact uit de masterprompt wordt getoetst. |
| `docs/16-tooling-mcp.md` | E | Setup, authenticatie, projectscope, testcall, verwacht resultaat en troubleshooting per vereiste MCP-server. Behandelt tevens Codex-approvalinstellingen, sandboxnetwerk, trust, herstart en het verificatierapport voor fase 4. |
| `docs/glossary.md` | A | Nederlands-Engelse domeintermen en bijbehorende code-identifiers. Onderscheidt onder meer spel, beurt, schot, treffer, gezonken schip, observatie, signatuur en modelcompatibiliteit. |
| `docs/adr/0000-template.md` | A | Template met context, besluit, alternatieven, gevolgen en verificatie, plus documentmetadata. Elke ADR vermeldt of het besluit uit de masterprompt komt of een nieuw voorstel is. |
| `docs/adr/NNNN-<onderwerp>.md` | A–F | Eén afgebakende ADR per besluit volgens de onderstaande lijst. Bijbehorende ADR's worden samen met hun eerste inhoudelijke document gereviewd. |
| `.codex/config.toml` | F | Projectconfiguratie voor uitsluitend de zeven toegestane MCP-servers, met secrets via externe authenticatie of omgevingsvariabelen. Wordt in deze batch als reviewbare configuratie voorbereid en in fase 4 geactiveerd en geverifieerd. |

De leesroute voor productreview is 01 → 02 → 03 → 13 → 14. Voor technische review is dat 04 → 05 → 06 → 07 → 08 → 12. Voor zelfstandig uitbreiden is dat de module-README → 15 → de gekoppelde specificatie en ADR. De documenten verwijzen naar de eigenaar van een contract of norm in plaats van verschillende versies ervan bij te houden.

### Externe leveringen na goedkeuring en verificatie

| Levering | Inhoud |
|---|---|
| GitHub Projects | Backlog, Ready, In progress, Review, Done en Blocked; velden mijlpaal, type en grootte; taak-ID in de issuetitel. Elke taak krijgt een issue met korte samenvatting en link naar de definitie in de repo; sluit-/mergeworkflows worden gecontroleerd. |
| Notion-handboek | Hoofdpagina met projectlinks; Start hier, Werken met de codebase, Uitbreiden, Beslissingen en Release notes. De database ML-experimenten bevat onderzoeksvraag, aanpak, resultaat en runlink; specificaties en commando's worden niet gekopieerd. |

Het genereren van het Figma-design hoort bij M3 in de bouwroadmap. Deze opdracht levert de brief en het playbook; een stijlkeuze en designgeneratie zijn geen impliciet onderdeel van het akkoord op fase 1.

## Voorstel voor de v1-regelpresets

Alle vier keuzes gebruiken een bord van 10 × 10 en dezelfde vijf schepen: vliegdekschip 5, slagschip 4, kruiser 3, onderzeeër 3 en torpedobootjager 2. De twee schepen van lengte 3 behouden verschillende stabiele IDs. Coördinaten zijn intern `{ row, col }`, beide 0-based; de weergave gebruikt letters voor kolommen en cijfers voor rijen: A1 = `{ row: 0, col: 0 }`, J10 = `{ row: 9, col: 9 }`.

| Preset / keuzemodus | Schepen mogen raken | Schoten en beurtwisseling | Informatie bij zinken |
|---|---|---|---|
| Klassiek (`classic`) | Ja, ook diagonaal | Eén schot, daarna de andere speler | Het scheepstype; geen volledige positie |
| Nog eens bij raak (`hit-again`) | Ja, ook diagonaal | Eén schot; bij raak blijft dezelfde speler aan de beurt | Het scheepstype; geen volledige positie |
| Ruimte tussen schepen (`spaced`) | Nee, ook niet diagonaal | Eén schot, daarna de andere speler | Het scheepstype; geen volledige positie |
| Aangepast (`custom`) | Keuze tussen de twee bovenstaande aanraakregels | Extra schot bij raak aan of uit | Vast: het scheepstype; geen volledige positie |

Voorgestelde preciseringen voor review in fase 1:

1. De starter wordt voor alle v1-keuzes met een seedbare loting bepaald en vóór het eerste schot getoond. Een herstart behoudt die keuze; een rematch krijgt een nieuwe seed. Het schema kan ook een expliciete starter vastleggen, maar de v1-UI krijgt hiervoor geen extra instelling.
2. Een gewone treffer onthult alleen `hit`, zonder scheepstype. Het zinkbericht voegt het scheepstype toe. Een zinkend schot telt als raak voor de extra-schotregel, behalve wanneer het spel daarmee eindigt.
3. Aangepast is een samensteller, geen vierde uniek regelsysteem: twee booleaanse keuzes leveren vier combinaties, waarvan drie al een benoemde preset hebben. De vierde combinatie is afstand tussen schepen plus nog eens bij raak. Namen, vertalingen en de gekozen UI-modus veranderen de `rulesSignature` niet.
4. Bordgrootte, vloot, schoten per beurt en informatievrijgave zijn in de v1-UI begrensd zoals hierboven. Het `RuleSet`-contract beschrijft ook de derde aanraakregel (geen orthogonaal contact), andere informatievormen en de ruimte voor andere bordgroottes, vloten en Salvo; nieuwe spelmodi worden later vrijgegeven met bijbehorende validatie en fixtures.
5. Batch A geeft een expliciete geldige plaatsing voor de strengste v1-aanraakregel. Dezelfde opstelling bewijst ook plaatsbaarheid voor de lossere varianten; de beurtregels veranderen de plaatsbaarheid niet. Voor toekomstige uitgebreidere regelsets moet de validator bestaan van een geldige plaatsing vaststellen, niet alleen totale scheepsoppervlakte tellen.

### Compatibiliteit van tegenstanders en modellen

Easy, Normal en Hard ondersteunen elke geldige regelset binnen het gedocumenteerde enginecontract. Hun benchmarkacceptatie geldt voor de vrijgegeven presets en combinaties; toekomstige afwijkende bord- of vlootconfiguraties krijgen eigen metingen.

Voorstel: gebruik `rulesSignature` voor de volledige spelregels en een afzonderlijke, geversioneerde `strategySignature` voor bord, vloot, aanraakregel en vrijgegeven treffer-/zinkinformatie. Starter en extra schot bij raak blijven onderdeel van de volledige signatuur. Het modelmanifest specificeert de strategiecompatibiliteit én de toegestane beurtvarianten; een onbekende toekomstige beurtpolicy wordt daardoor niet automatisch compatibel verklaard.

Het eerste model richt zich op Klassiek. Zodra export, compatibiliteit en benchmark voor beide varianten zijn aangetoond, mag hetzelfde model ook Nog eens bij raak en de equivalente aangepaste configuraties bedienen. Voor de aanraakvrije regels blijft Impossible zichtbaar uitgeschakeld totdat een daarvoor gevalideerd manifest bestaat. We meten de winrate per beurtvariant: hergebruik van dezelfde schietpolicy is geen bewijs van een identiek strategisch voordeel.

## ADR-lijst

De onderstaande bestandsnamen zijn gereserveerd voor fase 2; de ADR's zijn nog niet geschreven. **Vast** betekent een keuze uit de masterprompt die niet opnieuw ter discussie staat. **Voorstel** betekent een concrete voorkeursrichting om in de betreffende batch met alternatieven uit te werken. Akkoord op dit plan staat die uitwerking toe; de uiteindelijke tekst wordt bij de batchreview beoordeeld.

Alle bestanden staan onder `docs/adr/`. De kolom Batch bepaalt wanneer de ADR voor het eerst wordt opgeleverd. Vaste keuzes krijgen geen fictief besluitvormingsverhaal: de masterprompt is de bron, alternatieven worden beschreven als consequenties van een eventuele toekomstige wijziging.

### Vastgestelde product- en technologiekeuzes

| Bestand | Besluit | Batch |
|---|---|---|
| `0001-frontend-stack.md` | Vast: React, Vite, strict TypeScript en Tailwind. | B |
| `0002-pnpm-monorepo.md` | Vast: pnpm workspaces, met afzonderlijke packages per bouwsteen. | B |
| `0003-framework-free-core.md` | Vast: dependencyvrije, pure en deterministische TypeScript-core zonder DOM, timers of interne randomness. | B |
| `0004-pytorch-onnx-browser.md` | Vast: PyTorch-training, ONNX-export en ONNX Runtime Web in een Web Worker. | C |
| `0005-static-v1.md` | Vast: v1 heeft geen backend en wordt als statische app gehost. | B |
| `0006-configurable-rules.md` | Vast: regels vóór de wedstrijd kiezen; presets en enginegedrag via `RuleSet`. | A |
| `0007-four-difficulties.md` | Vast: Easy, Normal, Hard en Impossible; eerlijke informatie en meetbare moeilijkheid. | A |
| `0008-multiplayer-later.md` | Vast: multiplayer buiten v1, met gereserveerde routes en uitbreidingspunten. | A |
| `0009-anonymous-identity.md` | Vast: de voorgeschreven accountkeuze en een `IdentityProvider` voor lokale gastidentiteit; toekomstige uitbreiding blijft mogelijk. | A |
| `0010-figma-design-workflow.md` | Vast: Figma als designomgeving, via de remote MCP-server gegenereerd en uitgelezen. | D |
| `0011-repo-and-handbook.md` | Vast: technische docs in Git zijn leidend; Notion legt uit en verwijst. | A |
| `0012-github-projects.md` | Vast: GitHub Issues en Projects als enig bord voor taakstatus. | F |
| `0013-project-mcp-servers.md` | Vast: de zeven genoemde MCP-servers, projectscope, externe secrets en verificatie. | E |
| `0014-document-and-code-language.md` | Vast: Nederlandse documentatie; Engelse code, identifiers, comments en commits. | A |
| `0015-ui-languages.md` | Vast: UI in Engels als standaard en Nederlands, met i18n vanaf de start. | A |
| `0016-devices-and-accessibility.md` | Vast: desktop en mobiel, muis/touch/toetsenbord, evergreen browsers en WCAG 2.2 AA. | D |
| `0017-v1-privacy.md` | Vast: geen tracking, analytics of cookies van derden; geen persoonsgegevens in de spelfunctionaliteit. | A |
| `0018-visual-direction-selection.md` | Vast: drie stijlvoorstellen en een menselijke keuze vóór genereren. De gekozen stijl wordt later in deze ADR vastgelegd. | D |
| `0019-project-name.md` | Vast: SinkTheShip en `sinktheship.com`. | A |

### Uit te werken keuzes en preciseringen

| Bestand | Voorkeur, reden en te vergelijken alternatief | Batch |
|---|---|---|
| `0020-static-host.md` | Voorstel: Cloudflare Pages voor statische hosting met eigen headers en SPA-routes. Vergelijk Netlify en een zelf beheerde statische host op dezelfde eisen. | B |
| `0021-package-boundaries.md` | Voorstel: de opgegeven structuur plus `packages/game-session` voor sessiecoördinatie. Vergelijk coördinatie in `apps/web`; adapters blijven daar zolang ze geen tweede afnemer hebben. | B |
| `0022-v1-presets.md` | Voorstel: de vier keuzes en begrenzingen hierboven. Vergelijk een ruimere custom-editor op validatiekosten en reviewbaarheid. | A |
| `0023-rule-signatures.md` | Voorstel: volledige `rulesSignature` naast `strategySignature`, op canonieke en geversioneerde data. Vergelijk één hash en handmatig bijgehouden compatibiliteitslijsten. | A |
| `0024-ruleset-validation.md` | Voorstel: dependencyvrije runtimevalidatie in de core, inclusief plaatsbaarheid en vaste foutcodes. Vergelijk schemabibliotheken in adapters; de zero-dependency-core blijft verplicht. | A |
| `0025-hidden-information.md` | Precisering: één projectielaag voor views, gebeurtenissen en AI-inzicht; geen verborgen state of afleidbare plaatsingsseeds naar de tegenstander. Beschrijf de grens tussen API-afscherming en manipulatie van een lokale browser. | B |
| `0026-opponent-and-turn-contract.md` | Voorstel: async keuze van één schot met actuele view; `TurnPolicy` bepaalt herhaling en resterende schoten. Vergelijk één actie per call met vooraf vastgelegde schotsalvo's; definieer cancel, dispose en deterministisch tie-breaken. | B |
| `0027-rng-and-fleet-sampling.md` | Precisering: aparte seedbare RNG-stromen en uniforme geldige vlootplaatsing voor ieder niveau. Vergelijk volledige-vloot-rejection-sampling met gewogen tellen; willekeurig greedy plaatsen mag niet zonder bewijs uniform heten. | B |
| `0028-state-events-and-replay.md` | Voorstel: commands, onveranderlijke serialiseerbare state, domain events en geversioneerde snapshots met eventvolgorde. Vergelijk snapshot-first met volledige event sourcing. | B |
| `0029-local-persistence.md` | Voorstel: localStorage-adapter voor kleine settings- en spel-snapshots, inclusief migratie en fouten bij opslaglimieten. Vergelijk IndexedDB; modelcaching krijgt een afzonderlijke verantwoordelijkheid. | D |
| `0030-benchmark-and-promotion.md` | Precisering: gepaarde seeds, gewisselde starter, shot-count en head-to-head-metingen met betrouwbaarheidsintervallen. Leg ≥10.000 wedstrijden en het 55%-startdoel vast zonder niet-gemeten prestaties te claimen. | B |
| `0031-model-per-strategy.md` | Voorstel: begin met één model per strategiecompatibiliteit, eerst Klassiek. Vergelijk een op regels geconditioneerd model op data, modelgrootte en controleerbaarheid. | C |
| `0032-observation-encoding.md` | Voorstel: één geversioneerd tensorcontract met kanalen, vlootinformatie, legal-action-mask en alleen observeerbare zinkinformatie. Vergelijk alleen bordinformatie met bord plus publieke gebeurtenishistorie. | C |
| `0033-cross-language-parity.md` | Vastgestelde aanpak preciseren: TS/Python-golden fixtures en PyTorch/ONNX-exportpariteit, met gescheiden ontwikkel- en evaluatiesets. Vergelijk uitsluitend losse unit tests met gedeelde uitvoerbare contracten. | C |
| `0034-training-and-experiments.md` | Voorstel: kleine supervised CNN-baseline op CPU; RL pas na aantoonbare winst. Leg reproduceerbare stappen, W&B-runs en offline-logging vast; vergelijk CPU- en optionele GPU-runs. | C |
| `0035-model-runtime.md` | Voorstel: start met single-threaded WASM in een Worker, lazy loading, gevalideerde caching en expliciete foutmelding. Vergelijk multi-threaded WASM en WebGPU na meting; host moet custom headers ondersteunen. | C |
| `0036-model-and-locale-discovery.md` | Voorstel: modelcatalogus tijdens de build afleiden uit manifests en talen uit vertaalbestanden. Vergelijk automatische ontdekking met handmatige registratie; nieuwe bestanden vereisen een nieuwe build, geen applicatiecodewijziging. | C |
| `0037-react-router.md` | Voorstel: React Router in Declarative Mode met een route-registry. Vergelijk Data Mode; de sessielaag beheert spelstate en laadgedrag. | D |
| `0038-external-react-store.md` | Voorstel: kleine externe store via `useSyncExternalStore`, gekoppeld aan de sessieport. Vergelijk Zustand; React en presentational components beheren geen engine-state. | D |
| `0039-react-i18next.md` | Voorstel: behoud react-i18next als voorkeurslibrary, met sleutelvalidatie en automatisch gevonden talen. Vergelijk een eigen vertaalfunctie op uitbreidbaarheid en onderhoud. | D |
| `0040-test-tooling.md` | Voorstel: behoud Vitest, Testing Library, fast-check en Playwright Test; gebruik axe voor automatische toegankelijkheidschecks naast handmatige toetsenbordtests. Vergelijk de alternatieven per testlaag. | E |
| `0041-python-tooling.md` | Voorstel: behoud uv, ruff en pytest, met reproduceerbare Python-omgeving. Vergelijk pip/venv en Poetry zonder de ML-runtimekeuze te wijzigen. | C |
| `0042-lint-and-format.md` | Voorstel: behoud ESLint en Prettier met gedeelde configuratiepackages. Vergelijk één geïntegreerde lint-/formattool op ecosysteemdekking. | E |
| `0043-dependency-enforcement.md` | Voorstel: dependency-cruiser plus TypeScript project references en package exports. Vergelijk eslint-plugin-boundaries; toets verboden imports en cycli. | B |
| `0044-ci-and-artifacts.md` | Vastgestelde GitHub Actions-aanpak preciseren met aparte TS-, Python-, pariteits- en buildchecks. Vergelijk één job met gescheiden jobs; volledige modeltraining blijft buiten iedere PR. | E |
| `0045-room-routes.md` | Voorstel: `/r/:roomKey` voor private matches en `/multiplayer` als toekomstige online ingang, beide in v1 met binnenkort-pagina. Vergelijk `/room/:roomKey` op herkenbaarheid en korte deelbare URLs. | D |
| `0046-authoritative-session.md` | Voorstel: een bruikbare v1-sessieport voor dispatch, view-abonnement en hervatten; later een remote adapter met serverautoriteit. Vergelijk opponent-acties ophalen met volledige sessiesynchronisatie. | E |
| `0047-design-code-mapping.md` | Voorstel: gelijke token-, component- en propnamen, Code Connect waar beschikbaar en anders een versiebeheerbare mappingtabel. Vergelijk automatische koppeling met handmatige mapping en verifieer visueel. | D |
| `0048-quality-budgets.md` | Voorstel: centrale, meetbare budgetten en een expliciet browser-/telefoonprofiel in document 12. Vergelijk synthetische metingen met metingen op referentiehardware; definieer startwaarden en wijzigingsprocedure. | E |
| `0049-extension-scaffolding.md` | Voorstel: alleen een eenvoudige tegenstandergenerator als eerste hulpmiddel; overige uitbreidingen via gedocumenteerde bestanden en registraties. Vergelijk handmatig kopiëren; behoud de maximale wijzigingsimpact uit de masterprompt. | E |
| `0050-review-and-task-workflow.md` | Vastgestelde lifecycle preciseren met één actieve taak, kleine branches, Conventional Commits met taak-ID en menselijke review. Leg de tijdelijke documentatiefasen zonder bestaand takenbord afzonderlijk vast. | F |

### Onderbouwing van de nieuwe hoofdrichtingen

**Hosting:** Cloudflare Pages kan headers uit een `_headers`-bestand op statische responses toepassen en ondersteunt SPA-fallback voor routes die geen asset zijn. Dat past bij de statische v1 en gereserveerde roomroutes. De ADR toetst ook eigen domein, deploys en het correct serveren van ontbrekende modelbestanden; een SPA-fallback mag een HTML-response niet als geldig model laten doorgaan. Dit is een voorstel, geen deployment of keuze van een betaald abonnement. Bronnen, geraadpleegd via Context7 en de officiële docs op 2026-10-31: [Headers](https://developers.cloudflare.com/pages/configuration/headers/) en [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

**Routing en state:** Declarative Mode past bij een app die spelstate en model-loading zelf buiten de router beheert; React Router biedt daarvoor matching en navigatie. `useSyncExternalStore` kan React op die externe state abonneren, mits snapshots stabiel blijven tot de state verandert. De eerste keuze is in deze fase via Context7 gecontroleerd, de tweede in de intake: [React Router-modi](https://github.com/remix-run/react-router/blob/main/docs/start/modes.md) en [React external store](https://react.dev/reference/react/useSyncExternalStore).

**Bestanden toevoegen zonder code te wijzigen:** een statische site kan niet zelfstandig nieuwe servermappen opsommen. Daarom wordt de modelcatalogus bij de build gegenereerd; vertaalbestanden kunnen via Vite-globimports worden gevonden. Een nieuw model bevat ook de verplichte `MODEL_CARD.md`; toevoegen betekent daarna opnieuw bouwen en deployen, zonder een handmatige code-registry te wijzigen. Vite documenteert dat globimports tijdens transformatie naar imports worden omgezet en letterlijke patronen vereisen: [Glob Import](https://github.com/vitejs/vite/blob/main/docs/guide/features.md), geraadpleegd via Context7 op 2026-10-31.

Exacte dependencyversies worden bij de betreffende setup-taak aan de hand van actuele docs gekozen en vastgelegd in lockfiles. Het plan installeert niets en introduceert geen dependency buiten een te reviewen ADR.

## Ontwerpvragen die het plan expliciet opvangt

**Verborgen informatie:** UI en `Opponent` krijgen uitsluitend een toegestane view, inclusief gefilterde events. De eigen sessiecoördinator en opslagadapter hebben de volledige state nodig om lokaal te spelen en te hervatten; die bevoegdheid wordt niet doorgegeven aan componenten of bots. De speler kan de eigen browser en opslag inspecteren. De architectuur kan onbedoelde informatietoegang door de bot voorkomen, maar maakt een volledig lokale client niet fraudebestendig tegen de eigenaar. Later bewaakt de server de grens voor multiplayer.

**Zinken zonder onthulde positie:** wanneer schepen elkaar raken en alleen het gezonken type bekend is, kan een cluster treffers bij meerdere schepen horen. Hard, de heatmap en de encoder mogen daarom geen verborgen schip-ID of volledige gezonken positie uit de engine overnemen. Batch B specificeert de publieke bewijslast; batch C vult het sunk-kanaal alleen met publiek bekende of logisch zekere cellen en bewaart ambiguïteit waar nodig.

**Uniforme vlootplaatsing:** alle niveaus gebruiken dezelfde verdeling. Een algoritme dat per schip een willekeurige vrije plaats kiest, levert niet vanzelf een uniforme verdeling over complete geldige vloten. De ADR legt de betekenis van uniform vast voor gelabelde schepen, beschrijft een correct samplerontwerp en voorkomt een stilzwijgende overstap naar een snellere maar scheve verdeling.

**Multiplayer als adapter:** een online tegenstander levert acties, terwijl een autoritatieve server ook de toestand, validatie en reconnect bepaalt. Daarom stelt het plan `packages/game-session` voor: de v1-UI gebruikt al één port voor commands, views en hervatten. Later wisselt de composition root de lokale sessie voor een remote adapter en transport; `Opponent` blijft het actiecontract. Zo worden UI-componenten en `game-core` niet afhankelijk van WebSockets.

**Moeilijkheid als releasevoorwaarde:** een klein CNN dat scheepskansen voorspelt, verslaat Hard niet automatisch. De MVP mag Easy–Hard leveren; v1.0 vereist daarnaast een model dat de goedgekeurde acceptatiecriteria haalt. Bij tegenvallende resultaten volgt een zichtbaar experiment of voorstel tot aanpassing van doelen, geen andere labelnaam of stille fallback naar Hard.

## Schrijfvolgorde en reviewmomenten

| Batch | Hoofduitvoer | Reviewvraag |
|---|---|---|
| A | Leeswijzer, 01–03, glossary en bijbehorende ADR's | Zijn scope, vier regelkeuzes, informatievrijgave, requirements en stories volledig en toetsbaar? |
| B | 04–06 en bijbehorende ADR's | Zijn interfaces, afhankelijkheden, verborgen informatie, plaatsing, beurtbeleid en benchmark onderling consistent? |
| C | 07 en bijbehorende ADR's | Zijn training, observaties, modelcompatibiliteit, pariteit en promotie begrijpelijk en reproduceerbaar? |
| D | 08–10 en bijbehorende ADR's | Kloppen routes, states, interactie, i18n, opslag en de drie designrichtingen met het spelcontract? |
| E | 11, 12, 15, 16 en bijbehorende ADR's | Zijn toekomstinterfaces, kwaliteitsnormen, zelfstandig uitbreiden en MCP-setup uitvoerbaar? |
| F | 13, 14, root-AGENTS, root-README, Codex-config en resterende ADR's | Zijn taken klein genoeg, afhankelijkheden duidelijk, alle eisen gedekt en werkafspraken uitvoerbaar? |

De uitbreiding van de batchindeling betreft alleen het samen opleveren van de toepasselijke ADR's: niet alle ADR's wachten tot batch B. Zo worden bijvoorbeeld scope- en regelkeuzes samen met batch A beoordeeld. Nieuwe afhankelijkheden of afwijkingen krijgen ook later altijd een eigen ADR.

De inhoud van ieder contract krijgt één bron: regels in 02, enginecommando's/state/events in 05, tegenstandercontracten in 06 en model-/encodingcontracten in 07. Document 04 bevat de contractcatalogus, de algemene ports en verwijzingen; de frontend en gidsen gebruiken dezelfde definities. Eventuele inconsistenties worden als doc-wijziging opgelost vóór verdere afhankelijke uitwerking.

Fase 3 controleert onder andere lokale links, IDs, terminologie, alle FR/NFR → US → T → test-koppelingen, de packagegrenzen, modelcompatibiliteit en de zelfcontrole uit hoofdstuk 17. Fase 4 begint pas na goedkeuring van de documentatie en voert de volledige MCP-verificatie opnieuw uit. De bestaande herstelpunten staan hieronder.

## MCP-controle bij intake

Controle uitgevoerd op 2026-10-31. `codex-cli 0.166.0` is aanwezig. `codex mcp list --json` noemt alle zeven vereiste servers als `enabled: true`. Dit bewijst configuratie, geen werkende verbinding of toereikende rechten. De onderstaande testcalls zijn afzonderlijk uitgevoerd via de beschikbare MCP-tools.

Er bestaat nog geen `.codex/config.toml` in deze repository. De huidige sessieverbindingen zijn dus nog geen bewijs van de vereiste projectconfiguratie. Het configbestand hoort bij batch F; installatie, activering en volledige herverificatie volgen in fase 4.

| Server | Testcall / controle | Resultaat | Beoordeling |
|---|---|---|---|
| GitHub | `get_me`; inspectie van aangeboden tools | Account `Cas0570`; `projects_get`, `projects_list`, `projects_write` en `actions_get`, `actions_list`, `actions_run_trigger` zijn beschikbaar | Intake geslaagd; schrijfbevoegdheden voor het gekozen project later controleren |
| Notion | `notion_get_self`; `notion_search` met `SinkTheShip` | Workspace `Ruimte van Cas`, gebruiker Cas; zoekopdracht geeft geen resultaten | Verbonden; beoogde handboeklocatie nog niet bekend of geopend, volledige verificatie dus nog niet geslaagd |
| Figma | `whoami`; inspectie van aangeboden tools | Account Cas; Starter-plan, View-seat; `use_figma` is beschikbaar | Verbonden; voldoet niet aan de vereiste Full-seat op een ondersteund plan |
| Context7 | `resolve_library_id` voor React; `query_docs` met `/websites/react_dev_reference` | Documentatie over `useSyncExternalStore`, inclusief abonnementen en stabiele, immutable snapshots | Intake geslaagd |
| Playwright | `browser_tabs` met `action: new` en `https://example.com`; daarna `browser_snapshot` | Pagina geopend; toegankelijkheidssnapshot met inhoud en link ontvangen | Intake geslaagd |
| Chrome DevTools | `new_page` met `https://example.com` | Fout: `Missing X server to start the headful browser` | Niet geslaagd; geen pagina-ID, dus consoleberichten nog niet opvraagbaar |
| Weights & Biases | `list_entities_tool` | Naam `sinktheship` verschijnt als user-entity en als team-entity | Intake geslaagd; projectbestemming later kiezen |

De browsercontrole is uitsluitend een eenmalige verbindingscontrole, geen test van SinkTheShip. In fase 4 opnieuw alle voorgeschreven testcalls uitvoeren. Het bord en het handboek pas inrichten zodra alle controles uit hoofdstuk 13.2 zijn geslaagd.

### Benodigde setup en herstel vóór fase 4

**Figma:** gebruik een account met een Full-seat op Professional, Education, Organization of Enterprise en bewerkrechten op de gekozen designlocatie. Laat de ontwikkelaar de seat of het account regelen. Koppel zo nodig opnieuw via `codex mcp login figma` en herstart de sessie; controleer daarna `whoami` en beschikbaarheid van `use_figma`. Er is geen abonnement gewijzigd. De officiële documentatie bevestigt de ondersteunde plannen en vereiste bewerkrechten: [Write to canvas](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/). De Full-seat-eis komt uit de masterprompt.

**Chrome DevTools:** deze omgeving heeft geen X-server voor een zichtbare browser. Neem in de projectconfiguratie een headless start op en laad de server daarna opnieuw. Onderstaand fragment is een voorbereid herstelvoorstel, nog niet toegepast:

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["-y", "chrome-devtools-mcp@latest", "--headless=true"]
startup_timeout_sec = 60
```

Open na herstart een testpagina met `new_page` en vraag met de geretourneerde `pageId` de console op via `list_console_messages`. De optie is geverifieerd via Context7 in de [officiële configuratiegids](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md). De timeout van 60 seconden is een voorgestelde projectinstelling.

**Notion:** kies vóór fase 4 de bovenliggende pagina voor het handboek, zorg dat het verbonden account die kan openen en bewerken, en verifieer de gekozen pagina met een lezende call. De huidige zoekopdracht bewijst alleen dat geen toegankelijke pagina op de zoekterm werd gevonden; zij bewijst niet dat er nergens al een handboek is.

**Projectconfiguratie:** leg in batch F de zeven servers vast in `.codex/config.toml`, zonder secrets. In fase 4 vertrouwt de ontwikkelaar de projectmap, stelt de benodigde tokenvariabelen beschikbaar aan het Codex-proces en gebruikt waar nodig `codex mcp login figma` en `codex mcp login notion`. Start daarna een nieuwe sessie, controleer `codex mcp list` en voer alle testcalls opnieuw uit. De [officiële Codex MCP-documentatie](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) beschrijft projectconfiguratie, OAuth en tokenverwijzingen.

Let op bij het latere Figma-playbook: `codex mcp add` schrijft volgens de via Context7 geraadpleegde [Codex-broncode](https://github.com/openai/codex/blob/main/codex-rs/cli/src/mcp_cmd.rs) naar de globale configuratie. Gebruik voor de verplichte projectscope het bestand in de repository; voer het voorbeeldcommando uit de masterprompt niet zonder deze toelichting uit.

## Centrale open punten

De hoofdlijnen bij Q-01 en Q-05 zijn met fase 1 goedgekeurd. De uitgewerkte details worden bij hun batchreview beoordeeld. De overige punten hebben een later beslismoment en blokkeren batch A niet.

| ID | Open punt | Moment van oplossen |
|---|---|---|
| Q-01 | Akkoord op het presetvoorstel, inclusief de gelote starter en begrensde custom-modus; voorkeursrichtingen voor hosting, packages, routing en tooling beoordelen | Voorstellen aanwezig in fase 1; volledige ADR's bij hun batchreview |
| Q-02 | Figma-account/plan/seat en designlocatie met voldoende rechten regelen; uit drie nog te beschrijven stijlrichtingen kiezen | Rechten vóór fase 4; stijl vóór designgeneratie |
| Q-03 | Chrome DevTools met een werkende browserstart configureren en pagina plus console verifiëren | Projectconfiguratie in batch F; volledige verificatie vóór inrichting in fase 4 |
| Q-04 | GitHub-repository en eigenaar/zichtbaarheid, Notion-parentpagina, Figma-bestand en W&B-projectbestemming vaststellen | Vóór de betreffende externe handelingen in fase 4; repository aanmaken alleen na het daarvoor gevraagde akkoord |
| Q-05 | De voorgestelde signaturen en grenzen rond informatie, uniforme plaatsing, sessieautoriteit en modelacceptatie beoordelen | Voorstellen aanwezig in fase 1; precieze contracten en ADR's in batches A–E |

## Aannames voor het plan

> Aanname: A-01 — de uitwerking hoeft geen bestaande implementatie te behouden of te migreren; de lokale repository bevatte bij de intake alleen `.git`.

> Aanname: A-02 — de verdere uitwerking blijft binnen het op 2026-10-31 goedgekeurde presetvoorstel, inclusief gelote starter en begrensde custom-modus.

> Aanname: A-03 — externe bestemmingen en de visuele richting worden op hun aangegeven beslismoment gekozen. Het plan verandert geen vastgestelde technologie- of productbeslissing en vraagt niet om betaalde diensten te activeren.

## Traceerbaarheid

De requirements en user stories worden in batch A vastgelegd, de teststrategie in batch E en de taken in batch F. De matrix wordt dan aangevuld en in fase 3 op dekking gecontroleerd. Er zijn nog geen definitieve IDs of testresultaten voor productrequirements toegekend.

| Requirement (`FR-xx` / `NFR-xx`) | User story (`US-xx`) | Taak (`Txx`) | Test / verificatie |
|---|---|---|---|

## Externe projectlinks

| Bestemming | Link of ontbrekend gegeven |
|---|---|
| GitHub-repository | Nog niet vastgesteld; er is geen Git-remote geconfigureerd |
| GitHub Projects-bord | Nog niet ingericht |
| Notion-handboek | Parentpagina nog niet gekozen; nog niet ingericht |
| Figma | Designbestand nog niet gekozen; rechten zie MCP-controle |
| W&B | Entity `sinktheship` gevonden; project-URL nog niet vastgesteld |

## Review van fase 0

De opdracht is volledig bewaard en de intakebevindingen zijn vastgelegd. Er zijn geen productkeuzes gewijzigd, geen implementatietaken gestart en geen externe gegevens aangemaakt. De ontwikkelaar heeft fase 0 op 2026-10-31 goedgekeurd. Fase 1 mag worden uitgewerkt; de herstelpunten hoeven daarvoor nog niet opgelost te zijn.

## Review van fase 1

Deze wijziging bevat de complete documentstructuur, 50 gereserveerde ADR's, de v1-presets, concrete architectuurvoorstellen en de schrijf-/reviewvolgorde. De 19 vaste hoofdkeuzes zijn herkenbaar gescheiden van de verdere keuzes en preciseringen. Er zijn nog geen ADR-bestanden of implementatiebestanden aangemaakt.

Review vooral de grenzen van Aangepast, de gelote starter, de betekenis van modelcompatibiliteit en het voorstel voor `packages/game-session`. Hosting, libraries en overige voorgestelde details krijgen hun volledige onderbouwing en alternatieven in de gekoppelde ADR's. Fase 1 is op 2026-10-31 goedgekeurd. Batch A mag worden geschreven; de reeds vastgelegde herstelvoorwaarden vóór fase 4 blijven gelden.

Verificatie: alle vereiste documentpaden staan in het plan, de 50 ADR-IDs zijn uniek en doorlopend, lokale links bestaan en Markdown-codeblokken zijn gesloten. De opgeslagen bronopdracht is ongewijzigd. Er is geen applicatiecode om in deze fase te testen.
