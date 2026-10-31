Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [ADR-lijst](../README.md#adr-lijst), [masterprompt](../00-masterprompt.md)

# ADR-template

Maak voor een nieuw besluit een bestand met het volgende vrije nummer en een Engelse bestandsnaam. Begin met status, versie, wijzigingsdatum en links naar echte gerelateerde documenten. Neem als titel het ADR-nummer en een korte Nederlandse omschrijving.

## Besluitbasis

Vermeld of dit een vast besluit uit de masterprompt, een uitwerking van een goedgekeurd plan of een nieuwe keuze is. Noteer de bron en bij acceptatie het akkoordmoment. Status Concept zegt iets over de tekst; een vaste keuze uit de masterprompt wordt daarmee niet heropend.

## Context

Beschrijf het concrete probleem, de requirements, de betrokken bouwstenen en relevante grenzen. Maak aannames herkenbaar en registreer vragen centraal in de leeswijzer.

## Besluit

Beschrijf de gekozen of voorgestelde richting zo dat een reviewer kan vaststellen welk gedrag eruit volgt. Een afwijking van een vast besluit wordt expliciet benoemd en niet uitgevoerd vóór akkoord.

## Onderbouwing en alternatieven

Vergelijk de relevante alternatieven op dezelfde criteria. Bij een vast besluit is de masterprompt de beslisbron; alternatieven zijn een afweging voor mogelijke toekomstige herziening, geen verzonnen eerdere besluitvorming. Citeer actuele primaire documentatie wanneer een keuze afhankelijk is van een library, platform of norm.

## Gevolgen

Noem impact op modules, publieke API, gegevens, tooling, onderhoud en beperkingen. Geef aan welke normen elders eigenaar zijn van details; voorkom dubbele specificaties.

## Verificatie

Verwijs naar requirements, stories, acceptatietests en later taken die de gevolgen controleren. Maak onderscheid tussen een gepland criterium en een uitgevoerde test. Sluit af met nog benodigde reviewbesluiten via hun centrale Q-ID; gebruik geen losse oningevulde vragen.
