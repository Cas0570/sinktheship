Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# web

Browsercompositie en Vite-ingang. De packagegrens bestaat; domeinfunctionaliteit volgt in de eigen bouwtaken.

## Publieke API en voorbeeld

`src/index.ts` is de Vite-entry, geen importeerbare library-API. Andere packages mogen de app niet importeren. De composition root importeert uitsluitend publieke package-ingangen.

## Grenzen en uitbreiden

Compilerprofiel: `browser`. Toegestane interne productdependencies: game-core, game-session, opponents, opponent-neural, ui. Voeg implementatie onder `src/` toe, exporteer publieke symbolen vanuit `src/index.ts` en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. Eigen gedrags-/componenttests volgen zodra deze package gedrag levert; De gedeelde test- en lintinrichting is beschikbaar via `pnpm test` en `pnpm lint`; browserflows volgen bij hun eigen taken.

## Lokale start

`pnpm dev` vanuit de root compileert eerst de packages en start Vite op loopback. Open de getoonde URL: de pagina is bewust leeg, met documenttitel SinkTheShip en een lege module-entry. Er zijn nog geen React-schermen, vertalingen, Worker of spelregels. React staat klaar als peerprovider voor de UI-package; de frontendtaken leveren React-rendering en Tailwind. De librarybuilds gebruiken `dist/`; Vite levert de statische app in `apps/web/dist/`.
