"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Award, ArrowRight } from "lucide-react"
import { mockExams } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function ExamsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const availableExams = mockExams.filter((exam) => exam.field === user?.field)

  const handleStartExam = (examId: string) => {
    router.push(`/exams/${examId}`)
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Exam Mode" description="Timed simulations to test your readiness" />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Exams</CardTitle>
              <CardDescription>Choose an exam to start a timed simulation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
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
                  <Button onClick={() => handleStartExam(exam.id)}>
                    Start Exam
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
