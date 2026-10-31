Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](01-product-vision-scope.md), [regels](02-game-rules.md), [architectuur](04-architecture.md), [engine](05-game-engine.md), [tegenstanders en benchmark](06-opponents.md), [leeswijzer](README.md)

# Neural network: van observatie naar getoetste tegenstander

Het leerdoel is een klein model begrijpen, trainen en eerlijk vergelijken. Een lage trainingsfout bewijst niet dat het model Hard verslaat. De pipeline levert daarom afzonderlijk trainingsresultaten, export-pariteit, spelbenchmarks en browsermetingen. Alleen een gekwalificeerd model kan de standaard voor Impossible worden. Er bestaat tijdens deze documentatieopdracht nog geen getraind model of uitvoerbare pipeline.

## Probleem en eerste modelbereik

De supervised baseline voorspelt voor iedere nog onbeschoten cel of daar een vijandelijk scheepsdeel ligt. Een **logit** is de ruwe score; sigmoid kan die naar 0–1 omzetten. Het grootste logit heeft ook de grootste sigmoidwaarde, zodat schotkeuze geen sigmoid nodig heeft. Een getoonde modelscore is zonder kalibratie geen bewezen kans.

Train eerst op de strategie van Klassiek: 10 × 10, de vijf exemplaren uit 02, contact `allow`, hit-only en sunk ship-type. Evalueer dezelfde gewichten afzonderlijk voor Klassiek en Nog eens bij raak. Starter en extra-schotbeleid veranderen het bezettingsprobleem niet, maar worden niet zonder benchmark als ondersteund gepubliceerd. De twee no-touch-combinaties krijgen later een afzonderlijk model en eigen evaluatie. Tot die kwalificatie blijft Impossible daarvoor zichtbaar uitgeschakeld.

Dit volgt [ADR 0031](adr/0031-model-per-strategy.md): één model per `strategySignature`, geen regel-geconditioneerd model als eerste baseline. Andere afmetingen, vloot-IDs/lengtes of onthullingsvormen zijn voor deze encoding niet ondersteund, ook al ondersteunt de engine ze wel. De fully convolutional architectuur is op zichzelf geen toestemming voor andere model-inputshapes.

| Stap | Wat en waarom | Waar de reviewer op let |
|---|---|---|
| Observatie | Alleen de informatie die de schutter vóór zijn keuze heeft | Geen verborgen schip-ID, plaatsingsseed of uiteindelijke eindview |
| Label | Echte bezetting als trainingsantwoord | Alleen in de dataset/loss, nooit in de encoder of botcontext |
| CNN | Leert ruimtelijke patronen in missers en treffers | Eenvoudige lagen, behoud van rij/kolom, modelgrootte |
| Training | Past gewichten aan om voorspellingen te verbeteren | Gescheiden datasets, stabiele loss, reproduceerbare configuratie |
| Export | Bewaart dezelfde berekening in ONNX | Vastgelegde operators, shapes, versies en outputvergelijking |
| Benchmark | Meet echte schoten en wedstrijden | Zelfde vloten, aparte holdout en poorten uit 06 |

## Encodingcontract `sts-observation-v1`

De TypeScript-encoder woont in `opponent-neural`; de Python-encoder in `ml`. Hij accepteert de twee v1-contactvormen allow/no-touch met quota fixed 1, beide extra-schotkeuzes en de drie starterwaarden; modelcompatibiliteit wordt daarnaast per volledige regelentry getoetst. Beide lezen alleen de publieke observatie. Het model krijgt geen `GameState`. De vastgelegde scheepsvolgorde is ASCII op ID: `battleship`, `carrier`, `cruiser`, `destroyer`, `submarine`, met lengtes 4, 5, 3, 2, 3.

| Eigenschap | Norm |
|---|---|
| Inputnaam, dtype en shape | `observation`, float32, `[1, 16, 10, 10]` bij inferentie |
| Asvolgorde | NCHW: batch, kanaal, rij, kolom; rij 0 boven, kolom 0 links |
| Flattening | `((batch * 16 + channel) * 10 + row) * 10 + col`; geen transpose in de runner |
| Training | `[B, 16, 10, 10]`; de export heeft bewust vaste batch 1 |
| Output | `logits`, float32, `[1, 1, 10, 10]`; 100 eindige ruwe scores |
| Actiemasker | 100 booleans in rij-major volgorde; true precies voor `view.legalShots`; buiten de ONNX-graph |
| Versie | Iedere semantische wijziging van kanaal, normalisatie, sortering of betekenis krijgt een nieuwe encoding-ID |

Alleen uitgaande schoten (`shooter === viewer`) tellen voor de vijandelijke observatie. Sorteer op `shotIndex`; hernummer deze lokaal 1…n voor het tijdkanaal. Inkomende schoten, eigen vloot, eigen schade, actieve speler-ID, game-ID, starter en resterende beurtquota gaan niet de tensor in. De adapter controleert wel dat de aangeleverde view de actieve speler en juiste regels betreft.

| Kanaal | Naam | Waarde per cel |
|---|---|---|
| 0 | `unknown` | 1 als hier nog geen uitgaand schot is gedaan; anders 0 |
| 1 | `miss` | 1 als het eigen schot mis was |
| 2 | `unresolved-hit` | 1 bij een treffer die niet tot de hieronder begrensde bewezen gezonken cellen behoort |
| 3 | `known-sunk` | 1 uitsluitend op de coördinaat van een publiek zinkschot |
| 4–8 | `afloat-by-id` | Eén constant vlak per vastgelegd schip: 0 als dat ID publiek gezonken is, anders 1 |
| 9–13 | `sunk-event-by-id` | Eén vlak per schip: 1 op zijn zinkschotcoördinaat, anders 0 |
| 14 | `shot-order` | 0 voor onbeschoten cellen; anders de lokale schotindex gedeeld door 100, eenmaal afgerond naar float32 |
| 15 | `sunk-event` | 1 als het oorspronkelijke uitgaande resultaat op deze cel `sunk` was |

