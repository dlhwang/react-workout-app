import { workoutRoutines } from "../../../routines";
import { localStorageClient } from "../../../shared/storage/localStorageClient";
import type { Exercise, WorkoutRoutine } from "../model/workoutTypes";

const CUSTOM_ROUTINES_KEY = "workout:customRoutines";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `routine-${Date.now()}`;
}

function normalizeExercise(exercise: Exercise, index: number): Exercise {
  return {
    id: exercise.id || createId(),
    name: exercise.name.trim() || `운동 ${index + 1}`,
    sets: Math.max(1, Math.floor(Number(exercise.sets) || 1)),
    reps: exercise.reps.trim() || "-",
    restSeconds: Math.max(0, Math.floor(Number(exercise.restSeconds) || 0)),
    memo: exercise.memo?.trim() || undefined,
  };
}

function normalizeRoutine(routine: WorkoutRoutine): WorkoutRoutine {
  return {
    ...routine,
    name: routine.name.trim() || "이름 없는 루틴",
    description: routine.description?.trim() || undefined,
    category: "custom",
    exercises: routine.exercises.map(normalizeExercise),
  };
}

function cloneRoutine(routine: WorkoutRoutine): WorkoutRoutine {
  return {
    ...routine,
    exercises: routine.exercises.map((exercise) => ({ ...exercise })),
  };
}

export const workoutRoutinesManager = {
  getStaticRoutines() {
    return workoutRoutines.map(cloneRoutine);
  },

  getCustomRoutines() {
    return localStorageClient.get<WorkoutRoutine[]>(CUSTOM_ROUTINES_KEY)?.map(cloneRoutine) ?? [];
  },

  getAllRoutines() {
    return [...this.getStaticRoutines(), ...this.getCustomRoutines()];
  },

  getRoutineById(routineId: string) {
    return this.getAllRoutines().find((routine) => routine.id === routineId) ?? null;
  },

  isStaticRoutine(routineId: string) {
    return workoutRoutines.some((routine) => routine.id === routineId);
  },

  isCustomRoutine(routineId: string) {
    return this.getCustomRoutines().some((routine) => routine.id === routineId);
  },

  createCustomCopy(routine: WorkoutRoutine): WorkoutRoutine {
    return normalizeRoutine({
      ...cloneRoutine(routine),
      id: createId(),
      name: `${routine.name} 복사본`,
    });
  },

  saveCustomRoutine(newRoutine: WorkoutRoutine) {
    const safeRoutine = normalizeRoutine({
      ...newRoutine,
      id: newRoutine.id && !this.isStaticRoutine(newRoutine.id) ? newRoutine.id : createId(),
    });
    const customRoutines = this.getCustomRoutines();
    const existingIndex = customRoutines.findIndex((routine) => routine.id === safeRoutine.id);
    const nextRoutines =
      existingIndex >= 0
        ? customRoutines.map((routine) => (routine.id === safeRoutine.id ? safeRoutine : routine))
        : [...customRoutines, safeRoutine];

    localStorageClient.set(CUSTOM_ROUTINES_KEY, nextRoutines);
    return cloneRoutine(safeRoutine);
  },

  deleteCustomRoutine(routineId: string) {
    const nextRoutines = this
      .getCustomRoutines()
      .filter((routine) => routine.id !== routineId);
    localStorageClient.set(CUSTOM_ROUTINES_KEY, nextRoutines);
  },
};
