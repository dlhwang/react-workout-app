import {
  getCurrentExercise,
  getNextExerciseName,
  getTotalSets,
} from "../model/workoutSessionUtils";
import type { WorkoutRoutine, WorkoutSession } from "../model/workoutTypes";

type CurrentExercisePanelProps = {
  routine: WorkoutRoutine;
  session: WorkoutSession;
  onCompleteSet: (routine: WorkoutRoutine) => void;
};

export function CurrentExercisePanel({
  routine,
  session,
  onCompleteSet,
}: CurrentExercisePanelProps) {
  const exercise = getCurrentExercise(routine, session);
  const totalSets = getTotalSets(routine);

  return (
    <section className="exercise-panel">
      <div className="exercise-focus">
        <p className="label">현재 운동</p>
        <h2>{exercise.name}</h2>
        <div className="set-line">
          <strong>
            {session.currentSet} / {exercise.sets}
          </strong>
          <span>현재 운동 세트</span>
        </div>
      </div>

      <div className="info-grid">
        <div>
          <span>목표 반복</span>
          <strong>{exercise.reps}</strong>
        </div>
        <div>
          <span>완료 세트</span>
          <strong>
            {session.completedSets.length} / {totalSets}
          </strong>
        </div>
      </div>

      {exercise.memo ? <p className="memo">{exercise.memo}</p> : null}

      <div className="next-block">
        <span>다음 운동</span>
        <strong>{getNextExerciseName(routine, session)}</strong>
      </div>

      <div className="bottom-action">
        <button className="primary-button primary-button--large" type="button" onClick={() => onCompleteSet(routine)}>
          세트 완료
        </button>
      </div>
    </section>
  );
}
