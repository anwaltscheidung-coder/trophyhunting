/**
 * Gezeichnete Szenen als SVG-Daten-URLs für das fiktive Testspiel und
 * Platzhalter für echte Screenshots. Sobald Partner-Bilder importiert
 * sind, stehen dort normale Bild-URLs vom eigenen Bildserver.
 */

const W = 800;
const H = 450;

function uri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Reproduzierbarer Zufall, damit jede Szene gleich aussieht. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function frame(defs: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`;
}

const sky = (id: string, top: string, bottom: string) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`;

function houses(r: () => number, baseY: number, color: string, windowColor: string, scale = 1): string {
  let x = -20;
  let out = '';
  while (x < W + 20) {
    const w = (70 + r() * 70) * scale;
    const h = (80 + r() * 110) * scale;
    const roof = (25 + r() * 30) * scale;
    const y = baseY - h;
    out += `<path d="M${x} ${baseY}V${y}L${x + w / 2} ${y - roof}L${x + w} ${y}V${baseY}Z" fill="${color}"/>`;
    if (r() > 0.4) out += `<rect x="${x + w * 0.65}" y="${y - roof * 0.9}" width="${8 * scale}" height="${roof * 0.7}" fill="${color}"/>`;
    for (let i = 0; i < 3; i++) {
      if (r() > 0.45) {
        const wx = x + 10 * scale + r() * (w - 30 * scale);
        const wy = y + 15 * scale + r() * (h - 50 * scale);
        out += `<rect x="${wx}" y="${wy}" width="${11 * scale}" height="${15 * scale}" rx="1" fill="${windowColor}" opacity="${0.55 + r() * 0.45}"/>`;
      }
    }
    x += w + r() * 6;
  }
  return out;
}

const scenes = {
  rooftops(seed: number) {
    const r = rng(seed);
    return frame(
      sky('s', '#2b3f63', '#e7a06b'),
      `<rect width="${W}" height="${H}" fill="url(#s)"/>
       <circle cx="640" cy="120" r="34" fill="#ffd9a0" opacity="0.85"/>
       ${houses(r, 330, '#3b3550', '#ffcf7a', 0.8)}
       ${houses(r, 450, '#221d30', '#ffbf5a', 1.25)}
       <path d="M0 450L0 390L260 330L520 390L800 360L800 450Z" fill="#15121f"/>`,
    );
  },
  pier(seed: number) {
    const r = rng(seed);
    let waves = '';
    for (let i = 0; i < 26; i++) {
      const y = 290 + r() * 150;
      const x = r() * W;
      waves += `<path d="M${x} ${y}q15 -6 30 0" stroke="#9cc4d8" stroke-width="2" fill="none" opacity="0.35"/>`;
    }
    let posts = '';
    for (let i = 0; i < 7; i++) posts += `<rect x="${330 + i * 62}" y="300" width="9" height="${90 + i * 8}" fill="#2e2219"/>`;
    return frame(
      sky('s', '#36557a', '#f0b37a') + sky('w', '#3d6f86', '#173447'),
      `<rect width="${W}" height="${H}" fill="url(#s)"/>
       <rect y="270" width="${W}" height="180" fill="url(#w)"/>${waves}
       <path d="M300 300L800 280L800 310L300 318Z" fill="#6b4a33"/>${posts}
       <path d="M60 300q70 30 170 0l-20 30h-130Z" fill="#2a2030"/><rect x="138" y="190" width="5" height="110" fill="#2a2030"/>
       <path d="M143 195l60 70h-60Z" fill="#e9e1cf" opacity="0.85"/>
       <rect x="640" y="250" width="44" height="34" fill="#4d3a2a"/><rect x="690" y="258" width="34" height="26" fill="#5b4532"/>
       <path d="M520 160c40-40 110-30 150 0" stroke="#3b2f2a" stroke-width="4" fill="none"/>`,
    );
  },
  alley(seed: number) {
    const r = rng(seed);
    let stones = '';
    for (let i = 0; i < 40; i++) {
      const y = 330 + r() * 120;
      const x = 160 + r() * 480 + (y - 330) * (r() - 0.5);
      stones += `<ellipse cx="${x}" cy="${y}" rx="${10 + r() * 10}" ry="4" fill="#3a3346" opacity="0.6"/>`;
    }
    return frame(
      sky('s', '#1c2236', '#3d3b5a') + '<radialGradient id="g" cx="0.62" cy="0.38" r="0.35"><stop offset="0" stop-color="#ffcf7a" stop-opacity="0.75"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>',
      `<rect width="${W}" height="${H}" fill="url(#s)"/>
       <path d="M0 0H250L330 300H0Z" fill="#2b2638"/><path d="M800 0H560L480 300H800Z" fill="#332c43"/>
       <path d="M0 300H800V450H0Z" fill="#241f30"/>${stones}
       <rect x="380" y="150" width="50" height="150" fill="#1a1624"/><rect x="60" y="120" width="70" height="90" fill="#3e3650"/>
       <rect width="${W}" height="${H}" fill="url(#g)"/><rect x="492" y="150" width="14" height="24" rx="3" fill="#ffd27f"/>
       <ellipse cx="560" cy="350" rx="36" ry="14" fill="#5a4630"/><rect x="530" y="300" width="60" height="50" rx="6" fill="#6e5538"/>`,
    );
  },
  tower(seed: number) {
    const r = rng(seed);
    return frame(
      sky('s', '#4a6fa0', '#f2c58a'),
      `<rect width="${W}" height="${H}" fill="url(#s)"/>
       <path d="M330 450V170L400 60L470 170V450Z" fill="#5d5470"/><rect x="380" y="190" width="40" height="55" rx="20" fill="#2b2638"/>
       <path d="M250 450V250H550V450Z" fill="#4a4360"/><path d="M300 450V320a50 50 0 0 1 100 0V450Z" fill="#2b2638"/>
       <path d="M400 450V320a50 50 0 0 1 100 0V450Z" fill="#2b2638" opacity="0.9"/>
       <path d="M250 250H550" stroke="#8a7f99" stroke-width="6"/>
       ${houses(r, 450, '#2d2840', '#ffcf7a', 0.9)}`,
    );
  },
  market(seed: number) {
    const r = rng(seed);
    const colors = ['#3f7fb8', '#c2533f', '#d9a53a', '#3f8f7a'];
    let stalls = '';
    for (let i = 0; i < 4; i++) {
      const x = 40 + i * 190;
      const c = colors[i];
      stalls += `<path d="M${x} 230L${x + 170} 230L${x + 150} 280L${x + 20} 280Z" fill="${c}"/>
        <rect x="${x + 25}" y="280" width="6" height="110" fill="#3a2c22"/><rect x="${x + 140}" y="280" width="6" height="110" fill="#3a2c22"/>
        <rect x="${x + 15}" y="340" width="140" height="50" fill="#5e4632"/>
        <rect x="${x + 30 + r() * 30}" y="320" width="28" height="22" fill="#7a5a3e"/>`;
    }
    return frame(
      sky('s', '#6d94bf', '#f4d29a'),
      `<rect width="${W}" height="${H}" fill="url(#s)"/>${houses(r, 300, '#7a6a8a', '#ffe1a0', 0.9)}
       <rect y="300" width="${W}" height="150" fill="#8b7a68"/>${stalls}`,
    );
  },
  warehouse(seed: number) {
    const r = rng(seed);
    let crates = '';
    for (let i = 0; i < 9; i++) {
      const x = 60 + (i % 5) * 140 + r() * 20;
      const y = i < 5 ? 330 : 250;
      crates += `<rect x="${x}" y="${y}" width="90" height="80" fill="#6b4f37" stroke="#3b2a1c" stroke-width="4"/><path d="M${x} ${y}L${x + 90} ${y + 80}M${x + 90} ${y}L${x} ${y + 80}" stroke="#3b2a1c" stroke-width="3"/>`;
    }
    return frame(
      '<linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c8" stop-opacity="0.35"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/></linearGradient>',
      `<rect width="${W}" height="${H}" fill="#241d22"/>
       <path d="M0 60H800M0 140H800" stroke="#3a2d2a" stroke-width="16"/>
       <rect x="40" y="170" width="720" height="10" fill="#4a3a30"/><rect x="60" y="180" width="8" height="240" fill="#4a3a30"/><rect x="730" y="180" width="8" height="240" fill="#4a3a30"/>
       <path d="M520 0L600 0L380 450L240 450Z" fill="url(#l)"/>${crates}
       <path d="M690 180V420M720 180V420" stroke="#8a6a48" stroke-width="5"/><path d="M690 210H720M690 250H720M690 290H720M690 330H720M690 370H720" stroke="#8a6a48" stroke-width="4"/>`,
    );
  },
  nightHarbor(seed: number) {
    const r = rng(seed);
    let stars = '';
    for (let i = 0; i < 40; i++) stars += `<circle cx="${r() * W}" cy="${r() * 180}" r="${r() * 1.6 + 0.3}" fill="#dfe8ff" opacity="${0.4 + r() * 0.6}"/>`;
    return frame(
      sky('s', '#0b1224', '#22304d') + '<radialGradient id="c" cx="0.5" cy="0" r="1"><stop offset="0" stop-color="#ffd27f" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd27f" stop-opacity="0"/></radialGradient>',
      `<rect width="${W}" height="${H}" fill="url(#s)"/>${stars}<circle cx="120" cy="90" r="26" fill="#e9eefc"/>
       ${houses(r, 300, '#171d33', '#f5c66b', 0.85)}
       <rect y="300" width="${W}" height="150" fill="#1b2134"/>
       <rect x="560" y="120" width="10" height="180" fill="#2c2f44"/><path d="M565 120H680V132H565Z" fill="#2c2f44"/><path d="M670 132V220" stroke="#2c2f44" stroke-width="3"/>
       <rect x="300" y="200" width="6" height="100" fill="#3a3b52"/><rect x="292" y="190" width="22" height="16" rx="3" fill="#ffd27f"/>
       <path d="M303 206L230 300H380Z" fill="url(#c)"/>
       <rect x="80" y="320" width="90" height="70" fill="#3b3244"/><rect x="170" y="335" width="70" height="55" fill="#433849"/><rect x="420" y="330" width="80" height="60" fill="#3b3244"/>`,
    );
  },
  /** Draufsicht des Hafenviertels mit Wachen, Sichtkegeln und Route. */
  harborMap() {
    let blocks = '';
    const grid = [
      [60, 60, 140, 90], [230, 60, 120, 90], [380, 50, 150, 100], [560, 60, 180, 80],
      [60, 190, 110, 80], [330, 180, 120, 90], [600, 170, 140, 90],
    ];
    for (const [x, y, w, h] of grid) blocks += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#3a3f55" stroke="#4d5370" stroke-width="2"/>`;
    const cone = (x: number, y: number, a: number) =>
      `<path d="M${x} ${y}l${Math.cos(a - 0.4) * 110} ${Math.sin(a - 0.4) * 110}A110 110 0 0 1 ${x + Math.cos(a + 0.4) * 110} ${y + Math.sin(a + 0.4) * 110}Z" fill="#ff7d69" opacity="0.28"/><circle cx="${x}" cy="${y}" r="9" fill="#ff7d69" stroke="#1b1e2b" stroke-width="3"/>`;
    return frame(
      '',
      `<rect width="${W}" height="${H}" fill="#262b3d"/>
       <path d="M0 330H800V450H0Z" fill="#1d4a63"/><path d="M0 330H800" stroke="#7aa6bd" stroke-width="3"/>
       <rect x="470" y="330" width="40" height="100" fill="#6b5640"/><rect x="150" y="330" width="34" height="70" fill="#6b5640"/>
       ${blocks}
       <rect x="700" y="280" width="70" height="50" rx="4" fill="#5b4a35" stroke="#8a6f50" stroke-width="3"/>
       ${cone(250, 170, 0.3)}${cone(520, 300, -2.4)}${cone(560, 160, 1.6)}
       <path d="M30 300C120 300 170 290 210 280S300 160 310 165 470 160 520 160 560 300 640 300 700 305 735 300" stroke="#8cc4ff" stroke-width="5" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>
       <circle cx="30" cy="300" r="14" fill="#66d6a2"/><circle cx="735" cy="300" r="14" fill="#8cc4ff"/>
       <rect x="40" y="380" width="60" height="30" rx="4" fill="#5b4a35"/>`,
    );
  },
};

export type SceneKind = keyof typeof scenes;

export function scene(kind: SceneKind, seed = 1): string {
  return uri(scenes[kind](seed));
}

/**
 * Platzhalter, bis echte Screenshots importiert sind. Zeigt deutlich,
 * dass hier später ein Bild aus dem Partner-Guide steht.
 */
export function placeholderShot(label: string, source = 'PowerPyx'): string {
  const safe = label.replace(/[<>&"]/g, '');
  return uri(
    frame(
      '<pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="24" fill="#ffffff" opacity="0.03"/></pattern>',
      `<rect width="${W}" height="${H}" fill="#1c2232"/><rect width="${W}" height="${H}" fill="url(#p)"/>
       <rect x="16" y="16" width="${W - 32}" height="${H - 32}" rx="14" fill="none" stroke="#3a4560" stroke-width="3" stroke-dasharray="12 10"/>
       <g transform="translate(400 170)" fill="none" stroke="#8a97b3" stroke-width="6" stroke-linejoin="round">
         <rect x="-56" y="-34" width="112" height="76" rx="12"/><circle cx="0" cy="4" r="22"/><path d="M-22 -34l10 -16h24l10 16"/>
       </g>
       <text x="400" y="290" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#c9d2e6">Screenshot aus dem ${source}-Guide</text>
       <text x="400" y="330" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" fill="#8a97b3">${safe}</text>`,
    ),
  );
}
