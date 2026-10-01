import { useState } from 'react';
import type { TabProps } from './GameScreen';
import { ModePicker, ShieldPicker } from './Onboarding';
import { Sheet } from './ui';

export function SettingsSheet({ game, progress: p, actions, onClose }: TabProps & { onClose: () => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <Sheet title="Einstellungen" onClose={onClose}>
      <div className="stack">
        <div>
          <p className="label">Spielweise</p>
          <ModePicker value={p.mode} onChange={(mode) => actions.update((x) => ({ ...x, mode }))} />
        </div>
        <div>
          <p className="label">Spoiler-Schutz</p>
          <ShieldPicker value={p.spoiler} onChange={(spoiler) => actions.update((x) => ({ ...x, spoiler, revealed: {} }))} />
          <p className="small muted">Beim Wechsel werden aufgedeckte Hinweise wieder verdeckt.</p>
        </div>
        <div>
          <p className="label">Fortschritt</p>
          {confirmReset ? (
            <div className="card card-warn">
              <p>Alle Häkchen, Zähler und Einstellungen für {game.title} löschen?</p>
              <div className="actions">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    actions.reset();
                    onClose();
                  }}
                >
                  Ja, zurücksetzen
                </button>
                <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn" onClick={() => setConfirmReset(true)}>
              Spiel zurücksetzen
            </button>
          )}
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
          Fertig
        </button>
      </div>
    </Sheet>
  );
}
