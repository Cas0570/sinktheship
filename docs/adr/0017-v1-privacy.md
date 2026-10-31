Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0017 — Lokale speldata zonder tracking

## Besluitbasis

Vast besluit uit hoofdstuk 5 en 6.3 van de masterprompt. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

V1 heeft geen backend nodig voor spel, voorkeuren of inferentie. Telemetrie over spelers is geen productdoel.

## Besluit

Gebruik geen tracking, analytics of cookies van derden. Gastidentiteit, snapshots en voorkeuren blijven lokaal; vraag in de spelfunctionaliteit geen persoonsgegevens. Laad assets van eigen origin. Gebruik W&B uitsluitend voor ontwikkelaarsruns in de ML-omgeving.

## Onderbouwing en alternatieven

Productanalytics en externe asset-CDN’s kunnen operationeel nuttig zijn, maar zijn niet nodig voor het leerdoel en vergroten de data-uitwisseling. Lokaal uitvoeren houdt de spelflow onafhankelijk van externe profielen.

## Gevolgen

Netwerkchecks onderscheiden app-assets van uploads. Offline trainingslogging blijft mogelijk. Claims over de hostinginfrastructuur worden pas gemaakt na controle van de gekozen hostconfiguratie; de app belooft niet dat een netwerkverbinding zonder serverlogs bestaat.

## Verificatie

NFR-08/NFR-10 en FR-17; US-15/US-23. Inspecteer requests, cookies, clientbundle en het ontbreken van W&B in de browserapp. Dit zijn geplande controles; er is nog geen implementatie getest.
