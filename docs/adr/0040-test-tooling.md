Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

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

Alle relevante AT-groepen uit 12; negatieve projectie-/importfixtures, shrink-replay en browserfailure-injectie. De productlagen blijven ontworpen; de toolingtests zijn in T02 gebouwd.

## Uitvoering in T02

Vitest 5.0.5 draait één Node-project voor de gedeelde lintconfig en masterpromptbewaking, met JUnit-output. Vite 8.3.5 is ook als root-testtooldependency gedeclareerd om de Vitest-peer expliciet te leveren; de webbuild houdt dezelfde versie. De bestaande Node-grenssuite blijft intact en wordt aansluitend uitgevoerd. Dit voorkomt een onnodige herschrijving van T01-tests en geeft geen productcoverage voor nog lege domeinpackages. DOM-/React-, property- en browsersuites volgen wanneer het betreffende gedrag bestaat. Het eerste domeingedrag krijgt de oorspronkelijke coverage-eisen uit 12.

Bronnen via Context7 op 2026-11-02: [Vitest-projects](https://vitest.dev/guide/projects) en [reporters](https://vitest.dev/guide/reporters). Versie/engines/peers zijn uit npm gelezen en de gepinde toolchain is daadwerkelijk getest.
