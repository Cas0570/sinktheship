Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Scope](../01-product-vision-scope.md), [tegenstanders](../06-opponents.md), [stories](../03-user-stories.md), [leeswijzer](../README.md)

# ADR 0030 — Gepaard benchmarkprotocol en expliciete promotie

## Besluitbasis

Meetbare niveaus en het v1-modeldoel zijn goedgekeurd. Pairing, blokbootstrap en de concrete poorten worden met batch B ter review aangeboden.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

Een model met goede tensorloss wint niet automatisch meer wedstrijden. Startersvoordeel, afgebroken verliezersruns, andere vlootverdelingen of herhaald tunen op dezelfde testset kunnen een vergelijking vertekenen.

## Besluit

Meet solo-schoten tot voltooiing en afzonderlijk echte head-to-headpartijen. Gebruik 5.000 gepaarde blokken met gewisselde starter, dus 10.000 partijen per vergelijking per vrijgegeven regelconfiguratie. Rapporteer alle fouten, distributions, versies en seeds. Bereken vooraf vastgelegde blokbootstrapintervallen. De exacte methode en release-/promotiepoorten staan uitsluitend in 06.

## Onderbouwing en alternatieven

Alleen gemiddelde schoten zegt niets rechtstreeks over winnen onder verschillende beurtregels. Alleen winrate verbergt verbetering in schotefficiëntie. Onafhankelijke, ongepaarde seeds verspillen vergelijkingsinformatie; ieder van de twee starterwedstrijden als onafhankelijk tellen onderschat de gedeelde onzekerheid. Een kleine PR-run is bruikbaar als regressiecheck maar onvoldoende voor vrijgave.

## Gevolgen

Gebruik gescheiden training-, ontwikkel- en holdoutseedplannen. Een mislukte gate betekent geen promotie. Impossible vereist ook geobserveerd minstens 55% tegen Hard; een later model moet bovendien de bestaande champion aantoonbaar verslaan en alle overige eisen behouden. Geen claim dat een kwalificerend model al bestaat. De intervallen gelden per vergelijking, zonder gezamenlijke 95%-claim over alle regelsets.

## Verificatie

NFR-12, AT-19-01 t/m AT-19-03, OPP-08/09 en export-/compatibiliteitschecks uit batch C. De analytische Easy-verdeling is een sanitycheck, historische schotgetallen zijn geen acceptatiegrens. Definitieve benchmarks volgen na implementatie.
