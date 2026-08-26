### Bowling Game – Coding Challenge

Eine Angular-Anwendung zur Erfassung und Auswertung eines 10-Frame-Bowling-Spiels für einen Spieler. Der Fokus liegt auf einer klaren fachlichen Trennung, nachvollziehbaren Regeln, robustem Scoring und hoher Testabdeckung.

---

### Architektur

Die Fach- und UI-Logik ist nach dem **Single Responsibility Principle (SRP)** strikt getrennt:

1. `GameRuleService` (**Regeln & Validierung**):
  - Bestimmt den Zustand eines Frames (`strike`, `spare`, `open`).
  - Berechnet die maximal erlaubte Pin-Anzahl für den nächsten Wurf (unter Berücksichtigung von Standard-Frames und den Sonderregeln im 10. Frame).
  - Validiert Eingaben (Gültigkeitsbereich 0–10, Frame-Pin-Limits).

2. `ScoreCalculationService` (**Punkteberechnung / Scoring**):
  - Pure Functionality ohne internen Zustand.
  - Berechnet Boni für Strikes (nächste 2 Würfe) und Spares (nächster Wurf).
  - Erzeugt ein neues Array mit kumulierten Gesamtpunkten pro Frame, ohne Originaldaten zu mutieren.

3. `FrameService` (**Spielzustand & State Management**):
  - Verwaltet den Zustand des laufenden Spiels (aktuelle Frames, Wurf-Fortschritt, Spielende).
  - Nutzt Angular Signals für reaktive Zustandshaltung (`frames`, `gameCompleted`).
  - Bietet Methoden wie `roll(pins)` und `resetGame()`.

4. **UI-Komponenten (Präsentation & Usability)**:
  - `AppComponent` / `ScoreboardComponent`: Eingabemaske mit direkter Validierung und Feedback bei Fehlern.
  - `FrameViewComponent`: Übersichtliche Darstellung der einzelnen Frames (1–10) inkl. Wurf-Historie und Zwischenstand.

---

### Fachliche Regeln & Besonderheiten

- **Standard-Frames (1–9):**
  - Max. 2 Würfe pro Frame.
  - Sofortiger Wechsel zum nächsten Frame bei Strike.
- **10. Frame:**
  - Bis zu 3 Würfe möglich: Bei Strike oder Spare wird ein zusätzlicher Bonuswurf freigeschaltet.
  - Pin-Set wird nach einem Strike oder Spare im 10. Frame für den nächsten Wurf wieder auf 10 zurückgesetzt.
- **Bonus-Berechnung:**
  - Strike = 10 + Punkte der nächsten 2 Würfe.
  - Spare = 10 + Punkte des nächsten 1 Wurfes.

---

### Installation & Ausführung

#### Voraussetzungen
- Node.js 22.0.x
- npm

#### Projekt starten
```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm start
# oder: ng serve

# Tests mit coverage
npm test
```

---

### Ausblick
- **Multiplayer:**
  - Nachträglich kann ohne großen Aufwand ein Multiplayer-Modus hinzugefügt werden.
  - Dazu benötigt man eine Liste von Spieler-Objekten. Nachdem ein Frame des ersten Spielers beendet wurde, wird nicht in den nächsten Frame gewechselt, sondern zum nächsten Spieler.
  - Das wiederholt sich so lange, bis alle Spieler diesen Frame beendet haben. Danach wird in den nächsten Frame gewechselt.
  - Jedes Spieler-Objekt enthält dabei seine eigenen Frames als State, die in das Scorboard überführt werden.


- **Usability verbessern:**
  - Das Wurf/Roll-Eingabefeld sollte einen Validator für korrekte und im aktuellen Frame mögliche Werte erhalten.
  - Alternativ ein Button-Pad: Es sollen nur die Buttons aktiviert sein, deren Pin-Anzahl im aktuellen Wurf noch geworfen werden kann.


- **Visuelle Spielzüge & Physik:**
  - Top-Down-Ansicht einer Bowlingbahn.
  - Steuerung über die Maus: Zwischen Bowlingkugel und Cursor-Position wird der Richtungsvektor berechnet; die Entfernung der Maus zur Kugel bestimmt die Wurfstärke.
  - Implementierung eines realistischen Kugelverhaltens inklusive physikalischen Einflusses auf jeden berührten Pin.
  - Das Resultat kann direkt in meinen Algorithmus einfließen.


- **Spielstand speichern:**
  - Persistierung des aktuellen Spielstands im `localStorage`.

