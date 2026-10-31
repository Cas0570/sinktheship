Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Encodingcontract](../07-neural-network.md#encodingcontract-sts-observation-v1), [informatiegrens](0025-hidden-information.md), [regels](../02-game-rules.md), [leeswijzer](../README.md)

# ADR 0032 — Geversioneerde bord- en historiekanalen

## Besluitbasis

Observatiekanalen en gedeelde encodingfixtures zijn vast; de concrete 16 kanalen zijn het batch-C-voorstel.

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

Vier celstates alleen verliezen het type en moment van een zinkbericht. Daartegenover mag een sunk-kanaal geen geheime clusterindeling uit de engine gebruiken. Deze grens is vooral relevant wanneer schepen elkaar mogen raken.

## Besluit

`sts-observation-v1` gebruikt float32 NCHW `[1,16,10,10]`: vier celstates, vijf publieke afloat-vlakken, vijf zink-ID-vlakken, lokale schotvolgorde en het oorspronkelijke zinkevent. Alleen de zinkcoördinaat krijgt known-sunk; eerdere treffers blijven ongeclassificeerd. De exacte definities en ondersteunde informatievorm staan in 07. Label en actiemasker blijven afzonderlijk.

## Onderbouwing en alternatieven

Vier bordkanalen zijn kleiner maar laten relevante publieke historie weg. Een recurrent netwerk over de complete eventlijst kan die historie ook benutten, maar vergroot model-/exportcomplexiteit. Alle werkelijke gezonken scheepscellen markeren zou verborgen informatie lekken. Het conservatieve v1-contract bewaart de oorspronkelijke eigen schotuitkomsten zonder zulke ongeoorloofde toewijzing.

## Gevolgen

Er is een vaste scheepsvolgorde, asvolgorde, float32-afronding en maskersemantiek. Andere informatievormen worden geweigerd totdat een passende nieuwe encoder bestaat. TypeScript en Python hebben onafhankelijke implementaties met dezelfde vastgelegde verwachtingen. Een kanaalwijziging mag geen bestaande encoding-ID behouden.

## Verificatie

AT-07-01/02, AT-17-01 en AT-29-02; ML-01 t/m ML-06 en ML-09. De ambigue twee-vlotenfixture moet bytegelijke tensors geven. De huidige batch levert het contract, nog geen encoder.
