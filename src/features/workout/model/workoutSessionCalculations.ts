import type { WorkoutRoutine, WorkoutSession } from "./workoutTypes";

function toTime(value?: string) {
  return value ? new Date(value).getTime() : undefined;
}

function diffSeconds(start?: string, end?: string | Date) {
  const startTime = toTime(start);

  if (!startTime) {
    return 0;
  }

  const endTime = end instanceof Date ? end.getTime() : toTime(end) ?? Date.now();
  return Math.max(0, Math.floor((endTime - startTime) / 1000));
}

function getEffectiveNow(session: WorkoutSession, now = new Date()) {
  if (session.status === "completed" && session.completedAt) {
    return new Date(session.completedAt);
  }

  if (session.status === "paused" && session.pausedAt) {
    return new Date(session.pausedAt);
  }

  return now;
}

export function getTotalWorkoutElapsedSeconds(session: WorkoutSession | null, now = new Date()) {
  if (!session?.startedAt) {
    return 0;
  }

  return Math.max(
    0,
    diffSeconds(session.startedAt, getEffectiveNow(session, now)) - session.totalPausedSeconds,
  );
}

export function getCurrentSetElapsedSeconds(session: WorkoutSession | null, now = new Date()) {
  if (!session?.currentSetStartedAt) {
    return 0;
  }

  if (
    session.status !== "exercising" &&
    !(session.status === "paused" && session.statusBeforePause === "exercising")
  ) {
    return 0;
  }

  return diffSeconds(session.currentSetStartedAt, getEffectiveNow(session, now));
}

export function getTotalExerciseElapsedSeconds(
  session: WorkoutSession | null,
  exerciseId: string,
) {
  if (!session) {
    return 0;
  }

  return session.completedSets
    .filter((set) => set.exerciseId === exerciseId)
    .reduce((total, set) => total + set.durationSeconds, 0);
}

export function getTotalRestElapsedSeconds(session: WorkoutSession | null, now = new Date()) {
  if (!session) {
    return 0;
  }

  const completedRestSeconds = session.completedSets.reduce(
    (total, set) => total + (set.actualRestSeconds ?? 0),
    0,
  );

  return completedRestSeconds + getCurrentRestElapsedSeconds(session, now);
}

export function getCurrentRestRemainingSeconds(
  session: WorkoutSession | null,
  routine: WorkoutRoutine,
  now = new Date(),
) {
  if (!session?.currentRestStartedAt) {
    return 0;
  }

  const currentExercise = routine.exercises[session.currentExerciseIndex];
  if (!currentExercise) {
    return 0;
  }

  return Math.max(0, currentExercise.restSeconds - getCurrentRestElapsedSeconds(session, now));
}

export function getCurrentRestElapsedSeconds(session: WorkoutSession | null, now = new Date()) {
  if (!session?.currentRestStartedAt) {
    return 0;
  }

  if (
    session.status !== "resting" &&
    !(session.status === "paused" && session.statusBeforePause === "resting")
  ) {
    return 0;
  }

  return diffSeconds(session.currentRestStartedAt, getEffectiveNow(session, now));
}

export function getCompletedSetCount(session: WorkoutSession | null) {
  return session?.completedSets.length ?? 0;
}

export function getTotalSetCount(routine: WorkoutRoutine) {
  return routine.exercises.reduce((total, exercise) => total + exercise.sets, 0);
}

export function getWorkoutProgressPercent(session: WorkoutSession | null, routine: WorkoutRoutine) {
  const totalSets = getTotalSetCount(routine);

  if (totalSets === 0) {
    return 0;
  }

  return Math.round((getCompletedSetCount(session) / totalSets) * 100);
}

export function getCurrentExercise(routine: WorkoutRoutine, session: WorkoutSession) {
  return routine.exercises[session.currentExerciseIndex];
}

export function getNextStep(routine: WorkoutRoutine, session: WorkoutSession) {
  const currentExercise = getCurrentExercise(routine, session);

  if (session.currentSet < currentExercise.sets) {
    return {
      exerciseIndex: session.currentExerciseIndex,
      set: session.currentSet + 1,
      exerciseName: currentExercise.name,
      exerciseSets: currentExercise.sets,
    };
  }

  const nextExercise = routine.exercises[session.currentExerciseIndex + 1];

  if (!nextExercise) {
    return null;
  }

  return {
    exerciseIndex: session.currentExerciseIndex + 1,
    set: 1,
    exerciseName: nextExercise.name,
    exerciseSets: nextExercise.sets,
  };
}
