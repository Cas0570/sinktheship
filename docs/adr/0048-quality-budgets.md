Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Kwaliteit](../12-quality-testing.md#budgetten-en-vaste-meetprofielen), [scope](../01-product-vision-scope.md), [ML-runtime](../07-neural-network.md#browserruntime-caching-en-fouten), [open punten](../README.md#centrale-open-punten)

# ADR 0048 — Meetbare budgetten met gescheiden lab- en toestelprofielen

## Besluitbasis

De startbudgetten uit NFR-06/07 en expliciete kwaliteitscriteria zijn vast; meetprotocollen en referentieprofielen worden hier voorgesteld. De ontwikkelaar koos op 2026-11-01 de beschikbare iPhone 16 Pro.

Deze uitwerking is met batch E goedgekeurd op 2026-11-01.

## Context

Een snelle iPhone, een Nodebenchmark en een synthetisch vertraagde desktop bewijzen verschillende dingen. Zonder vaste meetgrenzen is een score niet herhaalbaar of vergelijkbaar.

## Besluit

Gebruik document 12 als eigenaar van het meetprotocol: initiële/gewone spel-JS ≤200 KiB gzip, Lighthouse Performance ≥90 en Accessibility 100, p95 framewerk ≤16,7 ms, ONNX ≤1.000.000 bytes en p95 inferentie ≤50 ms volgens 07. Gebruik LH-mobile-v1 voor synthetische load, IOS-16PRO-v1 voor beschikbaar fysiek iOS-bewijs en voorlopig MID-ANDROID-v1 voor de middenklasse-inferentie-eis.

## Onderbouwing en alternatieven

Alleen Lighthouse missen echte Safari/Worker-/thermische eigenschappen. Alleen het beschikbare high-end toestel geeft geen betrouwbaar bewijs voor de gevraagde gemiddelde telefoon. Alleen gemiddelde tijden verhullen trage frames/inferenties. Verschillende kandidaatmetingen op verschillende toestellen zijn geen eerlijke vergelijking.

## Gevolgen

Q-06 is deels opgelost: iPhone 16 Pro is beschikbaar en gekozen. Middenklassetoesteltoegang en eventuele Safari-traceomgeving blijven vóór betreffende kwalificatie te regelen. Pixel 7a is een expliciete aanname, geen aankoop-/beschikbaarheidsclaim. Bewaar toolchain/config, alle runs en ruwe traces; budget/profielwijzigingen krijgen vooraf review in plaats van een achteraf gunstig gekozen grens.

## Verificatie

AT-13-03, AT-21-01/02/03 en AT-22-01/02/03; vijf Lighthouse-runs, drie frame-/inferentieruns en volledige resource-inventory. Geen metingen uitgevoerd of prestaties geclaimd.