Kanalen 0–3 vormen per cel precies één van vier states. De v1-encoding ondersteunt alleen hit-only/ship-type-sunk; daarom is het zinkschot de enige **rechtstreeks** aan een gezonken schip toegewezen cel. Zij voegt bewust geen extra geometrische gevolgtrekkingen toe, ook niet bij no-touch. Eerdere treffers blijven `unresolved-hit`, zelfs als een mens hun toewijzing zou kunnen afleiden. Dat verliest geen oorspronkelijke observatie: tijd, zinkmoment en gezonken ID blijven in de andere kanalen beschikbaar. Er wordt geen verbonden cluster ingekleurd als bewezen gezonken schip.

Kanaal 15 is voor dit beperkte bereik uit 9–13 afleidbaar. Het is bewust een eenvoudig algemeen signaal voor de CNN; het geldt niet als nieuwe informatie. De vijf afloat-vlakken zijn evenmin geheime resterende lengtes: ieder zinkbericht noemt in dit bereik het ID. Anonieme sunk of ship-type-hit vraagt een andere encoder/compatibiliteitsversie; vul zulke invoer niet met een gok of stilzwijgende nullen.

`shot-order` wordt in beide talen eerst als dezelfde verhouding van twee gehele getallen berekend en daarna één keer naar IEEE-754 float32 afgerond. Gebruik geen afzonderlijke float16- of vooraf afgeronde percentages. Geen mean/std-normalisatie, clipping of kleurwaarden. Labels blijven aparte arrays.

### Controleerbare voorbeelden

Bij een leeg vijandelijk bord zijn kanaal 0 en alle vijf afloat-vlakken overal 1; alle andere vlakken zijn 0. Alle 100 cellen zijn legaal. Een eigen mis op B1 geeft daarna `miss[0,1] = 1`, `unknown[0,1] = 0`, `shot-order[0,1] = float32(0.01)` en een false-actiemasker op index 1.

Ambigu voorbeeld: uitgaande historie A1 hit, B1 hit, B2 hit, A2 sunk met ID destroyer. De destroyer kan op A1–A2 liggen, met B1 en B2 als treffers op verschillende andere schepen; hij kan ook op A2–B2 liggen, met A1/B1 als treffers op een nog niet gezonken cruiser. Beide kunnen dezelfde publieke historie geven. De encoder kent alleen A2 zeker als gezonken: A1, B1 en B2 blijven kanaal 2. Destroyers afloat-vlak is 0, zijn ID-vlak markeert alleen A2. De tijdwaarden zijn achtereenvolgens float32(0.01), float32(0.02), float32(0.03), float32(0.04). Het model mag verschillen in verborgen vloot nooit in de input terugvinden.

### Publieke encoder-API

```ts
interface EncodedObservation {
  readonly encodingVersion: "sts-observation-v1";
  readonly values: Float32Array;
  readonly legalMask: readonly boolean[];
}

declare function encodeObservation(
  view: PlayerView,
  rules: RuleSet,
): EncodedObservation;
```

Deze functie weigert incompatibele regels, verkeerde fase/actor, tegenstrijdige historie en onjuiste view-signatuur. Zij heeft geen RNG en leest geen runtimeglobal. Shapes en waarden worden door fixtures vastgelegd; zie [ADR 0032](adr/0032-observation-encoding.md).

## Dataset: scheiden vóór het maken van observaties

De datageneratie gebruikt uniforme gelabelde vloten en PCG32-streams uit 05/06. De eerste configuratie maakt 12.000 doelvloten: 9.000 training, 1.500 validatie voor early stopping en 1.500 development voor modelvergelijking. De definitieve releasebenchmark krijgt een afzonderlijk vooraf vastgelegd seedplan volgens 06; die partijen zitten niet in deze 12.000.

Splits op doelvloot/episodegroep, nooit achteraf op losse observatierijen. Alle observaties, gedragsstrategieën en symmetrische varianten van dezelfde vloot horen bij dezelfde split. Controleer ook een digest van de bezettingskaart, gecanonicaliseerd over de acht rotatie-/spiegelsymmetrieën van het vierkante bord. Dezelfde bezetting met verwisselde gelijke scheepslengtes mag zo niet als een nieuwe onafhankelijke testvloot tellen. Een overlap laat dataset-/evaluatievoorbereiding falen en wordt vóór enige modelscore opgelost.

De eerste gedragsmix is gelijk verdeeld over Easy, Normal en Hard, per split via een vooraf geschudde lijst. Iedere episode kiest één strategie en schiet de doelvloot volledig leeg. Bewaar de observatie **vóór** ieder schot. Kies maximaal 16 verschillende beslismomenten per episode: altijd het eerste, daarna tot 15 uniform zonder teruglegging uit de overige momenten. De selectie gebruikt een eigen seedstroom. Deze samplingkeuze geeft elke voldoende lange episode evenveel voorbeelden; zij is geen claim dat alle mogelijke observaties uniform verdeeld zijn.

Voorkom een tweede Python-implementatie van Normal/Hard: de Python-dataset-CLI orkestreert een Node-rolloutproducer uit `benchmark`, die dezelfde TS-bots, sampler en feedbackfuncties gebruikt. Uitwisseling gebeurt via geversioneerde JSONL-bestanden, zonder directe TS-imports in Python. De Python-simulator valideert/replayt de regels, vloten en schoten onafhankelijk en weigert afwijkende uitkomsten vóór encoding. Dit maakt ook simulatorpariteit onderdeel van iedere datasetbouw. De CLI meldt duidelijk wanneer de vooraf gebouwde TS-packages ontbreken.

| Artefact | Minimale inhoud |
|---|---|
| Seedplan | Versie, split/episode-ID, expliciete beginstates per RNG-stroom; digest en generatorversies |
| Episode-JSONL | Schema, regels/signaturen, gedrag-ID/versie, geprivilegieerde doelvloot, acties en publieke feedback vóór/na elk schot |
| Datasetmanifest | Digests van shards/seedplans/config, split- en sampleaantallen, geselecteerde momenten, code-/simulator-/encodingversie |
| Trainingssample | Geëncodeerde observatie, legaal masker, aparte 0/1-bezettingskaart en herleidbare episode/sample-ID |

Vloten en labels zijn alleen aan de datagenerator/loss beschikbaar. De encoder wordt met publieke data aangeroepen; het argument bevat ook in training geen private state. Sla compacte episodes op in shards van maximaal 1.000 episodes; decodeer tensors per minibatch. Zo hoeft geen complete float32-dataset in RAM te staan. Archiveer seedplans en ruwe data als lokale of W&B-artefacten, niet als productieassets.

