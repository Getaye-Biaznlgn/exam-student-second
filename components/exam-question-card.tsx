"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Question } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ExamQuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedOption: string | null
  onSelectOption: (optionId: string) => void
}

export function ExamQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
}: ExamQuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
        </div>
        <h2 className="text-xl font-semibold leading-relaxed">{question.question_text}</h2>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption || ""} onValueChange={onSelectOption}>
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  )}
                  onClick={() => onSelectOption(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                    {option.option_text}
                  </Label>
                </div>
              )
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
