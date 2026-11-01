Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Frontend](../08-frontend.md#store-en-lifecycle), [architectuur](../04-architecture.md), [projectiegrens](0025-hidden-information.md), [stories](../03-user-stories.md)

# ADR 0038 — Een kleine externe view-store via useSyncExternalStore

## Besluitbasis

Engine-state buiten React en een sessieport zijn vast. Een kleine eigen view-store via de React-subscription-API is het voorgestelde middel.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

React-renders, StrictMode en routewissels mogen geen tweede bron van waarheid of dubbele computerbeurten veroorzaken. Private checkpoints mogen niet door een algemene UI-store gaan.

## Besluit

De composition root bezit Worker en sessie. Een React-onafhankelijke store publiceert uitsluitend immutable publieke snapshots, stabiel zolang zichtbare inhoud gelijk blijft. `useSyncExternalStore` verbindt die store aan de UI; unsubscribe ruimt listeners op. Lokale focus/preview/dialogstate blijft in React. Schermcallbacks sturen intents met request-ID naar de bestaande SessionPort.

## Onderbouwing en alternatieven

Zustand is een bruikbaar alternatief bij substantieel ingewikkelder UI-state, maar voegt voor deze kleine projectie extra API/dependency toe. Context met volledige GameState of React-reducers als engine zouden de goedgekeurde grenzen doorbreken. De [React API](https://react.dev/reference/react/useSyncExternalStore) ondersteunt deze abonnementsgrens rechtstreeks.

## Gevolgen

Elke workerbericht-/eventroute heeft een duidelijke eigenaar. De opslagbridge is afgescheiden en publiceert geen private JSON naar de view-store. Eventdeduplicatie voorkomt opnieuw geluid/live-meldingen bij remount; nieuwe inschrijvers beginnen na reeds aanwezige events. Modelprogress leeft in de appcoördinatie, zonder neural-dependency aan game-session toe te voegen.

## Verificatie

AT-05-02, AT-07-01/03, AT-08-01 en AT-22-02; identieke snapshotreferenties bij no-op, cleanup, StrictMode, routewissel en dubbel intent. Nog geen runtime/storetest uitgevoerd.
