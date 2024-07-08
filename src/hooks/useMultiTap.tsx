'use client';

import { useState, useEffect, useRef } from 'react';

function useMultiTap(threshold: number = 2, timeoutDuration: number = 1000) {
  if (threshold <= 1) {
    throw new Error('Threshold must be greater than 1');
  }

  const [tapCount, setTapCount] = useState<number>(0);
  const timeoutIdRef = useRef<number | null>(null);

  function handleTimeoutReset() {
    setTapCount(0);
  }

  function handlePress(callback?: () => void) {
    setTapCount((prevCount) => prevCount + 1);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = window.setTimeout(
      handleTimeoutReset,
      timeoutDuration
    );

    if (tapCount === threshold - 1 && typeof callback === 'function') {
      callback();
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return handlePress;
}

export default useMultiTap;
