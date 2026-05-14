import {
  getCompletedSetCount,
  getTotalSetCount,
  getWorkoutProgressPercent,
} from "../model/workoutSessionCalculations";
import type { WorkoutRoutine, WorkoutSession } from "../model/workoutTypes";

type WorkoutProgressProps = {
  routine: WorkoutRoutine;
  session: WorkoutSession;
};

export function WorkoutProgress({ routine, session }: WorkoutProgressProps) {
  const progress = getWorkoutProgressPercent(session, routine);
  const completedSets = getCompletedSetCount(session);
  const totalSets = getTotalSetCount(routine);

  return (
    <section className="progress-panel" aria-label="운동 진행률">
      <div className="progress-panel__top">
        <span>진행률</span>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p>
        {completedSets} / {totalSets} 세트 완료
      </p>
    </section>
  );
}
