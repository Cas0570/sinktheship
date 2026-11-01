Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Design brief](../09-design-brief.md#drie-stijlrichtingen), [playbook](../10-figma-mcp-playbook.md), [leeswijzer](../README.md)

# ADR 0018 — Een expliciete keuze uit drie stijlen vóór generatie

## Besluitbasis

Drie concrete stijlrichtingen en menselijke keuze vóór designgeneratie zijn een vaste eis. Akkoord op deze ADR keurt de procedure goed; het kiest geen stijl.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01. De expliciete visuele stijlkeuze blijft afzonderlijk open.

## Context

Een impliciete keuze voor het eerste of aanbevolen voorstel zou de ontwikkelaar pas na canvaswerk laten bepalen hoe het product moet aanvoelen.

## Besluit

Document 09 beschrijft A — Harbor, B — Radar en C — Paper Fleet, inclusief palet, fonts, iconen, illustraties en motion. Harbor is aanbevolen. **Gekozen stijl: nog niet gekozen.** Leg vóór M3 de expliciete naam/letter, eventuele gerichte wijzigingen en de beslisdatum in deze ADR vast. Tot dan vindt geen designgeneratie plaats.

## Onderbouwing en alternatieven

Alle drie volledig genereren vóór een keuze kost onnodig review- en toolwerk en gaat tegen de gevraagde volgorde in. Zelf de aanbevolen stijl kiezen bij een algemeen “Akkoord” maakt een technische batchreview ten onrechte een visueel besluit. De drie beschreven voorstellen zijn het concrete keuzemateriaal.

## Gevolgen

Q-02 blijft voor stijl open; documentatiebatches kunnen verder. Na keuze bestaat één actieve tokenbasis. Een latere stijlwijziging krijgt een nieuwe ADR-versie met impact op tokens, componenten en screenshots. Dark mode als functie wordt afzonderlijk op releaseprioriteit beoordeeld.

## Verificatie

Controleer aanwezigheid van drie complete voorstellen en een expliciet keuzerecord vóór de eerste canvasmutatie. De berekende paletteparen staan in 09; daadwerkelijke fonts en alle rendered states worden later gecontroleerd.
