"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import "./progress.css"

/**
 * Progress component based on HTML div elements
 * Compatible with Next.js 15
 */
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null }
>(({ className, value, ...props }, ref) => {
  const valueNum = value !== null && value !== undefined ? Number(value) : 0;
  const [width, setWidth] = React.useState('0%');
  
  // Update width based on value
  React.useEffect(() => {
    setWidth(`${valueNum}%`);
  }, [valueNum]);

  return (
    <div
      role="progressbar"
      ref={ref}
      data-value={valueNum}
      data-max="100"
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full bg-primary absolute left-0 top-0 progress-indicator",
        )}
        data-progress={Math.round(valueNum)}
      />
    </div>
  );
})

Progress.displayName = "Progress"

export { Progress }