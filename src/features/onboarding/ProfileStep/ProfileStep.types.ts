import type { Profile } from "../../../domain/model.types";

export interface ProfileStepProps {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}
