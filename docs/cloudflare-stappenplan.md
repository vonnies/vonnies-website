# Stappenplan: Cloudflare (gratis) voor GitHub Pages

Doel: echte security headers op vonnieswaxenslijpservice.nl (A-score op securityheaders.com).
De site blijft op GitHub Pages staan. Cloudflare komt ertussen en voegt de headers toe.
Kosten: €0 (Free-plan). Domeinregistratie blijft bij Versio.

> **Belangrijk:** e-mail draait via iCloud. Als de mailrecords niet goed overkomen, werkt de mail niet meer.
> **DNSSEC staat aan bij Versio.** Dat moet eerst uit, anders zijn site én mail onbereikbaar na de overstap.

## DNS-records zoals ze nu zijn (opgehaald 19-11-2026)

Vergelijk dit met wat Cloudflare zelf inleest, en met het DNS-overzicht bij Versio (daar kunnen records staan die hier niet zichtbaar zijn).

| Type  | Naam              | Waarde                                                              | Proxy (Cloudflare)      |
|-------|-------------------|---------------------------------------------------------------------|-------------------------|
| A     | @                 | 185.199.108.153                                                     | Proxied (oranje wolk)   |
| A     | @                 | 185.199.109.153                                                     | Proxied                 |
| A     | @                 | 185.199.110.153                                                     | Proxied                 |
| A     | @                 | 185.199.111.153                                                     | Proxied                 |
| AAAA  | @                 | 2606:50c0:8000::153                                                 | Proxied                 |
| AAAA  | @                 | 2606:50c0:8001::153                                                 | Proxied                 |
| AAAA  | @                 | 2606:50c0:8002::153                                                 | Proxied                 |
| AAAA  | @                 | 2606:50c0:8003::153                                                 | Proxied                 |
| CNAME | www               | vonnies.github.io                                                   | Proxied                 |
| MX    | @ (prioriteit 10) | mx01.mail.icloud.com                                                | n.v.t. (altijd DNS only)|
| MX    | @ (prioriteit 10) | mx02.mail.icloud.com                                                | n.v.t.                  |
| TXT   | @                 | apple-domain=42BOQ1saCjIPUBjO                                       | n.v.t.                  |
| TXT   | @                 | v=spf1 include:icloud.com ~all                                      | n.v.t.                  |
| TXT   | @                 | google-site-verification=zkabXi8aP8BRirgmiDx0E1Rj4B_t6LcQarg_GHcAU9I | n.v.t.                  |
| CNAME | sig1._domainkey   | sig1.dkim.vonnieswaxenslijpservice.nl.at.icloudmailadmin.com        | **DNS only (grijze wolk)** |

## Stappen

1. **Cloudflare-account aanmaken** op https://dash.cloudflare.com/sign-up (dit doe je zelf).
2. **Domein toevoegen**: "Add a domain" → `vonnieswaxenslijpservice.nl` → kies het **Free**-plan.
   Cloudflare leest de bestaande records in. Controleer ze met de tabel hierboven:
   - website-records (A, AAAA, www) op **Proxied**
   - `sig1._domainkey` op **DNS only**: proxied breekt de mailhandtekening (DKIM)
   - ontbreekt er iets, voeg het toe. Verwijder niets wat je niet kent zonder te overleggen.
   Cloudflare toont nu twee nameservers (iets als `xxx.ns.cloudflare.com`). **Nog niet overzetten.**
3. **Bij Versio: DNSSEC uitzetten** voor het domein. Daarna **minimaal 2 uur wachten**.
   (Claude kan controleren of het DS-record echt weg is voordat je verdergaat.)
4. **Bij Versio: nameservers wijzigen** naar de twee van Cloudflare: `bill.ns.cloudflare.com` en `carol.ns.cloudflare.com`
   (de drie Versio-nameservers `ns-h.dns.versio.eu`, `ns-u.dns.versio.be`, `ns-v.dns.versio.nl` eruit).
5. **Wachten tot Cloudflare "Active" meldt** (meestal binnen een uur, soms langer). Site en mail blijven gewoon werken.
6. **SSL/TLS instellen** in Cloudflare:
   - SSL/TLS → Overview → **Full (strict)**
   - SSL/TLS → Edge Certificates → **Always Use HTTPS** aan
   - In GitHub (Settings → Pages) blijft "Enforce HTTPS" aan.
7. **Security headers toevoegen**: Rules → Overview → Create rule → **Response Header Transform Rule**
   - Naam: `Security headers`, geldt voor: **All incoming requests**
   - Per header "Set static":

   | Header                     | Waarde |
   |----------------------------|--------|
   | Strict-Transport-Security  | `max-age=31536000; includeSubDomains` |
   | X-Frame-Options            | `SAMEORIGIN` |
   | X-Content-Type-Options     | `nosniff` |
   | Referrer-Policy            | `strict-origin-when-cross-origin` |
   | Permissions-Policy         | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
   | Content-Security-Policy    | `default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests` |

   - Optioneel: "Remove" `Access-Control-Allow-Origin` (de scan noemt die te ruim).
8. **DNSSEC weer aanzetten**: Cloudflare → DNS → Settings → Enable DNSSEC. Cloudflare geeft een DS-record; vul dat bij Versio in.
9. **Testen**:
   - https://securityheaders.com/?q=vonnieswaxenslijpservice.nl (verwacht: A)
   - site laadt, menu en keuzehulp werken
   - mail sturen naar én vanaf jeroen@vonnieswaxenslijpservice.nl
10. **CLAUDE.md bijwerken**: DNS draait via Cloudflare, headers staan in de Transform Rule. Nieuwe externe bron (bijv. een embed)? Dan ook de CSP in Cloudflare én de meta-tag in `index.html` aanpassen.
