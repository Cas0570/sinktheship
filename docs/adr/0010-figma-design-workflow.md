Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Design brief](../09-design-brief.md), [playbook](../10-figma-mcp-playbook.md), [stijlkeuze](0018-visual-direction-selection.md), [mapping](0047-design-code-mapping.md)

# ADR 0010 — Figma via de remote MCP-server

## Besluitbasis

Figma, de remote MCP-server en de ontwerp-/implementatiewerkwijze zijn vaste keuzes uit de masterprompt. Het playbook preciseert uitvoering en bewijs; deze batch genereert geen design.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

Een screenshot alleen levert geen onderhoudbare componenten, tokens of traceerbare verbinding met de app. De ontwikkelaar moet de resultaten per stap kunnen beoordelen.

## Besluit

Volg document 10: eerst stijlkeuze en werk-kopie, daarna variabelen, componenten, instance-schermen, assets en prototype. Lees de toepasselijke Figma-skills vóór toolgebruik. Canvaswerk gebruikt `use_figma`; implementatie gebruikt volledige designcontext, echte variabelen en een visuele referentie. Controleer rechten en publicatiestatus afzonderlijk.

## Onderbouwing en alternatieven

Handmatig alles tekenen blijft mogelijk maar is niet de gekozen hoofdwerkwijze. Alleen een webcapture importeren biedt onvoldoende garantie voor herbruikbare componenten en bindings. Actuele [Figma-documentatie](https://developers.figma.com/docs/figma-mcp-server/) en aangeboden capabilities bepalen welke toolstappen werkelijk beschikbaar zijn.

## Gevolgen

Het bestand blijft controleerbaar in Foundations, Components, Screens, Prototype en Archive. Een beperkte seat mag geen fictief geslaagde publicatie opleveren. Ontbrekende Code Connect-/rulesmogelijkheden krijgen de in 10 beschreven lokale fallback. Fase 4 verifieert MCP; M3 voert design/bouw uit.

## Verificatie

AT-24-01/02/03 en de designacceptatie in 09; IDs, bindings, screenshots en publicatie-/mappingbewijs per stap. Nu alleen documentatie gecontroleerd.
