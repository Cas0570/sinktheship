Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Multiplayer](../11-multiplayer-future.md), [architectuur](../04-architecture.md), [engine](../05-game-engine.md), [multiplayer later](0008-multiplayer-later.md)

# ADR 0046 — Serverautoriteit via sessie- en transportadapters

## Besluitbasis

De pure core, ports en toekomstige multiplayer zonder engine-/presentational-UIherbouw zijn vereist. De exacte verhouding tussen Opponent en sessiesynchronisatie wordt hier gepreciseerd.

Deze uitwerking is met batch E goedgekeurd op 2026-11-01.

## Context

Een lokale Opponent retourneert een plaatsing en schot. Als een browser dat voor een verre mens gebruikt, kan die browser de verborgen tegenstandervloot ontvangen en blijft de lokale client autoriteit. Dat voldoet niet aan de toekomstige servergrens.

## Besluit

Behoud de bruikbare lokale SessionPort in v1. Later draait de server dezelfde core met seriële validatie/receipts; clients krijgen per ontvanger geprojecteerde snapshots/events via een remote sessieadapter. Een RemotePlayerOpponent kan uitsluitend server-side een gevalideerde eigen vloot en actiequeue vertalen. Het roomprotocol en de lifecycle uit 11 staan buiten v1-implementatie.

## Onderbouwing en alternatieven

Alleen losse schoten van het netwerk ophalen mist autoriteit, reconnect, idempotentie en racecontrole. Beide vloten naar clients repliceren breekt verborgen informatie. Een volledig andere multiplayerengine zou onderhoud/pariteit verdubbelen. De sessielaag bewaakt timeout/forfeit als terminale roommetadata zonder een fictieve vlootvernietiging in de pure core te forceren.

## Gevolgen

Dit is een expliciete precisering van de masterpromptzin over één online Opponent-adapter: volledige netwerksessies hebben ook transport en roomcoördinatie nodig. Lokale neural metadata/recoveryvelden worden geen nepvelden voor een menselijke opponent; een toekomstige onderscheiden remote facade hergebruikt PlayerView/componentprops. Appcontainers/compositie krijgen nieuw werk, core en presentational UI behouden hun contract. Geen speculatieve code in v1.

## Verificatie

V1: AT-07-01/03, AT-14-01/02/03 en AT-20-03. Later: MP-01 tot en met MP-12, inclusief twee clients, verborgen-statebytes, servercrash en request/deadline-races. Geen server gebouwd.
