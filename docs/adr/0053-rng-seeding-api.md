Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-04

Gerelateerd: [Enginecontract](../05-game-engine.md#randomness-en-seeds), [ADR 0027](0027-rng-and-fleet-sampling.md), [core-API](../../packages/game-core/README.md#reproduceerbare-randomness)

# ADR 0053 — Expliciete RNG-seeding en onafhankelijke instances

## Context

T07 levert PCG32, restore en gescheiden stromen. Document 05 definieert de RNG-port en integersemantiek, maar nog geen publieke seedconstructor. Browserstromen vereisen afzonderlijke private entropie; benchmarks gebruiken expliciete seedparen.

## Besluit

Voeg de seed- en factory-API uit document 05 toe zonder het bestaande Rng/RngState/RngFactory-contract te wijzigen. Seeding neemt twee canonieke hexwoorden; restore neemt een geversioneerd snapshot. Maak vijf onafhankelijke instances uit een expliciet seedplan. Valideer hexvorm, algoritme en oneven increment. Ongeldige input faalt vóór RNG-verbruik.

De seedafleiding is de vastgelegde PCG-seedingroutine. Er komt geen publieke masterseed of impliciete hashfunctie bij. Snapshotklonen volstaan voor speculative berekeningen; de sessie commit later alleen geaccepteerde effecten met hun RNG-state.

## Alternatieven en gevolgen

BigInt in de publieke seeddata belemmert JSON-seedplannen. Number verliest 64-bitprecisie. Een gedeelde mutable RNG koppelt strategie aan plaatsingsverbruik. Een masterseedhash maakt private stromen reconstrueerbaar zodra die basis bij een bot terechtkomt. Expliciete seedparen houden de eigendom zichtbaar en taalpariteit controleerbaar.

Geen dependencies, ambient randombron of tijd. PCG is niet cryptografisch. De TypeScript-port behoudt bronvermelding en Apache-2.0-licentie. Engineafwijzingen en async transacties moeten in T08/T23 nog met deze port worden geïntegreerd.

## Verificatie

Officiële 42/54-vector, onafhankelijke checkpointberekening, JSON-restore, bounded upper-tail rejection, wraparound, ongeldige input zonder verbruik, vijf afzonderlijke instances en weggeworpen speculative kopieën. De ontwikkelaar heeft T07 en deze aanvullende API op 2026-11-04 expliciet goedgekeurd. [PR #68](https://github.com/Cas0570/sinktheship/pull/68) bevat review, akkoord en uitvoeringsbewijs.
