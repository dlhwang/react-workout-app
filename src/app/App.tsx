import { useMemo, useState } from "react";
import { RoutineListPage } from "../features/workout/components/RoutineListPage";
import { WorkoutSessionPage } from "../features/workout/components/WorkoutSessionPage";
import { WorkoutSummaryPage } from "../features/workout/components/WorkoutSummaryPage";
import { useWorkoutSession } from "../features/workout/hooks/useWorkoutSession";
import type { WorkoutRoutine } from "../features/workout/model/workoutTypes";
import { workoutRoutines } from "../routines";
import { workoutSessionStorage } from "../features/workout/storage/workoutSessionStorage";

export function App() {
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(() => {
    const lastRoutineId = workoutSessionStorage.getLastRoutineId();
    return workoutRoutines.find((routine) => routine.id === lastRoutineId) ?? null;
  });

  const runner = useWorkoutSession(selectedRoutine);

  const activeRoutine = useMemo(() => {
    if (selectedRoutine) {
      return selectedRoutine;
    }

    const storedRoutineId = workoutSessionStorage.getActiveSession()?.routineId;
    return workoutRoutines.find((routine) => routine.id === storedRoutineId) ?? null;
  }, [selectedRoutine]);

  const handleStartRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    runner.start(routine);
  };

  const handleBackToList = () => {
    runner.reset();
    setSelectedRoutine(null);
  };

  const handleRestart = () => {
    if (activeRoutine) {
      setSelectedRoutine(activeRoutine);
      runner.start(activeRoutine);
    }
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
