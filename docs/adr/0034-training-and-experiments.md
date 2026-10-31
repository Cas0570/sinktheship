Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Neural network](../07-neural-network.md), [benchmark](0030-benchmark-and-promotion.md), [Python-tooling](0041-python-tooling.md), [leeswijzer](../README.md)

# ADR 0034 — CPU-baseline, gescheiden datasets en offline experimenten

## Besluitbasis

CPU-trainbaarheid, W&B/offline logging en supervised als uitgangspunt zijn voorgeschreven. Modelomvang, trainingsconfig en dataverwerking zijn batch-C-keuzes.

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

Het experiment moet op een laptop herhaalbaar zijn en door de ontwikkelaar begrepen kunnen worden. Spelsamples uit dezelfde vloot mogen niet over train en test worden verdeeld. Een betere loss is niet automatisch een betere tegenstander.

## Besluit

Begin met de kleine convolutionele baseline uit 07, masked BCE en compacte episode-shards. Splits vóór observaties/augmentatie op vlootgroep en controleer symmetrische bezettingsoverlap. TS levert rollouts van de bestaande klassieke bots; Python valideert/replayt en traint. Gebruik configs, aparte seeds, lokale artefacten en expliciete W&B-mode. Start met een kleine CPU-pilot. RL volgt alleen als apart gemeten experiment.

## Onderbouwing en alternatieven

Alle tensors tegelijk opslaan/laden vergroot RAM- en schijfgebruik. Alleen random-observaties missen toestanden waarin sterkere bots terechtkomen. Een tweede Python-Hard introduceert extra algoritmeduplicatie; een geversioneerd rolloutbestand houdt de trainingsgrens controleerbaar. GPU/Colab kan sneller zijn, maar mag geen voorwaarde voor de baseline of offline werken worden.

Primaire bronnen: [PyTorch loss](https://github.com/pytorch/pytorch/blob/main/torch/nn/modules/loss.py), [reproduceerbaarheid](https://github.com/pytorch/pytorch/blob/main/docs/source/notes/randomness.md) en [W&B-offlinelifecycle](https://github.com/wandb/wandb/blob/main/docs/sdk/run-lifecycle.md), gecontroleerd via Context7 op 2026-10-31.

## Gevolgen

Een nieuwe datamix of encoder krijgt een nieuw datasetmanifest. Trainingscheckpoints bewaren ook optimizer/RNG-state. Er is geen beloofde trainingsduur of modelwinst; CPU-, export- en benchmarkmetingen bepalen de uitkomst. Browsergebruikersdata gaat nooit naar W&B.

## Verificatie

US-18/19/29; CPU-pilot, offline run zonder login/netwerk, split-lekkagecheck, herhaalbare artefacten en de promotiepoorten. Q-04 bepaalt later de online bestemming; de huidige batch maakt geen run aan.
