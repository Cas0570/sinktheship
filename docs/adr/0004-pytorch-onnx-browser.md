Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Masterprompt](../00-masterprompt.md), [neural network](../07-neural-network.md), [runtimekeuze](0035-model-runtime.md), [leeswijzer](../README.md)

# ADR 0004 — PyTorch trainen, ONNX exporteren, lokaal uitvoeren

## Besluitbasis

Vast besluit uit hoofdstukken 4 en 9 van de masterprompt. Deze tekst documenteert de gekozen keten; de stackkeuze wordt niet heropend.

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

Het leerdoel vraagt een begrijpelijke Python-trainingsomgeving, terwijl de statische webapp zelfstandig in de browser moet kunnen beslissen.

## Besluit

Train met PyTorch, exporteer de geselecteerde checkpoint naar ONNX en voer browserinferentie uit met ONNX Runtime Web in de Game Worker. De TS-benchmark gebruikt een Node-implementatie van dezelfde `ModelRunner`-port. Vergelijk PyTorch, ORT Python, Node en Web vóór vrijgave. Encoder, manifest, shapes en toleranties staan in 07.

## Onderbouwing en alternatieven

De masterprompt bepaalt deze keten. Training uitsluitend in JavaScript of een andere ML-stack wijkt daarvan af. Een Python-inferenceserver zou bovendien de statische v1 en lokale gegevensverwerking wijzigen. ONNX-export maakt een gedeeld artefact mogelijk, maar is geen bewijs van numerieke gelijkheid of ondersteunde operators.

De huidige PyTorch-documentatie beschrijft de `torch.export`-gebaseerde exporter met `dynamo=True`: [ONNX-export](https://github.com/pytorch/pytorch/blob/main/docs/source/onnx.md), via Context7 gecontroleerd op 2026-10-31. Exacte versiecombinaties worden bij setup gepind.

## Gevolgen

Training en spel gebruiken verschillende runtimes en moeten expliciet op pariteit worden gecontroleerd. Model/runtime laden lazy; een fout veroorzaakt geen stille andere moeilijkheid. De gemeenschappelijke modelpackage importeert geen browser- of Node-global buiten de runtimeadapters.

## Verificatie

US-13, US-18, US-19 en US-29; export-/beslispariteit, Node-benchmark en Worker-interactiemeting. In deze documentatiefase is geen model getraind of geëxporteerd.
