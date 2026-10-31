Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0023 — Volledige regels en strategiecompatibiliteit scheiden

## Besluitbasis

Uitwerking van het goedgekeurde fase-1-plan; de concrete stringrepresentatie is goedgekeurd met batch A. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

Opslag en matchmaking moeten alle regels onderscheiden. Een model voor dezelfde observaties hoeft niet opnieuw getraind te worden alleen omdat de starter of extra-schotvariant verschilt.

## Besluit

Gebruik `rulesSignature` voor alle semantische regels en `strategySignature` voor bord, vloot, contactregel en informatievrijgave. Gebruik in v1 een versieprefix plus canonieke JSON, zonder hashingdependency. De exacte canonicalisatie en prefixes staan uitsluitend in document 02.

## Onderbouwing en alternatieven

Eén signatuur maakt hergebruik onnodig strikt of laat opslagregels weg. Een SHA-256-digest is compacter, maar vraagt een hashingimplementatie of een runtimeport en is minder rechtstreeks te reviewen. Canonieke strings zijn langer, maar exact, deterministisch en dependencyvrij.

## Gevolgen

Displaynamen en array-/objectvolgorde hebben geen invloed. Signaturen zijn geen authenticatiebewijs. Compatibiliteit vereist daarnaast expliciet ondersteunde beurtconfiguraties, encoding en runtime; dezelfde strategiesignatuur garandeert geen gelijke winrate.

## Verificatie

FR-03/FR-04 en NFR-02/NFR-11; US-02/US-03/US-29. RULE-14 t/m RULE-16 worden gedeelde TS/Python-fixtures. Een latere digest verandert de prefix en vereist migratie. Dit zijn geplande controles; er is nog geen implementatie getest.
