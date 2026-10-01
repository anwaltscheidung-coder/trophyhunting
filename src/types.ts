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
  /** Ausführliche Anleitung für knifflige Trophäen. */
  guide?: TrophyGuide;
}

/**
 * Markierung auf einem Bild, in Prozent der Bildbreite und -höhe.
 * So können wir auf jedem Screenshot die wichtige Stelle hervorheben.
 */
export interface ImageMark {
  x: number;
  y: number;
  /** Radius in Prozent der Bildbreite. */
  r?: number;
  label?: string;
}

export interface GuideImage {
  /** Bild-URL. Später vom eigenen Bildserver, nie direkt von der Partnerseite. */
  src: string;
  alt: string;
  caption?: string;
  /** Bildnachweis, z. B. „PowerPyx“. Pflicht bei Partner-Inhalten. */
  credit?: string;
  marks?: ImageMark[];
  /** Bild zeigt Story-Inhalte und bleibt bis zum Antippen unscharf. */
  spoiler?: boolean;
}

export interface GuideSection {
  kind: 'step' | 'tip' | 'warning';
  title?: string;
  text: string;
  images?: GuideImage[];
  /** Abschnitt verrät Story-Inhalte. */
  spoiler?: boolean;
}

export interface TrophyGuide {
  /** Woher der Inhalt stammt. Partner-Inhalte werden immer genannt. */
  source: { name: string; url?: string; usage: SourceRef['usage'] };
  summary: string;
  /** Geschätzter Aufwand, z. B. „ca. 20 Min.“ */
  time?: string;
  /** Wie knifflig ist die Trophäe selbst? 1–5 */
  difficulty?: 1 | 2 | 3 | 4 | 5;
  /** Was man vorher braucht oder erledigt haben sollte. */
  prerequisites?: string[];
  sections: GuideSection[];
  /** Hinweis, solange der Inhalt Platzhalter ist. */
  placeholder?: boolean;
}

/** Ein einzelnes Sammelobjekt mit Fundort und Bildern. */
export interface CollectibleItem {
  id: string;
  typeId: string;
  chapterId: string;
  /** Nummer innerhalb des Kapitels, in Reihenfolge entlang des Wegs. */
  number: number;
  /** Stupser ohne genauen Ort. */
  hint: string;
  /** Genauer Fundort. */
  location: string;
  images?: GuideImage[];
  credit?: string;
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
  /** Einzelne Sammelobjekte mit Fundort (wo vorhanden). */
  collectibleItems?: CollectibleItem[];
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
  /** Einzeln abgehakte Sammelobjekte (IDs aus game.collectibleItems). */
  items: string[];
  /** Wie weit Hinweise aufgedeckt wurden: Schritt- oder Trophäen-ID → Stufe. */
  revealed: Record<string, HintLevel>;
  lastPlayed?: number;
}
