Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Neural network](../07-neural-network.md#browserruntime-caching-en-fouten), [architectuur](../04-architecture.md), [statische host](0020-static-host.md), [leeswijzer](../README.md)

# ADR 0035 — Eerst single-threaded WASM in de bestaande Game Worker

## Besluitbasis

ONNX Runtime Web in een Worker en lazy loading zijn vast. Eén WASM-thread, runtimeprofielen en cachebeleid preciseren het goedgekeurde voorstel.

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

Het model moet de UI vrijlaten, op de gekozen browsers werken en reproduceerbaar met Node/Python worden vergeleken. Een klein ONNX-bestand zegt niets over de grootte van de runtime.

## Besluit

Laad ORT pas bij Impossible in de bestaande Game Worker. Gebruik float32, WASM, één thread, geen extra proxy-Worker en aanvankelijk geen graphoptimalisaties. Pin samenhorende JS/MJS/WASM-assets op eigen origin. De runner valideert gecontroleerde bytes, manifest en output. Modelcache is gescheiden van snapshots, contentgericht en voorgesteld begrensd op 20 MB; actieve/hervatmodellen blijven beschermd.

## Onderbouwing en alternatieven

De [ORT Web-configuratiegids](https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html), gecontroleerd op 2026-10-31, beschrijft flags voor threads, proxy en assets. Multithreaded WASM vraagt geschikte cross-origin isolation en meer hostingconfiguratie; WebGPU vraagt extra provider-/browserkwalificatie. Beide zijn later meetbare alternatieven, niet de eerste standaard. Nog een proxy-Worker voegt bij de bestaande Game Worker onnodige lifecycle toe.

## Gevolgen

Browser en Node hebben eigen adapters achter één port. Runtimeversies/flags worden expliciete profielen; een wijziging vraagt pariteit en benchmark. Cachefalen mag in-memory laden toelaten, maar geen stil modelwisselen. Runtimebytes, cold load, encoding en inferentie worden afzonderlijk gerapporteerd. Een cache levert niet vanzelf volledige offline-appfunctionaliteit.

## Verificatie

AT-13-01/02/03, AT-22-02, AT-29-03 en ML-10; cold/warm load, corruptie, annulering, UI-interactie, profielpinning en ≤50 ms p95 op het nog te kiezen Q-06-profiel. Geen latencyclaim vóór meting.
