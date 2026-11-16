# CLAUDE.md – Vonnies Wax & Slijp Service website

Lees dit bestand helemaal voordat je iets aanpast. Het is de enige bron van waarheid voor merk, teksten, feiten en werkwijze.

## Wat is dit

Een statische website (één pagina) voor **Vonnies Wax & Slijp Service**: Jeroen waxt, slijpt en vult ski’s en snowboards met de hand, vanuit huis in Ridderkerk. Michelle beheert de site samen met Claude Code. De site draait op **GitHub Pages**; er is geen build-stap, geen framework, geen npm.

```
index.html        de hele pagina (HTML + JSON-LD bedrijfsgegevens in <head>)
css/style.css     alle opmaak, incl. dark mode
js/main.js        keuzehulp (wax/slijpadvies) + de meebewegende sliert
img/              foto's (webp), logo, favicon, deelafbeelding
brand/            logo-bestanden, merkverhaal en kleurcodes (alleen lokaal: staat in .gitignore, niet publiceren of aan linken)
docs/content.md   achtergrond: wax- en slijpgegevens zoals op de intake-posters
tools/            hulpscript om nieuwe foto's webklaar te maken
robots.txt, sitemap.xml
```

Lokaal bekijken: `python3 -m http.server 8000` in de repo-map en open http://localhost:8000.

## Feiten (alleen aanpassen als Michelle of Jeroen het zegt)

- Naam: Vonnies Wax & Slijp Service
- Slogan (huidig): **“Aan de spullen mag het niet liggen”**. Oudere slogan “Op wedstrijdniveau voor iedereen” mag als ondertekst.
- Adres: Vossiusstraat 34, 2984 GS Ridderkerk
- Telefoon/WhatsApp: 06 16 75 50 14 (`+31616755014`, WhatsApp-link `https://wa.me/31616755014`)
- **WhatsApp is het voorkeurskanaal**; bellen is secundair.
- E-mail: jeroen@vonnieswaxenslijpservice.nl
- Instagram: @vonnieswaxenslijp (`https://www.instagram.com/vonnieswaxenslijp`)
- Afgeven/ophalen: maandag en donderdag 18.00–20.00 uur, of op afspraak. Haal- en brengservice op aanvraag.
- 13 jaar ervaring (stand 2026). Toon dit nooit als een los groot cijfer (leest als leeftijd).
- Vonnies **verkoopt geen materiaal**, maar zegt eerlijk wanneer iets niet meer te repareren of niet meer veilig is.
- Wax: fluorvrije wax van **ARC** (Italië). Niet “Arctec” schrijven.

### Prijzen

| Behandeling | Ski | Snowboard |
|---|---|---|
| Alleen waxen (hotwax, met de hand) | €20 | €25 |
| Waxen + slijpen | €35 | €35 |
| Waxen + slijpen + vullen (complete beurt) | €45 | €45 |
| Topsheetreiniging | +€2,50 | +€2,50 |

**Prijzen of openingstijden wijzigen? Pas ze op ALLE plekken aan:**
1. de prijstabel in `index.html` (`#prijzen`)
2. de JSON-LD in de `<head>` van `index.html` (`hasOfferCatalog`, `priceRange`, `openingHoursSpecification`)
3. `<meta name="description">` en `og:description` (noemen “vanaf €20” en de avonden)
4. `PACK` in `js/main.js` (keuzehulp noemt €35/€45)
5. “Zo werkt het” en het contactblok (openingstijden)

## Merk en vormgeving

- Look & feel: **90’s met een moderne twist**. Handtekening: zwarte, vette hoofdletters met een **paarse verschoven schaduw** (`.shout`, `text-shadow: .07em .07em 0 var(--purple)`).
- Lettertype: **Poppins** (Google Fonts), gewichten 400–900.
- Kleuren (tokens op `:root` in `css/style.css`):
  - geel `#FFEA17` – logo-cirkel, labels, knoppen, het blok “Het verschil”
  - zwart `#0B0710` – tekst
  - paars `#9D33D6` – schaduwen, randen, sliert; woordmerk-paars `#9502F6`
  - lavendel `#EFDFF9` – achtergrond; lichte sliert `#D9B8F0`; vlakken `--panel #f7effc`
- Alle vakjes hebben dezelfde stijl: `--panel`-achtergrond + `2.5px solid var(--purple)`. Geen nieuwe kaartstijlen verzinnen.
- Alles lijnt uit op de volle breedte van `.wrap` (max 1080px incl. padding). Geen losse `max-width` op blokken; alleen lopende tekst krijgt een regellengte (`ch`).
- Gele labels op foto’s: `figcaption` (geel, zwarte rand, paarse schaduw).
- De sliert (`#trail` in `js/main.js`) loopt over de hele pagina en wordt paars ingetekend tijdens het scrollen. Content staat er met `z-index:1` boven.
- Dark mode: kleuren altijd via tokens; donkere waarden staan onder `@media (prefers-color-scheme: dark)` en `[data-theme="dark"]`. Nieuwe kleuren dus als token toevoegen, op beide plekken.
- Respecteer `prefers-reduced-motion` (sliert en animaties).

