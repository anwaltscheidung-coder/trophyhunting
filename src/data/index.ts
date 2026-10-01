import type { Game } from '../types';
import { kestrelsWake } from './games/kestrels-wake';
import { wolverine } from './games/wolverine';

/**
 * Im Prototyp liegen die Guides im Bundle. Später kommen sie von der API,
 * siehe docs/ARCHITEKTUR.md.
 */
export const games: Game[] = [wolverine, kestrelsWake];

export function gameById(id: string): Game | undefined {
  return games.find((g) => g.id === id);
}
