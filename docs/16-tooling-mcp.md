Status: Geaccepteerd

Versie: 1.6

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Intake en open punten](README.md#mcp-controle-bij-intake), [masterprompt](00-masterprompt.md), [Figma-playbook](10-figma-mcp-playbook.md), [kwaliteit](12-quality-testing.md), [uitbreiden](15-extension-guides.md), [ADR 0013](adr/0013-project-mcp-servers.md)

# Projecttooling en zeven MCP-servers

Dit document levert setup-, verificatie- en herstelstappen. Batch F leverde de reviewbare [.codex/config.toml](../.codex/config.toml). Op 2026-11-02 zijn de zeven entries voor fase 4 ingeschakeld; het [verificatieverslag](#verificatieverslag-2026-11-02) onderscheidt de geteste verbindingen en browserprocessen. Na zeven geslaagde tests zijn GitHub Projects en Notion ingericht; de [afgeronde workflowcontrole](#externe-inrichting-2026-11-02) staat hieronder.

## Scope en configuratiegrens

De toegestane projectservers zijn exact `github`, `notion`, `figma`, `context7`, `playwright`, `chrome-devtools` en `wandb`. Een nieuwe server vraagt een ADR. Configureer ze in de repository onder `.codex/config.toml`; CLI en IDE-extensie gebruiken dezelfde configuratielagen. De ontwikkelaar moet de projectmap vertrouwen voordat Codex de projectlaag activeert. User-/managed-/pluginconfig kan daarnaast tools aanbieden: een aanwezig toolicoon bewijst niet dat de projectconfig wordt gebruikt of dat een account voldoende rechten heeft.

Controleer bij activatie de effectieve serverlijst, origin van de instellingen en dubbelen uit persoonlijke configuratie/plugins. Gebruik voor dit project alleen de zeven bedoelde serververbindingen; schakel ongewenste extra verbindingen voor de projectsessie uit zonder andere projecten te beschadigen. Projectconfig overschrijft niet automatisch alle globale entries. Wanneer een host/plugin die scheiding niet aanbiedt, leg de beperking vast en los haar op in de gekozen clientomgeving vóór het fase-4-akkoord.

De lokaal aanwezige CLI is op 2026-11-01 `codex-cli 0.166.0`. `codex mcp --help` bevestigt list/get/add/remove/login/logout. `codex mcp add` biedt geen projectscopeflag en de eerder gecontroleerde broncode schrijft de globale configuratie. Daarom komt de projectsetup rechtstreeks in het repo-bestand; geen globale add-opdrachten als stil alternatief. Zie de [officiële configuratiegids](https://learn.chatgpt.com/docs/config-file/config-basic), [MCP-gids](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) en [referentie](https://learn.chatgpt.com/docs/config-file/config-reference), geraadpleegd op 2026-11-01.

### Voorbereid bestand uit batch F

Batch F bevatte exact zeven serverentries met `enabled = false` en de voorgestelde permissieregels als comments. Na goedkeuring van fase 3 zijn op 2026-11-02 alle entries op `true` gezet en de gereviewde projectdefaults geactiveerd. Het bestaande hostbeleid blijft leidend voor de lopende sessie. De geteste browser-MCP-packages zijn gepind op `@playwright/mcp@0.0.84` en `chrome-devtools-mcp@1.12.0`. Het bestand pinnt geen model of persoonlijke instelling en bevat geen secrets. Context7 heeft geen projectcredential; de effectieve configuratie erft momenteel authenticatie uit de persoonlijke config buiten Git. De optionele env-keyregel blijft een comment zolang die procesvariabele niet is ingesteld.

Fase 4 vereist na deze activatie een clientherstart en volledige herverificatie; bestaande trust/auth hoeft alleen te worden hersteld als die controle faalt. Controleer daarna ook geërfde entries en duplicaten: het bestand is geen bewijs dat de effectieve omgeving slechts zeven verbindingen heeft. `enabled = false` wordt ondersteund door de [Codex-configuratiereferentie](https://learn.chatgpt.com/docs/config-file/config-reference) en [configuratiebron](https://github.com/openai/codex/blob/main/codex-rs/config/src/mcp_types.rs), gecontroleerd met Context7 op 2026-11-01. Het parsen van TOML is alleen een documentcontrole, geen verbindingstest.

### Voorgesteld Codex-permissieprofiel

Voor normaal lokaal bouwen zijn `workspace-write`, `on-request` en expliciet netwerk aan als projectdefaults geactiveerd. Dit geeft ruimte voor projectedits, package-installatie en geautoriseerde git-/MCP-werkzaamheden, terwijl acties buiten de ingestelde grenzen nog door de client worden beoordeeld. Netwerk aan is geen impliciete toestemming om een repo te publiceren of berichten te versturen. De huidige documentsessie draait met een ander hostprofiel (`danger-full-access`, approvals `never`); dat is geen stil aangenomen toekomstige projectstandaard.

```toml
# Project defaults activated on 2026-11-02; host policy takes precedence.
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = true
```

De [officiële beveiligingsdocumentatie](https://learn.chatgpt.com/docs/agent-approvals-security) beschrijft dat workspace-write standaard geen shellnetwerk geeft. Managed/hostbeleid kan projectinstellingen beperken. Een geweigerde actie wordt niet omzeild door automatisch unrestricted toegang te activeren. Reeds geautoriseerde gewone repoacties vragen geen herhaald productakkoord; de runtime bepaalt eventuele technische approvalprompts. Pin geen model of persoonlijke account-/providerinstellingen in deze projectconfig.

### Authenticatie zonder secrets in Git

`bearer_token_env_var` bevat de **naam** van een variabele, nooit het token. `http_headers` is alleen voor niet-geheime waarden; als een server een specifiek auth-headerformaat vraagt, gebruik `env_http_headers` met een verwijzing naar een externe variabele. De huidige Context7-server ondersteunt bearer-auth, zodat dezelfde tokenreferentiestijl volstaat. Figma/Notion gebruiken OAuth in de client, buiten de repo.

Laat `GITHUB_PAT`, `WANDB_API_KEY` en eventueel `CONTEXT7_API_KEY` beschikbaar zijn voor het **Codex-proces**. Alleen in een geïntegreerde terminal exporteren na het starten van de IDE vernieuwt niet noodzakelijk de omgeving van de extensie. Start zo nodig de IDE/CLI vanuit de juiste beveiligde omgeving of herstart na secret-instelling. Print geen tokens, complete environment of ongeredigeerde headerconfig. Commit geen `.env`, OAuth-cache, browserprofiel of tool-output met credentials.

## Serveroverzicht en gebruiksmomenten

| Server | Setup / scope | Gebruik tijdens bouwen |
|---|---|---|
| GitHub | Remote HTTP; PAT; default + projects + actions | Bord lezen bij sessiestart; issue/PR/CI bij taakstart/einde, blokkade en nieuw werk |
| Notion | Remote HTTP; OAuth; gekozen parentpagina | Werkwijze/setup/uitbreiden bijwerken, experimentverslag, release notes |
| Figma | Remote HTTP; OAuth; juiste seat en edit access | Designtraject en elke UI-taak volgens 10 |
| Context7 | Remote HTTP; eventueel API-key | Library-/framework-/SDK-/API-/CLI-/platformafhankelijk werk en dependency-upgrades |
| Playwright | Lokale stdio-server via npx; geïsoleerde browser | UI-flow/screenshot na UI-taak, e2e-diagnose |
| Chrome DevTools | Lokale stdio-server via npx; headless in deze omgeving | Console/netwerk, performance en vóór release |
| W&B | Remote HTTP; API-key; gekozen entity/project | Runs vergelijken bij training/evaluatie/promotie; SDK doet experimentlogging |

De exacte taak-lifecycle staat in [AGENTS.md](../AGENTS.md). De aangeleverde Context7-regel blijft behouden: eerst resolve-library-id, daarna gerichte query-docs, ook als de API bekend lijkt. Geen Context7 voor louter businesslogica of algemene refactoring zonder platform-API. Deel geen private data/secrets in documentatiequeries.

## GitHub MCP

Remote endpoint `https://api.githubcopilot.com/mcp/`. Gebruik een PAT met toegang tot de gekozen repository en Projects-eigenaar. Benodigde capabilities: repos lezen en later geautoriseerd schrijven, issues/PR's, Projects lezen/schrijven en Actions lezen. Geef workflow-edit-/beheerrechten alleen als de betreffende setup-/CI-taak die vraagt. Organisatie-SSO/restricties kunnen afzonderlijk toestemming vereisen; toolaanwezigheid bewijst geen resourcebereik.

```toml
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "GITHUB_PAT"
http_headers = { "X-MCP-Toolsets" = "default,projects,actions" }
startup_timeout_sec = 30
tool_timeout_sec = 60
```

`projects` en `actions` worden expliciet bovenop default gevraagd. Onbekende toolsetnamen kunnen stil genegeerd worden; inspecteer na herstart de daadwerkelijke tools. De officiële [remote-serverdocumentatie](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md), via Context7 gecontroleerd, beschrijft header en auth.

Test: `get_me` met lege invoer, inspecteer `projects_list`/`projects_get`/`projects_write` en `actions_list`/`actions_get`. Lees een gekozen project/reporesource zodra de bestemming bekend is. Geslaagd voor de verplichte verbindingstest: juiste account en beide toolsets beschikbaar. Schrijfrechten worden vóór de concrete inrichting apart gecontroleerd; de test creëert geen issue om “te proberen”.

Herstel: 401 → procesvariabele/key controleren zonder afdrukken; 403 → repo-/Projects-/SSO-rechten; ontbrekende tools → header, host-toolfilter en herstart; ontbrekend project → owner en resourcekeuze. Gebruik `gh` alleen als MCP de benodigde concrete handeling niet kan, met dezelfde geautoriseerde scope. Een Projects-update wordt niet als geslaagd gemeld zonder teruglezen.

## Notion MCP

Remote endpoint `https://mcp.notion.com/mcp`; OAuth via de client. Zie [Notion MCP-setup](https://developers.notion.com/guides/mcp/get-started-with-mcp) en [transport/authvereisten](https://developers.notion.com/guides/mcp/build-mcp-client), via Context7 gecontroleerd. Een losse Notion API-token is niet automatisch de juiste auth voor deze hosted MCP.

```toml
[mcp_servers.notion]
url = "https://mcp.notion.com/mcp"
startup_timeout_sec = 30
tool_timeout_sec = 60
```

Voer tijdens fase 4 waar nodig `codex mcp login notion` uit en voltooi de browserlogin in de juiste workspace. Kies vooraf de handboek-parentpagina en geef de verbinding toegang. Test `notion_get_self` en `notion_fetch` op de concrete parent-ID/URL. Geslaagd: juiste workspace/account én bedoelde pagina leesbaar. Alleen search met nul resultaten is onvoldoende verificatie.

Herstel: verkeerde workspace → opnieuw juiste OAuthverbinding kiezen; pagina ontbreekt → exacte URL/toegang controleren; verlopen login → opnieuw aanmelden/herstart; conflict → eerst actuele pagina lezen, daarna gerichte wijziging. Notion legt uit en linkt naar repo-API's/commando's; kopieer geen tweede specificatie of taakstatusdatabase. Lees pagina's altijd vóór geautoriseerde writes.

## Figma MCP

Remote endpoint `https://mcp.figma.com/mcp`; OAuth en het volledige playbook uit 10. Deze serververbinding installeert geen skills. Controleer de beschikbare officiële Figma-skills en voeg alleen ontbrekende bestanden met referenties toe volgens 10.

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
startup_timeout_sec = 30
tool_timeout_sec = 120
```

Tijdens fase 4 zo nodig `codex mcp login figma`, herstart en `whoami`. Voor de verplichte projectcontrole: Full seat op een ondersteund plan en `use_figma` beschikbaar; controleer tevens bewerkrechten op de bedoelde locatie. De Dev-seat-draftmogelijkheid is niet het afgesproken vervangende bewijs voor deze projectvoorwaarde. De intake had Starter/View en is dus nog niet geslaagd voor schrijfwerk. Er wordt geen abonnement automatisch gewijzigd.

Herstel: juiste account/seat/team en bestandsrechten; bij rate limits batchwerk hervatten vanaf bewaarde IDs; ontbrekende tools/skills na herstart opnieuw inventariseren. Code Connect of een rules-prompt kan ontbreken zonder dat de basisverbinding ontbreekt: gebruik de expliciete fallback uit 10. Maak voor deze lezende verificatie geen design als test. Stijlkeuze blijft afzonderlijk vereist vóór M3.

## Context7

Remote endpoint `https://mcp.context7.com/mcp`. Een API-key is aanbevolen voor betrouwbare limieten; zonder key kan de huidige dienst beperkte toegang bieden. Kies één modus en test die: een niet-ingestelde variabele terwijl `bearer_token_env_var` verplicht wordt gelezen is geen correct anoniem profiel.

```toml
[mcp_servers.context7]
url = "https://mcp.context7.com/mcp"
bearer_token_env_var = "CONTEXT7_API_KEY"
startup_timeout_sec = 30
tool_timeout_sec = 60
```

Batch F koos een projectprofiel zonder credential: de bearerregel staat alleen als comment in het projectbestand. De controle op 2026-11-02 toont echter een geërfde Authorization-header uit de persoonlijke config. De bestaande verbinding is daardoor niet als anoniem getest; de headerwaarde is niet getoond of naar Git gekopieerd. Houd deze herkomst zichtbaar in het verificatierapport. Voor een schone omgeving zonder geërfde auth: test anoniem en schakel alleen indien nodig met extern ingestelde key naar het beschreven keyprofiel. Bearer-auth is ondersteund volgens de actuele [Context7-clientdocumentatie](https://github.com/upstash/context7/blob/master/docs/clients/cursor.mdx). Gebruik niet tegelijk conflicterende OAuth-/headercredentials of een literal key in de repo.

Test: resolve React met een vraag over externe stores; kies de officiële React-library en vraag documentatie over `useSyncExternalStore` op. Geslaagd: een actueel fragment met bron en relevante API. Herstel bij quota/auth: keymodus/limiet controleren, niet herhaald dezelfde brede vraag sturen. Bij irrelevante resultaten: betere librarynaam en gerichte conceptquery; maximaal de door de tool toegestane retries. Bewaar bron/versie in de relevante doc of review.

## Playwright MCP

Vereist een compatibele Node/npm/npx-installatie en een beschikbare browser met Linux-systeemlibraries. `npx -y @playwright/mcp@latest` is het gevraagde startpatroon; leg de werkelijk gebruikte versie bij activatie vast en pin de geteste versie in de onderhoudsconfig voordat herhaald meetbewijs wordt vergeleken. Een versie-update vraagt herverificatie, geen automatisch geldig oud rapport.

```toml
[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp@latest", "--headless", "--isolated"]
startup_timeout_sec = 60
tool_timeout_sec = 120
```

Dit profiel gebruikt een geïsoleerde testbrowser, niet het persoonlijke browserprofiel. De [officiële Playwright MCP-README](https://github.com/microsoft/playwright-mcp), via Context7 gecontroleerd, beschrijft deze flags. Headless vermijdt afhankelijkheid van een desktop/X-server. De MCP-server en de later gepinde Playwright Test-suite hebben aparte verantwoordelijkheid; een werkende MCP bewijst geen uitgevoerde CI-suite.

Test: open `https://example.com` met `browser_navigate` (of de aangeboden equivalent), daarna `browser_snapshot`. Geslaagd: herkenbare pagina-inhoud en accessibilitysnapshot. Geen login-/eigen accountpagina als test. Controleer in fase 4 opnieuw de daadwerkelijke toolschema's; de namen in dit document zijn de huidige toolfamilies, geen universele garantie.

Herstel: npx/Node niet vindbaar → PATH van het Codex-proces controleren; browser ontbreekt → gebruik de door de gebruikte MCP-versie aangeboden installatiestap of zijn officiële browserinstallatie-instructie; ontbrekende OS-libraries → installeer de benodigde systeempakketten onder de bestaande autorisatie. Roep geen niet-aangeboden `browser_install` blind aan. Startup timeout → onderscheid download/auth/browserfout, verhoog niet eindeloos zonder oorzaak. Profielconflict → geïsoleerde context opnieuw starten.

## Chrome DevTools MCP

De intakefout was `Missing X server to start the headful browser`. Voor deze Linux-omgeving is headless starten het concrete herstelvoorstel. Gebruik een aparte tijdelijke browserprofielmap, zodat DevTools en Playwright elkaar niet blokkeren. De officiële [configuratiegids](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md), via Context7 gecontroleerd, beschrijft de onderstaande flags.

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["-y", "chrome-devtools-mcp@latest", "--headless=true", "--isolated", "--no-usage-statistics", "--no-performance-crux"]
startup_timeout_sec = 60
tool_timeout_sec = 120
```

De laatste twee flags voorkomen tooling-usage-statistics en het opsturen van getraceerde URLs voor CrUX-opvragingen; dit staat los van de browsergame. De lokale performanceproeven hebben die externe metrieken niet nodig. Leg ook hier de geteste server-/Chromeversie vast en pin na succesvolle setup. Gebruik de chrome-devtools-skill bij daadwerkelijk browserwerk.

Test: `new_page` op `https://example.com`; neem de teruggegeven `pageId` en roep `list_console_messages` daarmee aan. Geslaagd: pagina geopend én geslaagde console-response; een lege berichtenlijst is geldig. Een browserstartfout zonder page-ID voldoet niet. Herstel: headlessflag/effectieve config/herstart, browserbinary/libraries/PATH of timeoutdiagnose. Gebruik geen onbeveiligde gedeelde debugpoort als snelle omweg. Voor Safari op de iPhone gelden de afzonderlijke middelen uit 12.

## Weights & Biases MCP

Remote endpoint `https://mcp.withwandb.com/mcp`; bearer-token uit `WANDB_API_KEY`. De officiële [W&B MCP-server](https://github.com/wandb/wandb-mcp-server) documenteert hosted setup en deze Codex-tokenverwijzing. De SDK in Python logt training; de MCP leest/vergelijk runs en helpt de ontwikkelaar analyseren. Geen van beide hoort in de browserapp.

```toml
[mcp_servers.wandb]
url = "https://mcp.withwandb.com/mcp"
bearer_token_env_var = "WANDB_API_KEY"
startup_timeout_sec = 30
tool_timeout_sec = 120
```

Test: `list_entities_tool` met lege invoer. Geslaagd: de bedoelde toegankelijke entity, bij intake `sinktheship`, verschijnt. Leg vóór experimenten daarnaast de precieze entity/projectbestemming en schrijfbevoegdheid vast. Een entitylijst maakt nog geen project of run aan.

Herstel: 401/keyomgeving, verkeerde entity/projectrechten of netwerk. Python-training moet ook offline draaien volgens 07; markeer de run dan expliciet offline en synchroniseer pas wanneer de geautoriseerde verbinding werkt. Een niet-geüploade run heeft geen verzonnen online URL. Tijdens deze documentatieronde gaf de W&B-documentatiezoektool een upstreamfout; de setup is daarom met de officiële serverrepository gecontroleerd. Dat is geen nieuwe mislukte entity-verificatietest.

## Fase 4: volgorde en verplicht verificatierapport

1. Lees de goedgekeurde documenten en configdiff; controleer dat uitsluitend de zeven bedoelde projectservers zijn voorbereid en dat er geen secrets in staan.
2. Regel de open bestemmingen/rechten, vertrouw de projectmap en stel externe procesvariabelen/OAuth in. Zet alle zeven `enabled`-waarden in het projectbestand op `true` en activeer de voorgestelde permissieregels voor zover het hostbeleid dat toestaat. Controleer de effectieve Context7-auth, inclusief eventuele geërfde persoonlijke instellingen; stel vooraf het gekozen env-keyprofiel in als dat nodig is. Installeer noodzakelijke lokale server-/browserdependencies binnen de afgesproken setup.
3. Start een nieuwe Codex-sessie. Controleer `codex mcp list` of de effectieve IDE-instellingen en toolinventaris; de lijst alleen is geen testresultaat.
4. Voer alle zeven onderstaande lezende tests uit en noteer per server datum/client-/serverversie, identiteit/bestemming, testcall, geredigeerd resultaat en status.
5. Ga pas na zeven geslaagde controles door met repository-/Projects-/Notion-inrichting. Als een voorwaarde faalt: beschrijf exact oorzaak, benodigde gebruikersactie en hervatpunt; stop vóór die externe inrichting zoals de masterprompt voorschrijft.

### Verificatieverslag 2026-11-02

**Uitkomst: alle zeven verplichte verbindingstests geslaagd.** Na de accountwissel meldt Figma het Education-team **SinkTheShip** met Full seat. `create_session` op het opgegeven bestand slaagt; `get_metadata` leest pagina `0:1` (Page 1). Ook de huidige Chrome-tool opent nu example.com en leest de console succesvol. GitHub, Notion, Context7, Playwright en W&B zijn aansluitend opnieuw gecontroleerd. De eerdere account- en browserstartblokkades zijn opgelost; er is geen design gewijzigd.

Lokale basis: `codex-cli 0.166.0`, Node `v26.8.1`, npm `12.0.2`. De projectmap stond al op trusted. `GITHUB_PAT` en `WANDB_API_KEY` zijn in de procesomgeving aanwezig; `CONTEXT7_API_KEY` ontbreekt. Er zijn alleen aanwezigheids-/configuratiekenmerken bekeken, geen tokenwaarden. `codex mcp list --json` toont na activatie exact de zeven bedoelde servers, alle enabled; de twee browserentries bevatten de headless- en isolated-flags. De lijst meldt OAuth voor Figma/Notion en bearer-auth voor GitHub/Context7/W&B. Dat is configuratiebewijs, geen vervanging voor de tooltests.

| Server | Uitgevoerde call(s) | Waargenomen resultaat | Actuele verificatiestatus |
|---|---|---|---|
| GitHub | `get_me({})`; toolinventaris | Account `Cas0570`; `projects_list/get/write` en `actions_list/get` aanwezig | Geslaagd; bestemmingsrechten later gericht toetsen |
| Notion | `notion_get_self({})`; `notion_fetch` op de opgegeven pagina-ID | Workspace **Ruimte van Cas**, gebruiker Cas; [SinkTheShip](https://app.notion.com/p/40c275fb04ba801092a7d17e14684844) is bereikbaar en leeg | Verbinding en gekozen ouderpagina geslaagd |
| Figma | `whoami({})`; `create_session`; `get_metadata` met sessionId en node `0:1`; toolinventaris | Account **Cas Doorn**, team **SinkTheShip**, Education (`student`), **Full**; `use_figma` aanwezig. [Bestand SinkTheShip](https://www.figma.com/design/z5qW8mIwsPjYRTfCpk9nwP/SinkTheShip?node-id=0-1) opent succesvol; lege Page 1 leesbaar | Geslaagd voor plan, seat en bestandstoegang |
| Context7 | `resolve_library_id` React → `query_docs` op `/reactjs/react.dev` | Relevant bronfragment over `useSyncExternalStore`, subscribe-cleanup en stabiele snapshots | Geslaagd; bestaande geërfde auth behouden |
| Playwright | `browser_navigate` naar example.com → `browser_snapshot`; daarna dezelfde calls in vers stdio-proces | Titel Example Domain en accessibilitysnapshot ontvangen. Npm-package `0.0.84`; initialize meldt Playwright `1.65.0-alpha-2026-10-30` | Geslaagd, ook in de huidige toolverbinding; packageversie gepind |
| Chrome DevTools | Huidige tool: `new_page` naar example.com → `list_console_messages` met teruggegeven `pageId: 2` | Pagina opent als Example Domain; console geeft succesvol een lege berichtenlijst. Eerdere afzonderlijke headless-test gebruikte MCP `1.12.0`; lokale Google Chrome `140.0.7339.80` beschikbaar | Geslaagd in de huidige client |
| W&B | `list_entities_tool({})` | Entity `sinktheship` verschijnt als user en team; projectbestemming nog open | Geslaagd |

De remote serverversies worden door deze hosttools niet getoond; er is geen versienummer verzonnen. De browserproeven gebruikten geïsoleerde tijdelijke mappen en zijn afgesloten. Het door de bestaande Playwright-tool gemaakte tijdelijke snapshot is opgeruimd. De tijdelijke testclient en outputs zijn geen applicatiecode en staan niet in de repository.

De ontwikkelaar heeft het aanmaken van de private repository en pushen op 2026-11-02 afzonderlijk goedgekeurd. De uitvoering en het resterende hervatpunt volgen hieronder. De aparte Figma-stijlkeuze blijft vóór M3; de geslaagde verbindingscontrole kiest geen stijl en levert geen ontwerp op.

De [intaketabel](README.md#mcp-controle-bij-intake) blijft historisch bewijs van 2026-10-31. Op 2026-11-02 zijn eerst Starter/View, ontbrekende bestandsrechten en een headful-startfout vastgesteld. De latere accountwissel en werkende headless-client hebben die blokkades aantoonbaar opgelost. Na een volgende wijziging van actieve config/auth/serverversies de getroffen verbindingen en vervolgens de volledige fase-4-gate opnieuw controleren vóór inrichting. De ingangsvoorwaarde is nu gehaald; fase 4 is pas afgerond na repository-, bord- en handboekinrichting.

## Externe inrichting 2026-11-02

De volgende resultaten zijn na de zeven geslaagde MCP-tests en het afzonderlijke repositoryakkoord uitgevoerd en teruggelezen:

| Onderdeel | Resultaat |
|---|---|
| Repository | [Cas0570/sinktheship](https://github.com/Cas0570/sinktheship) is privé; `main` is de default branch. De bestaande documentatiegeschiedenis is gepusht; `origin` bevat uitsluitend de HTTPS-repository-URL. |
| Project | [SinkTheShip, project 3](https://github.com/users/Cas0570/projects/3) is privé en gekoppeld aan de repository. De boardview groepeert op Status; de tabelview toont onder andere Milestone, Work type en Size. |
| Issues en kaarten | Exact 59 unieke T-ID’s, issues en kaarten; korte samenvatting plus canonieke taaklink, acht projectlabels en native mijlpalen M0–M6. Alle kaartvelden zijn teruggelezen over twee pagina’s (50 + 9); de nummers en URL’s staan in [14](14-backlog.md). |
| Typeveld | GitHub reserveert `Type`; het gelijkwaardige projectveld heet `Work type`. De vijf waarden blijven feature, ML, design, infra en docs. De onderbouwde naamcorrectie staat in [ADR 0012](adr/0012-github-projects.md). |
| Notion | [Handboek](https://app.notion.com/p/40c275fb04ba81da945cee04d24413bb) onder de opgegeven ouderpagina; Start hier, Werken met de codebase, Uitbreiden, Beslissingen en Release notes zijn teruggelezen. Beslissingen linkt naar alle 50 ADR’s. |
| Experimentverslagen | [ML-experimenten](https://app.notion.com/p/27115ed9c3bf47f9924ec6600951bc9f) bevat onderzoeksvraag, aanpak, resultaat en runlink, plus datum, commit, modelversie, seeds/configuratie, artefacten, lokale runreferentie en beperkingen. Er zijn geen fictieve experimenten aangemaakt. |
| W&B | De entity [sinktheship](https://wandb.ai/sinktheship) is bereikbaar en heeft volgens `query_wandb_entity_projects` nog geen projecten. Het handboek linkt naar de bestaande entity; projectkeuze en eventuele aanmaak volgen vóór online training. |

GitHub MCP verzorgde repository/project, issues, kaarten, views en teruglezing. Voor ontbrekende MCP-mogelijkheden is de afgesproken officiële `gh`-fallback gebruikt: versie `2.103.3`, tijdelijk buiten de repo uitgepakt uit de officiële release en gecontroleerd op de bijbehorende SHA-256. Daarmee zijn velden, labels en mijlpalen ingericht, projectprivacy/repokoppeling bevestigd en workflowmetadata gelezen. Authenticatie kwam uitsluitend uit de bestaande procesomgeving; er is geen token in Git, remote-URL of verslag geschreven.

**Workflowcontrole afgerond op 2026-11-02.** Bij de eerste teruglezing stond `Auto-close issue` nog aan. De ontwikkelaar heeft deze uitgezet en drie screenshots van de GitHub Projects-UI aangeleverd. Die tonen beide doelstatussen en de uitgeschakelde omgekeerde afsluiting. De aansluitende GraphQL-query bevestigt de enabled-statussen:

| Workflow | Bewijs uit gebruikersscreenshots | Teruggelezen API-status |
|---|---|---|
| Item closed | On; Set value: Status: Done | `enabled: true` |
| Pull request merged | On; Set value: Status: Done | `enabled: true` |
| Auto-close issue | Off | `enabled: false` |

De beschikbare API toont geen doelstatus; de screenshots zijn daarom het aanvullende bewijs voor de Done-koppelingen. De controle voldoet aan [ADR 0012](adr/0012-github-projects.md). Bij latere wijzigingen wordt via **projectmenu … → Workflows** dezelfde controle herhaald en worden de API-statussen opnieuw gelezen.

De ontwikkelaar heeft de fase-4-inrichting op 2026-11-02 goedgekeurd. De eerste kaart is volgens ADR 0012 vrijgegeven en teruggelezen; actuele taakstatus blijft uitsluitend op het bord. Op verzoek van de ontwikkelaar stopt het werk na het vastleggen en committen van dit akkoord. De bouw wordt pas bij een volgend startverzoek hervat volgens AGENTS. De eerste echte merge in M0 toetst later het eventgedrag; er is geen proefissue gesloten of proef-PR gemerged. Er is nog geen applicatiecode, designgeneratie, modeltraining of app-/toesteltest uitgevoerd.

## Beveiliging van main

Op 2026-11-02 heeft de ontwikkelaar gevraagd de laatste voorbereidingen te pushen en daarna uitsluitend via pull requests naar main te werken. De lokale hooks in [.githooks](../.githooks/README.md) zijn getest in een tijdelijke repository: commit/amend en lokale mergecommit op main worden geweigerd; commits/pushes op een taakbranch slagen; push naar main via een andere bronref, force-push en verwijderen worden geweigerd; fast-forward ophalen blijft werken. Er zijn geen proefcommits of proefmerges in de productrepository gemaakt.

**Serverbeveiliging nog geblokkeerd:** GitHub retourneert voor zowel `GET /repos/Cas0570/sinktheship/rulesets` als `GET /repos/Cas0570/sinktheship/branches/main/protection` HTTP 403: `Upgrade to GitHub Pro or make this repository public to enable this feature.` Het account heeft wel adminrechten. De repository blijft privé; er is geen abonnement gewijzigd. [GitHub documenteert](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) dat branchregels voor private persoonlijke repositories GitHub Pro vereisen.

Het reviewbare profiel staat in [.github/main-ruleset.json](../.github/main-ruleset.json): actieve branchregels voor main, verplichte PR, geen bypasses, geen force-push of verwijdering en afgehandelde reviewgesprekken. [ADR 0050](adr/0050-review-and-task-workflow.md#bescherming-van-main) motiveert de instellingen en het onderscheid tussen menselijke goedkeuring en onafhankelijke GitHub-approvals.

Na activering van GitHub Pro: eerst bestaande rulesets lezen om duplicaten te voorkomen, dit profiel toepassen via de beschikbare GitHub API/gh-route, vervolgens de opgeslagen ruleset én de effectieve regels voor main teruglezen. Tot dat bewijs is er uitsluitend lokale bescherming; claim geen afgedwongen PR-grens op GitHub. Start de bouw pas na herstel of een expliciete tijdelijke uitzondering van de ontwikkelaar.

De hooks worden in deze checkout pas na de laatste voorbereidingspush geactiveerd. Nieuwe clones activeren ze met `git config --local core.hooksPath .githooks`. Agents controleren deze instelling vóór wijzigingen. Alleen de lokale hooks zijn met echte tijdelijke Git-operaties getest; serverhandhaving kan pas worden gecontroleerd zodra GitHub de functie beschikbaar maakt.

## Dagelijks herstel en taakafsluiting

Lees vóór writes de actuele issue-/pagina-/designstate. Repo-docs zijn technisch leidend; GitHub Projects is de enige implementatiestatusbron. Bij serveruitval tijdens een gewone bouwtaak mag lokaal werk verder, maar noem de gemiste externe update met bestemming/actie/oorzaak in de reviewsamenvatting. Hervat later met opnieuw lezen om dubbele issues, pagina's of comments te voorkomen.

Een toolcall die technisch slaagt maar een foutobject teruggeeft telt als failure. Maak onderscheid tussen ontbrekende tool, authprobleem, onvoldoende rechten, quotum, browserstartfout en onjuiste resource. Een geen-resultatenzoekopdracht bewijst niet dat een object nergens bestaat. Verberg geen gemiste verplichte update achter een groen lokaal testresultaat.

De fase-4-stop is strenger dan dagelijks doorwerken: het is een expliciete voorwaarde uit [masterprompt §15](00-masterprompt.md#15-werkwijze-voor-deze-opdracht). De actuele noodzakelijke gebruikersacties en het hervatpunt staan in het verificatieverslag hierboven.
