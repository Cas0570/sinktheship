Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [spelregels](../02-game-rules.md), [stories](../03-user-stories.md), [leeswijzer](../README.md), [masterprompt](../00-masterprompt.md)

# ADR 0022 — Begrensde v1-presets

## Besluitbasis

Uitwerking van het op 2026-10-31 goedgekeurde fase-1-plan. De documenttekst is als onderdeel van batch A goedgekeurd op 2026-10-31.

## Context

De speler moet echte regelvariatie kunnen kiezen, terwijl het eerste model en de plaatsings-UI reviewbaar blijven.

## Besluit

Lever Klassiek, Nog eens bij raak, Ruimte tussen schepen en Aangepast volgens document 02. Aangepast varieert uitsluitend contact (`allow`/`no-touch`) en extra schot bij raak. Alle keuzes gebruiken 10 × 10, de klassieke vijf schepen, quota 1, een gelote starter en typeonthulling bij zinken.

## Onderbouwing en alternatieven

Een vrije editor voor bord, vloot en onthullingen vergroot de test- en modelruimte. Alleen Klassiek voldoet niet aan de opdracht. Vier combinaties bieden een aantoonbaar plaatsbare en begrijpelijke eerste scope.

## Gevolgen

Equivalent samengestelde regels delen signaturen. De volledige no-touch-witness bewijst alle vrijgegeven v1-combinaties. Andere geldige engineconfiguraties worden getest maar niet via de v1-editor aangeboden; Salvo blijft een toekomstpolicy.

## Verificatie

FR-02/FR-03/FR-08; US-02/US-06; RULE-01, RULE-09 t/m RULE-11 en RULE-14/15. De numerieke schema-afbakening in document 02 is goedgekeurd met batch A. Dit zijn geplande controles; er is nog geen implementatie getest.
