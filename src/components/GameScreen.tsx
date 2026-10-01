import { useState } from 'react';
import type { GameActions } from '../App';
import type { Game, GameProgress } from '../types';
import { score } from '../lib/navigator';
import { CollectTab } from './CollectTab';
import { Back, Compass, Gear, Gem, List, Route } from './Icons';
import { NowTab } from './NowTab';
import { Onboarding } from './Onboarding';
import { RouteTab } from './RouteTab';
import { SettingsSheet } from './SettingsSheet';
import { TrophiesTab } from './TrophiesTab';
import { ProgressRing } from './ui';

export type Tab = 'now' | 'route' | 'trophies' | 'collect';

const TABS: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: 'now', label: 'Jetzt', icon: Compass },
  { id: 'route', label: 'Route', icon: Route },
  { id: 'trophies', label: 'Trophäen', icon: List },
  { id: 'collect', label: 'Sammeln', icon: Gem },
];

export interface TabProps {
  game: Game;
  progress: GameProgress;
  actions: GameActions;
}

export function GameScreen({
  game,
  progress,
  actions,
  tab,
  onTab,
  onBack,
}: TabProps & { tab: Tab; onTab: (t: Tab) => void; onBack: () => void }) {
  const [settings, setSettings] = useState(false);
  const s = score(game, progress);
  const props = { game, progress, actions };

  return (
    <div className="page game">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Zurück zur Bibliothek">
          <Back />
        </button>
        <div className="topbar-title">
          <strong>{game.title}</strong>
          <span className="small muted">
            {s.earned}/{s.total} Trophäen · {progress.mode === 'relaxed' ? 'Entspannt' : 'Platin-Jagd'}
          </span>
        </div>
        <ProgressRing percent={s.percent} size={40} stroke={4} />
        <button type="button" className="icon-btn" onClick={() => setSettings(true)} aria-label="Einstellungen">
          <Gear />
        </button>
      </header>

      {game.dataNote && <p className="data-note">{game.dataNote}</p>}

      <main className="tab-body">
        {tab === 'now' && <NowTab {...props} onTab={onTab} />}
        {tab === 'route' && <RouteTab {...props} />}
        {tab === 'trophies' && <TrophiesTab {...props} />}
        {tab === 'collect' && <CollectTab {...props} />}
      </main>

      <nav className="tabbar" aria-label="Ansichten">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`tab${tab === id ? ' tab-active' : ''}`}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => onTab(id)}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {!progress.onboarded && <Onboarding game={game} actions={actions} />}
      {settings && <SettingsSheet {...props} onClose={() => setSettings(false)} />}
    </div>
  );
}
