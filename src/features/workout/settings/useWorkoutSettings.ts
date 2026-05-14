import { useCallback, useState } from "react";
import { normalizeWorkoutSettings, type WorkoutSettings } from "./workoutSettings";
import { workoutSettingsStorage } from "./workoutSettingsStorage";

export function useWorkoutSettings() {
  const [settings, setSettings] = useState<WorkoutSettings>(() => workoutSettingsStorage.get());

  const saveSettings = useCallback((nextSettings: WorkoutSettings) => {
    const normalizedSettings = normalizeWorkoutSettings(nextSettings);
    workoutSettingsStorage.set(normalizedSettings);
    setSettings(normalizedSettings);
    return normalizedSettings;
  }, []);

  return {
    settings,
    saveSettings,
  };
}
