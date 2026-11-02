Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Masterprompt](docs/00-masterprompt.md), [hervatpunt](docs/README.md), [backlog](docs/14-backlog.md), [kwaliteit](docs/12-quality-testing.md), [tooling](docs/16-tooling-mcp.md)

# Werken aan SinkTheShip

## Eerst de fase bepalen

Lees bij iedere nieuwe sessie `docs/00-masterprompt.md` en `docs/README.md`. Tijdens de documentatieopdracht gelden de fase- en batchreviews uit de masterprompt: schrijf de geautoriseerde batch volledig, controleer haar, werk de leeswijzer bij en bied haar ter review aan. Commit na akkoord. Bouwtaken, boardupdates en applicatiechecks hieronder gelden pas na de volledig afgeronde fase 4; een nog niet bestaand bord blokkeert het schrijven van documenten niet.

Fase 4 begint met activatie en verificatie van alle zeven projectservers volgens `docs/16-tooling-mcp.md`. Als één daarvan niet slaagt, stop vóór externe inrichting en geef oorzaak, noodzakelijke gebruikersactie en hervatpunt. Pas na zeven geslaagde tests: repository/bord/handboek inrichten, links rapporteren, daarna bouwen. Respecteer de apart vereiste toestemming om een repository aan te maken. Een algemeen documentakkoord kiest geen Figma-stijl en verandert geen abonnement.

## Verplichte branch- en PR-grens

Commit of push nooit rechtstreeks naar `main`. Maak vóór wijzigingen een taakbranch; ook documentatie en configuratie gaan via een PR en worden pas na expliciete menselijke goedkeuring gemerged. Gebruik geen bypass, force-push of uitgeschakelde hooks om deze grens te omzeilen.

