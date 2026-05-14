import { getCurrentSetElapsedSeconds } from "../model/workoutSessionCalculations";
import type { Exercise, WorkoutSession } from "../model/workoutTypes";
import { formatTimer } from "../../../shared/utils/timeFormat";

type CurrentExercisePanelProps = {
  exercise: Exercise;
  session: WorkoutSession;
  now: Date;
};

export function CurrentExercisePanel({ exercise, session, now }: CurrentExercisePanelProps) {
  const currentSetElapsed = getCurrentSetElapsedSeconds(session, now);

  return (
    <section className="exercise-panel">
      <div className="exercise-focus">
        <p className="label">현재 운동</p>
        <h2>{exercise.name}</h2>
        <div className="set-line">
          <strong>
            {session.currentSet} / {exercise.sets}
          </strong>
          <span>세트</span>
        </div>
      </div>

      <div className="timer-block">
        <span>현재 세트 시간</span>
        <strong>{formatTimer(currentSetElapsed)}</strong>
      </div>

      <div className="info-grid">
        <div>
          <span>목표 반복</span>
          <strong>{exercise.reps}회</strong>
        </div>
        <div>
          <span>적용 휴식</span>
          <strong>{session.settingsSnapshot.globalRestSeconds}초</strong>
        </div>
      </div>

      {exercise.memo ? <p className="memo">{exercise.memo}</p> : null}
    </section>
  );
}
