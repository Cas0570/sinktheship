Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Kwaliteit](../12-quality-testing.md), [Python-tooling](0041-python-tooling.md), [dependencygrenzen](0043-dependency-enforcement.md), [stories](../03-user-stories.md)

# ADR 0040 — Vitest, Testing Library, fast-check en Playwright

## Besluitbasis

Unit-, property-, opponentcontract-, Python/pariteits-, component-, e2e- en a11y-tests zijn vereist. De concrete JS-tools werken het goedgekeurde voorstel uit.

Deze uitwerking is met batch E goedgekeurd op 2026-11-01.

## Context

De pure engine vraagt snelle deterministische tests; keyboard/focus vraagt DOMgedrag; echte layout, Workers en browseropslag vragen een browser. Eén testlaag kan dit niet voldoende afdekken.

## Besluit

Gebruik Vitest Node-projects voor pure/sessie-/contracttests, jsdom-projects met React Testing Library/user-event/jest-dom voor componentgedrag, fast-check voor invarianten, Playwright Test voor drie browserengines en axe via @axe-core/playwright voor automatische a11y. Python blijft pytest/ruff volgens ADR 0041. De exacte matrix en scriptcontracten staan in 12.

## Onderbouwing en alternatieven

Jest kan dezelfde unitlaag invullen maar Vitest sluit aan op Vite/ESM. Cypress kan browserflows testen maar Playwright ondersteunt de gekozen engine-matrix en traceworkflow in één suite. Alleen snapshots of axe bewijzen geen keyboard-/screenreaderwerking. Fast-check voegt shrinkbare, reproduceerbare tegenvoorbeelden toe; een eigen random-testloop levert die diagnose niet vanzelf.

## Gevolgen

Testingdependencies blijven uit de productiecore. Geen coveragegaming of tests die de implementatie kopiëren. Eén gedeelde Opponent-suite wordt per factory hergebruikt; browser- en CI-artefacten blijven reproduceerbaar. Versies worden bij bootstrap gepind, niet als vermeende actuele nummers in deze ADR verzonnen.

## Verificatie

Alle relevante AT-groepen uit 12; negatieve projectie-/importfixtures, shrink-replay en browserfailure-injectie. De suite is ontworpen, nog niet gebouwd.
