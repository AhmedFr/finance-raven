import type { ActivityType } from "../../../domain/model.types";

export interface ActivityStepProps {
  value: ActivityType;
  onChange: (value: ActivityType) => void;
}
