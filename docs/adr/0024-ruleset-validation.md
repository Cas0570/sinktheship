Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0024 — Validatie met plaatsbaarheidsbewijs

## Besluitbasis

Uitwerking van het goedgekeurde fase-1-plan; grenzen en resultvarianten zijn goedgekeurd met batch A. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

Een TypeScript-type valideert geen JSON. Een vloot kan qua oppervlakte passen en door contactregels toch onplaatsbaar zijn.

## Besluit

Valideer onbekende invoer dependencyvrij in de core: vorm, versies, waarden, vloot, beurtconfiguratie, geometrie en plaatsbaarheid. Alleen `valid` met een complete gecontroleerde witness staat spelstart toe. Gebruik afzonderlijk `invalid`, `unsupported` en `inconclusive`; een deterministische knopenlimiet is geen bewijs van onmogelijkheid.

## Onderbouwing en alternatieven

Alleen typechecks of oppervlaktetelling geven onvoldoende garantie. Een schemabibliotheek in de core schendt de vastgestelde dependencygrens en bewijst bovendien geen plaatsbaarheid. Adapters mogen aanvullende transportvalidatie doen, maar vervangen de corecontrole niet.

## Gevolgen

De concrete numerieke grenzen en foutcodes staan in document 02. Vrijgegeven presets hebben een directe witness. Bij andere configuraties kan een begrensde zoekopdracht onvoldoende bewijs leveren; die regels worden dan niet geaccepteerd. Uitvoering van zware validatie wordt buiten de main UI-thread georganiseerd in de latere architectuur.

## Verificatie

FR-03 en NFR-02; US-02/US-28; RULE-01 t/m RULE-06 en RULE-17/18/20. Controleer dat afgewezen invoer state en RNG ongemoeid laat. Dit zijn geplande controles; er is nog geen implementatie getest.
