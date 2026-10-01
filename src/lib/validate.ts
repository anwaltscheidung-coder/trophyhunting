import type { Game } from '../types';
import { chapterIndexOf } from './navigator';

/**
 * Qualitätsprüfung für Guide-Daten. Läuft in den Tests für jedes Spiel und
 * später in der Import-Pipeline, bevor ein Guide live geht.
 * Gibt eine Liste von Problemen zurück; leer heisst: alles in Ordnung.
 */
export function validateGame(game: Game): string[] {
  const issues: string[] = [];
  const err = (msg: string) => issues.push(`${game.id}: ${msg}`);

  const dupes = (ids: string[], what: string) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) err(`${what}-ID doppelt: ${id}`);
      seen.add(id);
    }
  };
  dupes(game.chapters.map((c) => c.id), 'Kapitel');
  dupes(game.trophies.map((t) => t.id), 'Trophäen');
  dupes(game.steps.map((s) => s.id), 'Schritt');

  const trophyIds = new Set(game.trophies.map((t) => t.id));
  const chapterIds = new Set(game.chapters.map((c) => c.id));

  const plats = game.trophies.filter((t) => t.grade === 'platinum');
  if (plats.length > 1) err('mehr als eine Platin-Trophäe');

  for (const t of game.trophies) {
    if (t.availableFrom && !chapterIds.has(t.availableFrom)) err(`${t.id}: unbekanntes Kapitel ${t.availableFrom}`);
    if (t.missable) {
      if (!t.missableUntil) err(`${t.id}: verpassbar, aber ohne missableUntil`);
      else if (!chapterIds.has(t.missableUntil)) err(`${t.id}: unbekanntes Kapitel ${t.missableUntil}`);
      else if (chapterIndexOf(game, t.availableFrom) > chapterIndexOf(game, t.missableUntil)) {
        err(`${t.id}: missableUntil liegt vor availableFrom`);
      }
      // Kernversprechen der App: Jede verpassbare Trophäe hat einen Schritt,
      // der rechtzeitig daran erinnert. Bei verpassbaren Sammelobjekten
      // übernimmt das der Zähler mit seiner Warnung vor dem Point of No Return.
      const warnedByStep = game.steps.some((s) => s.trophyIds?.includes(t.id));
      const warnedByCounter = game.collectibles.some((c) => c.missable && c.trophyId === t.id);
      if (!warnedByStep && !warnedByCounter) err(`${t.id}: verpassbar, aber kein Schritt warnt davor`);
    }
    checkHints(t.hints, `${t.id}`, err);
  }

  for (const s of game.steps) {
    if (!chapterIds.has(s.chapterId)) err(`Schritt ${s.id}: unbekanntes Kapitel ${s.chapterId}`);
    for (const id of s.trophyIds ?? []) {
      if (!trophyIds.has(id)) err(`Schritt ${s.id}: unbekannte Trophäe ${id}`);
    }
    checkHints(s.hints, `Schritt ${s.id}`, err);
    // Spoiler-Lint: Namen versteckter Trophäen gehören nicht in Titel,
    // die ohne Antippen sichtbar sind.
    for (const t of game.trophies) {
      if (t.hidden && s.title.toLowerCase().includes(t.name.toLowerCase())) {
        err(`Schritt ${s.id}: Titel verrät versteckte Trophäe „${t.name}“`);
      }
    }
  }

  for (const type of game.collectibles) {
    const sum = game.chapters.reduce((n, c) => n + (c.collectibles?.[type.id] ?? 0), 0);
    if (sum !== type.total) err(`${type.plural}: Summe der Kapitel ${sum} ≠ Gesamt ${type.total}`);
    if (type.trophyId && !trophyIds.has(type.trophyId)) err(`${type.plural}: unbekannte Trophäe ${type.trophyId}`);
  }
  for (const c of game.chapters) {
    for (const typeId of Object.keys(c.collectibles ?? {})) {
      if (!game.collectibles.some((t) => t.id === typeId)) err(`${c.id}: unbekannter Sammeltyp ${typeId}`);
    }
  }

  const inPhase = new Map<string, number>();
  for (const ph of game.phases) {
    for (const id of ph.trophyIds) {
      if (!trophyIds.has(id)) err(`Phase ${ph.id}: unbekannte Trophäe ${id}`);
      inPhase.set(id, (inPhase.get(id) ?? 0) + 1);
    }
  }
  for (const t of game.trophies) {
    if (t.grade === 'platinum') continue;
    const n = inPhase.get(t.id) ?? 0;
    if (n !== 1) err(`${t.id}: steht in ${n} Phasen (erwartet: genau 1)`);
  }

  const urls = [
    game.links?.trophyGuide?.url,
    game.links?.collectibleGuide?.url,
    ...game.steps.flatMap((s) => (s.links ?? []).map((l) => l.url)),
  ].filter((u): u is string => u !== undefined);
  for (const u of urls) {
    if (!u.startsWith('https://')) err(`Link ohne https: ${u}`);
  }

  const missables = game.trophies.filter((t) => t.missable).length;
  if (missables !== game.meta.missableCount) {
    err(`meta.missableCount ist ${game.meta.missableCount}, verpassbar sind aber ${missables}`);
  }

  return issues;
}

function checkHints(hints: { level: number }[], where: string, err: (m: string) => void) {
  if (!hints.some((h) => h.level === 1)) err(`${where}: kein Hinweis der Stufe 1`);
  for (let i = 1; i < hints.length; i++) {
    if (hints[i].level <= hints[i - 1].level) err(`${where}: Hinweisstufen nicht aufsteigend`);
  }
}
