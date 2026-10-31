Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Masterprompt](../00-masterprompt.md), [architectuur](../04-architecture.md), [hostkeuze](0020-static-host.md), [accountkeuze](0009-anonymous-identity.md)

# ADR 0005 — Statische v1 zonder backend

## Besluitbasis

Vast besluit uit hoofdstukken 4 en 6 van de masterprompt.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

V1 is een lokaal spel tegen de computer. Multiplayer volgt later; een backend levert voor de gekozen v1-flow geen vereiste spelfunctie.

## Besluit

Lever HTML, CSS, JS, WASM, vertalingen en modelartefacten statisch vanaf de eigen origin. Spelregels, sessie en inferentie draaien in de browser; voortgang blijft achter een lokale opslagport. `apps/server` krijgt in v1 alleen een README. Gebruikersaccounts worden in v1 en de eerstvolgende releases niet gebouwd of gebruikt. Dit is een bewuste keuze voor nu; accounts kunnen in een latere release worden toegevoegd.

## Onderbouwing en alternatieven

De statische architectuur is voorgeschreven. Een backend voor inferentie of snapshots introduceert netwerkafhankelijkheid en gegevensoverdracht die niet nodig zijn voor v1. Voor multiplayer is toekomstige serverautoriteit wel noodzakelijk; dat wordt via een vervangbare sessieadapter ontworpen.

## Gevolgen

De browser bezit lokaal ook de verborgen vloot; de eigenaar kan die inspecteren. API-projecties voorkomen onbedoeld valsspelen door productcode, maar zijn geen bescherming tegen de eigenaar. Een nieuw model/vertaling vereist een nieuwe statische build. Hostingaccounts en deployment worden afzonderlijk ingericht bij hun bouwtaak.

## Verificatie

US-07, US-08, US-15 en US-23: productieartifactinspectie, netwerkcontrole, lokale opslagfouten en gefilterde views. Deze checks worden later uitgevoerd.
