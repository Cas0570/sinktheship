Status: Geaccepteerd  
Versie: 0.2  
Laatst gewijzigd: 2026-10-31  
Gerelateerd: [Masterprompt](00-masterprompt.md)

# SinkTheShip — leeswijzer en voortgang

Dit bestand is het hervatpunt voor de documentatieopdracht. Lees eerst de [masterprompt](00-masterprompt.md), daarna deze leeswijzer. Technische specificaties staan in de repository; het toekomstige Notion-handboek legt de werkwijze uit en verwijst ernaar. GitHub Projects wordt de enige bron voor de status van implementatietaken. De onderstaande voortgang betreft uitsluitend deze documentatieopdracht.

## Fase 0: begrip van de opdracht

- Het leerdoel is neural networks begrijpen door een browsergame te bouwen. De AI werkt taak voor taak; de ontwikkelaar reviewt en moet later zelfstandig kunnen uitbreiden.
- De huidige opdracht levert volledige Nederlandstalige docs-as-code, contracten, ADR's, een roadmap en een traceerbare backlog. Implementatiecode valt buiten deze opdracht.
- De vaste basis is React, Vite, strict TypeScript en Tailwind in een pnpm-monorepo; v1 is een statische app zonder backend. Code, identifiers, comments en commits zijn Engels.
- Een configureerbare, deterministische `game-core` zonder dependencies vormt het centrum. `PlayerView`, geïnjecteerde randomness, ports, adapters en registries bewaken eerlijk spel en modulariteit.
- V1 biedt regelkeuze en Easy, Normal, Hard en Impossible. De eerdere MVP bevat Easy tot en met Hard. De UI is Engels en Nederlands, responsive, toegankelijk en hervatbaar na een refresh.
- Impossible wordt met PyTorch getraind, naar ONNX geëxporteerd en in een Web Worker uitgevoerd. Compatibele regelsets, gedeelde fixtures, export-pariteit en meetbare benchmarkresultaten zijn acceptatievoorwaarden; betere prestaties worden niet vooraf als bewezen beschouwd.
- Multiplayer wordt alleen ontworpen, met gereserveerde routes en bruikbare uitbreidingspunten. Gebruikersaccounts worden in v1 en de eerstvolgende releases niet gebouwd of gebruikt. Dit is een bewuste keuze voor nu; accounts kunnen in een latere release worden toegevoegd.
- We werken in fasen met akkoordmomenten. Na de documentatie en consistentiecheck worden eerst alle zeven MCP-servers geverifieerd en daarna het GitHub Projects-bord en Notion-handboek ingericht. Bouwen begint pas daarna.

## Voortgang en hervatten

| Onderdeel | Voortgang van de documentatieopdracht |
|---|---|
| Fase 0 — intake | Goedgekeurd door de ontwikkelaar op 2026-10-31 |
| Fase 1 — plan | Nog niet gestart |
| Fase 2 — batches A–F | Nog niet gestart |
| Fase 3 — consistentiecheck | Nog niet gestart |
| Fase 4 — MCP-verificatie, bord en handboek | Nog niet gestart |

Volgende actie na akkoord: fase 1 opleveren met de documentstructuur, per document een korte toelichting, de ADR-lijst, een voorstel voor de v1-regelpresets en de open vragen. Na fase 1 opnieuw wachten op akkoord. Tijdens fase 2 na iedere batch deze leeswijzer bijwerken en de batch ter review aanbieden; pas na goedkeuring committen.

Beginsituatie: bestaande Git-repository op branch `main`, zonder commits, zonder geconfigureerde remote en zonder projectbestanden. `git init` was niet nodig. In fase 0 zijn uitsluitend deze leeswijzer en de masterprompt toegevoegd. Er zijn geen installatie-, configuratie- of externe schrijfhandelingen uitgevoerd. De ontwikkelaar heeft fase 0 op 2026-10-31 goedgekeurd; deze versie wordt als intake vastgelegd in Git.

## Documentinventaris

| Document | Documentstatus | Toelichting |
|---|---|---|
| [00-masterprompt.md](00-masterprompt.md) | Geaccepteerd als opdracht | Volledige originele opdracht, voorafgegaan door metadata |
| [README.md](README.md) | Concept | Intake, verbindingen, open punten en hervatinstructies |

De overige documenten uit hoofdstuk 14 van de masterprompt zijn nog niet geschreven. Hun structuur wordt in fase 1 uitgewerkt; er worden nu geen lege specificaties aangemaakt.

