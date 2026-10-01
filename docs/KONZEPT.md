# Platinpfad: Produktkonzept

> Arbeitstitel. Die App sagt dir beim Spielen, was als Nächstes zu tun ist, damit du keine Trophäe verpasst. Ohne Spoiler, wenn du keine willst.

## Die Idee in einem Satz

Ein **Navi für Trophäen**: Statt einen langen Guide zu lesen, sagt dir die App immer nur den nächsten Schritt. Laut wird sie nur, wenn du sonst etwas für immer verpassen würdest.

## Für wen?

| Typ | Was sie wollen | Was sie heute nervt |
|---|---|---|
| **Entspannte Spieler** (Casuals) | Die Story geniessen. Platin wäre schön, ist aber kein Muss. | Guides sind Textwüsten voller Spoiler. Sie merken erst nach 30 Stunden, dass sie in Kapitel 3 etwas verpasst haben. |
| **Platin-Jäger** | Die effizienteste Route, Zähler für Sammelobjekte, keine Überraschungen. | Ständig zwischen Guide, Collectible-Video und Checkliste wechseln. Selbst mitschreiben, was schon erledigt ist. |
| **Dazwischen** (die grösste Gruppe) | Platin holen, aber die Geschichte nicht kaputtspoilern. | Ein Guide verrät in der Überschrift, wer stirbt. |

**Wichtigste Erkenntnis:** Trophy-Guides werden heute für Jäger geschrieben. Platinpfad macht daraus etwas, das auch Casuals ohne Anstrengung nebenher nutzen können.

## Fünf Prinzipien

1. **Ein Schritt zur Zeit.** Die App ist ein Navi, keine Landkarte. Auf dem Hauptscreen steht genau eine Sache, die jetzt wichtig ist.
2. **Spoiler nur auf Wunsch.** Jeder Hinweis hat drei Stufen: *Stupser* → *Konkret* → *Lösung*. Jede weitere Stufe tippt man bewusst an.
3. **Laut nur, wenn es zählt.** Warnfarbe gibt es nur für Verpassbares und den Point of No Return. Alles andere ist ruhig.
4. **Entspannt ist der Standard.** Im Entspannt-Modus zeigt die App nur, was man sonst endgültig verliert. Sammelkram, der später nachholbar ist, bleibt eingeklappt.
5. **Gebaut für den Daumen.** Die App ist ein Second Screen neben dem Fernseher: dunkles Design, grosse Tasten, Tab-Leiste unten, eine Hand reicht.

## Aufbau der App

```
Bibliothek ── Spiel ─┬─ Jetzt      ← Herzstück: der nächste Schritt
                     ├─ Route      ← Roadmap in Phasen, „Du bist hier“
                     ├─ Trophäen   ← Liste mit Filtern und gestuften Hinweisen
                     └─ Sammeln    ← Zähler pro Kapitel
```

### Bibliothek
- **Weiterspielen:** Das zuletzt gespielte Spiel mit Fortschritt, Kapitel und dem nächsten Schritt. Ein Tipp, und man ist drin.
- **Deine Spiele:** Steckbrief auf einen Blick (Schwierigkeit, Stunden, *wie viel ist verpassbar?*).
- Später: PSN-Konto verbinden, Spiele kommen automatisch dazu.

### Einrichtung (erster Start eines Spiels, unter 30 Sekunden)
1. **Wie willst du spielen?** *Entspannt* oder *Platin-Jagd*
2. **Spoiler-Schutz:** *Streng*, *Ausgewogen* oder *Offen*
3. **Wo stehst du gerade?** Kapitel wählen. Spätere Kapitelnamen bleiben verborgen.

### Jetzt (Herzstück)
- **Wo bin ich:** „Mission 8 von 30“ mit Vor/Zurück. Ein Tipp öffnet die Kapitelübersicht. Die zeigt nur Nummern und Warnsymbole, keine Namen.
- **Point-of-No-Return-Banner:** Erscheint nur im betroffenen Kapitel und zeigt eine Checkliste: „Vorher noch offen: Brief zustellen, 3 Möwenfedern.“
- **Nächster Schritt:** Eine grosse Karte. Verpassbares hat immer Vorrang, sonst gilt die Reihenfolge im Spiel. Dazu *Erledigt* und *Trophäe geholt*.
- **Mehr Hilfe:** Eingeklappte Links, die direkt an die passende Stelle des Guides springen, dazu eine Video-Suche. Der Inhalt bleibt beim Guide-Autor, wir liefern den richtigen Moment.
- **Auch in diesem Kapitel:** Weitere offene Punkte, eingeklappt.
- **Sammelobjekte hier:** Plus/Minus-Zähler für genau dieses Kapitel.
- **Vorschau ohne Spoiler:** „In den nächsten zwei Kapiteln kommt eine verpassbare Sache. Wir melden uns rechtzeitig.“ Genannt wird nur die Anzahl, kein Inhalt.
- **„Kapitel abgeschlossen“:** Ist noch etwas Verpassbares offen, fragt die App nach: *„Moment, da ist noch was offen.“*
- **Verpasst?** Eine ruhige Karte mit dem Weg zum Nachholen (Kapitelauswahl, neuer Spielstand, Neuladen).

