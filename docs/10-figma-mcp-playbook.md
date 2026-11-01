Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Design brief](09-design-brief.md), [frontend](08-frontend.md), [architectuur](04-architecture.md), [Figma-besluit](adr/0010-figma-design-workflow.md), [mappingbesluit](adr/0047-design-code-mapping.md), [leeswijzer](README.md)

# Figma MCP: van brief naar gecontroleerde componenten

Dit playbook wordt uitgevoerd bij het latere design-/bouwtraject M3. Batch D levert alleen de instructies. De prompts hieronder zijn afzonderlijke werkstappen: vul de benoemde invoer in, voer de stap uit, review het resultaat en ga daarna verder. De ontwikkelaar kiest eerst een stijl volgens ADR 0018. Een akkoord op de documentatie is geen gekozen stijl of toestemming om nu al een design te genereren.

## Actuele mogelijkheden en randvoorwaarden

De officiële Figma-documentatie is op 2026-11-01 geraadpleegd. Controleer haar opnieuw vóór uitvoering; servertools, plannen en bètagrenzen kunnen veranderen.

| Onderwerp | Voorwaarde en gevolg voor dit project |
|---|---|
| Server | Gebruik de remote server `https://mcp.figma.com/mcp`; canvaswerk gaat via `use_figma` |
| Schrijfrechten | Full seat op Professional, Education, Organization of Enterprise plus edit access voor het gekozen projectbestand; een Dev seat kan alleen in drafts schrijven |
| Huidige intake | Op 2026-10-31 gaf `whoami` Starter/View. Een aangeboden tool bewijst geen schrijfrecht; rechten en bestemming moeten vóór fase 4 opnieuw worden gecontroleerd |
| Bèta | Werk op een kopie/draft. De huidige gratis bèta is geen toezegging over toekomstige kosten |
| Leeslimieten | Starter en View/Collab kunnen zeer beperkt zijn; de gepubliceerde grens is maximaal 6 relevante leescalls per maand. Dev/Full op ondersteunde betaalde plannen hebben plan-afhankelijke limieten |
| Assets/fonts | Afbeeldingen via `upload_assets` of `generate_image`; fonts moeten voor de remote omgeving beschikbaar zijn. Een lokaal font alleen is onvoldoende |
| Code Connect | Vereist gepubliceerde componenten en passende rechten/features. Actuele integratiedocs noemen ook Professional met beperkingen; neem geen oudere skilltekst over als actuele planmatrix |
| Design-system-regels | `create_design_system_rules` is in de actuele documentatie een MCP-prompt; niet elke client biedt hem als aanroepbare tool aan |