## MCP-controle bij intake

Controle uitgevoerd op 2026-10-31. `codex-cli 0.166.0` is aanwezig. `codex mcp list --json` noemt alle zeven vereiste servers als `enabled: true`. Dit bewijst configuratie, geen werkende verbinding of toereikende rechten. De onderstaande testcalls zijn afzonderlijk uitgevoerd via de beschikbare MCP-tools.

Er bestaat nog geen `.codex/config.toml` in deze repository. De huidige sessieverbindingen zijn dus nog geen bewijs van de vereiste projectconfiguratie. Het configbestand hoort bij batch F; installatie, activering en volledige herverificatie volgen in fase 4.

| Server | Testcall / controle | Resultaat | Beoordeling |
|---|---|---|---|
| GitHub | `get_me`; inspectie van aangeboden tools | Account `Cas0570`; `projects_get`, `projects_list`, `projects_write` en `actions_get`, `actions_list`, `actions_run_trigger` zijn beschikbaar | Intake geslaagd; schrijfbevoegdheden voor het gekozen project later controleren |
| Notion | `notion_get_self`; `notion_search` met `SinkTheShip` | Workspace `Ruimte van Cas`, gebruiker Cas; zoekopdracht geeft geen resultaten | Verbonden; beoogde handboeklocatie nog niet bekend of geopend, volledige verificatie dus nog niet geslaagd |
| Figma | `whoami`; inspectie van aangeboden tools | Account Cas; Starter-plan, View-seat; `use_figma` is beschikbaar | Verbonden; voldoet niet aan de vereiste Full-seat op een ondersteund plan |
| Context7 | `resolve_library_id` voor React; `query_docs` met `/websites/react_dev_reference` | Documentatie over `useSyncExternalStore`, inclusief abonnementen en stabiele, immutable snapshots | Intake geslaagd |
| Playwright | `browser_tabs` met `action: new` en `https://example.com`; daarna `browser_snapshot` | Pagina geopend; toegankelijkheidssnapshot met inhoud en link ontvangen | Intake geslaagd |
| Chrome DevTools | `new_page` met `https://example.com` | Fout: `Missing X server to start the headful browser` | Niet geslaagd; geen pagina-ID, dus consoleberichten nog niet opvraagbaar |
| Weights & Biases | `list_entities_tool` | Naam `sinktheship` verschijnt als user-entity en als team-entity | Intake geslaagd; projectbestemming later kiezen |

De browsercontrole is uitsluitend een eenmalige verbindingscontrole, geen test van SinkTheShip. In fase 4 opnieuw alle voorgeschreven testcalls uitvoeren. Het bord en het handboek pas inrichten zodra alle controles uit hoofdstuk 13.2 zijn geslaagd.

### Benodigde setup en herstel vóór fase 4

**Figma:** gebruik een account met een Full-seat op Professional, Education, Organization of Enterprise en bewerkrechten op de gekozen designlocatie. Laat de ontwikkelaar de seat of het account regelen. Koppel zo nodig opnieuw via `codex mcp login figma` en herstart de sessie; controleer daarna `whoami` en beschikbaarheid van `use_figma`. Er is geen abonnement gewijzigd. De officiële documentatie bevestigt de ondersteunde plannen en vereiste bewerkrechten: [Write to canvas](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/). De Full-seat-eis komt uit de masterprompt.

