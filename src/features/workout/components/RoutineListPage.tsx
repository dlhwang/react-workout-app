import type { WorkoutRoutine } from "../model/workoutTypes";
import { RoutineCard } from "./RoutineCard";

type RoutineListPageProps = {
  routines: WorkoutRoutine[];
  lastRoutineId: string | null;
  onStartRoutine: (routine: WorkoutRoutine) => void;
};

export function RoutineListPage({ routines, lastRoutineId, onStartRoutine }: RoutineListPageProps) {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Workout Runner</p>
        <h1>오늘의 운동</h1>
      </header>

      <section className="routine-list" aria-label="운동 루틴 목록">
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
