import { getCurrentExercise } from "../model/workoutSessionUtils";
import type { WorkoutRoutine } from "../model/workoutTypes";
import type { useWorkoutSession } from "../hooks/useWorkoutSession";
import { CurrentExercisePanel } from "./CurrentExercisePanel";
import { RestTimerPanel } from "./RestTimerPanel";
import { WorkoutProgress } from "./WorkoutProgress";

type WorkoutSessionPageProps = {
  routine: WorkoutRoutine;
  runner: ReturnType<typeof useWorkoutSession>;
};

export function WorkoutSessionPage({ routine, runner }: WorkoutSessionPageProps) {
  const { session } = runner;

  if (!session) {
    return null;
  }

  const currentExercise = getCurrentExercise(routine, session);
  const isRestMode = session.status === "resting" || session.status === "paused";

  return (
    <main className="app-shell session-shell">
      <header className="session-header">
        <div>
          <p className="eyebrow">{routine.name}</p>
          <h1>{isRestMode ? "휴식" : "운동 중"}</h1>
        </div>
        <button className="ghost-button" type="button" onClick={runner.endWorkout}>
          종료
        </button>
      </header>

      <WorkoutProgress routine={routine} session={session} />

      {isRestMode ? (
        <RestTimerPanel
          routine={routine}
          session={session}
          restSeconds={currentExercise.restSeconds}
          onCompleteRest={() => runner.advanceAfterRest(routine)}
          onPause={runner.pauseRest}
          onResume={runner.resumeRest}
        />
      ) : (
        <CurrentExercisePanel routine={routine} session={session} onCompleteSet={runner.completeSet} />
      )}
    </main>
  );
}
