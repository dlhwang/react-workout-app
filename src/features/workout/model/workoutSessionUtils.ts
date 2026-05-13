import type { WorkoutRoutine, WorkoutSession } from "./workoutTypes";

export function getTotalSets(routine: WorkoutRoutine) {
  return routine.exercises.reduce((total, exercise) => total + exercise.sets, 0);
}

export function getCompletedSetCount(session: WorkoutSession | null) {
  return session?.completedSets.length ?? 0;
}

export function getCurrentExercise(routine: WorkoutRoutine, session: WorkoutSession) {
  return routine.exercises[session.currentExerciseIndex];
}

export function getNextExerciseName(routine: WorkoutRoutine, session: WorkoutSession) {
  const currentExercise = getCurrentExercise(routine, session);

  if (session.currentSet < currentExercise.sets) {
    return currentExercise.name;
  }

  return routine.exercises[session.currentExerciseIndex + 1]?.name ?? "운동 완료";
}

export function getUpcomingStep(routine: WorkoutRoutine, session: WorkoutSession) {
  const currentExercise = getCurrentExercise(routine, session);

  if (session.currentSet < currentExercise.sets) {
    return {
      exerciseIndex: session.currentExerciseIndex,
      set: session.currentSet + 1,
      exerciseName: currentExercise.name,
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
  };
}

export function getSessionProgress(routine: WorkoutRoutine, session: WorkoutSession | null) {
  const totalSets = getTotalSets(routine);
  const completedSets = getCompletedSetCount(session);

  if (totalSets === 0) {
    return 0;
  }

  return Math.round((completedSets / totalSets) * 100);
}
