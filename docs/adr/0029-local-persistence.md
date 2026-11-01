Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Frontend](../08-frontend.md#opslag-migraties-en-meerdere-tabs), [checkpointcontract](../05-game-engine.md), [architectuur](../04-architecture.md), [modelruntime](../07-neural-network.md)

# ADR 0029 — Kleine geversioneerde records achter StorageAdapter

## Besluitbasis

Een opslagport, settings en hervatten zijn vast; localStorage voor kleine JSON-records is het in fase 1 goedgekeurde voorstel. Migratie, limieten en tabcoördinatie worden hier uitgewerkt.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

Een lokaal potje moet refresh overleven zonder private data in React te plaatsen. Opslag kan ontbreken of vol raken, en twee tabs mogen niet hetzelfde checkpoint met afwijkende botbeslissingen overschrijven.

## Besluit

Gebruik localStorage via de asynchrone port en geprivilegieerde main-thread-bridge. Scheid settings, identity, setup, actieve verwijzing en checkpoints; het private checkpointschema blijft eigendom van 05. Valideer versies/invarianten vóór publiceren. Begin met schema 1 en een leeg migratieregister; latere migraties worden expliciet toegevoegd. Bewaar corrupte/te nieuwe records tot een herstelkeuze. Gebruik een exclusieve Web Lock voor de actieve schrijvende sessie en een afzonderlijke korte settings-lock.

## Onderbouwing en alternatieven

IndexedDB is beter voor grotere/asynchrone transacties, maar vraagt voor deze kleine records meer adapterwerk. Bij gemeten stalls of grotere datasets kan dezelfde port vervangen worden. Een localStorage-timestamp is geen betrouwbare lock. Alles alleen in geheugen bewaart niets na refresh. Binaire modelcaching blijft apart volgens 07.

## Gevolgen

De Promise-interface verbergt niet dat localStorage synchronisch werkt. Hanteer de UTF-8-grenzen uit 08; mislukte writes blokkeren doorspelen niet en herstellen hoogstens de laatste succesvolle snapshot. Een tweede tab start geen tweede persistent controller. Zonder lockondersteuning kan een expliciet tijdelijk nieuw spel draaien zonder bestaande snapshots te overschrijven.

## Verificatie

AT-08-01/02/03, AT-11-02, AT-23-02 en AT-28-02; controleer schema/migratie, quota, geblokkeerde opslag, twee tabs, crash/herstart en maximaal payloadgewicht. Browser- en opslagtests volgen tijdens bouwen.
