import { useState } from 'react';
import type { Grade, Trophy } from '../types';
import { chapterIndexOf, isTrophyRevealed, missedTrophies, score } from '../lib/navigator';
import type { TabProps } from './GameScreen';
import { Check, Cup, GRADE_LABEL, Lock } from './Icons';
import { HintLadder } from './ui';

type Filter = 'open' | 'missable' | 'earned' | 'all';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'open', label: 'Offen' },
  { id: 'missable', label: 'Verpassbar' },
  { id: 'earned', label: 'Geholt' },
  { id: 'all', label: 'Alle' },
];
const GRADES: Grade[] = ['platinum', 'gold', 'silver', 'bronze'];

export function TrophiesTab({ game, progress: p, actions }: TabProps) {
  const [filter, setFilter] = useState<Filter>('open');
  const [open, setOpen] = useState<string | null>(null);
  const s = score(game, p);
  const missed = new Set(missedTrophies(game, p).map((t) => t.id));

  const list = game.trophies.filter((t) => {
    const has = p.earned.includes(t.id);
    if (filter === 'open') return !has;
    if (filter === 'earned') return has;
    if (filter === 'missable') return t.missable;
    return true;
  });

  return (
    <div className="stack">
      <section className="score card" aria-label="Trophäen-Übersicht">
        <div className="score-grades">
          {GRADES.map((g) => (
            <div key={g} className="score-grade">
              <Cup grade={g} size={26} dim={s.byGrade[g].earned === 0} />
              <span className="num">
                {s.byGrade[g].earned}
                <small>/{s.byGrade[g].total}</small>
              </span>
              <span className="small muted">{GRADE_LABEL[g]}</span>
            </div>
          ))}
        </div>
        <p className="small muted">
          {s.points} von {s.maxPoints} Punkten · {s.percent} %
        </p>
      </section>

      <div className="filters" role="tablist" aria-label="Filter">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`filter${filter === f.id ? ' filter-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <p className="empty muted">
          {filter === 'missable' ? 'Keine verpassbaren Trophäen in diesem Spiel. Durchatmen.' : 'Hier ist nichts.'}
        </p>
      )}

      <ul className="trophy-list">
        {list.map((t) => (
          <TrophyRow
            key={t.id}
            trophy={t}
            missed={missed.has(t.id)}
            expanded={open === t.id}
            onExpand={() => setOpen(open === t.id ? null : t.id)}
            game={game}
            progress={p}
            actions={actions}
          />
        ))}
      </ul>
    </div>
  );
}

function TrophyRow({
  trophy: t,
  missed,
  expanded,
  onExpand,
  game,
  progress: p,
  actions,
}: TabProps & { trophy: Trophy; missed: boolean; expanded: boolean; onExpand: () => void }) {
  const earned = p.earned.includes(t.id);
  const revealed = isTrophyRevealed(game, t, p);
  const from = chapterIndexOf(game, t.availableFrom);
  const isPlat = t.grade === 'platinum';

  return (
    <li className={`trophy${earned ? ' trophy-earned' : ''}${missed ? ' trophy-missed' : ''}`}>
      <div className="trophy-main">
        <Cup grade={t.grade} size={30} dim={!earned} />
        <button type="button" className="trophy-text" onClick={onExpand} aria-expanded={expanded}>
          <strong>{revealed ? t.name : 'Versteckte Trophäe'}</strong>
          <span className="small muted">
            {revealed ? t.description : 'Story-Inhalt. Antippen zum Aufdecken.'}
          </span>
          <span className="chips">
            {t.missable && <span className="chip chip-warn">{missed ? 'verpasst' : 'verpassbar'}</span>}
            {from >= 0 && <span className="chip">ab {game.chapters[from].label}</span>}
            {t.rarity !== undefined && <span className="chip">{t.rarity.toLocaleString('de-DE')} %</span>}
          </span>
        </button>
        <button
          type="button"
          className={`earn${earned ? ' earn-on' : ''}`}
          onClick={() => actions.toggleTrophy(t.id)}
          disabled={isPlat}
          aria-pressed={earned}
          aria-label={
            isPlat
              ? `${t.name}: kommt automatisch mit allen anderen Trophäen`
              : `${revealed ? t.name : 'Trophäe'}: als ${earned ? 'nicht ' : ''}geholt markieren`
          }
          title={isPlat ? 'Kommt automatisch mit allen anderen' : undefined}
        >
          {earned ? <Check size={18} /> : isPlat ? <Lock size={16} /> : null}
        </button>
      </div>
      {expanded && (
        <div className="trophy-more">
          {!revealed ? (
            <button type="button" className="reveal" onClick={() => actions.reveal(t.id, 1)}>
              Trotzdem aufdecken (kann spoilern)
            </button>
          ) : (
            <>
              <HintLadder id={t.id} hints={t.hints} progress={p} onReveal={actions.reveal} />
              {missed && t.recovery && <p className="small warn-text">{t.recovery}</p>}
            </>
          )}
        </div>
      )}
    </li>
  );
}
