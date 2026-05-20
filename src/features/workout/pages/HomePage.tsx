import { RoutineCard } from "../components/RoutineCard";
import type { WorkoutRoutine } from "../model/workoutTypes";

type HomePageProps = {
  routines: WorkoutRoutine[];
  lastRoutineId: string | null;
  onOpenSettings: () => void;
  onCreateRoutine: () => void;
  onEditRoutine: (routine: WorkoutRoutine) => void;
  onDeleteRoutine: (routineId: string) => void;
  isCustomRoutine: (routineId: string) => boolean;
  onStartRoutine: (routine: WorkoutRoutine) => void;
};

export function HomePage({
  routines,
  lastRoutineId,
  onOpenSettings,
  onCreateRoutine,
  onEditRoutine,
  onDeleteRoutine,
  isCustomRoutine,
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

      <button className="primary-button create-routine-button" type="button" onClick={onCreateRoutine}>
        새 루틴 만들기
      </button>

      <section className="routine-list" aria-label="운동 프로그램 목록">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            isLastSelected={routine.id === lastRoutineId}
            isCustom={isCustomRoutine(routine.id)}
            onStart={() => onStartRoutine(routine)}
            onEdit={() => onEditRoutine(routine)}
            onDelete={() => onDeleteRoutine(routine.id)}
          />
        ))}
      </section>
    </main>
  );
}
