import type {
  Chapter,
  CollectibleType,
  Game,
  GameProgress,
  Grade,
  HintLevel,
  Mode,
  SpoilerShield,
  Step,
  Trophy,
} from '../types';

/** PSN-Punkte pro Trophäenstufe. */
export const GRADE_POINTS: Record<Grade, number> = {
  bronze: 15,
  silver: 30,
  gold: 90,
  platinum: 300,
};

export function newProgress(): GameProgress {
  return {
    onboarded: false,
    mode: 'relaxed',
    spoiler: 'balanced',
    chapterIndex: 0,
    earned: [],
    doneSteps: [],
    collected: {},
    items: [],
    revealed: {},
  };
}

/** Kapitelindex in den gültigen Bereich bringen (z. B. nach Guide-Updates). */
export function normalizeProgress(game: Game, p: GameProgress): GameProgress {
  const max = game.chapters.length - 1;
  if (p.chapterIndex >= 0 && p.chapterIndex <= max) return p;
  return { ...p, chapterIndex: Math.max(0, Math.min(max, p.chapterIndex)) };
}

export function chapterIndexOf(game: Game, chapterId: string | undefined): number {
  if (!chapterId) return -1;
  return game.chapters.findIndex((c) => c.id === chapterId);
}

export function currentChapter(game: Game, p: GameProgress): Chapter {
  return game.chapters[Math.min(p.chapterIndex, game.chapters.length - 1)];
}

export function trophyById(game: Game, id: string): Trophy | undefined {
  return game.trophies.find((t) => t.id === id);
}

/** Verpassbares und Point-of-no-Return sieht man in jedem Modus. */
export function isAlwaysShown(step: Step): boolean {
  return step.kind === 'missable' || step.kind === 'ponr';
}

export function stepVisibleInMode(step: Step, mode: Mode): boolean {
  return mode === 'hunter' || isAlwaysShown(step) || step.relaxed === true;
}

/** Ein Schritt ist erledigt, wenn abgehakt oder alle verknüpften Trophäen geholt sind. */
export function isStepDone(step: Step, p: GameProgress): boolean {
  if (p.doneSteps.includes(step.id)) return true;
  const ids = step.trophyIds ?? [];
  return ids.length > 0 && ids.every((id) => p.earned.includes(id));
}

export function stepsForChapter(game: Game, chapterId: string, mode: Mode): Step[] {
  return game.steps.filter((s) => s.chapterId === chapterId && stepVisibleInMode(s, mode));
}

export function openStepsInCurrentChapter(game: Game, p: GameProgress): Step[] {
  const chapter = currentChapter(game, p);
  return stepsForChapter(game, chapter.id, p.mode).filter((s) => !isStepDone(s, p));
}

/**
 * Der eine Schritt, den die App gross anzeigt. Verpassbares hat Vorrang,
 * sonst gilt die Reihenfolge im Kapitel (so wie es im Spiel vorkommt).
 * Point-of-no-Return-Schritte erscheinen als Warnbanner, nicht hier.
 */
export function nextStep(game: Game, p: GameProgress): Step | undefined {
  const open = openStepsInCurrentChapter(game, p).filter((s) => s.kind !== 'ponr');
  return open.find((s) => s.kind === 'missable') ?? open[0];
}

/** Offener Point-of-no-Return-Hinweis im aktuellen Kapitel. */
export function ponrStep(game: Game, p: GameProgress): Step | undefined {
  return openStepsInCurrentChapter(game, p).find((s) => s.kind === 'ponr');
}

/** Verpassbare Trophäen, die man genau jetzt holen kann und noch nicht hat. */
export function missablesAtRisk(game: Game, p: GameProgress): Trophy[] {
  return game.trophies.filter((t) => {
    if (!t.missable || p.earned.includes(t.id)) return false;
    const from = chapterIndexOf(game, t.availableFrom);
    const until = chapterIndexOf(game, t.missableUntil);
    return from <= p.chapterIndex && p.chapterIndex <= until;
  });
}

/** Verpassbare Trophäen, deren Fenster schon geschlossen ist. */
export function missedTrophies(game: Game, p: GameProgress): Trophy[] {
  return game.trophies.filter((t) => {
    if (!t.missable || p.earned.includes(t.id)) return false;
    return chapterIndexOf(game, t.missableUntil) < p.chapterIndex;
  });
}

