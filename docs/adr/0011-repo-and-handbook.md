Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0011 — Repo als specificatie, Notion als handboek

## Besluitbasis

Vast besluit uit hoofdstuk 4, 13 en 14 van de masterprompt. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

AI en ontwikkelaar moeten dezelfde versie van regels, API en werkwijze kunnen vinden, zonder conflicterende kopieën.

## Besluit

Bewaar specificaties, ADR’s, backlogdefinities en technische gidsen in de repo. Notion legt de aanpak uit, bevat experimentverslagen en release notes en linkt naar de technische bron. Taakstatus staat uitsluitend in GitHub Projects.

## Onderbouwing en alternatieven

Alleen Notion maakt technische diffs en koppeling aan codeversies minder direct. Alles dubbel publiceren creëert onderhoudsconflicten. Alleen Git mist het expliciet gevraagde leesbare handboek.

## Gevolgen

Bij API- of workflowwijzigingen worden repo-docs met de code gereviewd. Notion-updates kopiëren geen paden, commando’s of contractspecificaties. De huidige fasestatus in de leeswijzer betreft uitsluitend deze documentatieopdracht.

## Verificatie

NFR-13/NFR-14; US-20/US-24. Fase 4 verifieert repo-/bord-/handboeklinks en ontbreken van gekopieerde specificaties. Dit zijn geplande controles; er is nog geen implementatie getest.
