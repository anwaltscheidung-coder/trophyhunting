import { useEffect } from 'react';
import type { Grade } from '../types';
import { Check, Cup } from './Icons';

export interface ToastMsg {
  id: number;
  kind: 'trophy' | 'info';
  grade?: Grade;
  title: string;
  text: string;
}

/** Benachrichtigung im Stil der Konsole. */
export function Toast({ msg, onDone }: { msg: ToastMsg; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast-icon">{msg.kind === 'trophy' && msg.grade ? <Cup grade={msg.grade} size={26} /> : <Check size={20} />}</span>
      <span className="toast-body">
        <small>{msg.title}</small>
        <strong>{msg.text}</strong>
      </span>
    </div>
  );
}
