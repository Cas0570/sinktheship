Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Kwaliteit](../12-quality-testing.md#ci-artefacten-en-releasepoorten), [ML](../07-neural-network.md), [benchmark](0030-benchmark-and-promotion.md)

# ADR 0044 — Afzonderlijke controlejobs en herleidbare releaseartefacten

## Besluitbasis

GitHub Actions, TS-/Python-/pariteitschecks en relevante test/build/lint zijn vaste eisen. Jobsplitsing, artefacten en releasegates preciseren het plan.

Deze uitwerking is met batch E goedgekeurd op 2026-11-01.

## Context

Een groen unitresultaat bewijst geen browserwerking of modelpariteit. Volledige training op iedere PR is kostbaar en zou de reviewcyclus onnodig vertragen.

## Besluit

Splits TS-kwaliteit, Python, pariteit, webbuild, browser en benchmark-smoke. Een altijd uitgevoerde aggregatecheck bewaakt verplichte jobs voor de release. Volledige holdout-/toestelkwalificatie staat apart van de 100 developmentblokken in CI. Deploy uitsluitend de gecontroleerde productiebuild van dezelfde commit; seed-testbuilds blijven gescheiden.

## Onderbouwing en alternatieven

Eén grote job is eenvoudiger te starten, maar geeft minder duidelijke fout-/artefactgrenzen en minder hergebruik van buildoutput. Iedere PR een model trainen maakt tests variabel en duur. Alleen nachtelijke checks laat noodzakelijke regressies te laat zien. Retry mag diagnostiek geven maar een flaky test wordt niet stil als betrouwbaar groen beschouwd.

## Gevolgen

Pin Actions en toolchains, gebruik minimale readrechten en geen secrets voor onbetrouwbare PR-code. PR-bewijs 14 dagen, release-artefacten 90 dagen; blijvend vrijgegeven modelbewijs krijgt duurzame opslag/referenties. Niet-gebouwde lagen zijn vóór hun mijlpaal expliciet niet toepasselijk; een v1.0-ML-poort mag niet ongemerkt worden overgeslagen.

## Verificatie

AT-18-03, AT-19-01/02/03, AT-22-01, AT-23-03, AT-24-02 en AT-29-01/02/03; injecteer falende/geskipte vereiste job, ontbrekend artefact en testbuild in releasepad. De eerste TS-/webjobs worden in T02 geactiveerd; overige lagen volgen bij hun implementatie.

## Uitvoering in T02

De [Quality-workflow](../../.github/workflows/quality.yml) levert `quality-ts` en `web-build`. Checkout v7.0.1, setup-node v7.1.0 en upload-artifact v7.0.2 staan op volledige, via de officiële repositories teruggelezen commit-SHA’s. pnpm wordt exact geïnstalleerd, zonder extra setup-Action. Tokens blijven read-only; credentials worden niet in de checkout bewaard; er zijn geen secrets, deploys of cachewrites. Pipefail bewaart de echte foutcode bij logcapture.

Het [eerste CI-profiel](../12-quality-testing.md#eerste-ci-poort) specificeert rapporten, 14-dagenretentie en de nog niet toepasselijke lagen. Er wordt geen release-aggregatepoort of releaseartefact geclaimd voor deze bootstrap. CI-resultaten worden vóór review via GitHub teruggelezen.
