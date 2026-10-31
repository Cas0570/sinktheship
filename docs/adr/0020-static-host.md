Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Architectuur](../04-architecture.md), [statische v1](0005-static-v1.md), [leeswijzer](../README.md)

# ADR 0020 — Cloudflare Pages als voorkeurs-host

## Besluitbasis

Voorstel uit het goedgekeurde fase-1-plan, hier uitgewerkt voor review. Dit besluit activeert geen dienst of abonnement.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

V1 vereist statische hosting, eigen domein, HTTPS, SPA-routes en custom headers. Modelintegriteit en toekomstige runtimeheaders moeten controleerbaar zijn.

## Besluit

Gebruik bij de latere deployment Cloudflare Pages voor de statische build, zonder Functions. Assets en modellen komen van dezelfde origin. Leg headers in versiebeheer vast. Reserveer SPA-fallback voor de app en controleer modelresponses op metadata, lengte en digest; een HTML-fallback is nooit een geldig model. Domein-/accountbestemming blijft Q-04.

## Onderbouwing en alternatieven

| Optie | Routes/headers | Operationele afweging |
|---|---|---|
| Cloudflare Pages | Statische `_headers`; standaard SPA-fallback zonder top-level `404.html` | Past bij de voorgestelde statische release; geen eigen webserver onderhouden |
| Netlify | Ondersteunt custom headers en afzonderlijk configureerbare routes | Technisch passend alternatief; geen aangetoonde noodzaak om de voorkeur te wijzigen |
| Zelf beheerde statische server | Routes/headers volledig zelf configureerbaar | Meer eigen beheer voor TLS, webserver, updates en herstel |

Bronnen, gecontroleerd op 2026-10-31: [Cloudflare headers](https://developers.cloudflare.com/pages/configuration/headers/), [Cloudflare serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) en [Netlify headers](https://docs.netlify.com/manage/routing/headers/). `_headers` geldt bij Cloudflare voor statische responses, niet automatisch voor Functions. De keuze claimt geen prijs- of prestatievoordeel; tarieven/limieten worden bij deployment opnieuw beoordeeld.

## Gevolgen

V1 gebruikt geen hostspecifieke runtime-API in de core. Migratie naar een andere statische host raakt deployment/headers, geen spelregels. CSP en eventuele COOP/COEP worden in de kwaliteits-/runtime-uitwerking bepaald; custom-headerondersteuning betekent niet dat die headers al actief zijn.

## Verificatie

US-14, US-22, US-23: deep-link-refresh, app-404, correcte assettypen, ontbrekend-modelafhandeling en securityheaders. Nog niet gedeployd of gemeten; Q-04 wordt vóór externe inrichting opgelost.
