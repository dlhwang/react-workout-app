import { useCallback, useEffect, useMemo, useState } from "react";
import type { WorkoutRoutine, WorkoutSession, WorkoutSessionStatus } from "../model/workoutTypes";
import { getCurrentExercise, getTotalSets } from "../model/workoutSessionUtils";
import { workoutSessionStorage } from "../storage/workoutSessionStorage";

export function useWorkoutSession(initialRoutine: WorkoutRoutine | null) {
  const [session, setSession] = useState<WorkoutSession | null>(() => {
    const storedSession = workoutSessionStorage.getActiveSession();

    if (!storedSession || storedSession.status === "completed") {
      return null;
    }

    return storedSession;
  });

  useEffect(() => {
    if (!session || session.status === "completed") {
      workoutSessionStorage.clearActiveSession();
      return;
    }

    workoutSessionStorage.setActiveSession(session);
  }, [session]);

  const start = useCallback((routine: WorkoutRoutine) => {
    const nextSession: WorkoutSession = {
      routineId: routine.id,
      routineName: routine.name,
      currentExerciseIndex: 0,
      currentSet: 1,
      status: "exercising",
      completedSets: [],
      startedAt: new Date().toISOString(),
    };

    workoutSessionStorage.setLastRoutineId(routine.id);
    setSession(nextSession);
  }, []);

  const reset = useCallback(() => {
    setSession(null);
  }, []);

  const finishSession = useCallback((nextSession: WorkoutSession) => {
    const completedSession = {
      ...nextSession,
      status: "completed" as WorkoutSessionStatus,
      completedAt: new Date().toISOString(),
    };

    workoutSessionStorage.addCompletion({
      routineId: completedSession.routineId,
      routineName: completedSession.routineName,
      completedSets: completedSession.completedSets,
      startedAt: completedSession.startedAt,
      completedAt: completedSession.completedAt,
    });
    workoutSessionStorage.clearActiveSession();
    setSession(completedSession);
  }, []);

  const completeSet = useCallback((routine = initialRoutine) => {
    if (!routine || !session || session.status !== "exercising") {
      return;
    }

    const currentExercise = getCurrentExercise(routine, session);
    const completedSets = [
      ...session.completedSets,
      {
        exerciseId: currentExercise.id,
        exerciseName: currentExercise.name,
        setNumber: session.currentSet,
        completedAt: new Date().toISOString(),
      },
    ];
    const nextSession = {
      ...session,
      completedSets,
    };

    if (completedSets.length >= getTotalSets(routine)) {
      finishSession(nextSession);
      return;
    }

    setSession({
      ...nextSession,
      status: "resting",
    });
  }, [finishSession, initialRoutine, session]);

  const advanceAfterRest = useCallback((routine = initialRoutine) => {
    if (!routine || !session || session.status !== "resting") {
      return;
    }

    const currentExercise = getCurrentExercise(routine, session);

    if (session.currentSet < currentExercise.sets) {
      setSession({
        ...session,
        currentSet: session.currentSet + 1,
        status: "exercising",
      });
      return;
    }

    setSession({
      ...session,
      currentExerciseIndex: session.currentExerciseIndex + 1,
      currentSet: 1,
      status: "exercising",
    });
  }, [initialRoutine, session]);

  const pauseRest = useCallback(() => {
    setSession((currentSession) =>
      currentSession?.status === "resting"
        ? { ...currentSession, status: "paused" }
        : currentSession,
    );
  }, []);

  const resumeRest = useCallback(() => {
    setSession((currentSession) =>
      currentSession?.status === "paused"
        ? { ...currentSession, status: "resting" }
        : currentSession,
    );
  }, []);

  const endWorkout = useCallback(() => {
    setSession(null);
  }, []);

  const currentExercise = useMemo(() => {
    if (!session || !initialRoutine) {
      return null;
    }

    return getCurrentExercise(initialRoutine, session);
  }, [initialRoutine, session]);

  return {
    session,
    currentExercise,
    start,
    reset,
    completeSet,
    advanceAfterRest,
    pauseRest,
    resumeRest,
    endWorkout,
  };
}
