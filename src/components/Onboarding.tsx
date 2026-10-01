import { useState } from 'react';
import type { GameActions } from '../App';
import type { Game, Mode, SpoilerShield } from '../types';
import { Sheet, nounPlural } from './ui';

export const MODES: { id: Mode; title: string; text: string }[] = [
  {
    id: 'relaxed',
    title: 'Entspannt',
    text: 'Ich will die Story geniessen. Sag mir nur, wenn ich sonst etwas für immer verpasse.',
  },
  {
    id: 'hunter',
    title: 'Platin-Jagd',
    text: 'Zeig mir alles: Trophäen, Sammelobjekte und die schnellste Route zur Platin.',
  },
];

export const SHIELDS: { id: SpoilerShield; title: string; text: string }[] = [
  { id: 'strict', title: 'Streng', text: 'Nur ein Stupser. Alles Weitere tippe ich selbst an.' },
  { id: 'balanced', title: 'Ausgewogen', text: 'Wo und wann ist okay. Story-Details nur auf Wunsch.' },
  { id: 'open', title: 'Offen', text: 'Alles anzeigen, auch versteckte Trophäen.' },
];

export function ModePicker({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="choice-grid" role="radiogroup" aria-label="Spielweise">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={value === m.id}
          className={`choice${value === m.id ? ' choice-on' : ''}`}
          onClick={() => onChange(m.id)}
        >
          <strong>{m.title}</strong>
          <span className="small muted">{m.text}</span>
        </button>
      ))}
    </div>
  );
}

export function ShieldPicker({ value, onChange }: { value: SpoilerShield; onChange: (s: SpoilerShield) => void }) {
  return (
    <div className="seg-list" role="radiogroup" aria-label="Spoiler-Schutz">
      {SHIELDS.map((s) => (
        <button
          key={s.id}
          type="button"
          role="radio"
          aria-checked={value === s.id}
          className={`seg${value === s.id ? ' seg-on' : ''}`}
          onClick={() => onChange(s.id)}
        >
          <strong>{s.title}</strong>
          <span className="small muted">{s.text}</span>
        </button>
      ))}
    </div>
  );
}

/** Erster Start eines Spiels: drei Fragen, dann geht es los. */
export function Onboarding({ game, actions }: { game: Game; actions: GameActions }) {
  const [mode, setMode] = useState<Mode>('relaxed');
  const [spoiler, setSpoiler] = useState<SpoilerShield>('balanced');
  const [chapterIndex, setChapterIndex] = useState(0);

  return (
    <Sheet title={`${game.title} einrichten`} onClose={() => undefined} dismissable={false}>
      <div className="stack">
        <div>
          <p className="label">Wie willst du spielen?</p>
          <ModePicker value={mode} onChange={setMode} />
        </div>
        <div>
          <p className="label">Spoiler-Schutz</p>
          <ShieldPicker value={spoiler} onChange={setSpoiler} />
        </div>
        <div>
          <label className="label" htmlFor="ob-chapter">
            Wo stehst du gerade?
          </label>
          <select
            id="ob-chapter"
            className="select"
            value={chapterIndex}
            onChange={(e) => setChapterIndex(Number(e.target.value))}
          >
            {game.chapters.map((c, i) => (
              <option key={c.id} value={i}>
                {i === 0 ? `${c.label} (gerade angefangen)` : c.label}
              </option>
            ))}
          </select>
          <p className="small muted">Namen späterer {nounPlural(game)} zeigen wir nicht.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => actions.update((p) => ({ ...p, onboarded: true, mode, spoiler, chapterIndex }))}
        >
          Los geht’s
        </button>
      </div>
    </Sheet>
  );
}
