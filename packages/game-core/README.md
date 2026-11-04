Status: Geaccepteerd

Versie: 1.5

Laatst gewijzigd: 2026-11-04

Gerelateerd: [Regels](../../docs/02-game-rules.md), [architectuur](../../docs/04-architecture.md), [uitbreiden](../../docs/15-extension-guides.md), [ADR 0051](../../docs/adr/0051-staged-rule-validation.md)

# game-core

Pure spelregels en engine. De eerste implementatie levert regeltypes, schemavalidatie, vier v1-configuraties en canonieke signaturen. Daarnaast levert zij geometrie, plaatsingscontrole en deterministisch plaatsbaarheidsbewijs. Enginecommands volgen in hun eigen taak.

## Publieke API en voorbeeld

Importeer uitsluitend via `@sinktheship/game-core`; nooit via `src/` of `dist/`.

| Export | Gebruik |
|---|---|
| `createV1RuleSet(contactRule?, extraShotOnHit?)` | Verse 10×10-configuratie; contact `allow` of `no-touch`, boolean extra schot; standaard Klassiek |
| `validateRuleSetSchema(unknown)` | Vorm, waarden, capabilities, lengte-/oppervlaktevoorwaarden; `schema-valid`, `invalid` of `unsupported` |
| `getRuleSignatures(rules)` | Canonieke volledige/strategiestrings voor schema-gecontroleerde data; geen validatie of mutatie |
| `validateRuleSet(input, { maxSearchNodes })` | Volledige validatie met witness; anders invalid/unsupported/inconclusive |
| `validatePlacement(rules, input, complete = true)` | Controleert complete vloot of expliciete gedeeltelijke draft, retourneert een onafhankelijke kopie |
| `isWithinBoard(coord, board)` | Gehele, 0-based coördinaat binnen de bordgrenzen |
| `getShipCells(ship, length)` | Cellen vanaf start in de gekozen richting, zonder clipping |
| `rotateShip(ship)` | Verse 90°-rotatie rond de startcel; voorgestelde draft daarna valideren |
| Regeltypes | `RuleSet`, `ShipSpec`, `Coord`, `Placement`, `TurnConfiguration`, signaturen, fout-/resulttypes en enums uit document 02 |

`schema-valid` is **geen toestemming voor spelstart**: er is nog geen witness. Alleen `validateRuleSet` met status `valid` bewijst plaatsbaarheid. De typed factory is geen parser. Foutcodes en paden zijn data voor latere EN/NL-vertalingen; er is geen gebruikerscopy in de core.

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

