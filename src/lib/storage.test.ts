import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadAll } from './storage';

function stubStorage(raw: string | null) {
  vi.stubGlobal('localStorage', {
    getItem: () => raw,
    setItem: () => undefined,
    removeItem: () => undefined,
  });
}

describe('gespeicherte Spielstände', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('übersteht kaputte Daten, ohne abzustürzen', () => {
    stubStorage(JSON.stringify({ a: { earned: 5, chapterIndex: -3, mode: 'x', spoiler: 7 }, b: 'kaputt' }));
    const s = loadAll();
    expect(s.a.earned).toEqual([]);
    expect(s.a.chapterIndex).toBe(0);
    expect(s.a.mode).toBe('relaxed');
    expect(s.a.spoiler).toBe('balanced');
    expect(s.b).toBeUndefined();
  });

  it('liefert leer zurück bei ungültigem JSON oder fehlendem Speicher', () => {
    stubStorage('{nicht json');
    expect(loadAll()).toEqual({});
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('SecurityError');
      },
    });
    expect(loadAll()).toEqual({});
  });
});
