import { activePhaseIndex, phaseProgress } from '../lib/navigator';
import type { SourceRef } from '../types';
import type { TabProps } from './GameScreen';
import { Flag } from './Icons';
import { Bar, nounPlural } from './ui';

const USAGE: Record<SourceRef['usage'], string> = {
  own: 'eigene Inhalte',
  licensed: 'lizenziert',
  link: 'nur verlinkt',
};

export function RouteTab({ game, progress: p }: TabProps) {
  const active = activePhaseIndex(game, p);
  const m = game.meta;
  const facts: [string, string][] = [
    ['Schwierigkeit', `${m.difficulty}/10`],
    ['Bis Platin', `${m.hours} Std.`],
    ['Durchgänge', String(m.playthroughs)],
    ['Verpassbar', String(m.missableCount)],
    ['Online', m.onlineTrophies ? 'ja' : 'nein'],
    ['Schwierigkeitsgrad', m.difficultyTrophies ? 'zählt' : 'egal'],
  ];

  return (
    <div className="stack">
      <section aria-labelledby="facts-h">
        <h2 id="facts-h" className="section-h">Steckbrief</h2>
        <dl className="facts">
          {facts.map(([k, v]) => (
            <div key={k} className={k === 'Verpassbar' && m.missableCount > 0 ? 'fact-warn' : undefined}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="small muted">{m.chapterSelect}</p>
      </section>

      <section aria-labelledby="route-h">
        <h2 id="route-h" className="section-h">Deine Route zur Platin</h2>
        <ol className="route">
          {game.phases.map((ph, i) => {
            const pr = phaseProgress(ph, p);
            const state = pr.earned === pr.total ? 'done' : i === active ? 'active' : 'todo';
            return (
              <li key={ph.id} className={`station station-${state}`}>
                <span className="station-dot" aria-hidden="true">{i + 1}</span>
                <div className="station-body">
                  <div className="station-head">
                    <strong>{ph.title}</strong>
                    {ph.hours && <span className="small muted">{ph.hours}</span>}
                  </div>
                  {state === 'active' && <span className="here">Du bist hier</span>}
                  <p className="muted">{ph.summary}</p>
                  <Bar value={pr.earned} max={pr.total} tone={state === 'done' ? 'ok' : 'accent'} />
                  <span className="small muted">
                    {pr.earned}/{pr.total} Trophäen
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="map-h">
        <h2 id="map-h" className="section-h">Alle {nounPlural(game)}</h2>
        <div className="timeline" role="list">
          {game.chapters.map((c, i) => {
            const missables = game.trophies.filter((t) => t.missable && t.availableFrom === c.id).length;
            const state = i < p.chapterIndex ? 'past' : i === p.chapterIndex ? 'current' : 'future';
            return (
              <span
                key={c.id}
                role="listitem"
                className={`tl tl-${state}${missables ? ' tl-missable' : ''}`}
                aria-label={`${c.label}${c.pointOfNoReturn ? ', Point of No Return' : ''}${missables ? `, ${missables} verpassbar` : ''}`}
              >
                {c.number}
                {c.pointOfNoReturn && <Flag size={11} className="tl-flag" />}
              </span>
            );
          })}
        </div>
        <p className="legend small muted">
          <span><span className="pick-dot static" aria-hidden="true" /> Verpassbares beginnt hier</span>
          <span><Flag size={12} className="pick-flag static" /> Kein Zurück danach</span>
        </p>
      </section>

      <section aria-labelledby="src-h">
        <h2 id="src-h" className="section-h">Quellen</h2>
        <ul className="sources">
          {game.sources.map((s) => (
            <li key={s.name}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              ) : (
                <span>{s.name}</span>
              )}
              <span className="chip">{USAGE[s.usage]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
