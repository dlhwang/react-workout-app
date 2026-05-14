import { useMemo, useState } from "react";
import { RoutineListPage } from "../features/workout/components/RoutineListPage";
import { WorkoutSessionPage } from "../features/workout/components/WorkoutSessionPage";
import { WorkoutSummaryPage } from "../features/workout/components/WorkoutSummaryPage";
import { useWorkoutSession } from "../features/workout/hooks/useWorkoutSession";
import type { WorkoutRoutine } from "../features/workout/model/workoutTypes";
import { workoutSessionStorage } from "../features/workout/storage/workoutSessionStorage";
import { workoutRoutines } from "../routines";

export function App() {
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(() => {
    const storedSessionRoutineId = workoutSessionStorage.getActiveSession()?.routineId;
    const lastRoutineId = storedSessionRoutineId ?? workoutSessionStorage.getLastRoutineId();

    return workoutRoutines.find((routine) => routine.id === lastRoutineId) ?? null;
  });

  const activeRoutine = useMemo(() => {
    if (selectedRoutine) {
      return selectedRoutine;
    }

    const storedRoutineId = workoutSessionStorage.getActiveSession()?.routineId;
    return workoutRoutines.find((routine) => routine.id === storedRoutineId) ?? null;
  }, [selectedRoutine]);

  const runner = useWorkoutSession(activeRoutine);

  const handleStartRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    runner.startSession(routine);
  };

  const handleBackToList = () => {
    runner.reset();
    setSelectedRoutine(null);
  };

  const handleRestart = () => {
    runner.restartSession();
  };

  if (runner.session?.status === "completed" && activeRoutine) {
    return (
      <WorkoutSummaryPage
        routine={activeRoutine}
        session={runner.session}
        onRestart={handleRestart}
        onBackToList={handleBackToList}
      />
    );
  }

  if (runner.session && activeRoutine) {
    return <WorkoutSessionPage routine={activeRoutine} runner={runner} />;
  }

  return (
    <RoutineListPage
      routines={workoutRoutines}
      lastRoutineId={workoutSessionStorage.getLastRoutineId()}
      onStartRoutine={handleStartRoutine}
    />
  );
}
