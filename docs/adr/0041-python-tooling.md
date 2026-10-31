Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Neural network](../07-neural-network.md#pipelinecommandos-en-artefacten), [training](0034-training-and-experiments.md), [leeswijzer](../README.md)

# ADR 0041 — uv, Ruff en pytest voor het ML-project

## Besluitbasis

Behoud van de expliciete toolingvoorkeur uit de masterprompt, uitgewerkt binnen batch C.

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

De ontwikkelaar moet de Python-pipeline los kunnen starten, controleren en herhalen. Versies mogen niet ongemerkt veranderen tussen training en export.

## Besluit

Een zelfstandig Python-project onder `ml` met `pyproject.toml`, `uv.lock` en vastgelegde interpreter-/uv-versie. Gebruik uv voor omgeving en commands, Ruff voor lint/format en pytest voor unit-/golden-/pariteitstests. CI gebruikt locked installatie/uitvoering, `ruff check`, `ruff format --check` en pytest. Runtime- en ontwikkeldependencies worden gescheiden. De specifieke ondersteunde versies worden in de setup-taak gecontroleerd en gepind; nu wordt niets geïnstalleerd.

## Onderbouwing en alternatieven

`uv run --locked` weigert een verouderde lockfile in plaats van die tijdens uitvoering aan te passen. pip/venv kan werken maar vraagt extra afspraken voor lock/reproduceerbaarheid; Poetry is een passend alternatief zonder aantoonbare reden om de gegeven voorkeur te wijzigen. Ruff brengt lint en format samen; pytest kan ieder gedeeld fixturegeval afzonderlijk rapporteren.

Primaire bronnen via Context7, 2026-10-31: [uv locking/sync](https://github.com/astral-sh/uv/blob/main/docs/concepts/projects/sync.md), [Ruff-configuratie](https://github.com/astral-sh/ruff/blob/main/docs/configuration.md) en [pytest-parametrisatie](https://github.com/pytest-dev/pytest/blob/main/doc/en/how-to/parametrize.rst). CLI-schema's in 07 zijn toekomstig projectcontract, geen bestaande opdrachten.

## Gevolgen

Een schone ontwikkelkopie krijgt expliciete setup en een CPU-pilot. De datagenerator controleert ook de aanwezigheid van de gebouwde Node-rolloutproducer. Python gebruikt geversioneerde bestanden als grens naar TS. Lockfiles worden alleen in een bewuste dependencywijziging vernieuwd.

## Verificatie

AT-18-01/02/03, AT-24-02 en AT-29-01/02; clean-checkout-run, offline logging, lint en fixtures. De complete CI-indeling volgt in batch E; er bestaat nog geen Python-code om te testen.
