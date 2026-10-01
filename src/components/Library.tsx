import type { Game, GameProgress } from '../types';
import {
  chapterName,
  currentChapter,
  missablesAtRisk,
  nextStep,
  ponrStep,
  score,
} from '../lib/navigator';
import { Alert, ChevronRight, Coffee, Flag, Link, Route } from './Icons';
import { Bar, Cover, ProgressRing } from './ui';

function Status({ game, p }: { game: Game; p: GameProgress }) {
  if (ponrStep(game, p)) {
    return (
      <span className="status status-warn">
        <Flag size={14} /> Kein Zurück nach {currentChapter(game, p).label}
      </span>
    );
  }
  const risk = missablesAtRisk(game, p).length;
  if (risk > 0) {
    return (
      <span className="status status-warn">
        <Alert size={14} /> {risk} verpassbar{risk === 1 ? 'e Trophäe' : 'e Trophäen'} gerade offen
      </span>
    );
  }
  return (
    <span className="status status-ok">
      <Coffee size={14} /> {game.meta.missableCount === 0 ? 'Nichts verpassbar im ganzen Spiel' : 'Gerade nichts verpassbar'}
    </span>
  );
}

export function Library({
  games,
  progressOf,
  onOpen,
}: {
  games: Game[];
  progressOf: (id: string) => GameProgress;
  onOpen: (id: string) => void;
}) {
  const sorted = [...games].sort((a, b) => (progressOf(b.id).lastPlayed ?? 0) - (progressOf(a.id).lastPlayed ?? 0));
  const hero = sorted[0];
  const hp = progressOf(hero.id);
  const hs = score(hero, hp);
  const step = hp.onboarded ? nextStep(hero, hp) : undefined;

  return (
    <div className="page library">
      <header className="brand">
        <div className="brand-mark" aria-hidden="true">
          <Route size={22} />
        </div>
        <div>
          <h1>Platinpfad</h1>
          <p className="muted">Dein Navi zur Platin. Ohne Spoiler.</p>
        </div>
      </header>

      <section aria-labelledby="continue-h">
        <h2 id="continue-h" className="section-h">Weiterspielen</h2>
        <button type="button" className="hero-card" onClick={() => onOpen(hero.id)}>
          <div className="hero-top">
            <Cover game={hero} size="lg" />
            <div className="hero-meta">
              <strong className="hero-title">{hero.title}</strong>
              <span className="muted">
                {hp.onboarded
                  ? `${chapterName(hero, hp.chapterIndex, hp)} von ${hero.chapters.length}`
                  : 'Noch nicht gestartet'}
              </span>
              <Status game={hero} p={hp} />
            </div>
            <ProgressRing percent={hs.percent} size={60} />
          </div>
          <div className="hero-next">
            <span className="hero-next-text">
              <span className="eyebrow">Als Nächstes</span>
              <strong>
                {step ? step.title : hp.onboarded ? `Spiel ${currentChapter(hero, hp).label} einfach weiter.` : 'Einrichten in 30 Sekunden'}
              </strong>
            </span>
            <ChevronRight size={20} />
          </div>
        </button>
      </section>

      <section aria-labelledby="games-h">
        <h2 id="games-h" className="section-h">Deine Spiele</h2>
        <ul className="game-list">
          {sorted.map((g) => {
            const p = progressOf(g.id);
            const s = score(g, p);
            return (
              <li key={g.id}>
                <button type="button" className="game-row" onClick={() => onOpen(g.id)}>
                  <Cover game={g} size="sm" />
                  <div className="game-row-main">
                    <strong>{g.title}</strong>
                    <span className="chips">
                      <span className="chip">{g.platforms.join(' · ')}</span>
                      <span className="chip">Schwierigkeit {g.meta.difficulty}/10</span>
                      <span className="chip">{g.meta.hours} Std.</span>
                      <span className={`chip ${g.meta.missableCount ? 'chip-warn' : 'chip-ok'}`}>
                        {g.meta.missableCount ? `${g.meta.missableCount} verpassbar` : 'nichts verpassbar'}
                      </span>
                    </span>
                    <Bar value={s.points} max={s.maxPoints} />
                    <span className="small muted">
                      {s.earned}/{s.total} Trophäen · {s.percent} %
                    </span>
                  </div>
                  <ChevronRight size={20} className="muted" />
                </button>
              </li>
            );
          })}
          <li>
            <div className="game-row game-row-soon">
              <div className="cover cover-sm cover-empty" aria-hidden="true">
                <Link size={20} />
              </div>
              <div className="game-row-main">
                <strong>PSN-Konto verbinden</strong>
                <span className="small muted">
                  Bald: Spiele und geholte Trophäen automatisch übernehmen, statt sie abzuhaken.
                </span>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <p className="footnote">
        Prototyp mit Beispiel-Spielständen. Die Inhalte sind Demo-Daten und nicht verifiziert.
      </p>
    </div>
  );
}
