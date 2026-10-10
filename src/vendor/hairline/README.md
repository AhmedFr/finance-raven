# Hairline

Isometric line figures from [Hairline](https://github.com/lucasmarkes/hairline) by Lucas Marques, MIT licence (see `LICENSE`).

- `kernel.js`: the engine, copied unchanged from the `hairline-create` skill. Do not edit it.
- `piles.js`: the landing page's figure, written with `hairline-create` and checked with its `look.mjs`.

Both are loaded as text by `src/components/HairlineFigure/loadFigure.ts`. To change the figure, edit `piles.js`
and run the skill's `look.mjs` on it again.
