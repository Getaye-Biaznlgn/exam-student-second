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

  // Define loadHistory outside useEffect so we can call it from "Retry"
  // but wrap it in useCallback or define it inside useEffect
  // For simplicity here, we'll define it inside useEffect and pass it
  // to the retry button, though this is slightly less clean.
  // A better approach would be useCallback, but let's stick to minimal changes.

  // Re-defining loadHistory inside useEffect is fine, but we need
  // to make the retry button work. Let's define loadHistory
  // *within* the useEffect dependency array.

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setError(null);
      setHistory([]); // <-- FIX 1: Reset history on each load
      try {
        const res = await fetchExamHistory(mode);
        if (res.success && res.data) {
          // --- FIX 2: Check if data is an array ---
          if (Array.isArray(res.data)) {
            setHistory(res.data);
          } else {
            console.error("API returned non-array data:", res.data);
            setError("Failed to load history: Invalid data format.");
          }
          // --- End of FIX 2 ---
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

  // This function is for the "Retry" button
  async function handleRetry() {
    setLoading(true);
    setError(null);
    setHistory([]);
    try {
      const res = await fetchExamHistory(mode);
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        } else {
          console.error("API returned non-array data:", res.data);
          setError("Failed to load history: Invalid data format.");
        }
      } else {
        setError(res.message || "Failed to load history");
      }
    } catch (err) {
      setError("Error fetching history");
    } finally {
      setLoading(false);
    }
  }

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
            {/* --- FIX 3: Make Retry button call loadHistory --- */}
            <Button onClick={handleRetry} className="mt-4">
              Retry
            </Button>
            {/* --- End of FIX 3 --- */}
          </div>
        ) : // --- FIX 4: Safety check for array ---
        !Array.isArray(history) || history.length === 0 ? (
          // --- End of FIX 4 ---
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <p>No {mode} history found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* This is now safe to map */}
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
