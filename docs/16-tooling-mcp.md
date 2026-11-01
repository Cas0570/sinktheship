Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Intake en open punten](README.md#mcp-controle-bij-intake), [masterprompt](00-masterprompt.md), [Figma-playbook](10-figma-mcp-playbook.md), [kwaliteit](12-quality-testing.md), [uitbreiden](15-extension-guides.md), [ADR 0013](adr/0013-project-mcp-servers.md)

# Projecttooling en zeven MCP-servers

Dit document levert setup-, verificatie- en herstelstappen. Batch F maakt de reviewbare `.codex/config.toml`; fase 4 activeert en verifieert de verbindingen voordat GitHub Projects en Notion worden ingericht. Deze batch installeert niets, wijzigt geen authenticatie en voert geen externe writes uit.

## Scope en configuratiegrens

De toegestane projectservers zijn exact `github`, `notion`, `figma`, `context7`, `playwright`, `chrome-devtools` en `wandb`. Een nieuwe server vraagt een ADR. Configureer ze in de repository onder `.codex/config.toml`; CLI en IDE-extensie gebruiken dezelfde configuratielagen. De ontwikkelaar moet de projectmap vertrouwen voordat Codex de projectlaag activeert. User-/managed-/pluginconfig kan daarnaast tools aanbieden: een aanwezig toolicoon bewijst niet dat de projectconfig wordt gebruikt of dat een account voldoende rechten heeft.

Controleer bij activatie de effectieve serverlijst, origin van de instellingen en dubbelen uit persoonlijke configuratie/plugins. Gebruik voor dit project alleen de zeven bedoelde serververbindingen; schakel ongewenste extra verbindingen voor de projectsessie uit zonder andere projecten te beschadigen. Projectconfig overschrijft niet automatisch alle globale entries. Wanneer een host/plugin die scheiding niet aanbiedt, leg de beperking vast en los haar op in de gekozen clientomgeving vóór het fase-4-akkoord.

De lokaal aanwezige CLI is op 2026-11-01 `codex-cli 0.166.0`. `codex mcp --help` bevestigt list/get/add/remove/login/logout. `codex mcp add` biedt geen projectscopeflag en de eerder gecontroleerde broncode schrijft de globale configuratie. Daarom komt de projectsetup rechtstreeks in het repo-bestand; geen globale add-opdrachten als stil alternatief. Zie de [officiële configuratiegids](https://learn.chatgpt.com/docs/config-file/config-basic), [MCP-gids](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) en [referentie](https://learn.chatgpt.com/docs/config-file/config-reference), geraadpleegd op 2026-11-01.

### Voorgesteld Codex-permissieprofiel

Voor normaal lokaal bouwen is het voorstel `workspace-write`, `on-request` en expliciet netwerk aan. Dit geeft ruimte voor projectedits, package-installatie en geautoriseerde git-/MCP-werkzaamheden, terwijl acties buiten de ingestelde grenzen nog door de client worden beoordeeld. Netwerk aan is geen impliciete toestemming om een repo te publiceren of berichten te versturen. De huidige documentsessie draait met een ander hostprofiel (`danger-full-access`, approvals `never`); dat is geen stil aangenomen toekomstige projectstandaard.

```toml
# Proposed project defaults, prepared in batch F; not activated here.
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

De exacte taak-lifecycle komt in batch F in `AGENTS.md`. De aangeleverde Context7-regel blijft behouden: eerst resolve-library-id, daarna gerichte query-docs, ook als de API bekend lijkt. Geen Context7 voor louter businesslogica of algemene refactoring zonder platform-API. Deel geen private data/secrets in documentatiequeries.

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

Bij een bewust anoniem profiel laat batch F de bearerregel weg; bij een keyprofiel staat de key extern. Bearer-auth is ondersteund volgens de actuele [Context7-clientdocumentatie](https://github.com/upstash/context7/blob/master/docs/clients/cursor.mdx). Gebruik niet tegelijk conflicterende OAuth-/headercredentials of een literal key in de repo.

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
2. Regel de open bestemmingen/rechten, kies het Context7-keyprofiel, vertrouw de projectmap en stel externe procesvariabelen/OAuth in. Installeer noodzakelijke lokale server-/browserdependencies binnen de afgesproken setup.
3. Start een nieuwe Codex-sessie. Controleer `codex mcp list` of de effectieve IDE-instellingen en toolinventaris; de lijst alleen is geen testresultaat.
4. Voer alle zeven onderstaande lezende tests uit en noteer per server datum/client-/serverversie, identiteit/bestemming, testcall, geredigeerd resultaat en status.
5. Ga pas na zeven geslaagde controles door met repository-/Projects-/Notion-inrichting. Als een voorwaarde faalt: beschrijf exact oorzaak, benodigde gebruikersactie en hervatpunt; stop vóór die externe inrichting zoals de masterprompt voorschrijft.

| Server | Verplichte read-test | Geslaagd wanneer | Fase-4-status nu |
|---|---|---|---|
| GitHub | get_me + inspectie projects/actions | Juiste account en beide toolsets | Nog niet uitgevoerd |
| Notion | get_self + fetch gekozen parent | Juiste workspace én locatie leesbaar | Nog niet uitgevoerd; parent open |
| Figma | whoami + tool-/toegangscontrole | Full seat/ondersteund plan, use_figma en juiste bestemming | Nog niet uitgevoerd; seat open |
| Context7 | Resolve React → query docs | Actueel relevant fragment met bron | Nog niet uitgevoerd |
| Playwright | Open pagina → snapshot | Herkenbare inhoud/accessibilitytree | Nog niet uitgevoerd |
| Chrome DevTools | Open pagina → console met page-ID | Geldige console-response | Nog niet uitgevoerd; headlessherstel gepland |
| W&B | List entities | Bedoelde entity zichtbaar | Nog niet uitgevoerd |

De [intaketabel](README.md#mcp-controle-bij-intake) blijft historisch bewijs van 2026-10-31. Bovenstaande tabel wordt pas met echte fase-4-resultaten vervangen/aangevuld; een configuratiesnippet, beschikbare tool of eerdere test telt niet als nieuwe geslaagde activatie. Na iedere config-/auth-/serverversiewijziging de getroffen verbindingen en vervolgens de volledige fase-4-gate opnieuw controleren vóór inrichting.

## Dagelijks herstel en taakafsluiting

Lees vóór writes de actuele issue-/pagina-/designstate. Repo-docs zijn technisch leidend; GitHub Projects is de enige implementatiestatusbron. Bij serveruitval tijdens een gewone bouwtaak mag lokaal werk verder, maar noem de gemiste externe update met bestemming/actie/oorzaak in de reviewsamenvatting. Hervat later met opnieuw lezen om dubbele issues, pagina's of comments te voorkomen.

Een toolcall die technisch slaagt maar een foutobject teruggeeft telt als failure. Maak onderscheid tussen ontbrekende tool, authprobleem, onvoldoende rechten, quotum, browserstartfout en onjuiste resource. Een geen-resultatenzoekopdracht bewijst niet dat een object nergens bestaat. Verberg geen gemiste verplichte update achter een groen lokaal testresultaat.

De fase-4-stop is strenger dan dagelijks doorwerken: het is een expliciete voorwaarde uit [masterprompt §15](00-masterprompt.md#15-werkwijze-voor-deze-opdracht). Dit document vraagt nu geen herstelacties of herauthenticatie; het maakt ze concreet voor het afgesproken moment.
