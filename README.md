Status: Geaccepteerd

Versie: 1.3

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Leeswijzer](docs/README.md), [scope](docs/01-product-vision-scope.md), [roadmap](docs/13-roadmap.md), [werkinstructies](AGENTS.md)

# SinkTheShip

SinkTheShip wordt een browsergame om neural networks te leren begrijpen: een configureerbaar zeeslagspel met uitlegbare tegenstanders en een zelf trainbaar model. De ontwikkelaar reviewt iedere bouwtaak en moet de code daarna zelfstandig kunnen uitbreiden.

De repository bevat nu specificaties, ADR's en een geverifieerde MCP-configuratie. Er is nog geen speelbare app, getraind model, package-installatie of werkende ontwikkelserver. De actuele documentatiefase, besluiten en externe projectlinks staan in de [leeswijzer](docs/README.md).

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

De bouw begint pas na goedkeuring van de documentatie, de consistentiecheck en fase 4. Dan zijn alle zeven MCP-servers geverifieerd, het Projects-bord ingericht en het Notion-handboek beschikbaar. [.codex/config.toml](.codex/config.toml) bevat nu zeven ingeschakelde projectprofielen. Alle zeven verbindingstests zijn geslaagd volgens het [verificatieverslag](docs/16-tooling-mcp.md#verificatieverslag-2026-11-02). De privérepository, het bord met 59 issues en het handboek zijn ingericht. Ook de [Projects-workflows](docs/16-tooling-mcp.md#externe-inrichting-2026-11-02) zijn geverifieerd. De ontwikkelaar heeft fase 4 op 2026-11-02 goedgekeurd. De documentatie- en inrichtingsopdracht is afgerond; op verzoek van de ontwikkelaar stopt het werk na het vastleggen en committen van dit akkoord. De bouw is nog niet gestart.

### Quick start na implementatie

Onderstaande commando's zijn het te leveren contract voor [T01](docs/14-backlog.md#t01) en de opvolgende taken. Ze werken nog niet in deze docs-only repository. T01 legt ondersteunde Node- en pnpm-versies vast; het ML-spoor legt Python en uv vast. Gebruik daarna de versies en lockfiles uit de repository.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` moet de lokale webapp starten en de URL tonen. De frozen installatie gebruikt de bestaande lockfile en weigert een ontbrekende of verouderde lockfile; zie de [pnpm-installatiedocumentatie](https://pnpm.io/cli/install), via Context7 gecontroleerd op 2026-11-01. Voor de ontwikkelaar die met ML begint, beschrijft [document 07](docs/07-neural-network.md) de afzonderlijke dataset-, train-, evaluatie-, export- en publicatiecommando's. De ML-omgeving wordt met de vastgelegde uv-lockfile geïnstalleerd; installatie en training zijn geen vereiste om een bestaande webbuild te spelen.

De dagelijkse controlecommando's worden `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test` en `pnpm build`. Browser-, pariteits-, benchmark- en releasechecks volgen de [kwaliteitsmatrix](docs/12-quality-testing.md); voer de checks uit die bij de wijziging horen. Deze pagina claimt geen geslaagde runs.

## Code vinden en uitbreiden

De [modulecatalogus](docs/04-architecture.md#modulecatalogus) beschrijft de geplande packages en importgrenzen. `game-core` beheert de regels; `opponents` de strategieën; `game-session` het sessieverloop; `opponent-neural` de modelcontracten; `ui` de presentational componenten; `benchmark` de evaluatie. `apps/web` verbindt ze. `apps/server` krijgt in v1 alleen een README.

Elke module krijgt een README met doel, publieke API, voorbeeld en uitbreidingsstappen. De [zes uitbreidingsgidsen](docs/15-extension-guides.md) zijn de ingang voor een tegenstander, preset, model, taal, scherm of Figma-component. Nederlands is de documenttaal; code, identifiers, codecomments en commits zijn Engels.

De repo specificeert, [GitHub Projects](https://github.com/users/Cas0570/projects/3) houdt taakstatus bij en het [Notion-handboek](https://app.notion.com/p/40c275fb04ba81da945cee04d24413bb) legt de werkwijze uit met links naar de repo. Alle [projectlinks en resterende beslispunten](docs/README.md#externe-projectlinks) staan in de leeswijzer.
