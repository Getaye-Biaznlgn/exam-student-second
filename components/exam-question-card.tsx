"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// import type { Question } from "@/lib/types" // Assuming Question type is defined in @/lib/types
import { cn } from "@/lib/utils";

/**
 * Defines the type for a single question.
 * Adjust this based on your actual data structure from `@/lib/types`.
 */
export interface Question {
  id: string;
  question_text: string;
  image_url?: string | null;
  options: {
    id: string;
    option_key?: string; // Added option_key as it's often useful
    option_text: string;
  }[];
}

interface ExamQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
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
        {/* This badge shows the progress, e.g., "Question 5 of 20" */}
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
        </div>

        {/* --- MODIFICATION --- */}
        {/* Prepended the question number to the question text */}
        <h2 className="text-xl font-semibold leading-relaxed">
          {questionNumber}. {question.question_text}
        </h2>
        {/* --- END MODIFICATION --- */}

        {question.image_url && (
          <div className="flex justify-center mt-4">
            <img
              src={question.image_url}
              alt="Question diagram"
              className="max-w-full h-auto max-h-64 rounded-lg border shadow-sm"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption || ""} onValueChange={onSelectOption}>
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer", // Note: items-start for long labels
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => onSelectOption(option.id)}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="mt-1"
                  />{" "}
                  {/* Aligns radio button with text */}
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer font-normal leading-normal"
                  >
                    {option.option_text}
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
