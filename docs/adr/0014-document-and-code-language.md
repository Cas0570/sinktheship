Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0014 — Nederlands documenteren, Engels coderen

## Besluitbasis

Vast besluit uit hoofdstuk 5 van de masterprompt. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

De ontwikkelaar leest uitleg in het Nederlands; code moet aansluiten op gebruikelijke librarynamen en internationale voorbeelden.

## Besluit

Schrijf documentatie in het Nederlands en code, identifiers, codecomments en commits in het Engels. Behoud code-identifiers in Nederlandse uitleg. Gebruik de glossary voor domeintermen.

## Onderbouwing en alternatieven

Alles Engels kan de uitleg minder toegankelijk maken voor deze lezer. Nederlandse identifiers mengen slecht met bestaande API’s. Vrij mengen maakt namen en zoektermen onvoorspelbaar.

## Gevolgen

TypeScript-signaturen in docs hebben Engelse namen. UI-teksten zijn geen codecomments en volgen de gekozen locale. Productnaam SinkTheShip blijft in beide talen gelijk.

## Verificatie

NFR-13/NFR-14; US-24. Review controleert terminologie en consistentie van namen tussen docs, Figma en code. Dit zijn geplande controles; er is nog geen implementatie getest.
