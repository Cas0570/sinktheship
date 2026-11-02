Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Masterprompt](../00-masterprompt.md), [backlog](../14-backlog.md), [werkinstructies](../../AGENTS.md), [tooling](../16-tooling-mcp.md), [ADR 0011](0011-repo-and-handbook.md)

# ADR 0012 — GitHub Projects als enige taakstatusbron

## Besluitbasis

GitHub Projects, de statussen en verplichte velden volgen uit de masterprompt. De inrichting, koppeling aan taakdefinities en controle op ingebouwde workflows worden hier voor batch F uitgewerkt. Externe inrichting volgt pas in fase 4; het [uitvoeringsverslag](../16-tooling-mcp.md#externe-inrichting-2026-11-02) bevat de daadwerkelijke resultaten.

Deze uitwerking is met batch F goedgekeurd op 2026-11-01.

## Context

De repo moet exact beschrijven wat een taak oplevert; het bord moet tonen welk werk uitvoerbaar is en wie op review wacht. Dubbele statusregistratie in Markdown, Notion en Projects zou snel uiteenlopen. Een PR-merge is bovendien alleen bruikbaar als de koppeling naar het issue en de daadwerkelijke bordupdate kloppen.

## Besluit

Gebruik één Projects-bord met issues als primaire taakkaarten. Iedere taak krijgt één stabiel T-ID en één repo-definitie; het issue bevat een korte samenvatting en link naar die definitie. Het issue-/PR-gesprek bevat blockers, review en uitvoeringsbewijs, zonder de volledige acceptatiecriteria te dupliceren.

| Veld | Inrichting |
|---|---|
| Title | `T14 · Hard met probability density`; ID blijft gelijk bij titelverfijning |
| Status | Single select: Backlog, Ready, In progress, Review, Done, Blocked; boardkolommen op dit veld |
| Milestone | Native issue-mijlpaal M0, M1, M2, M3, M4, M5 of M6; Projects toont ditzelfde veld |
| Work type | Project single select voor het taaktype: feature, ML, design, infra, docs |
| Size | Project single select: S, M, L; L vóór uitvoering splitsen tot reviewbare taken |
| Labels | `type:feature`, `type:ml`, `type:design`, `type:infra`, `type:docs`; daarnaast `priority:must`, `priority:should`, `priority:could` voor de releaseprioriteit |

**Naamcorrectie bij inrichting (2026-11-02):** GitHub weigert een eigen single-selectveld `Type` met `Name cannot have a reserved value, Name has already been taken`. Het bedoelde taaktypeveld heet daarom `Work type`. Dit wijzigt alleen de veldnaam; de vijf waarden, labels en taakdefinities blijven behouden. Het native GitHub-issuetype vervangt dit projectveld niet.

Type-label en Work type-veld beschrijven dezelfde metadata. Maak geen labels voor taakstatus. T44–T47 krijgen priority:should, T57–T59 priority:could, de overige initiële taken priority:must. Should betekent niet dat de geplande afhankelijkheden zonder review vervallen. Toon een boardview per Status en een tabelview met Milestone/Work type/Size; gebruik filters in plaats van een tweede bord.

Alle 59 taken worden in fase 4 issues. Zoek vóór aanmaken op T-ID en repository en lees bestaande matches om duplicaten bij hervatten te voorkomen. Verwerk de teruggelezen issuenummers en URL's in de backlog. Begin met alle items in Backlog; zet T01 bovenaan Ready zodra de fase-4-inrichting klaar is. Andere taken worden Ready na controle van dependencies, externe voorwaarden en ontwikkelaarsprioriteit. Ready-volgorde bepaalt de keuze; automatisch vrijgeven op basis van alleen een taaknummer is niet toegestaan.

PR's richten zich op de default branch en gebruiken `Closes #<issue>`. GitHub interpreteert de closing keywords voor die doelbranch; een merge naar een andere branch is geen bewijs dat het issue automatisch sluit. Zie de [officiële koppeldocumentatie](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), via Context7 geraadpleegd op 2026-11-01.

Controleer in fase 4 de ingebouwde workflows voor **Item closed → Done** en **Pull request merged → Done**. GitHub beschrijft deze als standaard ingeschakeld, maar de werkelijke projectinstelling blijft te verifiëren. Issues die via de PR sluiten gaan door de eerste workflow naar Done; een eventuele PR-kaart volgt de tweede. PR-kaarten zijn geen extra bouwtaak. Laat de omgekeerde workflow die issues sluit bij een handmatige statuswijziging uit, zodat een kaart verplaatsen geen review of merge vervangt. Bron: [ingebouwde Projects-automatisering](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations), gecontroleerd op 2026-11-01.

GitHub MCP is de eerste route voor inrichting en teruglezen; gebruik alleen voor ontbrekende mogelijkheden de afgesproken `gh`-fallback. Als workflowconfiguratie daarmee niet beschikbaar is, vraagt fase 4 de ontwikkelaar exact deze twee workflows via de Projects-UI te controleren/activeren en het resultaat terug te melden. Alleen toolbeschikbaarheid of een aanname over defaults is geen verificatie. Voer geen proefmerge of fictief afgeronde producttaak uit om een groen bord te krijgen; controleer het eerste echte merge-event opnieuw tijdens M0.

## Onderbouwing en alternatieven

Een Markdown-checklist is uitstekend voor stabiele criteria, maar minder geschikt voor actuele prioriteit en reviewstatus. Een Notion-taakdatabase zou dezelfde waarheid op een tweede plek bewaren. Eigen Actions voor statusupdates voegen tokens, races en onderhoud toe terwijl de vereiste Done-overgang ingebouwd is. Een tweede issue voor iedere PR maakt één taak onnodig dubbel.

## Gevolgen

Backlogdefinities veranderen via review; het bord verandert tijdens uitvoering. Afhankelijkheden zijn expliciete T-links en worden bij taakstart op Done gecontroleerd. Een gesloten, geannuleerde of vervangen taak is niet automatisch inhoudelijk voltooid: noteer de reden, corrigeer zo nodig de automatische Done-status en vervang de dependency expliciet. Het statusveld krijgt daarvoor geen zevende waarde.

Bij een tijdelijk onbereikbaar bord blijft lokaal werk aan de al gekozen taak mogelijk volgens AGENTS, met vermelding van gemiste updates. Een nieuwe taak kiezen zonder actuele prioriteit/dependencies te kunnen controleren is geen betrouwbare vervolgstap.

## Verificatie

AT-24-01/02/03: 59 unieke T-ID's, één issue per definitie, juiste velden/labels/mijlpalen, werkende links en teruggelezen nummers. Controleer beide workflows in fase 4 en de automatische issue-/statusafsluiting bij de eerste echte default-branchmerge. Op 2026-11-02 zijn 59 unieke issues en kaarten, velden/labels/mijlpalen, beide views en de links teruggelezen. `Item closed` en `Pull request merged` staan aan; hun doelwaarde wordt niet door de beschikbare API getoond. `Auto-close issue` staat eveneens aan en moet via de UI uit. Fase 4 wacht op deze concrete workflowcontrole; er is geen proefmerge uitgevoerd. Het uitvoeringsverslag hierboven is het hervatpunt.
