Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Frontend](08-frontend.md), [Figma-playbook](10-figma-mcp-playbook.md), [scope](01-product-vision-scope.md), [stijlbesluit](adr/0018-visual-direction-selection.md), [mappingbesluit](adr/0047-design-code-mapping.md), [leeswijzer](README.md)

# Design brief voor SinkTheShip

Ontwerp een toegankelijke browsergame waarin een speler snel een potje Zeeslag begint en achteraf kan begrijpen hoe de computer koos. De borden, beurt en volgende actie krijgen voorrang. Neural-networkuitleg is een aparte verdieping; tensor-, manifest- en runtimegegevens horen niet in de normale spelbediening.

Deze brief is uitvoerbare input voor het latere Figma-traject. **Er is nog geen stijl gekozen.** Goedkeuring van batch D bevestigt de specificatie en de keuzeprocedure, niet automatisch de aanbevolen stijl. Q-02 wordt vóór de eerste designgeneratie opgelost met een expliciete keuze voor A, B of C. Deze batch maakt geen Figma-bestand of schermontwerp.

## Drie stijlrichtingen

De kandidaten gebruiken families uit Google Fonts, die standaard in Figma beschikbaar zijn volgens [Figma's fontdocumentatie](https://help.figma.com/hc/en-us/articles/360039956894-Add-a-font-to-Figma). De specifieke family/style moet bij uitvoering ook zichtbaar zijn voor de remote API. Een alleen lokaal geïnstalleerd font volstaat daar niet; controleer beschikbaarheid en laad de styles vóór tekstmutaties. Productiefonts worden met herkomst/licentie vastgelegd en vanaf eigen origin aangeboden.

| Aspect | A — Harbor | B — Radar | C — Paper Fleet |
|---|---|---|---|
| Sfeer | Rustige havenkaart, helder en ruim | Donkere commandotafel met heldere signalen | Warm papieren bordspel met stevige druklijnen |
| Typografie | Inter: 400 body, 600 koppen/controls; tabular numerals voor cijfers | IBM Plex Sans: 400/600; IBM Plex Mono: 500 voor coördinaten/cijfers | Source Sans 3: 400/600 voor body/controls; Bitter: 600 voor grote koppen |
| Iconen | Eenvoudige afgeronde lijniconen, 2 px stroke op 24 px | Rechte technische lijniconen, 2 px; herkenbare vormen zonder gloed | Compacte volle of afgeronde lijniconen, 2 px; drukwerkgevoel |
| Illustratie | Beperkte vectorcontouren van schepen/water op Home en resultaat | Geometrische radar-/rastermotieven buiten het speelbord | Vlakke scheepssilhouetten en kaartmotief, zonder textuur achter tekst |
| Motion | Korte fade/scale van bediening; rustige hitmarkering | Korte signaalpuls bij een nieuw resultaat; geen doorlopende scanner | Kleine positionele verschuiving voor feedback; geen schuddend bord |
| Grenzen | Geen decoratie over coördinaten of heatmap | Geen flitsen, neonhalo als contrastbron of alleen groen/rood | Geen handschrift voor kleine tekst, slijttextuur of scheve klikgebieden |
| Sterk punt | De neutrale ondergrond laat schoten en AI-inzicht goed onderscheiden | Een uitgesproken spelgevoel met hoge contrasten | Vriendelijk en tactiel, herkenbaar als bordspel |

**Aanbeveling: A — Harbor.** Het lichte, rustige bord past bij het leerdoel en laat een latere heatmap afzonderlijk lezen. B en C zijn volwaardige alternatieven. De donkere basis van B is geen toezegging van de Could-feature om tussen licht en donker te wisselen.

### Paletten en kleurrollen

De onderstaande kleuren zijn concrete kandidaten, geen al vastgestelde producttokens. Na de keuze wordt precies één kolom de basis van de semantic collection. Een eventuele tweede modus krijgt dezelfde semantische namen en een eigen volledige contrastcontrole.

| Semantic rol | A — Harbor | B — Radar | C — Paper Fleet |
|---|---|---|---|
| `color/surface-canvas` | `#F4F8FC` | `#071A17` | `#FBF6EB` |
| `color/surface-panel` | `#FFFFFF` | `#102D27` | `#FFFCF5` |
| `color/content` | `#102A43` | `#E8FFF5` | `#302B24` |
| `color/content-muted` | `#486581` | `#A7C9BD` | `#6C5C45` |
| `color/action` | `#155E75` | `#67E8B5` | `#8A3B12` |
| `color/on-action` | `#FFFFFF` | `#062019` | `#FFFCF5` |
| `color/board-water` | `#E7F0F7` | `#0C241F` | `#F1E9D6` |
| `color/board-line` | `#607D8B` | `#72988A` | `#80735F` |
| `color/shot-miss` | `#52677A` | `#ABC2BB` | `#6C5C45` |
| `color/shot-hit` | `#B42318` | `#FFB4A2` | `#AD1F31` |
| `color/shot-sunk` | `#334155` | `#DFD5FF` | `#443F65` |
| `color/focus` | `#7C3AED` | `#FDE68A` | `#005F73` |

`shot-*` zijn voorgrondmarkeringen op `board-water`, geen automatisch omkeerbare fill/text-combinaties. De eigen scheepsvorm gebruikt `action` met `on-action`. Ongeldige plaatsing krijgt een streep-/kruismotief en fouttekst; de kleur kan naar `shot-hit` aliasen, de betekenis blijft via vorm en label verschillend. Hover kan een inset-outline gebruiken zonder tekstcontrast te veranderen. Focus heeft een dubbele ring met tussenruimte, zodat ook een cel met een gekleurde scheepsvorm herkenbaar blijft.

De sRGB-contrastberekening op deze exacte paren geeft:

| Contrastpaar | Harbor | Radar | Paper Fleet |
|---|---:|---:|---:|
| Content / panel | 14,64:1 | 14,06:1 | 13,69:1 |
| Muted content / panel | 6,08:1 | 8,22:1 | 6,30:1 |
| On-action / action | 7,27:1 | 11,22:1 | 7,55:1 |
| Bordlijn / water | 3,79:1 | 5,10:1 | 3,83:1 |

Dit controleert alleen deze paren. Tijdens design en implementatie worden ook iconen, focus tegen aangrenzende kleuren, overlays, hover, foutmeldingen en eventuele andere modes getest. Geen algemene WCAG-conformiteitsclaim op basis van een palettabel.

## Tokens en één naamconventie

Gebruik Figma-variabelen voor atomische waarden, semantic aliases voor gebruiksrollen en text styles voor samengestelde typografie. De collectienaam is organisatorisch; de variabelenaam is globaal uniek. De export vervangt `/` door `-` en zet er `--` voor: `color/surface-panel` wordt `--color-surface-panel`. Controleer botsingen vóór publiceren. Vermijd los herhaalde hexwaarden, magic numbers en duplicaten met hetzelfde doel.

| Collectie | Namen/waarden | CSS-/Tailwind-koppeling |
|---|---|---|
| `ColorPrimitives` | `color/palette-01` t/m `color/palette-12`, overeenkomstig de rijvolgorde van de palettabel; gelijke hexwaarden delen de eerste primitive | `--color-palette-01` enzovoort; UI gebruikt semantic aliases |
| `ColorSemantic` | De twaalf rollen hierboven; aanvullend `color/error` → shot-hit, `color/ship` → action en `color/on-ship` → on-action | `--color-surface-panel`, `--color-content`; utilities `bg-surface-panel`, `text-content` |
| `Spacing` | `spacing/1` 4, `/2` 8, `/3` 12, `/4` 16, `/6` 24, `/8` 32, `/12` 48 px | `--spacing-4` en spacing-utilities zoals `gap-4` |
| `Radius` | `radius/sm` 4, `/md` 8, `/lg` 16, `/pill` 999 px | `--radius-md`, `rounded-md` |
| `Typography` | `font/body`, `font/display`, `font/coordinate`; familywaarden uit gekozen stijl | `--font-body`, `font-body` enzovoort |
| `Typography` | `text/caption` 12, `/label` 14, `/body` 16, `/title` 24, `/hero` 36 px | `--text-body`, `text-body` |
| `Typography` | `leading/caption` 16, `/label` 20, `/body` 24, `/title` 32, `/hero` 44 px; `font-weight/regular` 400, `/strong` 600 | `--leading-body`, `leading-body`; `--font-weight-strong`, `font-strong` |
| `Motion` | `motion/duration-fast` 120, `/duration-standard` 180, `/duration-result` 240 ms; `ease/standard` `cubic-bezier(0.2,0,0,1)` | CSS `--motion-duration-fast: 120ms`; duur gebruikt rechtstreeks de variable; `--ease-standard`, `ease-standard` |
| `Layout` | `layout/control-min` 44, `/cell-min` 24, `/board-max` 480, `/content-max` 1200, `/focus-width` 2, `/focus-offset` 2 px | CSS-variabelen met dezelfde genormaliseerde naam; componentstyles verwijzen ernaar |

Elke semantic kleurrol verwijst naar de primitive van dezelfde tabelrij; wanneer een kleur eerder voorkwam naar die eerste rij. Zo delen bij Harbor `surface-panel` en `on-action` palette-02, zonder een tweede wit-token. Palettenummers zijn identifiers, geen lichtheidsclaim. Figma FLOAT-waarden voor afmetingen zijn px; de CSS-export mag ze consequent naar rem omzetten met basis 16, met die conversie in het exportcontract. De naamkoppeling blijft 1-op-1. Motionwaarden krijgen een `ms`-eenheid; easing is een STRING. Ondersteunt Figma voor een eigenschap geen binding, noteer de koppeling bij de betreffende style/prototypeactie, zonder te claimen dat die property gebonden is.

Tailwind v4 gebruikt CSS-themevariabelen; `@theme`/`@theme inline` koppelt de ondersteunde namespaces. Een generieke `--motion-*`- of `--layout-*`-variable genereert niet vanzelf een named utility: gebruik een expliciete CSS-varreferentie in de componentstyle. Bij semantic aliases en modes wordt de gekozen alias in de juiste elementscope opgelost. Zie [Tailwind theme variables](https://tailwindcss.com/docs/theme), via Context7 gecontroleerd op 2026-10-31. De uiteindelijke packageversies worden bij bootstrap gepind.

Bodytekst blijft minimaal 16 px, korte labels 14 px, caption 12 px alleen voor aanvullende informatie. Coördinaten gebruiken dezelfde leesbare familie of de vastgelegde mono-optie, met tabular cijfers. Resultaatcijfers mogen groter, niet kleiner. Motion is aanvullend en wordt bij reduced motion of uitgezette animaties direct weergegeven; geen langdurige loops of parallax.

## Componentinventaris en mappingregels

Main components in Figma heten exact zoals de exports in `packages/ui`. Variant-propertynamen zijn case-sensitive gelijk aan React-props. Figma booleans mappen naar booleans; numerieke length-waarden worden expliciet naar numbers gemapt. Teksten zijn text properties, geen variants per vertaling. Callbacks, arrays en publieke viewdata zijn codeprops en worden in Figma met benoemde fixtures getoond, niet als enorme variantcombinaties.

Hover/focus/pressed zijn browserinteracties. Maak daarvan gelabelde state-specimens van een instance met gebonden stijl-overrides; voeg geen fictieve React-props toe alleen om een Figma-state te kunnen noemen. Het prototype en de mappingnotitie noemen de echte `:hover`, `:focus-visible` en active-interactie. Disabled/loading/selected zijn wél betekenisvolle booleans/props. Vermijd het volledige cartesische product van alle props: de matrix dekt geldige grensgevallen.

| Component | Props en gelijknamige Figma-properties | Verplichte varianten/states en gedrag |
|---|---|---|
| `Button` | `variant`: primary/secondary/ghost/danger; `size`: sm/md/lg; `disabled`, `loading`; `label`; callback `onPress` | Rest, hover, focus, pressed, disabled, loading; 44 px actieve target; loading behoudt label/breedte |
| `IconButton` | `variant`, `size`, `disabled`; `icon`, `label`; `onPress` | Zelfde feedback; altijd toegankelijke naam, Tooltip is aanvullend |
| `Toggle` | `checked`, `disabled`, `label`; `onChange` | Aan/uit, focus en unavailable met uitleg; native switch-/checkboxbetekenis |
| `SegmentedControl` | `kind`: choice/tabs; `value`, `disabled`; `options`, `label`; `onChange` | Eén selectie; choice gebruikt radiogroep/pijltjes, tabs gebruikt tablist/tab met gekoppelde tabpanels en eigen bordfocus |
| `Card` | `variant`: plain/outlined/highlighted; `title`; `children` | Gewone groepering; niet automatisch een klikvlak |
| `Badge` | `tone`: neutral/info/success/warning/error; `label` | Kleur plus tekst/icoon, ook Binnenkort en Niet beschikbaar |
| `Dialog` | `open`, `variant`: confirm/info/error; `title`, `description`, `children`; `onClose` | Open/gesloten; focusbeheer volgens 08; terughoudend met destructieve primaire acties |
| `Toast` | `tone`: info/success/warning/error; `message`, `dismissible`; `onDismiss` | Zichtbaar/dismissed; geen verplichte actie die snel verdwijnt |
| `Tooltip` | `label`, `placement`: top/right/bottom/left; `children` | Hover én focus; sluit met Escape; inhoud hoverbaar en niet de enige uitleg |
| `Board` | `mode`: placement/own/opponent/review; `disabled`; `label`, `cells`, `rows`, `columns`; `onActivate` | Volledig grid, focus, bezig, read-only; mobiele begrenzing; geen private GameState-prop |
| `Cell` | `state`: empty/miss/hit/sunk/ship/invalid; `disabled`, `selected`; `label`; `onActivate` | State-matrix hieronder; hover en focus blijven boven de inhoud herkenbaar |
| `Ship` | `length`: number (fixtures 2/3/4/5); `orientation`: horizontal/vertical; `state`: available/selected/placed/invalid/confirmed | Beide oriëntaties voor iedere v1-lengte; kruiser/onderzeeër hebben verschillende labels bij gelijke lengte |
| `FleetStatus` | `side`: own/opponent; `ships`, `label` | Volledig, gedeeltelijk geraakt, gezonken en onbekend; tegenstander toont alleen publiek bekende aantallen/types |
| `TurnIndicator` | `state`: placing/yours/opponent/finished; `extraShot`; `label` | Starter, denken, extra schot en eind; tekst blijft zichtbaar zonder animatie |
| `ShotLog` | `entries`, `label`; `expanded`; `onExpand` | Leeg, enkele events, lange lijst; coördinaten/uitkomsten als tekst; niet automatisch focus/scroll afpakken |
| `StatTile` | `label`, `value`, `description`; `tone`: neutral/positive | Beschikbaar/niet beschikbaar, nulwaarde; geen verzonnen accuracy of benchmarkclaim |
| `HeatmapOverlay` | `visible`, `scores`, `legalMask`, `label`; `selectedCell` | Uit/aan, geselecteerde beslissing, geen data; legenda en tekstuele scorelijst als alternatief |
| `RuleSetPicker` | `value`, `options`, `disabled`; `onChange` | Vier v1-keuzes, toegestane customtoggles, validatiefout; geen uitgebreidere editor suggereren |
| `DifficultyPicker` | `value`, `options`, `disabled`; `onChange` | Easy/Normal/Hard/Impossible, incompatibel, laden en load-error; expliciete alternatiefkeuze |

Een app-scherm mag layoutframes/semantische containers gebruiken om instances te plaatsen; het tekent niet opnieuw een Button of Board als losse vormen. Layout en data-binding horen bij `apps/web`, presentatiestates bij `packages/ui`. Een featurecomponent krijgt geen eigen duplicaat van Button of van tokens.

### Cell-statematrix en informatiegrens

| Gevraagde state | Componentdata / specimen | Zichtbare betekenis |
|---|---|---|
| Leeg | `state=empty` | Water/raster, geen claim dat daar geen schip ligt |
| Hover | Instance met actuele state plus hover-outline | Voorbeeld van mogelijke activatie; geen spelmutatie |
| Focus | Instance met actuele state plus focusring | Keyboardpositie; onderscheidbaar van selected en hit |
| Mis | `state=miss` | Punt met label Mis |
| Raak | `state=hit` | Kruis met label Raak |
| Gezonken | `state=sunk` | Gevuld kruis/contour met label Gezonken |
| Schip | `state=ship` | Scheepssegment op eigen/onthuld bord |
| Ongeldig | `state=invalid` | Kruis-/streeppreview en gekoppelde fouttekst |
| Uitgeschakeld | `disabled=true`, bestaande state behouden | Inhoud inspecteerbaar; geen activatie en geen alleen-opacity-uitleg |

Bij v1-`information.sunk: "ship-type"` is op het vijandelijke bord alleen het schot dat de zinkuitkomst opleverde zeker als sunk te markeren. Kleur nooit een volledig verbonden hitcluster in als gezonken schip: daarvoor ontbreekt de koppeling aan posities. Eerdere hits blijven hits tot een toegestane expliciete onthulling. Eigen schepen en de postgame-view hebben wel volledige bekende geometrie. Ontwerp bewust een voorbeeld met twee elkaar rakende schepen; zie 02/05.

Heatmaps tonen vóór-keuze-informatie uit een bewaarde beslissing, uitsluitend na afloop. Markeer uitgesloten acties apart en bied een tekstuele topkeuzelijst; een kleurverloop is geen toegankelijk alternatief voor getallen. Logits/Hard-scores heten scores, niet percentages of bewezen kansen. Voor Easy/Normal en niet-bewaarde beslissingen staat Er is geen inzicht beschikbaar. De maximaal 20 bewaarde beslissingen uit 08 worden expliciet vermeld.

## Schermen en responsive states

Maak iedere genoemde state als reviewframe op **390, 768 en 1440 px**, met dezelfde componenten en betekenis. Framebenaming: `ScreenName/state/width/locale`, bijvoorbeeld `GameScreen/thinking/390/en`. De EN-versie is de basis; voeg NL-reviewframes toe voor de langste regel-/foutteksten, plaatsingsbediening, het spel en resultaat op alle drie breedtes. 320 px is daarnaast een implementatie-/reflowtest uit 08, geen vierde verplichte Figma-set.

| ScreenName | States / inhoud die in alle drie breedtes moet worden beoordeeld |
|---|---|
| `HomeScreen` | Geen opgeslagen spel; geldig hervatbaar spel; opslagherstel nodig; Tegen computer en Multiplayer binnenkort |
| `RuleSelectionScreen` | Klassiek; extra schot; no-touch; Aangepast met twee toggles; ongeldige/onbesliste importstate als herstelvoorbeeld |
| `DifficultySelectionScreen` | Alle beschikbare niveaus; Impossible unavailable; laden met bekende/onbekende voortgang; model-error met Retry/Hard |
| `PlacementScreen` | Leeg; gedeeltelijk; complete geldige vloot; ongeldige preview; sampler bezig/fout; opponent nog niet klaar |
| `GameScreen` | Eigen beurt; computer denkt; extra schot; miss/hit/sunk; lege/gevulde shotlog; bewaarfout; andere-tabmelding |
| `ResultScreen` | Winst; verlies; stats beschikbaar/niet geleverd; Rematch en Regels wijzigen; inzicht beschikbaar/niet beschikbaar |
| `GameRulesScreen` | Uitleg van gekozen preset; customsamenvatting; bord-/zinkvoorbeelden zonder verborgen informatie |
| `AiExplanationScreen` | Vier niveaukaarten; geen afgerond spel; postgame-insight met scorelegenda en beslissingselectie; geen bewaarde data |
| `SettingsScreen` | EN/NL; sound/animations; effecten nog niet geleverd; taalladen/fout; opslag niet beschikbaar |
| `MultiplayerFutureScreen` | Private match en quick play als toekomst, geen werkende join-/zoekflow |
| `RoomFutureScreen` | Geldige vorm room key met binnenkort-uitleg; ongeldige-linkmelding |
| `NotFoundScreen` | Onbekende route met Home-actie en normale appnavigatie |
| App-shell | Eerste laden; routechunk-/onverwachte fout met herstel; nieuw-spel-confirmdialog met Cancel/Confirm |

Should-inhoud heeft een zichtbare afwezige-state; Could-features zoals geschiedenis, offline-installatie en themaschakelen verschijnen pas als zij voor de release zijn gekozen. Placeholderstatistieken worden niet als echte gebruikersresultaten gepresenteerd.

Mobiel: één bordpaneel met bereikbare wisselbediening, beurt direct erboven, vloot/log eronder. Tablet: één actief bord met ondersteunende sidebar wanneer die past. Desktop: eigen en vijandelijk bord naast elkaar, maximaal 480 px per bord, duidelijke actieve zijde. De header bevat Home, spelregels/AI-uitleg en Instellingen zonder het bord onnodig naar beneden te drukken. Lange tekst blijft wrappen en bovenliggende containers gebruiken auto layout.

## Prototypeflows en review

| Flow | Te verbinden frames | Succescriterium |
|---|---|---|
| P-01 Start | Home → regels → moeilijkheid → plaatsing → spel | Volgorde, starter en gekozen regels zijn begrijpelijk |
| P-02 Plaatsen | Selecteer → geldige/ongeldige preview → rotatie → reset/random → bevestig | Touch-/keyboardalternatieven staan zichtbaar beschreven; verlies van draft is expliciet |
| P-03 Schieten | Eigen beurt → mis/raak/gezonken → computer/extra schot → eind | Uitkomst en beurt zijn niet van kleur of motion afhankelijk |
| P-04 Neural herstel | Impossible → laden → fout → herproberen of Hard | De gebruiker kiest het andere niveau expliciet |
| P-05 Hervatten | Home met checkpoint → laadstatus → juiste fase; corrupte snapshot → herstel | Geen automatische dataoverschrijving in foutpad |
| P-06 Resultaat | Winst/verlies → inzicht → rematch of andere regels | Inzicht blijft achteraf; nieuw spel heeft nieuwe identiteit |
| P-07 Instellingen/uitleg | Spel → settings/rules/AI → terug | De sessie blijft bestaan; taal/effectkeuze wijzigt de spelregels niet |
| P-08 Toekomst/404 | Home → multiplayer; directe roomlink/404 → Home | Geen online functionaliteit of accountplicht suggereren |

Figma-prototypes tonen states en routeovergangen; zij bewijzen geen echte pointercapture, keyboard-/screenreaderwerking, enginevalidatie of autosave. Die controles volgen in de gebouwde app. Review Foundations, Components en iedere schermfamilie afzonderlijk op een werk-kopie. Noteer links/node-IDs, gekozen tokens, afwijkingen en besluiten volgens 10; houd Archive buiten de actuele implementatiebron.

## Acceptatie van het designtraject

- De gekozen stijl is expliciet in ADR 0018 vastgelegd vóór canvasgeneratie; er is één actieve tokenbasis.
- Alle 19 componentfamilies hebben de props/states hierboven en een code-/Figma-mapping; de Cell- en Ship-voorbeelden dekken alle verplichte gevallen.
- De schermmatrix en acht prototypeflows bestaan op de afgesproken breedtes; de kritieke NL-varianten zijn beoordeeld.
- Onbekende vijandelijke posities blijven onbekend, ook in de ambigue sunk-fixture en bij heatmaps.
- Tokens, namen, bindings en contrasten zijn gecontroleerd; screenshots hebben geen clipping/overlap en vereiste targets/focus blijven zichtbaar.
- Planbeperkingen en ontbrekende toolrechten staan als beperking in het reviewverslag; er wordt geen publicatie, mapping of werkende a11y geclaimd zonder controle.
