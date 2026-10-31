Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Masterprompt](../00-masterprompt.md), [engine](../05-game-engine.md), [architectuur](../04-architecture.md), [grenscontrole](0043-dependency-enforcement.md)

# ADR 0003 — Pure core zonder runtime-dependencies

## Besluitbasis

Vast besluit uit hoofdstukken 4 en 7; de RNG-/transitiesemantiek is uitwerking in batch B.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Dezelfde regels moeten bruikbaar zijn in de browser, Node-benchmark en later serverautoriteit, en controleerbaar zijn met Python-pariteitsfixtures.

## Besluit

`game-core` bevat alleen domeindata en deterministische functies, zonder runtime-dependencies, DOM, timers, opslag, netwerk, React of omgevingsrandomness. Randomness wordt geïnjecteerd; de transitie maakt een lokale RNG-clone uit opgeslagen state en levert de bijgewerkte state terug. Geen mutatie van input of externe instances. Alle state/events zijn JSON-data.

## Onderbouwing en alternatieven

De masterprompt vereist deze grens. Regels in React-hooks of browseradapters zijn lastiger buiten de browser te hergebruiken. Een framework in de core koppelt regels aan een runtime zonder domeinvoordeel. Interne tijdelijke mutatie van een exclusief lokale RNG-clone is verenigbaar met een pure externe transitie; gedeelde globale RNG-state is dat niet.

## Gevolgen

Runtimevalidatie blijft dependencyvrij. Zwaar rekenen mag de uitvoeromgeving verplaatsen naar een Worker, maar voegt geen Worker-API aan de core toe. Test-/compilertools zijn ontwikkeldependencies en vallen buiten het nul-runtime-dependenciescriterium.

## Verificatie

US-06, US-07, US-28/29; ENG-01 t/m ENG-10, gedeelde fixtures en negatieve architectuurtests. Nog geen implementatieresultaten.