## Tone of voice en taal

- **Correct Nederlands**, jeugdig maar professioneel. Stoer, eigenwijs, no-nonsense. Niet te zakelijk, niet te gelikt, niet té grappig.
- De site spreekt in de **ik-vorm van Jeroen**. Uitzonderingen: knoppen en contactkoppen noemen hem bij naam (“App Jeroen”, “Vragen? Contact Jeroen”), zodat bezoekers weten wie ze appen.
- Spreek de bezoeker aan met **je/jij**.
- Typografie: gebruik **’** als apostrof (ski’s, zo’n) en “ ” als aanhalingstekens in zichtbare tekst. Rechte quotes alleen in code.
- Schrijf “wedstrijdniveau” als één woord.
- Inhoud moet kloppen met de praktijk: in poeder doen scherpe kanten er weinig toe; check of een claim technisch klopt voordat je hem plaatst.

## Foto’s

- Nieuwe foto’s altijd via `tools/optimaliseer_fotos.py` (webp, max 1400px, kwaliteit ~76). Doel: <250 KB per foto.
- Bestandsnaam beschrijvend en met zoekwoorden, kleine letters met streepjes: `snowboard-hotwax-werkplaats.webp`.
- Altijd `width`, `height`, `alt` (Nederlands, beschrijvend) en `loading="lazy"` (behalve boven de vouw).
- Mensen op foto’s die niet Jeroen zijn: alleen met hun toestemming.
- Foto-raster: `.photos` met klassen `p1`–`p4` (werkplaats) en `m1`–`m5` (op de berg); grid van 6 kolommen, mobiel 2.

## SEO (niet slopen)

- De **H1** is de regel “Ski’s en snowboards waxen en slijpen in Ridderkerk”; de slogan is bewust géén H1. Er is precies één H1.
- `<title>`, meta description, Open Graph-tags en `canonical` staan in de `<head>`.
- JSON-LD `LocalBusiness` moet altijd gelijk lopen met de zichtbare feiten (adres, tijden, prijzen). Google vergelijkt dit ook met het Google Bedrijfsprofiel: houd naam, adres en telefoon overal identiek.
- Werk `sitemap.xml` (`lastmod`) bij na inhoudelijke wijzigingen.
- Na grote wijzigingen: test op https://search.google.com/test/rich-results en https://validator.schema.org.

## Werkwijze

1. Kleine, duidelijke commits in het Nederlands, bijv. `Prijs complete beurt naar €50`.
2. Werk op `main` voor kleine tekstwijzigingen; gebruik een branch + pull request voor grotere ombouw.
3. Check vóór elke commit:
   - pagina laadt lokaal zonder fouten in de console
   - desktop (1280px) en mobiel (390px) bekeken
   - licht én donker thema bekeken
   - prijzen/tijden overal gelijk (zie lijst hierboven)
   - geen kapotte afbeeldingen, alle `img` hebben `alt`
4. Geen externe scripts of trackers toevoegen zonder overleg (privacy + snelheid).

## Eerste keer opzetten (GitHub Pages)

```bash
git init -b main
git add .
git commit -m "Eerste versie website Vonnies"
gh repo create vonnies-website --public --source=. --push
gh api -X POST repos/{owner}/vonnies-website/pages -f "source[branch]=main" -f "source[path]=/"
```

Eigen domein koppelen, zodra het domein vastligt:
1. Maak een bestand `CNAME` in de root met alleen de domeinnaam, bijv. `vonnieswaxenslijpservice.nl`.
2. Zet bij de domeinregistrar A-records naar 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 en een CNAME `www` naar `<gebruikersnaam>.github.io`.
3. Zet in GitHub → Settings → Pages “Enforce HTTPS” aan.

## Openstaande punten

- [x] **Domein bevestigd:** `vonnieswaxenslijpservice.nl`, geregistreerd bij Versio (DNS ook bij Versio). `CNAME`-bestand staat in de repo.
- [x] DNS bij Versio wijst naar GitHub Pages (4× A, 4× AAAA, `www` CNAME naar `vonnies.github.io`); HTTPS-certificaat goedgekeurd en “Enforce HTTPS” staat aan (16-11-2026). **Let op:** de e-mail draait via iCloud. Laat de MX-, TXT- (`apple-domain`, `v=spf1`) en eventuele `sig1._domainkey`-records altijd staan.
- [ ] Hotwax-foto (strijkijzer op het board) toevoegen aan de foto-impressie zodra die er is.
- [ ] Websitelink in de Instagram-bio zetten.
- [ ] Google Bedrijfsprofiel aanmaken (Jeroen), met exact dezelfde gegevens als hierboven.
