import type { CompletedSet, WorkoutRoutine, WorkoutSession } from "./workoutTypes";
import type { WorkoutSettings } from "../settings/workoutSettings";
import { getCurrentExercise, getNextStep } from "./workoutSessionCalculations";

function secondsBetween(start: string, end: string) {
  return Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000));
}

function shiftIso(value: string | undefined, seconds: number) {
  if (!value) {
    return undefined;
  }

  return new Date(new Date(value).getTime() + seconds * 1000).toISOString();
}

export function createInitialSession(
  routine: WorkoutRoutine,
  settingsSnapshot: WorkoutSettings,
  nowIso: string,
): WorkoutSession {
  return {
    routineId: routine.id,
    routineName: routine.name,
    routineSnapshot: {
      ...routine,
      exercises: routine.exercises.map((exercise) => ({ ...exercise })),
    },
    settingsSnapshot,
    currentExerciseIndex: 0,
    currentSet: 1,
    status: "exercising",
    startedAt: nowIso,
    currentSetStartedAt: nowIso,
    completedSets: [],
    totalPausedSeconds: 0,
  };
}

export function completeCurrentSetTransition(
  session: WorkoutSession,
  routine: WorkoutRoutine,
  nowIso: string,
) {
  const currentExercise = getCurrentExercise(routine, session);
  const plannedRestSeconds = session.settingsSnapshot.globalRestSeconds;
  const completedSet: CompletedSet = {
    exerciseId: currentExercise.id,
    exerciseName: currentExercise.name,
    setNumber: session.currentSet,
    startedAt: session.currentSetStartedAt ?? nowIso,
    completedAt: nowIso,
    durationSeconds: secondsBetween(session.currentSetStartedAt ?? nowIso, nowIso),
    plannedRestSeconds,
  };

  const completedSets = [...session.completedSets, completedSet];
  const isSessionCompleted = completedSets.length >= getTotalSetCount(routine);
  const baseSession = {
    ...session,
    completedSets,
    currentSetStartedAt: undefined,
  };

  return {
    completedSet,
    isSessionCompleted,
    session: baseSession,
  };
}

export function startRestAfterSet(
  session: WorkoutSession,
  completedSet: CompletedSet,
  nowIso: string,
) {
  const completedSets = replaceLastSet(session.completedSets, {
    ...completedSet,
    restStartedAt: nowIso,
  });

  return {
    ...session,
    status: "resting" as const,
    completedSets,
    currentRestStartedAt: nowIso,
  };
}

export function startNextSetTransition(
  session: WorkoutSession,
  routine: WorkoutRoutine,
  nowIso: string,
) {
  const nextStep = getNextStep(routine, session);

  if (!nextStep) {
    return completeSessionTransition(session, nowIso);
  }

  const completedSets = completeLatestRest(session, nowIso);

  return {
    ...session,
    status: "exercising" as const,
    currentExerciseIndex: nextStep.exerciseIndex,
    currentSet: nextStep.set,
    currentSetStartedAt: nowIso,
    currentRestStartedAt: undefined,
    completedSets,
  };
}

export function pauseSessionTransition(session: WorkoutSession, nowIso: string) {
  if (session.status !== "exercising" && session.status !== "resting") {
    return session;
  }

  return {
    ...session,
    statusBeforePause: session.status,
    status: "paused" as const,
    pausedAt: nowIso,
  };
}

export function resumeSessionTransition(session: WorkoutSession, nowIso: string) {
  if (session.status !== "paused" || !session.pausedAt || !session.statusBeforePause) {
    return session;
  }

  const pausedSeconds = secondsBetween(session.pausedAt, nowIso);

  return {
    ...session,
    status: session.statusBeforePause,
    statusBeforePause: undefined,
    pausedAt: undefined,
    totalPausedSeconds: session.totalPausedSeconds + pausedSeconds,
    currentSetStartedAt: shiftIso(session.currentSetStartedAt, pausedSeconds),
    currentRestStartedAt: shiftIso(session.currentRestStartedAt, pausedSeconds),
  };
}

export function completeSessionTransition(session: WorkoutSession, nowIso: string) {
  return {
    ...session,
    status: "completed" as const,
    completedAt: nowIso,
    currentSetStartedAt: undefined,
    currentRestStartedAt: undefined,
    pausedAt: undefined,
    statusBeforePause: undefined,
  };
}

function completeLatestRest(completedSession: WorkoutSession, nowIso: string) {
  const latestSet = completedSession.completedSets.at(-1);

  if (!latestSet?.restStartedAt) {
    return completedSession.completedSets;
  }

  return replaceLastSet(completedSession.completedSets, {
    ...latestSet,
    restCompletedAt: nowIso,
    actualRestSeconds: secondsBetween(latestSet.restStartedAt, nowIso),
  });
}

function replaceLastSet(completedSets: CompletedSet[], nextSet: CompletedSet) {
  return [...completedSets.slice(0, -1), nextSet];
}

function getTotalSetCount(routine: WorkoutRoutine) {
  return routine.exercises.reduce((total, exercise) => total + exercise.sets, 0);
}
