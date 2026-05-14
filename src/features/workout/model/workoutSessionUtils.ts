export {
  getCompletedSetCount,
  getCurrentExercise,
  getNextStep as getUpcomingStep,
  getTotalSetCount as getTotalSets,
  getWorkoutProgressPercent as getSessionProgress,
} from "./workoutSessionCalculations";

import type { WorkoutRoutine, WorkoutSession } from "./workoutTypes";
import { getNextStep } from "./workoutSessionCalculations";

export function getNextExerciseName(routine: WorkoutRoutine, session: WorkoutSession) {
  return getNextStep(routine, session)?.exerciseName ?? "운동 완료";
}
