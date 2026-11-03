Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# eslint-config

Gedeelde ESLint flat config voor broncode, tooling en de pure core. Deze package bevat werkende regels en eigen positieve/negatieve Vitest-proeven.

## Publieke API en voorbeeld

`packageName` identificeert deze configuratiepackage.

Vanaf de repositoryroot, na installatie:

```sh
pnpm typecheck
pnpm --filter @sinktheship/eslint-config exec node --input-type=module -e 'import { packageName } from "@sinktheship/eslint-config"; console.log(packageName);'
```

Verwacht `@sinktheship/eslint-config`. De metadata-export komt uit de gebouwde `dist/index.js`; de configexports hieronder zijn bronbestanden en vereisen zelf geen build.

## Grenzen en uitbreiden

Compilerprofiel: `pure`. Toegestane interne productdependencies: geen. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm lint`, `pnpm test` en `pnpm typecheck`. `test/base.test.mjs` gebruikt de echte ESLint-API en virtuele bronbestanden: toegestane geometrie, geïnjecteerde RNG en publieke viewtypen slagen; verboden randomness, tijd, storage, private state en namespace-/type-importomzeilingen falen. De bestaande grenssuite blijft afzonderlijk beschikbaar als `pnpm test:boundaries`.

## Configexport

`@sinktheship/eslint-config/base` exporteert de flat-config-array voor de repositoryroot:

```js
import base from '@sinktheship/eslint-config/base';
export default base;
```

De config combineert aanbevolen JS-/TS-regels, expliciete runtime-globals en type-only imports. Core verbiedt ambient tijd/randomness/netwerk/opslag, inclusief Math-aliases en computed Math-toegang. Bots en schermcontainers mogen geen private coretypen/factories of checkpointtypen importeren; workspace-namespace-/wildcard-/dynamische imports kunnen die controle niet omzeilen. De sessie/compositie behoudt haar bedoelde autoriteit. `dist`, node_modules en meetartefacten worden globaal uitgesloten. Ongebruikte suppressions zijn fouten.

Publieke symbolen volgen de contracteigenaren in 02/05/06. Voeg bij nieuwe private exports ook een gerichte regel en positieve/negatieve fixture toe; dit is een architectuurcontrole, geen sandbox tegen opzettelijk kwaadaardige broncode. React-specifieke component-/hookregels worden met de eerste echte React-implementatie ingevuld. Dependencies en versieonderbouwing staan in [ADR 0042](../../docs/adr/0042-lint-and-format.md#uitvoering-in-t02).

Controleer de echte configexport vanaf de root:

```sh
pnpm --filter @sinktheship/eslint-config exec node --input-type=module -e 'import base from "@sinktheship/eslint-config/base"; console.log(Array.isArray(base) && base.length > 0);'
```

Verwacht `true`. Voeg een regel aan `base.js` toe met minimaal één toegestane en één geweigerde fixture in `test/base.test.mjs`; draai daarna `pnpm test` en `pnpm lint`. Houd configwijzigingen en hun [uitbreidingsafspraken](../../docs/15-extension-guides.md#voor-elke-uitbreiding) in dezelfde PR.
