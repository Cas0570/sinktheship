Status: Geaccepteerd

Versie: 1.3

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Architectuur](../../docs/04-architecture.md), [Uitbreiden](../../docs/15-extension-guides.md)

# web

Browsercompositie en Vite-ingang. De packagegrens bestaat; domeinfunctionaliteit volgt in de eigen bouwtaken.

## Publieke API en voorbeeld

`src/index.ts` is de Vite-entry, geen importeerbare library-API. Andere packages mogen de app niet importeren. De composition root importeert uitsluitend publieke package-ingangen.

## Grenzen en uitbreiden

Compilerprofiel: `browser`. Toegestane interne productdependencies: game-core, game-session, opponents, opponent-neural, ui. Voeg compositie onder `src/` toe en voeg gedragstests toe volgens [kwaliteit](../../docs/12-quality-testing.md). Nieuwe dependencies vragen een ADR; pas manifest, references en de gecontroleerde graaf gezamenlijk aan.

## Controle

Vanaf de root: `pnpm typecheck`, `pnpm check:boundaries` en `pnpm test:boundaries`. De grenssuite controleert deze package-ingang en compilerconfiguratie. Eigen gedrags-/componenttests volgen zodra deze package gedrag levert. De gedeelde test- en lintinrichting is beschikbaar via `pnpm test` en `pnpm lint`; de [browsertestbasis](../../tests/README.md) heeft een afzonderlijke testapp en controleert ook de lege productiepagina. Productflows volgen bij hun eigen taken.

## Lokale start

`pnpm dev` vanuit de root compileert eerst de packages en start Vite op loopback. Open de getoonde URL: de pagina is bewust leeg, met documenttitel SinkTheShip en een lege module-entry. Er zijn nog geen React-schermen, vertalingen, Worker of spelregels. React staat klaar als peerprovider voor de UI-package; de frontendtaken leveren React-rendering en Tailwind. De librarybuilds gebruiken `dist/`; Vite levert de statische app in `apps/web/dist/`.

De productie-Vite-config weigert testmodules in de modulegraaf. `pnpm build` vanuit de root inspecteert daarna het artefact. Gebruik voor testinjectie uitsluitend de afzonderlijke testcompositie; voeg geen seed-queryparameter of debugglobal aan deze app toe.

## Uitvoerbaar voorbeeld

Vanaf de repositoryroot na installatie:

```sh
pnpm dev
```

Verwacht een Vite-URL op `127.0.0.1` en een lege pagina met titel SinkTheShip. Stop met Ctrl+C. Voor een productiecontrole: `pnpm build`; verwacht `apps/web/dist/index.html` plus assets en een geslaagde fixture-inspectie. De [browserhandleiding](../../tests/README.md) controleert dezelfde productie-entry naast de aparte fixtureapp. Voeg schermen pas toe volgens de [schermgids](../../docs/15-extension-guides.md#een-scherm-toevoegen) en de eigen UI-taak; de router en Worker zijn nog gepland.
