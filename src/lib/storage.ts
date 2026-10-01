import type { GameProgress } from '../types';
import { newProgress } from './navigator';

const KEY = 'platinpfad:v1';

type Store = Record<string, GameProgress>;

/** Fortschritt liegt lokal im Browser. Später: Konto und PSN-Sync. */
export function loadAll(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    const out: Store = {};
    for (const [id, p] of Object.entries(parsed)) out[id] = { ...newProgress(), ...p };
    return out;
  } catch {
    return {};
  }
}

export function saveAll(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Speicher nicht verfügbar (privates Fenster o. Ä.): App läuft trotzdem.
  }
}
