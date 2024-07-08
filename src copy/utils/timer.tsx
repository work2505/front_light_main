'use client';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
interface TimeLeft {
  hours: number;
  minutes: number;
}

const getNextMidnightCETPlusTwoHours = (): Date => {
  const now = new Date();
  const currentUtcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const cetOffset = 1 * 60 * 60 * 1000;
  const cetTime = new Date(currentUtcTime + cetOffset);

  const nextMidnightCET = new Date(
    cetTime.getFullYear(),
    cetTime.getMonth(),
    cetTime.getDate() + 1,
    2,
    0,
    0
  );

  return nextMidnightCET;
};

const calculateTimeLeft = (endTime: Date): TimeLeft => {
  const difference = endTime.getTime() - new Date().getTime();
  let timeLeft: TimeLeft = { hours: 0, minutes: 0 };

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
    };
  }

  return timeLeft;
};

export const Cooldown: React.FC = () => {
  const [endTime, setEndTime] = useState<Date>(
    getNextMidnightCETPlusTwoHours()
  );
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(endTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endTime);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0) {
        clearInterval(interval);
        setEndTime(getNextMidnightCETPlusTwoHours());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [endTime]);

  const timerComponents = (
    <span className="opacity-80">
      {timeLeft.hours} hours {timeLeft.minutes} minutes
    </span>
  );

  return (
    <div>
      <Button className="rounded-full text-[14px]" variant={'default'}>
        {timerComponents}
      </Button>
    </div>
  );
};
