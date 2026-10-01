/**
 * Datenmodell von Platinpfad.
 *
 * Ein Guide wird nicht als Fliesstext gespeichert, sondern als strukturierte
 * Daten: Kapitel, Trophäen, Schritte und Phasen. Nur so kann die App wissen,
 * was *jetzt* wichtig ist und was noch ein Spoiler wäre.
 */

export type Grade = 'platinum' | 'gold' | 'silver' | 'bronze';

export type TrophyCategory =
  | 'story'
  | 'collectible'
  | 'combat'
  | 'progression'
  | 'misc'
  | 'difficulty'
  | 'online';

/**
 * Gestufte Hinweise. Die App zeigt standardmässig nur so viel, wie der
 * Spoiler-Schutz erlaubt, und lässt den Rest antippen.
 *  1 = Stupser (Richtung, ohne Ort oder Lösung)
 *  2 = Konkret (wo und wann)
 *  3 = Lösung (genaue Anleitung, kann Story-Details enthalten)
 */
export type HintLevel = 1 | 2 | 3;

export interface Hint {
  level: HintLevel;
  text: string;
}

export interface Trophy {
  id: string;
  name: string;
  /** Offizielle Beschreibung aus der Trophäenliste. */
  description: string;
  grade: Grade;
  /** Auf PSN als „versteckt“ markiert, typisch für Story-Trophäen. */
  hidden: boolean;
  category: TrophyCategory;
  missable: boolean;
  /** Erstes Kapitel, in dem die Trophäe erreichbar ist. */
  availableFrom?: string;
  /** Letztes Kapitel, in dem eine verpassbare Trophäe noch erreichbar ist. */
  missableUntil?: string;
  /** Wie man eine verpasste Trophäe nachholt. */
  recovery?: string;
  hints: Hint[];
  /** Anteil der Spieler mit dieser Trophäe in Prozent (Demo-Wert). */
  rarity?: number;
}

export interface Chapter {
  id: string;
  number: number;
  /** Spoilerfreie Bezeichnung, z. B. „Mission 7“. */
  label: string;
  /** Echter Kapitelname. Wird erst gezeigt, wenn das Kapitel erreicht ist. */
  title?: string;
  /** Akt oder Abschnitt, z. B. „Akt I“. */
  act: string;
  /** Sammelobjekte in diesem Kapitel: Typ-ID → Anzahl. */
  collectibles?: Record<string, number>;
  /** Am Ende dieses Kapitels gibt es kein Zurück mehr. */
  pointOfNoReturn?: boolean;
}

export type StepKind = 'missable' | 'ponr' | 'trophy' | 'collectible' | 'tip';

export interface Step {
  id: string;
  chapterId: string;
  kind: StepKind;
  /** Kurzer, spoilerfreier Titel: was zu tun ist, nicht warum. */
  title: string;
  hints: Hint[];
  trophyIds?: string[];
  /** Handverlesene Links, z. B. ein Video mit Zeitmarke. */
  links?: ExternalLink[];
  /**
   * Auch im Entspannt-Modus zeigen. Verpassbares und Point-of-no-Return
   * wird immer gezeigt, egal was hier steht.
   */
  relaxed?: boolean;
}

export interface Phase {
  id: string;
  title: string;
  summary: string;
  trophyIds: string[];
  hours?: string;
}

export interface CollectibleType {
  id: string;
  name: string;
  /** Mehrzahl für Zähler, z. B. „Whisky-Flaschen“. */
  plural: string;
  total: number;
  trophyId?: string;
  /** Kann ein Sammelobjekt endgültig verloren gehen? */
  missable: boolean;
}

/**
 * Verweis auf externe Hilfe (Guide-Abschnitt, Video). Wir zeigen nur den
 * Link, nie den fremden Inhalt.
 */
export interface ExternalLink {
  kind: 'guide' | 'video';
  /** Anbieter, z. B. „PowerPyx“ oder „YouTube“. */
  source: string;
  label: string;
  url: string;
}

/**
 * Aus diesen Angaben baut die App passende Links pro Trophäe und Kapitel.
 * Guide-Links springen per Textmarke (#:~:text=…) direkt zur richtigen Stelle.
 */
export interface LinkSources {
  trophyGuide?: { source: string; url: string };
  collectibleGuide?: { source: string; url: string };
  /** Spielname für die Video-Suche, z. B. „Marvel's Wolverine“. */
  videoQuery?: string;
}

export interface GameMeta {
  /** Schwierigkeit 1–10. */
  difficulty: number;
  hours: string;
  playthroughs: number;
  missableCount: number;
  onlineTrophies: boolean;
  difficultyTrophies: boolean;
  /** Wann und wie Kapitel- bzw. Missionsauswahl verfügbar wird. */
  chapterSelect: string;
}

export interface SourceRef {
  name: string;
  url?: string;
  /**
   * own: eigene Redaktion oder Community
   * licensed: mit Lizenz oder Partnerschaft übernommen
   * link: nur verlinkt, Inhalte nicht übernommen
   */
  usage: 'own' | 'licensed' | 'link';
}

export interface Game {
  id: string;
  title: string;
  platforms: string[];
  releaseDate: string;
  /** Zwei Farben für das Cover-Muster (Platzhalter für echte Cover). */
  cover: [string, string];
  /** Kurzbezeichnung für Kapitel, z. B. „Mission“ oder „Kapitel“. */
  chapterNoun: string;
  meta: GameMeta;
  chapters: Chapter[];
  trophies: Trophy[];
  steps: Step[];
  phases: Phase[];
  collectibles: CollectibleType[];
  sources: SourceRef[];
  links?: LinkSources;
  /** Hinweis, der im Spiel angezeigt wird (z. B. Demo-Daten). */
  dataNote?: string;
}

export type Mode = 'relaxed' | 'hunter';
export type SpoilerShield = 'strict' | 'balanced' | 'open';

export interface GameProgress {
  onboarded: boolean;
  mode: Mode;
  spoiler: SpoilerShield;
  /** Index in game.chapters. */
  chapterIndex: number;
  earned: string[];
  doneSteps: string[];
  /** Schlüssel `${chapterId}:${collectibleTypeId}` → gefundene Anzahl. */
  collected: Record<string, number>;
  /** Wie weit Hinweise aufgedeckt wurden: Schritt- oder Trophäen-ID → Stufe. */
  revealed: Record<string, HintLevel>;
  lastPlayed?: number;
}
