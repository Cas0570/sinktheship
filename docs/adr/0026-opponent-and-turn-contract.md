Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Engine](../05-game-engine.md), [tegenstanders](../06-opponents.md), [architectuur](../04-architecture.md), [leeswijzer](../README.md)

# ADR 0026 — Eén asynchrone actie en een afzonderlijk beurtbeleid

## Besluitbasis

Uitwerking van het fase-1-plan; geen Salvo-implementatie in v1.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Extra schoten, meerdere vaste schoten per beurt en latere Salvo moeten met dezelfde bots werken. Browserinference en toekomstige transportadapters zijn asynchroon, terwijl het beurtbeleid pure regels moet blijven.

## Besluit

`Opponent` biedt `supports`, async `placeFleet` en async `chooseShot` met uitsluitend de actuele view, regels en eigen RNG. Optionele context biedt annulering/inzicht. Iedere call kiest één schot. `TurnPolicy` bepaalt quota en wisselen; winst wordt vóór bonus/wissel vastgesteld. Alleen `fixed@1` is in v1 geregistreerd. Nieuwe calls krijgen feedback van het vorige geaccepteerde schot.

## Onderbouwing en alternatieven

Een lijst vooraf gekozen schoten kan tussentijdse feedback en annulering niet op dezelfde manier verwerken. Een bot die beurtregels zelf beheert dupliceert corelogica. Synchrone methoden passen slecht bij Worker-/model-/netwerkgrenzen. Stateless reconstructie uit historie is eenvoudiger betrouwbaar te hervatten dan een ongedocumenteerde targetqueue.

## Gevolgen

De sessie beheert één in-flight operatie en verwerpt stale resultaten. RNG-ties zijn stabiel geordend en reproduceerbaar. Een denkpauzedecorator gebruikt `Clock`, geen game-RNG. Fouten geven uitleg en een expliciete herstelkeuze; er wordt geen andere moeilijkheid stil ingeschakeld.

## Verificatie

US-03, US-06, US-08, US-13, US-28; SES-01/02/03 en OPP-05/06/07/10. De contracten zijn beschreven, nog niet uitgevoerd.
