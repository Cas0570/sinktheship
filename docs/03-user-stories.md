Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Requirements](01-product-vision-scope.md), [spelregels](02-game-rules.md), [traceerbaarheid](README.md#traceerbaarheid), [begrippen](glossary.md)

# User stories en acceptatietests

Elke story beschrijft één gebruikersdoel of ontwikkelaarsdoel. `AT-xx-yy` is een stabiele acceptatietestdefinitie, nog geen geïmplementeerde of uitgevoerde test. De teststrategie in batch E bepaalt de concrete testbestanden; batch F koppelt taken. Gegevens uit de tabel `RULE-xx` in document 02 worden waar relevant golden fixtures.

Must-criteria gelden voor v1.0; de expliciete MVP-grenzen staan in document 01. Should- en Could-stories behouden hun eigen prioriteit. Technische kwaliteitsstories zijn verplicht voor de releaseonderdelen waarop zij betrekking hebben.

## US-01

**Een wedstrijd starten — Must.** Als speler wil ik via duidelijke stappen een potje starten, zodat ik weet welke regels en tegenstander actief zijn.

Eisen: FR-01. Testvorm: e2e en componenttests.

- **AT-01-01:** Gegeven een nieuwe gast zonder opgeslagen spel, als die Home opent en Tegen de computer kiest, dan volgen regelkeuze, niveaukeuze en plaatsing in die volgorde.
- **AT-01-02:** Gegeven ontbrekende vlootdelen, als de speler wil starten, dan is starten niet mogelijk en wordt uitgelegd welke schepen ontbreken.
- **AT-01-03:** Gegeven twee geldige bevestigde vloten, als de wedstrijd start, dan zijn regels en niveau zichtbaar, wordt de gelote starter getoond en kan alleen die speler schieten.

## US-02

**Regels kiezen — Must.** Als speler wil ik presets en beperkte aanpassingen kiezen, zodat een wedstrijd volgens begrijpelijke regels verloopt.

Eisen: FR-02, FR-03. Testvorm: unit-/propertytests en UI-tests; RULE-01 t/m RULE-06, RULE-14 t/m RULE-20.

- **AT-02-01:** Gegeven de vier UI-keuzes, als alle combinaties van Aangepast worden geselecteerd, dan ontstaan exact vier spelconfiguraties volgens document 02 en geen andere bordmaten, vloten of informatievormen.
- **AT-02-02:** Gegeven ongeldige, onbekende of niet-bewezen plaatsbare regeldata, als een spelstart wordt aangevraagd, dan wordt die geweigerd met onderscheid tussen invalid, unsupported en inconclusive.
- **AT-02-03:** Gegeven een begonnen wedstrijd, als een regelwijziging wordt aangeboden, dan blijft die wedstrijd ongewijzigd en is een nieuw spel nodig; wijzigen van alleen de UI-taal verandert geen signaturen.

## US-03

**Een passend niveau kiezen — Must.** Als speler wil ik kunnen zien welke tegenstanders met mijn regels werken.

Eisen: FR-04, FR-15. Testvorm: registry-contracttests en componenttests.

- **AT-03-01:** Gegeven een geldige regelset uit het ondersteunde enginecontract, als de registry wordt geraadpleegd, dan ondersteunen Easy, Normal en Hard die regels zonder een preset-ID te hoeven herkennen.
- **AT-03-02:** Gegeven geen gevalideerd compatibel manifest, als de moeilijkheidskiezer verschijnt, dan blijft Impossible zichtbaar maar uitgeschakeld met uitleg in de gekozen taal.
- **AT-03-03:** Gegeven een compatibel manifest, als Impossible wordt gekozen, dan begint het laden en start de wedstrijd pas na succesvolle validatie en initialisatie; in de MVP wordt een nog niet geleverde neural tegenstander niet als speelbaar gepresenteerd.

## US-04

**Schepen plaatsen — Must.** Als muis- of touchgebruiker wil ik schepen kunnen plaatsen, draaien en herstellen.

Eisen: FR-05, FR-07. Testvorm: pointer-e2e, componenttests en plaatsingsfixtures.

- **AT-04-01:** Gegeven een nog te plaatsen schip, als ik het sleep of eerst selecteer en vervolgens een cel klik/tik, dan wordt dezelfde geldige plaatsing gemaakt; beide manieren hebben een zichtbare rotatieknop.
- **AT-04-02:** Gegeven een schip aan de rand of naast een ander schip, als een verplaatsing/rotatie ongeldig is of een drag wordt geannuleerd, dan blijft de vorige plaatsing behouden en wordt de reden zonder alleen kleur duidelijk.
- **AT-04-03:** Gegeven een gedeeltelijke vloot, als Willekeurig plaatsen wordt bevestigd, dan ontstaat één complete geldige vloot; als Reset wordt gekozen, dan verdwijnen alle conceptschepen en blijven regels en niveau behouden.

## US-05

**Spelen met toetsenbord en hulpmiddelen — Must.** Als speler die niet sleept of geen muis gebruikt, wil ik zelfstandig een volledige wedstrijd kunnen bedienen.

Eisen: FR-06, NFR-04. Testvorm: handmatige toetsenbord-/screenreadercontrole en e2e.

- **AT-05-01:** Gegeven de plaatsingspagina, als ik uitsluitend Tab, pijltjestoetsen en de gedocumenteerde bevestig-/rotatietoetsen gebruik, dan kan ik alle schepen plaatsen, fouten herstellen en het spel starten.
- **AT-05-02:** Gegeven het vijandelijke bord, als ik focus met pijltjestoetsen verplaats en een geldige cel activeer, dan ontstaat precies één schot en worden coördinaat en resultaat via een live-region aangekondigd.
- **AT-05-03:** Gegeven een beurtwissel, dialog of eindscherm, als de UI overgaat naar de nieuwe state, dan blijft focus zichtbaar en logisch, bestaat geen keyboard trap en is geen betekenis uitsluitend door kleur of geluid overgebracht.

## US-06

**Eerlijk beurtverloop — Must.** Als speler wil ik dat ieder geldig schot precies volgens de gekozen regels telt.

Eisen: FR-08. Testvorm: engine-unit-/propertytests; RULE-07 t/m RULE-11 en RULE-19.

- **AT-06-01:** Gegeven vaste quota, als een geldig schot mis, raak of gezonken oplevert, dan veranderen quota en actieve speler exact volgens document 02.
- **AT-06-02:** Gegeven een eerder beschoten cel of een niet-actieve speler, als een schot binnenkomt, dan veranderen state, statistieken, events en RNG-toestand niet.
- **AT-06-03:** Gegeven het laatste ongeraakte scheepsvak van de tegenstander, als dat geraakt wordt, dan is de wedstrijd meteen afgelopen en ontstaat ook bij extra schot bij raak geen volgende actie.

## US-07

**Verborgen informatie respecteren — Must.** Als speler wil ik dat de computer met dezelfde kennis speelt als een menselijke tegenstander.

Eisen: FR-09, NFR-03. Testvorm: projectie-/contracttests; RULE-12 en RULE-21.

- **AT-07-01:** Gegeven twee interne states met dezelfde eigen vloot en publieke observaties maar verschillende onbekende vijandelijke posities, als views en publieke events worden opgebouwd, dan zijn die gelijk en bevatten zij geen verborgen posities of plaatsingsseeds.
- **AT-07-02:** Gegeven rakende schepen met een ambigu trefferscluster, als Klassiek een zinkbericht geeft, dan ontvangt de schutter het type zonder een geheime koppeling van alle clustercellen aan dat schip.
- **AT-07-03:** Gegeven een actieve wedstrijd, als de tegenstander of een UI-component data ontvangt, dan is dit de bedoelde projectie; pas de eindview mag beide vloten tonen.

## US-08

**Een spel hervatten — Must.** Als speler wil ik na een refresh verder kunnen vanaf de laatst opgeslagen toestand.

Eisen: FR-10, NFR-09. Testvorm: opslag-/migratietests en e2e; RULE-13.

- **AT-08-01:** Gegeven een opgeslagen conceptplaatsing of wedstrijd, als de pagina herlaadt, dan blijven regels, niveau, vloot, schoten, starter, quota en RNG-toestanden behouden; een lopende denkpauze veroorzaakt geen dubbel schot.
- **AT-08-02:** Gegeven een snapshot uit een ondersteunde oudere versie, als die wordt geladen, dan volgt eerst migratie en validatie; corrupte of te nieuwe data wordt niet overschreven voordat de speler een herstelkeuze maakt.
- **AT-08-03:** Gegeven geblokkeerde of volle opslag, als bewaren faalt, dan blijft de huidige sessie speelbaar met zichtbare uitleg dat hervatten beperkt is tot de laatste succesvolle snapshot.

## US-09

**Nog een potje — Must.** Als speler wil ik na afloop opnieuw spelen of de instellingen aanpassen.

Eisen: FR-11. Testvorm: sessie-/e2e-tests; RULE-22.

- **AT-09-01:** Gegeven een afgeronde wedstrijd, als ik Rematch kies, dan krijg ik dezelfde regels en hetzelfde niveau, een nieuwe wedstrijd-ID en randomness, en een lege eigen conceptplaatsing.
- **AT-09-02:** Gegeven een eindscherm, als ik Instellingen wijzigen kies, dan kan ik regels en niveau opnieuw kiezen zonder de oude schoten in het nieuwe spel mee te nemen.
- **AT-09-03:** Gegeven een rematchverzoek voor Impossible waarvan het model niet meer bruikbaar is, als de sessie wordt voorbereid, dan krijg ik de modelmelding en een expliciete alternatieve keuze, geen stille downgrade.

## US-10

**Regels en AI begrijpen — Must.** Als speler wil ik weten hoe het spel en de tegenstanders werken.

Eisen: FR-12. Testvorm: contentreview en navigatie-e2e.

- **AT-10-01:** Gegeven een gekozen regelset, als ik de spelregels open, dan zie ik de juiste vloot, aanraakregel, beurtregel, starterkeuze en informatievrijgave.
- **AT-10-02:** Gegeven de pagina Hoe werkt de AI?, als ik ieder niveau lees, dan worden random, hunt/target, density en neural model uitgelegd zonder een onbewezen winstclaim.
- **AT-10-03:** Gegeven Impossible, als de uitleg wordt getoond, dan vermeldt zij dat geluk een rol speelt, dat het niveau te verslaan is en dat modelondersteuning van de regels afhangt.

## US-11

**Van taal wisselen — Must.** Als speler wil ik in Engels of Nederlands spelen zonder mijn wedstrijd kwijt te raken.

Eisen: FR-13. Testvorm: key-validatie, componenttests en e2e.

- **AT-11-01:** Gegeven een eerste bezoek zonder opgeslagen voorkeur, als de app start, dan is Engels geselecteerd; bij een eerder opgeslagen Nederlandse keuze start de app in Nederlands.
- **AT-11-02:** Gegeven een lopend spel, als ik de taal wissel, dan veranderen ook labels, foutmeldingen en accessibilityteksten, maar blijven state, RNG en signaturen identiek.
- **AT-11-03:** Gegeven een nieuwe vertaling, als de sleutelcontrole ontbrekende keys of placeholders vindt, dan faalt de controle vóór publicatie; gebruikers zien geen rauwe key als producttekst.

## US-12

**Voorkeuren voor geluid en beweging — Must/Should.** Als speler wil ik effecten kunnen regelen en mijn keuze behouden.

Eisen: FR-14, FR-19. Testvorm: componenttests, media-emulatie en handmatige controle.

- **AT-12-01:** Gegeven beschikbare effecten, als ik geluid of animaties uitschakel en herlaad, dan blijft die voorkeur behouden en stoppen de betreffende effecten direct.
- **AT-12-02:** Gegeven een systeemvoorkeur voor reduced motion, als een speluitkomst wordt getoond, dan ontbreekt niet-essentiële beweging ook wanneer de gewone animatievoorkeur aan staat; de uitslag blijft begrijpelijk.
- **AT-12-03:** Gegeven nog niet geleverde Should-effecten, als ik instellingen open, dan zijn de betreffende opties zichtbaar maar niet bedienbaar met uitleg; de taalkeuze en overige flows blijven bruikbaar.

## US-13

**Een neural model laden — Must.** Als speler wil ik weten wat er gebeurt wanneer Impossible wordt voorbereid of faalt.

Eisen: FR-15, NFR-07. Testvorm: loader-/Workercontracttests en browsermetingen.

- **AT-13-01:** Gegeven een verse sessie op Home, als Impossible niet is gekozen, dan zijn neural runtime en model niet geladen; bij selectie verschijnt een laadfase met voortgang waar meetbaar en anders een eerlijke bezetmelding.
- **AT-13-02:** Gegeven een netwerkfout, ongeldig model, incompatibele encoding of runtimefout, als initialisatie/inferentie mislukt, dan stopt de betreffende modelactie en krijgt de speler uitleg met expliciet Hard kiezen of opnieuw proberen.
- **AT-13-03:** Gegeven een geldig gecachet model, als het opnieuw gebruikt wordt, dan worden manifest en integriteit gecontroleerd en voldoet de releaseversie aan de modelgrootte-/inferentiebudgetten; cold load wordt afzonderlijk gerapporteerd.

## US-14

**Een toekomstige online route openen — Must.** Als bezoeker met een roomlink wil ik een bruikbare pagina zien.

Eisen: FR-16. Testvorm: router-/deploy-e2e.

- **AT-14-01:** Gegeven een directe URL naar `/r/K7QX2M`, als ik die open of refresh, dan verschijnt de binnenkort-pagina en kan ik naar Home terug.
- **AT-14-02:** Gegeven `/multiplayer`, als ik de pagina open, dan worden toekomstige private match en quick play uitgelegd zonder een werkende wachtrij te suggereren.
- **AT-14-03:** Gegeven een room-URL met vreemde tekens of HTML-achtige invoer, als de route rendert, dan wordt geen markup uitgevoerd en geen speltransport gestart; een onbekende route toont de app-404.

## US-15

**Als gast spelen — Must.** Als bezoeker wil ik zonder persoonsgegevens een lokaal spel kunnen spelen.

Eisen: FR-17, NFR-08. Testvorm: identity-adaptertests en netwerkinspectie.

- **AT-15-01:** Gegeven een eerste sessie, als een gastidentiteit nodig is, dan wordt die lokaal verkregen via de provider zonder naam, e-mailadres of netwerkverzoek voor identificatie.
- **AT-15-02:** Gegeven beschikbare opslag, als ik herlaad, dan blijft de gast-ID behouden; bij verlies of blokkade van opslag kan een nieuw lokaal spel met een nieuwe of tijdelijke gast-ID starten.
- **AT-15-03:** Gegeven spel, instellingen en AI-uitleg, als ik alle kernflows doorloop, dan worden gast-ID, spelstate en voorkeuren niet geüpload en ontstaat geen trackingverzoek.

## US-16

**Mijn resultaat bekijken — Should.** Als speler wil ik per potje kunnen zien hoe ik heb geschoten.

Eisen: FR-18. Testvorm: statistiek-unit-tests en eindschermtests.

- **AT-16-01:** Gegeven een afgerond potje, als het resultaat verschijnt, dan zijn per speler schoten, treffers, missers, gezonken schepen en trefpercentage aanwezig en consistent met de geaccepteerde historie.
- **AT-16-02:** Gegeven een speler zonder geaccepteerde schoten, als diens resultaat wordt getoond, dan is het trefpercentage 0% en verschijnt geen NaN of Infinity.
- **AT-16-03:** Gegeven dubbele of afgewezen schoten, als de statistieken worden berekend, dan tellen die niet mee; een zinkend schot telt eenmaal als schot en eenmaal als treffer.

## US-17

**Zien wat de AI dacht — Should.** Als speler wil ik een heatmap bekijken om de strategie te begrijpen.

Eisen: FR-20, FR-09. Testvorm: projectie-/componenttests en visuele review.

- **AT-17-01:** Gegeven een afgerond spel tegen Hard of Impossible met een bewaarde schotbeslissing, als ik AI-inzicht open, dan komt de heatmap uit de observatie vóór die beslissing en niet uit de uiteindelijke onthulde schepenkaart.
- **AT-17-02:** Gegeven een heatmap, als ik de legenda lees of een cel focus, dan is duidelijk of de waarde kansdichtheid of modeloutput is; density wordt niet zonder kalibratie als exacte procentuele kans beschreven.
- **AT-17-03:** Gegeven Easy, Normal of ontbrekende inzichtdata, als ik de functie bezoek, dan verschijnt een begrijpelijke niet-beschikbaarmelding zonder verzonnen scores of verborgen informatie.

## US-18

**Zelf een model trainen — Must.** Als ontwikkelaar wil ik een experiment kunnen herhalen en begrijpen.

Eisen: FR-21. Testvorm: ML-pipeline-smoketest en menselijke uitvoering van de gids.

- **AT-18-01:** Gegeven de beschreven CPU-omgeving, config en seeds, als ik datasetgeneratie, training, evaluatie en export afzonderlijk start, dan ontstaan benoemde artefacten met herleidbare configuratie en versies.
- **AT-18-02:** Gegeven geen netwerk of W&B-account, als ik train in offline-modus, dan kan de run afronden en blijft de log lokaal beschikbaar; latere synchronisatie is een afzonderlijke expliciete stap.
- **AT-18-03:** Gegeven een baseline, als ik volgens de gids één laag of trainingsparameter wijzig en hertrain, dan kan ik het nieuwe model met dezelfde evaluatiecriteria vergelijken zonder applicatiecode te wijzigen.

## US-19

**Moeilijkheid en promotie bewijzen — Must.** Als ontwikkelaar wil ik een model op prestaties beoordelen.

Eisen: FR-22, NFR-12. Testvorm: benchmarkverificatie en reproduceerbaar evaluatierapport.

- **AT-19-01:** Gegeven vaste evaluatieseeds en geldige regels, als de harness draait, dan rapporteert zij gemiddelde/mediaan/p90 schoten, verdeling, beurtgebalanceerde head-to-head-winrate en beslistijd met duidelijk aantal wedstrijden en fouten.
- **AT-19-02:** Gegeven een modelkandidaat, als die voor v1.0 wordt beoordeeld, dan worden de vooraf vastgelegde criteria uit NFR-12 toegepast op niet voor training/selectie gebruikte evaluatiedata; een mislukt criterium wordt niet achteraf weggelaten.
- **AT-19-03:** Gegeven een bestaand standaardmodel, als een nieuwe kandidaat niet aantoonbaar beter of niet export-paritair is, dan blijft het oude model standaard en wordt geen manifestpromotie doorgevoerd.

## US-20

**Zonder AI uitbreiden — Must.** Als ontwikkelaar wil ik een nieuwe bouwsteen via de publieke interfaces toevoegen.

Eisen: NFR-01, NFR-13. Testvorm: uitbreidingsproeven, diffreview en importchecks.

- **AT-20-01:** Gegeven een schone ontwikkelkopie en de gids, als ik een tegenstander, preset of scherm toevoeg, dan blijft de wijziging binnen de maximale impact van NFR-01 en werken de bestaande engine en UI-componenten door.
- **AT-20-02:** Gegeven een nieuwe taal of compatibele modelmap, als ik die toevoeg en opnieuw bouw, dan wordt die zonder handmatige codewijziging ontdekt; een onvolledig manifest of vertaalbestand wordt geweigerd.
- **AT-20-03:** Gegeven een packagewijziging, als ik de publieke API of dependencygrens wijzig, dan controleren tests en importregels de grens en zijn README, specificatie en de benodigde ADR onderdeel van dezelfde review.

## US-21

**Op telefoon en desktop spelen — Must.** Als speler wil ik op mijn apparaat dezelfde volledige flow kunnen gebruiken.

Eisen: NFR-04, NFR-05. Testvorm: browsermatrix, responsive screenshots en handmatige touchtests.

- **AT-21-01:** Gegeven viewports van 320, 390, 768 en 1440 CSS-pixels, als ik plaats en speel, dan zijn essentiële controls bereikbaar, cellen groot genoeg volgens NFR-04 en is op smalle schermen een bereikbare bordwissel beschikbaar.
- **AT-21-02:** Gegeven alle vastgelegde browsers uit de releasematrix, als de kernflow in beide talen draait, dan zijn plaatsing, schieten, rematch en hervatten functioneel gelijk.
- **AT-21-03:** Gegeven tekstvergroting en hulpmiddelen, als ik door de pagina navigeer, dan blijft inhoud bereikbaar en wordt de AA-controle inclusief focus en betekenisvolle labels handmatig uitgevoerd.

## US-22

**Vlot laden en reageren — Must.** Als speler wil ik dat de app reageert terwijl een tegenstander rekent.

Eisen: NFR-06. Testvorm: productiebuildmeting, Lighthouse en Chrome DevTools-traces.

- **AT-22-01:** Gegeven de productiebuild en het vastgelegde meetprofiel, als de initiële route koud wordt geladen, dan voldoen JS-budget en Lighthouse-scores aan NFR-06 zonder neural bestanden mee te laden.
- **AT-22-02:** Gegeven een neural beslissing in de Worker, als ik een beschikbare UI-bediening gebruik, dan blijft die bedienbaar en staan modelberekeningen niet op de main thread.
- **AT-22-03:** Gegeven ingeschakelde animaties op het referentietoestel, als de beschreven meetflow wordt getraceerd, dan voldoet framewerk aan het budget en staan profiel, buildversie en ruwe meting in het rapport.

## US-23

**Lokale data en invoer beschermen — Must.** Als speler wil ik dat onbetrouwbare invoer geen ongewenst gedrag veroorzaakt.

Eisen: NFR-08, NFR-10. Testvorm: security-/buildchecks en netwerkinspectie.

- **AT-23-01:** Gegeven productie, als de app en assets worden opgehaald, dan gebruiken zij HTTPS en de vastgelegde securityheaders; fonts, geluid en model komen van eigen origin.
- **AT-23-02:** Gegeven gemanipuleerde URL's, snapshots of manifests, als die worden verwerkt, dan worden zij gevalideerd en als data behandeld; invoer voert geen code uit en omzeilt de beurtvalidatie niet.
- **AT-23-03:** Gegeven de productieartefacten, als de releasecheck zoekt naar secrets, dev-only seedbediening en trackingcode, dan worden die niet gevonden; deze controle claimt geen bescherming tegen de eigenaar die zijn eigen browser wijzigt.

## US-24

**Reviewbare samenwerking — Must.** Als ontwikkelaar wil ik iedere taak kunnen begrijpen en beoordelen.

Eisen: NFR-13, NFR-14. Testvorm: handmatige PR-/documentreview en workflowcontrole.

- **AT-24-01:** Gegeven een bouwtaak van het bord, als de AI die oppakt, dan leest zij de gekoppelde docs, werkt aan die ene taak en gebruikt zij de voorgeschreven MCP-momenten.
- **AT-24-02:** Gegeven een taak voor review, als de PR wordt aangeboden, dan zijn relevante checks uitgevoerd en staan doel, reden, verificatie, reviewfocus en doc-/bord-/Notion-updates in de reviewsamenvatting.
- **AT-24-03:** Gegeven een ontbrekende MCP-update of tegenstrijdige specificatie, als de sessie wordt afgerond, dan staat het probleem expliciet in de review; de AI verzint geen geslaagde update en wijzigt geen requirement stilzwijgend.

## US-25

**Lokale geschiedenis — Could.** Als speler wil ik eerdere resultaten op dit apparaat terugzien.

Eisen: FR-23. Testvorm: optionele opslag-/UI-tests zodra deze functie is ingepland.

- **AT-25-01:** Gegeven een ingeschakelde geschiedenisfunctie, als een wedstrijd eindigt, dan wordt één resultaat lokaal toegevoegd met regels, niveau en eventuele modelversie.
- **AT-25-02:** Gegeven bewaarde resultaten, als ik Geschiedenis wissen bevestig, dan verdwijnen die resultaten en blijft een eventueel lopend spel behouden.
- **AT-25-03:** Gegeven geschiedenisgebruik, als het netwerk wordt geïnspecteerd, dan worden resultaten niet geüpload en ontstaat geen vereiste externe identiteit.

## US-26

**Offline spelen — Could.** Als speler wil ik de eerder geladen app zonder verbinding kunnen gebruiken.

Eisen: FR-24. Testvorm: optionele offline-/update-e2e zodra deze functie is ingepland.

- **AT-26-01:** Gegeven succesvol voorbereide offline-assets, als het netwerk wegvalt, dan kan ik een volledig lokaal potje met een beschikbaar niveau spelen.
- **AT-26-02:** Gegeven een niet gecachet model, als ik offline Impossible kies, dan krijg ik uitleg en een expliciete beschikbare alternatiefkeuze.
- **AT-26-03:** Gegeven een nieuwe app-/cacheversie, als die wordt geactiveerd, dan blijven lopende compatibele snapshots herstelbaar en worden incompatibele assets niet ongemerkt gecombineerd.

## US-27

**Een donker thema — Could.** Als speler wil ik eventueel een donker kleurthema gebruiken.

Eisen: FR-25. Testvorm: optionele token-/contrast-/visuele tests zodra deze functie is ingepland.

- **AT-27-01:** Gegeven dark mode, als ik het thema wissel, dan blijven alle celstates door tekst, patroon of icoon herkenbaar en blijven contrast- en focuscriteria gelden.
- **AT-27-02:** Gegeven een opgeslagen themakeuze, als ik herlaad, dan wordt die keuze hersteld zonder de wedstrijd te veranderen.
- **AT-27-03:** Gegeven beide talen en alle drie ontwerpbreakpoints, als dark mode wordt bekeken, dan zijn componenten en fout-/laadstates volledig gethematiseerd.

## US-28

**Een wedstrijd reproduceren — Must.** Als ontwikkelaar wil ik een fout met dezelfde invoer kunnen terugzien.

Eisen: NFR-02. Testvorm: deterministische engine-/RNG-tests en replaytest.

- **AT-28-01:** Gegeven dezelfde versies, regels, volledige beginsituatie, private RNG-toestanden en commands, als de replay tweemaal draait, dan zijn state en events exact gelijk.
- **AT-28-02:** Gegeven een hervatting na een succesvol bewaarde actie, als hetzelfde vervolgcommando wordt uitgevoerd als in de ononderbroken run, dan is het resultaat identiek.
- **AT-28-03:** Gegeven een afgewezen actie of een UI-denkpauze, als die tussen geldige acties optreedt, dan verandert zij geen algoritmische RNG-stroom of uiteindelijke benchmarkuitkomst.

## US-29

**Dezelfde betekenis in TypeScript en Python — Must.** Als ontwikkelaar wil ik dat een model is getraind op de regels die de app uitvoert.

Eisen: NFR-11. Testvorm: gedeelde fixtures, encoding- en exportpariteit.

- **AT-29-01:** Gegeven dezelfde regel-, plaatsings- en schotfixtures, als TS en Python die uitvoeren, dan komen geldigheid, uitkomsten, zinken, beurtverloop en signaturen overeen.
- **AT-29-02:** Gegeven dezelfde publieke observatie, als beide encoders draaien, dan zijn tensorvorm, dtype, asvolgorde, kanalen, mask en waarden gelijk, ook bij ambigu gezonken schepen.
- **AT-29-03:** Gegeven een geëxporteerd model en vaste tensors, als PyTorch en ONNX Runtimes in Python en TypeScript inferentie doen, dan valt de afwijking binnen de vooraf vastgelegde tolerantie en volgt eindevaluatie in de TypeScript-harness.
