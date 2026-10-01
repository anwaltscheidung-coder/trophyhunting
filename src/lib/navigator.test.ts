import { describe, expect, it } from 'vitest';
import { games } from '../data';
import { kestrelsWake as kw } from '../data/games/kestrels-wake';
import { wolverine as wv } from '../data/games/wolverine';
import type { GameProgress } from '../types';
import {
  blockersBeforeLeaving,
  collectiblesAtRisk,
  isTrophyRevealed,
  lostCollectibles,
  missablesAtRisk,
  missedTrophies,
  newProgress,
  nextStep,
  ponrStep,
  score,
  showChapterTitle,
  toggleEarned,
  upcomingMissableCount,
  visibleHintLevel,
} from './navigator';
import { validateGame } from './validate';

const at = (chapterIndex: number, extra: Partial<GameProgress> = {}): GameProgress => ({
  ...newProgress(),
  onboarded: true,
  chapterIndex,
  ...extra,
});

describe('Guide-Daten', () => {
  for (const game of games) {
    it(`${game.title} besteht die Qualitätsprüfung`, () => {
      expect(validateGame(game)).toEqual([]);
    });
  }

  it('erkennt eine verpassbare Trophäe ohne Warn-Schritt', () => {
    const broken = { ...kw, steps: kw.steps.filter((s) => !s.trophyIds?.includes('k-ferry')) };
    expect(validateGame(broken)).toContain('kestrels-wake: k-ferry: verpassbar, aber kein Schritt warnt davor');
  });

  it('Wolverine hat die Eckdaten der echten Trophäenliste', () => {
    const s = score(wv, newProgress());
    expect(s.total).toBe(42);
    expect(s.byGrade.platinum.total).toBe(1);
    expect(s.byGrade.gold.total).toBe(4);
    expect(s.byGrade.silver.total).toBe(9);
    expect(s.byGrade.bronze.total).toBe(28);
  });
});

describe('nächster Schritt', () => {
  it('zieht Verpassbares vor', () => {
    // Kapitel 4: Leuchtfeuer, Brief und Stadtplan sind verpassbar
    expect(nextStep(kw, at(3))?.kind).toBe('missable');
  });

  it('zeigt im Entspannt-Modus nur Wichtiges', () => {
    const relaxed = nextStep(wv, at(0, { mode: 'relaxed' }));
    const hunter = nextStep(wv, at(0, { mode: 'hunter', doneSteps: ['w-relax'] }));
    expect(relaxed?.id).toBe('w-relax');
    expect(hunter?.id).toBe('w-parry');
    expect(nextStep(wv, at(0, { mode: 'relaxed', doneSteps: ['w-relax'] }))).toBeUndefined();
  });

  it('gilt als erledigt, sobald die verknüpfte Trophäe geholt ist', () => {
    const p = at(2, { earned: ['k-ferry'], doneSteps: ['k-beacon-k3'] });
    expect(nextStep(kw, p)).toBeUndefined();
  });

  it('zeigt den Point of No Return als eigenen Hinweis', () => {
    expect(ponrStep(kw, at(4))?.id).toBe('k-ponr5');
    expect(nextStep(kw, at(4))?.kind).not.toBe('ponr');
    expect(ponrStep(kw, at(3))).toBeUndefined();
  });
});

describe('verpassbare Trophäen', () => {
  it('meldet, was jetzt auf dem Spiel steht', () => {
    const ids = missablesAtRisk(kw, at(2)).map((t) => t.id);
    expect(ids).toContain('k-ferry');
    expect(ids).not.toContain('k-letter');
  });

  it('meldet verpasste Trophäen nach dem Fenster', () => {
    expect(missedTrophies(kw, at(3)).map((t) => t.id)).toEqual(['k-ferry']);
    expect(missedTrophies(kw, at(3, { earned: ['k-ferry'] }))).toEqual([]);
  });

  it('kündigt kommende Verpassbare an, ohne Details', () => {
    // Von Kapitel 3 aus: Brief, Stadtplan (Kap. 4) und Unbemerkt (Kap. 5)
    expect(upcomingMissableCount(kw, at(2))).toBe(3);
    expect(upcomingMissableCount(wv, at(0))).toBe(0);
  });

  it('listet offene verpassbare Schritte vor dem Weitergehen', () => {
    const ids = blockersBeforeLeaving(kw, at(3)).map((s) => s.id);
    expect(ids).toEqual(['k-letter-take', 'k-map-step', 'k-beacon-k4']);
  });
});

