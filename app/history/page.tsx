"use client";

import { useEffect, useState } from "react";
import { fetchExamHistory } from "@/lib/api";
import type { ExamHistoryItem } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function ExamHistoryPage() {
  const [mode, setMode] = useState<"exam" | "practice">("exam");
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchExamHistory(mode);
        if (res.success && res.data) {
          setHistory(res.data);
        } else {
          setError(res.message || "Failed to load history");
        }
      } catch (err) {
        setError("Error fetching history");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [mode]);

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Exam History"
        description="View your previous exam and practice sessions"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Toggle for Mode Selection */}
        <div className="flex justify-between items-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => val && setMode(val as "exam" | "practice")}
            className="flex gap-2"
          >
            <ToggleGroupItem
              value="exam"
              className={`px-4 py-2 rounded-md border ${
                mode === "exam"
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Exam Mode
            </ToggleGroupItem>
            <ToggleGroupItem
              value="practice"
              className={`px-4 py-2 rounded-md border ${
                mode === "practice"
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Practice Mode
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading {mode} history...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 text-red-500">
            <p>{error}</p>
            <Button onClick={() => setMode(mode)} className="mt-4">
              Retry
            </Button>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <p>No {mode} history found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {item.exam_title}
                    </CardTitle>
                    <Badge
                      variant={
                        item.is_completed
                          ? item.is_passed
                            ? "default"
                            : "secondary"
                          : "outline"
                      }
                    >
                      {item.is_completed
                        ? item.is_passed
                          ? "Passed"
                          : "Completed"
                        : "In Progress"}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm mt-1">
                    Subject: {item.exam_subject}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <p>
                    <Clock className="inline h-4 w-4 mr-1 text-muted-foreground" />
                    Duration: {item.exam_duration} min
                  </p>
                  <p>
                    Score:{" "}
                    {item.score !== null ? (
                      <span className="font-medium">{item.score}</span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </p>
                  <p>Time Spent: {item.time_spent_minutes.toFixed(2)} min</p>
                  <p>Passing Marks: {item.exam_passing_marks}</p>

                  <div className="flex justify-between items-center pt-2">
                    {item.is_completed ? (
                      item.is_passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Started: {new Date(item.start_time).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
