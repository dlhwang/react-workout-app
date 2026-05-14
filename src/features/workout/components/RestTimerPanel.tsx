import {
  getCurrentRestElapsedSeconds,
  getCurrentRestRemainingSeconds,
  getNextStep,
} from "../model/workoutSessionCalculations";
import type { WorkoutRoutine, WorkoutSession } from "../model/workoutTypes";
import { formatTimer } from "../../../shared/utils/timeFormat";

type RestTimerPanelProps = {
  routine: WorkoutRoutine;
  session: WorkoutSession;
  now: Date;
};

export function RestTimerPanel({ routine, session, now }: RestTimerPanelProps) {
  const remainingSeconds = getCurrentRestRemainingSeconds(session, routine, now);
  const restElapsedSeconds = getCurrentRestElapsedSeconds(session, now);
  const nextStep = getNextStep(routine, session);

  return (
    <section className="rest-panel">
      <p className="label">휴식</p>
      <div className="timer" aria-live="polite">
        {formatTimer(remainingSeconds)}
      </div>
      <p className="timer-caption">남음</p>

      <div className="timer-block timer-block--compact">
        <span>실제 휴식 경과</span>
        <strong>{formatTimer(restElapsedSeconds)}</strong>
      </div>

      <div className="next-block next-block--bright">
        <span>다음</span>
        <strong>
          {nextStep
            ? `${nextStep.exerciseName} ${nextStep.set} / ${nextStep.exerciseSets} 세트`
            : "전체 운동 완료"}
        </strong>
      </div>
    </section>
  );
}
