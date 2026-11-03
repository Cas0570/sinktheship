Status: Concept

Versie: 1.0

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Regels](../02-game-rules.md), [T05](../14-backlog.md#t05), [T06](../14-backlog.md#t06), [validatiebesluit](0024-ruleset-validation.md), [testtooling](0040-test-tooling.md)

# ADR 0051 — Schemavalidatie als afzonderlijke bouwstap

## Besluitbasis

Implementatievoorstel ter review met T05. Het bestaande vereiste van een plaatsbaarheidsbewijs vóór spelstart blijft ongewijzigd.

## Context

T05 bouwt schema, capabilities, v1-configuraties en signaturen; de plaatsbaarheidszoeker is expliciet uitgesloten en volgt in T06. De bestaande `validateRuleSet` mag uitsluitend `valid` met een gecontroleerde witness teruggeven. Een succesvolle schemacontrole kan dat niet beloven.

## Besluit

Voeg `validateRuleSetSchema` met `RuleSchemaValidationResult` toe als afzonderlijke publieke voorcontrole. De positieve uitkomst heet `schema-valid`, heeft rules/signatures en geen witness. Afwijzingen gebruiken de bestaande invalid-/unsupported-uitkomsten. Het volledige `validateRuleSet` blijft gepland voor T06, met zijn ongewijzigde contract; er komt geen tijdelijke stub die iedere zoekopdracht als inconclusive presenteert.

De voorcontrole volgt de validatievolgorde en grenzen van document 02 tot en met noodzakelijke lengte-/oppervlaktecontroles. Zij meldt de eerste fout met een deterministisch pad (`$`, objectvelden met punt, array-index tussen haken) en levert bij succes een onafhankelijke kopie. De readonly-API blijft een compile-time-afspraak.

`createV1RuleSet(contactRule?, extraShotOnHit?)` levert verse data voor de vier vastgestelde combinaties, standaard Klassiek. De typed factory is geen parser voor onbekende JSON. Presetlabels, UI-discovery en de definitieve keuzeregistry blijven buiten T05. `getRuleSignatures` projecteert uitsluitend semantische velden uit schema-gecontroleerde regels; de functie bewijst zelf geen capabilities of plaatsbaarheid.

## Onderbouwing en alternatieven

T05 en T06 samen bouwen zou de expliciete taakgrens overschrijden. Zonder publieke voorcontrole kan de schemalaag niet onafhankelijk worden gebruikt en getest. `valid` zonder witness verzwakt het goedgekeurde contract; `inconclusive` zonder uitgevoerde zoekopdracht is misleidend. Een apart discriminant maakt het onderscheid zichtbaar voor callers en de compiler.

De T05-tekst “IDs … veranderen de signatuur niet” wordt gepreciseerd tot **preset-IDs**. Document 02 is contracteigenaar en noemt vloot-ID expliciet semantisch; die blijft dus in beide signaturen. Dit is een zichtbare verduidelijking, geen wijziging van het canonicalisatiebesluit.

## Gevolgen

Alleen game-core krijgt runtimecode, zonder externe dependency, RNG, klok of ambient state. De types voor de volledige validatie blijven beschikbaar, maar alleen schemavalidatie is uitvoerbaar. Voor spelstart blijft later de volledige validatie verplicht. De testdependencies en dekking zijn uitgewerkt in ADR 0040; geen nieuwe productdependency.

## Verificatie

T05 draagt bij aan AT-02-01/02/03 en AT-28-01 met grenzen, versieprioriteit, ondersteunde policies, canonieke fixture en reproduceerbare properties. Een onplaatsbare 2×2-no-touch-vloot bewijst expliciet dat `schema-valid` geen plaatsbaarheidsclaim doet. T06 moet de witness-/zoekbudgetuitkomsten toevoegen. Reviewbesluit voor dit voorstel hoort bij de T05-PR, niet bij een nieuwe productkeuze.
