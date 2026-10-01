import { Component, type ReactNode } from 'react';
import { clearAll } from '../lib/storage';

/**
 * Fängt Fehler beim Rendern ab. Ohne das würde React die ganze Seite
 * leeren; so sieht man wenigstens, was passiert ist.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <section className="boot" role="alert">
        <h1>Da ist etwas schiefgelaufen</h1>
        <p>Schick diese Meldung bitte an das Team, damit wir den Fehler beheben können:</p>
        <pre>{`${error.name}: ${error.message}\n\n${navigator.userAgent}`}</pre>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => location.reload()}>
            Neu laden
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              clearAll();
              location.reload();
            }}
          >
            Spielstände zurücksetzen
          </button>
        </div>
      </section>
    );
  }
}
