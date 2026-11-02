Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Scope](01-product-vision-scope.md), [stories en tests](03-user-stories.md), [roadmap](13-roadmap.md), [kwaliteit](12-quality-testing.md), [werkinstructies](../AGENTS.md), [bordbesluit](adr/0012-github-projects.md)

# Backlog — taakdefinities

Deze 59 taken zijn specificaties voor de latere bouw. Status staat uitsluitend in GitHub Projects; de checklists hieronder zijn acceptatiecriteria, geen voortgangslijst. Ook na realisatie blijven deze criteria als norm staan. De 59 issues zijn op 2026-11-02 aangemaakt met de titel `Txx · titel`, een korte samenvatting en een link naar de betreffende definitie; de volledige definitie blijft in deze repo. De teruggelezen issuenummers en links staan per taak hieronder. Het taaktype heet op het bord `Work type`, omdat GitHub `Type` reserveert; betekenis en waarden blijven gelijk volgens [ADR 0012](adr/0012-github-projects.md).

Iedere taak volgt de [Definition of Done](12-quality-testing.md) en [taak-lifecycle](../AGENTS.md), inclusief relevante tests, eigen module-README, API-/docupdates, PR en reviewsamenvatting. Die algemene eisen worden hieronder niet 59 keer herhaald. Docs en US-links geven context; genoemde AT-gevallen zijn de concrete bijdrage aan de [traceerbaarheidsmatrix](README.md#traceerbaarheid). Sommige acceptatiegevallen lopen door meerdere taken: een unitfixture alleen sluit een browser- of menselijke proef niet af.

## Planning en omvang

S is een kleine afgebakende wijziging; M is één samenhangende wijziging die in één reviewsessie te beoordelen is; L zou eerst gesplitst moeten worden. De initiële taken zijn S/M, zonder tijdschatting. Als de werkelijke scope te groot blijkt, volgt een gereviewde splitsing met nieuwe stabiele IDs en bijgewerkte afhankelijkheden. Een lange meetrun maakt een beperkte kwalificatietaak niet automatisch een grote codediff.

Alle vermelde afhankelijkheden zijn harde voorgangers die op het bord Done moeten zijn. ID-volgorde is geen uitvoeringsvolgorde. T23 hoort bij M2: de head-to-head-benchmark in T15 gebruikt de gewone sessiecoördinator, vóór de browserintegratie. Na M1 kunnen T34/T35 al beginnen terwijl M2 en het ontwerp nog lopen; T36 heeft bewust ook de gedragsstrategieën en rolloutbasis uit M2 nodig. Er blijft één actieve taak. Externe voorwaarden zoals Figma-rechten/stijlkeuze en fysieke meetapparaten staan in de [roadmap](13-roadmap.md) en [centrale open punten](README.md#centrale-open-punten).

T44–T47 leveren de geplande Should-functies. T57–T59 zijn expliciet optionele Could-taken voor na v1.0, ook al gebruiken ze het toegestane mijlpaalveld M6. Ze staan bij inrichting in Backlog en krijgen het label `priority:could`; geen releasegate is ervan afhankelijk. Een besluit om een Should later te leveren vereist een zichtbare aanpassing van roadmap, afhankelijkheden en review, zonder Must/NFR-eisen te verlagen.

## Takenoverzicht

| ID | Titel | Mijlpaal | Type | Grootte |
|---|---|---|---|---|
| [T01](#t01) | Workspace en packagegrenzen opzetten | M0 | infra | M |
| [T02](#t02) | Lint, unittests en eerste CI-poort | M0 | infra | M |
| [T03](#t03) | Browsertestomgeving en testfixtures | M0 | infra | M |
| [T04](#t04) | Module-ingangen en werkproces beschrijven | M0 | docs | S |
| [T05](#t05) | Regelcontract en canonieke signaturen | M1 | feature | M |
| [T06](#t06) | Geometrie en plaatsbaarheidsbewijs | M1 | feature | M |
| [T07](#t07) | Deterministische RNG en gescheiden stromen | M1 | feature | S |
| [T08](#t08) | Commands en beurtverloop van de engine | M1 | feature | M |
| [T09](#t09) | Publieke views en informatievrijgave | M1 | feature | M |
| [T10](#t10) | Core-serialisatie, replay en gedeelde fixtures | M1 | feature | M |
| [T11](#t11) | Uniforme vlootplaatsing | M2 | feature | M |
| [T12](#t12) | Tegenstandercontract, registry en Easy | M2 | feature | M |
| [T13](#t13) | Normal met hunt en target | M2 | feature | M |
| [T14](#t14) | Hard met probability density | M2 | feature | M |
| [T15](#t15) | Benchmarkharness en ruwe meetdata | M2 | infra | M |
| [T16](#t16) | Statistische rapporten en Easy–Hard-kwalificatie | M2 | feature | M |
| [T17](#t17) | Stijlkeuze en Figma-tokens vastleggen | M3 | design | S |
| [T18](#t18) | Basiscomponenten in Figma | M3 | design | M |
| [T19](#t19) | Spelcomponenten in Figma | M3 | design | M |
| [T20](#t20) | Schermen, prototypeflows en designmapping | M3 | design | M |
| [T21](#t21) | React-basiselementen en tokens | M4 | feature | M |
| [T22](#t22) | Bord- en plaatsingscomponenten in React | M4 | feature | M |
| [T23](#t23) | Lokale sessiecoördinator | M2 | feature | M |
| [T24](#t24) | Sessies bewaren en veilig herstellen | M4 | feature | M |
| [T25](#t25) | Browseropslag, gastidentiteit en tabcoördinatie | M4 | feature | M |
| [T26](#t26) | Game Worker en browsercompositie | M4 | feature | M |
| [T27](#t27) | Routes, externe store en vertalingen | M4 | feature | M |
| [T28](#t28) | Regel- en niveaukeuze aansluiten | M4 | feature | M |
| [T29](#t29) | Volledige plaatsingsflow aansluiten | M4 | feature | M |
| [T30](#t30) | Spelen, resultaat en rematch | M4 | feature | M |
| [T31](#t31) | Instellingen, uitleg en toekomstpagina's | M4 | feature | M |
| [T32](#t32) | Statische build, headers en routefallback | M4 | infra | M |
| [T33](#t33) | MVP-browser-, toegankelijkheids- en budgetkwalificatie | M4 | feature | M |
| [T34](#t34) | Python-simulator en regelpariteit | M5 | ML | M |
| [T35](#t35) | Encoding in TypeScript en Python | M5 | ML | M |
| [T36](#t36) | Datasetgeneratie en gescheiden seeds | M5 | ML | M |
| [T37](#t37) | CPU-baseline trainen en experimenten loggen | M5 | ML | M |
| [T38](#t38) | Evaluatie, ONNX-export en runtimepariteit | M5 | ML | M |
| [T39](#t39) | Modelmanifest, discovery en compatibiliteit | M5 | ML | M |
| [T40](#t40) | Lazy ONNX-runtime in de Game Worker | M5 | feature | M |
| [T41](#t41) | Impossible, expliciet herstel en hervatten | M5 | feature | M |
| [T42](#t42) | Neural kwalificeren en modelpromotie | M5 | ML | M |
| [T43](#t43) | ML-README en menselijke leerproef | M5 | docs | M |
| [T44](#t44) | Wedstrijdstatistieken op het eindscherm | M6 | feature | S |
| [T45](#t45) | Geluid en animaties | M6 | feature | M |
| [T46](#t46) | Historisch AI-inzicht bewaren | M6 | feature | M |
| [T47](#t47) | Heatmap en toegankelijke AI-uitleg | M6 | feature | M |
| [T48](#t48) | Kleine tegenstandergenerator | M6 | infra | S |
| [T49](#t49) | Alle module-README's tegen de code controleren | M6 | docs | M |
| [T50](#t50) | Uitbreidingsproeven voor bot en preset | M6 | docs | M |
| [T51](#t51) | Uitbreidingsproeven voor taal, scherm en Figma-component | M6 | docs | M |
| [T52](#t52) | Uitbreidingsproef voor een modelmap | M6 | docs | M |
| [T53](#t53) | Volledige v1-toegankelijkheid en taalreview | M6 | feature | M |
| [T54](#t54) | Volledige performancekwalificatie | M6 | infra | M |
| [T55](#t55) | V1-privacy, invoer en releaseartefacten | M6 | infra | M |
| [T56](#t56) | V1.0-releasebewijs en overdracht | M6 | docs | M |
| [T57](#t57) | Optioneel: lokale resultaatgeschiedenis | M6 | feature | M |
| [T58](#t58) | Optioneel: offline app en cache-updates | M6 | feature | M |
| [T59](#t59) | Optioneel: donker thema | M6 | design | M |

## T01

**Titel:** Workspace en packagegrenzen opzetten

**Mijlpaal:** M0 · **Type:** infra · **Grootte:** M

**Doel:** Een reproduceerbare basis voor de beschreven modules maken.

**Docs:** [04](04-architecture.md), [12](12-quality-testing.md). **User stories:** [US-20](03-user-stories.md#us-20), [US-24](03-user-stories.md#us-24).

**Scope in:** pnpm-workspace, gepinde Node/pnpm, lockfile, strict TS, publieke exports en Vite-startscript.

**Scope uit:** Spelcode, serverruntime en ML-training.

**Acceptatiecriteria:**

- [ ] Alle modules uit 04 hebben hun bedoelde packagegrens; apps/server bevat uitsluitend een README.
- [ ] Een schone installatie kan pnpm dev en pnpm build uitvoeren; verboden deep imports en core-runtime-dependencies worden geweigerd.

**Afhankelijkheden:** Geen eerdere bouwtaak; de algemene fase-4-voorwaarde en eventuele externe voorwaarden gelden wel.

**Testaanpak:** Compileer positieve en negatieve importfixtures en controleer de schone installatiestappen. Bijdrage aan AT-20-03, AT-24-01.

**Reviewfocus:** De importgrafiek en het onderscheid tussen browser-, Node- en pure TS-configuratie.

**GitHub-issue:** [#1](https://github.com/Cas0570/sinktheship/issues/1)

## T02

**Titel:** Lint, unittests en eerste CI-poort

**Mijlpaal:** M0 · **Type:** infra · **Grootte:** M

**Doel:** Elke volgende wijziging controleerbaar maken.

**Docs:** [12](12-quality-testing.md). **User stories:** [US-20](03-user-stories.md#us-20), [US-24](03-user-stories.md#us-24).

**Scope in:** Vitest, ESLint, Prettier, quality-ts en web-build; SHA-gepinde Actions en artifactbeleid.

**Scope uit:** Python-, benchmark- en browsersuites zolang die nog niet bestaan.

**Acceptatiecriteria:**

- [ ] Lint, format:check, typecheck, test en build hebben uitvoerbare rootscripts en falen aantoonbaar bij een relevante fout.
- [ ] PR-checks gebruiken minimale rechten zonder secrets voor onbetrouwbare PR-code; de letterlijke masterprompt is van formatting uitgezonderd.

**Afhankelijkheden:** [T01](#t01)

**Testaanpak:** Laat één ongeldige import en één falende voorbeeldtest de bedoelde check breken; herstel ze vóór oplevering. Bijdrage aan AT-20-03, AT-24-02.

**Reviewfocus:** Geen lege of overgeslagen suite die als gerealiseerde productdekking wordt gepresenteerd.

**GitHub-issue:** [#2](https://github.com/Cas0570/sinktheship/issues/2)

## T03

**Titel:** Browsertestomgeving en testfixtures

**Mijlpaal:** M0 · **Type:** infra · **Grootte:** M

**Doel:** Deterministische browserproeven mogelijk maken.

**Docs:** [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-21](03-user-stories.md#us-21), [US-23](03-user-stories.md#us-23), [US-24](03-user-stories.md#us-24).

**Scope in:** Playwright Test-config, componenttestbasis, test-only sessie-injectie en browser-CI-job.

**Scope uit:** Productflows en echte releasekwalificatie.

**Acceptatiecriteria:**

- [ ] Een minimale route draait in de afgesproken Playwright-projecten met reproduceerbare testinput.
- [ ] Productieartefacten bevatten geen testseedbediening of debugglobals; diagnostic retry maskeert geen falende eerste poging.

**Afhankelijkheden:** [T02](#t02)

**Testaanpak:** Een browser-smoke plus productieartefactinspectie; toon een geïsoleerde, reproduceerbare fixture. Bijdrage aan AT-21-02, AT-23-03, AT-24-02.

**Reviewfocus:** De scheiding tussen testbuild, productiebuild en Playwright MCP.

**GitHub-issue:** [#3](https://github.com/Cas0570/sinktheship/issues/3)

## T04

**Titel:** Module-ingangen en werkproces beschrijven

**Mijlpaal:** M0 · **Type:** docs · **Grootte:** S

**Doel:** Een ontwikkelaar vanaf een schone checkout laten starten.

**Docs:** [04](04-architecture.md), [12](12-quality-testing.md), [15](15-extension-guides.md), [16](16-tooling-mcp.md). **User stories:** [US-20](03-user-stories.md#us-20), [US-24](03-user-stories.md#us-24).

**Scope in:** README voor bestaande package-/configingangen, apps/web en apps/server; bijdrage-/PR-template en Notion-werkwijze.

**Scope uit:** Fictieve API-voorbeelden voor nog niet gebouwde modules.

**Acceptatiecriteria:**

- [ ] De op dat moment bestaande publieke API's hebben doel, werkend voorbeeld, testcommando en uitbreidingslink; toekomstige API's zijn expliciet gepland.
- [ ] Een proefreview van T01–T03 controleert issue/PR, boardworkflow en reviewsamenvatting; setupwijzigingen zijn met repo-links in Notion verwerkt.

**Afhankelijkheden:** [T02](#t02), [T03](#t03)

**Testaanpak:** Loop de beschreven setup zelfstandig door en controleer alle module-ingangen tegen de repo. Bijdrage aan AT-20-03, AT-24-01, AT-24-02, AT-24-03.

**Reviewfocus:** Geen tweede taakstatuslijst en geen documentatie die alvast niet-bestaande code belooft.

**GitHub-issue:** [#4](https://github.com/Cas0570/sinktheship/issues/4)

## T05

**Titel:** Regelcontract en canonieke signaturen

**Mijlpaal:** M1 · **Type:** feature · **Grootte:** M

**Doel:** Regels eenduidig valideren en vergelijken.

**Docs:** [02](02-game-rules.md), [05](05-game-engine.md). **User stories:** [US-02](03-user-stories.md#us-02), [US-28](03-user-stories.md#us-28).

**Scope in:** RuleSet-schema, ondersteunde capabilities, vier v1-configuraties en rules-/strategy-signaturen.

**Scope uit:** Plaatsbaarheidszoeker en state-machinecommands.

**Acceptatiecriteria:**

- [ ] Ongeldige en niet-ondersteunde invoer krijgen verschillende uitkomsten; v1-keuzes leveren exact vier regelsignaturen en twee strategiesignaturen.
- [ ] IDs, namen, taal en niet-betekenisvolle volgorde veranderen de signatuur niet; betekenisvolle velden wel.

**Afhankelijkheden:** [T02](#t02)

**Testaanpak:** Unit-/propertytests op grenzen, onbekende velden en canonieke fixture-uitvoer volgens 02; een onbekende positieve schemaVersion met toekomstige velden geeft unsupported vóór de v1-veldcontrole. Bijdrage aan AT-02-01, AT-02-02, AT-02-03, AT-28-01.

**Reviewfocus:** Welke velden spelbetekenis hebben en welke uitsluitend presentatie zijn.

**GitHub-issue:** [#5](https://github.com/Cas0570/sinktheship/issues/5)

## T06

**Titel:** Geometrie en plaatsbaarheidsbewijs

**Mijlpaal:** M1 · **Type:** feature · **Grootte:** M

**Doel:** Plaatsingen zonder onbewezen aannames toelaten.

**Docs:** [02](02-game-rules.md), [05](05-game-engine.md). **User stories:** [US-02](03-user-stories.md#us-02), [US-04](03-user-stories.md#us-04).

**Scope in:** Coördinaten, rotatie, overlap/contactregels, vlootvalidatie en witness/inconclusive-resultaat.

**Scope uit:** UI-dragging en uniforme willekeurige vlootgeneratie.

**Acceptatiecriteria:**

- [ ] Rand-, overlap-, allow/no-orthogonal/no-touch-gevallen volgen de referentiegevallen; een mislukte wijziging verandert de oude plaatsing niet.
- [ ] Valid vereist een controleerbare volledige witness; een afgebroken zoekactie is inconclusive en kan geen spelstart autoriseren.

**Afhankelijkheden:** [T05](#t05)

**Testaanpak:** RULE-fixtures en geometrische properties, inclusief 2×2/26×26-grenzen en onmogelijk/inconclusive. Bijdrage aan AT-02-02, AT-04-02.

**Reviewfocus:** Geen verwarring tussen een snelle heuristiek en bewijs van plaatsbaarheid.

**GitHub-issue:** [#6](https://github.com/Cas0570/sinktheship/issues/6)

## T07

**Titel:** Deterministische RNG en gescheiden stromen

**Mijlpaal:** M1 · **Type:** feature · **Grootte:** S

**Doel:** Randomness reproduceerbaar en inspecteerbaar injecteren.

**Docs:** [05](05-game-engine.md), [06](06-opponents.md). **User stories:** [US-28](03-user-stories.md#us-28).

**Scope in:** PCG32, state-import/export, seedafleiding en afgescheiden plaatsings-/strategie-/starterstromen.

**Scope uit:** Cryptografische accountidentiteit en UI-timers.

**Acceptatiecriteria:**

- [ ] De vastgelegde vectoren leveren exact dezelfde waarden en restore vervolgt dezelfde reeks.
- [ ] Afgewezen opdrachten en uitgestelde planning verbruiken geen algoritmische RNG; core gebruikt geen ambient randombron.

**Afhankelijkheden:** [T02](#t02)

**Testaanpak:** Golden vectors, serialisatierondgang en tests die extra clock-/cancelcalls tussen RNG-aanroepen invoegen. Bijdrage aan AT-28-01, AT-28-02, AT-28-03.

**Reviewfocus:** Integersemantiek en nul onbedoelde koppelingen tussen de stromen.

**GitHub-issue:** [#7](https://github.com/Cas0570/sinktheship/issues/7)

## T08

**Titel:** Commands en beurtverloop van de engine

**Mijlpaal:** M1 · **Type:** feature · **Grootte:** M

**Doel:** Een volledige wedstrijd volgens de regels laten verlopen.

**Docs:** [02](02-game-rules.md), [05](05-game-engine.md). **User stories:** [US-01](03-user-stories.md#us-01), [US-06](03-user-stories.md#us-06), [US-09](03-user-stories.md#us-09).

**Scope in:** Plaatsing bevestigen, starter loten, schoten, quota, uitkomsten, einde en events.

**Scope uit:** Sessiepersistentie, AI en schermen.

**Acceptatiecriteria:**

- [ ] Dubbele/ongeldige/niet-actieve schoten veranderen state, events en RNG niet; geldige schoten volgen alle beurtvarianten.
- [ ] Het laatste scheepsvak beëindigt direct; een nieuwe wedstrijd begint met een nieuwe ID/randomness en lege conceptplaatsing.

**Afhankelijkheden:** [T05](#t05), [T06](#t06), [T07](#t07)

**Testaanpak:** Alle relevante RULE-gevallen plus invariant-properties op willekeurige geldige commandreeksen. Bijdrage aan AT-01-02, AT-01-03, AT-06-01, AT-06-02, AT-06-03, AT-09-01.

**Reviewfocus:** Einde midden in een beurt en atomiciteit van afwijzingen.

**GitHub-issue:** [#8](https://github.com/Cas0570/sinktheship/issues/8)

## T09

**Titel:** Publieke views en informatievrijgave

**Mijlpaal:** M1 · **Type:** feature · **Grootte:** M

**Doel:** Dezelfde zichtbare kennis aan speler en bot geven.

**Docs:** [02](02-game-rules.md), [04](04-architecture.md), [05](05-game-engine.md). **User stories:** [US-07](03-user-stories.md#us-07).

**Scope in:** PlayerView, publieke events en expliciete eindview.

**Scope uit:** UI-store, inzichtvisualisatie en het bewaren van checkpoints.

**Acceptatiecriteria:**

- [ ] Interne states met dezelfde publieke observaties leveren identieke views/events zonder plaatsingsseeds of onbekende schepen.
- [ ] Een ambigu cluster wordt bij zinken niet volledig aan een schip gekoppeld; beide vloten verschijnen pas in de eindview.

**Afhankelijkheden:** [T08](#t08)

**Testaanpak:** Paarsgewijze projectieproperties, rakende-schepenfixtures en inspectie van alle eventpayloads. Bijdrage aan AT-07-01, AT-07-02, AT-07-03.

**Reviewfocus:** Afwezigheid van private koppelingen, ook via metadata of objectreferenties.

**GitHub-issue:** [#9](https://github.com/Cas0570/sinktheship/issues/9)

## T10

**Titel:** Core-serialisatie, replay en gedeelde fixtures

**Mijlpaal:** M1 · **Type:** feature · **Grootte:** M

**Doel:** De engine overdraagbaar en reproduceerbaar afronden.

**Docs:** [05](05-game-engine.md), [07](07-neural-network.md), [12](12-quality-testing.md). **User stories:** [US-08](03-user-stories.md#us-08), [US-28](03-user-stories.md#us-28), [US-29](03-user-stories.md#us-29).

**Scope in:** Geversioneerde coredata, importvalidatie, replay en TS-uitvoer van gedeelde regelfixtures.

**Scope uit:** Browseropslag en de Python-simulator.

**Acceptatiecriteria:**

- [ ] Dezelfde versies, beginsituatie en commands leveren byte-equivalente canonieke state/events; corrupte en te nieuwe invoer wordt geweigerd.
- [ ] Het fixturebestand dekt regels, zinken, contact, quota en signaturen; game-core README beschrijft actuele exports en replayvoorbeeld.

**Afhankelijkheden:** [T08](#t08), [T09](#t09)

**Testaanpak:** Fixture-goldens, roundtrip/mutatiefuzzing en de corecoverage-/invariantpoorten uit 12. Bijdrage aan AT-08-02, AT-28-01, AT-28-02, AT-29-01.

**Reviewfocus:** Migratiegrens en onafhankelijkheid van browser- of tegenstanderimplementaties.

**GitHub-issue:** [#10](https://github.com/Cas0570/sinktheship/issues/10)

## T11

**Titel:** Uniforme vlootplaatsing

**Mijlpaal:** M2 · **Type:** feature · **Grootte:** M

**Doel:** Mens en bot uit dezelfde uniforme plaatsingsverdeling laten putten.

**Docs:** [06](06-opponents.md), [12](12-quality-testing.md). **User stories:** [US-04](03-user-stories.md#us-04), [US-19](03-user-stories.md#us-19), [US-28](03-user-stories.md#us-28).

**Scope in:** Complete-fleet rejection, exacte enumeratie/reservoirfallback, cancellation en scheduler.

**Scope uit:** Vooringenomen greedy plaatsing of extra RNG bij een timeout.

**Acceptatiecriteria:**

- [ ] Na de vaste rejectiongrens volgt de voorgeschreven exacte fallback; kleine borden tonen de juiste volledige verdeling.
- [ ] Randomize vervangt door een complete geldige vloot; pauzeren/hervatten van berekening verandert de seeduitkomst niet.

**Afhankelijkheden:** [T06](#t06), [T07](#t07)

**Testaanpak:** Exacte tellingen op kleine borden, vaste seeds en cancellation-/resumeproeven. Bijdrage aan AT-04-03, AT-19-01, AT-28-03.

**Reviewfocus:** Uniformiteit over complete gelabelde vloten, niet alleen uniforme keuzes per schip.

**GitHub-issue:** [#11](https://github.com/Cas0570/sinktheship/issues/11)

## T12

**Titel:** Tegenstandercontract, registry en Easy

**Mijlpaal:** M2 · **Type:** feature · **Grootte:** M

**Doel:** Een eerlijke uitbreidbare basis voor strategieën leveren.

**Docs:** [04](04-architecture.md), [06](06-opponents.md), [15](15-extension-guides.md). **User stories:** [US-03](03-user-stories.md#us-03), [US-07](03-user-stories.md#us-07), [US-20](03-user-stories.md#us-20), [US-28](03-user-stories.md#us-28).

**Scope in:** Opponent-ports, gedeelde contractsuite, descriptorcatalogus, Easy en denkpauzedecorator.

**Scope uit:** Normal, Hard en neural runtime.

**Acceptatiecriteria:**

- [ ] Easy kiest uitsluitend legale onbeschoten cellen en ondersteunt het volledige geldige enginecontract.
- [ ] Registry en contract-testsuite gebruiken alleen publieke views; denkpauze/cancellation verandert de onderliggende keuze niet.

**Afhankelijkheden:** [T09](#t09), [T11](#t11)

**Testaanpak:** Gedeelde contracttests met seeds, stale/cancelgevallen en niet-v1-regelsets. Bijdrage aan AT-03-01, AT-07-03, AT-20-03, AT-28-03.

**Reviewfocus:** Dezelfde catalogus voor web en benchmark en geen private state in descriptorhooks.

**GitHub-issue:** [#12](https://github.com/Cas0570/sinktheship/issues/12)

## T13

**Titel:** Normal met hunt en target

**Mijlpaal:** M2 · **Type:** feature · **Grootte:** M

**Doel:** Een begrijpelijke hunt/target-strategie toevoegen.

**Docs:** [06](06-opponents.md). **User stories:** [US-03](03-user-stories.md#us-03), [US-07](03-user-stories.md#us-07), [US-19](03-user-stories.md#us-19).

**Scope in:** Eén module, catalogusregistratie, doelprioriteiten en veilige afhandeling van ambigu zinken.

**Scope uit:** Hard-density en nieuwe kernports.

**Acceptatiecriteria:**

- [ ] Normal slaagt voor de gedeelde contractsuite op alle ondersteunde regelvarianten.
- [ ] Hunt/target-keuzen volgen de beschrijving ook bij rakende schepen, meerdere clusters en randposities; geen verzonnen sunk-membership.

**Afhankelijkheden:** [T12](#t12)

**Testaanpak:** Gerichte keuze-fixtures plus de algemene contracttests; prestatiebewijs volgt in T16. Bijdrage aan AT-03-01, AT-07-02, AT-19-01.

**Reviewfocus:** Of de strategie uitsluitend informatie uit de observatie gebruikt.

**GitHub-issue:** [#13](https://github.com/Cas0570/sinktheship/issues/13)

## T14

**Titel:** Hard met probability density

**Mijlpaal:** M2 · **Type:** feature · **Grootte:** M

**Doel:** Een controleerbare density-strategie en inzichtdata leveren.

**Docs:** [06](06-opponents.md). **User stories:** [US-03](03-user-stories.md#us-03), [US-07](03-user-stories.md#us-07), [US-17](03-user-stories.md#us-17), [US-19](03-user-stories.md#us-19).

**Scope in:** Legale hypothesen, scoreaggregatie, tie-breaking, descriptor en DecisionInsight.

**Scope uit:** Modelinferentie en de heatmap-UI.

**Acceptatiecriteria:**

- [ ] Scoreberekening volgt de hypothesen-/clusterregels; onmogelijke of al beschoten cellen kunnen niet worden gekozen.
- [ ] Inzicht beschrijft de observatie vóór het schot en labelt density niet als gekalibreerde procentkans; resultaat is deterministisch.

**Afhankelijkheden:** [T12](#t12)

**Testaanpak:** Kleine exact narekenbare densityfixtures, ambigu-zinkenfixtures en gedeelde contractsuite. Bijdrage aan AT-03-01, AT-07-02, AT-17-01, AT-17-02, AT-19-01.

**Reviewfocus:** Dubbeltellingen, gelijke scheepslengten en betekenis van de inzichtwaarden.

**GitHub-issue:** [#14](https://github.com/Cas0570/sinktheship/issues/14)

## T15

**Titel:** Benchmarkharness en ruwe meetdata

**Mijlpaal:** M2 · **Type:** infra · **Grootte:** M

**Doel:** Strategieën op dezelfde opstellingen kunnen vergelijken.

**Docs:** [06](06-opponents.md), [12](12-quality-testing.md). **User stories:** [US-19](03-user-stories.md#us-19), [US-28](03-user-stories.md#us-28).

**Scope in:** Solo-evaluatie, head-to-head-arena, gepaarde seeds, starterswisseling en ruwe rapportrecords.

**Scope uit:** Modelpromotie en statistische conclusies zonder voldoende wedstrijden.

**Acceptatiecriteria:**

- [ ] Elke vergelijking bewaart config/versies/seeds, fouten en beide startervarianten volgens het vaste protocol.
- [ ] Denkpauzes tellen niet als beslisrekentijd; dezelfde seedplanning geeft dezelfde speluitkomsten; benchmark:smoke draait de ontwikkelset.

**Afhankelijkheden:** [T10](#t10), [T12](#t12), [T13](#t13), [T14](#t14), [T23](#t23)

**Testaanpak:** Handberekende mini-arena, identieke spelers, starterwissel en herhaalde deterministische smoke. Bijdrage aan AT-19-01, AT-28-01, AT-28-03.

**Reviewfocus:** Onafhankelijke eenheden voor latere intervallen en scheiding ontwikkel-/kwalificatieseeds.

**GitHub-issue:** [#15](https://github.com/Cas0570/sinktheship/issues/15)

## T16

**Titel:** Statistische rapporten en Easy–Hard-kwalificatie

**Mijlpaal:** M2 · **Type:** feature · **Grootte:** M

**Doel:** De beloofde volgorde van de drie heuristieken met bewijs beoordelen.

**Docs:** [06](06-opponents.md), [12](12-quality-testing.md). **User stories:** [US-19](03-user-stories.md#us-19).

**Scope in:** Gemiddelde/mediaan/p90, winrate, gepaarde 95%-intervallen en kwalificatie van alle vier v1-configuraties.

**Scope uit:** Achteraf aangepaste criteria of een ML-resultaat.

**Acceptatiecriteria:**

- [ ] Rapporten bevatten aantallen, fouten, verdelingen en intervallen volgens 06; het vereiste aantal wedstrijden geldt per vergelijking/configuratie.
- [ ] Easy < Normal < Hard wordt met de vaste criteria aangetoond; bij mislukking wordt de gate niet groen en volgt expliciet herstelwerk.

**Afhankelijkheden:** [T15](#t15)

**Testaanpak:** Statistiek op synthetische bekende data en de volledige kwalificatieruns; bewaar ruwe artefacten. Bijdrage aan AT-19-01, AT-19-02.

**Reviewfocus:** Geen selectie van alleen gunstige seeds, presets of metrieken.

**GitHub-issue:** [#16](https://github.com/Cas0570/sinktheship/issues/16)

## T17

**Titel:** Stijlkeuze en Figma-tokens vastleggen

**Mijlpaal:** M3 · **Type:** design · **Grootte:** S

**Doel:** Eén expliciet gekozen visuele richting als basis vastleggen.

**Docs:** [09](09-design-brief.md), [10](10-figma-mcp-playbook.md). **User stories:** [US-21](03-user-stories.md#us-21), [US-24](03-user-stories.md#us-24).

**Scope in:** Harbor/Radar/Paper Fleet-keuze, ADR 0018 bijwerken, Figma-bestemming, tokens en naamgeving.

**Scope uit:** Een stilzwijgende stijlkeuze of genereren vóór voldoende rechten.

**Acceptatiecriteria:**

- [ ] De ontwikkelaar heeft de stijl expliciet genoemd; de gekozen Figma-locatie is bewerkbaar.
- [ ] Kleur-, typografie-, spacing- en motiontokens voldoen aan 09; contrastberekeningen en bron/node-ID's zijn vastgelegd.

**Afhankelijkheden:** Geen eerdere bouwtaak; de algemene fase-4-voorwaarde en eventuele externe voorwaarden gelden wel.

**Testaanpak:** Contrastparen narekenen en token-/naamgevingsreview volgens het Figma-playbook. Bijdrage aan AT-21-03, AT-24-01.

**Reviewfocus:** Onderscheid tussen toestemming voor documentatie en de daadwerkelijke stijlkeuze.

**GitHub-issue:** [#17](https://github.com/Cas0570/sinktheship/issues/17)

## T18

**Titel:** Basiscomponenten in Figma

**Mijlpaal:** M3 · **Type:** design · **Grootte:** M

**Doel:** Herbruikbare bediening en feedback ontwerpen.

**Docs:** [09](09-design-brief.md), [10](10-figma-mcp-playbook.md). **User stories:** [US-05](03-user-stories.md#us-05), [US-12](03-user-stories.md#us-12), [US-21](03-user-stories.md#us-21).

**Scope in:** Button, IconButton, Toggle, SegmentedControl, Card, Badge, Dialog, Toast en Tooltip: varianten, focus, disabled/loading/error en reduced-motionannotaties.

**Scope uit:** Spelborden en volledige schermcomposities.

**Acceptatiecriteria:**

- [ ] Alle aan deze groep toegewezen componenten hebben de namen, props/varianten en states uit 09.
- [ ] Targets, focus en betekenis werken zonder alleen kleur; assets en component-node-ID's staan in de mapping.

**Afhankelijkheden:** [T17](#t17)

**Testaanpak:** Visuele state-review, contrast/targetcontrole en vergelijking met de volledige componentinventaris. Bijdrage aan AT-05-03, AT-12-02, AT-21-03.

**Reviewfocus:** Ontbrekende fout- of toetsenbordstates; geen willekeurige extra componentnamen.

**GitHub-issue:** [#18](https://github.com/Cas0570/sinktheship/issues/18)

## T19

**Titel:** Spelcomponenten in Figma

**Mijlpaal:** M3 · **Type:** design · **Grootte:** M

**Doel:** Plaatsing en spelinformatie ook op smalle schermen begrijpelijk maken.

**Docs:** [09](09-design-brief.md), [10](10-figma-mcp-playbook.md). **User stories:** [US-04](03-user-stories.md#us-04), [US-05](03-user-stories.md#us-05), [US-17](03-user-stories.md#us-17), [US-21](03-user-stories.md#us-21).

**Scope in:** Board, Cell, Ship, FleetStatus, TurnIndicator, ShotLog, StatTile, HeatmapOverlay, RuleSetPicker en DifficultyPicker met alle beschreven states.

**Scope uit:** Implementatiecode en navigatieprototypes.

**Acceptatiecriteria:**

- [ ] Samen met T18 is ieder van de 19 componenten exact eenmaal ontworpen en gemapt, inclusief alle beschreven celstates.
- [ ] Plaatsing/rotatie, bordwissel, heatmaplegenda en niet-kleurgebonden feedback zijn op 320/390 px uitvoerbaar binnen de targetnorm.

**Afhankelijkheden:** [T17](#t17)

**Testaanpak:** Geometrie narekenen en pointer-/keyboardfocusstates met de brief vergelijken. Bijdrage aan AT-04-01, AT-04-02, AT-05-02, AT-17-02, AT-21-01.

**Reviewfocus:** Touchtargets en het onderscheid tussen raak, zeker gezonken en ambigue clustercellen.

**GitHub-issue:** [#19](https://github.com/Cas0570/sinktheship/issues/19)

## T20

**Titel:** Schermen, prototypeflows en designmapping

**Mijlpaal:** M3 · **Type:** design · **Grootte:** M

**Doel:** Een complete, reviewbare schermflow opleveren.

**Docs:** [08](08-frontend.md), [09](09-design-brief.md), [10](10-figma-mcp-playbook.md). **User stories:** [US-01](03-user-stories.md#us-01), [US-08](03-user-stories.md#us-08), [US-09](03-user-stories.md#us-09), [US-10](03-user-stories.md#us-10), [US-13](03-user-stories.md#us-13), [US-14](03-user-stories.md#us-14), [US-21](03-user-stories.md#us-21).

**Scope in:** Alle routes/states op 390/768/1440 px, hervatten/fouten en prototypeverbindingen; Code Connect of gedocumenteerde mappingfallback.

**Scope uit:** React-code en werkende online rooms.

**Acceptatiecriteria:**

- [ ] Kernflow, herstel, rematch en neural laad-/foutstates zijn navigeerbaar; multiplayer is duidelijk toekomstig.
- [ ] Mapping bevat alle 19 componenten, assets, node-ID's en gekozen publicatie/fallback; designreview is vastgelegd.

**Afhankelijkheden:** [T18](#t18), [T19](#t19)

**Testaanpak:** Loop de prototypeflows volgens 10 door en controleer iedere route/state tegen 08/09. Bijdrage aan AT-01-01, AT-08-03, AT-09-02, AT-10-01, AT-13-02, AT-14-02, AT-21-01.

**Reviewfocus:** Geen ontbrekende empty/error/loading-state of te vroege onthulling van vijandelijke schepen.

**GitHub-issue:** [#20](https://github.com/Cas0570/sinktheship/issues/20)

## T21

**Titel:** React-basiselementen en tokens

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Figma-basiscomponenten als toegankelijke publieke UI bouwen.

**Docs:** [08](08-frontend.md), [09](09-design-brief.md), [10](10-figma-mcp-playbook.md), [12](12-quality-testing.md). **User stories:** [US-05](03-user-stories.md#us-05), [US-12](03-user-stories.md#us-12), [US-21](03-user-stories.md#us-21).

**Scope in:** Tokens, typography en de basiscomponentgroep van T18 in packages/ui.

**Scope uit:** Speldomeinimports, routes en bordlogica.

**Acceptatiecriteria:**

- [ ] Props/varianten en mapping sluiten aan op Figma; ui importeert geen andere productpackages.
- [ ] Keyboardfocus, dialogfocus, disabled/loading en reduced-motionstates doorstaan componentchecks en visuele vergelijking.

**Afhankelijkheden:** [T03](#t03), [T18](#t18)

**Testaanpak:** Componenttests, Playwright-flow en Figma-screenshotvergelijking op relevante breakpoints. Bijdrage aan AT-05-03, AT-12-02, AT-21-03.

**Reviewfocus:** Semantiek en controlled props; containers houden domeinbeslissingen buiten ui.

**GitHub-issue:** [#21](https://github.com/Cas0570/sinktheship/issues/21)

## T22

**Titel:** Bord- en plaatsingscomponenten in React

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Alle bedieningsvormen voor borden beschikbaar maken.

**Docs:** [08](08-frontend.md), [09](09-design-brief.md), [10](10-figma-mcp-playbook.md), [12](12-quality-testing.md). **User stories:** [US-04](03-user-stories.md#us-04), [US-05](03-user-stories.md#us-05), [US-21](03-user-stories.md#us-21).

**Scope in:** Board, Cell, Ship en FleetStatus, pointerdrag, selecteer/tik, roving focus en bordwissel. Overige spelcomponenten worden bij hun gebruik in T28/T30/T44/T47 gebouwd.

**Scope uit:** Zelf regels uitvoeren, Worker aanmaken of privéstate bewaren.

**Acceptatiecriteria:**

- [ ] Slepen, selecteren/tikken en keyboard sturen equivalente callbacks; dragcancel herstelt de vorige weergave.
- [ ] Celgrootten en bordwissel werken vanaf 320 px; tekst/iconen en focus maken alle celstates herkenbaar.

**Afhankelijkheden:** [T21](#t21), [T19](#t19)

**Testaanpak:** Pointer-/keyboardcomponenttests, touch-emulatie en screenshots tegen T19. Bijdrage aan AT-04-01, AT-04-02, AT-05-01, AT-05-02, AT-21-01.

**Reviewfocus:** Geen vereiste draghandeling en geen dubbele activatie bij touch/keyboard.

**GitHub-issue:** [#22](https://github.com/Cas0570/sinktheship/issues/22)

## T23

**Titel:** Lokale sessiecoördinator

**Mijlpaal:** M2 · **Type:** feature · **Grootte:** M

**Doel:** Engine, bot en intenties via één publieke sessiegrens laten samenwerken.

**Docs:** [04](04-architecture.md), [05](05-game-engine.md), [06](06-opponents.md). **User stories:** [US-01](03-user-stories.md#us-01), [US-06](03-user-stories.md#us-06), [US-07](03-user-stories.md#us-07), [US-28](03-user-stories.md#us-28).

**Scope in:** SessionPort, immutable snapshots, intentdispatch, request-ID's, generations en cancellation.

**Scope uit:** Browserworker, localStorage en ONNX-adapter.

**Acceptatiecriteria:**

- [ ] Alleen publieke snapshots/events verlaten de sessie; herhaald request-ID voert een actie hoogstens eenmaal uit; clientbinding/ordinal weigert heruitvoering ook na de receiptsgrens.
- [ ] Na dispose, reset of vervanging wordt een oude botrespons geweigerd; pending/retrystatus volgt het contract.

**Afhankelijkheden:** [T10](#t10), [T12](#t12)

**Testaanpak:** Fake clock/scheduler/opponent; races rond dubbel dispatch, late respons en cancellation, plus SES-09/10 voor eviction, changed payload, ordinal en nieuwe clientbinding. Bijdrage aan AT-01-03, AT-06-02, AT-07-03, AT-28-03.

**Reviewfocus:** Eigenaarschap van state en monotone revisies zonder afhankelijkheid van React.

**GitHub-issue:** [#23](https://github.com/Cas0570/sinktheship/issues/23)

## T24

**Titel:** Sessies bewaren en veilig herstellen

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** De laatst succesvol bewaarde sessie betrouwbaar hervatten.

**Docs:** [04](04-architecture.md), [05](05-game-engine.md), [08](08-frontend.md). **User stories:** [US-08](03-user-stories.md#us-08), [US-09](03-user-stories.md#us-09), [US-28](03-user-stories.md#us-28).

**Scope in:** Private checkpoint, receipts/RNG, opslagvolgorde, migratie, retry en rematchvoorbereiding met geïnjecteerde ports.

**Scope uit:** Concrete browseropslag en het neural runtimebestand.

**Acceptatiecriteria:**

- [ ] Na iedere bevestigde mutatie wordt een write geprobeerd vóór de volgende; writefailure rolt geen geaccepteerde actie terug.
- [ ] Restore behoudt regels, starter, niveau, quota en RNG; beschadigde/nieuwe data vraagt herstelkeuze en een denkpauze veroorzaakt geen extra schot.

**Afhankelijkheden:** [T23](#t23)

**Testaanpak:** Foutinjectie per opslagstap, crash tussen checkpoint/pointer, retry-idempotentie en deterministische hervatting; een nieuwe proxy na restore weigert requests met de oude clientprefix. Bijdrage aan AT-08-01, AT-08-02, AT-08-03, AT-09-01, AT-28-02.

**Reviewfocus:** Welke toestand is geaccepteerd versus duurzaam opgeslagen; geen private checkpoint in getSnapshot.

**GitHub-issue:** [#24](https://github.com/Cas0570/sinktheship/issues/24)

## T25

**Titel:** Browseropslag, gastidentiteit en tabcoördinatie

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Lokale sessies en voorkeuren zonder dataraces bewaren.

**Docs:** [04](04-architecture.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-08](03-user-stories.md#us-08), [US-11](03-user-stories.md#us-11), [US-15](03-user-stories.md#us-15), [US-23](03-user-stories.md#us-23).

**Scope in:** StorageAdapter, IdentityProvider, Web Locks, actieve pointer en grenzen voor settings/setup/checkpoints.

**Scope uit:** Netwerkidentiteit, accounts en spelgeschiedenis.

**Acceptatiecriteria:**

- [ ] Eén tab bezit de schrijf-/AI-sessie; een tweede tab krijgt de beschreven uitleg. Zonder lockmogelijkheid kan alleen expliciet tijdelijk worden gespeeld.
- [ ] Quota/blocked storage/migratiefouten blijven herstelbaar; gast-ID en voorkeuren blijven lokaal, settingspatches zijn afzonderlijk geserialiseerd.

**Afhankelijkheden:** [T24](#t24)

**Testaanpak:** Adaptertests en tweepagina-e2e met lockverlies, opslagblokkade en grootteoverschrijding. Bijdrage aan AT-08-01, AT-08-02, AT-08-03, AT-11-01, AT-15-01, AT-15-02, AT-23-02.

**Reviewfocus:** Locklevensduur, first-write-pointervolgorde en geen verlies door concurrerende settingsupdates.

**GitHub-issue:** [#25](https://github.com/Cas0570/sinktheship/issues/25)

## T26

**Titel:** Game Worker en browsercompositie

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Alle spel-/botberekening buiten de main thread uitvoeren.

**Docs:** [04](04-architecture.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-07](03-user-stories.md#us-07), [US-08](03-user-stories.md#us-08), [US-22](03-user-stories.md#us-22).

**Scope in:** Worker-entry, publieke transportberichten, privileged opslagbridge en composition-root lifecycle.

**Scope uit:** Neural runtime downloaden en UI-routes.

**Acceptatiecriteria:**

- [ ] Eén Worker bezit core/sessie/bots; main publiceert alleen gevalideerde publieke snapshots en bedient de afgeschermde opslagbridge.
- [ ] Stale generation/revision en dubbele responses worden geweigerd; remount/StrictMode maakt geen tweede actieve spelinstantie.

**Afhankelijkheden:** [T23](#t23), [T25](#t25), [T13](#t13), [T14](#t14)

**Testaanpak:** Transportcontracttests, Workercrash/herstartproef en browsertrace met Hard-rekenwerk. Bijdrage aan AT-07-03, AT-08-01, AT-22-02.

**Reviewfocus:** Geen privédata via store/subscription, en ondubbelzinnig ownership van dispose/retry.

**GitHub-issue:** [#26](https://github.com/Cas0570/sinktheship/issues/26)

## T27

**Titel:** Routes, externe store en vertalingen

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Schermen op een stabiele publieke sessieview laten aansluiten.

**Docs:** [04](04-architecture.md), [08](08-frontend.md), [15](15-extension-guides.md). **User stories:** [US-01](03-user-stories.md#us-01), [US-11](03-user-stories.md#us-11), [US-14](03-user-stories.md#us-14), [US-20](03-user-stories.md#us-20).

**Scope in:** Declaratieve router, useSyncExternalStore-brug, EN/NL-discovery, key/placeholderchecks en routecatalogus.

**Scope uit:** Schermspecifieke plaatsings-/schietlogica en online transport.

**Acceptatiecriteria:**

- [ ] Snapshots blijven referentieel stabiel tot wijziging; navigatie/hermount reset geen lopende sessie.
- [ ] Engels is standaard; een opgeslagen taalkeuze gaat voor en live wisselen verandert geen RNG/state/signatuur; ontbrekende logische basiskeys of vereiste locale-pluralvormen breken de build; geldige taalspecifieke categorieën zijn toegestaan.

**Afhankelijkheden:** [T26](#t26), [T21](#t21), [T20](#t20)

**Testaanpak:** Store-/routercontracttests, incomplete locale-fixture, een fixturetaal met andere pluralcategorieën en navigatie-e2e in beide producttalen. Bijdrage aan AT-01-01, AT-11-01, AT-11-02, AT-11-03, AT-14-03, AT-20-02.

**Reviewfocus:** Geen tweede spelstate in React en toevoeging van één locale zonder extra registratiecode.

**GitHub-issue:** [#27](https://github.com/Cas0570/sinktheship/issues/27)

## T28

**Titel:** Regel- en niveaukeuze aansluiten

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Een geldige lokale wedstrijd kunnen voorbereiden.

**Docs:** [02](02-game-rules.md), [06](06-opponents.md), [08](08-frontend.md), [09](09-design-brief.md). **User stories:** [US-01](03-user-stories.md#us-01), [US-02](03-user-stories.md#us-02), [US-03](03-user-stories.md#us-03).

**Scope in:** Home, presets/custom, niveaupicker, capability-uitleg en setupdata.

**Scope uit:** Neural initialisatie en regels tijdens een lopend spel aanpassen.

**Acceptatiecriteria:**

- [ ] De flow biedt exact de afgesproken vier configuraties en herkenbare niveaus; invalid/unsupported/inconclusive blokkeert starten.
- [ ] Easy–Hard zijn bruikbaar; Impossible is zonder gevalideerd gepromoveerd manifest zichtbaar uitgeschakeld met EN/NL-uitleg.

**Afhankelijkheden:** [T27](#t27), [T12](#t12), [T13](#t13), [T14](#t14)

**Testaanpak:** Registry-/UI-tests en Playwright op vier regelcombinaties plus bestaande actieve sessie. Bijdrage aan AT-01-01, AT-02-01, AT-02-02, AT-02-03, AT-03-01, AT-03-02.

**Reviewfocus:** Setupdata versus onveranderlijke actieve regels en geen misleidende MVP-modelbeschikbaarheid.

**GitHub-issue:** [#28](https://github.com/Cas0570/sinktheship/issues/28)

## T29

**Titel:** Volledige plaatsingsflow aansluiten

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Muis-, touch- en keyboardspelers hun vloot laten bevestigen.

**Docs:** [02](02-game-rules.md), [08](08-frontend.md), [09](09-design-brief.md), [12](12-quality-testing.md). **User stories:** [US-01](03-user-stories.md#us-01), [US-04](03-user-stories.md#us-04), [US-05](03-user-stories.md#us-05).

**Scope in:** Plaatsingscontainers, rotatie/reset/randomize, feedback en sessie-intenties.

**Scope uit:** Nieuwe plaatsingsregels of verborgen UI-state als waarheid.

**Acceptatiecriteria:**

- [ ] Alle drie bedieningsvormen bereiken dezelfde geaccepteerde plaatsing; invalid/cancel behoudt de vorige toestand.
- [ ] Onvolledige vloot blokkeert start; randomize vervangt de hele vloot en reset maakt de draft leeg zonder regels/niveau te veranderen.

**Afhankelijkheden:** [T28](#t28), [T22](#t22), [T11](#t11)

**Testaanpak:** De complete plaatsingsflow met keyboard, pointer en fysieke touch; refresh tijdens draft. Bijdrage aan AT-01-02, AT-04-01, AT-04-02, AT-04-03, AT-05-01.

**Reviewfocus:** Focusherstel, dubbele events en leesbare reden bij afwijzing.

**GitHub-issue:** [#29](https://github.com/Cas0570/sinktheship/issues/29)

## T30

**Titel:** Spelen, resultaat en rematch

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** De Easy–Hard-kernflow tot een volgend potje afronden.

**Docs:** [05](05-game-engine.md), [08](08-frontend.md), [09](09-design-brief.md), [12](12-quality-testing.md). **User stories:** [US-01](03-user-stories.md#us-01), [US-05](03-user-stories.md#us-05), [US-06](03-user-stories.md#us-06), [US-07](03-user-stories.md#us-07), [US-08](03-user-stories.md#us-08), [US-09](03-user-stories.md#us-09).

**Scope in:** Spelcontainer, beurt-/denkstatus, live-region, eindview, hervatten en rematch.

**Scope uit:** Uitgebreide statistieken, effecten en AI-heatmap.

**Acceptatiecriteria:**

- [ ] Alleen de actieve speler kan geldig schieten; keyboardactivatie is eenmaal en resultaat/coördinaat worden aangekondigd.
- [ ] Eindscherm onthult beide vloten; rematch heeft nieuwe ID/randomness/lege draft en gewijzigde instellingen nemen oude schoten niet mee.

**Afhankelijkheden:** [T29](#t29)

**Testaanpak:** Win/verlies, botstart, extra-hitbeurt, refresh tijdens denken en keyboardrematch in beide talen. Bijdrage aan AT-01-03, AT-05-02, AT-05-03, AT-06-03, AT-07-03, AT-08-01, AT-09-01, AT-09-02.

**Reviewfocus:** De juiste eindview, focus en het onderscheid tussen denkpauze en daadwerkelijk rekenwerk.

**GitHub-issue:** [#30](https://github.com/Cas0570/sinktheship/issues/30)

## T31

**Titel:** Instellingen, uitleg en toekomstpagina's

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** Alle ondersteunende Must-pagina's bruikbaar maken.

**Docs:** [06](06-opponents.md), [08](08-frontend.md), [09](09-design-brief.md), [11](11-multiplayer-future.md). **User stories:** [US-10](03-user-stories.md#us-10), [US-11](03-user-stories.md#us-11), [US-12](03-user-stories.md#us-12), [US-14](03-user-stories.md#us-14), [US-15](03-user-stories.md#us-15).

**Scope in:** Taal-/geluid-/animatievoorkeuren, regels/AI-uitleg, multiplayer/room-coming-soon en app-404.

**Scope uit:** Werkende Should-effecten, accounts en roomtransport.

**Acceptatiecriteria:**

- [ ] Taalwissel werkt zonder spelreset; nog niet gebouwde effecten zijn zichtbaar disabled met uitleg; reduced motion heeft voorrang.
- [ ] Regel-/AI-uitleg is actueel en zonder onbewezen claims; directe roomroutes/ongeldige URL-invoer zijn veilig en starten geen netwerkspel.

**Afhankelijkheden:** [T27](#t27), [T28](#t28)

**Testaanpak:** Contentreview en Playwright op alle routes in EN/NL; netwerk-/consolecontrole. Bijdrage aan AT-10-01, AT-10-02, AT-10-03, AT-11-02, AT-12-02, AT-12-03, AT-14-01, AT-14-02, AT-14-03, AT-15-03.

**Reviewfocus:** Uitleg over Impossible en duidelijk onderscheid tussen geplande en beschikbare functies.

**GitHub-issue:** [#31](https://github.com/Cas0570/sinktheship/issues/31)

## T32

**Titel:** Statische build, headers en routefallback

**Mijlpaal:** M4 · **Type:** infra · **Grootte:** M

**Doel:** Een controleerbaar deploymentartefact voor de MVP leveren.

**Docs:** [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-14](03-user-stories.md#us-14), [US-15](03-user-stories.md#us-15), [US-23](03-user-stories.md#us-23).

**Scope in:** Cloudflare Pages-build-/header-/fallbackconfig, eigen-originassets en previewverificatie.

**Scope uit:** Backend, analytics, PWA en zonder afgesproken bestemming publiceren.

**Acceptatiecriteria:**

- [ ] Directe approutes werken na refresh; ontbrekende model-/scriptassets worden niet als HTML met status 200 geleverd.
- [ ] Productie heeft de voorgeschreven CSP/HTTPS/headers, geen secrets/debugbediening/tracking en geen runtime third-party assetcalls.

**Afhankelijkheden:** [T30](#t30), [T31](#t31)

**Testaanpak:** Build-/headerchecks, negatieve assetrequests en browsernetwerkinspectie op de afgesproken previewbestemming. Bijdrage aan AT-14-01, AT-15-03, AT-23-01, AT-23-02, AT-23-03.

**Reviewfocus:** CSP versus Worker/WASM en de grens tussen SPA-routes en echte bestandspaden.

**GitHub-issue:** [#32](https://github.com/Cas0570/sinktheship/issues/32)

## T33

**Titel:** MVP-browser-, toegankelijkheids- en budgetkwalificatie

**Mijlpaal:** M4 · **Type:** feature · **Grootte:** M

**Doel:** De eerste speelbare release aan haar Must-poorten toetsen.

**Docs:** [12](12-quality-testing.md), [13](13-roadmap.md). **User stories:** [US-05](03-user-stories.md#us-05), [US-08](03-user-stories.md#us-08), [US-11](03-user-stories.md#us-11), [US-19](03-user-stories.md#us-19), [US-21](03-user-stories.md#us-21), [US-22](03-user-stories.md#us-22), [US-24](03-user-stories.md#us-24), [US-20](03-user-stories.md#us-20).

**Scope in:** Easy–Hard-kernflow, browsermatrix, EN/NL, fysieke touch/screenreaders, JS/Lighthouse en releasebewijs.

**Scope uit:** Werkende Impossible of het uitstellen van Must-toegankelijkheid tot M6.

**Acceptatiecriteria:**

- [ ] De volledige kernflow slaagt op de browser-/viewportmatrix en handmatige toetsenbord-/AA-controle; herstel en taalwissel zijn meegenomen.
- [ ] Home én eerste gewone spelstart voldoen aan het cumulatieve JS-budget; meetrapporten, heuristiekbewijs en MVP-release notes zijn gelinkt.
- [ ] De ontwikkelaar voert de dan beschikbare bot-/preset-/taal-/schermproeven uit zonder AI; model- en volledige v1-proeven volgen in M6.

**Afhankelijkheden:** [T04](#t04), [T16](#t16), [T20](#t20), [T32](#t32)

**Testaanpak:** Voer de MVP-selectie van 12 uit met exacte build-/browserversies, ruwe resultaten en handmatige bevindingen. Bijdrage aan AT-05-01, AT-05-02, AT-05-03, AT-08-01, AT-11-02, AT-19-01, AT-21-01, AT-21-02, AT-21-03, AT-22-01, AT-24-02, AT-20-01, AT-20-02, AT-20-03.

**Reviewfocus:** Geen WebKit-emulatie als bewijs voor echte iOS-Safari en geen groen rapport bij ontbrekend toestelbewijs.

**GitHub-issue:** [#33](https://github.com/Cas0570/sinktheship/issues/33)

## T34

**Titel:** Python-simulator en regelpariteit

**Mijlpaal:** M5 · **Type:** ML · **Grootte:** M

**Doel:** Het ML-spoor direct na M1 op dezelfde spelbetekenis laten starten.

**Docs:** [05](05-game-engine.md), [07](07-neural-network.md), [12](12-quality-testing.md). **User stories:** [US-18](03-user-stories.md#us-18), [US-29](03-user-stories.md#us-29).

**Scope in:** Gepinde Python/uv-omgeving, simulator, gedeelde regelfixtures en quality-python/parity-CI.

**Scope uit:** Training, datasetlabels en een tweede normatieve regelbeschrijving.

**Acceptatiecriteria:**

- [ ] TS en Python stemmen overeen op iedere gedeelde regel-/plaatsings-/beurt-/signatuurfixture.
- [ ] De CPU-omgeving is reproduceerbaar uit lockfile; README beschrijft simulator en fixture-uitvoering; afwijkingen blokkeren verdere ML-data.

**Afhankelijkheden:** [T10](#t10)

**Testaanpak:** Gedeelde fixture-run, grensgevallen en negatieve mutatie die de parityjob aantoonbaar laat falen. Bijdrage aan AT-18-01, AT-29-01.

**Reviewfocus:** Implementatieverschillen die ondanks oppervlakkig gelijke einduitslag de observaties veranderen.

**GitHub-issue:** [#34](https://github.com/Cas0570/sinktheship/issues/34)

## T35

**Titel:** Encoding in TypeScript en Python

**Mijlpaal:** M5 · **Type:** ML · **Grootte:** M

**Doel:** Het model exact dezelfde openbare observatie geven.

**Docs:** [06](06-opponents.md), [07](07-neural-network.md), [12](12-quality-testing.md). **User stories:** [US-07](03-user-stories.md#us-07), [US-29](03-user-stories.md#us-29).

**Scope in:** Encoders, masks, kanaal-/asvolgorde, dtype en encodingfixtures.

**Scope uit:** Modelarchitectuur, datasetgeneratie en browserruntime.

**Acceptatiecriteria:**

- [ ] Beide encoders leveren dezelfde vorm en waarden volgens het vastgelegde contract.
- [ ] Onbekende schepen en ambigue sunk-clusters lekken niet via channels of masks; legal-shotmask volgt de historische PlayerView.

**Afhankelijkheden:** [T34](#t34)

**Testaanpak:** Golden tensors en kanaalgewijze vergelijking voor randen, quota en ambigu zinken. Bijdrage aan AT-07-01, AT-07-02, AT-29-02.

**Reviewfocus:** Geen impliciete transpose, normalisatie of labelinformatie in de input.

**GitHub-issue:** [#35](https://github.com/Cas0570/sinktheship/issues/35)

## T36

**Titel:** Datasetgeneratie en gescheiden seeds

**Mijlpaal:** M5 · **Type:** ML · **Grootte:** M

**Doel:** Reproduceerbare trainingsdata zonder evaluatielekkage maken.

**Docs:** [06](06-opponents.md), [07](07-neural-network.md). **User stories:** [US-18](03-user-stories.md#us-18), [US-19](03-user-stories.md#us-19), [US-29](03-user-stories.md#us-29).

**Scope in:** TS-rollouts met Easy/Normal/Hard als gedragsmix, aparte echte bezettingslabels, datasetmanifest, splits op de afgesproken eenheid en CPU-smokeset.

**Scope uit:** Training en het gebruiken van kwalificatieseeds voor selectie.

**Acceptatiecriteria:**

- [ ] Iedere rij verwijst naar regels, encoding, gedrags-/samplerversie en seedplanning; dezelfde config reproduceert de datasetdigest. Het leerdoel is echte bezetting voorspellen, geen imitatie van een teacher-score.
- [ ] Train/validation/selectie/kwalificatie blijven gescheiden volgens 07; de datasetcheck weigert overlap en private velden in de modelinput. De geprivilegieerde vloot en bezettingslabels blijven afzonderlijk beschikbaar voor generator/loss.

**Afhankelijkheden:** [T35](#t35), [T13](#t13), [T14](#t14), [T15](#t15)

**Testaanpak:** Kleine deterministische dataset, overlap-negatieven en handmatige reconstructie van enkele observatie/labelparen. Bijdrage aan AT-18-01, AT-19-02, AT-29-02.

**Reviewfocus:** Lekkage tussen sterk gerelateerde states uit dezelfde wedstrijd of opstelling.

**GitHub-issue:** [#36](https://github.com/Cas0570/sinktheship/issues/36)

## T37

**Titel:** CPU-baseline trainen en experimenten loggen

**Mijlpaal:** M5 · **Type:** ML · **Grootte:** M

**Doel:** Een begrijpelijk eerste netwerk trainbaar maken.

**Docs:** [07](07-neural-network.md), [12](12-quality-testing.md). **User stories:** [US-18](03-user-stories.md#us-18), [US-24](03-user-stories.md#us-24).

**Scope in:** Supervised PyTorch-baseline, vaste config/seeds, checkpointing, W&B SDK online/offline en Notion-runverslag.

**Scope uit:** RL, GPU-verplichting en promotieclaims.

**Acceptatiecriteria:**

- [ ] De beschreven baseline traint op CPU; loss, validatiemetrieken, versies/config/seeds en artefacten zijn herleidbaar.
- [ ] Een offline run rondt af met lokale logs; sync is afzonderlijk, en het verslag vermeldt vraag/aanpak/resultaat/runreferentie.

**Afhankelijkheden:** [T36](#t36)

**Testaanpak:** Korte CPU-smokerun, checkpointresume en offline run zonder netwerk; inspecteer gelogde config/artefacten. Bijdrage aan AT-18-01, AT-18-02, AT-24-02, AT-24-03.

**Reviewfocus:** Of de ontwikkelaar input, labels, loss en veranderbare parameters kan uitleggen.

**GitHub-issue:** [#37](https://github.com/Cas0570/sinktheship/issues/37)

## T38

**Titel:** Evaluatie, ONNX-export en runtimepariteit

**Mijlpaal:** M5 · **Type:** ML · **Grootte:** M

**Doel:** Een geëxporteerd netwerk op dezelfde criteria kunnen beoordelen.

**Docs:** [07](07-neural-network.md), [12](12-quality-testing.md). **User stories:** [US-18](03-user-stories.md#us-18), [US-19](03-user-stories.md#us-19), [US-29](03-user-stories.md#us-29).

**Scope in:** Afzonderlijke evaluate/export-stappen, pure neural Opponent met ModelRunner-port, ONNX Node-runner, vaste tensors en PyTorch/ONNX Python/TS-pariteit.

**Scope uit:** Modelpublicatie of verborgen numerieke tolerantiewijzigingen.

**Acceptatiecriteria:**

- [ ] Export voldoet aan input/outputcontract en alle vooraf vastgelegde toleranties in drie runtimes.
- [ ] De TS-harness kan de kandidaat evalueren; rapporten noemen modeldigest/runtimeversies en bewaren mislukte export-/pariteitsgevallen.

**Afhankelijkheden:** [T37](#t37), [T15](#t15)

**Testaanpak:** Golden-tensorvergelijking, ongeldig output-/shapemodel en kleine arena-smoke. Bijdrage aan AT-18-01, AT-19-03, AT-29-03.

**Reviewfocus:** Argmax/tie-breaking/masking en of het beoordeelde bestand exact het geëxporteerde bestand is.

**GitHub-issue:** [#38](https://github.com/Cas0570/sinktheship/issues/38)

## T39

**Titel:** Modelmanifest, discovery en compatibiliteit

**Mijlpaal:** M5 · **Type:** ML · **Grootte:** M

**Doel:** Modellen zonder applicatiecodewijziging kunnen toevoegen.

**Docs:** [04](04-architecture.md), [07](07-neural-network.md), [15](15-extension-guides.md). **User stories:** [US-03](03-user-stories.md#us-03), [US-13](03-user-stories.md#us-13), [US-20](03-user-stories.md#us-20), [US-23](03-user-stories.md#us-23).

**Scope in:** Manifestvalidatie, modelkaart, builddiscovery, signatures, versie/digest en selectie.

**Scope uit:** Browserdownloads en promotie zonder bewijs.

**Acceptatiecriteria:**

- [ ] Een geldige modelmap wordt ontdekt; incompatibele encoding/regels/runtimeprofielen of onvolledige metadata worden met een reden geweigerd.
- [ ] Modelselectie is deterministisch en koppelt het exacte bestand aan manifest/versie; onbetrouwbare paden/velden voeren geen code uit.

**Afhankelijkheden:** [T38](#t38)

**Testaanpak:** Compatibiliteitsmatrix, corrupte manifests, dubbele IDs/versies en een tweede modelmap zonder code-edit; errors=0 is geldig, negatieve errors ongeldig, en een candidate met nog ontbrekend Web-/performancebewijs blijft buiten productie. Bijdrage aan AT-03-02, AT-03-03, AT-13-03, AT-20-02, AT-23-02.

**Reviewfocus:** Het onderscheid tussen syntactisch geldig, compatibel en voor release gekwalificeerd.

**GitHub-issue:** [#39](https://github.com/Cas0570/sinktheship/issues/39)

## T40

**Titel:** Lazy ONNX-runtime in de Game Worker

**Mijlpaal:** M5 · **Type:** feature · **Grootte:** M

**Doel:** Een model pas na de keuze voor Impossible laden.

**Docs:** [07](07-neural-network.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-13](03-user-stories.md#us-13), [US-22](03-user-stories.md#us-22), [US-23](03-user-stories.md#us-23), [US-29](03-user-stories.md#us-29).

**Scope in:** Worker-only ORT Web-adapter, eigen-origin WASM/model, integriteit, cache en load-/inferentiefouten.

**Scope uit:** UI-downgradebeleid en wijziging van modelcontracten.

**Acceptatiecriteria:**

- [ ] Home en Easy–Hard laden geen neural runtime/model; selectie verifieert manifest/digest vóór gebruik.
- [ ] Runtime/model falen afgebakend en annulering/stale load wordt genegeerd; inferentie blijft in de Worker en cached bytes worden opnieuw gevalideerd.

**Afhankelijkheden:** [T39](#t39), [T26](#t26)

**Testaanpak:** Browser-/Workercontracttests, gecorrumpeerde cache, fetchfailure en web-runtimepariteit op vaste tensors; de testcompositie injecteert de exacte candidate zonder deze voortijdig te promoveren. Bijdrage aan AT-13-01, AT-13-02, AT-13-03, AT-22-02, AT-23-01, AT-29-03.

**Reviewfocus:** CSP/WASM-paden, geheugeneigenaarschap en geen main-thread-inferentiefallback.

**GitHub-issue:** [#40](https://github.com/Cas0570/sinktheship/issues/40)

## T41

**Titel:** Impossible, expliciet herstel en hervatten

**Mijlpaal:** M5 · **Type:** feature · **Grootte:** M

**Doel:** De gekwalificeerde modelroute in dezelfde spelflow inpassen.

**Docs:** [04](04-architecture.md), [07](07-neural-network.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-03](03-user-stories.md#us-03), [US-08](03-user-stories.md#us-08), [US-09](03-user-stories.md#us-09), [US-13](03-user-stories.md#us-13).

**Scope in:** De neural Opponent uit T38 aansluiten op keuze/loading/error, retry, expliciet Hard kiezen, checkpointprofiel en gemengd-niveaulabel.

**Scope uit:** Stille fallback of een andere bot presenteren als hetzelfde model.

**Acceptatiecriteria:**

- [ ] Een match start pas na succesvolle modelinitialisatie; fouten bieden gerichte retry of expliciet Hard en houden de sessie consistent.
- [ ] Restore/rematch bewaakt exact model/runtimeprofiel; ontbrekend model vraagt een keuze en controllervervanging blijft zichtbaar als gemengd niveau.

**Afhankelijkheden:** [T40](#t40), [T30](#t30), [T31](#t31)

**Testaanpak:** E2e in de aparte kwalificatiebuild van load/inferencefailure, offline cache, refresh tijdens denken, retry en rematch met verdwenen model. De productiebuild biedt een candidate nog niet aan. Bijdrage aan AT-03-03, AT-08-01, AT-09-03, AT-13-01, AT-13-02.

**Reviewfocus:** Geen dubbel schot, verloren RNG of verborgen niveauwisseling tijdens herstel.

**GitHub-issue:** [#41](https://github.com/Cas0570/sinktheship/issues/41)

## T42

**Titel:** Neural kwalificeren en modelpromotie

**Mijlpaal:** M5 · **Type:** ML · **Grootte:** M

**Doel:** Een model alleen met volledig bewijs als Impossible publiceren.

**Docs:** [06](06-opponents.md), [07](07-neural-network.md), [12](12-quality-testing.md). **User stories:** [US-13](03-user-stories.md#us-13), [US-19](03-user-stories.md#us-19), [US-29](03-user-stories.md#us-29).

**Scope in:** Volledige finale benchmark, pariteit, middenklasse-inferentie/bytes, modelkaart en promotie-/rollbackmanifest.

**Scope uit:** Budgetten verlagen, evaluatieseeds hergebruiken voor tuning of ongekwalificeerd promoten.

**Acceptatiecriteria:**

- [ ] Elke compatibele configuratie voldoet aan 06/07 inclusief minstens 10.000 head-to-head-wedstrijden per vergelijking en de vastgelegde intervallen.
- [ ] Hetzelfde ONNX-bestand voldoet aan grootte/inferentie op MID-ANDROID-v1 en exportpariteit; bij falen blijft het bestaande standaardmodel ongewijzigd.

**Afhankelijkheden:** [T16](#t16), [T38](#t38), [T41](#t41)

**Testaanpak:** De volledige kwalificatiesuite, 20 warm-ups/1.000 inferenties per meetrun volgens 12 en negatieve promotiecontrole; controleer na promotie ook de gewone productiecatalogus/-flow zonder candidate-selectie-ingang. Bijdrage aan AT-13-03, AT-19-01, AT-19-02, AT-19-03, AT-29-03.

**Reviewfocus:** Geen iPhone 16 Pro-meting als vervanging voor de afgesproken gemiddelde telefoon; alle bewijslinks horen bij dezelfde digest.

**GitHub-issue:** [#42](https://github.com/Cas0570/sinktheship/issues/42)

## T43

**Titel:** ML-README en menselijke leerproef

**Mijlpaal:** M5 · **Type:** docs · **Grootte:** M

**Doel:** De pipeline zelfstandig leerbaar en herhaalbaar maken.

**Docs:** [07](07-neural-network.md), [15](15-extension-guides.md). **User stories:** [US-18](03-user-stories.md#us-18), [US-20](03-user-stories.md#us-20), [US-24](03-user-stories.md#us-24).

**Scope in:** ml-README, model-/runner-README's, CPU-handleiding en door de ontwikkelaar uitgevoerde baselinewijziging.

**Scope uit:** De uitvoering door AI vervangen of een veranderd model automatisch promoveren.

**Acceptatiecriteria:**

- [ ] De ontwikkelaar doorloopt dataset/train/evaluate/export afzonderlijk en kan artefacten, splits en foutmeldingen terugvinden.
- [ ] Een laag of parameter wijzigen en opnieuw vergelijken lukt zonder applicatiecode-edit; offlinepad en W&B/Notion-verslag zijn controleerbaar.

**Afhankelijkheden:** [T38](#t38), [T39](#t39)

**Testaanpak:** Menselijke uitvoering in schone omgeving; leg handmatige stappen, problemen en opgeloste docfouten vast. Bijdrage aan AT-18-01, AT-18-02, AT-18-03, AT-20-03, AT-24-02.

**Reviewfocus:** Begrip van de modelkeuze en reproduceerbaarheid zonder impliciete kennis uit de chats.

**GitHub-issue:** [#43](https://github.com/Cas0570/sinktheship/issues/43)

## T44

**Titel:** Wedstrijdstatistieken op het eindscherm

**Mijlpaal:** M6 · **Type:** feature · **Grootte:** S

**Doel:** Een uitslag met controleerbare schietstatistieken tonen.

**Docs:** [05](05-game-engine.md), [08](08-frontend.md), [09](09-design-brief.md). **User stories:** [US-16](03-user-stories.md#us-16).

**Scope in:** Schoten, treffers, missers, gezonken schepen en trefpercentage per speler.

**Scope uit:** Resultaatgeschiedenis en extra analytics.

**Acceptatiecriteria:**

- [ ] Alleen geaccepteerde historie telt; een zinkend schot telt eenmaal als schot en treffer.
- [ ] Nul schoten geeft 0% zonder NaN/Infinity; beide talen en gemengd niveau worden correct weergegeven.

**Afhankelijkheden:** [T30](#t30)

**Testaanpak:** Handberekende histories inclusief afwijzingen, nuldelers en eindschermcomponenttest. Bijdrage aan AT-16-01, AT-16-02, AT-16-03.

**Reviewfocus:** Definities van schot/treffer/zinken en geen dubbele telling van events.

**GitHub-issue:** [#44](https://github.com/Cas0570/sinktheship/issues/44)

## T45

**Titel:** Geluid en animaties

**Mijlpaal:** M6 · **Type:** feature · **Grootte:** M

**Doel:** Speluitkomsten met optionele effecten ondersteunen.

**Docs:** [08](08-frontend.md), [09](09-design-brief.md), [12](12-quality-testing.md). **User stories:** [US-12](03-user-stories.md#us-12), [US-22](03-user-stories.md#us-22).

**Scope in:** Eigen-origingeluid, eventgebonden animaties, voorkeuren en reduced motion.

**Scope uit:** Nieuwe essentiële informatie die alleen via geluid/beweging beschikbaar is.

**Acceptatiecriteria:**

- [ ] Beschikbare effecten volgen voorkeuren direct en na reload; reduced motion onderdrukt niet-essentiële beweging.
- [ ] Herhaalde snapshots/replay laten een effect niet dubbel afgaan; zichtbare tekst/iconen blijven alle uitkomsten verklaren.

**Afhankelijkheden:** [T30](#t30), [T31](#t31)

**Testaanpak:** Media-/voorkeurcomponenttests, browseraudio na gebruikersinteractie en eerste frametrace; definitieve budgetcontrole T54. Bijdrage aan AT-12-01, AT-12-02, AT-22-03.

**Reviewfocus:** Effecten veranderen geen engine-/RNG-toestand en lopen niet door na uitschakelen/dispose.

**GitHub-issue:** [#45](https://github.com/Cas0570/sinktheship/issues/45)

## T46

**Titel:** Historisch AI-inzicht bewaren

**Mijlpaal:** M6 · **Type:** feature · **Grootte:** M

**Doel:** Bewijs van een botbeslissing veilig voor de eindview bewaren.

**Docs:** [04](04-architecture.md), [06](06-opponents.md), [08](08-frontend.md). **User stories:** [US-07](03-user-stories.md#us-07), [US-08](03-user-stories.md#us-08), [US-17](03-user-stories.md#us-17).

**Scope in:** Pre-shotobservatie plus DecisionInsight, maximaal laatste twintig, omittedDecisionCount en checkpointvalidatie.

**Scope uit:** Heatmap tekenen of nieuwe inferentie na afloop.

**Acceptatiecriteria:**

- [ ] Tijdens placing/playing blijft postgame null; pas finished publiceert de sessie de bewaarde historische observatie.
- [ ] De afgesproken cap/bytesgrens en omitted-telling blijven geldig na hervatten; ontbrekend inzicht wordt niet verzonnen.

**Afhankelijkheden:** [T24](#t24), [T14](#t14)

**Testaanpak:** Fixture met meer dan twintig beslissingen, restore en vergelijking met de originele pre-shotview. Bijdrage aan AT-07-03, AT-08-01, AT-17-01, AT-17-03.

**Reviewfocus:** Historische legalShots versus onthulde eindvloot en geen RNG-verbruik bij inzage.

**GitHub-issue:** [#46](https://github.com/Cas0570/sinktheship/issues/46)

## T47

**Titel:** Heatmap en toegankelijke AI-uitleg

**Mijlpaal:** M6 · **Type:** feature · **Grootte:** M

**Doel:** De bewaarde strategie-uitkomst begrijpelijk kunnen bekijken.

**Docs:** [06](06-opponents.md), [08](08-frontend.md), [09](09-design-brief.md), [10](10-figma-mcp-playbook.md). **User stories:** [US-10](03-user-stories.md#us-10), [US-17](03-user-stories.md#us-17), [US-21](03-user-stories.md#us-21).

**Scope in:** Hard-density, Impossible-modeloutput, beslissingsselectie, legenda en unavailable-state.

**Scope uit:** Exacte kansclaim zonder kalibratie of private checkpointtoegang.

**Acceptatiecriteria:**

- [ ] Heatmap en labels gebruiken uitsluitend de historische observatie en het bijbehorende masker.
- [ ] Cellen zijn met keyboard leesbaar; density/modeloutput zijn onderscheiden en Easy/Normal/ontbrekende data tonen duidelijke uitleg.

**Afhankelijkheden:** [T46](#t46), [T41](#t41), [T22](#t22)

**Testaanpak:** Component-/projectionfixtures, screenreaderproef en Figma/Playwright-vergelijking in beide talen. Bijdrage aan AT-10-02, AT-17-01, AT-17-02, AT-17-03, AT-21-03.

**Reviewfocus:** De speler moet de betekenis kunnen uitleggen zonder de visualisatie als zekerheid te lezen.

**GitHub-issue:** [#47](https://github.com/Cas0570/sinktheship/issues/47)

## T48

**Titel:** Kleine tegenstandergenerator

**Mijlpaal:** M6 · **Type:** infra · **Grootte:** S

**Doel:** Herhaalbare boilerplate zonder nieuw framework aanbieden.

**Docs:** [15](15-extension-guides.md), [12](12-quality-testing.md). **User stories:** [US-20](03-user-stories.md#us-20).

**Scope in:** pnpm new:opponent, dry-run, één module/descriptor, één registratie en teststartpunt.

**Scope uit:** Werkende strategie verzinnen of generators voor alle extensietypen.

**Acceptatiecriteria:**

- [ ] Dry-run toont exact de beoogde diff; onbekende/ongeldige ID, pathtraversal of bestaand doel veroorzaakt geen gedeeltelijke writes.
- [ ] De uitgevoerde wijziging blijft binnen de afgesproken impact en verwijst naar de gedeelde contractsuite; strategie blijft herkenbaar te implementeren.

**Afhankelijkheden:** [T12](#t12), [T04](#t04)

**Testaanpak:** Generatorproef in tijdelijke kopie met conflict/invalid-input en vergelijking dry-run versus write. Bijdrage aan AT-20-01, AT-20-03.

**Reviewfocus:** Eenvoudige onderhoudbare catalogusaanpassing en geen verborgen dependencies.

**GitHub-issue:** [#48](https://github.com/Cas0570/sinktheship/issues/48)

## T49

**Titel:** Alle module-README's tegen de code controleren

**Mijlpaal:** M6 · **Type:** docs · **Grootte:** M

**Doel:** De modulecatalogus als zelfstandig naslagwerk afronden.

**Docs:** [04](04-architecture.md), [12](12-quality-testing.md), [15](15-extension-guides.md). **User stories:** [US-20](03-user-stories.md#us-20), [US-24](03-user-stories.md#us-24).

**Scope in:** README-audit voor alle acht packages, apps/web, apps/server en ml; index.ts/API-/testlinks en Notion-uitbreidingsingang.

**Scope uit:** Publieke API-documentatie tot deze taak uitstellen: iedere eerdere codewijziging documenteert haar eigen API.

**Acceptatiecriteria:**

- [ ] Iedere bestaande module heeft doel, actuele API, uitvoerbaar voorbeeld, relevante tests en uitbreidingsroute; server-README blijft uitsluitend toekomstig.
- [ ] Voorbeelden en importgrenzen kloppen met exports; de technische waarheid staat in de repo en Notion linkt daarnaar.

**Afhankelijkheden:** [T16](#t16), [T41](#t41), [T43](#t43), [T44](#t44), [T45](#t45), [T47](#t47), [T48](#t48)

**Testaanpak:** Voer documentvoorbeelden uit en controleer modulecatalogus/README-/exportdekking. Bijdrage aan AT-20-03, AT-24-02.

**Reviewfocus:** Of een onbekende ontwikkelaar de juiste extensieplek kan vinden zonder chatgeschiedenis.

**GitHub-issue:** [#49](https://github.com/Cas0570/sinktheship/issues/49)

## T50

**Titel:** Uitbreidingsproeven voor bot en preset

**Mijlpaal:** M6 · **Type:** docs · **Grootte:** M

**Doel:** De minimale uitbreidingsimpact voor kernextensies menselijk bewijzen.

**Docs:** [15](15-extension-guides.md). **User stories:** [US-20](03-user-stories.md#us-20).

**Scope in:** EXT-01 en EXT-02 door de ontwikkelaar zonder AI, met diff en controle-uitvoer.

**Scope uit:** Proefextensies automatisch als productfeature releasen.

**Acceptatiecriteria:**

- [ ] Een nieuwe tegenstander vraagt maximaal één module plus één registratie en tests, zonder web-/benchmarkcomponentwijziging.
- [ ] Een preset vraagt één config-object plus vertalingen; fixtures en bestaande kernflows blijven werken; gidsfouten zijn hersteld.

**Afhankelijkheden:** [T49](#t49)

**Testaanpak:** Beide EXT-proeven in geïsoleerde kopie; bewaar bewijs van code-/test-/docdiff en menselijke uitvoering. Bijdrage aan AT-20-01, AT-20-03.

**Reviewfocus:** Geen extra registraties of verborgen adapterwijzigingen die de impactnorm omzeilen.

**GitHub-issue:** [#50](https://github.com/Cas0570/sinktheship/issues/50)

## T51

**Titel:** Uitbreidingsproeven voor taal, scherm en Figma-component

**Mijlpaal:** M6 · **Type:** docs · **Grootte:** M

**Doel:** De frontendgidsen zonder AI uitvoerbaar bewijzen.

**Docs:** [10](10-figma-mcp-playbook.md), [15](15-extension-guides.md). **User stories:** [US-20](03-user-stories.md#us-20), [US-21](03-user-stories.md#us-21).

**Scope in:** EXT-04, EXT-05 en EXT-06, locale-discovery, routeregistratie en componentmapping.

**Scope uit:** Nieuwe productflows opnemen zonder scopebesluit.

**Acceptatiecriteria:**

- [ ] Eén volledig vertaalbestand en één route-module plus registratie volstaan voor de betreffende uitbreidingen.
- [ ] Een Figma-component kan via de gids met juiste props/states/mapping worden toegevoegd; toetsenbord, contrast en beide talen zijn gecontroleerd.

**Afhankelijkheden:** [T49](#t49)

**Testaanpak:** Menselijke proeven met opgeslagen diff, key-/locale-pluralchecks, screenshotvergelijking en genoteerde verbeteringen. Bijdrage aan AT-20-01, AT-20-02, AT-20-03, AT-21-03.

**Reviewfocus:** De gids geeft werkende stappen, geen kennis die alleen de oorspronkelijke AI had.

**GitHub-issue:** [#51](https://github.com/Cas0570/sinktheship/issues/51)

## T52

**Titel:** Uitbreidingsproef voor een modelmap

**Mijlpaal:** M6 · **Type:** docs · **Grootte:** M

**Doel:** Een compatibel model zonder applicatiecodewijziging toevoegen.

**Docs:** [07](07-neural-network.md), [15](15-extension-guides.md). **User stories:** [US-18](03-user-stories.md#us-18), [US-19](03-user-stories.md#us-19), [US-20](03-user-stories.md#us-20).

**Scope in:** EXT-03 door de ontwikkelaar; manifest/modelkaart/ONNX-map, discovery, afwijzing en expliciete promotieprocedure.

**Scope uit:** Een nieuwe encoding/runtimepolicy als eenvoudige modelwissel behandelen.

**Acceptatiecriteria:**

- [ ] Alleen de nieuwe modelmap is nodig voor discovery; onvolledige/incompatibele varianten worden met een reden geweigerd.
- [ ] De proef onderscheidt toevoegen van standaardmodelpromotie; kwalificatie blijft verplicht en een slechtere kandidaat vervangt het standaardmodel niet.

**Afhankelijkheden:** [T49](#t49), [T42](#t42)

**Testaanpak:** Menselijke EXT-03, diffvergelijking en negatieve manifest-/promotiechecks. Bijdrage aan AT-18-03, AT-19-03, AT-20-02.

**Reviewfocus:** Geen handmatige centrale modelcatalogus of verborgen codewijziging per model.

**GitHub-issue:** [#52](https://github.com/Cas0570/sinktheship/issues/52)

## T53

**Titel:** Volledige v1-toegankelijkheid en taalreview

**Mijlpaal:** M6 · **Type:** feature · **Grootte:** M

**Doel:** Alle nieuwe v1-states aan dezelfde Must-kwaliteit als de MVP toetsen.

**Docs:** [08](08-frontend.md), [09](09-design-brief.md), [12](12-quality-testing.md). **User stories:** [US-05](03-user-stories.md#us-05), [US-11](03-user-stories.md#us-11), [US-12](03-user-stories.md#us-12), [US-21](03-user-stories.md#us-21).

**Scope in:** AA/keyboard/VoiceOver/NVDA, zoom, responsive browsermatrix en EN/NL-copy inclusief neural/Should-states.

**Scope uit:** Toegankelijkheid voor het eerst in M6 implementeren.

**Acceptatiecriteria:**

- [ ] Alle v1-flows en fout-/laadstates zijn bereikbaar op de afgesproken browsers/breedten; handmatig screenreaderbewijs is aanwezig.
- [ ] Geen ontbrekende keys/placeholders, focusverlies, uitsluitend kleurgebonden betekenis of beweging tegen reduced motion.

**Afhankelijkheden:** [T33](#t33), [T41](#t41), [T44](#t44), [T45](#t45), [T47](#t47)

**Testaanpak:** De volledige matrix uit 12, met echte iOS-Safari op de iPhone 16 Pro en de overige vereiste browsers/hulpmiddelen. Bijdrage aan AT-05-01, AT-05-02, AT-05-03, AT-11-01, AT-11-02, AT-11-03, AT-12-02, AT-21-01, AT-21-02, AT-21-03.

**Reviewfocus:** Automatische scores ondersteunen de handmatige controle; zij vervangen haar niet.

**GitHub-issue:** [#53](https://github.com/Cas0570/sinktheship/issues/53)

## T54

**Titel:** Volledige performancekwalificatie

**Mijlpaal:** M6 · **Type:** infra · **Grootte:** M

**Doel:** De uiteindelijke app aan vastgelegde budgetten toetsen.

**Docs:** [07](07-neural-network.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-13](03-user-stories.md#us-13), [US-22](03-user-stories.md#us-22).

**Scope in:** Cumulatief cold-JS, vijf Lighthouse-runs, drie frametraces en verwijzing naar model-inferentiebewijs.

**Scope uit:** Gemiddelden of toestelkeuzen veranderen om een overschrijding te verbergen.

**Acceptatiecriteria:**

- [ ] Home én eerste Easy-start blijven binnen 200 KiB gzip; Performance-mediaan ≥90 en elke Accessibility-run 100 op het vaste profiel.
- [ ] Framewerk p95 ≤16,7 ms en modelgrootte/inferentie voldoen aan 12; ruwe traces, versies, thermische omstandigheden en effectieve refreshrate zijn bewaard.

**Afhankelijkheden:** [T33](#t33), [T42](#t42), [T45](#t45), [T47](#t47)

**Testaanpak:** LH-mobile-v1, IOS-16PRO-v1 en MID-ANDROID-v1 volgens 12; kleine lokale fixes binnen scope opnieuw meten. Bijdrage aan AT-13-03, AT-22-01, AT-22-02, AT-22-03.

**Reviewfocus:** rAF-afstand is geen zelfstandig framewerkbewijs; ontbrekende tracevoorziening is geen geslaagde meting.

**GitHub-issue:** [#54](https://github.com/Cas0570/sinktheship/issues/54)

## T55

**Titel:** V1-privacy, invoer en releaseartefacten

**Mijlpaal:** M6 · **Type:** infra · **Grootte:** M

**Doel:** De volledige app inclusief model- en inzichtpaden controleren.

**Docs:** [04](04-architecture.md), [07](07-neural-network.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-07](03-user-stories.md#us-07), [US-08](03-user-stories.md#us-08), [US-15](03-user-stories.md#us-15), [US-23](03-user-stories.md#us-23).

**Scope in:** Productieheaders, bundle-/netwerkinspectie, malforme invoer, opslagfouten, tabraces en release-artifactbewaring.

**Scope uit:** Online anti-cheat, accounts of een serverpentest.

**Acceptatiecriteria:**

- [ ] Volledige kern-/neuralflows uploaden geen gast-ID/state/voorkeuren en laden assets van eigen origin; geen secrets/debugseedbediening in productie.
- [ ] Gemanipuleerde snapshots/manifests/URL's omzeilen validatie niet; ongeldige invoer lekt geen privédata of stil dataverlies.

**Afhankelijkheden:** [T32](#t32), [T41](#t41), [T44](#t44), [T45](#t45), [T47](#t47)

**Testaanpak:** Negatieve invoersuite, twee tabs, fetch-/quotafouten en inspectie van de exacte releasebuild. Bijdrage aan AT-07-01, AT-08-02, AT-08-03, AT-15-01, AT-15-02, AT-15-03, AT-23-01, AT-23-02, AT-23-03.

**Reviewfocus:** Dezelfde artefactdigest tussen de geteste build en de beoogde release.

**GitHub-issue:** [#55](https://github.com/Cas0570/sinktheship/issues/55)

## T56

**Titel:** V1.0-releasebewijs en overdracht

**Mijlpaal:** M6 · **Type:** docs · **Grootte:** M

**Doel:** Een aantoonbaar complete release met zelfstandig onderhoud overdragen.

**Docs:** [01](01-product-vision-scope.md), [12](12-quality-testing.md), [13](13-roadmap.md), [15](15-extension-guides.md). **User stories:** [US-19](03-user-stories.md#us-19), [US-20](03-user-stories.md#us-20), [US-24](03-user-stories.md#us-24).

**Scope in:** Must/NFR-matrix, Should-besluiten, releasecheck, roadmap, Notion-release notes en bordopschoning.

**Scope uit:** Could-features of multiplayer als verplichte v1-scope toevoegen.

**Acceptatiecriteria:**

- [ ] Iedere toepasselijke Must/NFR heeft geslaagd bewijs voor dezelfde releaseversie; onopgeloste fouten en ontbrekende modelkwalificatie blokkeren v1.0.
- [ ] Uitbreidingsproeven, modelkaart, open beperkingen en terugrolpad zijn vindbaar; PR/review/release- en projectlinks zijn teruggelezen.

**Afhankelijkheden:** [T42](#t42), [T43](#t43), [T50](#t50), [T51](#t51), [T52](#t52), [T53](#t53), [T54](#t54), [T55](#t55)

**Testaanpak:** pnpm check:release en menselijke review van traceerbaarheid, releaseartefacten en handleiding; geen fictieve groenverklaring. Bijdrage aan AT-19-02, AT-20-03, AT-24-01, AT-24-02, AT-24-03.

**Reviewfocus:** Compleet bewijs versus alleen taakafsluiting; eventuele scopewijziging vraagt expliciet documentbesluit.

**GitHub-issue:** [#56](https://github.com/Cas0570/sinktheship/issues/56)

## T57

**Titel:** Optioneel: lokale resultaatgeschiedenis

**Mijlpaal:** M6 · **Type:** feature · **Grootte:** M

**Doel:** Eerdere resultaten op hetzelfde apparaat terugzien.

**Docs:** [01](01-product-vision-scope.md), [03](03-user-stories.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-25](03-user-stories.md#us-25).

**Scope in:** Expliciet ingeplande Could-uitbreiding met eigen versie/retentiegrens, overzicht en wissen.

**Scope uit:** Cloudsync, accounts en onderdeel van de v1.0-gate.

**Acceptatiecriteria:**

- [ ] Ieder afgerond potje levert hoogstens één lokaal resultaat met regels/niveau/modelversie; retentie en migratie zijn vóór implementatie beschreven.
- [ ] Wissen verwijdert alleen geschiedenis na bevestiging; een lopende sessie blijft intact en geen resultaat gaat over het netwerk.

**Afhankelijkheden:** [T44](#t44), [T56](#t56)

**Testaanpak:** Idempotente opslag, retentie/migratie, wisflow en netwerkinspectie. Bijdrage aan AT-25-01, AT-25-02, AT-25-03.

**Reviewfocus:** Opslagcap en privacy zonder dubbel gebruik van de actieve checkpointkey.

**GitHub-issue:** [#57](https://github.com/Cas0570/sinktheship/issues/57)

## T58

**Titel:** Optioneel: offline app en cache-updates

**Mijlpaal:** M6 · **Type:** feature · **Grootte:** M

**Doel:** Een voorbereide lokale game zonder netwerk laten werken.

**Docs:** [01](01-product-vision-scope.md), [03](03-user-stories.md), [07](07-neural-network.md), [08](08-frontend.md), [12](12-quality-testing.md). **User stories:** [US-26](03-user-stories.md#us-26).

**Scope in:** Expliciet ingeplande Could-uitbreiding; asset-/cacheversies en serviceworkerbeleid via nieuwe ADR.

**Scope uit:** Pushmeldingen, accounts en verplicht onderdeel van v1.0.

**Acceptatiecriteria:**

- [ ] Na voorbereiden van assets werkt een volledig lokaal potje offline; een ontbrekend neural model krijgt uitleg en expliciete alternatiefkeuze.
- [ ] Een app-/cacheupdate combineert geen incompatibele assets en bewaart herstelbare checkpoints; het updatebeleid is gereviewd.

**Afhankelijkheden:** [T56](#t56)

**Testaanpak:** Offline-e2e, cold-cache/model-miss en update met lopende wedstrijd op de afgesproken browsermatrix. Bijdrage aan AT-26-01, AT-26-02, AT-26-03.

**Reviewfocus:** Activatiemoment en scheiding tussen shellcache, modelcache en spelopslag.

**GitHub-issue:** [#58](https://github.com/Cas0570/sinktheship/issues/58)

## T59

**Titel:** Optioneel: donker thema

**Mijlpaal:** M6 · **Type:** design · **Grootte:** M

**Doel:** Een volledig gethematiseerde donkere variant aanbieden.

**Docs:** [01](01-product-vision-scope.md), [03](03-user-stories.md), [08](08-frontend.md), [09](09-design-brief.md), [10](10-figma-mcp-playbook.md), [12](12-quality-testing.md). **User stories:** [US-27](03-user-stories.md#us-27).

**Scope in:** Expliciet ingeplande Could-uitbreiding van Figma-tokens, componenten en opgeslagen voorkeur.

**Scope uit:** Wijziging van spelregels of verplichte v1.0-scope.

**Acceptatiecriteria:**

- [ ] Alle cel-, error-, loading- en focusstates behouden betekenis en contrast in beide talen op 390/768/1440 px.
- [ ] Themavoorkeur wordt na reload hersteld zonder wedstrijdwijziging; visuele vergelijking en keyboardchecks slagen.

**Afhankelijkheden:** [T56](#t56)

**Testaanpak:** Contrastberekeningen, Figma-/browserscreenshots en voorkeur/restoretest. Bijdrage aan AT-27-01, AT-27-02, AT-27-03.

**Reviewfocus:** Geen losse hardcoded donkere kleuren die token- en componentdekking omzeilen.

**GitHub-issue:** [#59](https://github.com/Cas0570/sinktheship/issues/59)
