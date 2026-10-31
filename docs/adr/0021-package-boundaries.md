Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Architectuur](../04-architecture.md), [engine](../05-game-engine.md), [grenscontrole](0043-dependency-enforcement.md), [leeswijzer](../README.md)

# ADR 0021 — Afzonderlijke sessielaag en gerichte adapters

## Besluitbasis

Uitwerking van het goedgekeurde voorstel voor `packages/game-session`.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Pure regels lossen async botkeuzes, opslag, retries, annulering en hervatten niet op. Dezelfde coördinatie is relevant in browser en benchmark; later moet de UI op een remote sessie kunnen aansluiten.

## Besluit

Voeg `game-session` toe aan de voorgestelde structuur. Deze package kent core en het opponentcontract, maar geen React, browserstorage of ONNX-runtime. `SessionPort` exposeert intents, views, publieke events en herstel. Eén Game Worker draait de lokale sessie en alle botberekeningen. Browseradapters staan in `apps/web`; de Node-runner bij benchmark. `ui` bevat alleen presentational components. De concrete DAG en ports staan in 04.

## Onderbouwing en alternatieven

Coördinatie uitsluitend in `apps/web` koppelt Node-evaluatie en latere remote adapters aan appcode of duplicatie. Coördinatie in core schendt de pure grens. Een adapterpackage per platform is nu extra structuur zonder tweede afnemer. Een afzonderlijke Worker per bot/model vergroot lifecycle- en transportcomplexiteit; voeg die pas toe na metingen.

## Gevolgen

Main- en worker-entry behoren tot één web-compositie; de benchmark heeft een eigen proces-entry met dezelfde factories. Privé-checkpoints gebruiken een afgescheiden opslagbridge. Een online sessie vervangt later de autoriteitsadapter, zonder WebSocketlogica in core of UI-componenten.

## Verificatie

US-07, US-08, US-20, US-22 en US-28: importgraaf, extension-proef, Worker-interactie en SES-racegevallen. Voorstel, nog geen draaiende packages.
