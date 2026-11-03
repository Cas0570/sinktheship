Status: Geaccepteerd

Versie: 1.3

Laatst gewijzigd: 2026-11-03

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

## Uitvoering in T03

De eerder gekozen browser-/componenttools zijn gepind in de root-devDependencies: Playwright Test 1.64.1, Testing Library React 16.3.3, DOM 10.4.2, user-event 14.6.8, jest-dom 7.0.1 en jsdom 30.1.3. React en ReactDOM 19.3.1 leveren de testapp en de expliciete Testing Library-peers, gelijk aan de bestaande React-versie; geen nieuwe productiecoredependency. Node 26.8.1 voldoet aan de opgehaalde enginevereisten.

De fixtureapp is een aparte Vite-entry in plaats van een runtime-testmodus in de productieapp. Dit voorkomt dat seedbediening of fixturecode door een verkeerd ingestelde omgevingsvariabele in productie terechtkomt. Een scripted transcript is voldoende voor de infrastructuurproef; echte RNG/SessionPort-contracten worden niet vooruitlopend nagebouwd. De browserpoort faalt ook bij een geslaagde diagnostische retry. Dit wordt met foutinjectie gecontroleerd.

Bronnen via Context7 op 2026-11-02: [Playwright-configuratie](https://playwright.dev/docs/test-configuration), [React useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore), [Testing Library React API](https://testing-library.com/docs/react-testing-library/api), [user-event setup](https://testing-library.com/docs/user-event/setup) en [jsdom](https://github.com/jsdom/jsdom). De [testhandleiding](../../tests/README.md) beschrijft de uitvoering en grenzen.

## Uitvoering in T05

De eerste core-implementatie activeert de reeds gekozen fast-check-tooling met root-devDependency `fast-check@4.10.2` en `@vitest/coverage-v8@5.0.5`, gelijk aan de gepinde Vitest-versie. V8-coverage gebruikt de aanwezige Node-runtime; Istanbul-instrumentatie zou een tweede transformatiestap toevoegen zonder noodzaak. Eigen willekeurige testloops missen shrinking en worden niet gebruikt. Beide dependencies blijven buiten de pure core en productiebuild.

`pnpm test` bewaakt de oorspronkelijke grenzen van 90% statements/lines/functions en 85% branches voor alle game-core-bronbestanden. Alleen het typebestand `rules.ts` en de exportbarrel `index.ts` zijn expliciet uitgesloten. De rapporten staan in `.artifacts/coverage/` en gaan mee in het bestaande CI-artefact. De kritieke signature-/schemaproperties draaien elk 1.000 gevallen met seed 20261103; fast-check rapporteert seed, shrink-path en tegenvoorbeeld bij falen. Bewaar die gegevens in het PR-bewijs en voeg het minimale regressiegeval toe vóór herstel. Er is nog geen nightly-workflow; 10.000-runs-nachtmetingen worden dus niet geclaimd.

Bronnen via Context7 op 2026-11-03: [Vitest coverage](https://vitest.dev/config/coverage) en [fast-check replay](https://fast-check.dev/docs/configuration/runner-configuration/). Versies zijn via de registry gecontroleerd; de lockfile pinnt de daadwerkelijke installatie.
