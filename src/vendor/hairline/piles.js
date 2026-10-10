/**
 * Piles: twelve stacks of coins on a long tray, one per month, rising as the
 * year's net piles up. The stack under the pointer comes apart into its three
 * slices: what is yours at the foot (the bright one), the URSSAF share, and
 * the tax on top. Its neighbours part, staggered outwards from it. At rest
 * October is already split a little: the eye starts there. The slider is the
 * gap between slices, in world units.
 *
 * The pattern: discrete items, as Riffle. Tweens, a stagger by distance, and
 * a hit test on each stack's rest column, so a slice lifting out from under
 * the pointer cannot change the choice.
 */
const {
  Cam, circ, facing, fit, open, prism, proj, rings, ringAt, run,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 12, R = 6.6, PITCH = 17, T = 3.4, PB = 5, STEP = 45, PART = 4, REST_I = 9, REST_SHARE = 0.4, GAP_MAX = 14;
const COINS = [3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13];
/** Each slice's group is named, so a page may style the split stack; the figure itself sets no colour. */
const ROLES = ["net", "urssaf", "tax"];
const MONTHS = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];

/** Where stack i stands along the tray: January nearest, December farthest. */
const Y = (i) => (N - 1 - i) * PITCH;

/** A stack's three slices, foot to top, in coins: what is yours, the URSSAF share, the tax. */
function slices(n) {
  const urs = Math.max(1, Math.round(n * 0.24));
  return [n - urs - 1, urs, 1];
}

/** A ring of samples moved to (x, y). */
const at = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;

  // Fitted to the tray and to December split at the widest gap, so no pose leaves the frame.
  const C = Cam(45, 0.5, 1.62), TOP = COINS[N - 1] * T + 2 * GAP_MAX;
  fit(C, [[-R - 5, -R - 5, -PB], [R + 5, Y(0) + R + 5, -PB], [-R - 5, Y(0) + R + 5, 0], [R + 5, -R - 5, 0], [-R, 0, TOP], [R, 0, TOP]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-R - 5, -R - 5, R + 5, Y(0) + R + 5, 7, 1.6);
  put(solid(g), prism(P, front, tr, ti, -PB, 0));

  // December first: appending from the far end of the tray is painting back to front.
  const disc = circ(R, 24), rim = circ(R - 1.2, 24), stacks = [];
  for (let i = N - 1; i >= 0; i--) {
    const counts = slices(COINS[i]);
    const parts = counts.map((_, k) => {
      const s = solid(g);
      s.g.classList.add(ROLES[k]);
      return { s, seams: mk("path", { class: "nf lo" }, s.g) };
    });
    stacks[i] = { counts, parts, lift: tween(i === REST_I ? gap * REST_SHARE : 0), dy: tween(0), drawn: "" };
  }
  /** Stack i is the split one: its foot takes the bright stroke, and its groups say so with `split`. */
  const mark = (st, on) => {
    st.parts[0].s.sil.classList.toggle("hi", on);
    st.parts.forEach((part) => part.s.g.classList.toggle("split", on));
  };
  mark(stacks[REST_I], true);

  /** Stack i at its current lift and offset; a stack that has not moved keeps its paths. */
  function draw(st, i, now) {
    const lift = tval(st.lift, now), dy = tval(st.dy, now), key = lift.toFixed(2) + "," + dy.toFixed(2);
    if (key === st.drawn) return;
    st.drawn = key;
    const y = Y(i) + dy, ring = at(disc, 0, y), inner = at(rim, 0, y), face = run(ring, front);
    let below = 0;
    st.counts.forEach((c, k) => {
      const z0 = below * T + k * lift, part = st.parts[k];
      put(part.s, prism(P, front, ring, inner, z0, z0 + c * T));
      let d = "";
      for (let m = 1; m < c; m++) d += open(ringAt(P, face, z0 + m * T));
      part.seams.setAttribute("d", d);
      below += c;
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    stacks.forEach((st, i) => { draw(st, i, now); if (!tdone(st.lift, now) || !tdone(st.dy, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // Hit columns: each stack's rest centre on screen, from the tray up to its top at the widest gap. They never move.
  const foot = COINS.map((_, i) => P(0, Y(i), 0));
  const half = Math.abs(foot[1][0] - foot[0][0]) / 2;
  const low = COINS.map((_, i) => P(0, Y(i) + R, -PB)[1] + 4);
  const high = COINS.map((n, i) => P(0, Y(i) - R, n * T + 2 * GAP_MAX)[1] - 4);

  /** The stack whose rest column holds the point; -1 outside. */
  function hit([sx, sy]) {
    let a = -1, best = Infinity;
    foot.forEach((p, i) => { const d = Math.abs(sx - p[0]); if (d < best) { best = d; a = i; } });
    return best <= half && sy <= low[a] && sy >= high[a] ? a : -1;
  }

  let act = -1;
  /** Splits stack a (-1 goes back to rest). The stagger spreads out from the stack chosen, or the one let go. */
  function setActive(a, again) {
    if (a === act && !again) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : REST_I;
    act = a;
    stacks.forEach((st, i) => {
      const delay = Math.abs(i - from) * STEP;
      const lift = a < 0 ? (i === REST_I ? gap * REST_SHARE : 0) : i === a ? gap : 0;
      const reach = a < 0 || i === a ? 0 : Math.max(0, 1 - (Math.abs(i - a) - 1) / 3);
      tset(st.lift, lift, now, delay);
      tset(st.dy, Math.sign(a - i) * PART * reach, now, delay);
      mark(st, a < 0 ? i === REST_I : i === a);
    });
    read.textContent = a < 0 ? "rest" : MONTHS[a];
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { gap = v; setActive(act, true); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "piles",
  means: "Twelve months of coins on a tray: the stack under the pointer splits into what is yours, the URSSAF share and the tax.",
  rules: [1, 2, 4, 5],
  range: [6, 10, 14],
  tour: [[132, 228], [210, 181], [288, 130], null],
  mount,
});
