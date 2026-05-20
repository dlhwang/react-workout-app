import { useMemo, useState } from "react";
import { HomePage } from "../features/workout/pages/HomePage";
import { SettingsPage } from "../features/workout/pages/SettingsPage";
import { WorkoutSessionPage } from "../features/workout/pages/WorkoutSessionPage";
import { WorkoutSummaryPage } from "../features/workout/pages/WorkoutSummaryPage";
import { useWorkoutSession } from "../features/workout/hooks/useWorkoutSession";
import type { WorkoutRoutine } from "../features/workout/model/workoutTypes";
import { RoutineManagePage } from "../features/workout/pages/RoutineManagePage";
import { useWorkoutRoutines } from "../features/workout/routines/useWorkoutRoutines";
import { workoutRoutinesManager } from "../features/workout/routines/workoutRoutinesManager";
import { useWorkoutSettings } from "../features/workout/settings/useWorkoutSettings";
import { workoutSessionStorage } from "../features/workout/storage/workoutSessionStorage";

type AppView = "home" | "settings" | "session" | "summary" | "routine-manage";

export function App() {
  const { settings, saveSettings } = useWorkoutSettings();
  const routinesState = useWorkoutRoutines();
  const [routineDraft, setRoutineDraft] = useState<WorkoutRoutine | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(() => {
    const storedSession = workoutSessionStorage.getActiveSession();
    const storedSessionRoutineId = storedSession?.routineId;
    const lastRoutineId = storedSessionRoutineId ?? workoutSessionStorage.getLastRoutineId();

    return storedSession?.routineSnapshot ?? workoutRoutinesManager.getRoutineById(lastRoutineId ?? "");
  });
  const [view, setView] = useState<AppView>(() =>
    workoutSessionStorage.getActiveSession() ? "session" : "home",
  );

  const activeRoutine = useMemo(() => {
    if (selectedRoutine) {
      return selectedRoutine;
    }

    const storedSession = workoutSessionStorage.getActiveSession();
    return storedSession?.routineSnapshot ?? workoutRoutinesManager.getRoutineById(storedSession?.routineId ?? "");
  }, [selectedRoutine]);

  const runner = useWorkoutSession(activeRoutine);

  const handleStartRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    runner.startSession(routine, settings);
    setView("session");
  };

  const handleExitSession = () => {
    runner.reset();
    setView("home");
  };

  const handleRestart = () => {
    if (!activeRoutine) {
      return;
    }

    runner.startSession(activeRoutine, settings);
    setView("session");
  };

  const handleBackToList = () => {
    runner.reset();
    setSelectedRoutine(null);
    setView("home");
  };

  const handleSaveSettings = (nextSettings: typeof settings) => {
    saveSettings(nextSettings);
    setView("home");
  };

  const handleCreateRoutine = () => {
    setRoutineDraft(null);
    setView("routine-manage");
  };

  const handleEditRoutine = (routine: WorkoutRoutine) => {
    setRoutineDraft(
      routinesState.isStaticRoutine(routine.id)
        ? workoutRoutinesManager.createCustomCopy(routine)
        : routine,
    );
    setView("routine-manage");
  };

  const handleDeleteRoutine = (routineId: string) => {
    routinesState.deleteCustomRoutine(routineId);
    if (selectedRoutine?.id === routineId) {
      setSelectedRoutine(null);
    }
  };

  const handleSaveRoutine = (routine: WorkoutRoutine) => {
    const savedRoutine = routinesState.saveCustomRoutine(routine);
    setSelectedRoutine(savedRoutine);
    setView("home");
  };

  if (runner.session?.status === "completed" && activeRoutine && view !== "settings") {
    return (
      <WorkoutSummaryPage
        routine={activeRoutine}
        session={runner.session}
        onRestart={handleRestart}
        onBackToList={handleBackToList}
      />
    );
  }

  if (view === "settings") {
    return (
      <SettingsPage
        settings={settings}
        onSave={handleSaveSettings}
        onBack={() => setView("home")}
      />
    );
  }

  if (view === "routine-manage") {
    return (
      <RoutineManagePage
        routine={routineDraft}
        onBack={() => setView("home")}
        onSave={handleSaveRoutine}
      />
    );
  }

  if (view === "session" && runner.session && activeRoutine) {
    return (
      <WorkoutSessionPage
        routine={activeRoutine}
        runner={runner}
        onExit={handleExitSession}
      />
    );
  }

  return (
    <HomePage
      routines={routinesState.routines}
      lastRoutineId={workoutSessionStorage.getLastRoutineId()}
      onOpenSettings={() => setView("settings")}
      onCreateRoutine={handleCreateRoutine}
      onEditRoutine={handleEditRoutine}
      onDeleteRoutine={handleDeleteRoutine}
      isCustomRoutine={routinesState.isCustomRoutine}
      onStartRoutine={handleStartRoutine}
    />
  );
}
