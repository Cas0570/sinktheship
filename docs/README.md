Status: Geaccepteerd

Versie: 0.32

Laatst gewijzigd: 2026-11-04

Gerelateerd: [Masterprompt](00-masterprompt.md), [scope](01-product-vision-scope.md), [spelregels](02-game-rules.md), [stories](03-user-stories.md), [begrippen](glossary.md)

# SinkTheShip — leeswijzer en voortgang

Dit bestand is het hervatpunt voor de documentatieopdracht. Lees eerst de [masterprompt](00-masterprompt.md), daarna deze leeswijzer. Technische specificaties staan in de repository; het Notion-handboek legt de werkwijze uit en verwijst ernaar. GitHub Projects is de enige bron voor de status van implementatietaken. De onderstaande voortgang betreft uitsluitend deze documentatieopdracht.

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
| Fase 2 — batch A | Goedgekeurd door de ontwikkelaar op 2026-10-31 |
| Fase 2 — batch B | Goedgekeurd door de ontwikkelaar op 2026-10-31 |
| Fase 2 — batch C | Goedgekeurd door de ontwikkelaar op 2026-10-31 |
| Fase 2 — batch D | Goedgekeurd door de ontwikkelaar op 2026-11-01 |
| Fase 2 — batch E | Goedgekeurd door de ontwikkelaar op 2026-11-01 |
| Fase 2 — batch F | Goedgekeurd door de ontwikkelaar op 2026-11-01 |
| Fase 3 — consistentiecheck | Goedgekeurd door de ontwikkelaar op 2026-11-02 |
| Fase 4 — MCP-verificatie, bord en handboek | Goedgekeurd door de ontwikkelaar op 2026-11-02; zeven MCP-tests, repository, bord, handboek en workflows geverifieerd |

