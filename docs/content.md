# Achtergrond: wax en slijpgraden

Bron: de intake-posters (laatste versie, na feedback van ARC). Gebruik dit om teksten in de keuzehulp en de uitleg te controleren.

Sneeuw is door uitstraling vaak 2 tot 5 graden kouder dan de lucht: de piste bepaalt de waxkeuze, niet het weerbericht. Kunstsneeuw en ijs schuren, dan kies je een hardere wax. Alles is fluorvrije wax van ARC (Italië).

## Wax

| Wax | Sneeuwtemperatuur | Meest gekozen | Kort |
|---|---|---|---|
| Universal Violet | −10 tot −20 °C | nov – jan, zomergletsjers | snel op koude, droge sneeuw, beschermt belag |
| RB Violet (Cold Racing Base) | −7 tot −12 °C | nov – jan | harder en slijtvaster dan Red, voor harde ijzige pistes |
| Universal Red | 0 tot −10 °C | feb – april, zomerbeschermlaag | natte, zware sneeuw plakt niet |
| RB Red (Med Racing Base) | −3 tot −7 °C | feb – april | meest gebruikte racewax van ARC, balans hardheid/slijtvastheid |
| RB White (X-Cold Racing Base) | −12 tot −30 °C | indoor (“indoorkoning”) | hardste wax, tegen schurende kunstsneeuw |

## Slijpgraden – zijkant

| Niveau | Ski | Snowboard |
|---|---|---|
| Rustig / allrounder | 89° (meest gekozen) | 90° |
| Sportief / all-mountain | 88° | 89° (meest gekozen) |
| Wedstrijd / gevorderd | 87° (soms 86°) | 88° (carveboards) |

## Slijpgraden – onderkant

- **1,0°** – standaard, voor zo’n 9 op de 10 rijders. Makkelijk insturen, haakt niet als je plat glijdt.
- **0,5°** – direct, voor wedstrijdrijders en fanatieke carvers. Kan alleen als de onderkant nog nooit op 1,0° is geslepen.

## Keuzehulp-logica (`js/main.js`)

- Periode × niveau → wax (`WAX`), discipline × niveau → slijpgraad (`EDGE`), niveau → behandeling (`PACK`).
- Zomergletsjer → Universal Violet (RB Violet bij wedstrijd).