Bronnen: [introductie en seats](https://developers.figma.com/docs/figma-mcp-server/), [canvasmogelijkheden](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/), [rate limits](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/), [Code Connect-integratie](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/) en [custom rules](https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/).

In deze sessie zijn onder meer `use_figma`, `get_design_context`, `get_variable_defs`, `get_screenshot`, `get_metadata`, assettools, Code Connect-tools en `generate_figma_design` zichtbaar. `create_design_system_rules` staat niet in de aangeboden toollijst. Dat is een capabilitybevinding, geen uitgevoerde design- of publicatietest. Vraag bij uitvoering ook naar beschikbare prompts/resources; schrijf anders de regels zelf volgens stap 6.

## Stap 0 — Invoer en hervatpunt vastleggen

Benodigde invoer: expliciete stijlkeuze, doelbestand met edit access, werk-kopie, projectcommit, locale EN/NL en de eerstvolgende component/schermfamilie. Noteer het file key, page-/node-IDs en de laatste goedgekeurde stap in het werkverslag. Gebruik dezelfde werk-kopie bij hervatten; maak niet bij iedere poging een nieuw bestand.

```text
Lees docs/08-frontend.md, docs/09-design-brief.md en ADR 0018.
Controleer of de ontwikkelaar expliciet Harbor, Radar of Paper Fleet heeft gekozen.
Controleer de gekozen Figma-bestemming en rechten met de beschikbare read-tools.
Leg gekozen stijl, file key, werk-kopie en eerstvolgende stap vast.
Als alleen de stijl ontbreekt: presenteer de drie bestaande voorstellen ter keuze.
Als alleen rechten ontbreken: beschrijf de concrete ontbrekende seat/toegang.
Genereer pas na die keuze en toegang. Doe geen abonnementswijzigingen.
```

Dit is de expliciete keuzevoorwaarde uit de masterprompt, geen extra inhoudelijk akkoord bovenop een al gekozen stijl. De afzonderlijke fase-4-MCP-controle blijft onderdeel van de afgesproken projectvolgorde.

## Stap 1 — Projectscope, server en skills

Het voorbeeld uit de masterprompt is `codex mcp add figma --url https://mcp.figma.com/mcp`. De bij intake gecontroleerde CLI schrijft daarmee globale configuratie. Dit project vereist projectscope: bereid de Figma-entry later voor in `.codex/config.toml` met de andere zes vereiste servers, volgens document 16 en batch F. Voer het voorbeeldcommando daarom niet als projectsetup uit. De [intakebevinding](README.md#mcp-controle-bij-intake) bevat de bron en activatievolgorde. Authenticatie/secrets staan buiten Git; activeren en opnieuw testen gebeurt in fase 4.

Een MCP-verbinding installeert niet vanzelf Figma-skills. Haal de benodigde skills met hun relatieve referentiebestanden uit de officiële [Figma mcp-server-guide-repository](https://github.com/figma/mcp-server-guide). Controleer de actuele directorystructuur, herkomst en revisie; installeer alleen ontbrekende skills en behoud een werkende bestaande installatie. Leg versie/revisie en installatielocatie vast in de toolingnotities. In deze sessie zijn de benodigde Figma-skills al beschikbaar via de plugin; er is in D niets geïnstalleerd.

| Stap | Te lezen skill(s) vóór betreffende toolgebruik |
|---|---|
| Nieuw bestand, alleen indien nodig | `figma-create-new-file` |
| Canvas lezen/schrijven via JavaScript | `figma-use`, inclusief Plugin API-index en benodigde referentie |
| Tokens/componentfamilies | `figma-use` plus `figma-generate-library` |
| Schermen/composed UI | `figma-use` plus `figma-generate-design` |
| Implementatie uit designcontext | `figma-design-to-code` |
| Code Connect-templates | `figma-code-connect` |
| Native motion, indien gekozen | `figma-use-motion` naast de bovenstaande toepasselijke skills |

```text
Controleer de projectconfiguratie en remote Figma-verbinding volgens document 16.
Gebruik geen globale codex mcp add-write als vervanging voor projectscope.
Inventariseer de geïnstalleerde Figma-skills en vergelijk ontbrekende onderdelen
met figma/mcp-server-guide. Bewaar bij installeren ook hun referentiebestanden.
Rapporteer authenticatie, seat, file access, beschikbare tools/prompts en skillrevisie.
Voer de afgesproken read-only verificatie uit; maak nu alleen een werkbestand
als de designopdracht, gekozen stijl en bestemming dat al autoriseren.
```

## Stap 2 — Bestand en Foundations

Maak de pagina's `Foundations`, `Components`, `Screens`, `Prototype` en `Archive`. Inspecteer eerst bestaande inhoud en libraries; hergebruik passende assets. Laad `figma-use` en `figma-generate-library`; maak waar aangeboden één toolsession voor het bestand. Ieder script opereert in één expliciet ingestelde pagecontext en retourneert aangemaakte/gewijzigde IDs en relevante counts. Gebruik de actuele Plugin API-signaturen, top-level JavaScript en de door de skill gevraagde `skillNames`.

```text
Werk in de afgesproken Figma-kopie. Inspecteer eerst bestaande pages, libraries,
componenten, styles en variabelen; maak geen duplicaten van passende objecten.
Zorg voor Foundations, Components, Screens, Prototype en Archive.
Bouw alleen Foundations voor de expliciet gekozen stijl uit docs/09-design-brief.md:
ColorPrimitives, ColorSemantic, Spacing, Radius, Typography, Motion en Layout.
Gebruik de exacte namen/exportregels; bind semantic aliases aan primitives.
Controleer remote fontfamilies/styles en laad fonts vóór tekstbewerking.
Maak één compacte specimenweergave met contrastparen en typografische hiërarchie.
Retourneer IDs, bindings, ontbrekende mogelijkheden en een screenshot voor review.
```

Review namen, waarden, aliases, fontbeschikbaarheid en contrast. Veronderstel niet dat een geslaagde scriptcall een goed ontwerp bewijst. Pas gevonden fouten gericht aan. Een nieuwe screenshot is nodig na een zichtbare correctie, niet na iedere ongewijzigde inspectie.

## Stap 3 — Componentfamilies

Werk in samenhangende batches: basisbediening; Board/Cell/Ship; vloot/beurt/log; keuzeschermen/inzicht. Maak main components buiten de reviewframes en toon specimens als instances. Een afgekeurde component wordt eerst hersteld voordat schermen ervan afhangen.

```text
Lees de goedgekeurde Foundations en de componentinventaris in document 09.
Bouw de afgesproken volgende componentfamilie met figma-use en figma-generate-library.
Figma-componentnamen moeten exact gelijk zijn aan de geplande React-exportnamen.
Variant-properties gebruiken dezelfde propnamen en waarden; booleans blijven booleans.
Maak hover/focus/pressed-specimens zonder daarvoor fictieve publieke props te bedenken.
Bind kleuren, spacing, radius, text styles en relevante afmetingen aan tokens.
Toon vereiste states, lange Nederlandse tekst en keyboardfocus in een reviewframe.
Voor Cell: toon ook ambigu zinken bij rakende schepen; geen verborgen vlootonthulling.
Lever node-IDs, propertyoverzicht, bindings en screenshot voor review.
```

## Stap 4 — Schermen en prototype

Laad ook `figma-generate-design`. Bouw één schermfamilie met haar states op 390/768/1440 px voordat de volgende familie begint. Gebruik instances van de goedgekeurde bibliotheek, auto layout en vaste fixturedata. Normale layoutframes zijn toegestaan; duplicaten van componenten als losse vormen niet.

```text
Maak de volgende afgesproken schermfamilie uit de schermmatrix in document 09.
Gebruik uitsluitend de bestaande UI-componenten voor bediening en spelweergave;
plaats ze in auto-layoutcontainers en gebruik de vastgelegde tokens.
Maak alle genoemde states op 390, 768 en 1440 px, plus de vereiste NL-tekstreview.
Behoud labels, focusaanwijzingen, loading/error-herstel en niet-kleurgebonden uitkomsten.
Mobiel toont één bord tegelijk; onbekende vijandelijke posities blijven onbekend.
Link de relevante prototypeflow P-01 tot en met P-08 op de Prototype-pagina.
Lever per state de frame-ID en noteer welke browserinteracties alleen geannoteerd zijn.
Controleer screenshots op clipping, overlap, lange tekst en verkeerd hergebruik.
```

## Stap 5 — Assets en illustraties

Functionele iconen/boardvormen blijven schaalbare vectoren. Voeg alleen de in de gekozen richting bedoelde illustraties toe; zij zijn decoratief en dragen geen exclusieve informatie. Bestaande afbeeldingen/SVG-assets gaan via `upload_assets`; nieuwe rasterillustraties via `generate_image` wanneer die tool beschikbaar is. De [canvasdocumentatie](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/) beschrijft waarom `use_figma` hiervoor niet volstaat.

```text
Voeg alleen de goedgekeurde decoratieve assets voor de gekozen stijl toe.
Gebruik upload_assets voor bestaande bestanden en de beschikbare generate_image-tool
voor een afgesproken nieuwe rasterillustratie. Houd componenticonen als vectorassets.
Leg bron, rechten/licentie, doelnode, alt-/decoratief-beleid en exportnaam vast.
Plaats niets over coördinaten, focus, uitkomsten of interactieve targets.
Controleer het resultaat op de drie breedtes en bij reduced motion.
Lever de asset-/nodekoppelingen en een screenshot van de gewijzigde compositie.
```

## Stap 6 — Publicatie en design-system-regels

Bereid een concrete lijst goedgekeurde componenten en wijzigingen voor. Componenten worden handmatig in de Figma-teamlibrary gepubliceerd voordat Code Connect kan worden afgerond; publiceer geen afgekeurde specimens of Archive-inhoud. Als rechten/publicatie ontbreken blijft de mappingtabel bruikbaar, en vermeld het ontbrekende bewijs zonder een koppeling te claimen.

Gebruik de aangeboden `create_design_system_rules`-prompt als de client die ondersteunt; anders schrijf dezelfde projectregels zelf. De latere bestemming is `docs/design-system-rules.md`: pas bij M3 aanmaken, met metadata en links naar deze broncontracten. Dat bestand beschrijft tokens, componentimports, foldergrenzen, assetgebruik, a11y en het mappingregister; het wordt geen tweede bron voor spelregels.

```text
Maak de goedgekeurde componentpublicatie concreet: welke main components, varianten,
IDs en wijzigingen komen in de teamlibrary? Controleer de handmatige publicatiestatus.
Gebruik create_design_system_rules als beschikbare MCP-prompt/tool; verzin geen call
wanneer de client hem niet aanbiedt. Schrijf dan zelf de equivalente regels.
Sla ze tijdens M3 op in docs/design-system-rules.md, aansluitend op documenten 04/08/09.
Neem op: packages/ui voor presentatie, apps/web voor containers, semantic tokens,
exacte component-/propnamen, eigen-origin assets en verplichte a11y-/visuele controle.
Rapporteer apart wat voorbereid, gepubliceerd en werkelijk geverifieerd is.
```

## Stap 7 — Eén component implementeren

Deze stap hoort bij een goedgekeurde bouwtaak, niet bij de huidige documentatieopdracht. Laad `figma-design-to-code`; inspecteer bestaande code/components vóór edits. Vraag `get_design_context` voor de concrete node met React/TypeScript als doel en met screenshot. Gebruik `get_variable_defs` voor echte tokens. Bij ontbrekende screenshot volgt `get_screenshot`; bij sparse context worden relevante child nodes opgevraagd. `get_metadata` helpt alleen om structuur/IDs te vinden en vervangt geen high-fidelity context.

```text
Implementeer uitsluitend de component van deze bouwtaak uit de opgegeven Figma-node.
Lees eerst de bestaande package-exports, tokens, styles, componenten en mappings.
Laad figma-design-to-code en vraag get_design_context met screenshot; haal variable defs op.
Als context sparse is: bepaal via de hiërarchie en screenshot de zichtbare child nodes
en vraag daarvoor volledige context op. Gebruik get_metadata alleen om IDs te vinden.
Pas de output aan strict TypeScript, React, Tailwind en onze packagegrenzen aan.
Gebruik bestaande componenten en semantic tokens, geen hardcoded kleuren/afstanden.
Behoud interacties, semantiek, i18n-keys en focusgedrag uit document 08.
Download benodigde assets volgens de toolinstructies naar de repo; geen tijdelijke
Figma-URL in productie en geen designscreenshot als componentachtergrond.
Rapporteer implementatie, gerichte controles en concrete afwijkingen.
```

## Stap 8 — Code Connect of mappingfallback

Controleer de huidige Code Connect-features voor het account en de gepubliceerde component. De officiële [integratiepagina](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/) beschrijft plan-/frameworkbeperkingen. De geïnstalleerde skill kan oudere planinformatie bevatten; actuele documentatie en de echte toolrespons zijn leidend voor beschikbaarheid. De skill bepaalt het formaat voor een gekozen templateworkflow: `.figma.ts` met `figma.code`, niet ongemerkt het aparte parserformaat `.figma.tsx`.

```text
Controleer of de goedgekeurde main component gepubliceerd en toegankelijk is.
Lees de actuele figma-code-connect-skill en plan-/toolmogelijkheden.
Gebruik get_code_connect_suggestions en get_context_for_code_connect waar beschikbaar;
controleer de match op exportnaam, bestand, props en geneste instances.
Maak alleen mappings voor de concrete gereviewde implementatie.
Gebruik het aangeboden mappingmechanisme of het voorgeschreven .figma.ts-templateformaat.
Controleer daarna met get_code_connect_map of de koppeling werkelijk teruggelezen wordt.
Als deze feature ontbreekt: vul het register hieronder met dezelfde namen en props in,
vermeld de beperking en controleer de mapping handmatig. Verzin geen remote succes.
```

### Mappingregister

Dit is het versioneerbare fallbackregister. De codepaden zijn **geplande** paden; er bestaan nog geen componenten of Figma-node-IDs. Vul tijdens M3 per rij de echte node-link/ID, propspecificatie, implementatiecommit, status van Code Connect en datum van visuele verificatie in. Bij een andere feitelijke mappenstructuur wordt de rij bijgewerkt; de exportnaam blijft het contract.

| Figma / React-export | Gepland codepad | Node/mapping/status |
|---|---|---|
| Button | `packages/ui/src/components/Button.tsx` | Nog niet gebouwd |
| IconButton | `packages/ui/src/components/IconButton.tsx` | Nog niet gebouwd |
| Toggle | `packages/ui/src/components/Toggle.tsx` | Nog niet gebouwd |
| SegmentedControl | `packages/ui/src/components/SegmentedControl.tsx` | Nog niet gebouwd |
| Card | `packages/ui/src/components/Card.tsx` | Nog niet gebouwd |
| Badge | `packages/ui/src/components/Badge.tsx` | Nog niet gebouwd |
| Dialog | `packages/ui/src/components/Dialog.tsx` | Nog niet gebouwd |
| Toast | `packages/ui/src/components/Toast.tsx` | Nog niet gebouwd |
| Tooltip | `packages/ui/src/components/Tooltip.tsx` | Nog niet gebouwd |
| Board | `packages/ui/src/components/Board.tsx` | Nog niet gebouwd |
| Cell | `packages/ui/src/components/Cell.tsx` | Nog niet gebouwd |
| Ship | `packages/ui/src/components/Ship.tsx` | Nog niet gebouwd |
| FleetStatus | `packages/ui/src/components/FleetStatus.tsx` | Nog niet gebouwd |
| TurnIndicator | `packages/ui/src/components/TurnIndicator.tsx` | Nog niet gebouwd |
| ShotLog | `packages/ui/src/components/ShotLog.tsx` | Nog niet gebouwd |
| StatTile | `packages/ui/src/components/StatTile.tsx` | Nog niet gebouwd |
| HeatmapOverlay | `packages/ui/src/components/HeatmapOverlay.tsx` | Nog niet gebouwd |
| RuleSetPicker | `packages/ui/src/components/RuleSetPicker.tsx` | Nog niet gebouwd |
| DifficultyPicker | `packages/ui/src/components/DifficultyPicker.tsx` | Nog niet gebouwd |

Props en waarden staan normatief in 09; het register verwijst daarnaar en noteert alleen implementatieafwijkingen die nog moeten worden opgelost. Een screenshot zonder node-/commitreferentie geldt niet als geverifieerde koppeling.

## Stap 9 — Browser naast Figma controleren

Gebruik Playwright MCP voor de gerichte visuele/interactionele review, met de daarvoor beschikbare skill. De vaste regressietests komen als code in de latere testsuite uit document 12. Leg viewport, device scale, locale, font-loadstatus, fixture en reduced-motionstand vast, zodat verschillen te beoordelen zijn.

```text
Open de gebouwde component/schermfixture met Playwright MCP op dezelfde breedte,
locale en state als de gekoppelde Figma-node. Wacht op fonts en stabiele layout.
Maak een browserscreenshot en vergelijk die naast get_screenshot uit Figma.
Controleer structuur, spacing, typografie, iconen, assetgeometrie en alle relevante states.
Test ook keyboardfocus, labels, pointerbediening en de tekstuele heatmap/uitleg.
Herstel in-scope verschillen; verander niet ongemerkt andere schermen.
Leg de node-ID, implementatiecommit, beide screenshots en resterende beperkingen vast.
Een visuele overeenkomst vervangt geen engine-, a11y- of performancetest.
```

## Stap 10 — Optioneel terug naar Figma

Als `generate_figma_design` aanwezig is en een werkende UI-capture ondersteunt, kan een afgesproken pagina/fixture naar de bestaande werk-kopie worden gebracht voor vergelijking. Controleer eerst de huidige toolbeschrijving en relevante skill; deze mogelijkheid is optioneel. Een capture vervangt de componentbibliotheek en tokenbindings niet.

```text
Gebruik alleen indien beschikbaar generate_figma_design voor de afgesproken gebouwde UI.
Plaats de capture in een benoemde reviewsectie van hetzelfde werkbestand.
Bewaar de goedgekeurde componentframes en mappings; overschrijf ze niet met capturelagen.
Noteer URL, commit, locale, viewport en verschilpunten ten opzichte van het design.
Als de tool niet beschikbaar is: gebruik de browserscreenshot naast het design.
```

## Hervatten en afronden

Bij een rate limit: bewaar de afgeronde IDs/laatste review en wacht volgens de serverrespons; geen herhaalde blinde pogingen. Bij timeout: lees de bestaande objecten terug voordat een mogelijk al uitgevoerde mutatie opnieuw wordt verstuurd. Werkstappen zijn herkenbaar aan page-/componentnamen en teruggegeven IDs.

Een stap is klaar als de afgesproken inventory bestaat, de relevante bindings/props kloppen, de laatste zichtbare controle geen onopgeloste in-scope afwijking heeft en beperkingen expliciet staan genoteerd. Publicatie, mapping en implementatie krijgen elk hun eigen bewijs. Deze batch heeft alleen dit playbook, de brief en het mappingregister voorbereid; geen van die latere uitvoerstappen is als uitgevoerd geregistreerd.
