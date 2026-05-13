import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatTimer } from "../../../shared/utils/timeFormat";

type UseCountdownTimerArgs = {
  initialSeconds: number;
  isRunning: boolean;
  onComplete?: () => void;
};

export function useCountdownTimer({
  initialSeconds,
  isRunning,
  onComplete,
}: UseCountdownTimerArgs) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setIsPaused(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || isPaused || remainingSeconds <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          window.setTimeout(() => onCompleteRef.current?.(), 0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, isRunning, remainingSeconds]);

  const start = useCallback(() => {
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback((nextSeconds = initialSeconds) => {
    setRemainingSeconds(nextSeconds);
    setIsPaused(false);
  }, [initialSeconds]);

  const skip = useCallback(() => {
    setRemainingSeconds(0);
    onCompleteRef.current?.();
  }, []);

  const formattedTime = useMemo(() => formatTimer(remainingSeconds), [remainingSeconds]);

  return {
    remainingSeconds,
    formattedTime,
    isPaused,
    start,
    pause,
    resume,
    reset,
    skip,
  };
}
