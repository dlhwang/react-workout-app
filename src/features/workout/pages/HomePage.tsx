import type { WorkoutRoutine } from "../model/workoutTypes";
import { RoutineCard } from "../components/RoutineCard";

type HomePageProps = {
  routines: WorkoutRoutine[];
  lastRoutineId: string | null;
  onOpenSettings: () => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
};

export function HomePage({
  routines,
  lastRoutineId,
  onOpenSettings,
  onStartRoutine,
}: HomePageProps) {
  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workout Runner</p>
          <h1>운동 프로그램</h1>
        </div>
        <button className="ghost-button" type="button" onClick={onOpenSettings}>
          설정
        </button>
      </header>

      <section className="routine-list" aria-label="운동 프로그램 목록">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            isLastSelected={routine.id === lastRoutineId}
            onStart={() => onStartRoutine(routine)}
          />
        ))}
      </section>
    </main>
  );
}
