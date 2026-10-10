import { useState } from "react";
import type { CumulativeChartProps } from "./CumulativeChart.types";
import { formatEur, MONTHS_SHORT } from "../../domain/format/format";
import { cx } from "../../lib/cx";
import { buildScale, formatTick, tooltipEdge } from "../BarChart/BarChart.utils";
import { CUMUL_CHART, DOT_RADIUS, LABELLED_MONTHS } from "./CumulativeChart.constants";
import { receivedEnd, toAreaPath, toPath } from "./CumulativeChart.utils";
import styles from "./CumulativeChart.module.css";

const { width: W, height: H, left: L, right: R, top: T, bottom: B } = CUMUL_CHART;
const innerW = W - L - R;
const innerH = H - T - B;
const slot = innerW / 12;
const xOf = (i: number) => L + (i + 0.5) * slot;

export function CumulativeChart({ points, year, todayMonth }: CumulativeChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const { step, top } = buildScale(Math.max(0, ...points.map((p) => p.projected), ...points.map((p) => p.received)));
  const yOf = (v: number) => T + innerH - (v / top) * innerH;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const gridTicks = ticks.length > 4 ? ticks.filter((_, i) => i % 2 === 0) : ticks;

  const end = receivedEnd(points, todayMonth);
  const received = points.slice(0, end + 1).map((p) => ({ x: xOf(p.month), y: yOf(p.received) }));
  const hasProjection = points.some((p) => p.projected > p.received);
  const projected = !hasProjection || end >= 11
    ? []
    : end < 0
      ? points.map((p) => ({ x: xOf(p.month), y: yOf(p.projected) }))
      : [received[end], ...points.slice(end + 1).map((p) => ({ x: xOf(p.month), y: yOf(p.projected) }))];
  const today = todayMonth != null && points[todayMonth] ? { x: xOf(todayMonth), y: yOf(points[todayMonth].received) } : null;

  const hovered = hover == null ? null : points[hover];
  const edge = hover == null ? "center" : tooltipEdge(hover);
  const tipClass = edge === "start" ? styles.tipStart : edge === "end" ? styles.tipEnd : undefined;

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Net cumulé ${year}`} onPointerLeave={() => setHover(null)}>
        {gridTicks.map((v) => (
          <g key={v}>
            <line className={styles.grid} x1={L} x2={W - R} y1={yOf(v)} y2={yOf(v)} />
            <text className={styles.tick} x={L - 6} y={yOf(v) + 4} textAnchor="end">{formatTick(v)}</text>
          </g>
        ))}
        {LABELLED_MONTHS.map((i) => (
          <text key={`label-${i}`} className={styles.tick} x={xOf(i)} y={H - 8} textAnchor="middle">{MONTHS_SHORT[i]}</text>
        ))}
        {received.length > 1 && <path className={styles.area} d={toAreaPath(received, yOf(0))} />}
        {received.length > 1 && <path className={styles.line} d={toPath(received)} />}
        {projected.length > 1 && <path className={styles.projected} d={toPath(projected)} />}
        {hover != null && <line className={styles.cross} x1={xOf(hover)} x2={xOf(hover)} y1={T} y2={T + innerH} />}
        {today && <circle className={styles.dot} cx={today.x} cy={today.y} r={DOT_RADIUS} />}
        {points.map((p, i) => (
          <rect key={`hit-${p.month}`} x={L + i * slot} y={0} width={slot} height={H - B} fill="transparent" onPointerEnter={() => setHover(i)} onClick={() => setHover(i)} />
        ))}
      </svg>
      {hovered && hover != null && (
        <div className={cx(styles.tip, tipClass)} style={{ left: `${(xOf(hover) / W) * 100}%` }}>
          <b>{MONTHS_SHORT[hovered.month]} {year}</b><br />
          Net cumulé <span className="num">{formatEur(hovered.received)}</span>
          {Math.round(hovered.projected * 100) !== Math.round(hovered.received * 100) && <><br />avec prévus <span className="num">{formatEur(hovered.projected)}</span></>}
        </div>
      )}
      <table className="visually-hidden">
        <caption>Net cumulé {year} par mois</caption>
        <thead>
          <tr>
            <th scope="col">Mois</th>
            <th scope="col">Reçu</th>
            <th scope="col">Avec prévus</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.month}>
              <th scope="row">{MONTHS_SHORT[p.month]}</th>
              <td>{formatEur(p.received)}</td>
              <td>{formatEur(p.projected)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
