import { localStorageClient } from "../../../shared/storage/localStorageClient";
import type { CompletedSet, WorkoutSession } from "../model/workoutTypes";

const LAST_ROUTINE_ID_KEY = "workout:lastRoutineId";
const ACTIVE_SESSION_KEY = "workout:activeSession";
const RECENT_COMPLETIONS_KEY = "workout:recentCompletions";

export type WorkoutCompletionRecord = {
  routineId: string;
  routineName: string;
  completedSets: CompletedSet[];
  startedAt: string;
  completedAt: string;
};

export const workoutSessionStorage = {
  getLastRoutineId() {
    return localStorageClient.get<string>(LAST_ROUTINE_ID_KEY);
  },

  setLastRoutineId(routineId: string) {
    localStorageClient.set(LAST_ROUTINE_ID_KEY, routineId);
  },

  getActiveSession() {
    return localStorageClient.get<WorkoutSession>(ACTIVE_SESSION_KEY);
  },

  setActiveSession(session: WorkoutSession) {
    localStorageClient.set(ACTIVE_SESSION_KEY, session);
  },

  clearActiveSession() {
    localStorageClient.remove(ACTIVE_SESSION_KEY);
  },

  getRecentCompletions() {
    return localStorageClient.get<WorkoutCompletionRecord[]>(RECENT_COMPLETIONS_KEY) ?? [];
  },

  addCompletion(record: WorkoutCompletionRecord) {
    const nextRecords = [record, ...this.getRecentCompletions()].slice(0, 10);
    localStorageClient.set(RECENT_COMPLETIONS_KEY, nextRecords);
  },
};
