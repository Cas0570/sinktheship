Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Regels](../02-game-rules.md#geometrie-api), [engine](../05-game-engine.md#plaatsbaarheidsvalidatie), [ADR 0024](0024-ruleset-validation.md), [core-API](../../packages/game-core/README.md#plaatsing-en-bewijs)

# ADR 0052 — Plaatsingscontrole en geometriehelpers

## Context

T06 moet zowel complete witnesses als gedeeltelijke plaatsingsvoorstellen controleren. Het bestaande regelcontract legt de geometrie en bewijsuitkomsten vast, maar nog niet de publieke helpernamen en plaatsingsfoutcodes. Een mislukte rotatie mag geen bestaande draft wijzigen.

## Besluit

Ontsluit pure `isWithinBoard`, `getShipCells` en `rotateShip` en één `validatePlacement` met standaard complete controle en een expliciete gedeeltelijke modus. Resultaat en foutcodes staan uitsluitend in document 02. Regels moeten vooraf schema-gecontroleerd zijn. Geef bij succes een onafhankelijke plaatsingskopie. Helpers muteren niets; de caller accepteert een voorstel pas na validatie. Enginecommands en UI-transacties vallen buiten T06.

Implementeer het bestaande `validateRuleSet`-contract met de voorgeschreven preset-witness en DFS-volgorde. Valideer de programmeerparameter `maxSearchNodes` als positief veilig geheel getal; werp bij een ongeldige parameter `RangeError`. Zo blijft iedere getelde knoop exact representeerbaar. Deze parameterfout is geen uitspraak over de regels. Publieke regeluitkomsten en spelrequirements veranderen niet.

## Alternatieven en gevolgen

Alleen complete validatie zou een plaatsingseditor dwingen ongeldige ontbrekende schepen te negeren of geometrie te dupliceren. Muterende rotatie maakt rollback noodzakelijk. Twee afzonderlijke validators zouden dezelfde checks kunnen laten uiteenlopen. Een impliciet standaardbudget verbergt een compositiekeuze; daarom blijft de caller verplicht een limiet te geven.

Geen nieuwe dependencies, RNG, klok of cache. `valid` uit gedeeltelijke plaatsingscontrole mag niet worden verward met een complete vloot. De expliciete modus en documentatie maken dit zichtbaar; de toekomstige engine controleert compleetheid opnieuw bij bevestiging. RangeError is een ontwikkelaarsfout, geen hardcoded productcopy.

## Verificatie

RULE-01–06, RULE-17/18, exacte budgetgrenzen, inputimmutability, rotatie/transpositie, 2×2/26×26 en een onafhankelijke kleine-bord-oracle. [PR #67](https://github.com/Cas0570/sinktheship/pull/67) levert het uitvoeringsbewijs. De ontwikkelaar heeft de wijziging en deze aanvullende API op 2026-11-03 expliciet goedgekeurd en opdracht gegeven te mergen.
