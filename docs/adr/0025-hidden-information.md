Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Regels](../02-game-rules.md), [architectuur](../04-architecture.md), [engine](../05-game-engine.md), [tegenstanders](../06-opponents.md)

# ADR 0025 — Eén expliciete informatieprojectie

## Besluitbasis

Precisering van de vaste eerlijkheids-/viewgrens en de goedgekeurde zinkregels.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Bij rakende schepen onthult een gezonken type niet automatisch alle bijbehorende eerdere treffers. Een bot kan ook indirect valsspelen via private seeds, events, mutabele references of postgame-labels.

## Besluit

De private sessie houdt `GameState`. De core projecteert `PlayerView` en `PublicGameEvent` met dezelfde disclosurefunctie. Bots en schermen ontvangen onafhankelijke toegestane data, geen state/checkpoints of plaatsingsseeds. Zinkcellen worden alleen als bekend behandeld wanneer de publieke geschiedenis dat bewijst. AI-inzicht wordt vóór de keuze berekend en pas na afloop getoond.

## Onderbouwing en alternatieven

Volledige state meegeven met de afspraak velden niet te lezen voldoet niet. Alleen cellen visueel verbergen beschermt botcode evenmin. Verbonden hitclusters als één schip merken levert onterecht extra informatie. De opslagadapter moet wel volledige data kunnen bewaren; daarom is die geprivilegieerd en niet door schermen importeerbaar.

## Gevolgen

Geen interne revision/sequence in publieke events als die verborgen draftbewerkingen telt. Exceptionmeldingen dumpen geen state. Architectuurchecks en equivalente-observatiefixtures bewaken de grens. Dit voorkomt productcodefouten, maar beschermt een lokale browser niet tegen zijn eigenaar; multiplayer vereist later serverautoriteit.

## Verificatie

AT-07-01 t/m AT-07-03, AT-17-01/02, ENG-09, SES-07/08 en OPP-03/04. Tests vergelijken verschillende verborgen vloten met dezelfde publieke historie. Nog geen geïmplementeerde tests.
