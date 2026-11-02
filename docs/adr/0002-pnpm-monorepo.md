Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Masterprompt](../00-masterprompt.md), [architectuur](../04-architecture.md), [packagegrenzen](0021-package-boundaries.md), [leeswijzer](../README.md)

# ADR 0002 — pnpm-workspaces

## Besluitbasis

Vast besluit uit hoofdstuk 4; de workspacegrenzen worden gepreciseerd binnen het goedgekeurde plan.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Core, bots, sessie, UI en benchmark hebben afzonderlijke publieke API's maar moeten samen kunnen worden gewijzigd, gecontroleerd en gereviewd.

## Besluit

Eén pnpm-workspace met applicaties en packages volgens 04, één vastgelegde pnpm-versie en lockfile. Interne dependencies gebruiken `workspace:*`; productimports lopen via expliciete rootexports. Python heeft een eigen omgeving volgens [ADR 0041](0041-python-tooling.md) en wordt niet door pnpm als Python-package beheerd.

## Onderbouwing en alternatieven

De masterprompt bepaalt pnpm. De [officiële workspacedocumentatie](https://github.com/pnpm/pnpm.io/blob/main/docs/workspaces.md), via Context7 geraadpleegd op 2026-10-31, bevestigt dat het workspaceprotocol lokale resolutie afdwingt. Losse repositories maken gezamenlijke contractwijzigingen en fixtures lastiger; één ongestructureerde applicatiemap biedt geen packagegrenzen. npm/yarn zijn alternatieven voor toekomstige herziening, geen wijziging binnen deze opdracht.

## Gevolgen

Iedere package heeft README, API, eigen tests en gedeelde config. De buildgraaf volgt gedeclareerde imports. De bootstrap hieronder levert manifests, lockfile en installatie voor T01.

## Verificatie

US-20/US-24; clean-checkout-installatie, package-exportchecks en verboden-importfixtures worden lokaal gecontroleerd met de grenssuite uit T01.

## Bootstrap in T01

De workspace gebruikt Node **26.8.1** en pnpm **10.33.3**, gelijk aan de geverifieerde lokale toolchain. Dit zijn exacte reproduceerbaarheidspins, geen claim dat dit altijd de nieuwste of aanbevolen LTS-versies zijn. Node voldoet aan de engines van Vite en dependency-cruiser. pnpm-enginecontrole en strikte packageManager-versiecontrole voorkomen onbedoeld installeren met een andere toolchain.

De bestaande besluiten worden ingevuld met TypeScript **5.9.3** (compiler én parser-API voor grenschecks), Vite **8.3.5**, dependency-cruiser **18.7.1**, `@types/node` **26.6.6** en React **19.3.1** als UI-peer/provider. TypeScript 5.9.3 biedt de benodigde references en exports; een sprong naar de inmiddels beschikbare 7.x is niet nodig voor bootstrap en wordt niet stilzwijgend meegenomen. De dependencies zijn beperkt tot de reeds gekozen middelen uit ADR 0001/0043; Node-typen ondersteunen het Node-compilerprofiel. Lockfile en manifests leggen directe en transitieve versies vast.

Geen frameworkscaffolder: een lege HTML-/TS-entry voorkomt demo-UI buiten T01. React-rendering, Tailwind en i18n worden in de frontendtaken ingericht. `eslint-config` heeft een laadbare lege configexport voor T02. Python, modeldata en fixtures hebben alleen hun afzonderlijke documentatiegrens; `apps/server` bevat uitsluitend een README.

Bronnen op 2026-11-02 via Context7: [workspaces](https://pnpm.io/workspaces), [compilerreferences](https://www.typescriptlang.org/docs/handbook/project-references.html), [Vite-ingang](https://vite.dev/guide/) en [dependency-cruiser](https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md). Versies en engines zijn daarnaast uit de npm-registry gelezen; de clean-install-/compileproeven controleren de combinatie daadwerkelijk.
