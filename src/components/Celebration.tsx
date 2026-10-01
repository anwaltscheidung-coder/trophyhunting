import { useEffect, useRef } from 'react';
import type { Game, Trophy } from '../types';
import { Cup } from './Icons';

/** Platin-Moment: Konfetti in den Trophäenfarben. */
export function Celebration({ game, trophy, onClose }: { game: Game; trophy: Trophy; onClose: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const styles = getComputedStyle(document.documentElement);
    const colors = ['--plat', '--gold', '--silver', '--bronze'].map((v) => styles.getPropertyValue(v).trim() || '#ccc');
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      el.width = el.clientWidth * dpr;
      el.height = el.clientHeight * dpr;
    };
    resize();
    const bits = Array.from({ length: 140 }, () => ({
      x: Math.random() * el.width,
      y: -Math.random() * el.height * 0.6,
      vy: (1.2 + Math.random() * 2.4) * dpr,
      vx: (Math.random() - 0.5) * 1.4 * dpr,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      w: (5 + Math.random() * 5) * dpr,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, el.width, el.height);
      for (const b of bits) {
        b.x += b.vx;
        b.y += b.vy;
        b.r += b.vr;
        if (b.y > el.height + 20) b.y = -20;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.r);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.w / 2, -b.w / 4, b.w, b.w / 2);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="celebrate" role="dialog" aria-modal="true" aria-label="Platin freigeschaltet">
      <canvas ref={canvas} className="celebrate-canvas" aria-hidden="true" />
      <div className="celebrate-card">
        <Cup grade="platinum" size={88} />
        <p className="eyebrow">Platin freigeschaltet</p>
        <h2>{trophy.name}</h2>
        <p className="muted">{game.title}: alle Trophäen geholt. Glückwunsch!</p>
        <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
          Weiter
        </button>
      </div>
    </div>
  );
}
