export type WorkoutSettings = {
  globalRestSeconds: number;
};

export const DEFAULT_WORKOUT_SETTINGS: WorkoutSettings = {
  globalRestSeconds: 90,
};

export const MIN_REST_SECONDS = 10;
export const MAX_REST_SECONDS = 600;

export function normalizeRestSeconds(value: unknown) {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isFinite(numericValue)) {
    return DEFAULT_WORKOUT_SETTINGS.globalRestSeconds;
  }

  return Math.min(MAX_REST_SECONDS, Math.max(MIN_REST_SECONDS, Math.round(numericValue)));
}

export function normalizeWorkoutSettings(value: Partial<WorkoutSettings> | null | undefined) {
  return {
    globalRestSeconds: normalizeRestSeconds(
      value?.globalRestSeconds ?? DEFAULT_WORKOUT_SETTINGS.globalRestSeconds,
    ),
  };
}
