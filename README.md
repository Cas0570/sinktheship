Status: Geaccepteerd

Versie: 1.7

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Leeswijzer](docs/README.md), [scope](docs/01-product-vision-scope.md), [roadmap](docs/13-roadmap.md), [werkinstructies](AGENTS.md)

# SinkTheShip

SinkTheShip wordt een browsergame om neural networks te leren begrijpen: een configureerbaar zeeslagspel met uitlegbare tegenstanders en een zelf trainbaar model. De ontwikkelaar reviewt iedere bouwtaak en moet de code daarna zelfstandig kunnen uitbreiden.

De repository bevat specificaties, ADR's, de geverifieerde MCP-configuratie en een compileerbare pnpm-workspace met Vite-startserver. De pagina is bewust leeg: er is nog geen speelbare app of getraind model. De actuele documentatiefase, besluiten en externe projectlinks staan in de [leeswijzer](docs/README.md).

## Wat we bouwen

| Onderdeel | Afgesproken resultaat |
|---|---|
| Spel | Klassiek, Nog eens bij raak, Ruimte tussen schepen en beperkte eigen instellingen; zie [regels](docs/02-game-rules.md) |
| MVP | Een volledig lokaal spel tegen Easy, Normal of Hard, inclusief hervatten, rematch, toetsenbord/touch en Engels/Nederlands |
| v1.0 | Ook Impossible bij aantoonbaar compatibele, gekwalificeerde modellen, met reproduceerbare CPU-training en evaluatie |
| Architectuur | React/Vite/strict TypeScript/Tailwind, pnpm-workspaces, dependency-vrije spelkern, één Game Worker en vervangbare adapters |
| ML | PyTorch-training, ONNX-export, inferentie in de browserworker, experimenten in W&B met offline mogelijkheid |
| Later | Private multiplayer en quick play; geschiedenis, offline/PWA en dark mode zijn afzonderlijke Could-taken |

Impossible is een productnaam, geen garantie op onverslaanbaarheid. De [benchmark](docs/06-opponents.md) en [modelpromotie](docs/07-neural-network.md) bepalen of een kandidaat het niveau mag leveren. Multiplayer blijft in v1 bij gereserveerde routes en het [toekomstontwerp](docs/11-multiplayer-future.md).

Gebruikersaccounts worden in v1 en de eerstvolgende releases niet gebouwd of gebruikt. Dit is een bewuste keuze voor nu; accounts kunnen in een latere release worden toegevoegd.

## Beginnen met deze repository

