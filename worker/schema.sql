-- D1-database "vonnies-stats": eigen bezoekers- en klikteller (geen cookies, geen IP-adressen).
CREATE TABLE IF NOT EXISTS events (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      TEXT NOT NULL,     -- tijdstip (UTC, ISO)
  type    TEXT NOT NULL,     -- bezoek | klik | keuzehulp | gezien
  label   TEXT,              -- bezoek: pad; klik: soort (whatsapp, bellen, mail, instagram, maps, menu, link #…); keuzehulp: ski/mid/rec; gezien: sectie-id
  section TEXT,              -- sectie waarin geklikt is
  tekst   TEXT,              -- tekst op de knop of link
  ref     TEXT,              -- bezoek: domein waar de bezoeker vandaan kwam
  device  TEXT,              -- desktop | mobiel | tablet
  country TEXT,              -- landcode volgens Cloudflare
  visitor TEXT               -- dagelijks wisselende anonieme code (zout wordt na een dag weggegooid)
);
CREATE INDEX IF NOT EXISTS events_ts ON events (ts);
CREATE INDEX IF NOT EXISTS events_type ON events (type, label);

CREATE TABLE IF NOT EXISTS salt (
  day   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
