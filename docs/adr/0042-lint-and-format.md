Status: Geaccepteerd

Versie: 1.1

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Kwaliteit](../12-quality-testing.md#commando-contract-en-codeconventies), [taalafspraak](0014-document-and-code-language.md), [dependencygrenzen](0043-dependency-enforcement.md)

# ADR 0042 — ESLint en Prettier met gedeelde configuratie

## Besluitbasis

Lint/format, leesbaarheid en geautomatiseerde modulegrenzen zijn vereist. ESLint/Prettier zijn de eerder voorgestelde concrete tools.

Deze uitwerking is met batch E goedgekeurd op 2026-11-01.

## Context

Een monorepo moet consistente fouten detecteren zonder per package uiteenlopende stijlregels. De oorspronkelijke masterprompt moet letterlijk behouden blijven.

## Besluit

Gebruik gedeelde ESLint flat configs in packages/eslint-config voor TS/React-regels en Prettier voor opmaak. CI gebruikt checkmodus; fixes lopen lokaal als concrete diff. Combineer geen conflicterende formatterregels. Sluit docs/00-masterprompt.md en gegenereerde/binaire output expliciet uit van formatterwrites, en bewaak de bron met hashcontrole. Python gebruikt ruff afzonderlijk.

## Onderbouwing en alternatieven

Een geïntegreerde tool zoals Biome kan lint/format combineren, maar de gekozen ESLint-plugin-/typegerichte regels en bestaande dependency-cruisergrens blijven het uitgangspunt. Alleen Prettier vindt geen inhoudelijke TS-/React-fouten; alleen lintstijlregels vraagt meer afstemming. De officiële [ESLint flat-configdocumentatie](https://eslint.org/docs/latest/use/configure/configuration-files) en [Prettier CLI](https://prettier.io/docs/cli) zijn via Context7 gecontroleerd op 2026-11-01.

## Gevolgen

Nieuwe lintregels worden verklaard ingevoerd, niet met brede suppressions afgezwakt. Een schema-/APIwijziging moet ook de docs en module-README veranderen. De T02-rootscripts realiseren het contract uit 12 en herformatteren niet de letterlijke bron.

## Verificatie

AT-20-01/03, AT-23-03 en AT-24-02; controleer een bewuste rule-failure, uniforme configs, echte exitcodes en behoud van bronhash.

## Uitvoering in T02

De bestaande keuze is ingevuld met ESLint 10.14.0, `@eslint/js` 10.0.1, typescript-eslint 8.72.1, globals 17.14.0 en Prettier 3.9.10. De aanbevolen JS-/TS-configs en expliciete platform-globals vragen deze ondersteunende packages; zij voegen geen productruntime toe. ESLint/TypeScript zijn peers van de configpackage, met dezelfde pins in de workspace. typescript-eslint ondersteunt de bestaande TypeScript 5.9.3; er is geen compilerupgrade.

Rootscripts voeren uitsluitend checks uit behalve het expliciete `pnpm format`. De broncode/configuratie uit T01 krijgt één mechanische formatterpass. Bestaande Markdown wordt niet massaal herschreven; de scope en bronhashbescherming staan in [kwaliteit](../12-quality-testing.md#eerste-ci-poort). De core- en private-state-regels worden met echte ESLint-fixtures getest. Dit realiseert het bestaande besluit zonder tweede formatter of lintframework.

Actuele flat-config-/parser-/formatterdocumentatie is via Context7 geraadpleegd op 2026-11-02; versies en peer-enginecompatibiliteit zijn uit de npm-registry gelezen. [typescript-eslint](https://typescript-eslint.io/getting-started/) en [Prettier CLI](https://prettier.io/docs/cli).
