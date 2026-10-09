import type { ReactNode } from "react";
import type { Tone } from "../../domain/model.types";

export interface PillProps {
  tone?: Tone;
  children: ReactNode;
}
