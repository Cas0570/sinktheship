Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Frontend](../08-frontend.md#i18n-en-locale-discovery), [taalkeuze](0015-ui-languages.md), [discovery](0036-model-and-locale-discovery.md), [stories](../03-user-stories.md)

# ADR 0039 — react-i18next met gecontroleerde taalbestanden

## Besluitbasis

Engels standaard, Nederlands en i18n vanaf de start zijn vast. De librarykeuze is een uitgewerkt voorstel; bestandsdiscovery is al vastgelegd in ADR 0036.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

Alle UI-tekst en hulpmiddelenlabels moeten vertalen, terwijl een nieuwe taal geen wijzigingen aan engine, signatures of React-schermen vraagt.

## Besluit

Gebruik i18next/react-i18next met de LocaleFile-structuur uit 08, vlakke dot-keys en `keySeparator: false`. Ontdek bestanden tijdens de build, valideer keys/pluralen/interpolaties en laad assets vanaf eigen origin. EN is de eerste default; een geldige expliciete opgeslagen keuze gaat voor. Taalwissel behoudt de sessie en werkt documenttaal bij.

## Onderbouwing en alternatieven

Een eigen vertaalfunctie lijkt klein maar moet pluralen, fallbacks, interpolatie en React-herenderen alsnog onderhouden. Automatische browserdetectie past niet bij de vastgelegde default. Een externe translation backend is voor de statische release onnodig en past niet bij het eigen-originbeleid. De officiële react-i18next-bronnen en configuratiegrenzen staan in 08.

## Gevolgen

Vertalingen bevatten tekst, geen uitvoerbare HTML. React-tekstescaping blijft de grens wanneer i18next-interpolatieescaping uitstaat. Onvolledige locale-bestanden laten de build falen; runtimefallback is geen vervanging voor complete NL-teksten. Eén compleet nieuw bestand plus een build voegt een taal toe, inclusief de vereiste modulelabels.

## Verificatie

AT-11-01/02/03, AT-20-02 en AT-21-02; key-/placeholdervalidatie, pluralen, lazy-loadfout, taalwissel midden in een spel en lange NL-labels. Nog geen i18n-runtime gebouwd.
