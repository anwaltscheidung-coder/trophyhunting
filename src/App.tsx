import { useCallback, useEffect, useRef, useState } from 'react';
import { gameById, games } from './data';
import { demoProgress } from './data/demoProgress';
import { newProgress, platinumTrophy, toggleEarned, trophyById } from './lib/navigator';
import { loadAll, saveAll } from './lib/storage';
import type { Game, GameProgress, HintLevel, Trophy } from './types';
import { Celebration } from './components/Celebration';
import { GameScreen, type Tab } from './components/GameScreen';
import { Library } from './components/Library';
import { Toast, type ToastMsg } from './components/Toast';

type Route = { view: 'library' } | { view: 'game'; gameId: string; tab: Tab };

export interface GameActions {
  update: (fn: (p: GameProgress) => GameProgress) => void;
  toggleTrophy: (id: string) => void;
  toggleStep: (id: string) => void;
  reveal: (id: string, level: HintLevel) => void;
  setChapter: (index: number, announce?: boolean) => void;
  setCollected: (chapterId: string, typeId: string, n: number) => void;
  reset: () => void;
}

function initialStore(): Record<string, GameProgress> {
  const stored = loadAll();
  return Object.keys(stored).length ? stored : demoProgress();
}

export function App() {
  const [store, setStore] = useState(initialStore);
  const [route, setRoute] = useState<Route>({ view: 'library' });
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [celebrate, setCelebrate] = useState<{ game: Game; trophy: Trophy } | null>(null);
  const toastId = useRef(0);

  useEffect(() => saveAll(store), [store]);
  useEffect(() => window.scrollTo(0, 0), [route]);

  const show = useCallback((msg: Omit<ToastMsg, 'id'>) => {
    toastId.current += 1;
    setToast({ ...msg, id: toastId.current });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);
  const progressOf = (id: string) => store[id] ?? newProgress();

  const actionsFor = (game: Game): GameActions => {
    const update = (fn: (p: GameProgress) => GameProgress) =>
      setStore((s) => ({ ...s, [game.id]: { ...fn(s[game.id] ?? newProgress()), lastPlayed: Date.now() } }));
    return {
      update,
      toggleTrophy: (id) => {
        const before = progressOf(game.id);
        const after = toggleEarned(game, before, id);
        update(() => after);
        const t = trophyById(game, id);
        if (t && after.earned.includes(id) && !before.earned.includes(id)) {
          show({ kind: 'trophy', grade: t.grade, title: 'Trophäe freigeschaltet', text: t.name });
        }
        const plat = platinumTrophy(game);
        if (plat && after.earned.includes(plat.id) && !before.earned.includes(plat.id)) {
          setCelebrate({ game, trophy: plat });
        }
      },
      toggleStep: (id) =>
        update((p) => ({
          ...p,
          doneSteps: p.doneSteps.includes(id) ? p.doneSteps.filter((x) => x !== id) : [...p.doneSteps, id],
        })),
      reveal: (id, level) => update((p) => ({ ...p, revealed: { ...p.revealed, [id]: level } })),
      setChapter: (index, announce = false) => {
        const i = Math.max(0, Math.min(game.chapters.length - 1, index));
        update((p) => ({ ...p, chapterIndex: i }));
        if (announce) show({ kind: 'info', title: 'Weiter geht’s', text: game.chapters[i].label });
      },
      setCollected: (chapterId, typeId, n) =>
        update((p) => ({ ...p, collected: { ...p.collected, [`${chapterId}:${typeId}`]: Math.max(0, n) } })),
      reset: () => {
        setStore((s) => ({ ...s, [game.id]: newProgress() }));
        show({ kind: 'info', title: 'Zurückgesetzt', text: game.title });
      },
    };
  };

  const game = route.view === 'game' ? gameById(route.gameId) : undefined;

  return (
    <>
      {route.view === 'game' && game ? (
        <GameScreen
          game={game}
          progress={progressOf(game.id)}
          actions={actionsFor(game)}
          tab={route.tab}
          onTab={(tab) => setRoute({ view: 'game', gameId: game.id, tab })}
          onBack={() => setRoute({ view: 'library' })}
        />
      ) : (
        <Library
          games={games}
          progressOf={progressOf}
          onOpen={(gameId) => setRoute({ view: 'game', gameId, tab: 'now' })}
        />
      )}
      {toast && <Toast key={toast.id} msg={toast} onDone={hideToast} />}
      {celebrate && (
        <Celebration game={celebrate.game} trophy={celebrate.trophy} onClose={() => setCelebrate(null)} />
      )}
    </>
  );
}
