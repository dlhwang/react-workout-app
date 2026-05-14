import type { useWorkoutSession } from "../hooks/useWorkoutSession";
import {
  getCurrentExercise,
  getTotalWorkoutElapsedSeconds,
} from "../model/workoutSessionCalculations";
import type { WorkoutRoutine } from "../model/workoutTypes";
import { formatTimer } from "../../../shared/utils/timeFormat";
import { CurrentExercisePanel } from "./CurrentExercisePanel";
import { RestTimerPanel } from "./RestTimerPanel";
import { WorkoutProgress } from "./WorkoutProgress";

type WorkoutSessionPageProps = {
  routine: WorkoutRoutine;
  runner: ReturnType<typeof useWorkoutSession>;
};

export function WorkoutSessionPage({ routine, runner }: WorkoutSessionPageProps) {
  const { now, primaryAction, session } = runner;

  if (!session) {
    return null;
  }

  const currentExercise = getCurrentExercise(routine, session);
  const totalElapsed = getTotalWorkoutElapsedSeconds(session, now);
  const isRestView =
    session.status === "resting" ||
    (session.status === "paused" && session.statusBeforePause === "resting");

  return (
    <main className="app-shell session-shell">
      <header className="session-header">
        <div>
          <p className="eyebrow">{routine.name}</p>
          <h1>{session.status === "paused" ? "일시정지" : isRestView ? "휴식" : "운동 중"}</h1>
          <p className="session-time">전체 시간 {formatTimer(totalElapsed)}</p>
        </div>
        <div className="header-actions">
          {session.status !== "paused" ? (
            <button className="ghost-button" type="button" onClick={runner.pauseSession}>
              일시정지
            </button>
          ) : null}
          <button className="ghost-button" type="button" onClick={runner.reset}>
            종료
          </button>
        </div>
      </header>

      <WorkoutProgress routine={routine} session={session} />

      {isRestView ? (
        <RestTimerPanel routine={routine} session={session} now={now} />
      ) : (
        <CurrentExercisePanel
          exercise={currentExercise}
          session={session}
          now={now}
        />
      )}

      <div className="bottom-action">
        <button className="primary-button primary-button--large" type="button" onClick={primaryAction.action}>
          {primaryAction.label}
        </button>
      </div>
    </main>
  );
}
