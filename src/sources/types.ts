/**
 * Schnittstelle für Datenquellen der Import-Pipeline (noch nicht umgesetzt).
 *
 *   Quelle → Adapter → Rohdaten → Normalisieren → Strukturieren → validateGame → Freigabe → Game
 *
 * Jede Quelle bekommt einen eigenen Adapter. Der Adapter sagt ausdrücklich,
 * was er liefern *darf*. Fremde Guide-Texte werden nie direkt übernommen,
 * siehe docs/ARCHITEKTUR.md, Abschnitt „Datenbeschaffung“.
 */
import type { Grade, SourceRef } from '../types';

export type SourceCapability =
  /** Trophäennamen, Beschreibungen, Stufen, versteckt ja/nein */
  | 'trophy-list'
  /** Anteil der Spieler pro Trophäe */
  | 'rarity'
  /** Eckdaten: Schwierigkeit, Zeit, Verpassbares, Kapitelauswahl */
  | 'facts'
  /** Strukturierte Hinweise (nur eigene oder lizenzierte Quellen) */
  | 'guide'
  /** Fortschritt eines Nutzers (mit dessen Zustimmung) */
  | 'user-progress';

export interface RawTrophy {
  externalId: string;
  name: string;
  description: string;
  grade: Grade;
  hidden: boolean;
  rarity?: number;
}

/** Ein Abschnitt aus einer lizenzierten oder eigenen Guide-Quelle. */
export interface RawGuideSection {
  heading: string;
  text: string;
  /** Kapitel, auf das sich der Abschnitt bezieht, falls bekannt. */
  chapterHint?: string;
  trophyRefs?: string[];
}

export interface RawGameData {
  source: string;
  fetchedAt: string;
  title: string;
  trophies?: RawTrophy[];
  guide?: RawGuideSection[];
}

export interface SourceAdapter {
  id: string;
  name: string;
  usage: SourceRef['usage'];
  provides: SourceCapability[];
  fetchGame(query: { title: string; platformId?: string }): Promise<RawGameData>;
}
