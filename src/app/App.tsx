import { useMemo, useState } from "react";
import { HomePage } from "../features/workout/pages/HomePage";
import { SettingsPage } from "../features/workout/pages/SettingsPage";
import { WorkoutSessionPage } from "../features/workout/pages/WorkoutSessionPage";
import { WorkoutSummaryPage } from "../features/workout/pages/WorkoutSummaryPage";
import { useWorkoutSession } from "../features/workout/hooks/useWorkoutSession";
import type { WorkoutRoutine } from "../features/workout/model/workoutTypes";
import { useWorkoutSettings } from "../features/workout/settings/useWorkoutSettings";
import { workoutSessionStorage } from "../features/workout/storage/workoutSessionStorage";
import { workoutRoutines } from "../routines";

type AppView = "home" | "settings" | "session" | "summary";

export function App() {
  const { settings, saveSettings } = useWorkoutSettings();
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(() => {
    const storedSessionRoutineId = workoutSessionStorage.getActiveSession()?.routineId;
    const lastRoutineId = storedSessionRoutineId ?? workoutSessionStorage.getLastRoutineId();

    return workoutRoutines.find((routine) => routine.id === lastRoutineId) ?? null;
  });
  const [view, setView] = useState<AppView>(() =>
    workoutSessionStorage.getActiveSession() ? "session" : "home",
  );

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
      routines={workoutRoutines}
      lastRoutineId={workoutSessionStorage.getLastRoutineId()}
      onOpenSettings={() => setView("settings")}
      onStartRoutine={handleStartRoutine}
    />
  );
}
