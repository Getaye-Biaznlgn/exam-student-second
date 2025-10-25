"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Extracts base64 <img> src from HTML string (if present).
 */
function extractBase64Image(
  htmlString: string | null | undefined
): string | null {
  if (!htmlString) return null;
  const match = htmlString.match(/<img[^>]+src=["'](data:image\/[^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Removes image tags but keeps other HTML for rendering text.
 */
function removeImageTags(htmlString: string | null | undefined): string {
  if (!htmlString) return "";
  return htmlString.replace(/<img[^>]*>/gi, "");
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
  // Extract image from HTML or fallback to image_url
  const embeddedImage = extractBase64Image(question.question_text);
  const displayImage = embeddedImage || question.image_url || null;
  const questionTextWithoutImage = removeImageTags(question.question_text);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
        </div>

        <h2
          className="text-xl font-semibold leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: `${questionNumber}. ${questionTextWithoutImage}`,
          }}
        />

        {displayImage && (
          <div className="flex justify-center mt-4">
            <img
              src={displayImage}
              alt="Question illustration"
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
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
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
                    className="flex-1 cursor-pointer font-normal leading-normal prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: option.option_text }}
                  />
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
