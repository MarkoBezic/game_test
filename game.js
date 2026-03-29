// ─── Constants ────────────────────────────────────────────────────────────────
const TILE = 20;          // pixels per tile
const COLS = 28;
const ROWS = 31;
const W = COLS * TILE;    // 560
const H = ROWS * TILE;    // 620

const T = { WALL: 0, DOT: 1, POWER: 2, EMPTY: 3, HOUSE: 4 };

const DIR = {
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
  UP:    { x:  0, y: -1 },
  DOWN:  { x:  0, y:  1 },
  NONE:  { x:  0, y:  0 }
};
const DIRS = [DIR.LEFT, DIR.RIGHT, DIR.UP, DIR.DOWN];

// ─── Maze layout (28×31) ─────────────────────────────────────────────────────
// 0=wall 1=dot 2=power pellet 3=empty 4=ghost house 5=tunnel row
const RAW_MAZE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,4,4,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,4,4,4,4,4,4,0,3,0,0,1,0,0,0,0,0,0],
  [3,3,3,3,3,3,1,3,3,3,0,4,4,4,4,4,4,0,3,3,3,1,3,3,3,3,3,3],
  [0,0,0,0,0,0,1,0,0,3,0,4,4,4,4,4,4,0,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,2,1,1,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,0,0,1,1,2,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// ─── Maze state ───────────────────────────────────────────────────────────────
let mazeData = [];
let totalDots = 0;
let dotsEaten = 0;

let wallPolygons = [];

function initMaze() {
  mazeData = RAW_MAZE.map(row => [...row]);
  totalDots = 0;
  dotsEaten = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (mazeData[r][c] === T.DOT || mazeData[r][c] === T.POWER) totalDots++;
  wallPolygons = buildWallPolygons();
}

function getTile(col, row) {
  if (row < 0 || row >= ROWS) return T.WALL;
  const c = ((col % COLS) + COLS) % COLS;
  return mazeData[row][c];
}

function setTile(col, row, val) {
  if (row < 0 || row >= ROWS) return;
  const c = ((col % COLS) + COLS) % COLS;
  mazeData[row][c] = val;
}

function isWall(col, row) {
  const t = getTile(col, row);
  return t === T.WALL;
}

function isPassable(col, row, forGhost = false) {
  const t = getTile(col, row);
  if (t === T.WALL) return false;
  if (!forGhost && t === T.HOUSE) return false;
  return true;
}

// ─── Canvas + context ─────────────────────────────────────────────────────────
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ─── Renderer ─────────────────────────────────────────────────────────────────
let pelletBlink = 0; // frame counter for power-pellet blink

function drawMaze() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = mazeData[r][c];
      const px = c * TILE;
      const py = r * TILE;

      if (t === T.DOT) {
        ctx.fillStyle = '#FFE4B5';
        ctx.beginPath();
        ctx.arc(px + TILE / 2, py + TILE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (t === T.POWER) {
        if (Math.floor(pelletBlink / 15) % 2 === 0) {
          ctx.fillStyle = '#FFE4B5';
          ctx.beginPath();
          ctx.arc(px + TILE / 2, py + TILE / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Draw wall outlines
  ctx.strokeStyle = '#1a1aff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const poly of wallPolygons) {
    strokeRoundedPoly(poly, 4);
    ctx.stroke();
  }
}

// Non-wrapping wall check used only for building wall outlines
function isWallStrict(c, r) {
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return true;
  return mazeData[r][c] === T.WALL;
}

// Trace the boundary of all wall regions as closed directed polygons.
// Edges are directed clockwise around each wall blob (open space on the left).
function buildWallPolygons() {
  const edgeMap = new Map();

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (mazeData[r][c] !== T.WALL) continue;
      const px = c * TILE, py = r * TILE;
      const tx = px + TILE,  ty = py + TILE;
      // open north → edge goes left-to-right along top
      if (!isWallStrict(c, r - 1)) edgeMap.set(`${px},${py}`,  { x2: tx, y2: py });
      // open south → edge goes right-to-left along bottom
      if (!isWallStrict(c, r + 1)) edgeMap.set(`${tx},${ty}`,  { x2: px, y2: ty });
      // open west  → edge goes bottom-to-top along left
      if (!isWallStrict(c - 1, r)) edgeMap.set(`${px},${ty}`,  { x2: px, y2: py });
      // open east  → edge goes top-to-bottom along right
      if (!isWallStrict(c + 1, r)) edgeMap.set(`${tx},${py}`,  { x2: tx, y2: ty });
    }
  }

  const visited = new Set();
  const polygons = [];

  for (const startKey of edgeMap.keys()) {
    if (visited.has(startKey)) continue;
    const poly = [];
    let curKey = startKey;
    while (!visited.has(curKey) && edgeMap.has(curKey)) {
      visited.add(curKey);
      const comma = curKey.indexOf(',');
      poly.push({ x: +curKey.slice(0, comma), y: +curKey.slice(comma + 1) });
      const e = edgeMap.get(curKey);
      curKey = `${e.x2},${e.y2}`;
    }
    if (poly.length > 2) polygons.push(poly);
  }

  return polygons;
}

// Stroke a closed polygon with rounded corners of the given radius.
function strokeRoundedPoly(poly, radius) {
  const n = poly.length;
  // For each vertex compute the entry point (r px before it) and exit point (r px after it)
  const corners = poly.map((curr, i) => {
    const prev = poly[(i - 1 + n) % n];
    const next = poly[(i + 1) % n];
    const dxi = prev.x - curr.x, dyi = prev.y - curr.y;
    const li  = Math.sqrt(dxi * dxi + dyi * dyi);
    const dxo = next.x - curr.x, dyo = next.y - curr.y;
    const lo  = Math.sqrt(dxo * dxo + dyo * dyo);
    const r   = Math.min(radius, li / 2, lo / 2);
    return {
      entry:  { x: curr.x + dxi / li * r, y: curr.y + dyi / li * r },
      vertex: curr,
      exit:   { x: curr.x + dxo / lo * r, y: curr.y + dyo / lo * r },
      r
    };
  });

  ctx.beginPath();
  ctx.moveTo(corners[0].entry.x, corners[0].entry.y);
  for (let i = 0; i < n; i++) {
    const cr  = corners[i];
    const nxt = corners[(i + 1) % n];
    ctx.arcTo(cr.vertex.x, cr.vertex.y, cr.exit.x, cr.exit.y, cr.r);
    ctx.lineTo(nxt.entry.x, nxt.entry.y);
  }
  ctx.closePath();
}

function drawPacMan(pac) {
  const cx = pac.x * TILE + TILE / 2;
  const cy = pac.y * TILE + TILE / 2;
  const r = TILE / 2 - 1;

  // Rotation based on direction
  let rot = 0;
  if (pac.dir === DIR.LEFT)  rot = Math.PI;
  if (pac.dir === DIR.UP)    rot = -Math.PI / 2;
  if (pac.dir === DIR.DOWN)  rot = Math.PI / 2;

  const mouth = pac.mouthAngle;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, mouth, Math.PI * 2 - mouth);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852']; // Blinky, Pinky, Inky, Clyde

function drawGhost(ghost, idx) {
  const px = ghost.x * TILE;
  const py = ghost.y * TILE;
  const cx = px + TILE / 2;
  const cy = py + TILE / 2;
  const r = TILE / 2 - 1;

  let bodyColor;
  if (ghost.mode === 'eaten') {
    // Only eyes
    drawGhostEyes(cx, cy, ghost.dir);
    return;
  } else if (ghost.mode === 'frightened') {
    const flash = ghost.frightenedTimer < 2000 && Math.floor(ghost.frightenedTimer / 250) % 2 === 0;
    bodyColor = flash ? '#fff' : '#0000CC';
  } else {
    bodyColor = GHOST_COLORS[idx];
  }

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  // Top half circle
  ctx.arc(cx, cy, r, Math.PI, 0);
  // Right side down
  ctx.lineTo(cx + r, py + TILE - 2);
  // Wavy bottom
  const segs = 3;
  const segW = (r * 2) / segs;
  for (let i = segs; i >= 0; i--) {
    const bx = cx - r + i * segW;
    const by = (i % 2 === 0) ? py + TILE - 2 : py + TILE - 6;
    ctx.lineTo(bx, by);
  }
  ctx.closePath();
  ctx.fill();

  if (ghost.mode === 'frightened') {
    const flash = ghost.frightenedTimer < 2000 && Math.floor(ghost.frightenedTimer / 250) % 2 === 0;
    // Simple face
    ctx.fillStyle = flash ? '#000' : '#fff';
    ctx.beginPath(); ctx.arc(cx - 4, cy - 2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, cy - 2, 2, 0, Math.PI * 2); ctx.fill();
  } else {
    drawGhostEyes(cx, cy, ghost.dir);
  }
}

function drawGhostEyes(cx, cy, dir) {
  // White of eye
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(cx - 4, cy - 2, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 4, cy - 2, 3, 4, 0, 0, Math.PI * 2); ctx.fill();

  // Pupil offset by direction
  let dx = 0, dy = 0;
  if (dir === DIR.LEFT)  dx = -2;
  if (dir === DIR.RIGHT) dx =  2;
  if (dir === DIR.UP)    dy = -2;
  if (dir === DIR.DOWN)  dy =  2;

  ctx.fillStyle = '#00f';
  ctx.beginPath(); ctx.arc(cx - 4 + dx, cy - 2 + dy, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 4 + dx, cy - 2 + dy, 1.5, 0, Math.PI * 2); ctx.fill();
}

function drawScorePopup(popup) {
  ctx.fillStyle = '#0ff';
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(popup.text, popup.x * TILE + TILE / 2, popup.y * TILE);
}

// ─── Audio ────────────────────────────────────────────────────────────────────
let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type, duration, startTime, gainVal = 0.3) {
  const ac = getAudio();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(gainVal, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playChomp() {
  const ac = getAudio();
  const t = ac.currentTime;
  playTone(220, 'square', 0.05, t, 0.15);
  playTone(110, 'square', 0.05, t + 0.05, 0.1);
}

function playPowerPellet() {
  const ac = getAudio();
  const t = ac.currentTime;
  playTone(200, 'sine', 0.1, t);
  playTone(350, 'sine', 0.1, t + 0.1);
  playTone(500, 'sine', 0.15, t + 0.2);
}

function playEatGhost() {
  const ac = getAudio();
  const t = ac.currentTime;
  playTone(600, 'square', 0.05, t);
  playTone(400, 'square', 0.05, t + 0.05);
  playTone(700, 'square', 0.1,  t + 0.1);
}

function playDeath() {
  const ac = getAudio();
  const t = ac.currentTime;
  for (let i = 0; i < 8; i++) {
    playTone(440 - i * 40, 'sawtooth', 0.1, t + i * 0.08, 0.2);
  }
}

// ─── Pac-Man entity ───────────────────────────────────────────────────────────
const PAC_START = { col: 13.5, row: 23 };

function makePacMan() {
  return {
    x: PAC_START.col,
    y: PAC_START.row,
    dir: DIR.LEFT,
    nextDir: DIR.LEFT,
    speed: 0.006,
    mouthAngle: 0.25,
    mouthDir: 1,   // opening or closing
    alive: true,
  };
}

function updatePacMan(pac, dt) {
  // Animate mouth
  pac.mouthAngle += pac.mouthDir * 0.008 * dt;
  if (pac.mouthAngle > 0.4) { pac.mouthAngle = 0.4; pac.mouthDir = -1; }
  if (pac.mouthAngle < 0.02) { pac.mouthAngle = 0.02; pac.mouthDir = 1; }

  const speed = pac.speed * dt;

  // Try switching to nextDir when aligned to grid
  const col = Math.round(pac.x);
  const row = Math.round(pac.y);
  const alignedH = Math.abs(pac.y - row) < 0.15;
  const alignedV = Math.abs(pac.x - col) < 0.15;

  const nd = pac.nextDir;
  if (nd !== DIR.NONE) {
    if ((nd.x !== 0 && alignedH) || (nd.y !== 0 && alignedV)) {
      const nc = col + nd.x;
      const nr = row + nd.y;
      if (isPassable(nc, nr)) {
        pac.dir = nd;
        if (nd.x !== 0) pac.y = row; else pac.x = col;
      }
    }
  }

  // Move in current direction
  const d = pac.dir;
  const nx = pac.x + d.x * speed;
  const ny = pac.y + d.y * speed;

  if (d.x !== 0) {
    const edgeCol = d.x > 0 ? Math.floor(nx + 0.5) : Math.ceil(nx - 0.5);
    if (!isPassable(edgeCol, Math.round(ny))) {
      pac.x = col; // snap back
    } else {
      pac.x = nx;
    }
  }
  if (d.y !== 0) {
    const edgeRow = d.y > 0 ? Math.floor(ny + 0.5) : Math.ceil(ny - 0.5);
    if (!isPassable(Math.round(nx), edgeRow)) {
      pac.y = row;
    } else {
      pac.y = ny;
    }
  }

  // Tunnel wrap
  if (pac.x < -0.5) pac.x = COLS - 0.5;
  if (pac.x > COLS - 0.5) pac.x = -0.5;
}

// ─── Ghost entity ─────────────────────────────────────────────────────────────
const GHOST_STARTS = [
  { col: 13.5, row: 11 },  // Blinky — starts outside house
  { col: 13.5, row: 14 },  // Pinky
  { col: 11.5, row: 14 },  // Inky
  { col: 15.5, row: 14 },  // Clyde
];

const SCATTER_TARGETS = [
  { col: 25, row: 0 },  // Blinky — top right
  { col: 2,  row: 0 },  // Pinky  — top left
  { col: 27, row: 30 }, // Inky   — bottom right
  { col: 0,  row: 30 }, // Clyde  — bottom left
];

const HOUSE_DOOR = { col: 13.5, row: 11 };
const HOUSE_EXIT_DOTS = [0, 0, 30, 60]; // dots eaten before ghost exits

function makeGhost(idx) {
  return {
    idx,
    x: GHOST_STARTS[idx].col,
    y: GHOST_STARTS[idx].row,
    dir: DIR.LEFT,
    mode: idx === 0 ? 'scatter' : 'house', // Blinky starts outside
    prevMode: 'scatter',
    frightenedTimer: 0,
    speed: 0.005,
    inHouse: idx !== 0,
    exitTimer: 0,
    target: { col: 0, row: 0 },
  };
}

function ghostSpeed(ghost) {
  if (ghost.mode === 'frightened') return 0.003;
  if (ghost.mode === 'eaten') return 0.011;
  if (ghost.inHouse) return 0.004;
  return 0.0035 + (level - 1) * 0.0005;
}

function updateGhostTarget(ghost, idx, pac, blinky) {
  if (ghost.mode === 'scatter') {
    ghost.target = SCATTER_TARGETS[idx];
    return;
  }
  if (ghost.mode === 'frightened') return; // random movement handled in move
  if (ghost.mode === 'eaten') {
    ghost.target = HOUSE_DOOR;
    return;
  }
  // Chase
  const pr = Math.round(pac.y), pc = Math.round(pac.x);
  if (idx === 0) { // Blinky
    ghost.target = { col: pc, row: pr };
  } else if (idx === 1) { // Pinky — 4 ahead
    const ahead = { col: pc + pac.dir.x * 4, row: pr + pac.dir.y * 4 };
    ghost.target = ahead;
  } else if (idx === 2) { // Inky
    const mid = { col: pc + pac.dir.x * 2, row: pr + pac.dir.y * 2 };
    const bx = Math.round(blinky.x), by = Math.round(blinky.y);
    ghost.target = { col: mid.col * 2 - bx, row: mid.row * 2 - by };
  } else { // Clyde
    const dx = Math.round(ghost.x) - pc;
    const dy = Math.round(ghost.y) - pr;
    const dist = Math.sqrt(dx * dx + dy * dy);
    ghost.target = dist > 8 ? { col: pc, row: pr } : SCATTER_TARGETS[3];
  }
}

function ghostDist(a, b) {
  const dx = a.col - b.col, dy = a.row - b.row;
  return dx * dx + dy * dy;
}

function pickGhostDir(ghost, col, row) {
  const opp = { x: -ghost.dir.x, y: -ghost.dir.y };
  let bestDir = null;
  let bestDist = Infinity;

  if (ghost.mode === 'frightened') {
    const options = DIRS.filter(d =>
      !(d.x === opp.x && d.y === opp.y) &&
      isPassable(col + d.x, row + d.y, true) &&
      getTile(col + d.x, row + d.y) !== T.HOUSE
    );
    if (options.length > 0) bestDir = options[Math.floor(Math.random() * options.length)];
  } else {
    for (const d of DIRS) {
      if (d.x === opp.x && d.y === opp.y) continue; // no reversals
      const nc = col + d.x;
      const nr = row + d.y;
      if (!isPassable(nc, nr, true)) continue;
      if (ghost.mode !== 'eaten' && getTile(nc, nr) === T.HOUSE) continue;
      const dist = ghostDist({ col: nc, row: nr }, ghost.target);
      if (dist < bestDist) { bestDist = dist; bestDir = d; }
    }
  }

  // Dead end — allow reversal
  if (!bestDir) bestDir = { x: -ghost.dir.x, y: -ghost.dir.y };
  ghost.dir = bestDir;
}

function moveGhost(ghost, dt) {
  if (ghost.inHouse) {
    // Bob up and down inside the ghost house while waiting to exit
    if (ghost.dir.y === 0) ghost.dir = DIR.UP;
    ghost.y += ghost.dir.y * 0.004 * dt;
    if (ghost.y < 13.0) { ghost.y = 13.0; ghost.dir = DIR.DOWN; }
    if (ghost.y > 15.5) { ghost.y = 15.5; ghost.dir = DIR.UP; }
    return;
  }

  const speed = ghostSpeed(ghost) * dt;
  const oldCol = Math.round(ghost.x);
  const oldRow = Math.round(ghost.y);

  ghost.x += ghost.dir.x * speed;
  ghost.y += ghost.dir.y * speed;

  // Tunnel wrap — skip crossing check when teleporting
  if (ghost.x < -0.5) { ghost.x = COLS - 0.5; return; }
  if (ghost.x > COLS - 0.5) { ghost.x = -0.5; return; }

  const newCol = Math.round(ghost.x);
  const newRow = Math.round(ghost.y);

  // Crossed into a new tile — snap to center and pick direction
  if (newCol !== oldCol || newRow !== oldRow) {
    ghost.x = newCol;
    ghost.y = newRow;
    pickGhostDir(ghost, newCol, newRow);
  }
}

// ─── Game state ───────────────────────────────────────────────────────────────
const STATE = { IDLE: 'idle', STARTING: 'starting', PLAYING: 'playing', DYING: 'dying', RESPAWN: 'respawn', GAMEOVER: 'gameover', WIN: 'win' };

let state = STATE.IDLE;
let stateTimer = 0;
let score = 0;
let lives = 3;
let level = 1;
let pac;
let ghosts;
let scorePopups = [];
let ghostCombo = 0;
let scatterChaseTimer = 0;
let scatterPhase = 0; // 0,2,4=scatter  1,3=chase
const SCATTER_CHASE = [7000, 20000, 7000, 20000, 5000, 20000, 5000, Infinity];
let chompToggle = 0;

const overlay     = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlaySub  = document.getElementById('overlay-sub');
const overlayHint = document.getElementById('overlay-hint');
const scoreEl     = document.getElementById('score');
const levelEl     = document.getElementById('level');
const livesEl     = document.getElementById('lives');

function showOverlay(title, sub, hint) {
  overlay.classList.remove('hidden');
  overlayTitle.textContent = title;
  overlaySub.textContent = sub;
  overlayHint.textContent = hint;
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function updateHUD() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  livesEl.textContent = '● '.repeat(lives).trim();
}

function startGame() {
  initMaze();
  pac = makePacMan();
  ghosts = [0, 1, 2, 3].map(makeGhost);
  scorePopups = [];
  ghostCombo = 0;
  scatterChaseTimer = 0;
  scatterPhase = 0;
  hideOverlay();
  setState(STATE.STARTING);
}

function setState(s) {
  state = s;
  stateTimer = 0;
}

function frightenGhosts() {
  const dur = Math.max(3000, 7000 - (level - 1) * 1000);
  for (const g of ghosts) {
    if (g.mode === 'eaten') continue;
    if (g.mode !== 'frightened') g.prevMode = g.mode;
    g.mode = 'frightened';
    g.frightenedTimer = dur;
    // Reverse direction
    g.dir = { x: -g.dir.x, y: -g.dir.y };
  }
  ghostCombo = 0;
}

function resetPositions() {
  pac = makePacMan();
  ghosts = [0, 1, 2, 3].map(makeGhost);
  ghostCombo = 0;
}

function handleInput(e) {
  const key = e.key;

  if (state === STATE.IDLE || state === STATE.GAMEOVER || state === STATE.WIN) {
    if (key === ' ' || key === 'Enter') {
      if (state === STATE.GAMEOVER || state === STATE.WIN) {
        score = 0; lives = 3; level = 1;
      }
      startGame();
    }
    return;
  }

  if (state !== STATE.PLAYING) return;

  if (key === 'ArrowLeft'  || key === 'a') pac.nextDir = DIR.LEFT;
  if (key === 'ArrowRight' || key === 'd') pac.nextDir = DIR.RIGHT;
  if (key === 'ArrowUp'    || key === 'w') pac.nextDir = DIR.UP;
  if (key === 'ArrowDown'  || key === 's') pac.nextDir = DIR.DOWN;
}

window.addEventListener('keydown', handleInput);

// ─── Main update ──────────────────────────────────────────────────────────────
function update(dt) {
  pelletBlink++;
  stateTimer += dt;

  if (state === STATE.STARTING) {
    if (stateTimer >= 2500) setState(STATE.PLAYING);
    return;
  }

  if (state === STATE.DYING) {
    if (stateTimer >= 2000) {
      lives--;
      if (lives <= 0) {
        setState(STATE.GAMEOVER);
        showOverlay('GAME OVER', `SCORE: ${score}`, 'PRESS SPACE TO PLAY AGAIN');
      } else {
        resetPositions();
        setState(STATE.RESPAWN);
      }
    }
    return;
  }

  if (state === STATE.RESPAWN) {
    if (stateTimer >= 1500) setState(STATE.PLAYING);
    return;
  }

  if (state !== STATE.PLAYING) return;

  // Scatter/chase phase timer
  scatterChaseTimer += dt;
  if (scatterChaseTimer >= SCATTER_CHASE[scatterPhase] && scatterPhase < SCATTER_CHASE.length - 1) {
    scatterChaseTimer = 0;
    scatterPhase++;
    const newMode = scatterPhase % 2 === 0 ? 'scatter' : 'chase';
    for (const g of ghosts) {
      if (g.mode === 'frightened' || g.mode === 'eaten' || g.inHouse) continue;
      g.mode = newMode;
      g.dir = { x: -g.dir.x, y: -g.dir.y }; // reverse
    }
  }

  // Update Pac-Man
  updatePacMan(pac, dt);

  // Eating
  const pc = Math.round(pac.x), pr = Math.round(pac.y);
  const tile = getTile(pc, pr);
  if (tile === T.DOT) {
    setTile(pc, pr, T.EMPTY);
    score += 10;
    dotsEaten++;
    chompToggle++;
    if (chompToggle % 2 === 0) playChomp();
  } else if (tile === T.POWER) {
    setTile(pc, pr, T.EMPTY);
    score += 50;
    dotsEaten++;
    frightenGhosts();
    playPowerPellet();
  }

  // Win check
  if (dotsEaten >= totalDots) {
    level++;
    setState(STATE.WIN);
    showOverlay('YOU WIN!', `LEVEL ${level - 1} CLEAR`, 'PRESS SPACE FOR NEXT LEVEL');
    return;
  }

  // Ghost exits from house
  for (let i = 1; i < 4; i++) {
    const g = ghosts[i];
    if (!g.inHouse) continue;
    if (dotsEaten >= HOUSE_EXIT_DOTS[i]) {
      g.inHouse = false;
      g.x = HOUSE_DOOR.col;
      g.y = HOUSE_DOOR.row;
      g.mode = scatterPhase % 2 === 0 ? 'scatter' : 'chase';
    }
  }

  // Update ghosts
  for (let i = 0; i < 4; i++) {
    const g = ghosts[i];

    if (g.mode === 'frightened') {
      g.frightenedTimer -= dt;
      if (g.frightenedTimer <= 0) {
        g.mode = g.prevMode || 'chase';
      }
    }

    if (g.mode === 'eaten') {
      // Check if reached house door
      const dist = Math.abs(g.x - HOUSE_DOOR.col) + Math.abs(g.y - HOUSE_DOOR.row);
      if (dist < 0.3) {
        g.mode = scatterPhase % 2 === 0 ? 'scatter' : 'chase';
        g.x = HOUSE_DOOR.col;
        g.y = HOUSE_DOOR.row;
      }
    }

    updateGhostTarget(g, i, pac, ghosts[0]);
    moveGhost(g, dt);
  }

  // Ghost-pac collision
  for (let i = 0; i < 4; i++) {
    const g = ghosts[i];
    const dx = g.x - pac.x;
    const dy = g.y - pac.y;
    if (Math.sqrt(dx * dx + dy * dy) < 0.75) {
      if (g.mode === 'frightened') {
        g.mode = 'eaten';
        ghostCombo++;
        const pts = 200 * Math.pow(2, ghostCombo - 1);
        score += pts;
        scorePopups.push({ x: g.x, y: g.y, text: String(pts), timer: 1200 });
        playEatGhost();
      } else if (g.mode !== 'eaten') {
        // Pac dies
        playDeath();
        setState(STATE.DYING);
        return;
      }
    }
  }

  // Score popups timer
  scorePopups = scorePopups.filter(p => {
    p.timer -= dt;
    return p.timer > 0;
  });

  updateHUD();
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  drawMaze();

  if (state === STATE.STARTING) {
    ctx.fillStyle = '#FFD700';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    const countdown = Math.ceil((2500 - stateTimer) / 1000);
    ctx.fillText('READY!', W / 2, H / 2 - 20);
    ctx.fillText(countdown > 0 ? String(countdown) : 'GO!', W / 2, H / 2 + 10);
  }

  if (state === STATE.DYING) {
    // Pac-Man death spin
    const progress = stateTimer / 2000;
    const cx = pac.x * TILE + TILE / 2;
    const cy = pac.y * TILE + TILE / 2;
    const r = TILE / 2 - 1;
    const startAngle = progress * Math.PI;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, Math.PI * 2 - startAngle);
    ctx.closePath();
    ctx.fill();
    for (const g of ghosts) drawGhost(g, g.idx);
    return;
  }

  if (state === STATE.PLAYING || state === STATE.RESPAWN || state === STATE.WIN) {
    drawPacMan(pac);
    for (const g of ghosts) drawGhost(g, g.idx);
    for (const p of scorePopups) drawScorePopup(p);
  }
}

// ─── Game loop ────────────────────────────────────────────────────────────────
let lastTime = null;

function loop(ts) {
  if (!lastTime) lastTime = ts;
  let dt = ts - lastTime;
  lastTime = ts;
  if (dt > 100) dt = 100; // cap delta

  update(dt);
  render();

  requestAnimationFrame(loop);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
initMaze();
pac = makePacMan();
ghosts = [0, 1, 2, 3].map(makeGhost);
updateHUD();
showOverlay('PAC-MAN', '', 'PRESS SPACE TO START');
requestAnimationFrame(loop);
