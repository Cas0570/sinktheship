Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# benchmark

Node-benchmark en rapporten. De packagegrens bestaat; domeinfunctionaliteit volgt in de eigen bouwtaken.

## Publieke API en voorbeeld

De rootexport is bewust leeg. Importeer toekomstige API uitsluitend via `@sinktheship/benchmark`; nooit via `src/` of `dist/`.

```ts
import {} from "@sinktheship/benchmark";
```

## Grenzen en uitbreiden

Compilerprofiel: `node`. Toegestane interne productdependencies: game-core, game-session, opponents, opponent-neural. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. Eigen gedrags-/componenttests volgen zodra deze package gedrag levert; De gedeelde test- en lintinrichting is beschikbaar via `pnpm test` en `pnpm lint`; zij claimt nog geen productgedrag voor deze lege API.
