// Matched classes A_{m,n}(u|v): enumeration, Sigma, levels, covers, and
// TikZ Hasse diagrams (barycentric level ordering). Used for the figures of
// gasm_match_01 / gasm_rank_01 / gasm_count_01.
//
//   import {P, analyse, hasse} from './hasse-tikz.mjs'
//   hasse('-+-+-', '-+-', {mode:'mat'|'dots', dx, dy, labelIL, ...}).tex
//
// Orientation: I (minimum, largest Sigma) at the bottom, L at the top.
export const P = (s) => [...s].map((c) => (c === '+' ? 1 : -1));
export const s2 = (x) => x.map((e) => (e > 0 ? '+' : '-')).join('');

function altRows(n, a, b) {
  const out = [], r = new Array(n);
  const rec = (j, last) => {
    if (j === n) { if (last !== 0 && b * last !== -1) return; out.push(r.slice()); return; }
    for (const x of [0, 1, -1]) {
      if (x !== 0 && last !== 0 && x * last !== -1) continue;
      r[j] = x; rec(j + 1, x !== 0 ? x : last);
    }
  };
  rec(0, a); return out;
}
export function enumerate(u, v) {
  const n = u.length, m = v.length, cache = {}, rows = [], out = [];
  const dfs = (i, col) => {
    if (i === m) { for (let j = 0; j < n; j++) if (col[j] * u[j] !== -1) return; out.push(rows.map((r) => r.slice())); return; }
    const C = cache[v[i]] || (cache[v[i]] = altRows(n, v[i], v[i]));
    outer: for (const r of C) {
      const nx = col.slice();
      for (let j = 0; j < n; j++) if (r[j] !== 0) { if (r[j] * nx[j] === 1) continue outer; nx[j] = r[j]; }
      rows[i] = r; dfs(i + 1, nx);
    }
  };
  dfs(0, u.slice()); return out;
}
export const sigma = (A) => { const m = A.length, n = A[0].length, S = [];
  for (let i = 0; i < m; i++) { S.push([]); for (let j = 0; j < n; j++)
    S[i].push(A[i][j] + (i ? S[i - 1][j] : 0) + (j ? S[i][j - 1] : 0) - (i && j ? S[i - 1][j - 1] : 0)); }
  return S; };
