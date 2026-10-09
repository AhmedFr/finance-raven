import type { ActivityPreset, ActivityRates, ActivityType, Profile } from "../model.types";
import { ACTIVITY_PRESETS } from "./rules.constants";

export const getPreset = (activity: ActivityType): ActivityPreset => ACTIVITY_PRESETS[activity];

export function getRates(profile: Profile): ActivityRates {
  const { cotisRate, cfpRate, vflRate, abattementRate } = getPreset(profile.activity);
  return { cotisRate, cfpRate, vflRate, abattementRate, ...profile.rateOverrides };
}
