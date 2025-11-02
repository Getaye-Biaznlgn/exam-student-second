"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Brain,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchStudentDashboard } from "@/lib/api";
import type { StudentDashboardResponse } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<StudentDashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetchStudentDashboard();
        if (res.success && res.data) {
          setDashboard(res.data);
        } else {
          setError(res.message || "Failed to load dashboard data");
        }
      } catch (err: any) {
        setError("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>{error || "No dashboard data available."}</p>
        <Button onClick={() => location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const overview = dashboard.performance_overview;

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Dashboard"
        description={`Welcome back${
          user?.name ? `, ${user.name}` : ""
        }! Here’s your latest progress.`}
      />

      <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Questions Attempted */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Questions Attempted
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {overview.total_questions_attempted}
              </div>
              <p className="text-xs text-muted-foreground">
                Correct: {overview.correct_answers}
              </p>
              <Progress
                value={overview.accuracy_percentage * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {overview.overall_average_score.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Accuracy: {(overview.accuracy_percentage * 100).toFixed(1)}%
              </p>
              <Progress
                value={overview.overall_average_score}
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Completed Exams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Completed Exams
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {overview.completed_exams} / {overview.total_exams_taken}
              </div>
              <p className="text-xs text-muted-foreground">Keep going!</p>
            </CardContent>
          </Card>

          {/* Time Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Time Efficiency
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {dashboard.time_management.efficiency_rating}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboard.time_management.time_comparison}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg">Practice Mode</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Self-paced learning with AI tutor support
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/select-subject">
                <Button className="w-full text-sm sm:text-base">
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg">Exam Mode</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Timed simulations to test your readiness
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/select-subject">
                <Button variant="secondary" className="w-full text-sm sm:text-base">
                  Take Exam
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