De ontwikkelaar heeft fase 1 op 2026-10-31 goedgekeurd. Batch A is op 2026-10-31 goedgekeurd. Batch B is op 2026-10-31 goedgekeurd. Batch C is op 2026-10-31 goedgekeurd. Batch D is op 2026-11-01 goedgekeurd. Batch E is op 2026-11-01 goedgekeurd. Batch F is op 2026-11-01 goedgekeurd. De ontwikkelaar heeft fase 3 op 2026-11-02 goedgekeurd. De [review](#review-van-fase-3) bevat de correcties en verificatie. Fase 3 staat in commit `a317a44`. Fase 4 is afgerond; het [verificatieverslag](16-tooling-mcp.md#verificatieverslag-2026-11-02) bevat de resultaten en noodzakelijke gebruikersacties. De Notion-parentpagina en het Figma-bestand zijn bereikbaar; alle zeven verbindingstests slagen. De ontwikkelaar heeft de private repository en push afzonderlijk goedgekeurd. Repository, bord en handboek zijn ingericht en teruggelezen. Ook de [workflowcontrole](16-tooling-mcp.md#externe-inrichting-2026-11-02) is afgerond met gebruikersscreenshots en API-teruglezing. De ontwikkelaar heeft fase 4 op 2026-11-02 goedgekeurd. De documentatie- en inrichtingsopdracht is afgerond; op verzoek stopt het werk na vastlegging en commit van dit akkoord. Een algemeen akkoord op D kiest geen visuele stijl: die expliciete keuze blijft vóór M3 staan.

Beginsituatie: bestaande Git-repository op branch `main`, zonder commits, zonder geconfigureerde remote en zonder projectbestanden. `git init` was niet nodig. De goedgekeurde fase 0 staat in commit `7799fc8` (`docs: record approved SinkTheShip intake`). Het goedgekeurde plan staat in commit `c674689` (`docs: approve documentation plan and v1 rule presets`). Batch A staat in commit `f0a9f77` (`docs: approve batch A product scope rules and acceptance criteria`). Batch B staat in commit `ca9f4d5` (`docs: approve batch B architecture engine and opponents`). Batch C staat in commit `e54ff7c` (`docs: approve batch C neural pipeline and model contracts`). Batch D staat in commit `a741986` (`docs: approve batch D frontend design brief and Figma workflow`). Batch E staat in commit `67cdbd3` (`docs: approve batch E multiplayer quality extension and tooling specifications`). Batch F staat in commit `6f96816` (`docs: approve batch F roadmap backlog and project workflow`) en voegde een uitgeschakelde projectconfiguratie toe. De fase-3-correcties staan in `a317a44` (`docs: approve phase 3 consistency corrections`). Fase 4 heeft de projectprofielen geactiveerd en browser-MCP-packages via npx beschikbaar gemaakt en getest; er zijn geen applicatiedependencies geïnstalleerd. Na de verbindingstests en het repositoryakkoord zijn de externe projectgegevens ingericht zoals vastgelegd in het fase-4-hervatpunt.

De [browser- en componenttesthandleiding](../tests/README.md) beschrijft de afzonderlijke fixturebuild, matrix, productiecontrole en retrydiagnostiek. De projectstatus blijft uitsluitend op het bord.

## Documentinventaris en plan voor fase 1

Alle paden hieronder zijn relatief aan de repositoryroot. Alle in fase 1 geplande repo-documenten en de projectconfiguratie bestaan nu. Alle batches A–F zijn goedgekeurd. Ook de fase-3-correcties zijn op 2026-11-02 goedgekeurd; de eerdere basis blijft herkenbaar in Git. Elk document krijgt status, versie, wijzigingsdatum en gerelateerde documenten. `docs/11-multiplayer-future.md` krijgt status **Toekomst**; nieuwe uitwerkingen beginnen als **Concept**.

| Document | Documentstatus | Toelichting |
|---|---|---|
| [00-masterprompt.md](00-masterprompt.md) | Geaccepteerd | Ongewijzigde bronopdracht met metadata |
| [README.md](README.md) | Geaccepteerd | Fase 3 goedgekeurd; fase-4-hervatpunt, verificatie en volledige taaktraceerbaarheid |
| [Root-README](../README.md) | Geaccepteerd | Projectingang en eerlijk onderscheid tussen huidige docs en toekomstige quick start |
| [AGENTS.md](../AGENTS.md) | Geaccepteerd | Eén taak per keer, reviews, MCP-momenten en ongewijzigde Context7-regel |
| [.codex/config.toml](../.codex/config.toml) | Geaccepteerd | Zeven ingeschakelde en geverifieerde serverprofielen; geteste browserpackages gepind |
| [01-product-vision-scope.md](01-product-vision-scope.md) | Geaccepteerd | Fase 3: MVP bevat volledige EN/NL en toegankelijkheid; normen verwijzen naar uitgewerkte meetprofielen |
| [02-game-rules.md](02-game-rules.md) | Geaccepteerd | Fase 3: versieherkenning vóór versiegebonden validatie; 22 referentiegevallen behouden |
| [03-user-stories.md](03-user-stories.md) | Geaccepteerd | Fase 3: productionele Impossible vereist een promoted model; 29 stories en 87 tests behouden |
| [04-architecture.md](04-architecture.md) | Geaccepteerd | Fase 3: `SessionPort` bindt actor en clientinstantie; verwijzing naar lokale requestvolgorde |
| [05-game-engine.md](05-game-engine.md) | Geaccepteerd | Fase 3: begrensde deduplicatie blijft veilig na receipt-eviction en Workerherstart |
| [06-opponents.md](06-opponents.md) | Geaccepteerd | Fase 3: goedgekeurde sampler en actuele verwijzingen naar ML en kwaliteit |
| [07-neural-network.md](07-neural-network.md) | Geaccepteerd | Fase 3: nul fouten is geldig; candidatekwalificatie kan vóór productiepromotie |
| [08-frontend.md](08-frontend.md) | Geaccepteerd | Fase 3: requestherstel, taalafhankelijke pluralen en verwijzingen naar vaste profielen |
| [09-design-brief.md](09-design-brief.md) | Geaccepteerd | Fase 3: zinkinformatie gebruikt de exacte RuleSet-veldnaam; stijl nog te kiezen |
| [10-figma-mcp-playbook.md](10-figma-mcp-playbook.md) | Geaccepteerd | Fase 3: tool-/skillbeschikbaarheid is gedateerd; concreet configbestand gelinkt |
| [11-multiplayer-future.md](11-multiplayer-future.md) | Toekomst | Serverautoriteit, rooms, typed protocol, reconnect, timers en misbruikgrenzen; niet bouwen in v1 |
| [12-quality-testing.md](12-quality-testing.md) | Geaccepteerd | Fase 3: gescheiden kandidaatkwalificatie en productiecontrole; definitieve traceerbaarheid |
| [13-roadmap.md](13-roadmap.md) | Geaccepteerd | Fasen 2/3 goedgekeurd; volledige fase 4 blijft voorwaarde voor bouwen |
| [14-backlog.md](14-backlog.md) | Geaccepteerd | Fase 4: 59 echte issuekoppelingen; taakdefinities en afhankelijkheden behouden |
| [15-extension-guides.md](15-extension-guides.md) | Geaccepteerd | Fase 3: modelkwalificatie, pluralvalidatie en bestaande werkinstructies verduidelijkt |
| [16-tooling-mcp.md](16-tooling-mcp.md) | Geaccepteerd | Fase 4: zeven geslaagde verbindingstests, externe inrichting en geverifieerde workflows |
| [glossary.md](glossary.md) | Geaccepteerd | Fase 3: lokale requestvolgorde en kwalificatiebegrippen afgestemd op definitieve contracten |
| [adr/0000-template.md](adr/0000-template.md) | Geaccepteerd | ADR-template |
| [adr/0006-configurable-rules.md](adr/0006-configurable-rules.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0007-four-difficulties.md](adr/0007-four-difficulties.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0008-multiplayer-later.md](adr/0008-multiplayer-later.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0009-anonymous-identity.md](adr/0009-anonymous-identity.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0011-repo-and-handbook.md](adr/0011-repo-and-handbook.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0014-document-and-code-language.md](adr/0014-document-and-code-language.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0015-ui-languages.md](adr/0015-ui-languages.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0017-v1-privacy.md](adr/0017-v1-privacy.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0019-project-name.md](adr/0019-project-name.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0022-v1-presets.md](adr/0022-v1-presets.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0023-rule-signatures.md](adr/0023-rule-signatures.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0024-ruleset-validation.md](adr/0024-ruleset-validation.md) | Geaccepteerd | Batch A; besluitbasis staat in het document |
| [adr/0001-frontend-stack.md](adr/0001-frontend-stack.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0002-pnpm-monorepo.md](adr/0002-pnpm-monorepo.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0003-framework-free-core.md](adr/0003-framework-free-core.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0005-static-v1.md](adr/0005-static-v1.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0020-static-host.md](adr/0020-static-host.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0021-package-boundaries.md](adr/0021-package-boundaries.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0025-hidden-information.md](adr/0025-hidden-information.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0026-opponent-and-turn-contract.md](adr/0026-opponent-and-turn-contract.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0027-rng-and-fleet-sampling.md](adr/0027-rng-and-fleet-sampling.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0028-state-events-and-replay.md](adr/0028-state-events-and-replay.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0030-benchmark-and-promotion.md](adr/0030-benchmark-and-promotion.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0043-dependency-enforcement.md](adr/0043-dependency-enforcement.md) | Geaccepteerd | Batch B; besluitbasis en verificatie in het document |
| [adr/0004-pytorch-onnx-browser.md](adr/0004-pytorch-onnx-browser.md) | Geaccepteerd | Batch C; besluitbasis en verificatie in het document |
| [adr/0031-model-per-strategy.md](adr/0031-model-per-strategy.md) | Geaccepteerd | Batch C; besluitbasis en verificatie in het document |
| [adr/0032-observation-encoding.md](adr/0032-observation-encoding.md) | Geaccepteerd | Batch C; besluitbasis en verificatie in het document |
| [adr/0033-cross-language-parity.md](adr/0033-cross-language-parity.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; verwijzing naar de uitgewerkte pariteitsnorm |
| [adr/0034-training-and-experiments.md](adr/0034-training-and-experiments.md) | Geaccepteerd | Batch C; besluitbasis en verificatie in het document |
| [adr/0035-model-runtime.md](adr/0035-model-runtime.md) | Geaccepteerd | Batch C; besluitbasis en verificatie in het document |
| [adr/0036-model-and-locale-discovery.md](adr/0036-model-and-locale-discovery.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0041-python-tooling.md](adr/0041-python-tooling.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0010-figma-design-workflow.md](adr/0010-figma-design-workflow.md) | Geaccepteerd | Batch D; vaste workflow en concrete bewijsvoering |
| [adr/0016-devices-and-accessibility.md](adr/0016-devices-and-accessibility.md) | Geaccepteerd | Batch D; bediening, targets, focus en responsive controle |
| [adr/0018-visual-direction-selection.md](adr/0018-visual-direction-selection.md) | Geaccepteerd | Batch D; keuzeprocedure; stijl nog expliciet te kiezen |
| [adr/0029-local-persistence.md](adr/0029-local-persistence.md) | Geaccepteerd | Batch D; localStorage, migraties, fouten en één schrijvende sessie |
| [adr/0037-react-router.md](adr/0037-react-router.md) | Geaccepteerd | Batch D; declaratieve router en lifecyclegrenzen |
| [adr/0038-external-react-store.md](adr/0038-external-react-store.md) | Geaccepteerd | Batch D; publieke immutable view-store buiten React |
| [adr/0039-react-i18next.md](adr/0039-react-i18next.md) | Geaccepteerd | Batch D; vertaalbestanden en sleutel-/pluralvalidatie |
| [adr/0045-room-routes.md](adr/0045-room-routes.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0047-design-code-mapping.md](adr/0047-design-code-mapping.md) | Geaccepteerd | Batch D; gelijke namen, Code Connect en lokale fallback |
| [adr/0013-project-mcp-servers.md](adr/0013-project-mcp-servers.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0040-test-tooling.md](adr/0040-test-tooling.md) | Geaccepteerd | Batch E; middelen per testlaag en gedeelde contractsuite |
| [adr/0042-lint-and-format.md](adr/0042-lint-and-format.md) | Geaccepteerd | Batch E; ESLint/Prettier en ongewijzigde bronmasterprompt |
| [adr/0044-ci-and-artifacts.md](adr/0044-ci-and-artifacts.md) | Geaccepteerd | Batch E; aparte jobs en herleidbaar releasebewijs |
| [adr/0046-authoritative-session.md](adr/0046-authoritative-session.md) | Geaccepteerd | Batch E; remote sessies naast een eventuele server-side Opponent-adapter |
| [adr/0048-quality-budgets.md](adr/0048-quality-budgets.md) | Geaccepteerd | Batch E; iPhone 16 Pro, labprofiel en aanvullende middenklassekwalificatie |
| [adr/0049-extension-scaffolding.md](adr/0049-extension-scaffolding.md) | Geaccepteerd | Fase 3: goedgekeurde besluitbasis; fase-3-precisering en actuele contractverwijzingen |
| [adr/0012-github-projects.md](adr/0012-github-projects.md) | Geaccepteerd | Batch F; enige statusbron, velden/labels en ingebouwde workflows |
| [adr/0050-review-and-task-workflow.md](adr/0050-review-and-task-workflow.md) | Geaccepteerd | Batch F; één taak, reviewbewijs, leerproeven en overdracht |
| [adr/0052-placement-validation-api.md](adr/0052-placement-validation-api.md) | Geaccepteerd | T06; geometriehelpers, draftcontrole en veilige zoeklimiet |
| [adr/0051-staged-rule-validation.md](adr/0051-staged-rule-validation.md) | Geaccepteerd | T05; schemavalidatie zonder plaatsbaarheidsclaim |
| [adr/0053-rng-seeding-api.md](adr/0053-rng-seeding-api.md) | Geaccepteerd | T07; expliciete seedparen, herstel en onafhankelijke RNG-instances |

### Documentstructuur

De onderstaande plansecties tot en met de schrijfvolgorde bewaren het goedgekeurde fase-1-plan. Woorden als **Voorstel** beschrijven de toenmalige keuze; de huidige norm en besluitstatus staan in de gekoppelde specificaties, ADR’s en de inventaris hierboven. De reviewsecties onderaan bewaren de oplevergeschiedenis per batch.

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

## Goedgekeurde presetrichting en uitwerking

Fase 1 heeft Klassiek, Nog eens bij raak, Ruimte tussen schepen en de beperkte modus Aangepast goedgekeurd, met een gelote starter. De concrete norm, met de fase-3-precisering van de validatievolgorde, staat in [document 02](02-game-rules.md#v1-vloot-en-presets); daar staan ook coördinaten, informatievrijgave, enginegrenzen en het plaatsbaarheidsbewijs. Deze leeswijzer onderhoudt geen tweede versie van het schema.

De uitwerking van `rulesSignature` en `strategySignature` staat in [document 02](02-game-rules.md#stabiele-signaturen) en [ADR 0023](adr/0023-rule-signatures.md). Een strategiesignatuur alleen is onvoldoende om een model te activeren; encoding, runtime en expliciete beurtvarianten blijven voorwaarden.

## ADR-lijst

De onderstaande 50 bestandsnamen vormen het goedgekeurde ADR-plan. Alle 50 ADR's zijn in batches A–F opgeleverd en goedgekeurd; fase-3-correcties zijn eveneens goedgekeurd en staan in de actuele inventaris. **Vast** betekent een keuze uit de masterprompt die niet opnieuw ter discussie staat. **Voorstel** betekent een concrete voorkeursrichting om in de betreffende batch met alternatieven uit te werken. Akkoord op dit plan staat die uitwerking toe; de uiteindelijke tekst wordt bij de batchreview beoordeeld.

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

De hoofdlijnen van fase 1 en batch A zijn goedgekeurd. Q-01 is opgelost; Q-05 maakt zichtbaar welke technische uitwerking is goedgekeurd, wat later volgt. De overige punten hebben een later beslismoment en blokkeren de documentatie niet.

| ID | Open punt | Moment van oplossen |
|---|---|---|
| Q-01 | Opgelost: enginegrenzen, validatie met witness/inconclusive en canonieke JSON-signaturen zijn goedgekeurd | Goedgekeurd op 2026-10-31 |
| Q-02 | Toegang opgelost: Education/Full in team SinkTheShip en bestandssessie geverifieerd op 2026-11-02. Nog expliciet kiezen uit [Harbor, Radar of Paper Fleet](09-design-brief.md#drie-stijlrichtingen) | Stijl vóór designgeneratie; geen toegangsblokkade meer |
| Q-03 | Opgelost: de huidige Chrome-tool opent een pagina en leest de console succesvol met het teruggegeven page-ID | Gecontroleerd op 2026-11-02; eerdere headful-startfout opgelost |
| Q-04 | Repository privé aangemaakt na afzonderlijk akkoord; bord, Notion-handboek en Figma-bestand bereikbaar. W&B-entity heeft nog geen projecten. De [Projects-workflows](16-tooling-mcp.md#externe-inrichting-2026-11-02) zijn geverifieerd | Externe inrichting goedgekeurd op 2026-11-02; W&B-projectbestemming vóór online training |
| Q-05 | B/C/D-contracten goedgekeurd. [Remote sessieprotocol](11-multiplayer-future.md) en [ADR 0046](adr/0046-authoritative-session.md) zijn met E goedgekeurd | Goedgekeurd op 2026-11-01; toekomstige serverimplementatie blijft buiten v1 |
| Q-06 | Deels opgelost: ontwikkelaar koos op 2026-11-01 iPhone 16 Pro. [Meetprotocollen](12-quality-testing.md#budgetten-en-vaste-meetprofielen) zijn met E goedgekeurd. Toegang tot middenklassetoestel en eventuele Safari-traceomgeving nog vaststellen | Profielen goedgekeurd; fysieke middenklasse-/Safari-tracevoorziening vóór betreffende release-/ML-kwalificatie, niet nodig om documentatie af te ronden |

## Aannames voor het plan

> Aanname: A-01 — de uitwerking hoeft geen bestaande implementatie te behouden of te migreren; de lokale repository bevatte bij de intake alleen `.git`.

> Aanname: A-02 — de verdere uitwerking blijft binnen het op 2026-10-31 goedgekeurde presetvoorstel, inclusief gelote starter en begrensde custom-modus.

> Aanname: A-03 — externe bestemmingen en de visuele richting worden op hun aangegeven beslismoment gekozen. Het plan verandert geen vastgestelde technologie- of productbeslissing en vraagt niet om betaalde diensten te activeren.

## Traceerbaarheid

Batch A definieert 25 FR's, 14 NFR's, 29 stories en 87 acceptatietestgevallen. Deze tests zijn beschreven, nog niet geïmplementeerd of uitgevoerd. De tabel toont ontwerpdekking; zij claimt geen gerealiseerde testdekking. Batch F koppelt alle eisen via de stories aan 59 [taakdefinities](14-backlog.md), inclusief expliciet optionele Could-taken T57–T59. Uitvoeringsstatus blijft op het toekomstige bord.

| Requirement | User stories | Taak (`Txx`) | Geplande acceptatietests |
|---|---|---|---|
| FR-01 | [US-01](03-user-stories.md#us-01) | [T08](14-backlog.md#t08), [T20](14-backlog.md#t20), [T23](14-backlog.md#t23), [T27](14-backlog.md#t27), [T28](14-backlog.md#t28), [T29](14-backlog.md#t29), [T30](14-backlog.md#t30) | AT-01-01, AT-01-02, AT-01-03 |
| FR-02 | [US-02](03-user-stories.md#us-02) | [T05](14-backlog.md#t05), [T06](14-backlog.md#t06), [T28](14-backlog.md#t28) | AT-02-01, AT-02-02, AT-02-03 |
| FR-03 | [US-02](03-user-stories.md#us-02) | [T05](14-backlog.md#t05), [T06](14-backlog.md#t06), [T28](14-backlog.md#t28) | AT-02-01, AT-02-02, AT-02-03 |
| FR-04 | [US-03](03-user-stories.md#us-03) | [T12](14-backlog.md#t12), [T13](14-backlog.md#t13), [T14](14-backlog.md#t14), [T28](14-backlog.md#t28), [T39](14-backlog.md#t39), [T41](14-backlog.md#t41) | AT-03-01, AT-03-02, AT-03-03 |
| FR-05 | [US-04](03-user-stories.md#us-04) | [T06](14-backlog.md#t06), [T11](14-backlog.md#t11), [T19](14-backlog.md#t19), [T22](14-backlog.md#t22), [T29](14-backlog.md#t29) | AT-04-01, AT-04-02, AT-04-03 |
| FR-06 | [US-05](03-user-stories.md#us-05) | [T18](14-backlog.md#t18), [T19](14-backlog.md#t19), [T21](14-backlog.md#t21), [T22](14-backlog.md#t22), [T29](14-backlog.md#t29), [T30](14-backlog.md#t30), [T33](14-backlog.md#t33), [T53](14-backlog.md#t53) | AT-05-01, AT-05-02, AT-05-03 |
| FR-07 | [US-04](03-user-stories.md#us-04) | [T06](14-backlog.md#t06), [T11](14-backlog.md#t11), [T19](14-backlog.md#t19), [T22](14-backlog.md#t22), [T29](14-backlog.md#t29) | AT-04-01, AT-04-02, AT-04-03 |
| FR-08 | [US-06](03-user-stories.md#us-06) | [T08](14-backlog.md#t08), [T23](14-backlog.md#t23), [T30](14-backlog.md#t30) | AT-06-01, AT-06-02, AT-06-03 |
| FR-09 | [US-07](03-user-stories.md#us-07), [US-17](03-user-stories.md#us-17) | [T09](14-backlog.md#t09), [T12](14-backlog.md#t12), [T13](14-backlog.md#t13), [T14](14-backlog.md#t14), [T19](14-backlog.md#t19), [T23](14-backlog.md#t23), [T26](14-backlog.md#t26), [T30](14-backlog.md#t30), [T35](14-backlog.md#t35), [T46](14-backlog.md#t46), [T47](14-backlog.md#t47), [T55](14-backlog.md#t55) | AT-07-01, AT-07-02, AT-07-03; AT-17-01, AT-17-02, AT-17-03 |
| FR-10 | [US-08](03-user-stories.md#us-08) | [T10](14-backlog.md#t10), [T20](14-backlog.md#t20), [T24](14-backlog.md#t24), [T25](14-backlog.md#t25), [T26](14-backlog.md#t26), [T30](14-backlog.md#t30), [T33](14-backlog.md#t33), [T41](14-backlog.md#t41), [T46](14-backlog.md#t46), [T55](14-backlog.md#t55) | AT-08-01, AT-08-02, AT-08-03 |
| FR-11 | [US-09](03-user-stories.md#us-09) | [T08](14-backlog.md#t08), [T20](14-backlog.md#t20), [T24](14-backlog.md#t24), [T30](14-backlog.md#t30), [T41](14-backlog.md#t41) | AT-09-01, AT-09-02, AT-09-03 |
| FR-12 | [US-10](03-user-stories.md#us-10) | [T20](14-backlog.md#t20), [T31](14-backlog.md#t31), [T47](14-backlog.md#t47) | AT-10-01, AT-10-02, AT-10-03 |
| FR-13 | [US-11](03-user-stories.md#us-11) | [T25](14-backlog.md#t25), [T27](14-backlog.md#t27), [T31](14-backlog.md#t31), [T33](14-backlog.md#t33), [T53](14-backlog.md#t53) | AT-11-01, AT-11-02, AT-11-03 |
| FR-14 | [US-12](03-user-stories.md#us-12) | [T18](14-backlog.md#t18), [T21](14-backlog.md#t21), [T31](14-backlog.md#t31), [T45](14-backlog.md#t45), [T53](14-backlog.md#t53) | AT-12-01, AT-12-02, AT-12-03 |
| FR-15 | [US-03](03-user-stories.md#us-03), [US-13](03-user-stories.md#us-13) | [T12](14-backlog.md#t12), [T13](14-backlog.md#t13), [T14](14-backlog.md#t14), [T20](14-backlog.md#t20), [T28](14-backlog.md#t28), [T39](14-backlog.md#t39), [T40](14-backlog.md#t40), [T41](14-backlog.md#t41), [T42](14-backlog.md#t42), [T54](14-backlog.md#t54) | AT-03-01, AT-03-02, AT-03-03; AT-13-01, AT-13-02, AT-13-03 |
| FR-16 | [US-14](03-user-stories.md#us-14) | [T20](14-backlog.md#t20), [T27](14-backlog.md#t27), [T31](14-backlog.md#t31), [T32](14-backlog.md#t32) | AT-14-01, AT-14-02, AT-14-03 |
| FR-17 | [US-15](03-user-stories.md#us-15) | [T25](14-backlog.md#t25), [T31](14-backlog.md#t31), [T32](14-backlog.md#t32), [T55](14-backlog.md#t55) | AT-15-01, AT-15-02, AT-15-03 |
| FR-18 | [US-16](03-user-stories.md#us-16) | [T44](14-backlog.md#t44) | AT-16-01, AT-16-02, AT-16-03 |
| FR-19 | [US-12](03-user-stories.md#us-12) | [T18](14-backlog.md#t18), [T21](14-backlog.md#t21), [T31](14-backlog.md#t31), [T45](14-backlog.md#t45), [T53](14-backlog.md#t53) | AT-12-01, AT-12-02, AT-12-03 |
| FR-20 | [US-17](03-user-stories.md#us-17) | [T14](14-backlog.md#t14), [T19](14-backlog.md#t19), [T46](14-backlog.md#t46), [T47](14-backlog.md#t47) | AT-17-01, AT-17-02, AT-17-03 |
| FR-21 | [US-18](03-user-stories.md#us-18) | [T34](14-backlog.md#t34), [T36](14-backlog.md#t36), [T37](14-backlog.md#t37), [T38](14-backlog.md#t38), [T43](14-backlog.md#t43), [T52](14-backlog.md#t52) | AT-18-01, AT-18-02, AT-18-03 |
| FR-22 | [US-19](03-user-stories.md#us-19) | [T11](14-backlog.md#t11), [T13](14-backlog.md#t13), [T14](14-backlog.md#t14), [T15](14-backlog.md#t15), [T16](14-backlog.md#t16), [T33](14-backlog.md#t33), [T36](14-backlog.md#t36), [T38](14-backlog.md#t38), [T42](14-backlog.md#t42), [T52](14-backlog.md#t52), [T56](14-backlog.md#t56) | AT-19-01, AT-19-02, AT-19-03 |
| FR-23 | [US-25](03-user-stories.md#us-25) | [T57](14-backlog.md#t57) | AT-25-01, AT-25-02, AT-25-03 |
| FR-24 | [US-26](03-user-stories.md#us-26) | [T58](14-backlog.md#t58) | AT-26-01, AT-26-02, AT-26-03 |
| FR-25 | [US-27](03-user-stories.md#us-27) | [T59](14-backlog.md#t59) | AT-27-01, AT-27-02, AT-27-03 |
| NFR-01 | [US-20](03-user-stories.md#us-20) | [T01](14-backlog.md#t01), [T02](14-backlog.md#t02), [T04](14-backlog.md#t04), [T12](14-backlog.md#t12), [T27](14-backlog.md#t27), [T33](14-backlog.md#t33), [T39](14-backlog.md#t39), [T43](14-backlog.md#t43), [T48](14-backlog.md#t48), [T49](14-backlog.md#t49), [T50](14-backlog.md#t50), [T51](14-backlog.md#t51), [T52](14-backlog.md#t52), [T56](14-backlog.md#t56) | AT-20-01, AT-20-02, AT-20-03 |
| NFR-02 | [US-28](03-user-stories.md#us-28) | [T05](14-backlog.md#t05), [T07](14-backlog.md#t07), [T10](14-backlog.md#t10), [T11](14-backlog.md#t11), [T12](14-backlog.md#t12), [T15](14-backlog.md#t15), [T23](14-backlog.md#t23), [T24](14-backlog.md#t24) | AT-28-01, AT-28-02, AT-28-03 |
| NFR-03 | [US-07](03-user-stories.md#us-07) | [T09](14-backlog.md#t09), [T12](14-backlog.md#t12), [T13](14-backlog.md#t13), [T14](14-backlog.md#t14), [T23](14-backlog.md#t23), [T26](14-backlog.md#t26), [T30](14-backlog.md#t30), [T35](14-backlog.md#t35), [T46](14-backlog.md#t46), [T55](14-backlog.md#t55) | AT-07-01, AT-07-02, AT-07-03 |
| NFR-04 | [US-05](03-user-stories.md#us-05), [US-21](03-user-stories.md#us-21) | [T03](14-backlog.md#t03), [T17](14-backlog.md#t17), [T18](14-backlog.md#t18), [T19](14-backlog.md#t19), [T20](14-backlog.md#t20), [T21](14-backlog.md#t21), [T22](14-backlog.md#t22), [T29](14-backlog.md#t29), [T30](14-backlog.md#t30), [T33](14-backlog.md#t33), [T47](14-backlog.md#t47), [T51](14-backlog.md#t51), [T53](14-backlog.md#t53) | AT-05-01, AT-05-02, AT-05-03; AT-21-01, AT-21-02, AT-21-03 |
| NFR-05 | [US-21](03-user-stories.md#us-21) | [T03](14-backlog.md#t03), [T17](14-backlog.md#t17), [T18](14-backlog.md#t18), [T19](14-backlog.md#t19), [T20](14-backlog.md#t20), [T21](14-backlog.md#t21), [T22](14-backlog.md#t22), [T33](14-backlog.md#t33), [T47](14-backlog.md#t47), [T51](14-backlog.md#t51), [T53](14-backlog.md#t53) | AT-21-01, AT-21-02, AT-21-03 |
| NFR-06 | [US-22](03-user-stories.md#us-22) | [T26](14-backlog.md#t26), [T33](14-backlog.md#t33), [T40](14-backlog.md#t40), [T45](14-backlog.md#t45), [T54](14-backlog.md#t54) | AT-22-01, AT-22-02, AT-22-03 |
| NFR-07 | [US-13](03-user-stories.md#us-13) | [T20](14-backlog.md#t20), [T39](14-backlog.md#t39), [T40](14-backlog.md#t40), [T41](14-backlog.md#t41), [T42](14-backlog.md#t42), [T54](14-backlog.md#t54) | AT-13-01, AT-13-02, AT-13-03 |
| NFR-08 | [US-15](03-user-stories.md#us-15), [US-23](03-user-stories.md#us-23) | [T03](14-backlog.md#t03), [T25](14-backlog.md#t25), [T31](14-backlog.md#t31), [T32](14-backlog.md#t32), [T39](14-backlog.md#t39), [T40](14-backlog.md#t40), [T55](14-backlog.md#t55) | AT-15-01, AT-15-02, AT-15-03; AT-23-01, AT-23-02, AT-23-03 |
| NFR-09 | [US-08](03-user-stories.md#us-08) | [T10](14-backlog.md#t10), [T20](14-backlog.md#t20), [T24](14-backlog.md#t24), [T25](14-backlog.md#t25), [T26](14-backlog.md#t26), [T30](14-backlog.md#t30), [T33](14-backlog.md#t33), [T41](14-backlog.md#t41), [T46](14-backlog.md#t46), [T55](14-backlog.md#t55) | AT-08-01, AT-08-02, AT-08-03 |
| NFR-10 | [US-23](03-user-stories.md#us-23) | [T03](14-backlog.md#t03), [T25](14-backlog.md#t25), [T32](14-backlog.md#t32), [T39](14-backlog.md#t39), [T40](14-backlog.md#t40), [T55](14-backlog.md#t55) | AT-23-01, AT-23-02, AT-23-03 |
| NFR-11 | [US-29](03-user-stories.md#us-29) | [T10](14-backlog.md#t10), [T34](14-backlog.md#t34), [T35](14-backlog.md#t35), [T36](14-backlog.md#t36), [T38](14-backlog.md#t38), [T40](14-backlog.md#t40), [T42](14-backlog.md#t42) | AT-29-01, AT-29-02, AT-29-03 |
| NFR-12 | [US-19](03-user-stories.md#us-19) | [T11](14-backlog.md#t11), [T13](14-backlog.md#t13), [T14](14-backlog.md#t14), [T15](14-backlog.md#t15), [T16](14-backlog.md#t16), [T33](14-backlog.md#t33), [T36](14-backlog.md#t36), [T38](14-backlog.md#t38), [T42](14-backlog.md#t42), [T52](14-backlog.md#t52), [T56](14-backlog.md#t56) | AT-19-01, AT-19-02, AT-19-03 |
| NFR-13 | [US-20](03-user-stories.md#us-20), [US-24](03-user-stories.md#us-24) | [T01](14-backlog.md#t01), [T02](14-backlog.md#t02), [T03](14-backlog.md#t03), [T04](14-backlog.md#t04), [T12](14-backlog.md#t12), [T17](14-backlog.md#t17), [T27](14-backlog.md#t27), [T33](14-backlog.md#t33), [T37](14-backlog.md#t37), [T39](14-backlog.md#t39), [T43](14-backlog.md#t43), [T48](14-backlog.md#t48), [T49](14-backlog.md#t49), [T50](14-backlog.md#t50), [T51](14-backlog.md#t51), [T52](14-backlog.md#t52), [T56](14-backlog.md#t56) | AT-20-01, AT-20-02, AT-20-03; AT-24-01, AT-24-02, AT-24-03 |
| NFR-14 | [US-24](03-user-stories.md#us-24) | [T01](14-backlog.md#t01), [T02](14-backlog.md#t02), [T03](14-backlog.md#t03), [T04](14-backlog.md#t04), [T17](14-backlog.md#t17), [T33](14-backlog.md#t33), [T37](14-backlog.md#t37), [T43](14-backlog.md#t43), [T49](14-backlog.md#t49), [T56](14-backlog.md#t56) | AT-24-01, AT-24-02, AT-24-03 |

## Externe projectlinks

| Bestemming | Link of ontbrekend gegeven |
|---|---|
| GitHub-repository | [Cas0570/sinktheship](https://github.com/Cas0570/sinktheship), openbaar op expliciet verzoek; `origin` en default branch `main` |
| GitHub Projects-bord | [SinkTheShip](https://github.com/users/Cas0570/projects/3), privé; 59 gekoppelde issues, board- en tabelview; workflowconfiguratie geverifieerd |
| Notion-handboek | [Handboek](https://app.notion.com/p/40c275fb04ba81da945cee04d24413bb) onder de gekozen ouderpagina; vijf gids-/verslagpagina’s en [ML-experimenten](https://app.notion.com/p/27115ed9c3bf47f9924ec6600951bc9f) |
| Figma | [SinkTheShip](https://www.figma.com/design/z5qW8mIwsPjYRTfCpk9nwP/SinkTheShip?node-id=0-1) geverifieerd met Education/Full in team SinkTheShip; Page 1 leesbaar |
| W&B | [Entity sinktheship](https://wandb.ai/sinktheship) geverifieerd; nog geen projecten, projectbestemming vóór online training vaststellen |

## Review van fase 0

De opdracht is volledig bewaard en de intakebevindingen zijn vastgelegd. Er zijn geen productkeuzes gewijzigd, geen implementatietaken gestart en geen externe gegevens aangemaakt. De ontwikkelaar heeft fase 0 op 2026-10-31 goedgekeurd. Fase 1 mag worden uitgewerkt; de herstelpunten hoeven daarvoor nog niet opgelost te zijn.

## Review van fase 1

Deze wijziging bevat de complete documentstructuur, 50 gereserveerde ADR's, de v1-presets, concrete architectuurvoorstellen en de schrijf-/reviewvolgorde. De 19 vaste hoofdkeuzes zijn herkenbaar gescheiden van de verdere keuzes en preciseringen. Bij afsluiting van fase 1 waren nog geen ADR-bestanden of implementatiebestanden aangemaakt.

Review vooral de grenzen van Aangepast, de gelote starter, de betekenis van modelcompatibiliteit en het voorstel voor `packages/game-session`. Hosting, libraries en overige voorgestelde details krijgen hun volledige onderbouwing en alternatieven in de gekoppelde ADR's. Fase 1 is op 2026-10-31 goedgekeurd. Batch A mag worden geschreven; de reeds vastgelegde herstelvoorwaarden vóór fase 4 blijven gelden.

Verificatie: alle vereiste documentpaden staan in het plan, de 50 ADR-IDs zijn uniek en doorlopend, lokale links bestaan en Markdown-codeblokken zijn gesloten. De opgeslagen bronopdracht is ongewijzigd. Er is geen applicatiecode om in deze fase te testen.


## Review van batch A

Geleverd: documenten 01, 02 en 03, de glossary, het ADR-template en de 12 bij batch A geplande ADR’s. De bestaande leeswijzer is bijgewerkt. De ontwikkelaar heeft batch A op 2026-10-31 goedgekeurd; de bronopdracht en het goedgekeurde fase-1-plan blijven leidend.

De belangrijkste preciseringen zijn de runtimevalidatie met afzonderlijke onbesliste uitkomst, de canonieke regelsignaturen zonder hashingdependency, de exacte informatievrijgave bij zinken en de grenzen tussen engineconfiguratie en v1-editor. De volledige no-touch-opstelling levert een controleerbaar plaatsbaarheidsbewijs voor alle vier v1-combinaties. De requirements en stories maken ook de MVP/ML-grens en het onderscheid tussen Must-instellingen en Should-effecten expliciet.

Controleer bij review vooral document 02 en ADR’s 0022–0024. Q-01 is met het akkoord op batch A opgelost; Q-02 t/m Q-06 blijven op hun aangegeven momenten open. Deze batch voegt uitsluitend Markdown toe, zonder implementatiecode, configuratieactivatie of externe projectupdates.

Verificatie uitgevoerd: metadata, lokale links inclusief anchors, gesloten codeblokken, ontbreken van oningevulde tekst, unieke requirement-/story-/test-IDs en volledige koppeling van 39 requirements aan 29 stories en 87 geplande tests. Alle 12 voor batch A geplande ADR’s bestaan. De klassieke JSON en de 17-cellige no-touch-witness zijn gecontroleerd; de vier regelcombinaties leveren vier volledige en twee strategiesignaturen, terwijl namen en volgorde die niet veranderen. De bronopdracht is ongewijzigd. Dit zijn documentatie- en voorbeeldcontroles; er zijn nog geen applicatie-, engine- of browsertests uitgevoerd.


## Review van batch B

Geleverd: documenten 04–06 en de 12 voor batch B geplande ADR’s. De glossary en leeswijzer zijn bijgewerkt. De ontwikkelaar heeft batch B op 2026-10-31 goedgekeurd; het akkoord op batch A blijft ongewijzigd. Er zijn nu 34 Markdown-documenten, waaronder het ADR-template, 12 geaccepteerde ADR’s uit A en 12 geaccepteerde ADR’s uit B.

Review vooral de volgende keuzes:

- [Architectuur](04-architecture.md): één Game Worker, een aparte sessiepackage, geprivilegieerde opslagbridge en automatisch te bewaken importgrenzen.
- [Engine](05-game-engine.md): onderscheid tussen private en publieke events, immutable transities, PCG32-stromen, idempotentie, stale-resultaatcontrole en atomair opgeslagen checkpoints.
- [Tegenstanders](06-opponents.md): conservatieve omgang met ambigue zinkinformatie, uniforme volledige-vloot-rejection met exacte fallback en de vier schotstrategieën.
- [Benchmarkbesluit](adr/0030-benchmark-and-promotion.md): 5.000 startergebalanceerde blokken per vergelijking/configuratie, afzonderlijke solo-metingen, blokbootstrap en expliciete release-/promotiepoorten.

De uniforme sampler kan voor extreme engineconfiguraties duur zijn. De v1-snelheid, de moeilijkheidsvolgorde en het neural releasecriterium zijn nog te meten tijdens de bouw. De minimale modelports in 04 dienen alleen de dependencygrens; batch C maakt het complete manifest-/encodingcontract en wordt daarna de eigenaar daarvan. Q-02/03/04/06 blijven op hun bestaande beslismomenten staan.

Verificatie uitgevoerd: metadata, lokale links en anchors, gesloten codeblokken, aanwezigheid van alle 12 geplande B-ADR’s, document-/contractverwijzingen en ongewijzigde bronopdracht. Een tijdelijke rekencontrole bevestigt de zes PCG-referentiewaarden, Easy’s verwachte 95,389 schoten/mediaan 97 en de uniforme gewichten op een 2 × 3-bord met gelabelde lengtes 1 en 2: 28 geldige vloten bij allow, 8 bij no-orthogonal en 4 bij no-touch. Deze controles testen documentvoorbeelden en wiskundige eigenschappen; er zijn geen applicatie-/bot-/browser-/performancetests uitgevoerd. TypeScript-signaturen zijn inhoudelijk gecontroleerd, niet gecompileerd; er is geen compiler geïnstalleerd voor deze documentatiebatch.

Volgens de afgesproken [schrijf- en reviewvolgorde](#schrijfvolgorde-en-reviewmomenten) is batch B goedgekeurd. Batch C mag nu worden geschreven en wordt daarna afzonderlijk ter review aangeboden. Deze batch bevat uitsluitend Markdown, geen implementatiecode, geactiveerde configuratie of externe projectupdates.


## Review van batch C

Geleverd: [07-neural-network](07-neural-network.md) en de acht voor C geplande ADR’s. De glossary en leeswijzer zijn bijgewerkt. Document 04 verwijst nu naar de complete modelcontracten in 07 en beschrijft de Node/Python-rolloutgrens; 05 bewaart bij neural hervatten ook het exacte runtimeprofiel. De ontwikkelaar heeft deze uitwerking en de aanvullingen op batch B op 2026-10-31 goedgekeurd. Er zijn nu 43 Markdown-documenten: 24 geaccepteerde ADR’s uit A/B, acht geaccepteerde ADR’s uit C, het template en tien overige documenten.

Reviewfocus:

- De 16-kanaalsencoding bewaart publieke zink-ID's en schotvolgorde. Alleen het zinkschot wordt als known-sunk gemarkeerd; de ML-input bevat geen verborgen toewijzing van eerdere treffers.
- De baseline heeft 41.665 parameters, gebruikt gescheiden vlootgroepen en leert eerst supervised op CPU. De Node-producer hergebruikt bestaande bots; Python replayt onafhankelijk vóór training.
- Export heeft afzonderlijke numerieke én beslispariteit. Een kleine logitafwijking geeft geen vrijstelling wanneer de gekozen cel verschilt.
- De manifestresolver gebruikt volledige regelentries, encoding, policy en runtimeprofiel. Promotieketens kiezen één getoetste standaard; een nieuw model vervangt geen lopend spel.
- Offline logging en lokale publicatievoorbereiding werken zonder W&B-account of deployment. De pipelinecommando's zijn gespecificeerd, nog niet geïmplementeerd.

Verificatie: metadata, 312 lokale links/anchors, codeblokken, alle acht C-ADR’s, 65 unieke contractdefinities, 15 ML-verificatiegevallen, parsebare voorbeeld-TOML en ongewijzigde bronopdracht. Een tijdelijke rekencontrole valideert parameter-/gewichtsaantal, receptive field en twee complete geldige vloten die de beschreven ambigue schothistorie opleveren. Er zijn geen dependencies geïnstalleerd, modellen getraind, tensors door PyTorch/ONNX uitgevoerd of prestaties gemeten. De compiler-/runtimechecks zijn toekomstige bouwacceptatie; documentvoorbeelden zijn geen modelkwalificatie.

Q-04 (externe bestemmingen) en Q-06 (referentietoestel/profiel) blijven op hun bestaande beslismoment staan. De volledige holdoutbenchmark en browsermetingen zijn vereist vóór modelpromotie. Volgens de afgesproken [reviewvolgorde](#schrijfvolgorde-en-reviewmomenten) is C goedgekeurd en mag D worden geschreven; die batch wordt daarna afzonderlijk ter review aangeboden. Er is uitsluitend Markdown gewijzigd.


## Review van batch D

Geleverd: [08-frontend](08-frontend.md), [09-design-brief](09-design-brief.md), [10-figma-mcp-playbook](10-figma-mcp-playbook.md) en alle negen voor D geplande ADR's. De leeswijzer en glossary zijn bijgewerkt. Document 04 krijgt als goedgekeurde versie 1.2 expliciete publieke sessieregels, actuele tegenstandermetadata en een uitsluitend na afloop beschikbare reviewprojectie. Er zijn nu 55 Markdown-documenten: 13 algemene documenten, het ADR-template en 41 uitgewerkte ADR's. De ontwikkelaar heeft batch D op 2026-11-01 goedgekeurd.

Review vooral:

- [Frontend](08-frontend.md): twaalf routes, hervatten en guards, keyboard-/pointerbediening, één publieke view-store en vertaalbestanden. De opslagkeuze bevat schemaversies, foutbehoud, begrensd optioneel inzicht en één schrijvende tab via Web Locks.
- [Publieke sessiegrens](04-architecture.md#contractcatalogus): rules en opponentmetadata komen uit de actuele sessie. Historische AI-observaties en scores gaan pas na afloop naar React; de UI leest daarvoor nooit private checkpoints.
- [Design brief](09-design-brief.md): Harbor, Radar en Paper Fleet, berekende paletteparen, tokenexport, 19 componentfamilies, alle vereiste schermstates op drie breedtes en acht prototypeflows.
- [Figma-playbook](10-figma-mcp-playbook.md): concrete prompts, projectscope versus het globale CLI-voorbeeld, actuele seat-/toolbeperkingen, skills, publicatie en Code Connect/mappingfallback. De huidige documentatie noemt `create_design_system_rules` een prompt; de sessie biedt hem niet als tool aan.

**Stijlkeuze blijft open.** Harbor is aanbevolen, maar een algemeen akkoord op D kiest Harbor niet. De ontwikkelaar noemt vóór designgeneratie expliciet A/Harbor, B/Radar of C/Paper Fleet; ADR 0018 krijgt dan dat besluit. Rechten, designbestemming en de andere open punten blijven op hun bestaande beslismomenten staan. Figma-generatie hoort bij M3.

Verificatie uitgevoerd: metadata, lokale links/anchors, gesloten codeblokken, whitespace buiten de letterlijk bewaarde bronopdracht, aanwezigheid en secties van de negen D-ADR's, unieke contractvindplaatsen, bekende acceptatietestverwijzingen en een exacte 19-op-19-componentmapping. De sRGB-contrastparen zijn berekend; de minimale bordgeometrie op 320 px is gecontroleerd. De oorspronkelijke masterprompt heeft dezelfde SHA-256. Er zijn geen dependencies geïnstalleerd, app-/browser-/performancetests uitgevoerd, fonts in een remote design geladen, Figma-objecten gegenereerd of externe projectgegevens geschreven.

Volgens de afgesproken [schrijf- en reviewvolgorde](#schrijfvolgorde-en-reviewmomenten) is D goedgekeurd en volgt na de commit batch E: toekomstmultiplayer, kwaliteitsstrategie, uitbreidingsgidsen en MCP-tooling. Die documenten zijn in D nog niet gestart.


## Review van batch E

Geleverd: [11-multiplayer-future](11-multiplayer-future.md), [12-quality-testing](12-quality-testing.md), [15-extension-guides](15-extension-guides.md), [16-tooling-mcp](16-tooling-mcp.md) en de zeven voor E geplande ADR's. De leeswijzer en glossary zijn bijgewerkt; 04 preciseert in goedgekeurde versie 1.3 de remote sessiegrens en verwijst naar de nieuwe uitbreidingsgidsen. Er zijn nu 66 Markdown-documenten: 17 algemene documenten, één ADR-template en 48 uitgewerkte ADR's. Batch E is door de ontwikkelaar goedgekeurd op 2026-11-01.

Review vooral:

- **Serverautoriteit:** document 11 en ADR 0046 leggen uit waarom een online Opponent-adapter alleen onvoldoende is. De server beheert de volledige wedstrijd; clientviews, ontvangerspecifieke sequence, idempotentie, reconnect, timers en expliciete forfeit/abandoned-uitkomsten voorkomen verborgen-statelekkage en dubbel handelen. Dit blijft toekomstontwerp, zonder servercode in v1.
- **Kwaliteitsbewijs:** document 12 maakt testlagen, CI-/releasepoorten, fouten, browser-/a11y-matrix, CSP en meetprotocollen concreet. De startbudgetten blijven behouden; initiële JS wordt ook over de eerste gewone spelstart geteld. Instabiele tests worden niet door een geslaagde retry verborgen.
- **Referentietoestel:** de ontwikkelaar koos op 2026-11-01 de beschikbare iPhone 16 Pro. Het fysieke iOS-profiel is onderscheiden van Lighthouse-simulatie en een aanvullend middenklasseprofiel voor de neural-eis. Toegang tot een middenklassetoestel en eventuele Safari-traceomgeving blijft vóór kwalificatie te regelen; dit blokkeert het schrijven niet.
- **Zelfstandig uitbreiden:** document 15 bevat zes gidsen met bestandsimpact, stappen en bewijsproeven, plus een klein voorstel voor `pnpm new:opponent`. Alle genoemde app-/scriptpaden zijn te bouwen contracten, geen bestaande functionaliteit.
- **MCP-setup:** document 16 bevat de zeven parseerbare profielen, secretverwijzingen, OAuth-/trust-/herstartstappen, testcalls en gericht herstel. Het onderscheid tussen zichtbare tools, werkende verbinding en voldoende rechten blijft expliciet. Configbestand/activatie volgen in F/fase 4.

Open punten: Q-02/03/04 blijven op hun bestaande momenten staan. Q-05 heeft nu een goedgekeurd toekomstcontract. Q-06 is deels opgelost door de iPhonekeuze; de aanvullende profielvoorzieningen staan hierboven. Er is nog geen visuele stijl gekozen.

Verificatie uitgevoerd: metadata, lokale links/anchors, gesloten codeblokken, whitespace buiten de letterlijk bewaarde bron, bekende AT-verwijzingen, unieke contractvindplaatsen en aanwezigheid/secties van de zeven E-ADR's. De gecombineerde TOML-voorbeelden parsen als precies zeven serverentries zonder literal secrets. Het roomalfabet bevat 31 unieke tekens en 31^6 mogelijke zes-tekensleutels. De oorspronkelijke masterprompt behoudt zijn SHA-256. Bronnen zijn geraadpleegd via Context7, officiële documentatie en lokale CLI-help. Er zijn geen dependencies geïnstalleerd, configuraties geactiveerd, volledige MCP-herverificaties of applicatie-/toesteltests uitgevoerd, of externe projectgegevens gewijzigd.

Volgens de afgesproken [reviewvolgorde](#schrijfvolgorde-en-reviewmomenten) is E goedgekeurd. Na de commit start F met roadmap, traceerbare backlog, root-README, AGENTS.md, projectconfiguratie en de twee resterende ADR's. Fase 3/4 zijn nog niet gestart.


## Review van batch F

Geleverd: [roadmap](13-roadmap.md), [59 taakdefinities](14-backlog.md), [root-README](../README.md), [AGENTS.md](../AGENTS.md), [.codex/config.toml](../.codex/config.toml) en de resterende [ADR 0012](adr/0012-github-projects.md) en [ADR 0050](adr/0050-review-and-task-workflow.md). Batch F is door de ontwikkelaar goedgekeurd op 2026-11-01. Er zijn nu 72 Markdown-documenten, waaronder 50 uitgewerkte ADR's plus het template. De leeswijzer bevat voor alle 39 requirements de koppeling naar stories, taken en de 87 geplande acceptatietests.

Review vooral:

- **Volgorde en scope:** de 59 taken zijn S/M en hebben expliciete afhankelijkheden. T23, de publieke sessiecoördinator, hoort bij M2 omdat de head-to-head-benchmark in T15 de gewone sessie gebruikt. Het ML-spoor kan na M1 met simulator/encoding starten; de dataset gebruikt daarna de M2-gedragsstrategieën. De labels blijven echte bezetting volgens 07, geen teacher-imitatie.
- **Releasevoorwaarden:** T33 levert de MVP-poort inclusief EN/NL, toetsenbord/touch, browsermatrix, budgetten en proeven van de beschikbare uitbreidingspunten. M6 voegt de geplande Should-functies en volledige v1-kwalificatie toe. T57–T59 zijn uitdrukkelijk Could voor na v1.0 en blokkeren die release niet.
- **Zelfstandig onderhouden:** iedere taak documenteert haar publieke API; aparte taken controleren alle module-README's, de CPU-leerproef en de zes uitbreidingsgidsen door menselijke uitvoering zonder AI. De generieke DoD wordt via een centrale verwijzing toegepast.
- **Taakworkflow:** het bord is de enige uitvoeringsstatusbron; issues linken naar repo-definities. PR's hebben een closing keyword naar de default branch en menselijke review. De ingebouwde Done-workflows worden in fase 4 gecontroleerd, met zo nodig concrete UI-stappen voor de ontwikkelaar. AGENTS behoudt de aangeleverde Context7-instructie letterlijk en onderscheidt de huidige documentatiefasen van de latere bouw.
- **Configuratie:** exact zeven serverentries zijn voorbereid met `enabled = false`; het voorgestelde permissieprofiel staat als comment. Context7 begint anoniem, met optionele externe key na configuratie/verificatie. Toolingdocument 16 beschrijft nu de concrete activatievolgorde. Document 12 verwijst naar AGENTS en gebruikt het definitieve T14 in het commitvoorbeeld; kwaliteitsnormen zijn niet gewijzigd.

Open punten blijven centraal Q-02/03/04/06: Figma-seat/bestemming en expliciete stijlkeuze, werkende Chrome-start, externe projectbestemmingen en meetvoorzieningen. De beschikbare iPhone 16 Pro blijft het fysieke iOS-referentietoestel; middenklasse-inferentie en Safari-traces vragen hun afzonderlijke voorziening vóór kwalificatie. Geen van deze punten verhindert deze documentreview.

Verificatie uitgevoerd: metadata, lokale links inclusief anchors, gesloten codeblokken, whitespace, aanwezigheid/secties van alle 50 ADR's, 59 unieke taak-ID's met verplichte velden, bekende US-/AT-verwijzingen, volledige requirement-/testkoppeling en acyclische dependencies. AGENTS blijft onder 32 KiB en de Context7-brontekst is behouden. TOML parseert met precies zeven uitgeschakelde servers en zonder actieve permissieoverride of literal secrets. De oorspronkelijke masterprompt behoudt zijn SHA-256. GitHub-/Codex-/pnpm-details zijn via Context7 en officiële bronnen gecontroleerd.

Er is geen applicatiecode gebouwd, geen applicatie-/browser-/toestelmeting uitgevoerd en geen externe projectinrichting gestart. Batch F is goedgekeurd en vastgelegd in commit `6f96816`. De aansluitende fase-3-review staat hieronder; fase 4 en de bouw zijn nog niet gestart.


## Review van fase 3

De consistentiecheck is op 2026-11-02 uitgevoerd over de volledige documentatie. De ontwikkelaar heeft de correcties op 2026-11-02 goedgekeurd; de eerdere batches A–F blijven in Git beschikbaar. Er zijn geen nieuwe productfuncties, libraries, taak-ID’s of taakafhankelijkheden toegevoegd. De kwaliteitsbudgetten en promotie-eisen blijven behouden.

| Bevinding | Correctie en gekoppeld bewijs voor de bouw |
|---|---|
| Een oud UI-intent kon na het verdwijnen van zijn receipt opnieuw met de huidige core-revision worden verpakt | [05](05-game-engine.md#lokale-requestvolgorde) bindt een clientprefix en oplopende requestvolgorde; oude IDs worden ook na 256 receipts geweigerd. [04](04-architecture.md), [08](08-frontend.md), [ADR 0028](adr/0028-state-events-and-replay.md), SES-09/10 en T23/T24 sluiten hierop aan. |
| Strikte veldvalidatie kon een onbekende toekomstige RuleSet-versie als ongeldige v1 behandelen | [02](02-game-rules.md) herkent eerst de versie; een onbekende positieve versie geeft unsupported vóór v1-veldvalidatie. T05 toetst ook een toekomstig extra veld. |
| De manifestregel voor positieve aantallen sloot nul fouten uit | [07](07-neural-network.md#manifestvalidatie) onderscheidt positieve aantallen van niet-negatieve wins/errors, begrenst metrics en houdt nul fouten verplicht bij promotie. T39 controleert nul en negatieve foutaantallen. |
| Browserkwalificatie vereiste een model dat zonder dat bewijs nog niet naar productie mocht | [07](07-neural-network.md#discovery-standaardselectie-en-promotie) en [12](12-quality-testing.md#kernflows-fouten-en-traceerbaarheid) definiëren expliciete candidate-injectie in een ontwikkel-/testcompositie. Export bevat echte, eerlijk gedeeltelijke rapporten; T38–T42 vullen die aan vóór promotie. De productiecatalogus blijft beperkt tot promoted modellen, ook in FR-04, US-03, T28 en [ADR 0036](adr/0036-model-and-locale-discovery.md). |
| Exact gelijke vertaalsleutels botsten met talen met andere meervoudscategorieën | [08](08-frontend.md) vergelijkt logische basiskeys en valideert vereiste pluralvormen per taal. [15](15-extension-guides.md), ADR 0036 en T27/T51 gebruiken dezelfde regel. |
| Vooruitwijzingen naar nog te schrijven batches en enkele termen waren verouderd | Goedgekeurde uitwerkingen zijn gelinkt; MVP-i18n en toegankelijkheid zijn volledig benoemd, meetprofielen zijn onderscheiden van nog te regelen voorzieningen, Figma-toolbeschikbaarheid is gedateerd en zinkinformatie gebruikt de exacte contractnaam. De [glossary](glossary.md), betrokken ADR’s en deze leeswijzer volgen dezelfde terminologie. |

Open punten blijven [Q-02/03/04/06](#centrale-open-punten), op hun bestaande beslismomenten. De iPhone 16 Pro blijft het gekozen fysieke iOS-toestel; de aanvullende middenklasse-/Safari-tracevoorziening blijft vóór de betreffende meting nodig. De stijlkeuze blijft expliciet vóór designgeneratie.

Verificatie uitgevoerd: metadata, inventarisstatussen en gesloten codeblokken van 72 Markdown-documenten; 1.422 lokale links/anchors; secties en unieke IDs van alle 50 ADR’s; 78 unieke contractdefinities. Alle 39 requirements blijven gekoppeld aan 29 stories, 87 acceptatietests en 59 volledige taakdefinities. De dependencygrafiek is acyclisch; de sluiting van T33 omvat exact T01–T33, die van T56 exact T01–T56, zonder T57–T59.

Tijdelijke rekencontroles bevestigen de klassieke JSON, de 17-cellige no-touch-opstelling, vier regelsignaturen/twee strategiesignaturen, de PCG32-referentievector, Easy’s gemiddelde/mediaan, CNN-parameter-/gewichtsaantal en receptive field. Alle twaalf gedocumenteerde contrastverhoudingen, de 19 componentnamen in brief/mapping en de twaalf route-/schermnamen komen overeen. TOML parseert met zeven uitgeschakelde servers; AGENTS en de oorspronkelijke masterprompt zijn ongewijzigd, inclusief SHA-256 van de bronopdracht. De diff bevat uitsluitend documentatie en slaagt voor de whitespacecontrole.

Dit verifieert documenten en rekenvoorbeelden, niet de toekomstige software. Er zijn geen applicatie-/browser-/toesteltests uitgevoerd; er bestaat nog geen applicatie. De zeven MCP-profielen blijven uitgeschakeld en externe inrichting is niet gestart.

Fase 3 is volgens [masterprompt §15](00-masterprompt.md#15-werkwijze-voor-deze-opdracht) goedgekeurd. Na de commit begint fase 4 met activatie en volledige MCP-verificatie; externe inrichting volgt pas na zeven geslaagde controles.


## Hervatpunt fase 4 — 2026-11-02

Fase 3 is goedgekeurd en gecommit als `a317a44`. De geautoriseerde MCP-activatie staat in de projectconfiguratie: zeven enabled-entries, gereviewde projectdefaults, Playwright MCP `0.0.84` en Chrome DevTools MCP `1.12.0`. De CLI leest exact deze zeven entries; trust en de benodigde GitHub-/W&B-variabelen waren al aanwezig. Context7 erft bestaande authenticatie uit de persoonlijke config; die is niet naar de repo gekopieerd.

Alle zeven MCP-verbindingstests slagen. De opgegeven Notion-pagina was vóór inrichting leeg en leesbaar. Na de accountwissel meldt Figma **Cas Doorn**, Education/Full in team SinkTheShip; de bestandssessie opent en Page 1 is leesbaar. De huidige Chrome-tool opent example.com en leest de console succesvol. Het [volledige verificatieverslag](16-tooling-mcp.md#verificatieverslag-2026-11-02) bevat per server het bewijs.

De ontwikkelaar heeft het aanmaken van privé `Cas0570/sinktheship` en pushen afzonderlijk goedgekeurd. De repository is aangemaakt, de geschiedenis staat op `main` en het private project 3 is eraan gekoppeld. Alle 59 taakdefinities hebben een teruggelezen issue en kaart, correcte labels/mijlpalen en ingevulde projectvelden. Boardgroepering op Status en de tabelkolommen zijn gecontroleerd. GitHub reserveert `Type`; [ADR 0012](adr/0012-github-projects.md) documenteert de gelijkwaardige veldnaam `Work type`.

Het [handboek](https://app.notion.com/p/40c275fb04ba81da945cee04d24413bb) bevat de vijf gevraagde pagina’s, 50 ADR-links en de lege database ML-experimenten met de vereiste verslagvelden. Alle pagina’s en het databaseschema zijn teruggelezen. W&B heeft nog geen project; het handboek linkt naar de geverifieerde entity en verzint geen run- of projectlink.

Verificatie uitgevoerd: 72 Markdown-bestanden, 1.440 lokale links/anchors, metadata, codeblokken, 50 ADR’s en 78 unieke contractdefinities. De koppeling van 39 requirements naar 29 stories, 87 geplande tests en 59 taakdefinities blijft volledig; de dependencygrafiek en releaseafhankelijkheden zijn ongewijzigd. Alle 59 issue-/kaartkoppelingen, labels, mijlpalen en veldwaarden zijn gecontroleerd. De oorspronkelijke masterprompt en AGENTS zijn behouden; TOML en whitespacecontroles slagen. Dit zijn document- en inrichtingscontroles, geen uitgevoerde applicatietests.

De laatste workflowcontrole is afgerond: de aangeleverde screenshots tonen beide Done-workflows On met doel Status: Done en Auto-close issue Off. De aansluitende GraphQL-query bevestigt enabled `true`, `true`, `false`. Dit verifieert de configuratie; de eerste echte merge in M0 moet later de automatische issue-/statusovergang aantonen. De eerste kaart is volgens ADR 0012 vrijgegeven en teruggelezen; het bord blijft de enige taakstatusbron.

**Fase 4 goedgekeurd op 2026-11-02.** De ontwikkelaar heeft akkoord gegeven op de afgeronde inrichting en vervolgens gevraagd na het vastleggen en committen daarvan te stoppen. De documentatie- en inrichtingsopdracht is daarmee afgerond. Er is geen bouwtaak gestart; T01 krijgt in deze afronding geen implementatie of branch.

**Hervatten:** wacht op een nieuw verzoek om met de bouw te beginnen. Lees dan eerst het bord, inclusief In progress, Review en Blocked, en volg AGENTS voor de eerste beschikbare Ready-taak. De Figma-stijlkeuze blijft vóór M3 open; W&B-projectkeuze en meetvoorzieningen blijven op hun bestaande latere beslismomenten.

De Notion-koppeling is hersteld en de fase-4-goedkeuring is ook op de handboekhoofdpagina vastgelegd. De ontwikkelaar heeft vervolgens gevraagd alle voorbereidingen te pushen, main te beveiligen en daarna te stoppen vóór T01.

De volledige bordlezing bevestigt dat geen bestaande In progress-, Review- of Blocked-taak eerst afgehandeld hoeft te worden; T01 heeft geen taakafhankelijkheden. De actuele taakstatus blijft op het bord. De nieuwe PR-grens staat in AGENTS, ADR 0050 en het [beveiligingsverslag](16-tooling-mcp.md#beveiliging-van-main). Lokale hooks zijn getest. Op expliciet verzoek is de repository vervolgens openbaar gemaakt. Ruleset 26368853 is actief zonder bypasses; de effectieve regels verplichten pull requests en blokkeren force-pushes en verwijdering van main. De eerdere abonnementsblokkade is opgelost. De vastlegging hiervan gaat via een aparte voorbereidings-PR; die moet vóór de eerste bouwtaak worden beoordeeld en gemerged.

**Startprompt voor een nieuwe chat:**

> Lees AGENTS.md, docs/00-masterprompt.md en docs/README.md. Controleer eerst of de main-beveiliging actief is en de lokale Git-hooks zijn ingeschakeld. Lees via GitHub MCP het Projects-bord, inclusief In progress, Review en Blocked. Volg de taakvolgorde uit AGENTS.md en voer precies één beschikbare Ready-taak uit; als het bord ongewijzigd is, is dat T01. Werk op een taakbranch, voer de relevante checks uit, werk docs en Notion bij en open een PR met de voorgeschreven reviewsamenvatting. Zet de taak op Review en stop voor mijn beoordeling. Merge niet zonder mijn expliciete goedkeuring. Bij een ontbrekende voorwaarde: meld die en start geen andere taak.

De bouw is tijdens deze voorbereiding niet gestart.

## Ingang voor de bouw

De voorbereidings-PR [#60](https://github.com/Cas0570/sinktheship/pull/60) is op 2026-11-02 na expliciet akkoord gemerged. De historische fase-4-stop hierboven beschrijft de eerdere overdracht. De actuele [quick start](../README.md#quick-start) beschrijft de workspace, compilerprofielen en grenscontroles; [ADR 0002](adr/0002-pnpm-monorepo.md#bootstrap-in-t01) legt de pins vast. Implementatiestatus blijft uitsluitend op het Projects-bord. Een lege Vite-ingang is geen speelbare app; UI- en ML-inrichting volgen in hun eigen taken.

De [eerste CI-poort](12-quality-testing.md#eerste-ci-poort) beschrijft de beschikbare lint-/format-/testchecks, artefacten en de expliciet nog niet gebouwde testlagen. De [lintconfig-README](../packages/eslint-config/README.md) is de ingang voor het uitbreiden van toolingregels. Status en uitvoeringsbewijs blijven op het bord en in de gekoppelde PR/issue.

De [bijdragehandleiding](../CONTRIBUTING.md) verbindt de schone checkout, huidige module-ingangen, proefreview en PR-overdracht. De [PR-template](../.github/pull_request_template.md) vraagt concreet uitvoeringsbewijs. De module-README’s onderscheiden gerealiseerde configexports en lege domeiningangen van geplande contracten.


De [game-core-README](../packages/game-core/README.md) beschrijft de eerste regel-API en reproduceerbare tests. De schemavoorcontrole uit [ADR 0051](adr/0051-staged-rule-validation.md) staat los van de volledige plaatsbaarheidsvalidatie. De [testtooling-ADR](adr/0040-test-tooling.md) beschrijft de propertytestpins en coveragepoort. Taakstatus en reviewbesluit blijven op GitHub.

De [plaatsings-API](../packages/game-core/README.md#plaatsing-en-bewijs) ontsluit geometrie, draftcontrole en deterministisch plaatsbaarheidsbewijs. [ADR 0052](adr/0052-placement-validation-api.md) motiveert de aanvullende API. Gedeelde plaatsingsfixtures en begrensde bewijsproeven staan bij de coretests; enginecommands en Pythonpariteit volgen afzonderlijk.

De [RNG-handleiding](../packages/game-core/README.md#reproduceerbare-randomness) beschrijft PCG32, expliciete seedparen, gescheiden stromen en herstelbare snapshots. De aanvullende [seed-/factory-API](adr/0053-rng-seeding-api.md) is op 2026-11-04 goedgekeurd; de bestaande integer- en stroomgrenzen uit document 05 blijven leidend.
