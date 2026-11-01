Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-01

Gerelateerd: [Frontend](../08-frontend.md), [design brief](../09-design-brief.md), [scope](../01-product-vision-scope.md), [stories](../03-user-stories.md)

# ADR 0016 — Toegankelijke bediening op desktop en mobiel

## Besluitbasis

Desktop/mobiel, muis/touch/toetsenbord, evergreen browsers en WCAG 2.2 AA zijn vastgelegd in de masterprompt en scope. De concrete interactiepatronen preciseren die eisen.

Deze uitwerking is met batch D goedgekeurd op 2026-11-01.

## Context

Een raster van honderd cellen wordt onbruikbaar met honderd tabstops of alleen dragbediening. Kleur, geluid en animatie mogen niet de enige dragers van spelinformatie zijn.

## Besluit

Gebruik gelabelde ARIA-grids met roving focus en pijltjes, plus selecteer-en-plaats naast slepen. Rotatie heeft een knop en een contextgebonden toets. Schoten gebruiken één activatiepad. Meld publieke resultaten via een gededupliceerde live-region. Borden hebben minimaal 24 × 24 CSS-pixelcellen; primaire controls minimaal 44 × 44. Focus blijft zichtbaar bij beurten/dialogs; reduced motion gaat voor effecten.

## Onderbouwing en alternatieven

Alle cellen als tabstop en uitsluitend drag-and-drop maken de volledige keyboardflow veel zwaarder. Alleen een canvas vraagt een parallelle toegankelijke semantiek en is niet nodig voor dit kleine raster. De WAI-patronen en details staan in 08; de keuze zegt nog niets over een geslaagde audit.

## Gevolgen

Op smalle schermen is één bord actief; de wisselbediening blijft bereikbaar. Ontwerp op 390/768/1440 en test ook 320 px, tekstzoom en beide talen. Test huidige en vorige stabiele versies van de afgesproken Chrome/Edge/Firefox/Safari-families inclusief mobiele varianten. Batch E maakt de concrete release-/hulpmiddelenmatrix.

## Verificatie

AT-04-01/02, AT-05-01/02/03, AT-12-02 en AT-21-01/02/03; geautomatiseerde checks plus handmatige keyboard-/screenreaderreview. Er zijn nog geen browser- of a11y-tests uitgevoerd.
