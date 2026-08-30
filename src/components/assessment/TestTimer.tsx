import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Timer, AlertTriangle } from 'lucide-react';

interface TestTimerProps {
  totalSeconds: number;
  onExpire: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function TestTimer({ totalSeconds, onExpire }: TestTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const isWarning = remaining <= 120; // 2 minutes
  const isDanger = remaining <= 30;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-semibold ${
      isDanger
        ? 'border-danger/40 bg-danger/10 text-danger'
        : isWarning
        ? 'border-warning/40 bg-warning/10 text-warning'
        : 'border-border bg-surface text-foreground'
    }`}>
      {isWarning ? (
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
          <AlertTriangle size={14} />
        </motion.div>
      ) : (
        <Timer size={14} />
      )}
      {pad(mins)}:{pad(secs)}
    </div>
  );
}

// ─── Task countdown timer (persisted via timestamps) ─────────────────────────

interface TaskTimerProps {
  deadline: number; // Unix timestamp
}

export function TaskTimer({ deadline }: TaskTimerProps) {
  const calcRemaining = useCallback(() => {
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  }, [deadline]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calcRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [calcRemaining]);

  const hours = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;

  const isExpired = remaining === 0;
  const isWarning = remaining <= 3600; // 1 hour
  const isDanger = remaining <= 900;   // 15 minutes

  if (isExpired) {
    return (
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-danger font-display text-3xl font-bold tracking-wider"
        >
          EXPIRED
        </motion.div>
        <p className="text-sm text-muted-foreground">Task time has elapsed</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <p className={`text-xs uppercase tracking-widest font-semibold ${isDanger ? 'text-danger' : isWarning ? 'text-warning' : 'text-muted-foreground'}`}>
        Time Remaining
      </p>
      <motion.div
        className={`font-display text-4xl font-bold tracking-wider ${isDanger ? 'text-danger' : isWarning ? 'text-warning' : 'text-foreground'}`}
        animate={isDanger ? { scale: [1, 1.05, 1] } : {}}
        transition={isDanger ? { repeat: Infinity, duration: 1 } : {}}
      >
        {pad(hours)}:{pad(mins)}:{pad(secs)}
      </motion.div>
    </div>
  );
}
