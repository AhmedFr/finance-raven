import { useState } from "react";
import { HairlineFigure } from "../../../components/HairlineFigure";
import { getPilesFigure } from "../pilesFigure";
import { cx } from "../../../lib/cx";
import { FIGURE_LABEL, KEY } from "./FigureTile.constants";
import styles from "./FigureTile.module.css";

/** The Piles figure on a warm tile, with the month under the pointer and a one-line key. */
export function FigureTile() {
  const [month, setMonth] = useState<string | null>(null);
  return (
    <figure className={styles.tile}>
      <span className={styles.read} aria-hidden="true">{month}</span>
      <HairlineFigure figure={getPilesFigure()} label={FIGURE_LABEL} play onRead={setMonth} />
      <figcaption className={styles.caption}>
        <span>Une pile par mois. Touche-en une pour la séparer :</span>
        <ul className={styles.key}>
          {KEY.map(({ label, tone }) => (
            <li key={tone}><span className={cx(styles.swatch, styles[tone])} aria-hidden="true" />{label}</li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
