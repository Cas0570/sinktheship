Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# opponent-neural

Neural contracten en encoding. De packagegrens bestaat; domeinfunctionaliteit volgt in de eigen bouwtaken.

## Publieke API en voorbeeld

De rootexport is bewust leeg. Importeer toekomstige API uitsluitend via `@sinktheship/opponent-neural`; nooit via `src/` of `dist/`.

Dit uitvoerbare voorbeeld controleert alleen de package-ingang, niet toekomstig spelgedrag. Voer het uit vanaf de repositoryroot na installatie:

```sh
pnpm typecheck
pnpm --filter @sinktheship/opponent-neural exec node --input-type=module -e 'import * as api from "@sinktheship/opponent-neural"; console.log(Object.keys(api));'
```

Verwacht `[]`: `src/index.ts` bevat uitsluitend `export {}`. Dit is een inspectie van de eigen package; productafnemers gebruiken later benoemde publieke imports.

## Grenzen en uitbreiden

Compilerprofiel: `pure`. Toegestane interne productdependencies: game-core, opponents. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. Eigen gedrags-/componenttests volgen zodra deze package gedrag levert. De gedeelde test- en lintinrichting is beschikbaar via `pnpm test` en `pnpm lint`; zij claimt nog geen productgedrag voor deze lege API.

Pure gedragstests komen onder `test/**/*.test.ts` en worden gevonden door het Node-project in `vitest.config.mjs`. Voor DOM/componentgedrag gebruik je het afzonderlijke jsdom-project en de [testhandleiding](../../tests/README.md#uitbreiden). Voeg geen lege tests toe om dekking te suggereren.
