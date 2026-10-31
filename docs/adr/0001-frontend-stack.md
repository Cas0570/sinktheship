Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-10-31

Gerelateerd: [Masterprompt](../00-masterprompt.md), [architectuur](../04-architecture.md), [leeswijzer](../README.md)

# ADR 0001 — Vastgestelde frontendstack

## Besluitbasis

Vast besluit uit hoofdstuk 4 van de masterprompt; deze tekst documenteert dat besluit en heropent de stackkeuze niet.

De tekst en uitwerking zijn met batch B goedgekeurd op 2026-10-31.

## Context

De browserapp moet aansluiten op de gewenste React/Tailwind-uitvoer van Figma en door de ontwikkelaar in kleine modules kunnen worden uitgebreid.

## Besluit

Gebruik React, Vite, TypeScript met strict-controle en Tailwind CSS. React beheert presentatie; game-state en beslissingen liggen in de afzonderlijke core/sessie. Containers in `apps/web` vertalen toegestane views naar props voor de UI-package. Runtime-, router- en storeconfiguratie volgt in batch D; exacte versies worden bij setup gecontroleerd en vastgelegd.

## Onderbouwing en alternatieven

De masterprompt is de beslisbron. Vue/Svelte of een server-renderingframework zouden een andere stack en andere designintegratie betekenen en zijn geen gelijkwaardige invulling van deze opdracht. Een eigen DOM-renderer vergroot de te onderhouden UI-infrastructuur. Deze alternatieven zijn mogelijkheden voor een toekomstige herziening, geen gereconstrueerde historische selectie.

## Gevolgen

De UI-package krijgt React als peer; core en bots hebben geen React-import. Tailwind-klassen vervangen geen semantiek of toetsenbordbediening. Frameworkconfiguratie komt later, niet in deze documentatiebatch.

## Verificatie

US-05, US-20, US-21 en US-22: geplande type-/importchecks, uitbreidingsproef, toegankelijkheidscontrole en bundel-/interactiemeting. De functionele frontend is nog niet gebouwd.
