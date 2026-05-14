import { useCallback, useEffect, useMemo, useState } from "react";
import { useNow } from "./useNow";
import {
  getCurrentExercise,
  getCurrentRestRemainingSeconds,
} from "../model/workoutSessionCalculations";
import {
  completeCurrentSetTransition,
  completeSessionTransition,
  createInitialSession,
  pauseSessionTransition,
  resumeSessionTransition,
  startNextSetTransition,
  startRestAfterSet,
} from "../model/workoutSessionTransition";
import type { PrimaryAction, WorkoutRoutine, WorkoutSession } from "../model/workoutTypes";
import type { WorkoutSettings } from "../settings/workoutSettings";
import { workoutSessionStorage } from "../storage/workoutSessionStorage";

function getNowIso() {
  return new Date().toISOString();
}

function canRecoverSession(session: WorkoutSession) {
  const hasSettingsSnapshot =
    typeof session.settingsSnapshot?.globalRestSeconds === "number";
  const hasValidCompletedSets = session.completedSets.every(
    (set) => set.startedAt && set.completedAt && typeof set.durationSeconds === "number",
  );

  if (!hasSettingsSnapshot || !hasValidCompletedSets) {
    return false;
  }

  if (session.status === "exercising") {
    return Boolean(session.startedAt && session.currentSetStartedAt);
  }

  if (session.status === "resting") {
    return Boolean(session.startedAt && session.currentRestStartedAt);
  }

  return session.status === "paused" && Boolean(session.startedAt && session.pausedAt);
}

export function useWorkoutSession(routine: WorkoutRoutine | null) {
  const now = useNow(1000);
  const [session, setSession] = useState<WorkoutSession | null>(() => {
    const storedSession = workoutSessionStorage.getActiveSession();

    if (!storedSession || storedSession.status === "completed" || !canRecoverSession(storedSession)) {
      workoutSessionStorage.clearActiveSession();
      return null;
    }

    return {
      ...storedSession,
      totalPausedSeconds: storedSession.totalPausedSeconds ?? 0,
    };
  });

  const persistSession = useCallback((nextSession: WorkoutSession | null) => {
    setSession(nextSession);

    if (!nextSession || nextSession.status === "completed") {
      workoutSessionStorage.clearActiveSession();
      return;
    }

    workoutSessionStorage.setActiveSession(nextSession);
  }, []);

  const startSession = useCallback((
    nextRoutine: WorkoutRoutine,
    settingsSnapshot: WorkoutSettings,
  ) => {
    const nextSession = createInitialSession(nextRoutine, settingsSnapshot, getNowIso());
    workoutSessionStorage.setLastRoutineId(nextRoutine.id);
    persistSession(nextSession);
  }, [persistSession]);

  const completeSession = useCallback((baseSession = session) => {
    if (!baseSession) {
      return;
    }

    const nowIso = getNowIso();
    const completedSession = completeSessionTransition(baseSession, nowIso);
    workoutSessionStorage.addCompletion({
      routineId: completedSession.routineId,
      routineName: completedSession.routineName,
      completedSets: completedSession.completedSets,
      startedAt: completedSession.startedAt ?? completedSession.completedAt ?? nowIso,
      completedAt: completedSession.completedAt ?? nowIso,
    });
    persistSession(completedSession);
  }, [persistSession, session]);

  const completeCurrentSet = useCallback(() => {
    if (!routine || !session || session.status !== "exercising") {
      return;
    }

    const nowIso = getNowIso();
    const transition = completeCurrentSetTransition(session, routine, nowIso);

    if (transition.isSessionCompleted) {
      completeSession(transition.session);
      return;
    }

    persistSession(startRestAfterSet(transition.session, transition.completedSet, nowIso));
  }, [completeSession, persistSession, routine, session]);

  const startNextSet = useCallback(() => {
    if (!routine || !session || session.status !== "resting") {
      return;
    }

    persistSession(startNextSetTransition(session, routine, getNowIso()));
  }, [persistSession, routine, session]);

  const skipRestAndStartNextSet = useCallback(() => {
    startNextSet();
  }, [startNextSet]);

  const pauseSession = useCallback(() => {
    if (!session) {
      return;
    }

    persistSession(pauseSessionTransition(session, getNowIso()));
  }, [persistSession, session]);

  const resumeSession = useCallback(() => {
    if (!session) {
      return;
    }

    persistSession(resumeSessionTransition(session, getNowIso()));
  }, [persistSession, session]);

  const restartSession = useCallback((settingsSnapshot: WorkoutSettings) => {
    if (!routine) {
      return;
    }

    startSession(routine, settingsSnapshot);
  }, [routine, startSession]);

  const reset = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  useEffect(() => {
    if (!routine || !session || session.status !== "resting") {
      return;
    }

    if (getCurrentRestRemainingSeconds(session, routine, now) <= 0) {
      startNextSet();
    }
  }, [now, routine, session, startNextSet]);

  const currentExercise = useMemo(() => {
    if (!session || !routine) {
      return null;
    }

    return getCurrentExercise(routine, session);
  }, [routine, session]);

  const primaryAction: PrimaryAction = useMemo(() => {
    if (!session) {
      return {
        label: "운동 시작",
        action: () => undefined,
      };
    }

    if (session.status === "exercising") {
      return {
        label: "세트 종료",
        action: completeCurrentSet,
      };
    }

    if (session.status === "resting") {
      return {
        label: "다음 세트 시작",
        action: skipRestAndStartNextSet,
      };
    }

    if (session.status === "paused") {
      return {
        label: "다시 시작",
        action: resumeSession,
      };
    }

    return {
      label: "다시 하기",
      action: () => undefined,
    };
  }, [completeCurrentSet, resumeSession, session, skipRestAndStartNextSet]);

  return {
    now,
    session,
    currentExercise,
    primaryAction,
    startSession,
    completeCurrentSet,
    startRestAfterSet,
    startNextSet,
    skipRestAndStartNextSet,
    pauseSession,
    resumeSession,
    completeSession,
    restartSession,
    reset,
  };
}
