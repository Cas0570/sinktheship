Status: Geaccepteerd

Versie: 1.5

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Requirements](01-product-vision-scope.md), [stories en AT-IDs](03-user-stories.md), [engine](05-game-engine.md), [tegenstanders](06-opponents.md), [ML](07-neural-network.md), [frontend](08-frontend.md), [tooling](16-tooling-mcp.md), [ADR 0048](adr/0048-quality-budgets.md), [leeswijzer](README.md)

# Kwaliteit, tests en vrijgave

Dit is de centrale verificatiespecificatie. Requirements blijven normatief in 01, de 87 acceptatietests in 03 en algoritme-/modelcriteria in 05–07. Dit document legt vast hoe zij aantoonbaar worden gecontroleerd. Er is nog geen speelbare applicatie. T01 levert `pnpm typecheck`, `pnpm check:boundaries`, `pnpm test:boundaries`, `pnpm dev` en `pnpm build`; T02 voegt lint, format:check, test en de eerste CI-jobs toe. Overige scripts en rapportpaden hieronder blijven te bouwen contracten.

## Testlagen en gekozen tooling

| Laag | Middelen | Bewijs en relevante stories |
|---|---|---|
| Regels/geometrie | Vitest in Node; fast-check | Alle RULE-fixtures, grenzen, witness/inconclusive, signatures, rotatie en equivalentie; US-02/04/06/28 |
| Engine/projectie | Vitest plus propertytests | Immutability, legal actions, quota, sunk-ambiguïteit, winner, RNG, identieke publieke views bij verschillende geheimen; US-06/07/28 |
| Tegenstandercontract | Eén gedeelde Vitest-suite met factories voor iedere Opponent | Geldig, seedreproduceerbaar, alleen view, alle ondersteunde regels, annulering, niet-muteren; US-03/07/19 |
| Sampler | Kleine exhaustieve fixtures plus eigenschapstests | Ieder gelabeld resultaat mogelijk, juiste exacte combinaties/gewichten, geen overlap; distributiebewijs uit 06 blijft nodig |
| Sessies/opslag | Vitest met gecontroleerde ports; echte browsertest voor Web Locks/Worker/localStorage | Refresh, receipts, stale-resultaten, queuevolgorde, write failure en twee tabs; US-08/15/28 |
| Componenten | Vitest met jsdom, React Testing Library, user-event en jest-dom | Rol/naam, focus, keys, errorstates, vertalingen, storeabonnement; US-04/05/11/12/17 |
| Browserflow | Playwright Test: Chromium, Firefox, WebKit | Plaatsen → spelen → einde → rematch, directe URLs, hervatten, pointercancel en touchalternatief; US-01/04/09/14/21 |
| Toegankelijkheid | axe via `@axe-core/playwright`, handmatige keyboard-/screenreadercontrole | Automatische detectie én volledige taken zonder muis; US-05/21 |
| Python/ML | pytest, ruff; fixtures gedeeld met TS | Simulator-/encodingpariteit, data-splits, shape/mask, loss, export- en beslispariteit; US-18/29 |
| Catalogi/bundels | Buildvalidatie en dependency-cruiser | Imports, model/locale-discovery, secrets-/dev-codecontrole, bytebudgetten; US-03/20/22/23 |
| Performance | Lighthouse CLI, Chrome DevTools MCP/traces, echte telefoon en Worker-meetharnas | Koude load, frames, inferentie, sampler en storagekosten; US-13/22 |
| Release/documentatie | Menselijke review en extensieproeven | API/README/docs samen, bruikbaar zonder AI, bord/handboek bijgewerkt; US-20/24 |

