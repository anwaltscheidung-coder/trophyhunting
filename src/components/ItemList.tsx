import type { GameActions } from '../App';
import type { CollectibleType, Game, GameProgress } from '../types';
import { itemsIn } from '../lib/navigator';
import { Figure } from './Figure';
import { Check } from './Icons';

/**
 * Sammelobjekte eines Kapitels einzeln, in Reihenfolge entlang des Wegs.
 * Zugeklappt sieht man nur den Stupser, aufgeklappt Fundort und Bilder.
 */
export function ItemList({
  game,
  progress: p,
  actions,
  chapterId,
  type,
}: {
  game: Game;
  progress: GameProgress;
  actions: GameActions;
  chapterId: string;
  type: CollectibleType;
}) {
  const items = itemsIn(game, chapterId, type.id);
  return (
    <ul className="items">
      {items.map((it) => {
        const done = p.items.includes(it.id);
        return (
          <li key={it.id} className={`item${done ? ' item-done' : ''}`}>
            <button
              type="button"
              className={`earn${done ? ' earn-on' : ''}`}
              aria-pressed={done}
              aria-label={`${type.name} ${it.number}: ${done ? 'nicht gefunden' : 'gefunden'}`}
              onClick={() => actions.toggleItem(it.id)}
            >
              {done && <Check size={18} />}
            </button>
            <details className="item-details">
              <summary>
                <span className="item-no">#{it.number}</span>
                <span>{it.hint}</span>
              </summary>
              <div className="item-body">
                <p>{it.location}</p>
                {it.images?.map((img) => (
                  <Figure key={img.src + img.alt} image={img} revealSpoilers={p.spoiler === 'open'} />
                ))}
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