Compilerprofiel: `pure`; geen runtime-dependencies, DOM, ambient tijd of ambient randomness. De normatieve regels staan uitsluitend in document 02. Voeg ondersteunde waarden of policies pas na contractreview toe; alleen een enum uitbreiden levert geen speelbare policy. De presetfactory is nog geen UI-keuzeregistry of configdiscovery. De [presetgids](../../docs/15-extension-guides.md#een-regel-preset-toevoegen) vereist daarnaast catalogusintegratie en bots die later volgen.

De validator levert een onafhankelijke kopie; readonly blijft een compile-time-afspraak. `getRuleSignatures` neemt vloot-IDs en lengtes mee, maar geen nameKeys/presetmetadata. ASCII-veld-/vlootvolgorde en het verschil tussen rules en strategy zijn vastgelegd in 02. Wijzig de gedeelde betekenis niet door een golden fixture opnieuw te genereren uit productiecode.

## Controle

`pnpm test` draait de unit-/propertytests plus de geïsoleerde grenssuite; `pnpm typecheck`, `pnpm lint` en `pnpm build` controleren de package- en productgrenzen. Coverage wordt bewaakt volgens [kwaliteit](../../docs/12-quality-testing.md); rapporten staan in `.artifacts/coverage/`.

De signaturefixture in `test/fixtures/classic-signatures.json` is onafhankelijk uit de normatieve JSON van document 02 gecanonicaliseerd met Python, niet met de implementatie. Tests vergelijken de letterlijke strings, controleren alle vier v1-combinaties, grenzen, versieprioriteit en schema-versus-plaatsbaarheid. Drie fast-check-properties draaien elk 1.000 gevallen met seed 20261103. Bij falen bewaart de testoutput seed, shrink-path en het minimale tegenvoorbeeld. Er is geen Python-enginepariteit of speelbare browserflow getest door deze suite.

## Plaatsing en bewijs

`validatePlacement` vereist schema-gecontroleerde regels. De standaardmodus vereist ieder vloot-ID exact eenmaal. `complete = false` accepteert ook een lege of gedeeltelijke draft, maar controleert nog steeds IDs, vorm, gehele coördinaten, richting, grenzen, overlap en contact. Een `valid` draftresultaat is alleen in de complete modus een complete vloot. `PlacementDraft` (uit het enginecontract), `PlacementIssue` en `PlacementValidationResult` zijn publieke types; foutcodes/paden staan in [document 02](../../docs/02-game-rules.md#geometrie-api). Cellen binnen hetzelfde schip gelden niet als verboden onderling contact.

De getypeerde geometriehelpers vereisen geldige scheepsdata; `getShipCells` vereist een positieve gehele lengte. Rotatie om de startcel wisselt horizontaal/verticaal. Zij schuift een schip niet automatisch terug binnen het bord. Valideer de voorgestelde plaatsing en vervang de oude draft alleen bij succes. De functies muteren geen input; een toekomstige enginecommand bewaakt de daadwerkelijke stateovergang.

```ts
import { createV1RuleSet, validateRuleSet, validatePlacement } from '@sinktheship/game-core';

const result = validateRuleSet(createV1RuleSet(), { maxSearchNodes: 1 });
if (result.status === 'valid') {
  const checked = validatePlacement(result.rules, result.witness);
  // checked.status === 'valid'; this witness is proof, not a random fleet.
}
```

De vier vrijgegeven configuraties gebruiken de opnieuw gecontroleerde witness uit 02. Overige regels volgen de DFS-volgorde en knoopdefinitie uit [05](../../docs/05-game-engine.md#plaatsbaarheidsvalidatie). Alleen kandidaten die binnen het bord passen worden opgesomd; overlap-/contactafwijzingen tellen mee. De limiet is een positief veilig geheel getal; een ongeldige programmeringsparameter geeft `RangeError`, geen regeluitkomst. De validator gebruikt geen klok of RNG en heeft geen globale cache. Een witness is niet uniform willekeurig; de sampler volgt in T11. De caller/compositielaag moet zware zoekopdrachten later in de Worker uitvoeren.

De gedeelde [plaatsingsfixtures](../../fixtures/rules/placement.json) dekken RULE-01–06; de tests dekken daarnaast RULE-17/18, exacte budgetuitputting, 2×2/26×26, rechthoekige borden, onveranderde drafts en onbetrouwbare invoer. Twee nieuwe properties draaien elk 1.000 gevallen met seed 20261103: rotatie/transpositie en vergelijking met een onafhankelijke uitputtende domino-oracle op kleine borden. Pythonpariteit en UI-bediening zijn hiermee nog niet bewezen.

## Reproduceerbare randomness

`Rng`, `RngState` en `RngFactory` volgen [het enginecontract](../../docs/05-game-engine.md#randomness-en-seeds). `createRng(RngSeed)` initialiseert PCG32; `rngFactory.fromState(snapshot)` herstelt zonder draw. `nextUint32()` levert een unsigned 32-bitwaarde; `int(n)` levert een onbevooroordeelde waarde in `[0, n)`. Ook `int(1)` verbruikt een draw. Een ongeldige grens geeft `RangeError` zonder verbruik; ongeldige seed-/snapshotvelden geven `TypeError`. Dit zijn ontwikkelaarsfouten, geen productcopy.

```ts
import { createRng, rngFactory } from '@sinktheship/game-core';

const rng = createRng({
  initStateHex: '000000000000002a',
  initSequenceHex: '0000000000000036',
});
const candidate = rngFactory.fromState(rng.exportState());
const choice = candidate.int(100);
// Commit candidate.exportState() only together with an accepted effect.
// Discarding candidate leaves rng unchanged.
```

`createRandomStreams(RandomSeedPlan)` maakt vijf onafhankelijke instances: `starter`, `placement['player-1'/'player-2']` en `strategy['player-1'/'player-2']`. Geef iedere caller uitsluitend zijn eigen stroom. Browserentropie blijft een platformadapter; benchmarkseedparen staan expliciet in een privaat seedplan. Er is geen afleiding uit een publieke game-ID of gedeelde botseed. De [API-keuze](../../docs/adr/0053-rng-seeding-api.md) staat ter review in T07.

De [golden vector](../../fixtures/rng/pcg32.json) controleert referentieseeding, zes outputs en checkpoints. Tests dekken JSON-restore, unsigned wraparound, upper-tail rejection, ongeldige invoer en onafhankelijke stromen. Een weggeworpen RNG-kopie wordt getest met klok-/cancelcalls ertussen. De echte commandafwijzing en async sessietransactie volgen in T08/T23; Pythonpariteit volgt in T34. PCG-bronvermelding en Apache-licentie staan in `src/rng.ts` en [de licentiekopie](../../licenses/pcg-apache-2.0.txt).
