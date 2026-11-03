Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-03

Gerelateerd: [Architectuur](../../docs/04-architecture.md)

# apps/server

Uitsluitend toekomstontwerp voor serverautoriteit; geen runtime of workspacepackage in v1. Zie [multiplayer](../../docs/11-multiplayer-future.md).

## Ingang en controle

Er is geen `package.json`, `src/index.ts`, publieke API, startcommando of testscript. Voeg geen lege serverruntime toe om aan een moduletemplate te voldoen. Controleer vanaf de repositoryroot:

```sh
git ls-files apps/server
```

Verwacht uitsluitend `apps/server/README.md`. `pnpm build` bouwt deze map niet. De [architectuur](../../docs/04-architecture.md#modulecatalogus) en het [toekomstontwerp](../../docs/11-multiplayer-future.md) bepalen de latere servergrens. Implementatie vraagt eerst een afzonderlijke geautoriseerde taak; volg dan de [uitbreidingsafspraken](../../docs/15-extension-guides.md#voor-elke-uitbreiding) en de normale [bijdrageworkflow](../../CONTRIBUTING.md).
