import { useEffect } from "react";
import { useCountdownTimer } from "../hooks/useCountdownTimer";
import { getUpcomingStep } from "../model/workoutSessionUtils";
import type { WorkoutRoutine, WorkoutSession } from "../model/workoutTypes";

type RestTimerPanelProps = {
  routine: WorkoutRoutine;
  session: WorkoutSession;
  restSeconds: number;
  onCompleteRest: () => void;
  onPause: () => void;
  onResume: () => void;
};

export function RestTimerPanel({
  routine,
  session,
  restSeconds,
  onCompleteRest,
  onPause,
  onResume,
}: RestTimerPanelProps) {
  const timer = useCountdownTimer({
    initialSeconds: restSeconds,
    isRunning: session.status === "resting",
    onComplete: onCompleteRest,
  });
  const { pause, resume } = timer;
  const upcomingStep = getUpcomingStep(routine, session);

  useEffect(() => {
    if (session.status === "paused") {
      pause();
      return;
    }

    resume();
  }, [pause, resume, session.status]);

  return (
    <section className="rest-panel">
      <p className="label">휴식 타이머</p>
      <div className="timer" aria-live="polite">
        {timer.formattedTime}
      </div>

      <div className="next-block next-block--bright">
        <span>다음 세트</span>
        <strong>
          {upcomingStep
            ? `${upcomingStep.exerciseName} ${upcomingStep.set}세트`
            : "전체 운동 완료"}
        </strong>
      </div>

      <div className="rest-actions">
        <button className="secondary-button" type="button" onClick={timer.skip}>
          휴식 건너뛰기
        </button>
        {session.status === "paused" ? (
          <button className="secondary-button" type="button" onClick={onResume}>
            재개
          </button>
        ) : (
          <button className="secondary-button" type="button" onClick={onPause}>
            일시정지
          </button>
        )}
      </div>
    </section>
  );
}
