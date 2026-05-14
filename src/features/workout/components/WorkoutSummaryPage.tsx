import {
  getTotalExerciseElapsedSeconds,
  getTotalRestElapsedSeconds,
  getTotalSetCount,
  getTotalWorkoutElapsedSeconds,
} from "../model/workoutSessionCalculations";
import type { WorkoutRoutine, WorkoutSession } from "../model/workoutTypes";
import { formatDateTime, formatTimer } from "../../../shared/utils/timeFormat";

type WorkoutSummaryPageProps = {
  routine: WorkoutRoutine;
  session: WorkoutSession;
  onRestart: () => void;
  onBackToList: () => void;
};

export function WorkoutSummaryPage({
  routine,
  session,
  onRestart,
  onBackToList,
}: WorkoutSummaryPageProps) {
  const totalWorkoutSeconds = getTotalWorkoutElapsedSeconds(session);
  const totalExerciseSeconds = session.completedSets.reduce(
    (total, set) => total + set.durationSeconds,
    0,
  );
  const totalRestSeconds = getTotalRestElapsedSeconds(session);

  return (
    <main className="app-shell summary-shell">
      <section className="summary-panel">
        <p className="eyebrow">완료</p>
        <h1>{routine.name}</h1>

        <dl className="summary-stats">
          <div>
            <dt>총 운동 시간</dt>
            <dd>{formatTimer(totalWorkoutSeconds)}</dd>
          </div>
          <div>
            <dt>총 세트 수</dt>
            <dd>{getTotalSetCount(routine)}세트</dd>
          </div>
          <div>
            <dt>총 수행 시간</dt>
            <dd>{formatTimer(totalExerciseSeconds)}</dd>
          </div>
          <div>
            <dt>총 휴식 시간</dt>
            <dd>{formatTimer(totalRestSeconds)}</dd>
          </div>
          <div>
            <dt>운동 시작</dt>
            <dd>{session.startedAt ? formatDateTime(session.startedAt) : "-"}</dd>
          </div>
          <div>
            <dt>운동 종료</dt>
            <dd>{session.completedAt ? formatDateTime(session.completedAt) : "-"}</dd>
          </div>
        </dl>

        <section className="summary-section">
          <h2>운동별 수행 시간</h2>
          <ul className="summary-list">
            {routine.exercises.map((exercise) => (
              <li key={exercise.id}>
                <span>{exercise.name}</span>
                <strong>{formatTimer(getTotalExerciseElapsedSeconds(session, exercise.id))}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="summary-section">
          <h2>세트별 수행 시간</h2>
          <ul className="summary-list summary-list--sets">
            {session.completedSets.map((set, index) => (
              <li key={`${set.exerciseId}-${set.setNumber}-${index}`}>
                <span>
                  {set.exerciseName} {set.setNumber}세트
                </span>
                <strong>{formatTimer(set.durationSeconds)}</strong>
              </li>
            ))}
          </ul>
        </section>

        <div className="summary-actions">
          <button className="primary-button" type="button" onClick={onRestart}>
            다시 하기
          </button>
          <button className="secondary-button" type="button" onClick={onBackToList}>
            루틴 목록
          </button>
        </div>
      </section>
    </main>
  );
}
