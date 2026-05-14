import type { PrimaryAction } from "../model/workoutTypes";

type PrimaryWorkoutButtonProps = {
  primaryAction: PrimaryAction;
};

export function PrimaryWorkoutButton({ primaryAction }: PrimaryWorkoutButtonProps) {
  return (
    <div className="bottom-action">
      <button className="primary-button primary-button--large" type="button" onClick={primaryAction.action}>
        {primaryAction.label}
      </button>
    </div>
  );
}
