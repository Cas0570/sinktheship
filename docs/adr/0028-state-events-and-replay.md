Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Engine](../05-game-engine.md), [architectuur](../04-architecture.md), [tegenstanders](../06-opponents.md), [leeswijzer](../README.md)

# ADR 0028 — Snapshots met deterministische commands en events

## Besluitbasis

Serialiseerbare state/events en hervatten zijn vast; snapshot-first en transactiesemantiek zijn uitwerking van het goedgekeurde plan.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Refresh kan tijdens een botberekening, opslagwrite of denkpauze gebeuren. Dubbele requests en late Workerantwoorden mogen geen extra schot of RNG-verbruik veroorzaken.

## Besluit

Immutable corestate met revision, geaccepteerde commands en geordende interne events; afwijzing verandert niets. De sessie commit state, RNG, requestreceipt en inzicht samen in geheugen, schrijft één volledig geversioneerd checkpoint en verwerkt writes in volgorde. Async werk krijgt een private RNG-clone en wordt alleen bij actuele game/generatie/revision gecommit. Snapshot is de primaire hervatbron; een commandlog dient voor replay/debugging.

## Onderbouwing en alternatieven

Volledige event sourcing vraagt eventmigraties en langdurige logs zonder noodzakelijke v1-functie. Alleen een React-state dump bevat geen voldoende contract voor versies, RNG en idempotentie. Iedere tussenstap apart opslaan kan state en RNG uit elkaar laten lopen. Opslag kan falen; de app houdt de geaccepteerde in-memory zet en meldt wat niet hervatbaar is.

## Gevolgen

Geen promises, timers of typed arrays in checkpoints. Onbekende/corrupte data wordt niet stil overschreven. Herstart rekent onafgemaakt werk opnieuw uit dezelfde invoer; eerder gecommitte schoten blijven staan. De bounded receiptcache en expected revision beschermen verschillende replaygevallen, zoals uitgewerkt in 05.

## Verificatie

US-08, US-09, US-28; ENG-08/10 en SES-01 t/m SES-06. De lokale storagekeuze/migratiecatalogus volgt in batch D; races en herstel zijn nog niet in code getest.
