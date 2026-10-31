Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Leeswijzer](README.md), [spelregels](02-game-rules.md), [user stories](03-user-stories.md), [begrippen](glossary.md), [masterprompt](00-masterprompt.md)

# Productvisie en scope

## Doel en doelgroep

SinkTheShip is Zeeslag in de browser op `sinktheship.com`. Het project laat de ontwikkelaar hands-on leren hoe een neural network wordt getraind, geëvalueerd en geïntegreerd in een webapp. Het spel levert een controleerbaar probleem met verborgen informatie; het neural network is het leerdoel.

De speler wil zonder installatie een begrijpelijk potje tegen de computer spelen. De ontwikkelaar wil alle wijzigingen kunnen reviewen, experimenten kunnen herhalen en later zonder AI uitbreidingen kunnen maken. De AI-coding-agent krijgt daarvoor kleine taken met expliciete contracten, acceptatiecriteria en reviewpunten.

Succes wordt aangetoond met uitvoerbare tests, benchmarks en zelfstandig uitgevoerde uitbreidingsstappen. Populariteit, advertentie-inkomsten en aantallen spelers zijn geen v1-doelen; de app verzamelt geen gebruiksanalytics.

## Releases en grenzen

| Release | Verplicht resultaat | Buiten deze release |
|---|---|---|
| MVP na M4 | Volledige speelcyclus met Easy, Normal en Hard, alle vier regelcombinaties, plaatsing, hervatten en de basis voor i18n/toegankelijkheid | Neural tegenstander nog niet als speelbaar aanbieden; het scherm mag de toekomstige beschikbaarheid uitleggen |
| v1.0 na M6 | Alle Must-eisen, inclusief een gevalideerd Impossible-model voor ten minste Klassiek; kwaliteits- en benchmarkvoorwaarden gehaald | Geen online wedstrijden, chat of leaderboards |
| Latere releases | Eerst private match en quick play; verdere productkeuzes krijgen eigen stories en ADR's | Geen multiplayer-implementatie in de v1-backlog |

Gebruikersaccounts worden in v1 en de eerstvolgende releases niet gebouwd of gebruikt. Dit is een bewuste keuze voor nu; accounts kunnen in een latere release worden toegevoegd.

V1 gebruikt een lokaal opgeslagen anonieme gast-ID via `IdentityProvider`; er is geen profiel, e-mailadres of andere persoonsinvoer. De ID wordt niet naar een speldienst gestuurd. [ADR 0009](adr/0009-anonymous-identity.md) legt de keuze en uitbreidbaarheid vast.

Kernflow: Home → regels kiezen → moeilijkheid kiezen → schepen plaatsen → spelen → einde → rematch of instellingen wijzigen. V1 is een statische React/Vite/TypeScript/Tailwind-app. De engine is een afzonderlijke dependencyvrije package; modellen worden in de browser uitgevoerd. De documentatie- en externe setupopdracht bouwt deze app nog niet.

## Prioritering

| MoSCoW | V1-inhoud |
|---|---|
| Must | Vier niveaus binnen hun compatibiliteit; regelkeuze; geldige vlootplaatsing met muis, touch en toetsenbord; rotatie, willekeurig plaatsen en reset; spelregels en AI-uitleg; taal-, geluid- en animatievoorkeuren; hervatten; responsive en toegankelijke UI; foutafhandeling voor model en opslag; reproduceerbare ML-pipeline en benchmark |
| Should | Animaties en geluid; statistieken per potje; AI-inzicht voor Hard en Impossible |
| Could | Lokale statistiekgeschiedenis, PWA/offline spelen en dark mode |
| Won't voor v1 | Multiplayer, chat, leaderboards en slimme vlootplaatsing per niveau. Voor de accountkeuze geldt de formulering hierboven. |

Instellingen voor geluid en animatie zijn Must; de effecten zelf zijn Should. Zolang effecten ontbreken, zijn hun instellingen zichtbaar met een uitleg en niet bedienbaar. Reduced motion en mute worden altijd gerespecteerd zodra effecten aanwezig zijn. Een Should die niet meegaat vraagt een expliciete reviewbeslissing en vermelding bij de release; een Could is geen v1-releasevoorwaarde.

## Functionele requirements

