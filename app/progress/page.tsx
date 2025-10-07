"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ProgressPage() {
  const { user } = useAuth()

  // Mock progress data - in production, this would come from API
  const overallStats = {
    totalQuestions: 1250,
    questionsAttempted: 487,
    correctAnswers: 380,
    averageScore: 78,
    studyStreak: 12,
    totalTimeSpent: 1470, // minutes
    strongestSubject: "Mathematics",
    weakestSubject: "Chemistry",
  }

  const subjectProgress = [
    { subject: "Mathematics", attempted: 120, correct: 102, accuracy: 85, avgTime: 2.5 },
    { subject: "Physics", attempted: 95, correct: 76, accuracy: 80, avgTime: 3.2 },
    { subject: "Chemistry", attempted: 88, correct: 62, accuracy: 70, avgTime: 3.8 },
    { subject: "Biology", attempted: 110, correct: 88, accuracy: 80, avgTime: 2.8 },
    { subject: "English", attempted: 74, correct: 52, accuracy: 70, avgTime: 2.1 },
  ]

  const weeklyProgress = [
    { week: "Week 1", score: 65, questions: 45 },
    { week: "Week 2", score: 70, questions: 52 },
    { week: "Week 3", score: 72, questions: 58 },
    { week: "Week 4", score: 75, questions: 64 },
    { week: "Week 5", score: 78, questions: 71 },
  ]

  const recentExams = [
    {
      id: "1",
      title: "Mathematics Practice Test 1",
      date: "2025-01-05",
      score: 85,
      totalQuestions: 50,
      correctAnswers: 42,
      timeSpent: 55,
    },
    {
      id: "2",
      title: "Natural Sciences Mock Exam",
      date: "2025-01-03",
      score: 72,
      totalQuestions: 100,
      correctAnswers: 72,
      timeSpent: 175,
    },
    {
      id: "3",
      title: "Physics Quick Practice",
      date: "2025-01-01",
      score: 80,
      totalQuestions: 25,
      correctAnswers: 20,
      timeSpent: 28,
    },
  ]

  const accuracyRate = Math.round((overallStats.correctAnswers / overallStats.questionsAttempted) * 100)
  const completionRate = Math.round((overallStats.questionsAttempted / overallStats.totalQuestions) * 100)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Progress" description="Track your improvement over time" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overall Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.averageScore}%</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5% from last week</span>
                </div>
                <Progress value={overallStats.averageScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracyRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overallStats.correctAnswers} of {overallStats.questionsAttempted} correct
                </p>
                <Progress value={accuracyRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.studyStreak} days</div>
                <p className="text-xs text-muted-foreground mt-1">Keep the momentum going!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(overallStats.totalTimeSpent / 60)}h</div>
                <p className="text-xs text-muted-foreground mt-1">Total study time</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
              <TabsTrigger value="history">Exam History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Weekly Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                    <CardDescription>Your score trend over the past 5 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Subject Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                    <CardDescription>Accuracy rate by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={subjectProgress}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Strongest Subject
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{overallStats.strongestSubject}</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          85% Accuracy
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You're performing exceptionally well in this subject. Keep up the great work!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      Needs Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{overallStats.weakestSubject}</span>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          70% Accuracy
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Focus more practice time here. Use the AI tutor for additional help.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                  <CardDescription>Detailed breakdown of your performance in each subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {subjectProgress.map((subject) => (
                      <div key={subject.subject} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">{subject.subject}</span>
                          </div>
                          <Badge variant="outline">{subject.accuracy}% Accuracy</Badge>
                        </div>
                        <Progress value={subject.accuracy} className="h-2" />
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>
                              {subject.correct}/{subject.attempted} correct
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>{subject.attempted - subject.correct} incorrect</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{subject.avgTime} min avg</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Exam History</CardTitle>
                  <CardDescription>Your performance in recent practice and exam sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{exam.title}</h3>
                            <Badge
                              variant="outline"
                              className={
                                exam.score >= 80
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : exam.score >= 60
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                              }
                            >
                              {exam.score}%
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(exam.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {exam.correctAnswers}/{exam.totalQuestions} correct
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {exam.timeSpent} min
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {exam.score >= 80 ? (
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                              <Brain className="h-5 w-5 text-yellow-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
