import { useState } from 'react';
import type { Step } from '../types';
import {
  blockersBeforeLeaving,
  chapterName,
  collectedInChapter,
  collectiblesAtRisk,
  currentChapter,
  isStepDone,
  itemsIn,
  isTrophyRevealed,
  lostCollectibles,
  missedTrophies,
  nextStep,
  openStepsInCurrentChapter,
  ponrStep,
  stepsForChapter,
  trophyById,
  upcomingMissableCount,
} from '../lib/navigator';
import type { Tab, TabProps } from './GameScreen';
import { Alert, Check, ChevronLeft, ChevronRight, Coffee, Flag } from './Icons';
import { chapterCollectibleLinks, stepLinks } from '../lib/links';
import { GuideSheet } from './GuideSheet';
import { ItemList } from './ItemList';
import { Counter, ExternalHelp, GuideButton, HintLadder, KindChip, Sheet, TrophyChip, nounDativePlural, nounPlural } from './ui';

function StepTrophies({ step, game, progress }: { step: Step } & Pick<TabProps, 'game' | 'progress'>) {
  const ts = (step.trophyIds ?? []).map((id) => trophyById(game, id)).filter((t) => t !== undefined);
  if (!ts.length) return null;
  return (
    <div className="chips">
      {ts.map((t) => (
        <TrophyChip key={t.id} game={game} trophy={t} progress={progress} />
      ))}
    </div>
  );
}

/**
 * Hilfe zu einem Schritt: die Anleitung mit Bildern, wenn es eine gibt,
 * sonst Video-Links als Rückfallebene.
 */
function StepHelp({
  step,
  game,
  progress,
  onGuide,
}: { step: Step; onGuide: (trophyId: string) => void } & Pick<TabProps, 'game' | 'progress'>) {
  const withGuide = (step.trophyIds ?? [])
    .map((id) => trophyById(game, id))
    .find((t) => t?.guide && isTrophyRevealed(game, t, progress));
  if (withGuide) return <GuideButton onClick={() => onGuide(withGuide.id)} />;
  return <ExternalHelp links={stepLinks(game, step, (t) => isTrophyRevealed(game, t, progress))} />;
}

function StepActions({ step, game, progress, actions }: { step: Step } & TabProps) {
  const single = step.trophyIds?.length === 1 ? trophyById(game, step.trophyIds[0]) : undefined;
  return (
    <div className="actions">
      <button type="button" className="btn btn-primary" onClick={() => actions.toggleStep(step.id)}>
        <Check size={18} /> Erledigt
      </button>
      {single && !progress.earned.includes(single.id) && (
        <button type="button" className="btn" onClick={() => actions.toggleTrophy(single.id)}>
          Trophäe geholt
        </button>
      )}
    </div>
  );
}

