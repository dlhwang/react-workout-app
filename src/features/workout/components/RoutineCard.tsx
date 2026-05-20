import { getTotalSetCount } from "../model/workoutSessionCalculations";
import type { WorkoutRoutine } from "../model/workoutTypes";

type RoutineCardProps = {
  routine: WorkoutRoutine;
  isLastSelected: boolean;
  isCustom: boolean;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function RoutineCard({
  routine,
  isLastSelected,
  isCustom,
  onStart,
  onEdit,
  onDelete,
}: RoutineCardProps) {
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
          <dt>운동 개수</dt>
          <dd>{routine.exercises.length}개</dd>
        </div>
        <div>
          <dt>총 세트</dt>
          <dd>{getTotalSetCount(routine)}세트</dd>
        </div>
      </dl>

      <button className="primary-button" type="button" onClick={onStart}>
        시작
      </button>
      <div className="routine-card__actions">
        <button className="secondary-button" type="button" onClick={onEdit}>
          {isCustom ? "수정" : "복사해서 수정"}
        </button>
        {isCustom ? (
          <button className="ghost-button" type="button" onClick={onDelete}>
            삭제
          </button>
        ) : null}
      </div>
    </article>
  );
}
