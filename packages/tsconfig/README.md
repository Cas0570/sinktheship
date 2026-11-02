Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# tsconfig

Gedeelde compilerprofielen. De packagegrens bestaat; domeinfunctionaliteit volgt in de eigen bouwtaken.

## Publieke API en voorbeeld

`packageName` identificeert deze configuratiepackage.

```ts
import { packageName } from "@sinktheship/tsconfig";
```

## Grenzen en uitbreiden

Compilerprofiel: `pure`. Toegestane interne productdependencies: geen. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. Eigen gedrags-/componenttests volgen zodra deze package gedrag levert; T02 levert de gedeelde test- en lintinrichting.

## Configexports

Gebruik `@sinktheship/tsconfig/pure.json`, `node.json` of `browser.json` als `extends`. `base.json` bevat de gedeelde strict-instellingen. Pure TS heeft uitsluitend ES2022-types, Node voegt expliciet `node` toe, browser voegt DOM/DOM.Iterable toe met Bundler-resolutie. Geen ambient types uit toevallig geïnstalleerde packages. Iedere afnemer stelt zelf `rootDir`, `outDir` en projectreferences in.
