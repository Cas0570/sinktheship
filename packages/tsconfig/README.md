Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# tsconfig

Werkende gedeelde compilerprofielen voor pure TypeScript, browser en Node. Deze configuratiepackage heeft geen spel-API.

## Publieke API en voorbeeld

`packageName` identificeert deze configuratiepackage.

Vanaf de repositoryroot, na installatie:

```sh
pnpm typecheck
pnpm --filter @sinktheship/tsconfig exec node --input-type=module -e 'import { packageName } from "@sinktheship/tsconfig"; console.log(packageName);'
```

Verwacht `@sinktheship/tsconfig`. De metadata-export komt uit de gebouwde `dist/index.js`; de configexports hieronder zijn bronbestanden en vereisen zelf geen build.

## Grenzen en uitbreiden

Compilerprofiel: `pure`. Toegestane interne productdependencies: geen. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. De grenssuite compileert positieve en negatieve omgevingsproeven en laadt alle configexports. `pnpm test` voert deze suite ook uit.

## Configexports

Gebruik `@sinktheship/tsconfig/pure.json`, `node.json` of `browser.json` als `extends`. `base.json` bevat de gedeelde strict-instellingen. Pure TS heeft uitsluitend ES2022-types, Node voegt expliciet `node` toe, browser voegt DOM/DOM.Iterable toe met Bundler-resolutie. Geen ambient types uit toevallig geïnstalleerde packages. Iedere afnemer stelt zelf `rootDir`, `outDir` en projectreferences in.

Een bestaande afnemer zoals `packages/game-core/tsconfig.json` gebruikt:

```json
{
  "extends": "@sinktheship/tsconfig/pure.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.tsbuildinfo"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "references": []
}
```

Inspecteer het geëxporteerde profiel zonder deep import:

```sh
pnpm --filter @sinktheship/tsconfig exec node --input-type=module -e 'import pure from "@sinktheship/tsconfig/pure.json" with { type: "json" }; console.log(pure.extends);'
```

Verwacht `./base.json`. Verander een profiel samen met een positieve en negatieve compileproef in `scripts/boundaries.test.mjs`; een nieuw profiel krijgt een expliciete export. Pas de [uitbreidingsgrenzen](../../docs/15-extension-guides.md#voor-elke-uitbreiding) toe zonder ambient types aan pure modules toe te voegen.
