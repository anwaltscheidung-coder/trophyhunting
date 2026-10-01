import type { Chapter, CollectibleType, ExternalLink, Game, Step, Trophy } from '../types';

/**
 * Link, der direkt zu einer Textstelle springt und sie markiert
 * (Text Fragments, unterstützt von Chrome, Edge, Safari und Firefox).
 * Ohne Treffer öffnet sich die Seite einfach oben.
 */
export function textFragmentUrl(url: string, text: string): string {
  // Bindestrich, Komma und & haben in Text Fragments eine Bedeutung.
  const enc = encodeURIComponent(text).replace(/-/g, '%2D').replace(/,/g, '%2C');
  return `${url.split('#')[0]}#:~:text=${enc}`;
}

export function videoSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/** Video ab einer bestimmten Sekunde, für handverlesene Links. */
export function videoAtUrl(videoId: string, seconds: number): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&t=${Math.max(0, Math.floor(seconds))}s`;
}

export function trophyLinks(game: Game, t: Trophy): ExternalLink[] {
  const out: ExternalLink[] = [];
  const guide = game.links?.trophyGuide;
  if (guide) {
    out.push({ kind: 'guide', source: guide.source, label: `„${t.name}“ im Trophy-Guide`, url: textFragmentUrl(guide.url, t.name) });
  }
  if (game.links?.videoQuery) {
    out.push({ kind: 'video', source: 'YouTube', label: 'Video-Anleitungen suchen', url: videoSearchUrl(`${game.links.videoQuery} ${t.name} trophy`) });
  }
  return out;
}

export function chapterCollectibleLinks(game: Game, chapter: Chapter, types: CollectibleType[] = []): ExternalLink[] {
  const out: ExternalLink[] = [];
  const guide = game.links?.collectibleGuide;
  if (guide) {
    out.push({ kind: 'guide', source: guide.source, label: `Fundorte ${chapter.label} im Guide`, url: textFragmentUrl(guide.url, chapter.label) });
  }
  if (game.links?.videoQuery) {
    const what = types.length ? types.map((t) => t.plural).join(' ') : 'collectibles';
    out.push({ kind: 'video', source: 'YouTube', label: `Videos zu ${chapter.label} suchen`, url: videoSearchUrl(`${game.links.videoQuery} ${chapter.label} ${what} locations`) });
  }
  return out;
}

/**
 * Links zu einem Navi-Schritt: zuerst handverlesene, dann die der
 * verknüpften Trophäen, bei Sammelschritten die Fundorte des Kapitels.
 * Versteckte, noch nicht aufgedeckte Trophäen werden ausgelassen.
 */
export function stepLinks(game: Game, step: Step, isRevealed: (t: Trophy) => boolean): ExternalLink[] {
  const out: ExternalLink[] = [...(step.links ?? [])];
  for (const id of step.trophyIds ?? []) {
    const t = game.trophies.find((x) => x.id === id);
    if (t && isRevealed(t)) out.push(...trophyLinks(game, t));
  }
  if (step.kind === 'collectible') {
    const chapter = game.chapters.find((c) => c.id === step.chapterId);
    if (chapter) out.push(...chapterCollectibleLinks(game, chapter));
  }
  const seen = new Set<string>();
  return out.filter((l) => !seen.has(l.url) && seen.add(l.url));
}
