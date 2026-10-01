import { useState } from 'react';
import type { Game, GameProgress, GuideSection, Trophy } from '../types';
import { chapterIndexOf } from '../lib/navigator';
import { Figure } from './Figure';
import { Alert, Bulb, Check, Cup, Eye, GRADE_LABEL } from './Icons';

function Section({ section, index, revealSpoilers }: { section: GuideSection; index?: number; revealSpoilers: boolean }) {
  const [shown, setShown] = useState(false);
  const hidden = section.spoiler === true && !revealSpoilers && !shown;
  const body = hidden ? (
    <button type="button" className="spoiler-box" onClick={() => setShown(true)}>
      <Eye size={18} /> Dieser Abschnitt verrät Story-Inhalte. Antippen zum Anzeigen.
    </button>
  ) : (
    <>
      <p>{section.text}</p>
      {section.images?.map((img) => (
        <Figure key={img.src + img.alt} image={img} revealSpoilers={revealSpoilers || shown} />
      ))}
    </>
  );

  if (section.kind === 'step') {
    return (
      <li className="g-step">
        <span className="g-num" aria-hidden="true">{index}</span>
        <div className="g-body">
          {section.title && <h4>{section.title}</h4>}
          {body}
        </div>
      </li>
    );
  }
  return (
    <li className={`g-callout g-${section.kind}`}>
      <div className="g-callout-head">
        {section.kind === 'warning' ? <Alert size={18} /> : <Bulb size={18} />}
        <strong>{section.title ?? (section.kind === 'warning' ? 'Achtung' : 'Tipp')}</strong>
      </div>
      {body}
    </li>
  );
}

/** Ausführliche Anleitung zu einer Trophäe, als Vollbild-Ansicht. */
export function GuideSheet({
  game,
  trophy: t,
  progress: p,
  onEarn,
  onClose,
}: {
  game: Game;
  trophy: Trophy;
  progress: GameProgress;
  onEarn: () => void;
  onClose: () => void;
}) {
  const g = t.guide!;
  const earned = p.earned.includes(t.id);
  const revealSpoilers = p.spoiler === 'open';
  const from = chapterIndexOf(game, t.availableFrom);
  const until = chapterIndexOf(game, t.missableUntil);
  let stepNo = 0;

  return (
    <div className="guide" role="dialog" aria-modal="true" aria-labelledby="guide-h">
      <header className="guide-top">
        <button type="button" className="btn" onClick={onClose}>
          Zurück
        </button>
        <span className="small muted">Anleitung</span>
      </header>

      <div className="guide-body">
        <div className="guide-head">
          <Cup grade={t.grade} size={44} dim={!earned} />
          <div>
            <h2 id="guide-h">{t.name}</h2>
            <p className="muted">{t.description}</p>
          </div>
        </div>

        <div className="chips">
          <span className="chip">{GRADE_LABEL[t.grade]}</span>
          {g.time && <span className="chip">{g.time}</span>}
          {g.difficulty && (
            <span className="chip" aria-label={`Schwierigkeit ${g.difficulty} von 5`}>
              Schwierigkeit {'●'.repeat(g.difficulty)}
              {'○'.repeat(5 - g.difficulty)}
            </span>
          )}
          {from >= 0 && <span className="chip">ab {game.chapters[from].label}</span>}
          {t.missable && until >= 0 && <span className="chip chip-warn">verpassbar bis {game.chapters[until].label}</span>}
          {t.rarity !== undefined && <span className="chip">{t.rarity.toLocaleString('de-DE')} % haben sie</span>}
        </div>

        {g.placeholder && (
          <p className="placeholder-note">
            Platzhalter: Nach dem Import stehen hier Text und Screenshots aus dem {g.source.name}-Guide.
          </p>
        )}

        <p className="guide-summary">{g.summary}</p>

        {g.prerequisites && g.prerequisites.length > 0 && (
          <section>
            <p className="label">Das brauchst du</p>
            <ul className="prereq">
              {g.prerequisites.map((x) => (
                <li key={x}>
                  <Check size={16} /> {x}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <p className="label">Schritt für Schritt</p>
          <ol className="g-list">
            {g.sections.map((s, i) => (
              <Section
                key={i}
                section={s}
                index={s.kind === 'step' ? ++stepNo : undefined}
                revealSpoilers={revealSpoilers}
              />
            ))}
          </ol>
        </section>

        <p className="guide-source small muted">
          Inhalt: {g.source.name}
          {g.source.usage === 'licensed' && ' · mit Erlaubnis verwendet'}
        </p>

        <div className="actions">
          {!earned && t.grade !== 'platinum' && (
            <button type="button" className="btn btn-primary" onClick={onEarn}>
              <Check size={18} /> Trophäe geholt
            </button>
          )}
          <button type="button" className="btn" onClick={onClose}>
            Schliessen
          </button>
        </div>
      </div>
    </div>
  );
}
