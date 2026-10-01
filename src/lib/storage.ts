import type { GameProgress } from '../types';
import { newProgress } from './navigator';

const KEY = 'platinpfad:v1';

type Store = Record<string, GameProgress>;

/** Fortschritt liegt lokal im Browser. Später: Konto und PSN-Sync. */
export function loadAll(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) return {};
    const out: Store = {};
    for (const [id, p] of Object.entries(parsed)) {
      if (isObject(p)) out[id] = sanitize(p);
    }
    return out;
  } catch {
    return {};
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Alte oder kaputte Spielstände dürfen die App nicht zum Absturz bringen. */
function sanitize(raw: Record<string, unknown>): GameProgress {
  const base = newProgress();
  const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
  return {
    onboarded: raw.onboarded === true,
    mode: raw.mode === 'hunter' ? 'hunter' : base.mode,
    spoiler: raw.spoiler === 'strict' || raw.spoiler === 'open' ? raw.spoiler : base.spoiler,
    chapterIndex: typeof raw.chapterIndex === 'number' && raw.chapterIndex >= 0 ? Math.floor(raw.chapterIndex) : 0,
    earned: strings(raw.earned),
    doneSteps: strings(raw.doneSteps),
    collected: isObject(raw.collected) ? (raw.collected as GameProgress['collected']) : {},
    items: strings(raw.items),
    revealed: isObject(raw.revealed) ? (raw.revealed as GameProgress['revealed']) : {},
    lastPlayed: typeof raw.lastPlayed === 'number' ? raw.lastPlayed : undefined,
  };
}

export function saveAll(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Speicher nicht verfügbar (privates Fenster o. Ä.): App läuft trotzdem.
  }
}

export function clearAll(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nichts zu tun
  }
}
