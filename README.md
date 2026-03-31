# Familienkalender for Echo Show 15

Statische Wochenkalender-Webapp, die iCloud- und Google-Kalender als ICS-Feeds liest und auf einem Amazon Echo Show 15 anzeigt.

## Setup

### 1. iCloud-Kalender freigeben

1. Kalender-App auf dem Mac oder iPhone öffnen
2. Rechtsklick auf den gewünschten Kalender → **Kalender teilen…**
3. **Öffentlicher Kalender** aktivieren
4. Die angezeigte URL kopieren (beginnt mit `webcal://`)
5. `webcal://` durch `https://` ersetzen — das ist die ICS-URL

### 2. Google-Kalender freigeben

1. [Google Kalender](https://calendar.google.com) im Browser öffnen
2. Zahnrad → **Einstellungen** → gewünschten Kalender auswählen
3. Unter **Kalender integrieren** → **Geheime Adresse im iCal-Format** kopieren
4. Das ist die ICS-URL (beginnt mit `https://calendar.google.com/calendar/ical/…`)

### 3. URLs in index.html eintragen

`index.html` im Texteditor öffnen und im `CONFIG`-Block die URLs eintragen:

```js
CALENDARS: [
  {
    name: 'Familie',
    url: 'https://p123-caldav.icloud.com/published/2/DEIN-LINK',
    color: '#0f3460'
  },
  {
    name: 'Arbeit',
    url: 'https://calendar.google.com/calendar/ical/DEINE-ID/basic.ics',
    color: '#e94560'
  }
]
```

Farben können frei angepasst werden (Hex-Codes). Weitere Kalender einfach als zusätzliche Einträge hinzufügen.

### 4. Auf GitHub Pages deployen

1. Neues GitHub-Repository erstellen (z.B. `familienkalender`)
2. `index.html` hochladen (per Upload oder `git push`)
3. **Settings → Pages → Source** auf `main` Branch setzen
4. Nach 1-2 Minuten ist die Seite unter `https://DEIN-USER.github.io/familienkalender/` erreichbar

### 5. Auf Echo Show 15 anzeigen

1. Den Alexa Skill **MyPage** installieren
2. In der MyPage-App die GitHub-Pages-URL eintragen
3. Der Kalender wird jetzt dauerhaft auf dem Echo Show angezeigt
4. Die Seite lädt sich alle 4 Minuten selbst neu (verhindert, dass der Echo Show zum Homescreen zurückkehrt)

## CORS-Proxy (Cloudflare Worker)

iCloud und Google blockieren direkte Browser-Requests (CORS). Außerdem verlangt iCloud spezielle HTTP-Headers. Deshalb ist ein eigener CORS-Proxy nötig — am einfachsten als **Cloudflare Worker** (kostenlos).

### Worker deployen

1. [Cloudflare-Konto erstellen](https://dash.cloudflare.com/sign-up) (kostenlos)
2. Im Dashboard → **Workers & Pages** → **Create Worker**
3. Namen vergeben (z.B. `kalender-proxy`)
4. Den Inhalt von `worker.js` aus diesem Projekt in den Editor einfügen
5. **Deploy** klicken
6. Die Worker-URL kopieren (z.B. `https://kalender-proxy.DEIN-NAME.workers.dev`)
7. In `index.html` im `CONFIG`-Block eintragen:

```js
CORS_PROXY: 'https://kalender-proxy.DEIN-NAME.workers.dev/?url=',
```

Der Worker leitet Kalender-Requests weiter, setzt die nötigen Headers für iCloud und erlaubt nur bekannte Kalender-Domains (iCloud, Google, Outlook).

## Konfiguration

Alle Einstellungen befinden sich oben in `index.html` im `CONFIG`-Objekt:

| Einstellung | Beschreibung |
|---|---|
| `CALENDARS` | Array mit Kalender-Name, URL und Farbe |
| `CORS_PROXY` | CORS-Proxy-URL (Prefix vor die ICS-URL) |
| `WEEK_START` | Wochenstart: `0` = Sonntag, `1` = Montag |
| `REFRESH_INTERVAL` | Auto-Refresh in Millisekunden (Standard: 240000 = 4 Min) |
| `THEME` | Farbschema (Hintergrund, Text, Akzent, Grid) |
