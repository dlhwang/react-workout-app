import { localStorageClient } from "../../../shared/storage/localStorageClient";
import {
  DEFAULT_WORKOUT_SETTINGS,
  normalizeWorkoutSettings,
  type WorkoutSettings,
} from "./workoutSettings";

const WORKOUT_SETTINGS_STORAGE_KEY = "workout.settings";

export const workoutSettingsStorage = {
  get() {
    const storedSettings = localStorageClient.get<Partial<WorkoutSettings>>(
      WORKOUT_SETTINGS_STORAGE_KEY,
    );

    return normalizeWorkoutSettings(storedSettings ?? DEFAULT_WORKOUT_SETTINGS);
  },

  set(settings: WorkoutSettings) {
    localStorageClient.set(WORKOUT_SETTINGS_STORAGE_KEY, normalizeWorkoutSettings(settings));
  },
};
