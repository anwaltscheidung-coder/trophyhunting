import { describe, expect, it } from 'vitest';
import { kestrelsWake } from '../data/games/kestrels-wake';
import { wolverine } from '../data/games/wolverine';
import type { Game } from '../types';
import { chapterCollectibleLinks, stepLinks, textFragmentUrl, trophyLinks, videoAtUrl } from './links';

// Spiel mit allen Link-Quellen, unabhängig von den Demo-Daten
const withGuides: Game = {
  ...wolverine,
  links: {
    trophyGuide: { source: 'Guide', url: 'https://example.org/trophies/' },
    collectibleGuide: { source: 'Guide', url: 'https://example.org/collectibles/' },
    videoQuery: "Marvel's Wolverine",
  },
};

describe('externe Links', () => {
  it('springt per Textmarke an die richtige Stelle', () => {
    expect(textFragmentUrl('https://example.org/guide/#top', "Hunter's Nose")).toBe(
      "https://example.org/guide/#:~:text=Hunter's%20Nose",
    );
    expect(textFragmentUrl('https://example.org/g', 'Spider-Man, 2')).toBe('https://example.org/g#:~:text=Spider%2DMan%2C%202');
  });

  it('baut Trophäen-Links aus den Link-Quellen des Spiels', () => {
    const t = withGuides.trophies.find((x) => x.id === 'blind')!;
    const links = trophyLinks(withGuides, t);
    expect(links.map((l) => l.source)).toEqual(['Guide', 'YouTube']);
    expect(links[0].url).toBe('https://example.org/trophies/#:~:text=Blindsided');
  });

  it('Wolverine nutzt nur noch Videos als Rückfallebene', () => {
    const t = wolverine.trophies.find((x) => x.id === 'blind')!;
    expect(trophyLinks(wolverine, t).map((l) => l.kind)).toEqual(['video']);
  });

  it('verrät keine versteckten Trophäen über Links', () => {
    const step = { id: 'x', chapterId: 'm30', kind: 'trophy' as const, title: 'x', hints: [], trophyIds: ['s30'] };
    expect(stepLinks(withGuides, step, () => false)).toEqual([]);
    expect(stepLinks(withGuides, step, () => true).length).toBe(2);
  });

  it('verlinkt die Fundorte des Kapitels bei Sammelschritten', () => {
    const step = withGuides.steps.find((s) => s.id === 'w-door2')!;
    expect(stepLinks(withGuides, step, () => true)[0].url).toBe('https://example.org/collectibles/#:~:text=Mission%204');
    expect(chapterCollectibleLinks(withGuides, withGuides.chapters[2], withGuides.collectibles)[1].url).toContain('youtube.com/results');
  });

  it('erzeugt nichts für Spiele ohne Link-Quellen', () => {
    expect(trophyLinks(kestrelsWake, kestrelsWake.trophies[1])).toEqual([]);
  });

  it('setzt Video-Zeitmarken', () => {
    expect(videoAtUrl('abc123', 192.7)).toBe('https://www.youtube.com/watch?v=abc123&t=192s');
  });
});
