'use client';

import * as React from 'react';
import { cn } from "@/lib/utils";
import "./progress.css";

interface ProgressProps {
  value?: number | null;
  max?: number;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = null, max = 100, className, ...props }, ref) => {
    const valueNumber = value !== null ? Number(value) : 0;
    const width = `${valueNumber}%`;
    
    return (
      <div
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        role="progressbar"
        data-value={valueNumber}
        data-max={max}
        ref={ref}
        {...props}
      >
        <div
          className="h-full bg-primary absolute left-0 top-0 progress-indicator"
          data-progress={Math.round(valueNumber)}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
