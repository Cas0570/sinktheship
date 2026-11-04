Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-04

Gerelateerd: [Architectuur](../docs/04-architecture.md)

# fixtures

Gedeelde JSON-golden vectors voor TypeScript en later Python. Zie [kwaliteit](../docs/12-quality-testing.md).


`rules/placement.json` (schemaVersion 1) bevat RULE-01–06 uit document 02: bord, gelabelde scheepslengtes, letterlijke plaatsingen en verwachte status/foutcode per contactregel in `contacts`-volgorde. De coördinaten en verwachtingen zijn uit de referentiegevallen overgenomen, onafhankelijk van productiecode. De TS-test voegt alleen de overige standaardregelvelden toe. RULE-06 bevat afzonderlijk missing/duplicate/unknown. `valid` betekent een complete plaatsing. Nieuwe schema's of gewijzigde verwachtingen vereisen een verklaarde contractwijziging; fixtures worden niet uit de validator geregenereerd. De Python-consument volgt in T34; dit bestand claimt geen taalpariteit.

`rng/pcg32.json` bevat de PCG32-referentie uit [05](../docs/05-game-engine.md#randomness-en-seeds): de ruwe seedwoorden 42/54, geïnitialiseerde state, zes hexoutputs en eindstate. Outputs komen overeen met de vastgelegde officiële C-demo; checkpoints zijn onafhankelijk met de unsigned Python-vertaling van de referentieroutine berekend. Dit is geen hergeneratie uit de TypeScript-code. De algorithm-ID versioneert deze vector; Python-enginepariteit wordt pas in T34 gecontroleerd.
