Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Neural network](../07-neural-network.md#export-en-numerieke-pariteit), [engine](../05-game-engine.md), [benchmark](../06-opponents.md), [leeswijzer](../README.md)

# ADR 0033 — Exacte fixtures en afzonderlijke numerieke en beslispariteit

## Besluitbasis

TS/Python-golden fixtures en PyTorch/ONNX-pariteit zijn vast. De exacte controles en toleranties staan in [07](../07-neural-network.md#export-en-numerieke-pariteit).

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

Losse tests kunnen twee onderling afwijkende simulatoren ieder groen verklaren. Kleine runtimeverschillen kunnen bovendien een schot veranderen, ook wanneer gemiddelde outputafwijkingen klein zijn.

## Besluit

Gedeelde JSON-fixtures leggen regeluitkomsten en encoding vast. Regels, RNG, maskers en float32-inputs moeten exact overeenkomen. Voor modeloutputs geldt per cel `atol = 1e-5`, `rtol = 1e-4` tegenover PyTorch, plus afzonderlijk identieke geselecteerde cel en volgende RNG-state. Test Node en echte Web-WASM, niet alleen Python. Datasetbouw replayt TS-rollouts onafhankelijk in Python.

## Onderbouwing en alternatieven

Alleen outputgemiddelden verbergen lokale fouten. Alleen numerieke tolerantie garandeert geen argmax; alleen gelijk gekozen acties kan foutieve scores verbergen. Automatisch nieuwe verwachte tensors schrijven uit de gewijzigde encoder test die encoder niet onafhankelijk. Tests krijgen daarom vastgelegde verwachtingen en gerichte as-/ambiguïteitsgevallen.

## Gevolgen

Runtimewijzigingen vragen herkwalificatie en een nieuw profielartefact. Een mislukt criterium wordt niet achteraf verruimd zonder ADR/review. Getoetste overeenstemming wordt niet als universele cross-platformgarantie voorgesteld. Exacte engine-replay en numerieke modelpariteit blijven verschillende claims.

## Verificatie

US-28/29, ML-01 t/m ML-10; 1.000 vaste development-observaties plus golden fixtures en 100 gesloten replays per familie, volgens 07. Geen pariteitsrun is al uitgevoerd tegen een model.
