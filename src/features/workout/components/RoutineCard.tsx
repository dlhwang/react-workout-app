import { getTotalSets } from "../model/workoutSessionUtils";
import type { WorkoutRoutine } from "../model/workoutTypes";

type RoutineCardProps = {
  routine: WorkoutRoutine;
  isLastSelected: boolean;
  onStart: () => void;
};

export function RoutineCard({ routine, isLastSelected, onStart }: RoutineCardProps) {
  return (
    <article className="routine-card">
      <div className="routine-card__top">
        <div>
          <h2>{routine.name}</h2>
          {routine.description ? <p>{routine.description}</p> : null}
        </div>
        {isLastSelected ? <span className="badge">최근</span> : null}
      </div>

      <dl className="routine-stats">
        <div>
          <dt>난이도</dt>
          <dd>{routine.difficulty ?? "-"}</dd>
        </div>
        <div>
          <dt>예상 시간</dt>
          <dd>{routine.estimatedMinutes ? `${routine.estimatedMinutes}분` : "-"}</dd>
        </div>
        <div>
          <dt>운동 수</dt>
          <dd>{routine.exercises.length}개</dd>
        </div>
        <div>
          <dt>총 세트</dt>
          <dd>{getTotalSets(routine)}세트</dd>
        </div>
      </dl>

      {routine.category ? <p className="category">카테고리: {routine.category}</p> : null}
      <button className="primary-button" type="button" onClick={onStart}>
        운동 시작
      </button>
    </article>
  );
}
