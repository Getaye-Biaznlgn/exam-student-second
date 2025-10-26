"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export interface Question {
  id: string;
  question_text: string;
  image_url?: string | null;
  options: {
    id: string;
    option_key?: string;
    option_text: string;
  }[];
}

interface ExamQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  /** NEW PROPS */
  isPracticeMode?: boolean;
  correctOptionKey?: string | null;
}

export function ExamQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isPracticeMode = false,
  correctOptionKey = null,
}: ExamQuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
        </div>

        <h2 className="text-xl font-semibold leading-relaxed">
          {questionNumber}. {/* MODIFIED: Render HTML content */}
          <span dangerouslySetInnerHTML={{ __html: getHtmlContent(question.question_text) }} />
        </h2>

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

              // --- Color logic ---
              const isCorrect =
                isPracticeMode &&
                selectedOption !== null &&
                option.option_key === correctOptionKey;
              const isIncorrect =
                isPracticeMode &&
                selectedOption !== null &&
                isSelected &&
                option.option_key !== correctOptionKey;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer",
                    // Default styling
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                    // Show feedback colors only AFTER a selection is made
                    isCorrect && "border-green-500 bg-green-100/50",
                    isIncorrect && "border-red-500 bg-red-100/50"
                  )}
                  onClick={() => onSelectOption(option.id)}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer font-normal leading-normal"
                  >
                    {/* MODIFIED: Render HTML content */}
                    <span dangerouslySetInnerHTML={{ __html: getHtmlContent(option.option_text) }} />
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
