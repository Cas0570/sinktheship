Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0015 — Engels en Nederlands vanaf de start

## Besluitbasis

Vast besluit uit hoofdstuk 5 en 10 van de masterprompt. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

Vertaling achteraf zou literals, foutmeldingen en accessibilityteksten verspreid door de UI moeten herstellen.

## Besluit

Lever Engels als standaard en Nederlands als tweede UI-taal. Gebruik keys voor alle gebruikersgerichte tekst, inclusief labels, foutmeldingen, levende aankondigingen en namen van schepen en regels. Sla de voorkeur lokaal op.

## Onderbouwing en alternatieven

Eerst één hardcoded taal is initieel eenvoudiger maar vergroot later de wijzigingsimpact. Browsertaal automatisch boven een opgeslagen voorkeur stellen maakt gedrag onvoorspelbaar. De expliciete opgeslagen keuze krijgt voorrang.

## Gevolgen

Een taalwissel verandert geen `RuleSet`, seed, beurt of signatuur. De concrete i18n-library en automatisch gevonden vertaalbestanden worden in batch D uitgewerkt. Toevoegen van één vertaalbestand moet voor een nieuwe taal volstaan.

## Verificatie

FR-13/FR-14 en NFR-01; US-11/US-20. Key- en placeholdercontrole plus beide talen in de kernflow. Dit zijn geplande controles; er is nog geen implementatie getest.