De IDs blijven stabiel. Een verwijderde eis behoudt zijn ID in de wijzigingshistorie. De [traceerbaarheidsmatrix](README.md#traceerbaarheid) koppelt iedere eis aan stories, geplande acceptatietests en later taken. Een eis hieronder is een norm voor de te bouwen software, geen claim dat zij al is gerealiseerd.

| ID | Prioriteit | Toetsbare eis |
|---|---|---|
| FR-01 | Must | De speler kan vanaf Home via regelkeuze, niveaukeuze en vlootplaatsing een lokale wedstrijd starten en een winst- of verliesresultaat bereiken. |
| FR-02 | Must | De speler kan Klassiek, Nog eens bij raak, Ruimte tussen schepen of Aangepast kiezen; Aangepast levert exact de vier combinaties uit document 02. |
| FR-03 | Must | Regels en plaatsingen worden runtime gevalideerd; een afgewezen actie verandert geen geaccepteerde spelstate. Tijdens een begonnen wedstrijd blijven de regels vast. |
| FR-04 | Must | Easy, Normal, Hard en Impossible zijn herkenbaar; de eerste drie ondersteunen elke geldige regelset van het enginecontract. Impossible is alleen selecteerbaar bij een gevalideerd compatibel modelmanifest. |
| FR-05 | Must | De speler kan ieder schip met muis of touch plaatsen, verplaatsen en roteren, zowel via slepen als via selecteren en klikken/tikken, met feedback bij ongeldige plaatsing. |
| FR-06 | Must | De volledige plaatsings- en schietflow is met uitsluitend toetsenbord te bedienen, inclusief roteren, herstellen van fouten en starten van een rematch. |
| FR-07 | Must | Willekeurig plaatsen vult een volledige geldige vloot volgens dezelfde uniforme verdeling als bij de computer; reset verwijdert de conceptplaatsing zonder de regels te wijzigen. |
| FR-08 | Must | De engine handhaaft beurtvolgorde, extra schot bij raak, unieke schoten, treffer-/zinkuitkomsten en onmiddellijke winst bij het laatste gezonken schip. |
| FR-09 | Must | Tegenstanders en UI ontvangen alleen de voor die speler toegestane informatie; AI-inzicht mag geen verborgen schepen of seeds onthullen. |
| FR-10 | Must | Een refresh herstelt de laatst succesvol opgeslagen conceptplaatsing of wedstrijd, inclusief regels, RNG-toestand, beurt en niveau; ongeldige of te nieuwe data geeft een herstelkeuze. |
| FR-11 | Must | Na afloop kan de speler een rematch met dezelfde regels en hetzelfde niveau starten, of terug naar de instellingen; het vorige resultaat wordt niet als lopende wedstrijd hergebruikt. |
| FR-12 | Must | Er zijn pagina's voor de actuele spelregels en Hoe werkt de AI?, met uitleg per niveau, modelbeperkingen en de boodschap dat ook Impossible te verslaan is. |
| FR-13 | Must | Alle gebruikersgerichte teksten zijn beschikbaar in Engels en Nederlands; Engels is de eerste standaard, een opgeslagen taalkeuze gaat voor en wisselen reset geen wedstrijd. |
| FR-14 | Must | Instellingen voor taal, geluid en animaties zijn bereikbaar en lokaal opgeslagen; ontbrekende Should-effecten worden als niet beschikbaar uitgelegd. |
| FR-15 | Must | Neural runtime en model laden pas bij selectie van Impossible; de UI toont laadstatus en fouten en biedt Hard alleen aan als expliciete keuze, zonder stille fallback. |
| FR-16 | Must | De gereserveerde routes `/multiplayer` en `/r/:roomKey` tonen in v1 een binnenkort-pagina, inclusief terugweg, zonder matchmaking of netwerkverbinding voor een spel te starten. |
| FR-17 | Must | Een lokaal spel gebruikt een anonieme gastidentiteit achter een vervangbare `IdentityProvider`; verlies van de gast-ID verhindert het starten van een nieuw spel niet. |
| FR-18 | Should | De eindpagina toont per speler geldige schoten, treffers, missers, gezonken schepen en trefpercentage; nul schoten veroorzaakt geen deling door nul. |
| FR-19 | Should | Geluid en animaties ondersteunen speluitkomsten zonder essentiële informatie exclusief via geluid of beweging over te brengen; instellingen worden direct toegepast. |
| FR-20 | Should | AI-inzicht toont na het spel bij Hard kansdichtheid en bij Impossible modeloutput, met legenda en betekenis; het gebruikt de observatie vóór de betreffende schotkeuze. |
| FR-21 | Must | De ontwikkelaar kan met vastgelegde configs en seeds datasetgeneratie, training, evaluatie, export en publicatie afzonderlijk starten; een baseline is op CPU trainbaar en logging werkt offline. |
| FR-22 | Must | De benchmark vergelijkt niveaus en modelversies op dezelfde evaluatieopstellingen, beurtvarianten en seedplanning; modelpromotie vereist vastgelegde prestatie- en pariteitsresultaten. |
| FR-23 | Could | De speler kan lokaal eerdere resultaten bekijken en die geschiedenis verwijderen, zonder netwerkopslag. |
| FR-24 | Could | Na expliciete offline-ondersteuning kan de eerder geladen app zonder netwerk een potje spelen; een ontbrekend model krijgt een uitleg. |
| FR-25 | Could | Een optionele dark mode behoudt leesbaarheid, betekenis van celstates en alle toegankelijkheidscriteria. |

## Niet-functionele requirements

| ID | Norm en verificatie |
|---|---|
| NFR-01 | Modulariteit: nieuwe tegenstander maximaal één module plus één registratie en tests; nieuwe preset één config-object plus vertalingen; nieuw model alleen een modelmap inclusief manifest/modelkaart; nieuwe taal één vertaalbestand; nieuw scherm één route-module plus registratie. Later kan online spelen via adapters en transport worden aangesloten zonder wijzigingen aan engine of presentational components. Een uitbreidingsproef controleert dit. |
| NFR-02 | Dezelfde engineversie, regels, beginsituatie, RNG-versie/-toestand en commandvolgorde leveren identieke state en events. Core gebruikt geen DOM, timers, ambient state of `Math.random()`. |
| NFR-03 | Geen verborgen vloot, geheime schipkoppelingen of plaatsingsseeds in een tegenstanderview of publieke events. Views met identieke publieke geschiedenis zijn gelijk ongeacht nog onbekende plaatsingen; tests bewaken de grens. Lokale browserinspectie door de eigenaar valt buiten deze afscherming. |
| NFR-04 | WCAG 2.2 AA voor alle v1-flows; toetsenbord, focusbeheer, screenreader-uitkomsten en niet-kleurgebonden celstates worden handmatig geverifieerd. Bordcellen zijn minimaal 24 × 24 CSS-pixels; overige primaire bediening minimaal 44 × 44. Een automatische accessibilityscore vervangt deze controles niet. |
| NFR-05 | Alle Must-flows werken vanaf 320 CSS-pixels viewportbreedte, met één bord tegelijk waar nodig, en op 390/768/1440-pixelontwerpen. Releasecontrole op de actuele en vorige stabiele Chrome, Edge, Firefox en Safari, inclusief Safari op iOS en Chrome op Android; leg de geteste versies vast bij de release. |
| NFR-06 | Startbudget: initiële gecomprimeerde JS maximaal 200 KiB gzip, exclusief pas later geladen neural runtime/model; Lighthouse Performance minimaal 90 en Accessibility 100 op het vast te leggen mobiele meetprofiel. Animaties richten zich op 60 fps met p95 framewerk ≤16,7 ms op het referentietoestel; meetmethode en profielen worden in batch E vastgesteld. |
| NFR-07 | Startdoelen voor het model: maximaal 1.000.000 bytes ONNX en p95 inferentie ≤50 ms in een Worker op een vastgelegde gemiddelde telefoon; rapporteer cold load afzonderlijk. Afwijkingen vragen een onderbouwde ADR en akkoord. |
| NFR-08 | Geen app-analytics, tracking of cookies van derden; gast-ID, spelstate en voorkeuren blijven lokaal. Geen W&B-client of trainingsdataupload vanuit de spelapp; modellen, fonts en geluid worden van eigen origin geladen. Hostingconfiguratie krijgt een aparte netwerk-/headercontrole. |
| NFR-09 | Snapshots hebben schemaversie en validatie; corrupte, incompatibele of niet-opslagbare data veroorzaakt geen crash of stilzwijgend verlies. Na iedere bevestigde actie wordt opgeslagen; een opslagfout wordt zichtbaar en hervatten garandeert alleen de laatst succesvol bewaarde toestand. |
| NFR-10 | Productie gebruikt HTTPS en een vastgelegde CSP, behandelt snapshots, URL-waarden en manifests als onbetrouwbare invoer en bevat geen dev-only cheat-/seedbediening. Geen secrets in repository of clientbundle; securitychecks maken deel uit van de releasecontrole. |
| NFR-11 | TypeScript en Python doorstaan dezelfde regel- en encodingfixtures. Het model passeert PyTorch/ONNX Python/ONNX TypeScript-pariteit binnen vooraf vastgelegde toleranties; die numerieke toleranties worden in batch C gespecificeerd. |
| NFR-12 | De benchmark toont de volgorde Easy < Normal < Hard en, waar compatibel, Hard < Impossible met vooraf gekozen 95%-intervalmethode. Voor Impossible geldt als startdoel ≥55% head-to-head-winst over ≥10.000 wedstrijden én een lager gemiddeld schotenaantal met 95%-interval voor het verschil onder nul. Dataset-splits en evaluatieseeds zijn gescheiden van training en modelselectie. |
| NFR-13 | Iedere package heeft een publieke `index.ts`, README met doel/API/voorbeeld/uitbreiden en eigen tests. Geen deep imports; documentatie en publieke API veranderen samen; de ontwikkelaar kan de beschreven uitbreidingsproeven uitvoeren zonder AI. |
| NFR-14 | Iedere bouwtaak heeft een reviewbare diff, issue, PR, relevante checks en reviewsamenvatting. GitHub Projects is de enige taakstatusbron; de repo specificeert en Notion verwijst. Verplichte MCP-momenten, één actieve taak en herstel bij serveruitval worden in `AGENTS.md` uitgewerkt. |

De waarden bij NFR-06 en NFR-07 zijn voorgestelde startbudgetten, geen meetresultaten. NFR-06 krijgt zijn definitieve meetprotocol en ADR in batch E; NFR-07 komt uit de masterprompt. Het referentietoestel en de profielkeuze staan als open punt in de [leeswijzer](README.md#centrale-open-punten). Een wijziging van een budget is zichtbaar en vereist review.

De norm voor niet-slepende pointerbediening en de 24-pixelgrens zijn gecontroleerd in de W3C-uitleg voor [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) en [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). De algemene norm is [WCAG 2.2](https://www.w3.org/TR/WCAG22/); 44 pixels voor primaire bediening is een eigen projectkeuze.

## Releaseacceptatie en leerresultaat

MVP en v1.0 krijgen elk een volledig doorlopen kernflow in beide talen en met toetsenbord, muis en touch. Alle voor die release geldende Must-eisen en NFR's moeten een geslaagde verificatie hebben; geen Must mag als Should worden behandeld omdat de implementatie lastig blijkt. In de MVP is FR-04 beperkt tot spelen tegen Easy–Hard; voor Impossible geldt alleen de eerlijke beschikbaarheidsmelding. Het daadwerkelijk laden/infereren uit FR-15, de neural onderdelen van FR-21/FR-22 en NFR-07/NFR-11 voor het geëxporteerde model zijn voorwaarden voor v1.0. Easy–Hard-benchmarks blijven voor de MVP verplicht. De ML-pipeline mag parallel al beschikbaar zijn.

Voor v1.0 geldt het volledige ML-criterium. Als het model Hard nog niet overtuigend verslaat, blijft de MVP bruikbaar maar is v1.0 niet geaccepteerd. Hertraining, een ander model of een onderbouwde wijziging van het startdoel wordt dan afzonderlijk gereviewd.

Het leerresultaat wordt getoetst door een menselijk experiment: een trainingsparameter aanpassen, opnieuw trainen/exporteren en het resultaat vergelijken met de benchmark. Daarnaast voegt de ontwikkelaar met de uitbreidingsgids een tegenstander of taal toe. De diff moet de modulariteitsgrenzen respecteren; een niet-uitvoerbare gids wordt gecorrigeerd vóór de taak gereed is.

## Besluiten en nog te schrijven verdieping

De productkeuzes staan in [ADR 0006](adr/0006-configurable-rules.md), [0007](adr/0007-four-difficulties.md), [0008](adr/0008-multiplayer-later.md), [0009](adr/0009-anonymous-identity.md), [0011](adr/0011-repo-and-handbook.md), [0014](adr/0014-document-and-code-language.md), [0015](adr/0015-ui-languages.md), [0017](adr/0017-v1-privacy.md) en [0019](adr/0019-project-name.md). Fase 1 keurde de hoofdlijnen goed; deze uitwerking is met batch A goedgekeurd op 2026-10-31.

Architectuur, algoritmen, ML, UI, ontwerp, kwaliteit en backlog volgen in batches B–F volgens de leeswijzer. Daar worden de hier genoemde normen verfijnd, niet stilzwijgend gewijzigd.