Vitest gebruikt afzonderlijke `projects` voor Node en jsdom; browser-E2E blijft bij Playwright Test. Query componenten bij voorkeur op rol en toegankelijke naam, niet op CSS-structuur. Await user-eventhandelingen en zichtbare uitkomsten. jsdom bewijst geen layout, echte pointercapture of screenreaderwerking. De bronnen zijn via Context7 geraadpleegd op 2026-11-01: [Vitest-projects](https://vitest.dev/guide/projects), [Testing Library](https://testing-library.com/docs/queries/about/) en [user-event](https://testing-library.com/docs/user-event/intro/). Zie ADR 0040.

## Betekenisvolle invarianten en fixtures

Een test beschrijft waarneembaar contractgedrag; hij kopieert niet dezelfde implementatieformule als zijn verwachte waarde. Golden fixtures worden onafhankelijk beoordeeld en alleen met verklaarde contractwijziging aangepast. Snapshotbestanden van complete UI-bomen vervangen geen expliciete assertions.

Minimale properties: geldige plaatsing blijft binnen bord/contactregels; geaccepteerde schoten zijn uniek; een afgewezen command verandert state/events/RNG niet; extra-schotbeleid verandert quota precies volgens 02; finished levert geen nieuwe actie; projecties bevatten geen geheimen; encode is gelijk in TS/Python; serialize–validate–restore behoudt het vervolgresultaat. Private plaatsingen en seeds worden niet via testhulpen beschikbaar in productie.

Voor kritieke goedkope properties: 1.000 runs per property per PR. Voor duurdere complete matchproperties: 100 runs, met vooraf begrensde bord-/vlootgenerators. Nightly 10.000 respectievelijk 1.000, buiten releaseholdouts. Bewaar fast-checkversie, seed, shrink-path en minimaal tegenvoorbeeld bij falen; voeg een klein regressiegeval toe vóór herstel. Een vaste PR-seedset maakt vergelijking reproduceerbaar; de nightly seed verandert maar wordt gelogd. [fast-check replay](https://fast-check.dev/docs/configuration/runner-configuration/), via Context7 gecontroleerd.

Een verdeeltest op willekeurige samples is geen bewijs van uniformiteit. Gebruik de exacte kleine enumeraties uit 06 om de sampler te controleren; statistische rooksignalen mogen alleen aanvullende diagnostiek zijn. Timeouts mogen geen trage maar geldige vloten uit benchmarknoemers verwijderen.

Streef voor `game-core` naar minimaal 90% statements/lines/functions en 85% branches, met 100% van de benoemde invariant-/randgevalfixtures. Coverage wordt bij de eerste implementatie ingesteld en bewaakt; percentages mogen geen reden zijn voor waardeloze tests. Generated assets, type-only modules en externe runtimes vallen buiten coverage met een expliciete lijst. Verlaag een grens alleen met onderbouwde review en ADR-aanpassing, nooit om een falende PR te laten slagen.

## Kernflows, fouten en traceerbaarheid

| Groep | AT-bron | Vereiste flow/foutinjectie |
|---|---|---|
| Start/regels/niveau | US-01/02/03 | Vier v1-configuraties, beide starters, disabled Impossible, invalid/unsupported/inconclusive |
| Bediening/beurten | US-04/05/06 | Pointerdrag én selecteer-klik én volledig keyboard; randrotatie, cancel, duplicate shot, einde bij extra schot |
| Informatiegrens | US-07/17 | Twee private states met identieke publieke historie; ambigue sunk-cluster; postgame-inzicht uit pre-shotobservatie |
| Bewaren/identiteit/replay | US-08/15/28 | Refresh tijdens plaatsen/denken; quota-/SecurityError; corrupt/te nieuw record; twee tabs en lockverlies; stale inference |
| Rematch/uitleg/instellingen | US-09/10/11/12 | Nieuw game-ID, lege vloot, echte taalwisseling, lange NL-teksten, mute/reduced motion, niet-geleverde effecten |
| Model/discovery | US-13/18/19/29 | Cold/warm cache, digest-/shape-/runtimefout, offline foutkeuze, exact oud model herstellen, export/holdout |
| Routes/devices/veiligheid | US-14/21/22/23 | Directe SPA-route, vreemde URL, chunk404, zoom, keyboard, budgetten, netwerk/headers, productie zonder devbediening |
| Uitbreiden/review | US-20/24 | Zes proeven uit 15; taak-/PR-/document-/MCP-bewijs |
| Optionele functies | US-16/25/26/27 | Stats, geschiedenis wissen, offline model en dark mode alleen als de betreffende release ze levert |

Testtitels bevatten het betreffende AT-ID en mogen meerdere relevante IDs noemen. De volledige [FR/NFR → US → taak → testmatrix](README.md#traceerbaarheid) is met batch F geleverd; UI-/ML-/MP-controles zijn aanvullingen, geen vervangende nummering. De toekomstige MP-tests uit 11 blokkeren v1 niet. Statistieken en AI-inzicht zijn Should; een vrijgegeven variant moet haar criteria wel volledig halen.

De deterministische volledige Easy-flow gebruikt een apart **testbuildprofiel** met een geïnjecteerde fixtureseed. Productie bevat geen seedqueryparameter, verborgen debugmenu of global testhook. Test daarnaast een ongewijzigde productiebuild zonder seedhook op alle routes, opslag en netwerk/security. Bewaar de testflow met fixture-ID en seedplan; verwar de testbundle niet met het te deployen artefact.

Hetzelfde onderscheid geldt voor candidate-modellen: de aparte kwalificatiecompositie uit 07 injecteert één exact kandidaatbestand voor T40–T42, zonder promotie voor te wenden. Bewaar modeldigest en runtimeprofiel bij de metingen. De uiteindelijke productiebuild laat uitsluitend gepromoveerde modellen toe en bevat geen candidate-selectie-ingang. Controleer na promotie ook het gewone productiepad; browserbewijs vóór promotie is geen bewijs dat een candidate al beschikbaar is voor spelers.

## Browser- en toegankelijkheidsmatrix

Releasecriteria gelden voor de actuele en vorige stabiele versie van Chrome, Edge, Firefox en Safari, inclusief Safari op iOS en Chrome op Android. Leg versienummers/OS/builddatum vast bij de release; schrijf geen vandaag-verondersteld versienummer als blijvende norm. Playwright Chromium/Firefox/WebKit zijn snelle enginecontroles, geen bewijs dat echte Safari, Edge, iPhone of Android is getest.

| Uitvoering | Minimale dekking |
|---|---|
| Iedere PR met runtimewijziging | Playwright Chromium/Firefox/WebKit kernflow; 390/1440; EN/NL waar gedrag/tekst wijzigt |
| UI-/responsivewijziging | 320/390/768/1440, EN/NL, pointer en keyboard; relevante Figma-state/screenshots |
| Release op desktop | Genoemde huidige/vorige echte browsers; volledige kernflow en modelondersteuning waar van toepassing |
| Release mobiel | iPhone 16 Pro met Safari en Android Chrome op beschikbaar testtoestel; beide browsergeneraties via testlab/extra toestel waar nodig |
| Handmatige hulpmiddelen | VoiceOver + Safari op iPhone; NVDA + Firefox op Windows; volledig keyboard op desktop |

De iPhone 16 Pro is op 2026-11-01 door de ontwikkelaar beschikbaar gesteld als referentietoestel. Andere apparaten/OS-omgevingen zijn nog niet als aanwezig bevestigd. Een ontbrekende matrixcel wordt als niet getest geregistreerd en moet vóór vrijgave worden afgedekt, bijvoorbeeld met geleend toestel of testomgeving. Geen stilzwijgende versmalling naar alleen het beschikbare toestel.

WCAG 2.2 AA: controleer rol/naam/status, correcte gridnavigatie en één tabstop, zichtbare/niet bedekte focus, dialogtrap/terugkeer, live-resultaten zonder herhaling, 200% tekstzoom, reflow op 320 px, contrast (4,5:1 gewone tekst; 3:1 grote tekst en relevante UI-markeringen), kleuronafhankelijke uitkomsten en dragalternatieven. Bordcellen ≥24 × 24 CSS-pixels; overige primaire bediening ≥44 × 44. Tooltip blijft ook via focus/Escape bruikbaar. Geen a11y-uitsluiting zonder verklaarde oorzaak en review; axe/Lighthouse alleen is onvoldoende. Zie de [W3C-norm](https://www.w3.org/TR/WCAG22/).

## Budgetten en vaste meetprofielen

| Metriek | Grens / interpretatie | Meetbewijs |
|---|---|---|
| Initiële JS | ≤200 KiB gzip; cumulatief cold Home én eerste volledige Easy-start tot interactief bord; lazy neural bytes uitgesloten | Resource-inventory plus gzip per uniek uitgevoerd JS/MJS-bestand; Workerchunks meetellen |
| Lighthouse | Performance ≥90; Accessibility 100 | Mediaan van vijf onafhankelijke koude navigaties voor Performance; Accessibility iedere run 100 |
| Animaties | p95 framewerk ≤16,7 ms bij 60-fps-doel | Drie traces per flow op echte referentiehardware; iedere run moet voldoen |
| ONNX | ≤1.000.000 bytes per model.onnx | Bestandslengte en manifestintegriteit |
| Inference | p95 ≤50 ms, batch 1; exacte grenzen in 07 | 20 warm-ups + 1.000 vaste observaties, drie afzonderlijke runs; iedere run moet voldoen |
| Betrouwbaarheid | Geen mutatieverlies bij geslaagde write; beperkte hervatbaarheid zichtbaar bij mislukte write | Failure-/crash-/twee-tabscenario's |
| Neural/bootstrapkosten | Geen extra harde fictieve tijdgrens | Cold download/verify/init, encoding, transfer, storage en UI-latency apart rapporteren |

Het extra JS-meetpunt bij Easy-start voorkomt dat bijna alle gewone spelcode lazy wordt verplaatst om alleen Home goedkoop te laten lijken. Tel de gziplengte op van ieder uniek benodigd JS-bestand op dat pad; tel geen model/WASM mee, maar rapporteer hun kosten afzonderlijk. Font/CSS/media-bytes staan in dezelfde inventory als aparte categorieën. De budgetten zijn acceptatiegrenzen, geen al behaalde prestaties.

### LH-mobile-v1 — synthetische loadcontrole

Pin Lighthouse, Chrome, runner-OS en lockfile in het meetartefact. Config: `formFactor=mobile`, `throttlingMethod=simulate`, `rttMs=150`, `throughputKbps=1638.4`, `cpuSlowdownMultiplier=4`; screenEmulation mobile, 390 × 844 CSS-pixels, deviceScaleFactor 3. Pin ook de gebruikte emulatedUserAgent uit die Lighthouse-versie en sla de resolved config op. Dit is een labprofiel, geen nabootsing van een specifieke iPhoneprocessor. De instellingen volgen de [Lighthouse-throttlingdocumentatie](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md), via Context7 gecontroleerd op 2026-11-01.

Gebruik een productiebuild op dezelfde lokale statische testhost met releaseheaders, schoon profiel zonder extensies, geen bestaande cache/service worker, normale CPUbelasting en dezelfde runnerklasse. Meet Home, regels, moeilijkheid en plaatsing als bereikbare pre-gameflows; gescripte Game/Result-states krijgen afzonderlijke audits na fixturevoorbereiding, zonder cold-navigatiescore te vervalsen. Voor release bevestig ook de werkelijk gedeployde preview-origin: CDN/headers/netwerkverschillen worden apart gemeld. Bewaar alle vijf JSON/HTML-rapporten en de mediaan, geen selectie van alleen de beste run.

### IOS-16PRO-v1 — beschikbaar fysiek referentietoestel

Gebruik de iPhone 16 Pro met actuele stabiele iOS/Safari, leg de exacte versies vast vóór elke kwalificatie en verander ze niet tussen kandidaatvergelijkingen. Batterij ≥50%, energiebesparing uit, geen opladen tijdens timings, na minimaal vijf minuten afkoelen op kamertemperatuur 20–25 °C, normale helderheid en hetzelfde wifi-netwerk. Noteer effectieve viewport/devicePixelRatio; echte devicegeometrie hoeft niet 390 px te zijn. Leg schermfrequentie vast en gebruik voor de 60-fps-vergelijking een beschikbare 60-Hz-instelling; 120-Hz-resultaten blijven afzonderlijk gelabeld.

Test plaatsing, tien miss/hit/sunk-overgangen, bordwissel, lange log, dialog en resultaat in drie herhaalbare traces van elk 30 seconden. Analyseer per daadwerkelijk geproduceerd frame de toegewezen main-thread/renderwerkduur met de profiler, niet alleen gemiddelde FPS. Rapporteer p50/p95/max, frame-intervallen, gemiste frames en eventuele long tasks. Als de gebruikte profiler geen betrouwbare per-framewerkduur oplevert, is alleen rAF-timing geen voldoende bewijs voor dit budget: gebruik een geschikte traceomgeving en registreer die ontbrekende meting.

Safari op een iPhone kan via Web Inspector vanaf een aangesloten Mac worden onderzocht; Chrome DevTools MCP is geen Safari-inspector. Een Mac is nog niet als beschikbaar bevestigd. Gebruik waar nodig een testomgeving voor die trace; de gewone handmatige iPhoneflows blijven ook zonder Mac uitvoerbaar. Zie [Apple: iOS inspecteren](https://developer.apple.com/documentation/safari-developer-tools/inspecting-ios). Een browsermeetharnas kan wel Worker-inferentietijden lokaal verzamelen/exporteren zonder persoonlijke speldata.

### MID-ANDROID-v1 — aanvullende modelkwalificatie

> Aanname: gebruik voor de eis over een gemiddelde telefoon een Pixel 7a, 8 GB, met actuele stabiele Android/Chrome, 60-Hz-weergave en dezelfde temperatuur-/batterijvoorwaarden. Beschikbaarheid is nog niet bevestigd; Q-06 houdt dit punt open vóór ML-promotie.

De iPhone 16 Pro is bruikbaar voor echte iOS-prestaties, maar geldt niet automatisch als bewijs voor dit middenklasseprofiel. Een gesimuleerde 4× CPUvertraging op een laptop vervangt de fysieke ≤50 ms-inferentiemeting niet. Een ander fysiek middenklassetoestel kan na expliciete profielreview worden gekozen vóór de metingen; leg hardware/OS/browser vast en vergelijk kandidaten op hetzelfde toestel. Voer de meetmethode uit 07 ongewijzigd uit; encode/download/init/denkvertraging tellen niet mee in inferentie maar worden apart gerapporteerd. De iPhone krijgt daarnaast dezelfde inferencecheck voor zijn eigen browserkwalificatie.

## Security, privacy en headers

Valideer snapshots/manifests/URL-waarden als onbetrouwbare data, met bounds en zonder HTML/eval. React rendert vertalingen als tekst. De host levert HTTPS; resources, fonts, model en geluid komen van eigen origin. Geen W&B-code, gebruikerstracking, analytics of externe fontrequest in de productieapp. Controleer requestlog en cookies bij alle Must-flows en model laden; noodzakelijke hostingtoegangslogs zijn apart providerbeleid, geen applicatieanalytics. W&B in ontwikkeltooling is een ander datakanaal en krijgt nooit echte gebruikersspeldata.

Voorgesteld CSP-/headercontract voor de productiebuild, vóór release op alle vereiste browsers te controleren:

```text
Content-Security-Policy: default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; style-src-elem 'self'; style-src-attr 'unsafe-inline'; img-src 'self'; font-src 'self'; media-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

De beperkte style-attribuutuitzondering is voor gevalideerde dynamische bord-/heatmapgeometrie en CSS-variablewaarden; stylesheets blijven eigen-origin en scripts krijgen geen algemene `unsafe-eval` of inline-scripttoestemming. Alle styles komen uit gecontroleerde code, nooit uit user-HTML. `wasm-unsafe-eval` staat WebAssemblycompilatie toe zonder algemene JS-eval; zie [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src), geraadpleegd via Context7. Test de CSP ook op de Workerresponse en echte ORT-assets. Voeg geen `blob:` of `data:` toe tenzij een concrete noodzakelijke dependency dit met review rechtvaardigt.

Single-threaded WASM uit 07 vereist geen COOP/COEP voor threading. Een toekomstige multithreaded configuratie vraagt nieuwe header-/browserkwalificatie. Geef hashassets immutable caching, HTML/catalogus een hervalidatiebeleid; ontbrekende `.onnx`/`.wasm`-assets krijgen een echte foutstatus, geen SPA-HTML met 200. Controleer contenttypes en volledige digestvalidatie. Securityheaders op de gekozen Cloudflare-host worden in de deploytaak getest; dit document activeert ze niet.

## CI, artefacten en releasepoorten

GitHub Actions start op pull requests en main-push; lange benchmark/modelkwalificatie is een aparte handmatige/releaseworkflow. Het serviceaccount krijgt standaard `contents: read`; PR-jobs krijgen geen W&B-/deploysecrets. Voer onbetrouwbare PR-code niet met elevated `pull_request_target` uit. Pin externe Actions op volledige commit-SHA met een leesbare versienotitie en onderhoud ze als dependency. Zie [GitHub workflowveiligheid](https://docs.github.com/en/actions/reference/security/secure-use) en [artefacten](https://docs.github.com/en/actions/tutorials/store-and-share-data), via Context7 gecontroleerd.

| Job / poort | Werk | Artefact |
|---|---|---|
| `quality-ts` | Frozen pnpm-lockfile; ESLint, Prettier-check, strict typecheck, dependencygrenzen, unit/property/contracttests | Test-/coverage-/boundaryrapport |
| `quality-python` | Locked uv; ruff check/format-check en pytest met kleine CPU-fixtures | JUnit/ML-smokerapport, geen volledige training |
| `parity` | TS/Python dezelfde golden fixtures; als neural aanwezig: kleine vaste exportfixture en gepinde ORT-profielen | Waardevergelijking, tolerantie-/beslisrapport |
| `web-build` | Productie- en expliciete testbuild; catalogus/vertalingen/assetintegriteit, gzip/secrets/dev-codecontrole | Buildinventaris en afzonderlijk gelabelde bundles |
| `browser` | Afhankelijk van build; Playwright engines, failure-injectie, axe en relevante screenshots | HTML-rapport, screenshots, traces |
| `benchmark-smoke` | 100 vaste developmentblokken per vergelijking/configuratie; fouten en grote regressies detecteren | Seeds/ruwe tellingen; geen releasewinrateclaim |
| `release-qualification` | Alle vereiste browsers/devices; 5.000 holdoutblokken volgens 06; fysieke inference-/framechecks; headers/privacyaudit | Volledig release-/promotiedossier |

Een nog niet geïmplementeerde ML-laag mag vóór M5 als expliciete niet-toepasselijke poort bestaan; v1.0 kan die niet overslaan. Een Always-running aggregate job controleert welke jobs vereist zijn voor de gekozen release en faalt bij skip/error van een vereiste job. Deploy alleen het gecontroleerde productieartefact van dezelfde commit, nooit een opnieuw gebouwde of testseed-bevattende variant. Branch-/mergebeveiliging volgt de bordworkflow uit F.

Playwright retries: lokaal 0, CI maximaal 1 voor diagnostiek; een test die pas bij retry slaagt blijft als flaky zichtbaar en blokkeert de vereiste aggregatecheck totdat de oorzaak is opgelost. Trace bij eerste retry, screenshot bij failure; gevoelige lokale state zit niet in fixtures. [Playwright traces](https://playwright.dev/docs/trace-viewer). Baselines worden alleen na menselijke beoordeling bijgewerkt, met passende Figma-node/commit; geen automatische screenshotacceptatie om rood groen te maken.

Bewaar PR-rapporten 14 dagen en releasebewijs 90 dagen binnen de toegestane repositorylimieten. Modelkwalificatie-/datasetdigests, manifests, modelkaart en definitieve benchmarkreferenties moeten zolang het model vrijgegeven is duurzaam vindbaar blijven; een tijdelijke Actions-artifactlink alleen volstaat niet. Cache dependencies op OS/toolchain/lockfile, geen gedeelde mutabele game-state of credentialbestand. Volledige training en datasets worden niet bij elke PR opgebouwd.

## Commando-contract en codeconventies

Deze root-scripts worden tijdens M0/M1 en de bijbehorende bouwtaken geleverd. Een commandonaam is geen bewijs dat het script vandaag bestaat.

| Commando | Toekomstige verantwoordelijkheid |
|---|---|
| `pnpm lint` | ESLint plus dependencygrenzen, zonder automatische fixes in CI |
| `pnpm format:check` | Prettier-check; bronmasterprompt, binary/generated output expliciet uitgesloten |
| `pnpm typecheck` | Strict TS-projectreferences en publieke exports |
| `pnpm test` | Node-unit-/contract-/propertytests en jsdom-componenttests |
| `pnpm test:parity` | TS-fixtureproducer en locked Python-vergelijking |
| `pnpm test:e2e` | Playwright Test met alle geconfigureerde projecten |
| `pnpm benchmark:smoke` | Vaste kleine CI-vergelijking |
| `pnpm build` | Productiebuild en catalogusvalidatie |
| `pnpm check:release` | Samenvoegen vereiste resultaten/inventory; faalt bij ontbrekend bewijs |
| `uv run --project ml --locked pytest` | Python-tests |
| `uv run --project ml --locked ruff check ml` | Python-lint |
| `uv run --project ml --locked ruff format --check ml` | Python-formatcheck |

Training/evaluatie/export/publicatiecommando's blijven uitsluitend normatief in 07. Node/pnpm/Python/uv/dependencyversies worden tijdens bootstrap gepind en in lockfiles vastgelegd, daarna alleen met review bijgewerkt. ESLint gebruikt gedeelde flat configs; Prettier doet opmaak, geen tweede concurrerende lintformatter. Behoud de originele bytes van `00-masterprompt.md` via ignore plus hashcontrole. Alternatieven en keuze staan in ADR 0042.

Gebruik strict TypeScript, expliciete publieke API's, geen `any` als escape voor onbegrepen data, type-only imports waar passend, geen deep imports en geen niet-deterministische corecalls. Code/identifiers/comments/commits Engels; docs Nederlands. Comments leggen redenen en invarianten uit. Nieuwe dependencies vragen een ADR; nieuwe API's krijgen tegelijk module-README/docs/tests. Verborgen state komt niet in logs of diagnostics.

Conventional Commits met taak-ID, bijvoorbeeld `feat(T14): add density target scoring`. Eén taakbranch en PR, `Closes #<issue>`, kleine reviewbare diff. Reviewsamenvatting: resultaat/reden, doc-/ADR-link, echte testcommando's en uitkomsten, reviewfocus, bijgewerkte docs en daadwerkelijke GitHub-/Notion-acties. Een mislukte externe update wordt expliciet gemeld. De exacte taak-lifecycle staat in [AGENTS.md](../AGENTS.md) en de [backlog](14-backlog.md); T14 is de definitieve density-taak uit batch F.

## Definition of Done

- Taakscope en gekoppelde AT-criteria zijn aantoonbaar geleverd; geen ongerelateerde feature of afgezwakte test.
- Relevante lint/type-/unit-/contract-/browserchecks zijn groen; volledige verplichte CI-poorten beoordelen dezelfde commit.
- Publieke API, module-README, technische docs, vertaalkeys en eventuele mapping zijn gezamenlijk bijgewerkt.
- UI-werk heeft passende Figma-vergelijking en keyboard-/pointer-/a11y-bewijs; performancewerk heeft profiel en ruwe meting.
- Nieuwe tegenstander/model/preset heeft compatibility- en eerlijke-informatietests; promotie heeft het volledige bewijs uit 06/07.
- Issue/PR/reviewsamenvatting en bordstatus zijn consistent; relevante handboek-/experimentupdates zijn uitgevoerd of concreet als gemist gemeld.
- De ontwikkelaar heeft gereviewd; pas merge en gecontroleerde Projects-workflow maken de taak Done. Een groene test is geen zelfstandig mergeakkoord.

MVP vereist Easy–Hard, beide talen, alle toepasselijke Must/NFR-poorten en eerlijke unavailable-state voor neural. V1.0 voegt de gekwalificeerde neural pipeline/compatibele modellen en browserbudgetten toe. Should/Could-keuzes worden bij de release expliciet vermeld, zonder niet-gebouwde functionaliteit voor te wenden. Budget-/profielafwijkingen vragen een gemotiveerde ADR en review vóór vrijgave.

## Lokale workspacecontrole

T01 toetst AT-20-03 en het installatiegedeelte van AT-24-01 met `pnpm test:boundaries`: frozen installatie en build in een tijdelijke kopie, alle toegestane imports, rootexports, configuratie laden, verboden deep/relatieve/omgekeerde imports, core-runtime-dependencies, typecycli en pure/browser/Node-profielen. `pnpm dev` wordt daarnaast met een HTTP-rookproef gecontroleerd. Dit vervangt geen menselijke uitbreidingsproef, speltest, browserkwalificatie of CI-bewijs. De suite stopt bij mislukte setup, zodat ontbrekende dependencies niet als geslaagde negatieve importtest worden verward.

## Eerste CI-poort

[Quality](../.github/workflows/quality.yml) draait op iedere PR en push naar main, zonder padfilters. `quality-ts` installeert de frozen lockfile en draait format/hash, typecheck, lint/dependencygrenzen en tests. `web-build` bouwt dezelfde checkout onafhankelijk. Beide gebruiken Ubuntu 24.04, gepinde Node/pnpm, uitsluitend `contents: read`, checkout zonder bewaarde credentials, geen repositorysecrets en geen gedeelde dependencycache. `pull_request_target` wordt niet gebruikt. Bash met pipefail voorkomt dat het bewaren van logs een falende check groen maakt.

Alle externe Actions zijn op een volledige SHA gepind met een versienotitie. De pins zijn tegen de officiële release-/commitmetadata en gebruikte action-inputs gecontroleerd. Diagnostiek (`lint.log`, `tests.log`, `vitest.xml`) en statische webbuild krijgen aparte artefacten met commit-SHA en 14 dagen retentie. Ontbrekende artefacten zijn fouten. Diagnostiek uploadt ook na een falende check; de webbuild alleen na succes. Dit is PR-bewijs, geen releasepublicatie. De latere 90-dagenrelease-/modelregeling blijft ongewijzigd.

Vitest heeft nu één Node-project met echte config-/beveiligingsproeven, geen lege producttests. De bestaande geïsoleerde grenssuite blijft onderdeel van `pnpm test`. Geen `passWithNoTests` of gefocuste `.only`-tests; jsdom, Python, browsers, benchmark, coverage voor toekomstige spelcode en de release-aggregatecheck worden pas bij hun implementatie toegevoegd.

Prettier controleert JS/MJS/CJS/TS/TSX, JSON, YAML, HTML en CSS. De bestaande handgeschreven Markdown-specificaties vallen buiten de automatische bootstrap-formatrun om een ongerelateerde massale documentdiff te voorkomen; hun inhoud/links blijven reviewonderdeel. De letterlijke masterprompt is aanvullend expliciet genegeerd en `scripts/check-masterprompt.mjs` vergelijkt zijn SHA-256 met de baseline uit de goedgekeurde bron. Genereer die baseline niet opnieuw om een fout weg te werken.

Verificatie van de rootscripts: een tijdelijke verboden core-import moet lint laten falen, onopgemaakte code format:check, een verkeerde TS-toekenning typecheck/build en een opzettelijk onware assertion test. Herstel elke fixture vóór de groene eindrun. Configtests controleren bovendien private-state-/namespaceomzeilingen, legale viewimports en de masterprompt-bytebewaking. De concrete uitvoeringsresultaten en CI-links horen in PR/issue, niet als tweede taakstatus in dit document.
