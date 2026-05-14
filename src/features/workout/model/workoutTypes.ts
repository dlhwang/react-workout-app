import type { WorkoutSettings } from "../settings/workoutSettings";

export type WorkoutCategory =
  | "shoulder"
  | "push"
  | "pull"
  | "leg"
  | "full-body"
  | "custom";

export type WorkoutDifficulty = "beginner" | "intermediate" | "advanced";

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  memo?: string;
};

export type WorkoutRoutine = {
  id: string;
  name: string;
  description?: string;
  category?: WorkoutCategory;
  difficulty?: WorkoutDifficulty;
  estimatedMinutes?: number;
  exercises: Exercise[];
};

export type WorkoutSessionStatus =
  | "idle"
  | "exercising"
  | "resting"
  | "paused"
  | "completed";

export type ActiveWorkoutSessionStatus = Exclude<WorkoutSessionStatus, "idle" | "completed">;

export type CompletedSet = {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  plannedRestSeconds: number;
  actualRestSeconds?: number;
  restStartedAt?: string;
  restCompletedAt?: string;
};

export type WorkoutSession = {
  routineId: string;
  routineName: string;
  settingsSnapshot: WorkoutSettings;
  currentExerciseIndex: number;
  currentSet: number;
  status: WorkoutSessionStatus;
  startedAt?: string;
  completedAt?: string;
  currentSetStartedAt?: string;
  currentRestStartedAt?: string;
  completedSets: CompletedSet[];
  pausedAt?: string;
  statusBeforePause?: ActiveWorkoutSessionStatus;
  totalPausedSeconds: number;
};

export type PrimaryAction = {
  label: string;
  action: () => void;
};
