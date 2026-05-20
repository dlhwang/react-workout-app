import { useMemo, useState } from "react";
import type { Exercise, WorkoutRoutine } from "../model/workoutTypes";

type RoutineManagePageProps = {
  routine: WorkoutRoutine | null;
  onBack: () => void;
  onSave: (routine: WorkoutRoutine) => void;
};

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}`;
}

function createExercise(): Exercise {
  return {
    id: createId(),
    name: "",
    sets: 3,
    reps: "8~12",
    restSeconds: 90,
  };
}

function createRoutine(): WorkoutRoutine {
  return {
    id: createId(),
    name: "",
    description: "",
    category: "custom",
    difficulty: "beginner",
    estimatedMinutes: 45,
    exercises: [createExercise()],
  };
}

export function RoutineManagePage({ routine, onBack, onSave }: RoutineManagePageProps) {
  const [draft, setDraft] = useState<WorkoutRoutine>(() => routine ?? createRoutine());

  const canSave = useMemo(
    () => draft.name.trim().length > 0 && draft.exercises.some((exercise) => exercise.name.trim()),
    [draft],
  );

  const updateExercise = (exerciseId: string, patch: Partial<Exercise>) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      exercises: currentDraft.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...patch } : exercise,
      ),
    }));
  };

  const moveExercise = (exerciseId: string, direction: -1 | 1) => {
    setDraft((currentDraft) => {
      const currentIndex = currentDraft.exercises.findIndex((exercise) => exercise.id === exerciseId);
      const nextIndex = currentIndex + direction;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentDraft.exercises.length) {
        return currentDraft;
      }

      const nextExercises = [...currentDraft.exercises];
      const [movedExercise] = nextExercises.splice(currentIndex, 1);
      nextExercises.splice(nextIndex, 0, movedExercise);

      return {
        ...currentDraft,
        exercises: nextExercises,
      };
    });
  };

  const removeExercise = (exerciseId: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      exercises:
        currentDraft.exercises.length > 1
          ? currentDraft.exercises.filter((exercise) => exercise.id !== exerciseId)
          : currentDraft.exercises,
    }));
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    onSave({
      ...draft,
      category: "custom",
      exercises: draft.exercises.filter((exercise) => exercise.name.trim()),
    });
  };

  return (
    <main className="app-shell routine-manage-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Routine Builder</p>
          <h1>{routine ? "루틴 수정" : "새 루틴"}</h1>
        </div>
        <button className="ghost-button" type="button" onClick={onBack}>
          뒤로
        </button>
      </header>

      <section className="routine-form-panel">
        <label className="form-field">
          <span>루틴 이름</span>
          <input
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="푸시 데이"
          />
        </label>

        <label className="form-field">
          <span>설명</span>
          <textarea
            value={draft.description ?? ""}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="이 루틴에 대한 짧은 메모"
            rows={3}
          />
        </label>

        <div className="routine-form-grid">
          <label className="form-field">
            <span>난이도</span>
            <select
              value={draft.difficulty ?? "beginner"}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  difficulty: event.target.value as WorkoutRoutine["difficulty"],
                })
              }
            >
              <option value="beginner">초급</option>
              <option value="intermediate">중급</option>
              <option value="advanced">고급</option>
            </select>
          </label>

          <label className="form-field">
            <span>예상 시간</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={draft.estimatedMinutes ?? ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  estimatedMinutes: Math.max(1, Number(event.target.value) || 1),
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="routine-editor-section">
        <div className="section-title-row">
          <h2>운동</h2>
          <button
            className="secondary-button compact-button"
            type="button"
            onClick={() =>
              setDraft((currentDraft) => ({
                ...currentDraft,
                exercises: [...currentDraft.exercises, createExercise()],
              }))
            }
          >
            추가
          </button>
        </div>

        <div className="exercise-editor-list">
          {draft.exercises.map((exercise, index) => (
            <article className="exercise-editor" key={exercise.id}>
              <div className="exercise-editor__header">
                <strong>{index + 1}</strong>
                <div className="exercise-editor__actions">
                  <button
                    className="ghost-button icon-button"
                    type="button"
                    onClick={() => moveExercise(exercise.id, -1)}
                    disabled={index === 0}
                    aria-label="운동 위로 이동"
                    title="위로 이동"
                  >
                    ^
                  </button>
                  <button
                    className="ghost-button icon-button"
                    type="button"
                    onClick={() => moveExercise(exercise.id, 1)}
                    disabled={index === draft.exercises.length - 1}
                    aria-label="운동 아래로 이동"
                    title="아래로 이동"
                  >
                    v
                  </button>
                  <button
                    className="ghost-button icon-button"
                    type="button"
                    onClick={() => removeExercise(exercise.id)}
                    disabled={draft.exercises.length === 1}
                    aria-label="운동 삭제"
                    title="삭제"
                  >
                    x
                  </button>
                </div>
              </div>

              <label className="form-field">
                <span>운동 이름</span>
                <input
                  value={exercise.name}
                  onChange={(event) => updateExercise(exercise.id, { name: event.target.value })}
                  placeholder="벤치프레스"
                />
              </label>

              <div className="routine-form-grid routine-form-grid--three">
                <label className="form-field">
                  <span>세트</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={exercise.sets}
                    onChange={(event) =>
                      updateExercise(exercise.id, {
                        sets: Math.max(1, Number(event.target.value) || 1),
                      })
                    }
                  />
                </label>

                <label className="form-field">
                  <span>반복</span>
                  <input
                    value={exercise.reps}
                    onChange={(event) => updateExercise(exercise.id, { reps: event.target.value })}
                  />
                </label>

                <label className="form-field">
                  <span>휴식</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={exercise.restSeconds}
                    onChange={(event) =>
                      updateExercise(exercise.id, {
                        restSeconds: Math.max(0, Number(event.target.value) || 0),
                      })
                    }
                  />
                </label>
              </div>

              <label className="form-field">
                <span>메모</span>
                <textarea
                  value={exercise.memo ?? ""}
                  onChange={(event) => updateExercise(exercise.id, { memo: event.target.value })}
                  rows={2}
                />
              </label>
            </article>
          ))}
        </div>
      </section>

      <div className="settings-actions">
        <button className="primary-button" type="button" onClick={handleSave} disabled={!canSave}>
          저장
        </button>
        <button className="secondary-button" type="button" onClick={onBack}>
          취소
        </button>
      </div>
    </main>
  );
}
