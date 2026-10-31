Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0008 — Multiplayer na v1

## Besluitbasis

Vast besluit uit hoofdstuk 6.2 van de masterprompt; routerichtingen goedgekeurd in fase 1. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

V1 is statisch en richt zich op neural leren. Netwerkspel zou nu serverbeheer, reconnect en nieuwe beveiligingsgrenzen toevoegen.

## Besluit

Ontwerp private match en quick play, maar bouw geen multiplayer-server in v1. Reserveer `/r/:roomKey` en `/multiplayer` met een binnenkort-pagina. Maak de v1-sessiegrens bruikbaar voor dispatch, views en hervatten.

## Onderbouwing en alternatieven

Direct netwerkspel bouwen vergroot de scope vóór het leerdoel bereikt is. Geen uitbreidingspunten beschrijven maakt een latere overgang duur. Een nu al bruikbare sessieport met later een remote adapter vermijdt beide nadelen.

## Gevolgen

Serverautoriteit, protocol en room-lifecycle krijgen document 11 in batch E. `apps/server` krijgt bij de bouw uitsluitend een README met de bedoeling. UI en core blijven zonder transportdependency.

## Verificatie

FR-16 en NFR-01; US-14 en US-20. De backlogreview moet bevestigen dat geen v1-taak een server, matchmaking of WebSocket-spel implementeert. Dit zijn geplande controles; er is nog geen implementatie getest.
