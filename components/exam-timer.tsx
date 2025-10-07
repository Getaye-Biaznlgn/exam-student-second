"use client"

import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExamTimerProps {
  durationMinutes: number
  onTimeUp: () => void
  isPaused?: boolean
}

export function ExamTimer({ durationMinutes, onTimeUp, isPaused = false }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60) // Convert to seconds

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const percentage = (timeLeft / (durationMinutes * 60)) * 100
  const isLowTime = percentage < 20

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors",
        isLowTime ? "border-red-500 bg-red-500/10" : "border-border bg-card",
      )}
    >
      {isLowTime ? (
        <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
      ) : (
        <Clock className="h-5 w-5 text-muted-foreground" />
      )}
      <div className="flex-1">
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-bold tabular-nums", isLowTime && "text-red-500")}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-sm text-muted-foreground">remaining</span>
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden mt-2">
          <div
            className={cn("h-full transition-all duration-1000", isLowTime ? "bg-red-500" : "bg-primary")}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
