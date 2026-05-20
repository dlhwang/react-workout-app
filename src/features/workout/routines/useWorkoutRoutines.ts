import { useCallback, useState } from "react";
import type { WorkoutRoutine } from "../model/workoutTypes";
import { workoutRoutinesManager } from "./workoutRoutinesManager";

export function useWorkoutRoutines() {
  const [routines, setRoutines] = useState(() => workoutRoutinesManager.getAllRoutines());

  const refreshRoutines = useCallback(() => {
    setRoutines(workoutRoutinesManager.getAllRoutines());
  }, []);

  const saveCustomRoutine = useCallback((routine: WorkoutRoutine) => {
    const savedRoutine = workoutRoutinesManager.saveCustomRoutine(routine);
    refreshRoutines();
    return savedRoutine;
  }, [refreshRoutines]);

  const deleteCustomRoutine = useCallback((routineId: string) => {
    workoutRoutinesManager.deleteCustomRoutine(routineId);
    refreshRoutines();
  }, [refreshRoutines]);

  return {
    routines,
    refreshRoutines,
    saveCustomRoutine,
    deleteCustomRoutine,
    isCustomRoutine: workoutRoutinesManager.isCustomRoutine.bind(workoutRoutinesManager),
    isStaticRoutine: workoutRoutinesManager.isStaticRoutine.bind(workoutRoutinesManager),
  };
}