Controleer in iedere checkout vóór wijzigingen `git config --get core.hooksPath`; activeer zo nodig de meegeleverde hooks met `git config --local core.hooksPath .githooks`. Controleer vóór de bouw de serverbeveiliging volgens [tooling](docs/16-tooling-mcp.md#beveiliging-van-main). Lokale hooks vervangen de GitHub-regel niet. Bij ontbrekende serverbeveiliging: meld de concrete blokkade en start geen bouwtaak totdat die is opgelost of de ontwikkelaar expliciet een tijdelijke uitzondering heeft gekozen. Verander niet zelfstandig de zichtbaarheid of het abonnement.

## Eén bouwtaak per keer

1. Lees via GitHub MCP het bord, inclusief In progress, Review en Blocked. Rond bestaand In progress/Review-werk eerst af; verwerk feedback op dezelfde PR. Wacht op de menselijke review als die de volgende stap is. Start anders de bovenste Ready-taak waarvan alle afhankelijkheden Done zijn. Ready-volgorde is de prioriteit; een hoger taaknummer kan eerder nodig zijn.
2. Lees issue, taakdefinitie, gekoppelde docs/ADR's en bestaande code. Zet het issue In progress en maak een branch `tNN-short-description`. Controleer lokale wijzigingen vóór edits; overschrijf geen werk van de ontwikkelaar.
3. Voer alleen de taak uit. Gebruik de MCP-momenten hieronder. Bij een blokkade: issue Blocked met oorzaak, gevolg en gerichte vraag. Bij nieuw werk: voeg een taakdefinitie met een nieuw stabiel ID toe en maak een Backlog-issue met context; pak dit niet zelf op. Is het te groot voor één review, stel een zichtbare splitsing voor vóór uitbreiding van de scope.
4. Voer relevante checks uit volgens `docs/12-quality-testing.md`. Werk publieke API, module-README, specificaties en eventuele ADR in dezelfde wijziging bij. Nieuwe dependencies of afwijkende contracten vereisen een onderbouwde ADR. Maak geen tests zwakker om een wijziging groen te krijgen.
5. Open de PR naar de default branch met `Closes #<issue>`. Zet de reviewsamenvatting in de PR én als issuecomment: wat/waarom met doclink; uitgevoerde commando's en uitkomsten; handmatige teststappen; reviewfocus; bijgewerkte docs; concrete bord-/Notion-wijzigingen en eventueel gemiste updates. Zet het issue Review. Merge hoort na menselijke goedkeuring; claim de taak niet Done voordat de merge/issue-afsluiting en bordstatus zijn teruggelezen.
6. Na merge sluit het gekoppelde issue en zetten ingebouwde Projects-workflows het op Done. Controleer dat resultaat. Bij een sluiting zonder merge: geen implementatie als afgerond rapporteren; leg annulering/vervanging vast en corrigeer de bordstatus indien nodig.

Taakdefinities staan uitsluitend in `docs/14-backlog.md`; issues bevatten korte samenvatting, link, blockers en reviewgesprek. Status staat uitsluitend op het bord. Houd geen tweede statuslijst bij in Markdown of Notion. Het parallel mogelijke ML-spoor verandert de regel van één actieve taak niet.

## Technische grenzen

- Volg de contracteigenaren: regels `02`, architectuur/ports `04`, engine `05`, tegenstanders `06`, ML `07`, frontend `08`, kwaliteit `12`. Kopieer geen nieuwe versie van een bestaand contract naar een andere module.
- `game-core` blijft pure TypeScript zonder runtime-dependencies, DOM, timers, ambient state of `Math.random()`. Injecteer RNG en tijd via de afgesproken ports. UI en bots krijgen uitsluitend hun toegestane view; privésnapshots blijven buiten de UI-store.
- Gebruik alleen publieke package-exports. De composition root beheert Worker, adapters en registries. Iedere package heeft een README, `index.ts` en relevante tests. Lees de uitbreidingsgids in `docs/15-extension-guides.md` vóór een uitbreiding.
- Docs zijn Nederlands; code, identifiers, codecomments en commits Engels. Gebruik Conventional Commits. Alle productteksten, inclusief fouten en toegankelijkheidslabels, hebben EN/NL-keys; geen hardcoded gebruikerscopy.
- Voeg geen server, accounts, analytics, third-party assetcalls of stilzwijgende modeldowngrade toe. Multiplayer blijft toekomstontwerp. Bij tegenspraak tussen docs: benoem de precieze passages en stel een gerichte documentwijziging voor; wijzig geen requirement stilzwijgend.

## Verplichte MCP-momenten

| Server | Moment en bewijs |
|---|---|
| GitHub | Iedere bouwsessie: bord lezen; taakstart/-einde, blokkade, nieuw werk en PR/CI bijwerken en teruglezen |
| Notion | Als setup, werkwijze of uitbreidingsstappen veranderen: eerst pagina lezen, dan handboek bijwerken met repo-links |
| Figma | Designtraject en iedere UI-taak: context/tokens/componentmapping en visuele vergelijking volgens `docs/10-figma-mcp-playbook.md`; toepasselijke Figma-skills gebruiken |
| Context7 | Library-/platformafhankelijk werk en upgrades: de ongewijzigde gebruikersregel hieronder volgen |
| Playwright | Na iedere UI-taak: gewijzigde flow en relevante foutstates doorlopen, screenshot/snapshot vergelijken; e2e-problemen onderzoeken |
| Chrome DevTools | Runtime-/console-/netwerkdiagnose, performancewijzigingen en vóór releases; meetprofiel en ruwe trace vastleggen |
| W&B | Iedere ML-train-/evaluatieronde en modelpromotie: experimentlogging via SDK en runanalyse/vergelijking via MCP |

Gebruik uitsluitend de zeven projectservers; een extra server vraagt een ADR. Setup, auth, actuele testcalls en herstel staan in `docs/16-tooling-mcp.md`. Tokens, OAuth-cache, privébrowserprofielen en ongeredigeerde auth-output horen niet in Git of reviews.

Bij MCP-uitval tijdens een gewone bouwtaak mag onafhankelijk lokaal werk doorgaan. Noteer welke externe actie niet gelukt is, waar en waarom; verzin geen succes en voltooi later na opnieuw lezen. Tijdens fase 4 geldt de strengere stopregel hierboven. Offline ML-training is volgens `docs/07-neural-network.md` toegestaan: lokale runlog bewaren, synchronisatie afzonderlijk uitvoeren binnen de gegeven autorisatie en Notion/W&B-verwijzingen daarna aanvullen. Geen promotie zonder het vereiste bewijs.

## Experimenten en releases

Na ieder ML-experiment: run/config/seeds/artefacten herleidbaar vastleggen, W&B controleren en in de Notion-database ML-experimenten vraag, aanpak, resultaat en runlink bijwerken. Bij offline werk de lokale runreferentie en ontbrekende synchronisatie expliciet vermelden. Een promotie wijzigt manifest/modelkaart en vereist de onveranderde benchmark-, pariteits- en toestelcriteria.

Na een mijlpaal of release: release notes in Notion, gerealiseerde release en bewijslinks in `docs/13-roadmap.md`, bord opschonen. Houd open werk als issues; verklaar niet-uitgevoerde tests niet geslaagd. iPhone 16 Pro is het beschikbare fysieke iOS-referentietoestel; de afzonderlijke middenklassekwalificatie en Safari-tracevoorziening blijven aan de meetprofielen uit `docs/12-quality-testing.md` gebonden.

## Aangeleverde Context7-instructie

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, porting code between libraries, platforms, or SQL dialects, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, debugging, or reviewing code that does not depend on a library or platform API, or general programming concepts.

## Steps

1. Always start with `resolve-library-id` using the library name and what to look up in the library's documentation, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and what to look up in the library's documentation (not single words), scoped to a single concept. If the question spans multiple distinct concepts (e.g. routing and auth and caching), make a separate `query-docs` call per concept with the same library ID, unless the question is about how the concepts interact — combined queries dilute ranking and return shallow results for each topic
4. Answer using the fetched docs
<!-- context7 -->
