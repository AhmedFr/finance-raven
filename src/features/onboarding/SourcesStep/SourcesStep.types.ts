import type { Source } from "../../../domain/model.types";

export interface SourcesStepProps {
  sources: Source[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Source>) => void;
  onRemove: (id: string) => void;
}
