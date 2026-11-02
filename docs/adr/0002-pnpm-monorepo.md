Status: Geaccepteerd

Versie: 1.1

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

Iedere package heeft README, API, eigen tests en gedeelde config. De buildgraaf volgt gedeclareerde imports. Er wordt nu geen manifest, lockfile of dependency-installatie aangemaakt; setup is een latere bouwtaak.

## Verificatie

US-20/US-24; toekomstige clean-checkout-installatie, package-exportchecks en verboden-importfixtures. De structuur is gedocumenteerd, nog niet opgebouwd.
