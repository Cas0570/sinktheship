Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Frontend](../08-frontend.md#routes-en-schermflow), [stack](0001-frontend-stack.md), [roomroutes](0045-room-routes.md), [stories](../03-user-stories.md)

# ADR 0037 — React Router in Declarative Mode

## Besluitbasis

React/Vite zijn vast; React Router Declarative Mode met één registratiepunt is het goedgekeurde voorstel dat deze ADR uitwerkt.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

De app is een statische SPA. Sessies, modellen en herstel hebben al hun eigen coördinatielaag; een tweede routergedreven datalifecycle zou verantwoordelijkheden overlappen.

## Besluit

Gebruik BrowserRouter, een routecatalogus en route-elementen. Lazy schermmodules lopen via React-lazy/Suspense. Bootstrap valideert storage voordat faseguards beslissen. Informatieroutes bewaren de sessie; alleen een expliciete nieuw-spelactie vervangt haar. Routes en herstelgedrag staan normatief in 08.

## Onderbouwing en alternatieven

Data Mode biedt loaders/actions en navigatieblocking, maar deze app heeft daarvoor geen noodzakelijke server-/route-dataflow. Eigen history-routing zou standaard navigatie en foutgevallen opnieuw bouwen. `useBlocker` is een Data Router-API en wordt niet in deze declaratieve inrichting gebruikt. De actuele Context7-bronnen staan in 08.

## Gevolgen

Een nieuw scherm vraagt zijn module en één routeregistratie; i18n- en testbestanden volgen de bijbehorende feature. De host moet SPA-fallback leveren. Browser Back is geen spel-reset; geaccepteerde wijzigingen worden door de sessie opgeslagen. Een productdialog bevestigt het werkelijk vervangen van een lopend spel.

## Verificatie

AT-01-01, AT-09-01/02, AT-14-01/02/03 en AT-20-03; directe URL, guards na bootstrap, Back/Forward, 404 en routechunkfout. Nog geen router geïmplementeerd.