Lees voor de huidige opdracht [masterprompt](docs/00-masterprompt.md) → [voortgang](docs/README.md#voortgang-en-hervatten). Voor productreview: [scope](docs/01-product-vision-scope.md) → [stories](docs/03-user-stories.md) → [roadmap](docs/13-roadmap.md). Voor bouwen: [AGENTS.md](AGENTS.md) → [architectuur](docs/04-architecture.md) → de taak uit de [backlog](docs/14-backlog.md).

De bouw begint pas na goedkeuring van de documentatie, de consistentiecheck en fase 4. Dan zijn alle zeven MCP-servers geverifieerd, het Projects-bord ingericht en het Notion-handboek beschikbaar. [.codex/config.toml](.codex/config.toml) bevat nu zeven ingeschakelde projectprofielen. Alle zeven verbindingstests zijn geslaagd volgens het [verificatieverslag](docs/16-tooling-mcp.md#verificatieverslag-2026-11-02). De repository, het bord met 59 issues en het handboek zijn ingericht. Ook de [Projects-workflows](docs/16-tooling-mcp.md#externe-inrichting-2026-11-02) zijn geverifieerd. De ontwikkelaar heeft fase 4 op 2026-11-02 goedgekeurd. De documentatie- en inrichtingsopdracht is afgerond. De voorbereidende [PR #60](https://github.com/Cas0570/sinktheship/pull/60) is na menselijk akkoord gemerged. Bouwtaken volgen de bordvolgorde en PR-afspraken.

### Git voorbereiden

Activeer in iedere nieuwe clone de lokale branchbeveiliging:

```sh
git config --local core.hooksPath .githooks
```

Maak wijzigingen op een taakbranch en open een pull request; merge pas na menselijke goedkeuring. De [hooks](.githooks/README.md) blokkeren lokale commits en pushes naar main. Controleer ook de [actuele serverbeveiliging](docs/16-tooling-mcp.md#beveiliging-van-main) vóór de eerste bouwtaak; de openbare repository heeft een actieve ruleset die pull requests verplicht en directe pushes, force-pushes en verwijdering van main blokkeert.

### Quick start

Gebruik **Node 26.8.1** (`.node-version`/`.nvmrc`) en **pnpm 10.33.3** (`packageManager`). De exacte engines worden tijdens installatie gecontroleerd. Gebruik je eigen Node-versiebeheerder en installeer zo nodig `pnpm@10.33.3`; een upgrade is een afzonderlijke gereviewde wijziging.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open de getoonde loopback-URL. De HTML-ingang is bewust leeg met titel SinkTheShip; dit bewijst de ontwikkelserver, nog geen spel-UI. Stop met Ctrl+C. Installeren vereist registrytoegang wanneer de pnpm-store niet compleet is.

```sh
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

`typecheck` compileert strict projectreferences en levert library-JS/declarations. `check:boundaries` controleert manifests, publieke imports en de importgraaf inclusief typecycli. `test:boundaries` maakt een tijdelijke schone kopie, installeert de frozen lockfile en compileert positieve/negatieve import- en omgevingsproeven; zij verwijdert de kopie na afloop. `build` voert typecheck en grenscontrole uit en levert de statische Vite-output in `apps/web/dist/`.

`pnpm lint` combineert ESLint met de grenscontrole. `pnpm test` draait de Vitest-toolingtests en daarna de geïsoleerde Node-grenssuite. Er is nog geen spelgedrag en dus geen productcoverageclaim. `pnpm format:check` controleert broncode/configuratie en de letterlijke masterprompt-hash; `pnpm format` past die broncode-opmaak toe. Handgeschreven Markdown wordt in deze bootstrap niet massaal geherformatteerd; de masterprompt staat bovendien expliciet in `.prettierignore`.

De [Quality-workflow](.github/workflows/quality.yml) draait `quality-ts` en `web-build` op PR’s en main-pushes. Diagnostiek en buildartefacten blijven 14 dagen beschikbaar, met commit-SHA in de naam. Browserinrichting volgt in T03. De [CI-werkwijze](docs/12-quality-testing.md#eerste-ci-poort) beschrijft controles, foutproeven en beperkingen. Python/uv, ML-training en modelbestanden volgen in het afzonderlijke [ML-spoor](docs/07-neural-network.md).

De versiekeuze en afbakening staan in [ADR 0002](docs/adr/0002-pnpm-monorepo.md#bootstrap-in-t01); de volledige normen blijven in [kwaliteit](docs/12-quality-testing.md).

## Code vinden en uitbreiden

De [modulecatalogus](docs/04-architecture.md#modulecatalogus) beschrijft de packages en importgrenzen. De package-ingangen bestaan; domein-API’s volgen in de eigen taken. `game-core` beheert de regels; `opponents` de strategieën; `game-session` het sessieverloop; `opponent-neural` de modelcontracten; `ui` de presentational componenten; `benchmark` de evaluatie. `apps/web` verbindt ze. `apps/server` krijgt in v1 alleen een README.

Elke module heeft een README met doel, publieke API, voorbeeld en uitbreidingsstappen. De [zes uitbreidingsgidsen](docs/15-extension-guides.md) zijn de ingang voor een tegenstander, preset, model, taal, scherm of Figma-component. Nederlands is de documenttaal; code, identifiers, codecomments en commits zijn Engels.

De repo specificeert, [GitHub Projects](https://github.com/users/Cas0570/projects/3) houdt taakstatus bij en het [Notion-handboek](https://app.notion.com/p/40c275fb04ba81da945cee04d24413bb) legt de werkwijze uit met links naar de repo. Alle [projectlinks en resterende beslispunten](docs/README.md#externe-projectlinks) staan in de leeswijzer.