/**
 * Spoilerfreie Vorwarnung: Wie viele verpassbare Dinge kommen in den
 * nächsten Kapiteln? Nur die Anzahl, kein Inhalt.
 */
export function upcomingMissableCount(game: Game, p: GameProgress, lookahead = 2): number {
  return game.trophies.filter((t) => {
    if (!t.missable || p.earned.includes(t.id)) return false;
    const from = chapterIndexOf(game, t.availableFrom);
    return from > p.chapterIndex && from <= p.chapterIndex + lookahead;
  }).length;
}

/**
 * Offene verpassbare Schritte im aktuellen Kapitel. Wird als Checkliste
 * gezeigt, wenn man auf „Kapitel abgeschlossen“ tippt.
 */
export function blockersBeforeLeaving(game: Game, p: GameProgress): Step[] {
  return openStepsInCurrentChapter(game, p).filter((s) => s.kind === 'missable');
}

export function collectedInChapter(p: GameProgress, chapterId: string, typeId: string): number {
  return p.collected[`${chapterId}:${typeId}`] ?? 0;
}

export function collectedTotal(game: Game, p: GameProgress, typeId: string): number {
  return game.chapters.reduce((sum, c) => sum + collectedInChapter(p, c.id, typeId), 0);
}

/** Kapitel seit dem letzten Point of No Return bis einschliesslich zum aktuellen. */
function chaptersSinceLastPonr(game: Game, p: GameProgress): Chapter[] {
  let start = 0;
  for (let i = 0; i < p.chapterIndex; i++) {
    if (game.chapters[i].pointOfNoReturn) start = i + 1;
  }
  return game.chapters.slice(start, p.chapterIndex + 1);
}

function missingIn(chapters: Chapter[], p: GameProgress, type: CollectibleType): number {
  return chapters.reduce(
    (sum, c) => sum + Math.max(0, (c.collectibles?.[type.id] ?? 0) - collectedInChapter(p, c.id, type.id)),
    0,
  );
}

/**
 * Verpassbare Sammelobjekte, die mit dem Point of No Return am Ende des
 * aktuellen Kapitels verloren gehen. Leer, wenn das Kapitel kein PONR ist.
 */
export function collectiblesAtRisk(game: Game, p: GameProgress): { type: CollectibleType; missing: number }[] {
  if (!currentChapter(game, p).pointOfNoReturn) return [];
  const span = chaptersSinceLastPonr(game, p);
  return game.collectibles
    .filter((type) => type.missable)
    .map((type) => ({ type, missing: missingIn(span, p, type) }))
    .filter((x) => x.missing > 0);
}

/** Verpassbare Sammelobjekte hinter einem bereits passierten Point of No Return. */
export function lostCollectibles(game: Game, p: GameProgress): { type: CollectibleType; missing: number }[] {
  let lastPonr = -1;
  for (let i = 0; i < p.chapterIndex; i++) {
    if (game.chapters[i].pointOfNoReturn) lastPonr = i;
  }
  const closed = game.chapters.slice(0, lastPonr + 1);
  return game.collectibles
    .filter((type) => type.missable)
    .map((type) => ({ type, missing: missingIn(closed, p, type) }))
    .filter((x) => x.missing > 0);
}

export interface Score {
  earned: number;
  total: number;
  points: number;
  maxPoints: number;
  percent: number;
  byGrade: Record<Grade, { earned: number; total: number }>;
}

export function score(game: Game, p: GameProgress): Score {
  const byGrade: Score['byGrade'] = {
    platinum: { earned: 0, total: 0 },
    gold: { earned: 0, total: 0 },
    silver: { earned: 0, total: 0 },
    bronze: { earned: 0, total: 0 },
  };
  let points = 0;
  let maxPoints = 0;
  for (const t of game.trophies) {
    const has = p.earned.includes(t.id);
    byGrade[t.grade].total += 1;
    maxPoints += GRADE_POINTS[t.grade];
    if (has) {
      byGrade[t.grade].earned += 1;
      points += GRADE_POINTS[t.grade];
    }
  }
  const earned = game.trophies.filter((t) => p.earned.includes(t.id)).length;
  return {
    earned,
    total: game.trophies.length,
    points,
    maxPoints,
    // Wie auf PSN: Prozent nach Punkten, nicht nach Anzahl.
    percent: maxPoints === 0 ? 0 : Math.floor((points / maxPoints) * 100),
    byGrade,
  };
}

