import type { Source } from "../../../domain/model.types";
import type { SourceInput } from "../../../store/appStore.types";

export interface SourceRowProps {
  source: Source;
  onChange: (patch: Partial<SourceInput>) => void;
  onDelete: () => void;
}
