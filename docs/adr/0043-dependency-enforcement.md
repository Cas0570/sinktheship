Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

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

Nieuwe dependencies vereisen aanpassing van manifest én toegestane graaf met ADR-review. Geen brede testuitzondering die productie-imports alsnog toestaat; testhelpers krijgen expliciete testscope. Configpackages behouden hun eigen laad-/validatiechecks. Geen installatie of CI-configuratie in deze batch.

## Verificatie

US-07, US-20/24: negatieve fixtures voor React in core, cross-package relative/deep imports, typecycli, verboden state-import en namespaceomzeiling; legale imports moeten wel slagen. Checks zijn gepland, nog niet actief.
