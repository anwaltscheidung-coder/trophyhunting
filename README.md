# Platinpfad

**Dein Navi zur Platin. Ohne Spoiler.**

Eine Web-App für Trophy Hunter und alle, die einfach nichts verpassen wollen. Statt eines langen Guides zeigt sie immer nur den nächsten Schritt. Sie warnt rechtzeitig vor verpassbaren Trophäen und Points of No Return und verrät nur so viel, wie man sehen will.

> Status: **klickbarer Prototyp** mit Demo-Daten. Arbeitstitel „Platinpfad“.

## Was der Prototyp zeigt

- **Jetzt-Ansicht:** Wo bin ich, was ist der nächste Schritt, was darf ich hier nicht verpassen?
- **Hinweise in drei Stufen:** Stupser → Konkret → Lösung, gesteuert über den Spoiler-Schutz
- **Warnsystem:** verpassbare Trophäen, Points of No Return mit Checkliste, Nachfrage beim Kapitelwechsel
- **Zwei Modi:** *Entspannt* (nur Verpassbares) und *Platin-Jagd* (alles)
- **Anleitungen mit Bildern** für knifflige Trophäen: Schritte, Screenshots mit Markierungen, Tipps, Warnungen, Spoiler-Schutz
- **Sammelobjekte einzeln abhaken**, mit Fundort und Bild
- **Route, Trophäenliste, Sammelzähler,** Benachrichtigung „Trophäe freigeschaltet“ und Platin-Feier
- **Zwei Demo-Spiele:**
  - *Marvel's Wolverine* (aktuell, keine Missables), Dummy-Daten
  - *Kestrel's Wake*, ein fiktives Testspiel mit 7 Missables und 2 Points of No Return

## Loslegen

```bash
npm install
npm run dev          # Entwicklungsserver auf http://localhost:5173
npm test             # Tests für Navi-Logik und Datenprüfung
npm run build        # Typecheck und Produktions-Build nach dist/
npm run build:single # eine einzelne HTML-Datei nach preview/ (zum Teilen)
```

## Projektstruktur

```
docs/
  KONZEPT.md          Produktkonzept: Zielgruppen, Prinzipien, Screens, Spoiler-Schutz
  ARCHITEKTUR.md      Technik, Datenmodell, Datenbeschaffung (inkl. Rechtliches), Roadmap
src/
  types.ts            Datenmodell
  lib/navigator.ts    Kernlogik: nächster Schritt, Missables, Spoiler-Regeln, Punkte
  lib/validate.ts     Qualitätsprüfung für Guide-Daten
  lib/storage.ts      Fortschritt im Browser speichern
  data/games/         Demo-Guides (Wolverine, Kestrel's Wake)
  sources/types.ts    Schnittstelle für künftige Datenquellen
  components/         Oberfläche (Bibliothek, Jetzt, Route, Trophäen, Sammeln, Sheets)
scripts/
  inline-build.mjs    baut die Einzeldatei-Vorschau
```

## Wichtig zu den Daten

Die Wolverine-Inhalte sind **Platzhalter**. Die Eckdaten stammen aus öffentlichen Übersichten, Hinweistexte und Missionszuordnung sind erfunden. Die Anleitung zu „Adamantium Dreams“ zeigt den Aufbau. Ihre Texte und Bilder werden beim Import durch Inhalte aus dem PowerPyx-Guide ersetzt.

PowerPyx hat der Nutzung seiner Guide-Inhalte mündlich zugestimmt. Vor dem ersten echten Import sollte das schriftlich festgehalten werden. Wie der Import funktioniert, steht in [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md#import-aus-dem-partner-guide).
