Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Frontend](../08-frontend.md#routes-en-schermflow), [multiplayer later](0008-multiplayer-later.md), [router](0037-react-router.md), [stories](../03-user-stories.md)

# ADR 0045 — Gereserveerde multiplayer- en roomroutes

## Besluitbasis

Multiplayer blijft buiten v1. De korte routes `/multiplayer` en `/r/:roomKey` preciseren het goedgekeurde uitbreidingsvoorstel.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

Een herkenbare toekomstige ingang voorkomt dat later navigatie en deeplinks volledig anders moeten worden ingericht, zonder nu een werkende online sessie te suggereren.

## Besluit

Toon in v1 een Binnenkort-pagina op beide routes. `/multiplayer` noemt private match en quick play als toekomst. `/r/:roomKey` toont een veilig behandelde key of ongeldige-linkmelding; er gaat geen netwerkrequest uit en er ontstaat geen online sessie. De exacte v1-presentatievalidatie staat in 08; het toekomstige protocol staat in [11](../11-multiplayer-future.md).

## Onderbouwing en alternatieven

`/room/:roomKey` is iets leesbaarder maar langer bij delen. Alleen een verborgen interne route maakt de toekomstige mogelijkheid niet zichtbaar zoals gevraagd. Een werkende join-/matchingstub met externe calls zou de v1-grens overschrijden. De routeparameter is data en geen autorisatiebewijs.

## Gevolgen

Home linkt naar de toekomstpagina. De toekomstige remote sessieadapter kan dezelfde route gebruiken zonder package-ui aan transport te koppelen. Vervallen rooms, rate limiting, privacy en echte servervalidatie worden later ontworpen; v1 claimt daar geen beveiliging of reservatie mee.

## Verificatie

AT-14-01/02/03 en AT-23-02; bekende/ongeldige URL, 404, geen netwerk/join en behoud van een bestaand lokaal spel. Nog geen online functionaliteit gebouwd.
