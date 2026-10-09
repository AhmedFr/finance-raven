export const CHART = { width: 720, height: 240, left: 52, right: 8, top: 10, bottom: 26 } as const;
export const SCALE_FLOOR = 1000;
export const SEGMENTS = [
  { kind: "received", part: "net", className: "net", opacity: 1 },
  { kind: "received", part: "reserve", className: "reserve", opacity: 1 },
  { kind: "planned", part: "net", className: "net", opacity: 0.35 },
  { kind: "planned", part: "reserve", className: "reserve", opacity: 0.35 },
] as const;
