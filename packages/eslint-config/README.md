Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# eslint-config

Gedeelde lintconfiguratie. De packagegrens bestaat; domeinfunctionaliteit volgt in de eigen bouwtaken.

## Publieke API en voorbeeld

`packageName` identificeert deze configuratiepackage.

```ts
import { packageName } from "@sinktheship/eslint-config";
```

## Grenzen en uitbreiden

Compilerprofiel: `pure`. Toegestane interne productdependencies: geen. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. Eigen gedrags-/componenttests volgen zodra deze package gedrag levert; T02 levert de gedeelde test- en lintinrichting.

## Configexport

`@sinktheship/eslint-config/base` exporteert voorlopig een lege flat-config-array. Dit is uitsluitend een laadbare grens voor T02, geen actieve lintcontrole. `pnpm check:boundaries` controleert nu al manifests, imports en de dependencygraaf; globals en symbolische toegangsrechten worden door T02 ingevuld.
