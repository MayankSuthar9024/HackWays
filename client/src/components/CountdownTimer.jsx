import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetDate, onExpire, label = 'Time Remaining' }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    const difference = new Date(targetDate) - new Date();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-xs font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>Time Expired</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center sm:items-start gap-1.5">
      {label && <span className="text-xs uppercase tracking-wider font-semibold text-accent">{label}</span>}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center justify-center bg-primary text-white px-2.5 py-1.5 rounded-lg min-w-[44px]">
          <span className="text-base font-bold leading-tight">{timeLeft.days}</span>
          <span className="text-[10px] text-secondary tracking-tight">DAYS</span>
        </div>
        <span className="font-bold text-primary">:</span>
        <div className="flex flex-col items-center justify-center bg-primary text-white px-2.5 py-1.5 rounded-lg min-w-[44px]">
          <span className="text-base font-bold leading-tight">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[10px] text-secondary tracking-tight">HRS</span>
        </div>
        <span className="font-bold text-primary">:</span>
        <div className="flex flex-col items-center justify-center bg-primary text-white px-2.5 py-1.5 rounded-lg min-w-[44px]">
          <span className="text-base font-bold leading-tight">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] text-secondary tracking-tight">MIN</span>
        </div>
        <span className="font-bold text-primary">:</span>
        <div className="flex flex-col items-center justify-center bg-primary text-white px-2.5 py-1.5 rounded-lg min-w-[44px]">
          <span className="text-base font-bold leading-tight">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] text-secondary tracking-tight">SEC</span>
        </div>
      </div>
    </div>
  );
}
