Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0007 — Vier meetbare moeilijkheden

## Besluitbasis

Vast besluit uit hoofdstuk 6 en 9 van de masterprompt. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

De speler moet niveaus kunnen onderscheiden; het leerdoel vereist een neural tegenstander die eerlijk wordt geëvalueerd.

## Besluit

Lever Easy (random), Normal (hunt/target), Hard (density met pariteit) en Impossible (neural). De MVP levert Easy–Hard; v1.0 vereist daarnaast een compatibel model dat de goedgekeurde criteria haalt. Uniforme vlootplaatsing is voor alle niveaus gelijk.

## Onderbouwing en alternatieven

Moeilijkheid via verborgen voorkennis zou eenvoudiger te verhogen zijn, maar schendt eerlijk spel. Alleen handgemaakte bots missen het neural leerdoel. De productnaam Impossible is geen garantie op onverslaanbaarheid.

## Gevolgen

Impossible blijft zichtbaar uitgeschakeld zonder passend manifest. Algoritmische en statistische details volgen in batch B/C; een onvoldoende sterk model maakt v1.0 nog niet gereed.

## Verificatie

FR-04/FR-12/FR-22; NFR-12; US-03, US-10 en US-19. Meetcriteria staan in document 01, zonder ze hier opnieuw te definiëren. Dit zijn geplande controles; er is nog geen implementatie getest.
