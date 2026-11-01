Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Werkinstructies](../../AGENTS.md), [roadmap](../13-roadmap.md), [backlog](../14-backlog.md), [kwaliteit](../12-quality-testing.md), [uitbreiden](../15-extension-guides.md), [ADR 0012](0012-github-projects.md)

# ADR 0050 — Eén taak, één reviewbare wijziging en aantoonbare overdracht

## Besluitbasis

De taak-lifecycle, menselijke review, reviewsamenvatting en één actieve taak zijn vastgelegd in de masterprompt. Batch F maakt de grenzen tussen documentatiefasen, implementatie, experimenten en releasebewijs expliciet.

Deze uitwerking is met batch F goedgekeurd op 2026-11-01.

## Context

Het leerdoel vraagt dat de ontwikkelaar iedere wijziging kan begrijpen en later zonder AI kan uitbreiden. Meerdere gelijktijdige bouwtaken, ongedocumenteerde experimenten en een grote einddiff verhinderen dat. Tegelijk kan het ML-spoor inhoudelijk eerder beginnen dan de definitieve UI.

## Besluit

Volg [AGENTS.md](../../AGENTS.md) als compacte werkinstructie. Iedere bouwtaak heeft een stabiele repo-definitie, issue, eigen branch, afgebakende scope en PR met reviewbewijs. De ontwikkelaar reviewt vóór merge; feedback wordt in dezelfde PR verwerkt. In progress/Review gaat vóór nieuw Ready-werk. Er is maximaal één actieve taak, ook wanneer de dependencygrafiek meerdere onafhankelijke sporen toelaat.

De [backlog](../14-backlog.md) bevat 59 reviewbare taken met doel, docs/US-links, scope in/uit, acceptatiecriteria, dependencies, grootte, testaanpak, reviewfocus en later het issuenummer. De [kwaliteitsspecificatie](../12-quality-testing.md) levert de gedeelde DoD; iedere codewijziging documenteert haar eigen publieke API. De aparte README-audit en menselijke uitbreidingsproeven vervangen die dagelijkse plicht niet.

De reviewsamenvatting vermeldt resultaat en reden met doc-/ADR-link, uitgevoerde checks en uitkomsten, handmatige verificatie, gerichte reviewfocus en concrete repo-/bord-/Notion-updates. Gemiste tests, MCP-acties of menselijke proeven worden expliciet genoemd en nooit als geslaagd geboekt. Geen nieuwe dependency of stilzwijgende contractafwijking zonder ADR en review. Nieuw werk krijgt een nieuwe taakdefinitie en Backlog-issue; een nieuwe taak oppakken vraagt de normale Ready-selectie.

Een ML-experiment bewaart config, seeds, versies en artefacten; W&B bevat runinformatie en Notion vraag/aanpak/resultaat/runlink. Offline logging uit 07 blijft geldig met een lokale runreferentie en expliciet nog te synchroniseren verslag. Een onvoltooide externe update is zichtbaar; promotie vereist alle bewijsstukken. Een negatief experiment levert leerwaarde maar sluit geen prestatie-eis af.

Na iedere mijlpaal/release worden roadmap en Notion-release notes bijgewerkt en het bord opgeschoond. T33 controleert de MVP inclusief a11y/i18n en de dan beschikbare uitbreidingspunten. T50–T52 en T56 leveren de volledige menselijke uitbreidings-/overdrachtproef voor v1.0. Meetresultaten blijven gekoppeld aan de werkelijk geteste release- en modelversie.

De huidige documentatieopdracht gebruikt haar eigen goedgekeurde batch-/fasevolgorde: geen issue/PR of appchecks vereist vóór een bord en app bestaan. Batch F levert een uitgeschakelde projectconfig; fase 4 activeert en verifieert alle zeven servers. De expliciete fase-4-stop bij een mislukte servercontrole gaat vóór de dagelijkse mogelijkheid om lokaal verder te werken.

## Onderbouwing en alternatieven

Eén grote implementatie zonder tussentijdse review verkleint de leerbaarheid en maakt verkeerde aannames duurder. Tegelijk actief bouwen aan UI en ML kan sneller lijken, maar verspreidt reviewaandacht en bemoeilijkt terugdraaien. Daarom is het ML-spoor parallel planbaar, terwijl de uitvoering afwisselt tussen voltooide, afzonderlijk gereviewde taken.

Alle verificatie pas aan het einde doen zou foutieve regels, verborgen informatie of datasetlekkage te laat ontdekken. Per-taakchecks plus afzonderlijke releasekwalificatie geven eerder bewijs en houden de uiteindelijke gebruiksflow toetsbaar. Verplichte omvangrijke nieuwe tests voor een kleine zuivere documentcorrectie zijn niet nodig; relevantie volgt uit 12.

## Gevolgen

Wachten op review kan de start van nieuw werk beperken; dat is onderdeel van het leerproces. Als een taak te groot blijkt, volgt een zichtbare splitsing met nieuwe IDs en aangepaste afhankelijkheden. Een performance-/promotiefout blijft een echte blokkade voor de betreffende release; criteria worden niet aangepast om een taak alsnog groen te maken.

De agent kan taakgerelateerde issuecomments, PR's, handboekupdates en experimentverslagen uitvoeren binnen deze expliciet afgesproken workflow. Andere externe berichten of publicaties volgen niet automatisch uit die bevoegdheid. Secrets en persoonlijke instellingen blijven buiten de repository.

## Verificatie

AT-20-01/02/03 en AT-24-01/02/03: taakvelden, acyclische afhankelijkheden, volledige traceerbaarheid, kleine reviewbare diffs en teruggelezen externe updates. Verifieer later met echte PR's en door de ontwikkelaar uitgevoerde EXT-proeven. De huidige controle beoordeelt de documentdefinities, geen gerealiseerde applicatiekwaliteit.
