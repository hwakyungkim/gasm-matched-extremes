# Matched generalized ASMs: extremal elements (supplementary code)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23257733.svg)](https://doi.org/10.5281/zenodo.23257733)

Code accompanying the paper

> H. K. Kim, *The extremal elements of the Bruhat lattice of generalized
> alternating sign matrices with matched boundary*, submitted to
> Linear Algebra and its Applications.

The programs check the examples and the main statements of the paper on small
cases. They are plain JavaScript (ES modules) and need only
[Node.js](https://nodejs.org) 18 or later; there are no other dependencies.

| File | Purpose |
|------|---------|
| `hasse-tikz.mjs` | Enumerates a matched class A_{m,n}(u\|v), computes sum-matrices, the arrays hi and lo, the levels of the Bruhat order, the covering pairs, and writes TikZ code for Hasse diagrams. |
| `check-examples.mjs` | Checks Theorem 4.1 (sum-matrices of the extremes are hi and lo) and Theorem 4.7 (the sweep) on all matched classes with m, n <= 5, and recomputes the sizes and ranks quoted in the examples. |
| `onepercol-check.mjs` | Builds I and L from hi and lo and checks Theorem 4.3 (one nonzero entry per column when m <= n) on all matched classes with m + n <= 16. |
| `fig-ex44-bw.mjs` | Produces the TikZ source of Figure 1 (the 41-element lattice of Example 4.4). |

Usage:

```
node check-examples.mjs
node onepercol-check.mjs
node fig-ex44-bw.mjs Figure_1.tex
```

## How to cite

H. K. Kim, *gasm-matched-extremes: supplementary code for the extremal
elements of matched generalized alternating sign matrices*, version 1.0
[software], Zenodo, 2026. https://doi.org/10.5281/zenodo.23257733

Author ORCID: https://orcid.org/0000-0001-7727-9204

## Notation

Boundaries are written as sign words, `+` for +1 and `-` for -1, e.g.
`analyse(P('-+-+-'), P('-+-'))` in `hasse-tikz.mjs`.