export function platinumTrophy(game: Game): Trophy | undefined {
  return game.trophies.find((t) => t.grade === 'platinum');
}

/**
 * Trophäe als geholt markieren. Die Platin kommt automatisch dazu, sobald
 * alle anderen Trophäen da sind, genau wie auf der Konsole.
 */
export function toggleEarned(game: Game, p: GameProgress, trophyId: string): GameProgress {
  const plat = platinumTrophy(game);
  let earned = p.earned.includes(trophyId)
    ? p.earned.filter((id) => id !== trophyId)
    : [...p.earned, trophyId];
  if (plat) {
    const allOthers = game.trophies.filter((t) => t.id !== plat.id).every((t) => earned.includes(t.id));
    if (allOthers && !earned.includes(plat.id)) earned = [...earned, plat.id];
    if (!allOthers) earned = earned.filter((id) => id !== plat.id);
  }
  return { ...p, earned };
}

export function phaseProgress(phase: { trophyIds: string[] }, p: GameProgress): { earned: number; total: number } {
  return {
    earned: phase.trophyIds.filter((id) => p.earned.includes(id)).length,
    total: phase.trophyIds.length,
  };
}

/** Index der ersten Phase, die noch nicht fertig ist. */
export function activePhaseIndex(game: Game, p: GameProgress): number {
  const i = game.phases.findIndex((ph) => {
    const pr = phaseProgress(ph, p);
    return pr.earned < pr.total;
  });
  return i === -1 ? game.phases.length - 1 : i;
}

/* ---------- Spoiler-Schutz ---------- */

/** Wie viele Hinweisstufen ohne Antippen sichtbar sind. */
export function autoHintLevel(shield: SpoilerShield): HintLevel {
  return shield === 'strict' ? 1 : shield === 'balanced' ? 2 : 3;
}

export function visibleHintLevel(p: GameProgress, id: string): HintLevel {
  const auto = autoHintLevel(p.spoiler);
  const revealed = p.revealed[id] ?? 1;
  return (Math.max(auto, revealed) as HintLevel);
}

/** Darf der Kapitelname (statt nur „Mission 7“) gezeigt werden? */
export function showChapterTitle(chapterIdx: number, p: GameProgress): boolean {
  if (p.spoiler === 'open') return true;
  if (p.spoiler === 'strict') return chapterIdx < p.chapterIndex;
  return chapterIdx <= p.chapterIndex;
}

export function chapterName(game: Game, chapterIdx: number, p: GameProgress): string {
  const c = game.chapters[chapterIdx];
  if (c.title && showChapterTitle(chapterIdx, p)) return `${c.label} · ${c.title}`;
  return c.label;
}

/**
 * Darf Name und Beschreibung einer versteckten Trophäe gezeigt werden?
 * Geholte Trophäen sind immer sichtbar.
 */
export function isTrophyRevealed(game: Game, t: Trophy, p: GameProgress): boolean {
  if (!t.hidden || p.earned.includes(t.id) || p.spoiler === 'open') return true;
  if (p.revealed[t.id]) return true;
  if (p.spoiler === 'strict') return false;
  const from = chapterIndexOf(game, t.availableFrom);
  return from !== -1 && from < p.chapterIndex;
}

/* ---------- Einzelne Sammelobjekte ---------- */

export function itemsIn(game: Game, chapterId: string, typeId?: string) {
  return (game.collectibleItems ?? [])
    .filter((it) => it.chapterId === chapterId && (!typeId || it.typeId === typeId))
    .sort((a, b) => a.number - b.number);
}

/**
 * Sammelobjekt abhaken. Der Zähler des Kapitels folgt automatisch,
 * damit Warnungen und Fortschritt weiter stimmen.
 */
export function toggleItem(game: Game, p: GameProgress, itemId: string): GameProgress {
  const item = game.collectibleItems?.find((it) => it.id === itemId);
  if (!item) return p;
  const items = p.items.includes(itemId) ? p.items.filter((id) => id !== itemId) : [...p.items, itemId];
  const count = itemsIn(game, item.chapterId, item.typeId).filter((it) => items.includes(it.id)).length;
  return { ...p, items, collected: { ...p.collected, [`${item.chapterId}:${item.typeId}`]: count } };
}
