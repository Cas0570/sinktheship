Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0009 — Gastidentiteit en latere uitbreidbaarheid

## Besluitbasis

Vast besluit uit hoofdstuk 6.3 van de masterprompt. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

Een lokale wedstrijd heeft herkenbare spelersslots en hervatten nodig, zonder persoonsinvoer of authenticatieserver.

## Besluit

Gebruikersaccounts worden in v1 en de eerstvolgende releases niet gebouwd of gebruikt. Dit is een bewuste keuze voor nu; accounts kunnen in een latere release worden toegevoegd.

Gebruik een `IdentityProvider` met lokaal opgeslagen anonieme gast-ID en opslag via adapters. Scheid de gast-ID van `player-1`/`player-2` en van de wedstrijd-ID.

## Onderbouwing en alternatieven

Persoonsgebonden login voegt nu geen noodzakelijke spelfunctie toe. Een overal ingebakken lokale ID zou latere identiteit blokkeren. De providergrens ondersteunt het huidige gastgebruik en blijft vervangbaar.

## Gevolgen

Er is geen persoonsinvoer in de spelfunctionaliteit. De gast-ID blijft lokaal en is geen authenticatiebewijs. Bij onbeschikbare opslag kan een tijdelijke identiteit een nieuw spel bedienen; de opslagbeperking is zichtbaar.

## Verificatie

FR-17 en NFR-08/NFR-09; US-15 en US-08. Controleer dat data of identiteit niet onbedoeld wordt verstuurd. Dit zijn geplande controles; er is nog geen implementatie getest.
