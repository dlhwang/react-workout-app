import { useState } from "react";
import type { WorkoutSettings } from "../settings/workoutSettings";
import {
  DEFAULT_WORKOUT_SETTINGS,
  MAX_REST_SECONDS,
  MIN_REST_SECONDS,
  normalizeRestSeconds,
} from "../settings/workoutSettings";

type SettingsPageProps = {
  settings: WorkoutSettings;
  onSave: (settings: WorkoutSettings) => void;
  onBack: () => void;
};

export function SettingsPage({ settings, onSave, onBack }: SettingsPageProps) {
  const [restSecondsInput, setRestSecondsInput] = useState(String(settings.globalRestSeconds));

  const handleSave = () => {
    onSave({
      globalRestSeconds: normalizeRestSeconds(restSecondsInput),
    });
  };

  const handleReset = () => {
    setRestSecondsInput(String(DEFAULT_WORKOUT_SETTINGS.globalRestSeconds));
  };

  return (
    <main className="app-shell settings-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>설정</h1>
        </div>
        <button className="ghost-button" type="button" onClick={onBack}>
          메인
        </button>
      </header>

      <section className="settings-panel">
        <label className="settings-field">
          <span>공통 쉬는시간</span>
          <div className="settings-input-row">
            <input
              type="number"
              inputMode="numeric"
              min={MIN_REST_SECONDS}
              max={MAX_REST_SECONDS}
              value={restSecondsInput}
              onChange={(event) => setRestSecondsInput(event.target.value)}
            />
            <strong>초</strong>
          </div>
        </label>

        <p className="settings-help">
          {MIN_REST_SECONDS}초부터 {MAX_REST_SECONDS}초까지 저장됩니다.
        </p>

        <div className="settings-actions">
          <button className="primary-button" type="button" onClick={handleSave}>
            저장
          </button>
          <button className="secondary-button" type="button" onClick={handleReset}>
            기본값
          </button>
        </div>
      </section>
    </main>
  );
}
