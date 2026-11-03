Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# ui

Presentational React-componenten. De packagegrens bestaat; domeinfunctionaliteit volgt in de eigen bouwtaken.

## Publieke API en voorbeeld

De rootexport is bewust leeg. Importeer toekomstige API uitsluitend via `@sinktheship/ui`; nooit via `src/` of `dist/`.

Dit uitvoerbare voorbeeld controleert alleen de package-ingang, niet toekomstig spelgedrag. Voer het uit vanaf de repositoryroot na installatie:

```sh
pnpm typecheck
pnpm --filter @sinktheship/ui exec node --input-type=module -e 'import * as api from "@sinktheship/ui"; console.log(Object.keys(api));'
```

Verwacht `[]`: `src/index.ts` bevat uitsluitend `export {}`. Dit is een inspectie van de eigen package; productafnemers gebruiken later benoemde publieke imports.

## Grenzen en uitbreiden

Compilerprofiel: `browser`. Toegestane interne productdependencies: geen. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. Eigen gedrags-/componenttests volgen zodra deze package gedrag levert. De gedeelde test- en lintinrichting is beschikbaar via `pnpm test` en `pnpm lint`; zij claimt nog geen productgedrag voor deze lege API.

Voor componentgedrag gebruik je het afzonderlijke jsdom-project volgens de [testhandleiding](../../tests/README.md#uitbreiden); `packages/*/test` wordt momenteel door het Node-project gevonden. Neem een nieuwe module-eigen componenttest expliciet op in de jsdom-include en sluit deze uit van Node.
