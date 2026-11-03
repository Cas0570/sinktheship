# Bijdragen aan SinkTheShip

[AGENTS.md](AGENTS.md) bepaalt de werkwijze; deze handleiding maakt de bestaande setup en reviewstappen uitvoerbaar. Taakdefinities staan in [14](docs/14-backlog.md), status en prioriteit uitsluitend op het [Projects-bord](https://github.com/users/Cas0570/projects/3).

## Starten vanaf een schone checkout

Installeer de exacte Node- en pnpm-versies uit de [quick start](README.md#quick-start) met je eigen versiebeheerder. Git en toegang tot GitHub/npm zijn nodig; applicatiechecks vereisen geen MCP-tokens. Externe bord-/handboekacties gebruiken de [MCP-inrichting](docs/16-tooling-mcp.md), met secrets buiten de repo.

```sh
git clone https://github.com/Cas0570/sinktheship.git
cd sinktheship
git config --local core.hooksPath .githooks
git config --get core.hooksPath
node --version
pnpm --version
pnpm install --frozen-lockfile
```

Verwacht `.githooks`, Node `v26.8.1` en pnpm `10.33.3`. Een verouderde lockfile is een fout: omzeil frozen installatie niet voor een schijnbaar groene setup. Een onvolledige pnpm-store vereist registrytoegang; offline installatie is niet gegarandeerd.

Controleer vóór edits het bord, de actieve [main-regels](docs/16-tooling-mcp.md#beveiliging-van-main) en `git status --short`. Rond In progress/Review eerst af. Start de bovenste Ready-taak met afgeronde dependencies. Als Ready leeg is, controleer dependencies, externe voorwaarden en ontwikkelaarsprioriteit volgens [ADR 0012](docs/adr/0012-github-projects.md); geef geen taak vrij uitsluitend op nummer. Maak vervolgens de taakbranch `tNN-short-description` en zet de gekozen kaart In progress.

Volg de rootchecks:

```sh
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm typecheck:e2e
```

Verwacht geen fouten, JUnit in `.artifacts/vitest.xml` en een statische build in `apps/web/dist/`. `pnpm test` draait zowel tooling-/componentproeven als een tijdelijke, geïsoleerde grenssuite; de installatie daarin kan registrytoegang gebruiken. `pnpm dev` start daarna de lege pagina met titel SinkTheShip. Dit is nog geen speelbaar spel.

De [browsertesthandleiding](tests/README.md) beschrijft de browserinstallatie, `pnpm check:browser-retry` en `pnpm test:e2e`, inclusief de lokale Manjaro/WebKit-beperking. Een gedeeltelijke lokale run vervangt de volledige Ubuntu-CI-matrix niet.

## De juiste ingang kiezen

Begin bij de [module-README-links](README.md#code-vinden-en-uitbreiden). De manifestexports en `src/index.ts` laten zien wat werkelijk bestaat; de [contractcatalogus](docs/04-architecture.md#contractcatalogus) beschrijft daarnaast toekomstig gedrag. Een lege export is geen geïmplementeerde API. Configpackages hebben wél uitvoerbare exports; apps/web is een app-entry en apps/server alleen toekomstontwerp.

Gebruik publieke exports en de toegestane richting uit `scripts/package-graph.json`. Voeg een API met implementatie, passende tests, README-voorbeeld en contractverwijzing in dezelfde PR toe. Nieuwe dependencies of contractafwijkingen vragen een onderbouwde ADR. De [uitbreidingsgids](docs/15-extension-guides.md) benoemt de voorwaarden voor toekomstige bot-, preset-, model-, taal- en schermuitbreidingen.

## Een reviewbare PR opleveren

1. Test wat de taak verandert volgens [12](docs/12-quality-testing.md). Bij alleen documentatie: voer nieuwe commando's/voorbeelden echt uit en controleer links; verzin geen producttestbewijs.
2. Gebruik een Engelse Conventional Commit met taak-ID, bijvoorbeeld `docs(T04): clarify module entry points`. Push de taakbranch en open een PR naar `main` met `Closes #<issue>`.
3. Vul de [PR-template](.github/pull_request_template.md) concreet in en plaats dezelfde reviewsamenvatting als issuecomment. Vermeld echte commando's, uitkomsten, beperkingen, handmatige stappen, reviewfocus en repo-/Notion-/bordwijzigingen.
4. Controleer de CI op de laatste commit en de artefacten. PR-artefactnamen bevatten GitHubs geteste mergecommit; de Actions-run vermeldt ook de branch-head. Zet de kaart Review en stop voor menselijke beoordeling.
5. Verwerk feedback op dezelfde branch/PR. Leg het expliciete menselijke akkoord in het PR-gesprek vast, ook als dat eerst in de chat is gegeven; vermeld dat de agent het akkoord registreert. Merge pas daarna. Lees merge, gekoppelde issueafsluiting en Done-overgang terug. Alleen een verplaatste kaart bewijst geen afgeronde taak.

Setup-/werkwijzewijzigingen krijgen eerst een gelezen en daarna bijgewerkte Notion-handboekpagina met repo-links. Niet-gelukte externe acties worden concreet gemeld en later na teruglezen hersteld. Een release of mijlpaal krijgt pas na werkelijke afronding bewijslinks en release notes volgens AGENTS; een PR in Review is nog geen afgeronde mijlpaal.

## Een proefreview uitvoeren

Lees van T01–T03 de gekoppelde issues [1](https://github.com/Cas0570/sinktheship/issues/1), [2](https://github.com/Cas0570/sinktheship/issues/2), [3](https://github.com/Cas0570/sinktheship/issues/3) en PR's [61](https://github.com/Cas0570/sinktheship/pull/61), [62](https://github.com/Cas0570/sinktheship/pull/62), [63](https://github.com/Cas0570/sinktheship/pull/63). Vergelijk scope, closing keyword, reviewsamenvatting in beide gesprekken, daadwerkelijk CI-/lokaal bewijs en de teruggelezen bordstatus. T01 had nog geen CI; T02 leverde twee jobs, T03 voegde de browserjob toe. Beoordeel iedere wijziging tegen de toen beschikbare checks. Leg de uitkomst in het actuele reviewgesprek vast, niet in een tweede Markdown-statuslijst.

Bron voor de CLI-voorbeelden, via Context7 gecontroleerd: [pnpm filtering](https://pnpm.io/filtering), [exec](https://pnpm.io/cli/exec) en [frozen installatie](https://pnpm.io/cli/install#--frozen-lockfile). De voorbeelden worden daarnaast met de gepinde projectversie uitgevoerd.
