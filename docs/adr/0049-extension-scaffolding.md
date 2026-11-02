Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Uitbreidingsgidsen](../15-extension-guides.md), [architectuur](../04-architecture.md#registratie-en-uitbreidingsimpact), [tegenstanders](../06-opponents.md), [kwaliteit](../12-quality-testing.md)

# ADR 0049 — Eén eenvoudige tegenstandergenerator en verifieerbare gidsen

## Besluitbasis

De meetbare uitbreidingsimpact en zelfstandigheid zonder AI zijn vaste eisen. De generator is een bewust klein aanvullend hulpmiddel.

Deze uitwerking is met batch E goedgekeurd op 2026-11-01.

## Context

Veel herhaalde boilerplate vergroot de kans op verkeerde registraties/imports. Een generiek framework of generator voor ieder bestand zou juist extra onderhoud en onzichtbare magie toevoegen.

## Besluit

Lever later alleen pnpm new:opponent als eerste generator: unieke ID, één module/descriptor met EN/NL-teksten, één catalogusregistratie en teststartpunt. Dry-run toont de concrete diff; conflicts/pathtraversal worden vóór writes geweigerd. De strategie is niet fictief werkend. Overige uitbreidingen volgen de concrete bestands-/verificatiestappen uit 15.

## Onderbouwing en alternatieven

Handmatig kopiëren blijft een geldige fallback en is in de gids beschreven, maar een kleine generator voorkomt drift in de tegenstanderstructuur. Een AST-/templateframework als nieuwe dependency is niet vereist voor de eerste scope; alleen een gecontroleerde catalogusvorm wordt aangepast. Meerdere generators vóór reëel herhaald gebruik zijn speculatief.

## Gevolgen

Bootstrap/generator/module-README's hebben afzonderlijke taken in de [backlog](../14-backlog.md). De zes EXT-proeven leggen de werkelijke code-/test-/docdiff vast en worden door de ontwikkelaar zonder AI uitgevoerd na implementatie. Een nieuwe policy/runtime/encoding is geen eenvoudige extensie en krijgt zijn eigen contractreview.

## Verificatie

AT-20-01/02/03, NFR-01/NFR-13 en EXT-01 tot en met EXT-06; generator dry-run, conflict/invalid ID, geen half geschreven catalogus, en handmatige uitvoerbaarheid. Nu alleen het commandocontract en de gidsen vastgelegd.
