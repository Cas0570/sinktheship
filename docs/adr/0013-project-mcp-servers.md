Status: Geaccepteerd

Versie: 1.2

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Tooling](../16-tooling-mcp.md), [intake](../README.md#mcp-controle-bij-intake), [Figma](../10-figma-mcp-playbook.md)

# ADR 0013 — Zeven projectgebonden MCP-servers

## Besluitbasis

De zeven serverkeuzes, projectscope, externe secrets, verplichte gebruiksmomenten en fase-4-verificatie zijn vastgelegd in de masterprompt. De voorbeeldtimeouts, geïsoleerde browsers en concrete herstelvolgorde preciseren die eis.

Deze uitwerking is met batch E goedgekeurd op 2026-11-01.

## Context

Een tool kan zichtbaar zijn zonder juiste projectconfiguratie, accountrechten of toegang tot de gekozen resource. Globale setup kan andere projecten beïnvloeden en geeft geen reproduceerbaar hervatpunt.

## Besluit

De zeven entries zijn in [.codex/config.toml](../../.codex/config.toml) voorbereid in batch F en op 2026-11-02 ingeschakeld voor fase 4. Gebruik remote HTTP voor GitHub/Notion/Figma/Context7/W&B en stdio via npx voor Playwright/Chrome DevTools. Secrets blijven in procesvariabelen/OAuthopslag buiten Git. GitHub vraagt default plus projects/actions. Gebruik voor deze omgeving geïsoleerde headless browsers en ruimere starttimeouts. Alle zeven controles zijn op 2026-11-02 geslaagd volgens [16](../16-tooling-mcp.md#verificatieverslag-2026-11-02). De afzonderlijke toestemming voor repositorycreatie blijft vóór die handeling vereist.

## Onderbouwing en alternatieven

Globale `codex mcp add` is ongeschikt als projectscopevervanging. Tools zonder auth-/resourcecontrole geven onvoldoende bewijs. Zelf extra servers toevoegen wijkt af van de expliciete inventory. `required` als runtime-startblokkade voor iedere dag zou lokaal herstelwerk hinderen; de volledige setupgate wordt daarom door een expliciet verificatierapport bewaakt.

## Gevolgen

Persoonlijke/managed/pluginconfig kan aanvullend geladen worden; inspecteer de effectieve set. Figma-seat, Notion-parent en browserstart blijven echte voorwaarden, geen door documentatie opgeloste problemen. Bij gewone bouwuitval lokaal verder met gemelde ontbrekende updates; vóór eerste externe inrichting moeten alle zeven checks slagen. Het permissievoorstel workspace-write/on-request/netwerk aan wordt afzonderlijk reviewbaar in F, zonder de huidige hostinstellingen te veranderen.

## Verificatie

AT-24-01/02/03; zeven lezende testcalls uit 16, juiste identities/resources en geredigeerd rapport. Configfragmenten zijn documentaire voorstellen; geen fase-4-activatie uitgevoerd.
