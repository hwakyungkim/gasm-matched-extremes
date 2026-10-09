// Checks for "The extremal elements of the Bruhat lattice of generalized
// alternating sign matrices with matched boundary".
//
//  (1) Theorem 4.1: for every matched class with m, n <= 5 the minimum and the
//      maximum found by enumerating the class have sum-matrices hi and lo.
//  (2) Theorem 4.7: the sweep of Definition 4.6 returns I and L (m <= n).
//  (3) The sizes and ranks quoted in the examples.
//
// Run with Node.js 18 or later:  node check-examples.mjs
import { P, analyse, bounds, sigma } from './hasse-tikz.mjs';

const bits = (k, t) => { const a = []; for (let j = 0; j < k; j++) a.push((t >> j) & 1 ? 1 : -1); return a; };
const eq = (A, B) => JSON.stringify(A) === JSON.stringify(B);

function sweep(u, v, which) {            // which = 'I' or 'L'
  const n = u.length, m = v.length, r = new Array(m).fill(0);
  const A = Array.from({ length: m }, () => new Array(n).fill(0));
  const rem = { '1': 0, '-1': 0 }; for (const x of u) rem[-x]++;
  for (let j = 0; j < n; j++) {
    const s = -u[j]; let need = 0;
    for (let i = 0; i < m; i++) if (r[i] === 0 && -v[i] === s) need++;
    const d = rem[s] - need; rem[s]--;
    const c = [];
    for (let i = 0; i < m; i++) {
      if (r[i] === 0) { if (-v[i] === s) c.push(i); }
      else if (d >= 1 && v[i] === s) c.push(i);
    }
    if (!c.length) return null;
    const top = (s === 1) === (which === 'I');
    const i = top ? c[0] : c[c.length - 1];
    A[i][j] = s; r[i] += s;
  }
  return A;
}

let classes = 0, bad1 = 0, bad2 = 0;
for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
  for (let tu = 0; tu < (1 << n); tu++) for (let tv = 0; tv < (1 << m); tv++) {
    const u = bits(n, tu), v = bits(m, tv);
    const a = analyse(u, v);
    if (!a.L.length) continue;
    classes++;
    const { hi, lo } = bounds(u, v);
    if (!eq(sigma(a.I), hi) || !eq(sigma(a.Lm), lo)) bad1++;
    if (m <= n && (!eq(sweep(u, v, 'I'), a.I) || !eq(sweep(u, v, 'L'), a.Lm))) bad2++;
  }
}
console.log(`(1) Theorem 4.1 on ${classes} nonempty classes with m,n <= 5: ${bad1} failures`);
console.log(`(2) Theorem 4.7 (sweep) on the classes with m <= n: ${bad2} failures`);

const examples = [
  ['Example 1.3', '---', '---', 7, 4],
  ['Example 4.4', '-+-+-', '-+-', 41, 8],
  ['Example 4.9', '--++--', '--', 8, 3],
  ['Example 5.4', '-+-', '-+-', 7, 4],
  ['Example 5.5', '--+-', '--+-', 52, 9],
  ['Example 5.6', '++---', '++---', 14, 5],
  ['Example 5.8', '--++---', '---', 119, 10],
];
for (const [name, u, v, size, rank] of examples) {
  const a = analyse(P(u), P(v));
  const ok = a.L.length === size && a.R === rank;
  console.log(`(3) ${name}: u=${u} v=${v}: |A| = ${a.L.length}, rank ${a.R} ${ok ? 'OK' : 'MISMATCH (expected ' + size + ', ' + rank + ')'}`);
}
