"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Flag } from "lucide-react"
import Image from "next/image"
import { mockExams } from "@/lib/mock-data"
import { ExamQuestionCard } from "@/components/exam-question-card"
import { ExamTimer } from "@/components/exam-timer"
import { Progress } from "@/components/ui/progress"

export default function ExamPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const field = searchParams.get("field")
  const subject = searchParams.get("subject")
  const batch = searchParams.get("batch")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [examStarted, setExamStarted] = useState(false)
  const [examCompleted, setExamCompleted] = useState(false)

  // Get exam based on filters
  const exam =
    mockExams.find((e) => e.field === field && e.subject_id === subject && e.batch === Number(batch)) || mockExams[0]

  const questions = exam.questions
  const currentQuestion = questions[currentQuestionIndex]
  const duration = exam.duration_minutes || 120

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

  const handleAnswer = (optionId: string) => {
    if (currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
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

  const handleSubmit = () => {
    setExamCompleted(true)
  }

  const handleTimeUp = () => {
    setExamCompleted(true)
  }

  const calculateResults = () => {
    let correct = 0
    let incorrect = 0
    let unanswered = 0

    questions.forEach((q) => {
      const userAnswer = answers[q.id]
      if (!userAnswer) {
        unanswered++
      } else {
        const selectedOption = q.options.find(opt => opt.id === userAnswer)
        if (selectedOption?.is_correct) {
          correct++
        } else {
          incorrect++
        }
      }
    })

    return { correct, incorrect, unanswered, total: questions.length }
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-2xl p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{exam.title}</h1>
                <p className="text-muted-foreground">{exam.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Field</p>
                  <p className="font-semibold capitalize">{exam.field} Sciences</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Batch/Year</p>
                  <p className="font-semibold">{exam.batch}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-semibold">{questions.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{duration} minutes</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-6">
                <h3 className="font-semibold">Instructions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>The exam will be timed for {duration} minutes</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>You can navigate between questions using the question navigator</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>You can flag questions for review</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Submit your exam before time runs out</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Results will be shown after submission</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full" size="lg" onClick={() => setExamStarted(true)}>
                Start Exam
              </Button>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  if (examCompleted) {
    const results = calculateResults()
    const percentage = Math.round((results.correct / results.total) * 100)

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-12 w-24 rounded-lg overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="SmartPrep Logo" 
                  width={150} 
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-2xl p-8">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Exam Completed!</h1>
                <p className="text-muted-foreground">Here are your results</p>
              </div>

              <div className="py-8">
                <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
                <p className="text-muted-foreground">Overall Score</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-accent/10">
                  <div className="text-2xl font-bold text-accent-foreground">{results.correct}</div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10">
                  <div className="text-2xl font-bold text-destructive">{results.incorrect}</div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="text-2xl font-bold">{results.unanswered}</div>
                  <p className="text-sm text-muted-foreground">Unanswered</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={() => router.push("/select-field")}>
                  Back to Home
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.location.reload()}>
                  Retake Exam
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Exam Header */}
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {exam.title} • Batch {exam.batch}
            </div>
            <div className="flex items-center gap-4">
              <ExamTimer durationMinutes={duration} onTimeUp={handleTimeUp} />
              <Button onClick={handleSubmit} size="sm">
                Submit Exam
              </Button>
            </div>
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
            <ExamQuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedOption={answers[currentQuestion.id] || null}
              onSelectOption={handleAnswer}
            />

            {/* Navigation Buttons */}
            <Card className="mt-6">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious} 
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFlag(currentQuestion.id)}
                      className={flagged.has(currentQuestion.id) ? "bg-destructive/10 text-destructive" : ""}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      {flagged.has(currentQuestion.id) ? "Unflag" : "Flag"}
                    </Button>
                  </div>

                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button 
                      onClick={handleSubmit}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      Submit Exam
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNext} 
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Question Navigator - Right Side */}
          <div className="hidden lg:block w-80">
            <Card className="p-4 sticky top-24">
              <h3 className="font-semibold mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const isAnswered = !!answers[q.id]
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
