import { chapterName, collectedInChapter, collectedTotal, itemsIn, trophyById } from '../lib/navigator';
import type { TabProps } from './GameScreen';
import { ItemList } from './ItemList';
import { Bar, Counter, TrophyChip } from './ui';

export function CollectTab({ game, progress: p, actions }: TabProps) {
  if (game.collectibles.length === 0) {
    return <p className="empty muted">Keine Sammelobjekte in diesem Spiel.</p>;
  }
  return (
    <div className="stack">
      {game.collectibles.map((type) => {
        const total = collectedTotal(game, p, type.id);
        const trophy = type.trophyId ? trophyById(game, type.trophyId) : undefined;
        const chapters = game.chapters
          .map((c, i) => ({ c, i, n: c.collectibles?.[type.id] ?? 0 }))
          .filter((x) => x.n > 0);
        return (
          <section key={type.id} className="card" aria-labelledby={`ct-${type.id}`}>
            <div className="card-head">
              <h3 id={`ct-${type.id}`}>{type.plural}</h3>
              <span className="num">
                {total}
                <small>/{type.total}</small>
              </span>
            </div>
            <Bar value={total} max={type.total} tone={total === type.total ? 'ok' : 'accent'} />
            <div className="chips">
              {trophy && <TrophyChip game={game} trophy={trophy} progress={p} />}
              {type.missable ? (
                <span className="chip chip-warn">verpassbar nach Point of No Return</span>
              ) : (
                <span className="chip chip-ok">jederzeit nachholbar</span>
              )}
            </div>
            {chapters.some(({ c }) => itemsIn(game, c.id, type.id).length > 0) && (
              <p className="small muted">Bei Kapiteln mit Pfeil kannst du jedes Objekt einzeln abhaken, mit Fundort und Bild.</p>
            )}
            <ul className="collect-list">
              {chapters.map(({ c, i, n }) => (
                <li key={c.id} className={i === p.chapterIndex ? 'collect-current' : i > p.chapterIndex ? 'collect-future' : undefined}>
                  {itemsIn(game, c.id, type.id).length > 0 ? (
                    <details className="collect-items" open={i === p.chapterIndex}>
                      <summary>
                        <span>
                          {chapterName(game, i, p)}
                          {i === p.chapterIndex && <span className="here">hier</span>}
                        </span>
                        <span className="num">
                          {collectedInChapter(p, c.id, type.id)}
                          <small>/{n}</small>
                        </span>
                      </summary>
                      <ItemList game={game} progress={p} actions={actions} chapterId={c.id} type={type} />
                    </details>
                  ) : (
                    <>
                      <span>
                        {chapterName(game, i, p)}
                        {i === p.chapterIndex && <span className="here">hier</span>}
                      </span>
                      <Counter
                        value={collectedInChapter(p, c.id, type.id)}
                        max={n}
                        label={`${type.plural} in ${c.label}`}
                        onChange={(v) => actions.setCollected(c.id, type.id, Math.min(v, n))}
                      />
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