export function NowTab({ game, progress: p, actions, onTab }: TabProps & { onTab: (t: Tab) => void }) {
  const [chapterSheet, setChapterSheet] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [guideFor, setGuideFor] = useState<string | null>(null);

  const chapter = currentChapter(game, p);
  const step = nextStep(game, p);
  const ponr = ponrStep(game, p);
  const others = openStepsInCurrentChapter(game, p).filter((s) => s.id !== step?.id && s.kind !== 'ponr');
  const done = stepsForChapter(game, chapter.id, p.mode).filter((s) => isStepDone(s, p));
  const missed = missedTrophies(game, p);
  const lost = lostCollectibles(game, p);
  const blockers = blockersBeforeLeaving(game, p);
  const atRisk = collectiblesAtRisk(game, p);
  const upcoming = upcomingMissableCount(game, p);
  const isLast = p.chapterIndex === game.chapters.length - 1;
  const plural = nounDativePlural(game);
  const props = { game, progress: p, actions };

  const collectibleTypes = game.collectibles.filter((t) => (chapter.collectibles?.[t.id] ?? 0) > 0);
  const collectiblesMatter = p.mode === 'hunter' || collectibleTypes.some((t) => t.missable);

  const advance = () => {
    setConfirmLeave(false);
    actions.setChapter(p.chapterIndex + 1, true);
  };

  const counters = (
    <div className="counter-list">
      {collectibleTypes.every((type) => itemsIn(game, chapter.id, type.id).length === 0) && (
        <ExternalHelp links={chapterCollectibleLinks(game, chapter, collectibleTypes)} />
      )}
      {collectibleTypes.map((type) => {
        const max = chapter.collectibles?.[type.id] ?? 0;
        const value = collectedInChapter(p, chapter.id, type.id);
        if (itemsIn(game, chapter.id, type.id).length > 0) {
          return (
            <div key={type.id} className="item-group">
              <div className="counter-row">
                <span>
                  {type.plural}
                  {type.missable && <span className="chip chip-warn">verpassbar</span>}
                </span>
                <span className="num">
                  {value}
                  <small>/{max}</small>
                </span>
              </div>
              <ItemList game={game} progress={p} actions={actions} chapterId={chapter.id} type={type} />
            </div>
          );
        }
        return (
          <div key={type.id} className="counter-row">
            <span>
              {type.plural}
              {type.missable && <span className="chip chip-warn">verpassbar</span>}
            </span>
            <Counter value={value} max={max} label={type.plural} onChange={(n) => actions.setCollected(chapter.id, type.id, Math.min(n, max))} />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="stack">
      <section className="where" aria-label="Wo du gerade bist">
        <button
          type="button"
          className="icon-btn"
          onClick={() => actions.setChapter(p.chapterIndex - 1)}
          disabled={p.chapterIndex === 0}
          aria-label={`${game.chapterNoun} zurück`}
        >
          <ChevronLeft />
        </button>
        <button type="button" className="where-main" onClick={() => setChapterSheet(true)}>
          <span className="eyebrow">Du bist in · {chapter.act}</span>
          <strong>{chapterName(game, p.chapterIndex, p)}</strong>
          <span className="small muted">
            {chapter.number} von {game.chapters.length} · ändern
          </span>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => actions.setChapter(p.chapterIndex + 1)}
          disabled={isLast}
          aria-label={`${game.chapterNoun} vor`}
        >
          <ChevronRight />
        </button>
      </section>

      {ponr && (
        <section className="card card-warn" aria-labelledby="ponr-h">
          <div className="card-head">
            <Flag size={20} />
            <KindChip kind="ponr" />
          </div>
          <h3 id="ponr-h">{ponr.title}</h3>
          <HintLadder id={ponr.id} hints={ponr.hints} progress={p} onReveal={actions.reveal} />
          {blockers.length + atRisk.length > 0 ? (
            <>
              <p className="label">Vorher noch offen</p>
              <ul className="checklist">
                {blockers.map((s) => (
                  <li key={s.id}>
                    <Alert size={16} /> {s.title}
                  </li>
                ))}
                {atRisk.map(({ type, missing }) => (
                  <li key={type.id}>
                    <Alert size={16} /> {missing} {missing === 1 ? type.name : type.plural} seit dem letzten Point of No Return
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="ok-line">
              <Check size={18} /> Alles erledigt. Du kannst beruhigt weiter.
            </p>
          )}
        </section>
      )}

      {step ? (
        <section className={`card focus${step.kind === 'missable' ? ' focus-missable' : ''}`} aria-labelledby="next-h">
          <div className="card-head">
            <span className="eyebrow">Nächster Schritt</span>
            <KindChip kind={step.kind} />
          </div>
          <h3 id="next-h" className="focus-title">{step.title}</h3>
          <HintLadder id={step.id} hints={step.hints} progress={p} onReveal={actions.reveal} />
          <StepTrophies step={step} {...props} />
          <StepHelp step={step} {...props} onGuide={setGuideFor} />
          <StepActions step={step} {...props} />
        </section>
      ) : (
        <section className="card calm">
          <Coffee size={28} />
          <h3>Hier gibt es gerade nichts zu beachten</h3>
          <p className="muted">
            Spiel {chapter.label} einfach weiter.
            {p.mode === 'relaxed' && ' Im Entspannt-Modus zeigen wir nur, was du sonst verpassen könntest.'}
          </p>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="also-h">
          <h2 id="also-h" className="section-h">Auch in {chapter.label}</h2>
          <ul className="step-list">
            {others.map((s) => (
              <li key={s.id}>
                <details className="step-row">
                  <summary>
                    <KindChip kind={s.kind} />
                    <span>{s.title}</span>
                  </summary>
                  <div className="step-row-body">
                    <HintLadder id={s.id} hints={s.hints} progress={p} onReveal={actions.reveal} />
                    <StepTrophies step={s} {...props} />
                    <StepHelp step={s} {...props} onGuide={setGuideFor} />
                    <StepActions step={s} {...props} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}

      {collectibleTypes.length > 0 &&
        (collectiblesMatter ? (
          <section aria-labelledby="coll-h">
            <h2 id="coll-h" className="section-h">Sammelobjekte in {chapter.label}</h2>
            <div className="card">{counters}</div>
          </section>
        ) : (
          <details className="card soft-details">
            <summary>
              Sammelobjekte hier: optional, später per {game.chapterNoun === 'Mission' ? 'Missionsauswahl' : 'Kapitelauswahl'}
            </summary>
            {counters}
          </details>
        ))}

      {(missed.length > 0 || lost.length > 0) && (
        <section className="card card-soft" aria-labelledby="missed-h">
          <h3 id="missed-h">Verpasst? Kein Weltuntergang.</h3>
          <ul className="missed">
            {missed.map((t) => (
              <li key={t.id}>
                <TrophyChip game={game} trophy={t} progress={p} />
                <span className="small muted">{t.recovery ?? 'Nachholbar per Kapitelauswahl.'}</span>
              </li>
            ))}
            {lost.map(({ type, missing }) => (
              <li key={type.id}>
                <span className="tchip">{missing} {missing === 1 ? type.name : type.plural}</span>
                <span className="small muted">Liegen hinter einem Point of No Return.</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="lookahead">
        {game.meta.missableCount === 0
          ? `Dieses Spiel hat keine verpassbaren Trophäen. ${game.meta.chapterSelect}`
          : upcoming > 0
            ? `In den nächsten zwei ${plural} ${upcoming === 1 ? 'kommt eine verpassbare Sache' : `kommen ${upcoming} verpassbare Dinge`}. Wir melden uns rechtzeitig.`
            : `In den nächsten zwei ${plural} ist nichts verpassbar.`}
      </p>

      {!isLast ? (
        confirmLeave ? (
          <section className="card card-warn" aria-labelledby="leave-h">
            <h3 id="leave-h">Moment, da ist noch was offen</h3>
            <ul className="checklist">
              {blockers.map((s) => (
                <li key={s.id}>
                  <Alert size={16} /> {s.title}
                </li>
              ))}
              {atRisk.map(({ type, missing }) => (
                <li key={type.id}>
                  <Alert size={16} /> {missing} {missing === 1 ? type.name : type.plural}
                </li>
              ))}
            </ul>
            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={() => setConfirmLeave(false)}>
                Ich hole das noch
              </button>
              <button type="button" className="btn" onClick={advance}>
                Trotzdem weiter
              </button>
            </div>
          </section>
        ) : (
          <button
            type="button"
            className="btn btn-block btn-advance"
            onClick={() => (blockers.length || atRisk.length ? setConfirmLeave(true) : advance())}
          >
            {chapter.label} abgeschlossen <ChevronRight size={18} />
          </button>
        )
      ) : (
        <button type="button" className="btn btn-block" onClick={() => onTab('route')}>
          Zur Aufräum-Route
        </button>
      )}

      {done.length > 0 && (
        <details className="done-list">
          <summary>Erledigt in {chapter.label} ({done.length})</summary>
          <ul>
            {done.map((s) => (
              <li key={s.id}>
                <Check size={16} /> <span>{s.title}</span>
                {p.doneSteps.includes(s.id) && (
                  <button type="button" className="link-btn" onClick={() => actions.toggleStep(s.id)}>
                    Rückgängig
                  </button>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}

      {guideFor && trophyById(game, guideFor)?.guide && (
        <GuideSheet
          game={game}
          trophy={trophyById(game, guideFor)!}
          progress={p}
          onEarn={() => actions.toggleTrophy(guideFor)}
          onClose={() => setGuideFor(null)}
        />
      )}

      {chapterSheet && (
        <Sheet title={`Wo bist du gerade?`} onClose={() => setChapterSheet(false)}>
          <ChapterPicker
            {...props}
            onPick={(i) => {
              actions.setChapter(i);
              setChapterSheet(false);
            }}
          />
        </Sheet>
      )}
    </div>
  );
}

export function ChapterPicker({ game, progress: p, onPick }: Pick<TabProps, 'game' | 'progress'> & { onPick: (i: number) => void }) {
  const acts = [...new Set(game.chapters.map((c) => c.act))];
  return (
    <div className="picker">
      <p className="small muted">Namen späterer {nounPlural(game)} bleiben verborgen. Die Markierungen verraten nur, wo du aufpassen musst.</p>
      {acts.map((act) => (
        <div key={act} className="picker-act">
          <p className="label">{act}</p>
          <div className="picker-grid">
            {game.chapters.map((c, i) => {
              if (c.act !== act) return null;
              const missables = game.trophies.filter((t) => t.missable && t.availableFrom === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`pick${i === p.chapterIndex ? ' pick-current' : ''}${i < p.chapterIndex ? ' pick-past' : ''}`}
                  onClick={() => onPick(i)}
                  aria-label={`${chapterName(game, i, p)}${c.pointOfNoReturn ? ', Point of No Return' : ''}${missables ? `, ${missables} verpassbar` : ''}`}
                >
                  <span className="pick-num">{c.number}</span>
                  {c.pointOfNoReturn && <Flag size={12} className="pick-flag" />}
                  {missables > 0 && <span className="pick-dot" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="legend small muted">
        <span><span className="pick-dot static" aria-hidden="true" /> Verpassbares beginnt hier</span>
        <span><Flag size={12} className="pick-flag static" /> Kein Zurück danach</span>
      </p>
    </div>
  );
}