### Route
- **Steckbrief:** Schwierigkeit, Zeit, Durchgänge, Anzahl verpassbarer Trophäen, Online-Zwang, ob der Schwierigkeitsgrad zählt.
- **Phasen als Route** (wie bei Roadmaps von Guide-Seiten, aber interaktiv): Story → Aufräumen → Grind. Mit Fortschritt pro Phase und „Du bist hier“.
- **Kapitelleiste** mit Markierungen für Verpassbares und Points of No Return.
- **Quellen:** Jede Quelle ist mit ihrer Nutzungsart gekennzeichnet (eigene Inhalte, lizenziert, nur verlinkt).

### Trophäen
- Übersicht nach Stufen (Platin/Gold/Silber/Bronze) und Prozent **nach PSN-Punkten**, wie auf der Konsole.
- Filter: *Offen · Verpassbar · Geholt · Alle*
- Versteckte Trophäen bleiben „Versteckte Trophäe“, bis man das Kapitel erreicht hat oder sie bewusst aufdeckt. Dass sie verpassbar ist und ab welchem Kapitel sie gilt, sieht man trotzdem.
- Platin kommt automatisch, wenn alles andere geholt ist.

### Sammeln
- Pro Sammeltyp ein Gesamtzähler mit Kapitelaufschlüsselung.
- Kennzeichnung *verpassbar nach Point of No Return* oder *jederzeit nachholbar*.
- Neben jedem Kapitel ein Link zu den Fundorten im Guide, direkt an der richtigen Stelle.

## Spoiler-Schutz im Detail

| Was | Streng | Ausgewogen (Standard) | Offen |
|---|---|---|---|
| Hinweisstufen ohne Antippen | Stupser | Stupser + Konkret | alle |
| Versteckte Trophäen | erst wenn geholt | sobald das Kapitel hinter dir liegt | sichtbar |
| Kapitelnamen | nur vergangene | bis zum aktuellen | alle |
| Vorschau kommender Missables | nur Anzahl | nur Anzahl | nur Anzahl |

Redaktionsregel: Schritt-Titel sind immer spoilerfrei („Ein Abschnitt hier belohnt Geduld“ statt „Schleich an der Wache vorbei, bevor X stirbt“). Die Datenprüfung (`validateGame`) schlägt Alarm, wenn ein Titel den Namen einer versteckten Trophäe enthält.

## Was macht es spassiger?

**Im Prototyp schon drin:**
- Benachrichtigung „Trophäe freigeschaltet“ im Stil der Konsole
- Platin-Feier mit Konfetti in den Trophäenfarben
- Fortschrittsring nach PSN-Punkten
- Route mit Stationen und „Du bist hier“
- Beruhigung statt Druck: „Hier gibt es gerade nichts zu beachten. Spiel einfach weiter.“

**Ideen für später:**
- **Automatische Kapitelerkennung per PSN-Sync:** Aus den geholten Story-Trophäen weiss die App, wo du bist, ohne dass du etwas eintippst. Für Casuals der grösste Komfortgewinn.
- **Session-Planer:** „Ich hab 30 Minuten.“ Die App schlägt vor, was in die Zeit passt.
- **Sanfte Ziele statt Streaks:** Wochenziele, die nicht bestrafen, wenn man mal nicht spielt.
- **Trophäenschrank:** Alle Platins mit Datum, Seltenheit und Spielzeit, schön zum Teilen.
- **Koop-Partnersuche** für Online- und Koop-Trophäen.
- **Community-Korrekturen:** „Dieser Hinweis stimmt nicht mehr (Patch 1.04)“, mit Prüfung durch die Redaktion.
- **Jahresrückblick:** „Dein Trophäenjahr 2026“
- **Weitere Plattformen:** Xbox-Achievements und Steam nach demselben Prinzip.

## Der Prototyp

- **Marvel's Wolverine** (PS5, September 2026) als aktuelles Spiel. Es hat keine verpassbaren Trophäen, also zeigt es den *entspannten* Fall: Die App beruhigt, statt zu warnen.
- **Kestrel's Wake** ist ein **fiktives** Testspiel mit 7 verpassbaren Trophäen, 2 Points of No Return und ohne Kapitelauswahl. Daran sieht man alle Warnfunktionen.
- Beide starten mit Beispiel-Spielständen. Zurücksetzen geht über ⚙ → *Spiel zurücksetzen*, danach erscheint die Einrichtung.

**Wichtig:** Die Wolverine-Daten sind Dummy-Daten. Die Eckdaten (42 Trophäen, 30 Missionen, keine Missables, Sammelobjekt-Anzahlen) stammen aus öffentlichen Übersichten. Ein Teil der Trophäennamen, die Verteilung auf Missionen und alle Hinweistexte sind Platzhalter.