Augmentatie kiest tijdens training één van acht symmetrieën met een aparte vastgelegde RNG. Transformeer historie, input, label en masker samen; schip-IDs en tijdwaarden blijven bij hun getransformeerde cel. Validatie/development blijft vast. Alleen transformaties die de huidige regels bewaren zijn toegestaan; deze acht gelden voor het vierkante v1-bord. Een later model in de gedragsmix krijgt een nieuw datasetmanifest met exact model-ID/digest en een expliciete nieuwe mix, bijvoorbeeld 25% per strategie.

## Kleine CNN-baseline

Een convolutionele laag zoekt hetzelfde patroon op iedere bordpositie. ReLU voegt niet-lineariteit toe. Dilation vergroot het bereik van een filter zonder extra gewichten. De baseline gebruikt geen pooling: de output blijft één score per oorspronkelijke cel.

| Laag | Kanalen | Kernel / dilation / padding | Uitvoer bij inferentie |
|---|---|---|---|
| Conv + ReLU 1 | 16 → 32 | 3 × 3 / 1 / 1 | `[1,32,10,10]` |
| Conv + ReLU 2 | 32 → 32 | 3 × 3 / 1 / 1 | `[1,32,10,10]` |
| Conv + ReLU 3 | 32 → 32 | 3 × 3 / 2 / 2 | `[1,32,10,10]` |
| Conv + ReLU 4 | 32 → 32 | 3 × 3 / 2 / 2 | `[1,32,10,10]` |
| Conv + ReLU 5 | 32 → 32 | 3 × 3 / 4 / 4 | `[1,32,10,10]` |
| Logit-head | 32 → 1 | 1 × 1 / 1 / 0 | `[1,1,10,10]` |

Alle convoluties hebben stride 1, groups 1 en bias. Het nominale receptive field is 21 × 21; bordranden gebruiken zero padding. Er zijn 41.665 parameters, oftewel 166.660 bytes ruwe float32-gewichten. ONNX bevat daarnaast graphmetadata; de daadwerkelijke bestandslimiet blijft 1.000.000 bytes. Dit is een berekening, geen gemeten artefactgrootte of telefoonprestatie.

