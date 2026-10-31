Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Neural network](../07-neural-network.md#discovery-standaardselectie-en-promotie), [architectuur](../04-architecture.md), [talen](0015-ui-languages.md), [leeswijzer](../README.md)

# ADR 0036 — Bestandsdiscovery tijdens de build

## Besluitbasis

Een modelmap of één vertaalbestand toevoegen zonder applicatiecodewijziging is vast. Discovery en promotieketens zijn de concrete uitwerking.

De tekst en uitwerking zijn met batch C goedgekeurd op 2026-10-31.

## Context

Een statische browserapp kan nieuwe servermappen niet zelf opsommen. Handmatige registraties in een modelkiezer of taalmenu zouden de afgesproken uitbreidingsimpact overschrijden. De hoogste modelversie is niet noodzakelijk de beste.

## Besluit

Genereer tijdens de build een gevalideerde modelcatalogus uit manifestmappen en een taalcatalogus uit vertaalbestanden. Modellen moeten complete artefacten, compatibiliteit en promotiebewijs hebben. Een nieuw promoted manifest noemt zijn voorganger(s); per compatibele context is precies één terminale standaard toegestaan. Oude modellen blijven exact vindbaar voor hervatten. Talen worden uit één bestand per locale ontdekt en tegen dezelfde keys/placeholders gevalideerd; EN is standaard, NL verplicht. Details van vertaalstructuur en i18n volgen in batch D.

## Onderbouwing en alternatieven

Handmatige codecatalogi vragen extra edits bij ieder model/taal. Server-directorylisting past niet bij de statische release en biedt geen integriteitscontrole. Een automatische sortering op versie/tijd zou ongekwalificeerde modellen kunnen promoveren. Build-time globs zijn een passende bron voor vertaalbestanden; Vite vereist letterlijke globpatronen en transformeert deze tijdens de build. [Vite glob imports](https://github.com/vitejs/vite/blob/main/docs/guide/features.md).

## Gevolgen

Nieuwe bestanden vereisen opnieuw bouwen/deployen. Een candidate is niet speelbaar in productie. Forks/cycli in promotie of ongeldige vertalingen laten de build falen. De modelcatalogus bevat geen ruwe evaluatieseeds of trainingsdata. Een nieuw model binnen het bestaande contract vraagt alleen zijn nieuwe map; nieuwe encoding/runtimefunctionaliteit blijft een code-/ADR-wijziging.

## Verificatie

AT-03-02, AT-11-03, AT-19-03 en AT-20-02; uitbreidingsproeven voor één modelmap en één taalbestand, ambigu-catalogusfouten en hervatten met oud model. Nog geen generator geïmplementeerd.
