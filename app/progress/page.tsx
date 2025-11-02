"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchMyProgress } from "@/lib/api";
import type { MyProgressResponse } from "@/lib/api";

export default function ProgressPage() {
  const [progress, setProgress] = useState<MyProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetchMyProgress();
        if (res.success && res.data) {
          setProgress(res.data);
        } else {
          setError(res.message || "Failed to load progress");
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Something went wrong while loading your progress.");
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading progress...</p>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error || "No progress data found."}</p>
      </div>
    );
  }

  const {
    total_exams,
    completed_exams,
    average_score,
    total_questions_attempted,
    correct_answers,
    accuracy_percentage,
    subjects_performance,
  } = progress;

  const subjectsData = Object.entries(subjects_performance || {}).map(
    ([subject, data]) => ({
      subject,
      exams_taken: data.exams_taken,
      total_score: data.total_score,
      average_score: data.average_score,
    })
  );

  // Identify strongest and weakest subject (based on average_score)
  const sortedSubjects = [...subjectsData].sort(
    (a, b) => b.average_score - a.average_score
  );
  const strongestSubject = sortedSubjects[0];
  const weakestSubject = sortedSubjects[sortedSubjects.length - 1];

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Progress"
        description="Your learning performance overview"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overall Stats */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {average_score?.toFixed(2) ?? "0"}%
                </div>
                <Progress value={average_score} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {accuracy_percentage?.toFixed(1) ?? "0"}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {correct_answers} correct / {total_questions_attempted}{" "}
                  attempted
                </p>
                <Progress value={accuracy_percentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Exams Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completed_exams}/{total_exams}
                </div>
                <Progress
                  value={
                    total_exams > 0 ? (completed_exams / total_exams) * 100 : 0
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Questions Attempted
                </CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {total_questions_attempted}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="subjects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
            </TabsList>

            <TabsContent value="subjects" className="space-y-4">
              {/* Subject Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Average score by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  {subjectsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={subjectsData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="subject"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="average_score"
                          fill="hsl(var(--primary))"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      No subject performance data available.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              {subjectsData.length > 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {strongestSubject && (
                    <Card className="border-green-500/20 bg-green-500/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Strongest Subject
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">
                            {strongestSubject.subject}
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-500 border-green-500/20"
                          >
                            {strongestSubject.average_score.toFixed(1)}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {weakestSubject && (
                    <Card className="border-red-500/20 bg-red-500/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingDown className="h-5 w-5 text-red-500" />
                          Weakest Subject
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">
                            {weakestSubject.subject}
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-500 border-red-500/20"
                          >
                            {weakestSubject.average_score.toFixed(1)}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Subject Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                  <CardDescription>Scores per subject</CardDescription>
                </CardHeader>
                <CardContent>
                  {subjectsData.length > 0 ? (
                    <div className="space-y-6">
                      {subjectsData.map((s) => (
                        <div key={s.subject} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold">{s.subject}</span>
                            </div>
                            <Badge variant="outline">
                              {s.average_score.toFixed(1)}% Avg Score
                            </Badge>
                          </div>
                          <Progress value={s.average_score} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Exams Taken: {s.exams_taken} | Total Score:{" "}
                            {s.total_score.toFixed(1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      No subject performance data available.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
