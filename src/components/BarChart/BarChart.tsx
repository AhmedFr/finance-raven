import { useState } from "react";
import type { BarChartProps } from "./BarChart.types";
import { formatEur, MONTHS_SHORT } from "../../domain/format/format";
import { CHART } from "./BarChart.constants";
import { barSegments, buildScale, formatTick, totalOf } from "./BarChart.utils";
import { cx } from "../../lib/cx";
import styles from "./BarChart.module.css";

const { width: W, height: H, left: L, right: R, top: T, bottom: B } = CHART;
const innerW = W - L - R;
const innerH = H - T - B;
const slot = innerW / 12;
const barW = Math.min(30, slot * 0.6);

export function BarChart({ data, year }: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const totals = data.map(totalOf);
  const { step, top } = buildScale(Math.max(0, ...totals));
  const yOf = (v: number) => T + innerH - (v / top) * innerH;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const hovered = hover != null && totals[hover] > 0 ? data[hover] : null;
  const leftPct = hover == null ? 0 : ((L + (hover + 0.5) * slot) / W) * 100;
  const edge = hover == null ? "center" : hover < 2 ? "start" : hover > 9 ? "end" : "center";
  const tipClass = edge === "start" ? styles.tipStart : edge === "end" ? styles.tipEnd : undefined;

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Encaissements ${year} par mois : net et réserve`} onPointerLeave={() => setHover(null)}>
        {ticks.map((v) => (
          <g key={v}>
            <line className={styles.grid} x1={L} x2={W - R} y1={yOf(v)} y2={yOf(v)} />
            <text className={styles.tick} x={L - 6} y={yOf(v) + 4} textAnchor="end">{formatTick(v)}</text>
          </g>
        ))}
        {data.map((d, i) =>
          barSegments(d, L + i * slot + (slot - barW) / 2, barW, yOf).map((s) => (
            <path key={`${d.month}-${s.key}`} d={s.path} className={styles[s.className]} fillOpacity={s.opacity} />
          )),
        )}
        {data.map((d, i) => (
          <text key={`label-${d.month}`} className={styles.tick} x={L + i * slot + slot / 2} y={H - 8} textAnchor="middle">{MONTHS_SHORT[d.month]}</text>
        ))}
        {data.map((d, i) => (
          <rect key={`hit-${d.month}`} x={L + i * slot} y={T} width={slot} height={innerH} fill="transparent" onPointerEnter={() => setHover(i)} onClick={() => setHover(i)} />
        ))}
      </svg>
      {hovered && hover != null && (
        <div className={cx(styles.tip, tipClass)} style={{ left: `${leftPct}%`, top: `${(yOf(totals[hover]) / H) * 100}%` }}>
          <b>{MONTHS_SHORT[hovered.month]} {year}</b><br />
          CA <span className="num">{formatEur(totals[hover])}</span><br />
          Net <span className="num">{formatEur(hovered.received.net + hovered.planned.net)}</span> · Réserve <span className="num">{formatEur(hovered.received.reserve + hovered.planned.reserve)}</span>
          {hovered.planned.net + hovered.planned.reserve > 0 && <><br />dont prévu <span className="num">{formatEur(hovered.planned.net + hovered.planned.reserve)}</span></>}
        </div>
      )}
      <table className="visually-hidden">
        <caption>Encaissements {year} par mois</caption>
        <thead>
          <tr>
            <th scope="col">Mois</th>
            <th scope="col">Net</th>
            <th scope="col">Réserve</th>
            <th scope="col">Prévu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <th scope="row">{MONTHS_SHORT[d.month]}</th>
              <td>{formatEur(d.received.net + d.planned.net)}</td>
              <td>{formatEur(d.received.reserve + d.planned.reserve)}</td>
              <td>{formatEur(d.planned.net + d.planned.reserve)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
