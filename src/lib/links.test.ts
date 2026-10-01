import { describe, expect, it } from 'vitest';
import { kestrelsWake } from '../data/games/kestrels-wake';
import { wolverine } from '../data/games/wolverine';
import { chapterCollectibleLinks, stepLinks, textFragmentUrl, trophyLinks, videoAtUrl } from './links';

describe('externe Links', () => {
  it('springt per Textmarke an die richtige Stelle', () => {
    expect(textFragmentUrl('https://example.org/guide/#top', "Hunter's Nose")).toBe(
      "https://example.org/guide/#:~:text=Hunter's%20Nose",
    );
    // Bindestrich und Komma sind in Text Fragments Steuerzeichen
    expect(textFragmentUrl('https://example.org/g', 'Spider-Man, 2')).toBe('https://example.org/g#:~:text=Spider%2DMan%2C%202');
  });

  it('baut Trophäen-Links aus den Link-Quellen des Spiels', () => {
    const t = wolverine.trophies.find((x) => x.id === 'blind')!;
    const links = trophyLinks(wolverine, t);
    expect(links.map((l) => l.source)).toEqual(['PowerPyx', 'YouTube']);
    expect(links[0].url).toContain('powerpyx.com/marvels-wolverine-trophy-guide-roadmap/#:~:text=Blindsided');
  });

  it('verrät keine versteckten Trophäen über Links', () => {
    const step = { id: 'x', chapterId: 'm30', kind: 'trophy' as const, title: 'x', hints: [], trophyIds: ['s30'] };
    expect(stepLinks(wolverine, step, () => false)).toEqual([]);
    expect(stepLinks(wolverine, step, () => true).length).toBe(2);
  });

  it('verlinkt die Fundorte des Kapitels bei Sammelschritten', () => {
    const step = wolverine.steps.find((s) => s.id === 'w-door2')!;
    const urls = stepLinks(wolverine, step, () => true).map((l) => l.url);
    expect(urls[0]).toContain('collectible-locations-guide/#:~:text=Mission%204');
    expect(chapterCollectibleLinks(wolverine, wolverine.chapters[2], wolverine.collectibles)[1].url).toContain('youtube.com/results');
  });

  it('erzeugt nichts für Spiele ohne Link-Quellen', () => {
    expect(trophyLinks(kestrelsWake, kestrelsWake.trophies[1])).toEqual([]);
  });

  it('setzt Video-Zeitmarken', () => {
    expect(videoAtUrl('abc123', 192.7)).toBe('https://www.youtube.com/watch?v=abc123&t=192s');
  });
});
