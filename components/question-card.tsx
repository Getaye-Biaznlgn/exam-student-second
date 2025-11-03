"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Lightbulb, Brain } from "lucide-react"
import type { Question } from "@/lib/types"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AITutorDialog } from "./ai-tutor-dialog"

/**
 * Safely renders HTML content.
 * @param htmlString The HTML content to render.
 * @returns The HTML content or empty string if invalid.
 */
function getHtmlContent(htmlString: string | null | undefined): string {
  if (typeof htmlString !== "string") {
    return "";
  }
  return htmlString.trim();
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer: (questionId: string, optionId: string, isCorrect: boolean) => void
  showExplanation?: boolean
  currentAnswer?: { optionId: string; isCorrect: boolean } | null
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showExplanation = true,
  currentAnswer = null,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(currentAnswer?.optionId || null)
  const [hasAnswered, setHasAnswered] = useState(!!currentAnswer)
  const [showHint, setShowHint] = useState(false)
  const [showAITutor, setShowAITutor] = useState(false)

  // Update component state when currentAnswer changes
  useEffect(() => {
    setSelectedOption(currentAnswer?.optionId || null)
    setHasAnswered(!!currentAnswer)
  }, [currentAnswer])

  const handleSubmit = () => {
    if (!selectedOption) return

    const option = question.options.find((opt) => opt.id === selectedOption)
    if (option) {
      setHasAnswered(true)
      onAnswer(question.id, selectedOption, option.is_correct)
    }
  }

  const correctOption = question.options.find((opt) => opt.is_correct)

  return (
    <>
      <Card className="w-full">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            <Badge variant="secondary">Difficulty: {question.difficulty_level}/5</Badge>
          </div>
          <h2 className="text-xl font-semibold leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: getHtmlContent(question.question_text) }} />
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} disabled={hasAnswered}>
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = selectedOption === option.id
                const isCorrect = option.is_correct
                const showResult = hasAnswered

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg border-2 p-4 transition-all",
                      !showResult && "border-border hover:border-primary/50 cursor-pointer",
                      showResult && isCorrect && "border-green-500 bg-green-500/10",
                      showResult && !isCorrect && isSelected && "border-red-500 bg-red-500/10",
                      showResult && !isCorrect && !isSelected && "border-border opacity-50",
                    )}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                      <span dangerouslySetInnerHTML={{ __html: getHtmlContent(option.option_text) }} />
                    </Label>
                    {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {showResult && !isCorrect && isSelected && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                )
              })}
            </div>
          </RadioGroup>

          {!hasAnswered && (
            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={!selectedOption} className="flex-1">
                Submit Answer
              </Button>
              {showExplanation && question.explanation && (
                <Button variant="outline" onClick={() => setShowHint(!showHint)}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Hint
                </Button>
              )}
              {showExplanation && (
                <Button variant="outline" onClick={() => setShowAITutor(true)}>
                  <Brain className="h-4 w-4 mr-2" />
                  AI Tutor
                </Button>
              )}
            </div>
          )}

          {showHint && !hasAnswered && question.explanation && (
            <div className="rounded-lg bg-accent/50 p-4 border border-accent">
              <div className="flex gap-2 items-start">
                <Lightbulb className="h-5 w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Hint</p>
                  <p className="text-sm text-muted-foreground">
                    <span dangerouslySetInnerHTML={{ __html: getHtmlContent(question.explanation) }} />
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasAnswered && showExplanation && question.explanation && (
            <div
              className={cn(
                "rounded-lg p-4 border",
                correctOption?.id === selectedOption
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-blue-500/10 border-blue-500/50",
              )}
            >
              <div className="flex gap-2 items-start">
                <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm">Explanation</p>
                  <p className="text-sm leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: getHtmlContent(question.explanation) }} />
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setShowAITutor(true)} className="mt-2">
                    <Brain className="h-4 w-4 mr-2" />
                    Ask AI Tutor for more help
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AITutorDialog open={showAITutor} onOpenChange={setShowAITutor} question={question} />
    </>
  )
}
