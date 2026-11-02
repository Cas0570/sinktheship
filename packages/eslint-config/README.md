Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# eslint-config

Gedeelde ESLint flat config voor broncode, tooling en de pure core. Deze package bevat werkende regels en eigen positieve/negatieve Vitest-proeven.

## Publieke API en voorbeeld

`packageName` identificeert deze configuratiepackage.

```ts
import { packageName } from "@sinktheship/eslint-config";
```

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
