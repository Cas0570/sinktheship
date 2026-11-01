Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Design brief](../09-design-brief.md#componentinventaris-en-mappingregels), [playbook en register](../10-figma-mcp-playbook.md#mappingregister), [frontend](../08-frontend.md), [leeswijzer](../README.md)

# ADR 0047 — Gelijke namen en een versioneerbare Figma-codemapping

## Besluitbasis

Gelijke tokens/component-/propnamen zijn vereist. Code Connect waar beschikbaar en een lokale mappingfallback zijn het uitgewerkte voorstel.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

Figma-context wordt minder betrouwbaar wanneer hetzelfde component anders heet of props zonder betekenisvertaling worden overgenomen. Planbeperkingen mogen de traceerbaarheid niet volledig laten verdwijnen.

## Besluit

Gebruik de naam-/tokenconventies en props uit 09. Houd het register in 10 bij met echte Figma-node, code-export/pad, commit en verificatiedatum. Leg na publicatie en implementatie Code Connect vast als het account dit ondersteunt, en lees de mapping terug. Ondersteunt de client geen rules-prompt, schrijf dezelfde regels tijdens M3 in de repo.

## Onderbouwing en alternatieven

Alleen screenshots geven geen prop-/versierelatie. Alleen Code Connect maakt dit project afhankelijk van beschikbaarheid en juiste planrechten. Losse componentnamen zonder een versiebeheerbare referentie tonen niet welke implementatie bij welk ontwerp hoort.

## Gevolgen

Nieuwe componenten voegen één componentmodule en één mapping-entry toe, naast benodigde stories/tests. Callback-/arrayprops gebruiken fixture- en datacontractnotities; hover/focus-specimens krijgen geen fictieve publieke props. Bij token-/propwijziging worden beide kanten en gerichte screenshots gezamenlijk beoordeeld. Een geplande mapping wordt nooit als gepubliceerd geregistreerd.

## Verificatie

AT-20-03, AT-24-02/03 en de acceptatie in 09; controleer identieke namen, propertytypen, tokenexport zonder botsingen en de Figma-/Playwright-vergelijking. Het register is voorbereid, nog niet gevuld met verzonnen node-IDs.
