Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Neural network](../07-neural-network.md), [signaturen](0023-rule-signatures.md), [benchmark](0030-benchmark-and-promotion.md), [leeswijzer](../README.md)

# ADR 0031 — Eerst één model per strategiecompatibiliteit

## Besluitbasis

Uitwerking van het goedgekeurde fase-1-voorstel; v1 begint met Klassiek.

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

Contact- en onthullingsregels veranderen de schietinformatie. Een convolutioneel model dat op één vorm past hoeft niet op een andere vloot, bordmaat of informatievorm te werken. Alleen een gelijke tensorlengte bewijst geen compatibiliteit.

## Besluit

Gebruik eerst één modelfamilie per `strategySignature`. De eerste familie dekt Klassiek; extra schot bij raak gebruikt dezelfde gewichten pas na eigen evaluatie. No-touch krijgt een aparte familie. De v1-encoding is bewust beperkt tot het vaste bord, de vaste gelabelde vloot en hit-only/ship-type-sunk. Een manifest bevat complete regelentries en expliciete gekwalificeerde runtimeprofielen.

## Onderbouwing en alternatieven

Een apart model per volledige regelsignatuur dupliceert gewichten voor starter-/beurtvarianten die hetzelfde bezettingsprobleem hebben. Een geconditioneerd model kan meerdere families delen maar vraagt extra regelkanalen, datasets en controles op slecht gedekte combinaties. Eén model zonder conditionering voor verschillende families vermengt afwijkende verdelingen. De afzonderlijke start is eenvoudiger te reviewen en te diagnosticeren.

## Gevolgen

De resolver controleert meer dan de strategiesignatuur: ook volledige regelentry, encoding, policy en runtime. Niet-gekwalificeerde varianten houden een uitgeschakelde Impossible-optie. Een nieuwe familie met dezelfde encoder kan via een modelmap worden toegevoegd; een nieuwe inputbetekenis vereist een expliciete encodingwijziging.

## Verificatie

AT-03-02/03, AT-19-01/02, AT-20-02; negatieve compatibiliteitsgevallen, afzonderlijke beurtbenchmarks en buildcataloguscontrole. Er is nog geen compatibel model beschikbaar.
