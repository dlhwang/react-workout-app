import type { WorkoutRoutine, WorkoutSession } from "../model/workoutTypes";
import { formatDateTime, formatDuration } from "../../../shared/utils/timeFormat";

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
  return (
    <main className="app-shell summary-shell">
      <section className="summary-panel">
        <p className="eyebrow">완료</p>
        <h1>{routine.name}</h1>

        <dl className="summary-stats">
          <div>
            <dt>총 완료 세트</dt>
            <dd>{session.completedSets.length}세트</dd>
          </div>
          <div>
            <dt>운동 시작</dt>
            <dd>{formatDateTime(session.startedAt)}</dd>
          </div>
          <div>
            <dt>운동 종료</dt>
            <dd>{session.completedAt ? formatDateTime(session.completedAt) : "-"}</dd>
          </div>
          <div>
            <dt>총 소요 시간</dt>
            <dd>{formatDuration(session.startedAt, session.completedAt)}</dd>
          </div>
        </dl>

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