describe('Sammelobjekte und Point of No Return', () => {
  it('zählt fehlende Federn seit dem letzten PONR', () => {
    // Kapitel 5 ist ein PONR. Kapitel 1–5 enthalten 2+4+4+5+3 = 18 Federn.
    const p = at(4, { collected: { 'k1:feather': 2, 'k2:feather': 4 } });
    expect(collectiblesAtRisk(kw, p)).toEqual([{ type: kw.collectibles[0], missing: 12 }]);
    expect(collectiblesAtRisk(kw, at(3))).toEqual([]);
  });

  it('meldet Federn hinter einem passierten PONR als verloren', () => {
    expect(lostCollectibles(kw, at(4))).toEqual([]);
    expect(lostCollectibles(kw, at(5))[0].missing).toBe(18);
  });
});

describe('Trophäen und Punkte', () => {
  it('vergibt die Platin automatisch', () => {
    let p = at(7, { earned: kw.trophies.filter((t) => t.grade !== 'platinum' && t.id !== 'k-end').map((t) => t.id) });
    expect(p.earned).not.toContain('plat');
    p = toggleEarned(kw, p, 'k-end');
    expect(p.earned).toContain('plat');
    expect(score(kw, p).percent).toBe(100);
    p = toggleEarned(kw, p, 'k-end');
    expect(p.earned).not.toContain('plat');
  });

  it('rechnet Prozent nach PSN-Punkten', () => {
    const p = at(0, { earned: ['k-hard'] });
    const s = score(kw, p);
    expect(s.points).toBe(90);
    expect(s.percent).toBe(Math.floor((90 / s.maxPoints) * 100));
  });
});

describe('Spoiler-Schutz', () => {
  const hiddenStory = kw.trophies.find((t) => t.id === 'k-vell')!;

  it('verbirgt versteckte Trophäen je nach Stufe', () => {
    expect(isTrophyRevealed(kw, hiddenStory, at(5, { spoiler: 'strict' }))).toBe(false);
    expect(isTrophyRevealed(kw, hiddenStory, at(2, { spoiler: 'balanced' }))).toBe(false);
    expect(isTrophyRevealed(kw, hiddenStory, at(4, { spoiler: 'balanced' }))).toBe(true);
    expect(isTrophyRevealed(kw, hiddenStory, at(0, { spoiler: 'open' }))).toBe(true);
    expect(isTrophyRevealed(kw, hiddenStory, at(0, { spoiler: 'strict', earned: ['k-vell'] }))).toBe(true);
  });

  it('zeigt Kapitelnamen erst, wenn man dort ist', () => {
    expect(showChapterTitle(3, at(3, { spoiler: 'balanced' }))).toBe(true);
    expect(showChapterTitle(4, at(3, { spoiler: 'balanced' }))).toBe(false);
    expect(showChapterTitle(3, at(3, { spoiler: 'strict' }))).toBe(false);
  });

  it('deckt Hinweise nur so weit auf wie erlaubt', () => {
    expect(visibleHintLevel(at(0, { spoiler: 'strict' }), 'x')).toBe(1);
    expect(visibleHintLevel(at(0, { spoiler: 'strict', revealed: { x: 3 } }), 'x')).toBe(3);
    expect(visibleHintLevel(at(0, { spoiler: 'balanced' }), 'x')).toBe(2);
  });
});
