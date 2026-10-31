Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0006 — Configureerbare spelregels

## Besluitbasis

Vast besluit uit hoofdstuk 4 en 8 van de masterprompt; presetgrenzen uitgewerkt in het goedgekeurde fase-1-plan. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

De speler kiest de regels vooraf. Regels verspreid over schermen en bots zouden varianten oncontroleerbaar maken.

## Besluit

Gebruik één gevalideerde `RuleSet` als invoer voor de engine, tegenstanders, opslag en evaluatie. Presets zijn data; een UI-naam bepaalt geen spelgedrag. De normatieve definitie staat in document 02.

## Onderbouwing en alternatieven

Hardcoded Klassiek zou minder initiële velden vragen, maar blokkeert de vastgestelde regelkeuze. Losse flags per subsystem vergroten de kans op verschillen. Een gedeeld dataobject laat alle afnemers dezelfde waarden interpreteren.

## Gevolgen

Validatie omvat samenhang en plaatsbaarheid. De beperkte v1-editor verandert niets aan het configureerbare enginecontract; niet-geregistreerde beurtpolicies worden afgewezen.

## Verificatie

FR-02/FR-03; US-02 en AT-02-01 t/m AT-02-03. RULE-01 en RULE-14 t/m RULE-20 controleren plaatsbaarheid, signaturen en afwijzingen. Dit zijn geplande controles; er is nog geen implementatie getest.
