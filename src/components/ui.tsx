import { useEffect, useRef, type ReactNode } from 'react';
import type { ExternalLink, Game, GameProgress, Hint, HintLevel, Step, Trophy } from '../types';
import { isTrophyRevealed, visibleHintLevel } from '../lib/navigator';
import { Book, ChevronRight, Cup, External, Eye, Minus, Plus, Play } from './Icons';

export function ProgressRing({ percent, size = 56, stroke = 5, label }: { percent: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const done = percent >= 100;
  return (
    <div className={`ring${done ? ' ring-done' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-fill"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(percent, 100) / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring-label" aria-label={label ?? `${percent} Prozent`}>
        {percent}
        <small>%</small>
      </span>
    </div>
  );
}

export function Bar({ value, max, tone = 'accent' }: { value: number; max: number; tone?: 'accent' | 'warn' | 'ok' }) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className={`bar-fill bar-${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const HINT_LABEL: Record<HintLevel, string> = { 1: 'Stupser', 2: 'Konkret', 3: 'Lösung' };
const NEXT_LABEL: Record<HintLevel, string> = {
  1: '',
  2: 'Wo genau?',
  3: 'Lösung zeigen (Spoiler)',
};

/**
 * Hinweise in Stufen. Sichtbar ist, was der Spoiler-Schutz erlaubt;
 * jede weitere Stufe muss man bewusst antippen.
 */
export function HintLadder({
  id,
  hints,
  progress,
  onReveal,
}: {
  id: string;
  hints: Hint[];
  progress: GameProgress;
  onReveal: (id: string, level: HintLevel) => void;
}) {
  const level = visibleHintLevel(progress, id);
  const shown = hints.filter((h) => h.level <= level);
  const next = hints.find((h) => h.level > level);
  return (
    <div className="hints">
      {shown.map((h) => (
        <p key={h.level} className={`hint hint-${h.level}`}>
          {hints.length > 1 && <span className="hint-tag">{HINT_LABEL[h.level]}</span>}
          {h.text}
        </p>
      ))}
      {next && (
        <button type="button" className="reveal" onClick={() => onReveal(id, next.level)}>
          <Eye size={16} />
          {NEXT_LABEL[next.level]}
        </button>
      )}
    </div>
  );
}

/** Kleines Trophäen-Kärtchen, respektiert den Spoiler-Schutz. */
export function TrophyChip({ game, trophy, progress }: { game: Game; trophy: Trophy; progress: GameProgress }) {
  const revealed = isTrophyRevealed(game, trophy, progress);
  const earned = progress.earned.includes(trophy.id);
  return (
    <span className={`tchip${earned ? ' tchip-earned' : ''}`}>
      <Cup grade={trophy.grade} size={16} />
      <span>{revealed ? trophy.name : 'Versteckte Trophäe'}</span>
    </span>
  );
}

export const KIND_LABEL: Record<Step['kind'], string> = {
  missable: 'Verpassbar',
  ponr: 'Kein Zurück',
  trophy: 'Trophäe',
  collectible: 'Sammeln',
  tip: 'Tipp',
};

export function KindChip({ kind }: { kind: Step['kind'] }) {
  return <span className={`kind kind-${kind}`}>{KIND_LABEL[kind]}</span>;
}

/** Bottom-Sheet ohne Bibliothek: Escape und Klick auf den Hintergrund schliessen. */
export function Sheet({ title, onClose, children, dismissable = true }: { title: string; onClose: () => void; children: ReactNode; dismissable?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    if (!dismissable) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, dismissable]);
  return (
    <div className="sheet-backdrop" onClick={dismissable ? onClose : undefined}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-grip" aria-hidden="true" />
        <h2 className="sheet-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function Cover({ game, size = 'md' }: { game: Game; size?: 'sm' | 'md' | 'lg' }) {
  const [a, b] = game.cover;
  const initials = game.title
    .replace(/[^A-Za-zÄÖÜäöü ]/g, '')
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(-2)
    .map((w) => w[0])
    .join('');
  return (
    <div className={`cover cover-${size}`} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-hidden="true">
      <span>{initials}</span>
    </div>
  );
}

export function nounPlural(game: Game): string {
  return game.chapterNoun === 'Mission' ? 'Missionen' : game.chapterNoun;
}

/** „in den nächsten zwei Kapiteln“ braucht den Dativ. */
export function nounDativePlural(game: Game): string {
  return game.chapterNoun === 'Mission' ? 'Missionen' : `${game.chapterNoun}n`;
}

/** Zähler mit Plus/Minus, gross genug für den Daumen. */
export function Counter({
  value,
  max,
  label,
  onChange,
}: {
  value: number;
  max: number;
  label: string;
  onChange: (n: number) => void;
}) {
  const full = value >= max;
  return (
    <div className={`counter${full ? ' counter-full' : ''}`}>
      <button type="button" className="icon-btn" onClick={() => onChange(value - 1)} disabled={value <= 0} aria-label={`${label}: eins weniger`}>
        <Minus size={18} />
      </button>
      <span className="counter-value" aria-live="polite">
        {value}
        <small>/{max}</small>
      </span>
      <button type="button" className="icon-btn" onClick={() => onChange(value + 1)} disabled={full} aria-label={`${label}: eins mehr`}>
        <Plus size={18} />
      </button>
    </div>
  );
}

/**
 * „Mehr Hilfe“: Links an die passende Stelle externer Guides und Videos.
 * Eingeklappt, weil fremde Seiten keinen Spoiler-Schutz haben.
 */
export function ExternalHelp({ links }: { links: ExternalLink[] }) {
  if (links.length === 0) return null;
  return (
    <details className="ext">
      <summary>
        <External size={16} /> {links.every((l) => l.kind === 'video') ? 'Video-Anleitungen' : 'Mehr Hilfe: Guide & Videos'}
      </summary>
      <ul className="ext-list">
        {links.map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noreferrer">
              {l.kind === 'video' ? <Play size={18} /> : <Book size={18} />}
              <span className="ext-label">{l.label}</span>
              <span className="chip">{l.source}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="small muted">Externe Seiten haben keinen Spoiler-Schutz.</p>
    </details>
  );
}

export function GuideButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="guide-btn" onClick={onClick}>
      <Book size={18} />
      <span>
        <strong>Anleitung mit Bildern</strong>
        <small>Schritt für Schritt, mit Screenshots</small>
      </span>
      <ChevronRight size={18} />
    </button>
  );
}
