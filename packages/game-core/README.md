Status: Geaccepteerd

Versie: 1.3

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Regels](../../docs/02-game-rules.md), [architectuur](../../docs/04-architecture.md), [uitbreiden](../../docs/15-extension-guides.md), [ADR 0051](../../docs/adr/0051-staged-rule-validation.md)

# game-core

Pure spelregels en engine. De eerste implementatie levert regeltypes, schemavalidatie, vier v1-configuraties en canonieke signaturen. Geometrie, plaatsbaarheidsbewijs en enginecommands volgen in hun eigen taken.

## Publieke API en voorbeeld

Importeer uitsluitend via `@sinktheship/game-core`; nooit via `src/` of `dist/`.

| Export | Gebruik |
|---|---|
| `createV1RuleSet(contactRule?, extraShotOnHit?)` | Verse 10×10-configuratie; contact `allow` of `no-touch`, boolean extra schot; standaard Klassiek |
| `validateRuleSetSchema(unknown)` | Vorm, waarden, capabilities, lengte-/oppervlaktevoorwaarden; `schema-valid`, `invalid` of `unsupported` |
| `getRuleSignatures(rules)` | Canonieke volledige/strategiestrings voor schema-gecontroleerde data; geen validatie of mutatie |
| Regeltypes | `RuleSet`, `ShipSpec`, `Coord`, `Placement`, `TurnConfiguration`, signaturen, fout-/resulttypes en enums uit document 02 |

`schema-valid` is **geen toestemming voor spelstart**: er is nog geen witness. `RuleValidationResult` beschrijft de latere volledige validatie, maar `validateRuleSet` is nog niet geïmplementeerd. De typed factory is geen parser. Foutcodes en paden zijn data voor latere EN/NL-vertalingen; er is geen gebruikerscopy in de core.

Voer vanaf de repositoryroot uit:

```sh
pnpm typecheck
pnpm --filter @sinktheship/game-core exec node --input-type=module -e 'import { createV1RuleSet, validateRuleSetSchema } from "@sinktheship/game-core"; console.log(validateRuleSetSchema(createV1RuleSet()).status);'
```

Verwacht `schema-valid`. Een toekomstige versie wordt vóór de v1-velden gecontroleerd:

```ts
import { validateRuleSetSchema } from '@sinktheship/game-core';

const result = validateRuleSetSchema({ schemaVersion: 2, futureField: true });
// { status: 'unsupported', reason: 'schema-version' }
```

## Grenzen en uitbreiden

Compilerprofiel: `pure`; geen runtime-dependencies, DOM, tijd of RNG. De normatieve regels staan uitsluitend in document 02. Voeg ondersteunde waarden of policies pas na contractreview toe; alleen een enum uitbreiden levert geen speelbare policy. De presetfactory is nog geen UI-keuzeregistry of configdiscovery. De [presetgids](../../docs/15-extension-guides.md#een-regel-preset-toevoegen) vereist daarnaast volledige validatie en bots die later volgen.

De validator levert een onafhankelijke kopie; readonly blijft een compile-time-afspraak. `getRuleSignatures` neemt vloot-IDs en lengtes mee, maar geen nameKeys/presetmetadata. ASCII-veld-/vlootvolgorde en het verschil tussen rules en strategy zijn vastgelegd in 02. Wijzig de gedeelde betekenis niet door een golden fixture opnieuw te genereren uit productiecode.

## Controle

`pnpm test` draait de unit-/propertytests plus de geïsoleerde grenssuite; `pnpm typecheck`, `pnpm lint` en `pnpm build` controleren de package- en productgrenzen. Coverage wordt bewaakt volgens [kwaliteit](../../docs/12-quality-testing.md); rapporten staan in `.artifacts/coverage/`.

De signaturefixture in `test/fixtures/classic-signatures.json` is onafhankelijk uit de normatieve JSON van document 02 gecanonicaliseerd met Python, niet met de implementatie. Tests vergelijken de letterlijke strings, controleren alle vier v1-combinaties, grenzen, versieprioriteit en schema-versus-plaatsbaarheid. Drie fast-check-properties draaien elk 1.000 gevallen met seed 20261103. Bij falen bewaart de testoutput seed, shrink-path en het minimale tegenvoorbeeld. Er is geen Python-enginepariteit of speelbare browserflow getest door deze suite.
