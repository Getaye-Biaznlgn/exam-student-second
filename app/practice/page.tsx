"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card"
import { BookOpen, ArrowRight, ArrowLeft, Flag } from "lucide-react"
import { mockExams } from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"

export default function PracticePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const field = searchParams.get("field")
  const subject = searchParams.get("subject")
  const batch = searchParams.get("batch")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, { optionId: string; isCorrect: boolean }>>(new Map())
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  const exam =
    mockExams.find((e) => e.field === field && e.subject_id === subject && e.batch === Number(batch)) || mockExams[0]

  const questions = exam.questions
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const handleAnswer = (questionId: string, optionId: string, isCorrect: boolean) => {
    setAnswers(new Map(answers.set(questionId, { optionId, isCorrect })))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => {
      const newFlagged = new Set(prev)
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId)
      } else {
        newFlagged.add(questionId)
      }
      return newFlagged
    })
  }

  const answeredCount = answers.size
  const progress = (answeredCount / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Practice Header */}
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {exam.title} • Batch {exam.batch}
            </div>
            <Button onClick={() => router.push("/select-field")} size="sm" variant="outline">
              Exit Practice
            </Button>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                Progress: {answeredCount} of {questions.length}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Question Area */}
          <div className="flex-1">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              showExplanation={true}
              currentAnswer={answers.get(currentQuestion.id) || null}
            />

            {/* Navigation */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>

                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={() => router.push("/select-field")}>Finish Practice</Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigator - Right Side */}
          <div className="hidden lg:block w-80">
            <Card className="p-4 sticky top-24">
              <h3 className="font-semibold mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const isAnswered = answers.has(q.id)
                  const isCurrent = index === currentQuestionIndex
                  const isFlagged = flagged.has(q.id)

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`
                        aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium
                        transition-all relative
                        ${
                          isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : isAnswered
                              ? "border-accent bg-accent/10 text-accent-foreground hover:bg-accent/20"
                              : "border-border hover:border-primary/50 hover:bg-muted"
                        }
                      `}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="h-3 w-3 absolute -top-1 -right-1 fill-destructive text-destructive" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded border-2 border-primary bg-primary"></div>
                  <span className="text-muted-foreground">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded border-2 border-accent bg-accent/10"></div>
                  <span className="text-muted-foreground">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded border-2 border-border"></div>
                  <span className="text-muted-foreground">Unanswered</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