Geen dropout, batchnorm, softmax, pooling of externe custom operators in deze baseline. Een sigmoid hoort alleen bij loss/uitleg buiten de export. Conv ondersteunt expliciete padding en dilation in de [ONNX-operatorspecificatie](https://onnx.ai/onnx/operators/onnx__Conv.html); runtimeondersteuning wordt daarnaast met de werkelijke export getest.

### Loss en optimalisatie

Gebruik `BCEWithLogitsLoss(reduction="none")`: binary cross entropy combineert logits en binaire doelen numeriek stabiel. De unreduced variant laat project-specifieke maskering toe. [PyTorch loss-documentatie](https://github.com/pytorch/pytorch/blob/main/torch/nn/modules/loss.py), via Context7 geraadpleegd op 2026-10-31.

Voor ieder sample: tel alleen losses op legale onbeschoten cellen en deel door het aantal legale cellen; neem vervolgens het gemiddelde over de minibatch. Een terminale observatie met nul legale cellen hoort niet in de trainingsset. Labels zijn 1 op alle werkelijke scheepscellen, 0 op water; reeds bekende cellen hebben lossgewicht 0. Zo verdient het model geen gemakkelijke score door alleen oude treffers te kopiëren.

Start met AdamW, learning rate 0,001, weight decay 0,0001, batch 64, maximaal 20 epochs en early-stoppingpatience 4. Bewaar de laagste validatie-loss, met het vroegste epoch bij gelijkheid. Geen `pos_weight` in de baseline: class weighting verandert de betekenis van gekalibreerde scores en krijgt alleen als apart experiment een plek. Log masked BCE, Brier-score op legale cellen, gemiddelde top-1-trefscore en een kalibratietabel met tien vaste bins; spelsterkte komt uit de developmentbenchmark.

### Reproduceerbaarheid en laptopprofiel

Training gebruikt eigen seeds voor gewichtsinitialisatie, batchvolgorde en augmentatie; zij delen geen game-/plaatsingsstroom. Leg Python, PyTorch, NumPy, ONNX, runtimes, uv, OS, processor, threadaantal, lockfiledigests en gitcommit vast. Gebruik deterministische algoritmen met harde fout bij ontbrekende ondersteuning, geen genegeerde waarschuwing. Begin met CPU, maximaal vier rekenthreads en DataLoader-workers 0. Een pilot van 200 trainingsepisodes en drie epochs controleert RAM, doorlooptijd en loss voordat de volledige baseline start.

Het ontwerp beoogt trainen op een laptop met 8 GB RAM; een gemeten trainingsduur ontbreekt nog. Schaal bij onvoldoende capaciteit eerst batch/shardgrootte of datasetomvang expliciet terug in een nieuwe config. Een GPU of Colab is optioneel en krijgt een eigen runprofiel en pariteitscheck; er worden nu geen cloudresources gestart.

Exacte herhaling wordt alleen binnen dezelfde vastgelegde software/hardwareconfiguratie nagestreefd. PyTorch garandeert geen identieke training over releases, platforms of CPU/GPU heen. [Officiële reproduceerbaarheidsnotities](https://github.com/pytorch/pytorch/blob/main/docs/source/notes/randomness.md). De deterministische core met dezelfde commands is een afzonderlijke, sterkere eis.

Een trainingscheckpoint bevat model- én optimizerstate, epoch, beste validatiescore, patiencecounter en alle trainings-RNG-states. Hervatten begint uitsluitend met dezelfde dataset/config/toolchain; een gewijzigde config is een nieuwe run. Het inferentiemodel bevat alleen de voor forward benodigde gewichten en graph.

## Pipelinecommando's en artefacten

Onderstaande opdrachten zijn het te bouwen CLI-contract. Ze werken pas nadat de tooling, TS-rolloutproducer en Python-package zijn geïmplementeerd. Zij worden nu niet uitgevoerd. Alle configpaden worden relatief aan de repositoryroot opgelost, ongeacht de working directory van een subprocess.

| Stap | Toekomstig commando vanaf repositoryroot | Resultaat en review |
|---|---|---|
| Dataset | `uv run --project ml --locked python -m sinktheship_ml.cli dataset --config ml/configs/classic-baseline.toml` | Seedplans, episodes en gevalideerd datasetmanifest; controleer splits/lekkage |
| Trainen | `uv run --project ml --locked python -m sinktheship_ml.cli train --config ml/configs/classic-baseline.toml` | Beste checkpoint, resolved-config, toolchain, logs en runreferentie |
| Development-evaluatie | `uv run --project ml --locked python -m sinktheship_ml.cli evaluate --config ml/configs/classic-baseline.toml --stage development` | Voorspellingsmetrics en solo-schoten; hiermee kandidaten kiezen |
| Export | `uv run --project ml --locked python -m sinktheship_ml.cli export --config ml/configs/classic-baseline.toml` | ONNX, candidate-manifest, MODEL_CARD en export-/pariteitsrapport |
| Definitieve evaluatie | `uv run --project ml --locked python -m sinktheship_ml.cli evaluate --config ml/configs/classic-baseline.toml --stage release` | Roept TS/Node-harness aan met bevroren kandidaat/holdout; afzonderlijke browserkwalificatie verplicht |
| Publicatie voorbereiden | `uv run --project ml --locked python -m sinktheship_ml.cli publish --config ml/configs/classic-baseline.toml` | Valideert poorten en maakt lokaal een nieuwe modelmap plus promotiediff voor review |

`publish` doet geen netwerkupload, Git-push of deployment. Publicatie op de site volgt na review via de gewone statische release. Iedere stap is zelfstandig herhaalbaar op contentdigests; bestaande andere output wordt niet stil overschreven. Configs, modelkaarten en rapportverwijzingen staan in Git; grote ruwe datasets/checkpoints gaan in de artefactopslag. De 1 MB-modelartefacten kunnen met hun manifest in de modelmap worden opgenomen; repositorybeleid wordt in de setup-taak vastgelegd.

`--locked` voorkomt dat uv tijdens een run ongemerkt de lockfile bijwerkt. [uv-projectsynchronisatie](https://github.com/astral-sh/uv/blob/main/docs/concepts/projects/sync.md). De Python-toolingkeuze staat in [ADR 0041](adr/0041-python-tooling.md).

Voorbeeld van een **voorgestelde** experimentconfig, nog geen bestaand bestand:

```toml
schema_version = 1
experiment_id = "classic-baseline"
rules_path = "ml/configs/rules/classic.json"
encoding_version = "sts-observation-v1"
output_dir = "artifacts/classic-baseline"
model_id = "classic-cnn"
model_version = "0.1.0"

[dataset]
seed = 17001
train_episodes = 9000
validation_episodes = 1500
development_episodes = 1500
samples_per_episode = 16
behavior_weights = { easy = 1, normal = 1, hard = 1 }
augmentation = "square-d4"

[model]
width = 32
dilations = [1, 1, 2, 2, 4]

[training]
seed = 27001
batch_order_seed = 27002
augmentation_seed = 27003
device = "cpu"
threads = 4
loader_workers = 0
batch_size = 64
max_epochs = 20
patience = 4
learning_rate = 0.001
weight_decay = 0.0001

[export]
opset = 18
external_data = false
atol = 0.00001
rtol = 0.0001

[evaluation]
release_seed_plan = "artifacts/seed-plans/classic-release-001.json"
blocks = 5000
bootstrap_replicates = 10000
bootstrap_seed = 37001

[logging]
mode = "offline"
project = "sinktheship"
```

De config wordt strikt gevalideerd: onbekende keys, negatieve aantallen, verkeerde encoding/regelfamilie of een release-seedplan dat training/selectie bevat zijn fouten. De datasetmasterseed maakt vooraf expliciete PCG-beginstates per stroom; bots krijgen alleen hun eigen afzonderlijke stream. Het release-seedplan is een apart artefact, geen automatische afleiding van de trainingsseed. Exacte toolversies komen uit de vastgelegde lockfiles en de door de run geproduceerde resolved-config.

## Logging en offline werken

Iedere run schrijft altijd een lokaal machineleesbaar config-/metrics-/artefactregister en gebruikt daarnaast het W&B-SDK in expliciet gekozen `offline` of `online` modus. Offline is de standaard van de voorbeeldconfig en vereist geen login of netwerk. Er wordt niet eerst geprobeerd in te loggen. De mode en eventuele uploadfout worden zichtbaar gelogd; verlies van online logging vernietigt geen trainingscheckpoint.

W&B bewaart config, leer-/validatiecurves, development-/releasemetrics en benoemde dataset-/modelartefacten. De browserapp bevat geen W&B-SDK en uploadt geen spelersgegevens. Een modelmanifest verwijst naar een online run of een lokaal archiveerbaar run-ID met relatieve padverwijzing. Een offline model kan kwalificeren; toegang tot een W&B-account is geen promotievoorwaarde.

Latere synchronisatie is een afzonderlijke expliciete handeling via `wandb sync` met de werkelijk gelogde runmap. De tooling toont na afloop een complete kopieerbare opdracht voor de uv-omgeving; zij voert die niet automatisch uit. De [W&B-runlifecycle](https://github.com/wandb/wandb/blob/main/docs/sdk/run-lifecycle.md) beschrijft offline registratie en latere replay; config/metrics en artefacten worden via [de SDK-run-API](https://github.com/wandb/wandb/blob/main/wandb/sdk/wandb_run.py) vastgelegd. Er wordt in deze fase niets naar W&B geschreven. Entity/projectbestemming blijft Q-04.

## Export en numerieke pariteit

Exporteer de geselecteerde checkpoint in evaluatiemodus, float32, vaste inputshape, inputnaam `observation`, outputnaam `logits`, opset 18 en zonder externe weightbestanden. Gebruik de huidige `torch.export`-gebaseerde ONNX-exporter via `torch.onnx.export` met expliciet `dynamo=True` en `external_data=False`; vertrouw niet op veranderlijke defaults. De [PyTorch-exportdocumentatie](https://github.com/pytorch/pytorch/blob/main/docs/source/onnx.md) beschrijft deze exporter. De setup-taak pinnt een samen werkende PyTorch/ONNX/ONNXScript/ORT-combinatie; deze spec verzint geen reeds gevalideerde versies.

Opset 18 is een projectkeuze voor deze eenvoudige graph. Controleer de werkelijk geproduceerde opset, ONNX-IR-versie en operatorlijst; een exporterconversie mag die niet ongemerkt verhogen. Voer `onnx.checker.check_model` met volledige controle uit en test laden op alle bedoelde providers. [ONNX checker](https://onnx.ai/onnx/api/checker.html) en [ORT-compatibiliteit](https://onnxruntime.ai/docs/reference/compatibility.html). Een geldige ONNX-file alleen bewijst geen browserverenigbaarheid.

| Vergelijking | Exacte poort |
|---|---|
| TS-regels ↔ Python-simulator | Exact gelijke geldigheid, signatures, publieke uitkomsten, zinken, beurtverloop en eindstate op gedeelde fixtures |
| TS-encoder ↔ Python-encoder | Exact dezelfde float32-bitpatronen en maskers op alle encodingfixtures |
| PyTorch CPU ↔ ORT Python CPU ↔ ORT Node CPU ↔ ORT Web WASM | Alle outputs eindig; per cel `abs(actual - reference) ≤ 1e-5 + 1e-4 * abs(reference)`, met PyTorch als vaste referentie |
| Schotselectie | Exact dezelfde gekozen cel én volgende RNG-state bij dezelfde publieke input en schot-RNG op de pariteitsset |
| Gesloten replay | 100 afzonderlijke development-doelvloten per geclaimde regelfamilie: dezelfde volledige schotreeks in PyTorch-referentie, Node en Web bij dezelfde RNG |

De pariteitsset bevat alle golden encodinggevallen plus 1.000 vaste development-observaties, verspreid over begin/midden/einde en de drie gedragsstrategieën. Deze set is niet de release-holdout. Leg de grootste absolute/relatieve afwijking, aantal schendingen en verschilgevallen vast. Een gemiddelde afwijking mag geen uitbijters verbergen.

Nagenoeg gelijke logits kunnen ondanks een geslaagde numerieke tolerantie een andere argmax geven. Daarom is beslispariteit een afzonderlijke gate. De policy blijft de in 06 goedgekeurde exacte argmax met uniforme keuze uit exact gelijke maxima; geen epsilon-ties of heimelijke afronding toevoegen. Een mismatch blokkeert kwalificatie voor dat runtimeprofiel totdat model/runtime is aangepast en opnieuw getoetst. De tests bewijzen overeenstemming op de getoetste set, geen universele gelijkheid op alle mogelijke observaties.

Bij wijziging van runtime, provider, optimalisatieflags of numerieke precisie volgt herkwalificatie. Leg het profiel-ID naast model-ID/versie/digest vast in een neural checkpoint. Een ontbrekend of gewijzigd profiel krijgt dezelfde expliciete herstelkeuze als een ontbrekend model; geen stille vervanging. Engine-replay met al vastgelegde commands blijft onafhankelijk van toekomstige inferentieafrondingen.

### Golden fixtures

Gedeelde bestanden krijgen `fixtureVersion`, uniek ID, gekoppelde RULE-/AT-ID, regels, publieke invoer en verwachte uitvoer. Encodingfixtures bevatten een volledige vlakke `expectedTensor` met 1.600 JSON-getallen die exact de bedoelde float32-waarden voorstellen, `expectedMask` met 100 booleans en een SHA-256 over expliciet little-endian float32-bytes. Een korte tekst licht interessante cellen toe; de hash vervangt de waarden niet. Verwachtingen worden niet tijdens de test met dezelfde encoder gegenereerd.

| ID | Verplicht geval |
|---|---|
| ML-01 | Leeg bord, eerste mis, A1/B1/A2-asonderscheid en de laatste bordcel |
| ML-02 | Twee verborgen vloten met exact de ambigue publieke historie hierboven: identieke tensors |
| ML-03 | Zinkbericht markeert alleen de zinkcoördinaat, juiste ID-plane en afloat-plane |
| ML-04 | Interleaved inkomende schoten veranderen geen eigen schotindexnormalisatie of tensor |
| ML-05 | Verkeerde bordmaat, vloot, hit-/sunkvorm, encodingversie of view-signatuur wordt geweigerd |
| ML-06 | Rotatie/spiegeling behoudt labels, masker, schip-ID en schotmoment; geen splits door augmentatie |
| ML-07 | Numerieke pariteit inclusief nul-/negatieve logits, zeer kleine verschillen en exact gelijke maxima |
| ML-08 | Een hoge score op een reeds beschoten cel kan nooit geselecteerd worden; geen NaN/Infinity geaccepteerd |
| ML-09 | Datasetlabels/plaatsingsseeds wijzigen bij gelijkblijvende publieke input verandert de tensor niet |
| ML-10 | Replay vanuit checkpoint gebruikt hetzelfde model/profile/RNG; stale inference wordt verworpen |

De rest van de regel-/RNG-fixtures komt uit 02/05; geen tweede regeldefinitie in dit document. Zie [ADR 0033](adr/0033-cross-language-parity.md).

Aanvullende integratiegevallen voor de latere bouw:

| ID | Verwachting |
|---|---|
| ML-11 | Een candidate met hoger versienummer wordt geen standaard; twee concurrerende promotie-uiteinden laten de catalogusbuild falen. |
| ML-12 | Een geldige opvolger verandert de keuze voor nieuwe spellen, terwijl een bestaande snapshot zijn exacte oude model-/profielreferentie houdt. |
| ML-13 | Corrupt cachemateriaal wordt geweigerd; een cache-opslagfout kan gecontroleerd laden in geheugen toelaten zonder niveauwissel. |
| ML-14 | Een gekopieerde of symmetrisch equivalente doelvloot over splits laat de datasetvoorbereiding falen vóór training/evaluatie. |
| ML-15 | Een offline run zonder account/netwerk levert config, metrics, checkpoint en runreferentie; synchronisatie start alleen als afzonderlijke opdracht. |

## Modelmanifest en runnercontract

Deze sectie vervangt de voorlopige modeltypen uit 04 en is de enige eigenaar van hun definities. Paden hieronder zijn provenance- of assetreferenties, geen impliciete toestemming voor willekeurige netwerkrequests.

```ts
interface TensorSpec {
  readonly name: string;
  readonly dtype: "float32";
  readonly shape: readonly number[];
  readonly layout: "NCHW";
}

interface ArtifactReference {
  readonly path: string;
  readonly sha256: string;
}

interface ModelReference {
  readonly id: string;
  readonly version: string;
  readonly sha256: string;
}

type RunReference =
  | { readonly kind: "offline"; readonly runId: string; readonly archivePath: string }
  | { readonly kind: "wandb"; readonly runId: string; readonly url: string };

interface RuntimeProfile {
  readonly id: string;
  readonly package: "onnxruntime-web" | "onnxruntime-node" | "onnxruntime";
  readonly version: string;
  readonly provider: "wasm" | "cpu";
  readonly threads: 1;
  readonly graphOptimization: "disabled";
  readonly precision: "float32";
  readonly assetSetSha256: string;
}

interface ModelCompatibility {
  readonly strategySignature: string;
  readonly rules: readonly {
    readonly rulesSignature: string;
    readonly rules: RuleSet;
  }[];
  readonly turns: readonly TurnConfiguration[];
}

interface ModelMetrics {
  readonly releaseRulesSignature: string;
  readonly comparison: "hard" | "champion";
  readonly control: string;
  readonly games: number;
  readonly blocks: number;
  readonly wins: number;
  readonly winRate: number;
  readonly winRateCi95: readonly [number, number];
  readonly soloMean: number;
  readonly soloMedian: number;
  readonly soloP90: number;
  readonly pairedMeanDelta: number;
  readonly pairedMeanDeltaCi95: readonly [number, number];
  readonly errors: number;
}

type ModelPromotion =
  | { readonly status: "candidate" }
  | {
      readonly status: "promoted";
      readonly promotedAt: string;
      readonly supersedes: readonly ModelReference[];
      readonly decisionReport: ArtifactReference;
    };

interface ModelManifest {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly version: string;
  readonly createdAt: string;
  readonly modelPath: "model.onnx";
  readonly sha256: string;
  readonly byteLength: number;
  readonly encodingVersion: "sts-observation-v1";
  readonly policyVersion: "masked-argmax-v1";
  readonly compatibility: readonly ModelCompatibility[];
  readonly input: TensorSpec;
  readonly output: TensorSpec;
  readonly onnx: {
    readonly opset: number;
    readonly irVersion: number;
    readonly externalData: false;
  };
  readonly runtimeProfiles: readonly RuntimeProfile[];
  readonly training: {
    readonly config: ArtifactReference;
    readonly datasetManifest: ArtifactReference;
    readonly toolchain: ArtifactReference;
    readonly codeCommit: string;
    readonly run: RunReference;
  };
  readonly evaluation: {
    readonly report: ArtifactReference;
    readonly parityReport: ArtifactReference;
    readonly performanceReport: ArtifactReference | null;
    readonly metrics: readonly ModelMetrics[];
  };
  readonly promotion: ModelPromotion;
}

interface ModelLoadProgress {
  readonly stage: "runtime" | "download" | "verify" | "initialize";
  readonly loadedBytes: number;
  readonly totalBytes: number | null;
}

interface ModelRunner {
  readonly profile: RuntimeProfile;
  load(
    manifest: ModelManifest,
    cancellation: Cancellation,
    onProgress?: (progress: ModelLoadProgress) => void,
  ): Promise<void>;
  infer(input: Float32Array, cancellation: Cancellation): Promise<Float32Array>;
  dispose(): Promise<void>;
}
```

De runtimeadapter beheert één geladen model per runner. `infer` vóór succesvolle load, na dispose, met een verkeerde lengte of niet-eindige waarden faalt. Calls zijn geserialiseerd. Input-/outputarrays zijn eigendom van die call en worden niet later stiekem gemuteerd. Het publieke runtimeprofiel bevat geen Node-/DOM-objecten. Annulering biedt geen belofte dat iedere provider een lopende kernel kan onderbreken; de sessie accepteert een geannuleerd resultaat nooit.

### Manifestvalidatie

- Valideer JSON strikt: alleen genoemde keys, bekende versies, eindige getallen, echte positieve gehele dimensies/aantallen en SHA-256 als 64 lowercase hextekens. IDs volgen de core-ID-vorm; modelversies gebruiken `major.minor.patch` zonder prerelease/buildsuffix. Datumvelden zijn UTC-ISO-8601 met `Z`.
- `modelPath` is exact `model.onnx` binnen de modelmap; geen absolute URL, `..`, redirect naar een andere origin of extern weightbestand. Provenancepaden zijn relatieve repository-/artefactpaden zonder traversal; de browser haalt die trainings-/rapportbestanden niet op. W&B-URLs zijn alleen metadata, geen input voor de loader.
- V1 heeft exact één strategie-entry per model; daarin staan complete geldige RuleSets. Herbereken beide signaturen. `turns` moet precies de unieke beurtconfiguraties van die entries bevatten. Duplicaten en verklaringen zonder evaluatie zijn fouten.
- Iedere aangeboden beurtvariant heeft entries voor `random`, `player-1` en `player-2`. De benchmark bewaart de random release-signatuur plus de twee uitvoeringssignaturen zoals in 06. Een willekeurige nieuwe quota wordt niet gedekt doordat de strategiesignatuur toevallig gelijk is.
- Controleer input/output exact tegen de encoding, werkelijke graphmetadata, bestandsgrootte en digest. Profielversies zijn exact, geen `latest` of open range. Alleen Web/WASM en Node-of-Python/CPU zijn geldige package/providercombinaties. `assetSetSha256` beschrijft de gebruikte runtimebestanden/config in een reproduceerbaar profielartefact.
- Metrics worden uit het volledige evaluatierapport afgeleid en gecontroleerd: aantallen, winrate, intervallen, fouten en bijbehorende controles moeten overeenkomen. Een handmatig getypt `promoted`-veld zonder rapporten is geen voldoende bewijs.
- Een candidate mag een null-performancerapport en nog geen metrics hebben; de productiecatalogus neemt hem niet op. Promoted vereist alle rapporten, nul fouten, de poorten uit 06 en het model-/telefoonbudget. Q-06 moet dus zijn opgelost vóór promotie.

Het `RuntimeProfile.id` is een afzonderlijk geversioneerd profielkenmerk: `runtime/v1:` plus de SHA-256 van zijn canonieke JSON-inhoud zonder het veld `id`, met recursief gesorteerde objectkeys en zonder whitespace. De core-ID-beperking hierboven geldt voor model-IDs, niet voor dit profielkenmerk. Twee verschillende runtimeconfiguraties kunnen daardoor niet op basis van een handmatig hergebruikt label als hetzelfde profiel worden behandeld. De profile-digest wordt buiten de dependencyvrije core berekend.

Er is geen voorbeeldmanifest met verzonnen metrics, modeldigest of run-URL. De pipeline genereert dat pas uit echte artefacten. Een modelkaart beschrijft doel, ondersteunde regels, data/gedragsmix, modelopbouw, metrics, runtimeprofielen, beperkingen, licentie/herkomst en reproduceerstappen.

## Discovery, standaardselectie en promotie

De build scant uitsluitend `models/<id>/<version>/manifest.json`, met bijbehorende `model.onnx` en `MODEL_CARD.md`. De browser kan een statische servermap niet zelf enumereren. De build valideert de modellen en genereert een compacte catalogus met benodigde compatibiliteit, versie, digest en asset-URL; ruwe episodes, seeds, trainingcheckpoints en rapportinhoud worden niet meegekopieerd. Het runtime/modelbestand blijft lazy. Een nieuwe compatibele modelmap vereist een nieuwe build/release, geen wijziging van applicatiecode.

Resolvervolgorde: valideer regels → volledige regelentry/strategy/turnmatch → ondersteunde encoding/policy → exact gekwalificeerd runtimeprofiel → geldige promotieketen. Een unsupported-uitkomst levert een vaste reasoncode voor vertaling, bijvoorbeeld `NO_MODEL_FOR_RULES`, `ENCODING_UNSUPPORTED`, `RUNTIME_UNQUALIFIED` of `CATALOG_INVALID`. De UI kiest niet zelf het nieuwste versienummer.

Een promoted manifest noemt met `supersedes` de vorige standaard(en) op exacte ID/versie/digest. De eerste promotie heeft een lege lijst en een Hard-vergelijking. Een latere promotie vervangt de bestaande terminale standaard, met minstens dezelfde ondersteunde regelentries en de huidige productieprofielen. Meer compatibiliteit mag alleen met aanvullende kwalificatie. Per strategie/regel/runtime moet precies één terminale promoted kandidaat overblijven. Ontbrekende voorgangers, cycli of twee concurrerende uiteinden laten de build falen. Een hogere versie of recentere datum wint niet automatisch.

Dit maakt toevoegen mogelijk met uitsluitend de nieuwe modelmap: het nieuwe manifest verklaart de vervanging; het oude hoeft niet te worden herschreven. Oude manifests/gewichten blijven beschikbaar voor opgeslagen potjes. Hervatten zoekt exact de opgeslagen modelreferentie en het runtimeprofiel, onafhankelijk van de nieuwe standaard. Is dat artefact niet meer bruikbaar, dan volgt uitleg en expliciet herproberen of een andere tegenstander kiezen; een lopend spel wordt nooit ongemerkt opgewaardeerd.

Promotieproces: kandidaat kiezen op development → config/gewichten bevriezen → export/pariteit → Node-releasebenchmark → browserpariteit/performance → rapporten valideren → nieuwe modelmap/promotiediff reviewen → statische release. De criteria uit 06 worden niet opnieuw gedefinieerd. Na tunen op een holdout-uitkomst is een volgende definitieve toets een nieuwe vooraf vastgelegde holdout. [ADR 0036](adr/0036-model-and-locale-discovery.md) legt discovery en deze standaardselectie vast.

## Browserruntime, caching en fouten

De Game Worker bestaat al voor klassieke bots. Pas na expliciete keuze voor Impossible wordt daarin ONNX Runtime Web geladen. Start met WASM, één thread, float32 en uitgeschakelde graphoptimalisatie voor een eenvoudig pariteitsprofiel. Stel `env.wasm.numThreads = 1` en `env.wasm.proxy = false` vóór de eerste sessie in; er is al een eigen Worker. De ONNX Node-/Python-CPU-profielen gebruiken eveneens één inferentiethread. Trainingsparallelisme staat hiervan los.

Host de JS-/MJS-/WASM-assets uit dezelfde gepinde ORT-build op de eigen origin en leg hun namen/digests in het runtimeprofiel vast. Gebruik de assetconfiguratie van die gepinde versie; kopieer geen historisch bestandsnaampatroon uit een ander ORT-release. De [officiële Web-configuratiegids](https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html) beschrijft threads, proxy en assetlocaties. Multithreading wordt pas een nieuw profiel na winst in metingen en cross-origin-isolationconfiguratie; WebGPU vraagt eveneens een aparte ADR/kwalificatie. [ADR 0035](adr/0035-model-runtime.md).

Laadverloop: compatibiliteit vaststellen → gevalideerde cachebytes zoeken → anders model downloaden → respons/byteaantal/digest controleren → sessie initialiseren → namen/shapes controleren → één eindige smoke-inferentie → ready. Het model wordt via gecontroleerde bytes aan ORT gegeven, niet via een ongevalideerde URL die de runtime zelf ophaalt. Een HTML-SPA-fallback of niet-eindige output is een fout, ook bij HTTP 200.

De browseradapter biedt een persistente binaire cache buiten de kleine spel-snapshots, met contentdigest als modelkey en runtimeversie als assetnamespace. Alleen volledig gevalideerde bytes worden gepubliceerd in de cache. Een cachehit wordt opnieuw op lengte/digest gecontroleerd; corrupt materiaal wordt verwijderd en hoogstens één keer opnieuw opgehaald. Bij geblokkeerde/volle cache mag laden in geheugen doorgaan met zichtbare uitleg dat offline/hergebruik niet gegarandeerd is. Deze cache alleen maakt de hele app nog geen PWA.

Houd het actieve model en de actuele hervatmodelreferentie vast; ruim overige cachemodellen op volgens laatst gebruik met een voorgesteld modelcachebudget van 20 MB. Runtimecache heeft een aparte namespace/budget dat bij de eerste werkelijke bundelmeting wordt bepaald. Overschrijding beïnvloedt opslag, niet de geldigheid van een model. Een cachebeleid mag geen modelwissel in een lopend spel veroorzaken.

De composition root verbindt `ModelLoadProgress` aan de frontendvoorbereiding; `game-session` hoeft daarvoor geen neural-contracttypen te importeren. Downloadvoortgang gebruikt alleen werkelijk ontvangen bytes en een betrouwbare totale lengte; anders toont de UI een bezetstatus. Verify/initialize krijgen faselabels zonder verzonnen percentage. De Node-adapter leest hetzelfde artefact lokaal en gebruikt dezelfde manifest-/shape-/digestcontroles. De gemeenschappelijke JS-API ondersteunt laden uit bytes en expliciete providers: [ORT sessioncontract](https://github.com/microsoft/onnxruntime/blob/main/js/common/lib/inference-session.ts).

| Foutmoment | Verwacht gedrag |
|---|---|
| Geen passend manifest | Impossible zichtbaar uitgeschakeld met vertaalde reden |
| Download, cache-integriteit of runtime-initialisatie faalt | Geen spelstart met dat model; herproberen of expliciet Hard kiezen |
| Inference faalt na spelstart | Lopende actie annuleren, state/RNG behouden; retry of niveauwijziging registreren volgens 05 |
| Browser/Worker sluit tijdens inference | Laatste checkpoint herstellen; onafgemaakte actie opnieuw plannen met hetzelfde model/profile/RNG |
| Stale resultaat na rematch | Geen zet, inzicht, geluid of RNG-commit |

Het ONNX-budget telt uitsluitend `model.onnx`; rapporteer daarnaast alle lazy JS/MJS/WASM-bytes en gecomprimeerde netwerkbytes. Meet p95 `infer` in de Worker met batch 1 na 20 warm-upbeslissingen over 1.000 vaste observaties; dit omvat tensorinvoer, runtimeberekening en outputuitlezen, exclusief download/initialisatie, encoding en denkpauze. Rapporteer die overige kosten afzonderlijk. Q-06 legt telefoon/browser/temperatuur-/meetprofiel vast vóór de eerste kwalificatie. Geen Node-latency als bewijs voor ≤50 ms op telefoon gebruiken.

AI-inzicht gebruikt de vóór de keuze gemaakte output plus masker. In `DecisionInsight.values` krijgen ongeldige cellen 0 volgens 06; het masker laat zien dat zij uitgesloten zijn, niet dat hun kans nul is. Voor geldige cellen mag de heatmap sigmoid tonen als modelscore tussen 0 en 1, met legenda dat deze niet als exacte kans is gekalibreerd. De gekozen cel volgt het oorspronkelijke geldige logitmaximum. De uiteindelijke onthulde vloot wordt nooit alsnog in deze berekening ingevoerd.

## Zelf experimenteren en optionele reinforcement learning

Maak voor ieder experiment een nieuwe config/run, wijzig één hoofdvariabele, gebruik dezelfde developmentvergelijking en houd de release-holdout buiten selectie. Noteer vraag, wijziging, uitkomst en besluit met links naar artefacten; het Notion-experimentenlog volgt pas bij de geautoriseerde workflow.

| Experiment | Te wijzigen | Wat vergelijken / reviewen |
|---|---|---|
| E-ML-01 — Contextbereik | Dilations `[1,1,1,1,1]` tegenover baseline `[1,1,2,2,4]` | Schoten, randgevallen, loss en beslistijd; meer context is geen gegarandeerde winst |
| E-ML-02 — Capaciteit | Breedte 16, 32 of 64 | Over-/underfitting, bytes, telefoonbudget; parameterberekening opnieuw controleren |
| E-ML-03 — Extra laag | Eén extra 3 × 3-laag via de modelconfig | Depth/configschema, pariteit en prestaties; encoder en UI blijven gelijk |
| E-ML-04 — Gedragsmix | 25% eigen model naast Easy/Normal/Hard | Nieuw datasetmanifest, bereik van bezochte observaties, developmentwinrate |
| E-ML-05 — Hoeveelheid data | 2.000 tegenover 9.000 trainingsepisodes | Leercurve, train-/validatiegap en CPU-doorlooptijd |
| E-ML-06 — Informatiewaarde | Ablatie van tijd-/ID-kanalen in een aparte encodingversie | Of publieke historie helpt; geen bestaande modelcompatibiliteit herlabelen |

Fase B met reinforcement learning is optioneel. Begin dan vanuit de supervised gewichten en leer een gemaskeerde schotpolicy met beloning −1 per geldig schot tot voltooiing, zonder kunstmatige extra zinkbonus; maximaliseren van de ongedisconteerde return betekent dan minder schoten. Een policy-gradientbaseline met value-/baselinecorrectie is eerst eenvoudiger te reviewen dan een volledige PPO-pipeline. PPO kan een later experiment zijn. De trainingspolicy mag stochastisch zijn; de te publiceren inferentiepolicy blijft expliciet geversioneerd en wordt in de TS-harness geëvalueerd.

RL krijgt eigen seeds, config, model-/optimizerstate en W&B-run. Controleer variatie tussen ten minste drie trainingsseeds op development. Alleen een kandidaat die de bestaande promotie-, pariteits- en performancepoorten haalt mag de standaard vervangen. Een gewijzigde policy-outputsemantiek krijgt een nieuwe policy-/modelkaartdefinitie; een RL-logit wordt niet als gekalibreerde bezettingskans uitgelegd.

## Acceptatie van de ML-bouw

US-03, US-07, US-13, US-17, US-18, US-19, US-20, US-28 en US-29 zijn leidend. De bouw is reviewbaar wanneer datasetgeneratie, CPU-training, offline logging, export, pariteit, candidate/publicatievoorbereiding en manifestdiscovery afzonderlijk werken en hun artefacten opleveren. V1-kwalificatie vraagt bovendien de benchmarkpoorten uit 06 en de browser-/modelbudgetten; een geslaagde pilot alleen is onvoldoende.

Nog te meten tijdens implementatie: CPU-trainingsduur/RAM, echte ONNX-/runtimegrootte, browserondersteuning van de gepinde build, numerieke/beslispariteit en modelsterkte. Exacte toolversies worden bij setup gekozen en gelockt; Q-04 betreft externe bestemmingen en Q-06 het referentieprofiel. Deze open uitvoeringsmetingen veranderen geen van de hierboven vastgelegde beoordelingscriteria.