const sum2 = (S) => S.flat().reduce((a, b) => a + b, 0);
export function bounds(u, v) {
  const n = u.length, m = v.length;
  const pref = (x, s) => { const o = [0]; for (const e of x) o.push(o[o.length - 1] + (e === s ? 1 : 0)); return o; };
  const uM = pref(u, -1), uP = pref(u, 1), vM = pref(v, -1), vP = pref(v, 1);
  const Up = uP[n], Um = uM[n], Vp = vP[m], Vm = vM[m], hi = [], lo = [];
  for (let i = 1; i <= m; i++) { const h = [], l = [];
    for (let j = 1; j <= n; j++) { const Uj = uM[j] - uP[j], Vi = vM[i] - vP[i];
      h.push(Math.min(uM[j], vM[i], Vi + (Up - uP[j]), Uj + (Vp - vP[i])));
      l.push(Math.max(-uP[j], -vP[i], Vi - (Um - uM[j]), Uj - (Vm - vM[i]))); }
    hi.push(h); lo.push(l); }
  return { hi, lo };
}
export function analyse(u, v) {
  const L = enumerate(u, v);
  if (!L.length) return { L, level: [], R: -1, edges: [], sizes: [], I: null, Lm: null, Ik: -1, Lk: -1 };
  const rho = L.map((A) => sum2(sigma(A))), top = Math.max(...rho);
  const level = rho.map((r) => top - r), R = Math.max(...level);
  const key = (A) => A.map((r) => r.join(',')).join(';'), idx = {};
  L.forEach((A, k) => (idx[key(A)] = k));
  const m = v.length, n = u.length, edges = [];
  L.forEach((A, k) => { for (let p = 0; p + 1 < m; p++) for (let q = 0; q + 1 < n; q++) {
    if (A[p][q] === 1 || A[p][q + 1] === -1 || A[p + 1][q] === -1 || A[p + 1][q + 1] === 1) continue;
    const Z = A.map((r) => r.slice()); Z[p][q]++; Z[p][q + 1]--; Z[p + 1][q]--; Z[p + 1][q + 1]++;
    const t = idx[key(Z)]; if (t !== undefined) edges.push([t, k]); } });
  const sizes = new Array(R + 1).fill(0); level.forEach((l) => sizes[l]++);
  const Ik = level.indexOf(0), Lk = level.indexOf(R);
  return { L, level, R, edges, sizes, I: L[Ik], Lm: L[Lk], Ik, Lk };
}
function layout(a, passes = 8) {
  const { L, level, R, edges } = a, N = L.length, by = {};
  for (let k = 0; k < N; k++) (by[level[k]] = by[level[k]] || []).push(k);
  const keys = L.map((A) => A.map((r) => r.join(',')).join(';'));
  const below = {}, above = {};
  edges.forEach(([lo, up]) => { (below[up] = below[up] || []).push(lo); (above[lo] = above[lo] || []).push(up); });
  const ord = {}; (by[0] || []).forEach((k, t) => (ord[k] = t));
  const bary = (k, tbl) => { const nb = tbl[k] || []; let s = 0, c = 0;
    nb.forEach((j) => { if (ord[j] !== undefined) { s += ord[j]; c++; } }); return c ? s / c : 1e9; };
  const cmp = (tbl) => (x, y) => (bary(x, tbl) - bary(y, tbl)) || (keys[x] < keys[y] ? -1 : 1);
  for (let p = 0; p < passes; p++) {
    for (let l = 1; l <= R; l++) { by[l].sort(cmp(below)); by[l].forEach((k, t) => (ord[k] = t)); }
    for (let l = R - 1; l >= 0; l--) { by[l].sort(cmp(above)); by[l].forEach((k, t) => (ord[k] = t)); }
  }
  const xy = new Array(N);
  for (const l in by) by[l].forEach((k, t) => (xy[k] = [t - (by[l].length - 1) / 2, +l]));
  return { xy, by };
}
const B = String.fromCharCode(92);
const glyph = (x) => (x === 1 ? '+' : x === -1 ? '-' : B + 'cdot');
const matNode = (A) => '$' + B + 'begin{smallmatrix}' + A.map((r) => r.map(glyph).join('&')).join(B + B) + B + 'end{smallmatrix}$';
// opts: mode 'mat'|'dots', dx, dy, scale, labelIL, levels, nodeStyle(k,A) -> extra tikz options
export function hasse(u, v, o = {}) {
  const uu = typeof u === 'string' ? P(u) : u, vv = typeof v === 'string' ? P(v) : v;
  const a = analyse(uu, vv), { xy } = layout(a);
  const dx = o.dx ?? 0.42, dy = o.dy ?? 0.5, out = [];
  out.push(B + 'begin{tikzpicture}[scale=' + (o.scale ?? 1) + ']');
  const pt = (k) => `(${(xy[k][0] * dx).toFixed(3)},${(xy[k][1] * dy).toFixed(3)})`;
  const ec = o.edge ?? 'black!45', lw = o.lw ?? '0.6pt';
  if (o.mode === 'mat') {
    const style = (k) => 'draw,rounded corners=2pt,inner sep=1.5pt,fill=white,font=' + B + 'scriptsize' +
      (o.nodeStyle ? o.nodeStyle(k, a.L[k], a) : '');
    a.L.forEach((A, k) => out.push(`${B}node[${style(k)}] (N${k}) at ${pt(k)} {${matNode(A)}};`));
    a.edges.forEach(([s, t]) => out.push(`${B}draw[${ec},line width=${lw}] (N${s}) -- (N${t});`));
    a.L.forEach((A, k) => out.push(`${B}node[${style(k)}] at ${pt(k)} {${matNode(A)}};`));
    if (o.labelIL) {
      out.push(`${B}node[font=${B}small,anchor=west] at ([xshift=2pt]N${a.Ik}.east) {$I$};`);
      out.push(`${B}node[font=${B}small,anchor=west] at ([xshift=2pt]N${a.Lk}.east) {$L$};`);
    }
  } else {
    a.edges.forEach(([s, t]) => out.push(`${B}draw[${ec},line width=${lw}] ${pt(s)} -- ${pt(t)};`));
    a.L.forEach((A, k) => { const col = k === a.Ik ? 'green!55!black' : k === a.Lk ? 'red!70!black' : 'black!75';
      const r = (k === a.Ik || k === a.Lk) ? (o.r ?? 0.075) * 1.5 : (o.r ?? 0.075);
      out.push(`${B}fill[${col}] ${pt(k)} circle (${r});`); });
  }
  if (o.levels) {
    const w = Math.max(...Object.values(layout(a).by).map((x) => x.length));
    for (let l = 0; l <= a.R; l++)
      out.push(`${B}node[font=${B}scriptsize,gray] at (${(-(w - 1) / 2 * dx - (o.levelGap ?? 0.9)).toFixed(2)},${(l * dy).toFixed(3)}) {$${B}rho=${l}$};`);
  }
  out.push(B + 'end{tikzpicture}');
  return { tex: out.join('\n'), size: a.L.length, rank: a.R, sizes: a.sizes, analysis: a };
}
