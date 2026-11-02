# Browser- en componenttestbasis

Dit is testinfrastructuur voor [T03](../docs/14-backlog.md#t03). De fixture is een vast transcript (`ready → advanced → complete`) en implementeert geen spelregels of `SessionPort`. Er zijn geen game-core-/sessiedependencies. De echte sessie wordt later via de composition root geïnjecteerd volgens [08](../docs/08-frontend.md); dupliceer die contracten hier niet.

## Uitvoeren

Vanaf de repositoryroot, na de [quick start](../README.md#quick-start):

```sh
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm typecheck:e2e
pnpm test
pnpm check:browser-retry
pnpm test:e2e
```

Playwright ondersteunt niet ieder Linux-distributieprofiel. De CI-job gebruikt Ubuntu 24.04 en installeert de systeembibliotheken. Op de lokale Manjaro-checkout draaien Chromium en Firefox; de gedownloade WebKit-build mist libicu74, libxml2 en libflite1. Gebruik daar voorlopig `pnpm test:e2e --project='chromium-*' --project='firefox-*'`; de verplichte volledige matrix blijft in CI actief. Een gedeeltelijke lokale run kwalificeert WebKit niet.

`test:e2e` bouwt zelf twee afzonderlijke previews op loopback: fixture op 4174, productie op 4173. Beide poorten moeten vrij zijn; een bestaande server wordt niet hergebruikt. De 12 projecten combineren Chromium/Firefox/WebKit, breedte 390/1440 en EN/NL. Elk project controleert de fixture én productie (24 gevallen). Iedere test krijgt een verse browsercontext; iedere paginalaad maakt een nieuwe fixture-instantie. De TypeScript-browsertests hebben een afzonderlijke strict no-emit-check.

Vitest gebruikt een Node-project en een jsdom-project. `component/setup.mjs` registreert jest-dom-matchers en expliciete cleanup; `userEvent.setup()` en alle interacties worden awaited. De fixture wordt als dependency doorgegeven en `useSyncExternalStore` leest een stabiele snapshot. De componentproeven controleren keyboard, reset, terminale state, StrictMode, isolatie en unsubscribe.

## Handmatige fixtureproef

```sh
pnpm build:test
pnpm exec vite preview --config tests/browser-app/vite.config.mjs --host 127.0.0.1 --port 4174 --strictPort
```

Open `/en` en `/nl`. Tab naar de eerste knop, Enter: `ready` wordt `advanced`; klik nogmaals: `complete`, knop uitgeschakeld. Herstellen geeft `ready`; herladen na een stap geeft opnieuw `ready`. Dit is een diagnostische fixture zonder productdesign; er is geen Figma-component of productflow aan toegevoegd.

## Productiescheiding en foutbewijs

De testapp staat buiten `apps/web` en wordt uitsluitend via een eigen Vite-config gebouwd naar `.artifacts/browser-app/`. Er is geen debugglobal, queryseed of runtime-testschakelaar. De productieconfig weigert lokale modules onder `test`, `tests` en `__tests__` in de modulegraaf, ook vóór tree-shaking. `pnpm build` inspecteert aansluitend alle productieartefacten op fixturemarkers. De Node-tests bevatten een werkelijke verboden Vite-build, een leeg artefact en een gelekte marker als negatieve proeven. Breid de markers mee uit als een nieuwe testinjectie wordt toegevoegd; deze controle is geen algemene scanner voor willekeurige debugcode.

`check:browser-retry` maakt uitsluitend onder `.artifacts/retry-probe/` een tijdelijke Playwright-suite. De eerste assertion faalt bewust, de retry slaagt; de wrapper slaagt alleen wanneer Playwright exitcode 1 geeft, beide resultaten kloppen en screenshot plus retrytrace aanwezig zijn. Dit is foutinjectiebewijs, geen flaky producttest die geaccepteerd wordt. De gewone suite heeft lokaal nul retries en in CI maximaal één, met `failOnFlakyTests: true`.

HTML/JUnit staan in `.artifacts/e2e/`; screenshots bij fouten en traces bij de eerste retry staan in de resultatenmap. CI bewaart die en de retry-proef 14 dagen. Bekijk lokaal met `pnpm exec playwright show-report .artifacts/e2e/html` of `pnpm exec playwright show-trace <trace.zip>`. MCP-snapshots staan lokaal in de genegeerde `.playwright-mcp/`.

## Uitbreiden

Voeg componenttests toe onder `tests/component/` of breid de jsdom-include expliciet uit voor module-eigen tests. Pure contracttests blijven in het Node-project. Nieuwe browserflows komen onder `tests/e2e/` met toegankelijke rollen/namen en zichtbare gebruikersassertions. Gebruik echte productports zodra die bestaan; behoud vaste invoer en een eigen instantie per test. Een scripted bootstrapfixture bewijst geen spelwerking, producta11y, visuele overeenkomst, mobiele toestelkwalificatie of releasegereedheid.
