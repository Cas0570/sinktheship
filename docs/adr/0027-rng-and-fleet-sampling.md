Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Regels](../02-game-rules.md), [engine](../05-game-engine.md), [tegenstanders](../06-opponents.md), [leeswijzer](../README.md)

# ADR 0027 — Private RNG-stromen en uniforme gelabelde vloten

## Besluitbasis

Uniforme plaatsing en geïnjecteerde randomness zijn vast. PCG32 en het sampler-/fallbackontwerp zijn voorstellen ter review in batch B.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Greedy per schip een vrije plaats kiezen geeft doorgaans verschillende kansen aan complete vloten. Eén gedeelde seed kan de tegenstander bovendien de plaatsing laten reconstrueren of schotkeuzes door presentatiewerk laten veranderen.

## Besluit

Gebruik geversioneerde PCG32 XSH-RR-instances met gescheiden starter-, plaatsings- en schotstromen. Snapshotformaat, unsigned rekenen en onbevooroordeelde bounded draws staan in 05. Sample complete onafhankelijke tuples van individuele scheepsplaatsingen; verwerp het gehele tuple bij overlap/contact. Na 10.000 afwijzingen volgt volledige enumeratie met exact reservoir sampling, niet de eerste witness. Alle niveaus en de menselijke random-knop delen deze sampler.

## Onderbouwing en alternatieven

Volledige-tuple-rejection heeft een eenvoudig uniformiteitsbewijs. Gewogen recursie met aantallen geldige vervolgen kan eveneens exact zijn, maar vraagt tellen en caching van veel deelproblemen. Reservoir sampling heeft beperkt geheugen maar mogelijk zeer hoge rekentijd; dat is een expliciete beperking voor extreme engineconfiguraties. Greedy retries/backtracking zonder correcte gewichten zijn geen gelijkwaardig uniform alternatief. PCG heeft een kleine reproduceerbare specificatie; `Math.random` heeft geen door het project beheerd seed-/snapshotcontract.

Primaire bronnen: [PCG-code en licenties](https://www.pcg-random.org/download.html), [PCG32-seeding en bounded sampling](https://www.pcg-random.org/using-pcg-c-basic.html), geraadpleegd op 2026-10-31. De vlootsampler en drempel zijn eigen ontwerpkeuzes, geen claims uit PCG-documentatie.

## Gevolgen

Private seeds blijven buiten botviews. TS/Python delen golden vectors, integerregels en kandidatenvolgorde. PCG is niet cryptografisch; browserentropie komt via een aparte platformadapter. Zware sampling draait annuleerbaar in een Worker. Optimalisatie mag uniformiteit niet opgeven zonder expliciete scopewijziging.

## Verificatie

AT-04-03, AT-28-01/03, AT-29-01, OPP-01/02/06. Kleine borden worden exact geteld; v1-plaatsing wordt vóór MVP op performance gemeten. De huidige batch levert de specificatie, geen werkende sampler.
