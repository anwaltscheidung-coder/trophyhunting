import { useEffect, useState } from 'react';
import type { GuideImage } from '../types';
import { Eye } from './Icons';

/** Markierungen über dem Bild, in Prozent; skaliert mit jeder Bildgrösse. */
function Marks({ image }: { image: GuideImage }) {
  if (!image.marks?.length) return null;
  return (
    <span className="marks" aria-hidden="true">
      {image.marks.map((m, i) => (
        <span
          key={i}
          className="mark"
          style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${(m.r ?? 4) * 2}%` }}
        >
          {m.label && <span className="mark-label">{m.label}</span>}
        </span>
      ))}
    </span>
  );
}

function Lightbox({ image, onClose }: { image: GuideImage; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.alt} onClick={onClose}>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <span className="shot-frame">
          <img src={image.src} alt={image.alt} />
          <Marks image={image} />
        </span>
        {(image.caption || image.credit) && (
          <p className="lightbox-caption">
            {image.caption}
            {image.credit && <span className="credit"> · Bild: {image.credit}</span>}
          </p>
        )}
        <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
          Schliessen
        </button>
      </div>
    </div>
  );
}

/**
 * Bild aus einem Guide: mit Markierungen, Bildnachweis, Spoiler-Schutz
 * (unscharf bis zum ersten Antippen) und Vergrösserung beim zweiten.
 */
export function Figure({ image, revealSpoilers }: { image: GuideImage; revealSpoilers: boolean }) {
  const [unblurred, setUnblurred] = useState(false);
  const [zoom, setZoom] = useState(false);
  const blurred = image.spoiler === true && !revealSpoilers && !unblurred;
  return (
    <figure className="shot">
      <button
        type="button"
        className={`shot-frame${blurred ? ' shot-blurred' : ''}`}
        onClick={() => (blurred ? setUnblurred(true) : setZoom(true))}
        aria-label={blurred ? `Spoiler-Bild aufdecken: ${image.alt}` : `Bild vergrössern: ${image.alt}`}
      >
        <img src={image.src} alt={blurred ? '' : image.alt} loading="lazy" />
        {!blurred && <Marks image={image} />}
        {blurred && (
          <span className="shot-veil">
            <Eye size={18} /> Spoiler-Bild · antippen
          </span>
        )}
      </button>
      {(image.caption || image.credit) && (
        <figcaption>
          {image.caption}
          {image.credit && <span className="credit">Bild: {image.credit}</span>}
        </figcaption>
      )}
      {zoom && <Lightbox image={image} onClose={() => setZoom(false)} />}
    </figure>
  );
}
