Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Architectuur](../04-architecture.md), [pure core](0003-framework-free-core.md), [packagegrenzen](0021-package-boundaries.md), [leeswijzer](../README.md)

# ADR 0043 — Imports, package-exports en project references bewaken

## Besluitbasis

Automatische grensbewaking is vast. Het behoud van dependency-cruiser naast TypeScript project references is het fase-1-voorstel, hier uitgewerkt.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Mappen en TypeScript-typen verhinderen geen deep imports, omgekeerde dependencies, typecycli of toegang tot geprivilegieerde coreexports.

## Besluit

Gebruik expliciete package-rootexports, `workspace:*`, project references en dependency-cruiser met de DAG uit 04 als allowlist. Neem type-only imports mee via `tsPreCompilationDeps`; verbied ook typecycli. Lint controleert verboden globals en named imports. Bots/schermen mogen alleen hun toegestane symbolen importeren; namespace-/wildcardimports mogen die symboolcontrole niet omzeilen. Compilerprofielen scheiden pure TS, browser en Node.

## Onderbouwing en alternatieven

Project references met `composite`/declarations regelen buildvolgorde en outputs, geen volledige architectuurautorisatie. Alleen ESLint per bestand geeft minder direct zicht op de hele graaf. `eslint-plugin-boundaries` is een bruikbaar alternatief, maar de bestaande voorkeur voor dependency-cruiser dekt de gewenste graaf- en cycluscontroles; er is nu geen reden voor twee overlappende grensframeworks.

Bronnen via Context7, 2026-10-31: [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html), [dependency-cruiser options](https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md) en [rules](https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md).

## Gevolgen

Nieuwe dependencies vereisen aanpassing van manifest én toegestane graaf met ADR-review. Geen brede testuitzondering die productie-imports alsnog toestaat; testhelpers krijgen expliciete testscope. Configpackages behouden hun eigen laad-/validatiechecks. T01 installeert de grenscontrole; T02 levert de CI-configuratie.

## Verificatie

US-07, US-20/24: negatieve fixtures voor React in core, cross-package relative/deep imports, typecycli, verboden state-import en namespaceomzeiling; legale imports moeten wel slagen. De packagegrenschecks zijn actief in T01; symbolische lintregels volgen in T02 en bij de concrete domein-API’s.

## Uitvoering van de packagegrens in T01

`pnpm check:boundaries` combineert dependency-cruiser met een kleine TypeScript-AST-/manifestcontrole. De graaf staat in `scripts/package-graph.json` en volgt 04. De extra controle is nodig omdat de opgeloste bestandsnaam alleen niet toont of een import via een verboden `src`-/`dist`-specifier of een relatief pad liep. Zij controleert ook type-importexpressies, re-exports, letterlijke dynamische imports, workspaceprotocollen, gedeclareerde dependencies en bijpassende projectreferences. Niet-letterlijke modulepaden en lokale TS-pathaliases zijn niet toegestaan.

De core mag geen dependencies, optionalDependencies of peerDependencies hebben; ontwikkelconfiguratie blijft dev-only. Publieke rootexports verwijzen naar gebouwde JS/declarations. Configpackages hebben expliciete extra configexports. Dependency-cruiser controleert ook type-only cycli. De geïsoleerde positieve/negatieve fixtures staan in `scripts/boundaries.test.mjs` en draaien via `pnpm test:boundaries`.

T02 voegt ESLint toe voor verboden globals (zoals `Math.random`/`Date`) en symbolische toegangsrechten. T01 claimt deze toekomstige lintregels niet: het pure compilerprofiel weert nu al DOM, Node en timers, maar ES-globals bestaan nog. De product-API’s zijn leeg; tests op privéstate-symbolen worden zinvol zodra die contracten bestaan.