**Chrome DevTools:** deze omgeving heeft geen X-server voor een zichtbare browser. Neem in de projectconfiguratie een headless start op en laad de server daarna opnieuw. Onderstaand fragment is een voorbereid herstelvoorstel, nog niet toegepast:

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["-y", "chrome-devtools-mcp@latest", "--headless=true"]
startup_timeout_sec = 60
```

Open na herstart een testpagina met `new_page` en vraag met de geretourneerde `pageId` de console op via `list_console_messages`. De optie is geverifieerd via Context7 in de [officiële configuratiegids](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md). De timeout van 60 seconden is een voorgestelde projectinstelling.

**Notion:** kies vóór fase 4 de bovenliggende pagina voor het handboek, zorg dat het verbonden account die kan openen en bewerken, en verifieer de gekozen pagina met een lezende call. De huidige zoekopdracht bewijst alleen dat geen toegankelijke pagina op de zoekterm werd gevonden; zij bewijst niet dat er nergens al een handboek is.

**Projectconfiguratie:** leg in batch F de zeven servers vast in `.codex/config.toml`, zonder secrets. In fase 4 vertrouwt de ontwikkelaar de projectmap, stelt de benodigde tokenvariabelen beschikbaar aan het Codex-proces en gebruikt waar nodig `codex mcp login figma` en `codex mcp login notion`. Start daarna een nieuwe sessie, controleer `codex mcp list` en voer alle testcalls opnieuw uit. De [officiële Codex MCP-documentatie](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) beschrijft projectconfiguratie, OAuth en tokenverwijzingen.

Let op bij het latere Figma-playbook: `codex mcp add` schrijft volgens de via Context7 geraadpleegde [Codex-broncode](https://github.com/openai/codex/blob/main/codex-rs/cli/src/mcp_cmd.rs) naar de globale configuratie. Gebruik voor de verplichte projectscope het bestand in de repository; voer het voorbeeldcommando uit de masterprompt niet zonder deze toelichting uit.

## Centrale open punten

Deze punten vereisen nu geen antwoord om het documentatieplan te kunnen schrijven.

| ID | Open punt | Moment van oplossen |
|---|---|---|
| Q-01 | V1-presets en precieze grenzen van Aangepast bevestigen; host, room-routeprefix, packages en voorkeurslibraries beargumenteren via ADR's | Voorstel en review in fase 1; details in de betreffende batches |
| Q-02 | Figma-account/plan/seat en designlocatie met voldoende rechten regelen; uit drie nog te beschrijven stijlrichtingen kiezen | Rechten vóór fase 4; stijl vóór designgeneratie |
| Q-03 | Chrome DevTools met een werkende browserstart configureren en pagina plus console verifiëren | Projectconfiguratie in batch F; volledige verificatie vóór inrichting in fase 4 |
| Q-04 | GitHub-repository en eigenaar/zichtbaarheid, Notion-parentpagina, Figma-bestand en W&B-projectbestemming vaststellen | Vóór de betreffende externe handelingen in fase 4; repository aanmaken alleen na het daarvoor gevraagde akkoord |
| Q-05 | Volledige `rulesSignature` versus strategiecompatibiliteit van modellen, observeerbare zinkinformatie en de grens van eerlijk spel in een lokale browser expliciet uitwerken | Voorstel in fase 1; toetsbare contracten en ADR's in batches B en C |

## Aannames voor het plan

> Aanname A-01: er is geen bestaande implementatie om te behouden of te migreren; de lokale repository bevatte bij de intake alleen `.git`.

> Aanname A-02: de voorgestelde presets uit hoofdstuk 8 vormen de basis voor het voorstel in fase 1, maar zijn nog niet afzonderlijk goedgekeurd.

> Aanname A-03: externe bestemmingen en de visuele richting kunnen later worden gekozen; ontbrekende keuzes blokkeren fase 1 niet. De intake wijzigt geen vastgestelde technologie- of productbeslissing.

## Traceerbaarheid

De requirements en user stories worden in batch A vastgelegd, de teststrategie in batch E en de taken in batch F. De matrix wordt dan aangevuld en in fase 3 op dekking gecontroleerd. Er zijn nog geen definitieve IDs of testresultaten voor productrequirements toegekend.

| Requirement (`FR-xx` / `NFR-xx`) | User story (`US-xx`) | Taak (`Txx`) | Test / verificatie |
|---|---|---|---|

## Externe projectlinks

| Bestemming | Link of ontbrekend gegeven |
|---|---|
| GitHub-repository | Nog niet vastgesteld; er is geen Git-remote geconfigureerd |
| GitHub Projects-bord | Nog niet ingericht |
| Notion-handboek | Parentpagina nog niet gekozen; nog niet ingericht |
| Figma | Designbestand nog niet gekozen; rechten zie MCP-controle |
| W&B | Entity `sinktheship` gevonden; project-URL nog niet vastgesteld |

## Review van fase 0

De opdracht is volledig bewaard en de intakebevindingen zijn vastgelegd. Er zijn geen productkeuzes gewijzigd, geen implementatietaken gestart en geen externe gegevens aangemaakt. De ontwikkelaar heeft fase 0 op 2026-10-31 goedgekeurd. Fase 1 mag worden uitgewerkt; de herstelpunten hoeven daarvoor nog niet opgelost te zijn.
