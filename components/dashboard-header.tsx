"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { t } = useLocale()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border bg-card px-4 sm:px-6 py-4 gap-3">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Bell className="h-5 w-5" />
        <span className="sr-only">{t("dashboard.notifications")}</span>
      </Button>
    </div>
  )
}
