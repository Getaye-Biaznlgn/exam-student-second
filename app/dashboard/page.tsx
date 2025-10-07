"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, TrendingUp, Award, ArrowRight, Brain } from "lucide-react"
import Link from "next/link"
import { mockExams } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  // Mock stats - in production, these would come from API
  const stats = {
    totalQuestions: 1250,
    questionsAttempted: 487,
    averageScore: 78,
    studyStreak: 12,
  }

  const recentExams = mockExams.slice(0, 3)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Dashboard" description="Welcome back! Ready to continue your preparation?" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.questionsAttempted}</div>
              <p className="text-xs text-muted-foreground">of {stats.totalQuestions} total</p>
              <Progress value={(stats.questionsAttempted / stats.totalQuestions) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
              <Progress value={stats.averageScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.studyStreak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Practice Mode</CardTitle>
                  <CardDescription>Self-paced learning with AI tutor support</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/practice">
                <Button className="w-full">
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>Exam Mode</CardTitle>
                  <CardDescription>Timed simulations to test your readiness</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/exams">
                <Button variant="secondary" className="w-full">
                  Take Exam
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Available Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Available Exams</CardTitle>
            <CardDescription>Choose an exam to start practicing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{exam.title}</h3>
                    <p className="text-sm text-muted-foreground">{exam.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {exam.questions.length} questions
                      </span>
                      {exam.duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exam.duration_minutes} min
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {exam.total_marks} marks
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/practice?exam=${exam.id}`}>
                      <Button variant="outline" size="sm">
                        Practice
                      </Button>
                    </Link>
                    <Link href={`/exams/${exam.id}`}>
                      <Button size="sm">Start Exam</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
