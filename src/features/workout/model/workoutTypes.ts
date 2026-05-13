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

export type CompletedSet = {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  completedAt: string;
};

export type WorkoutSession = {
  routineId: string;
  routineName: string;
  currentExerciseIndex: number;
  currentSet: number;
  status: WorkoutSessionStatus;
  completedSets: CompletedSet[];
  startedAt: string;
  completedAt?: string;
};
