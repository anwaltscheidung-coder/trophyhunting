import type { GameProgress } from '../types';
import { newProgress } from '../lib/navigator';

/**
 * Beispiel-Spielstände, damit der Prototyp nicht leer startet.
 * In den Einstellungen jedes Spiels zurücksetzbar.
 */
export function demoProgress(): Record<string, GameProgress> {
  const now = Date.now();
  return {
    'marvels-wolverine': {
      ...newProgress(),
      onboarded: true,
      mode: 'hunter',
      spoiler: 'balanced',
      chapterIndex: 7,
      earned: ['s01', 's03', 's05', 's07', 'waking', 'suitup', 'kebab', 'bottle1', 'adapt1', 'berserk', 'nose'],
      doneSteps: ['w-relax', 'w-door2'],
      collected: {
        'm2:crate': 3, 'm2:door': 1, 'm3:crate': 3, 'm3:bottle': 1, 'm4:crate': 4, 'm4:door': 1,
        'm5:crate': 2, 'm5:bottle': 1, 'm6:crate': 4, 'm6:door': 1,
      },
      lastPlayed: now,
    },
    'kestrels-wake': {
      ...newProgress(),
      onboarded: true,
      mode: 'relaxed',
      spoiler: 'balanced',
      chapterIndex: 4,
      earned: ['k-first', 'k-feather1', 'k-ferry', 'k-vell', 'k-map'],
      doneSteps: ['k-intro', 'k-difficulty', 'k-beacon-k1', 'k-beacon-k2', 'k-beacon-k3', 'k-beacon-k4', 'k-letter-take'],
      collected: { 'k1:feather': 2, 'k2:feather': 4, 'k3:feather': 3, 'k4:feather': 5, 'k5:feather': 1 },
      lastPlayed: now - 1000 * 60 * 60 * 26,
    },
  };
}
