"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface ExamQuestionCardProps {
  question: {
    id: string;
    question_text: string;
    options: {
      id: string;
      option_key?: string;
      option_text: string;
      is_correct?: boolean;
    }[];
  };
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  onClearChoice?: () => void;
  remainingTime: number;
  mode?: "exam" | "practice";
}

export function ExamQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onClearChoice,
  remainingTime,
  mode = "exam",
}: ExamQuestionCardProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime);
  const [answered, setAnswered] = useState(false);
  const [localSelection, setLocalSelection] = useState<string | null>(
    selectedOption
  );

  useEffect(() => setTimeLeft(remainingTime), [remainingTime]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft((prev) => Math.max(0, prev - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleOptionSelect = (optionId: string) => {
    setLocalSelection(optionId);
    if (mode === "practice") setAnswered(true);
    onSelectOption(optionId);
  };

  const handleClearChoice = () => {
    setLocalSelection(null);
    setAnswered(false);
    if (onClearChoice) onClearChoice();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-50 py-10">
      {/* Timer */}
      <div className="w-full max-w-3xl flex justify-end mb-4 pr-4">
        <div className="bg-white border rounded-md px-4 py-2 text-sm font-medium shadow-sm">
          Time left:{" "}
          <span
            className={`font-semibold ${
              timeLeft <= 300 ? "text-red-600" : "text-gray-800"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <Card className="w-full max-w-3xl shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            {/* Question */}
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">
                <span
                  dangerouslySetInnerHTML={{
                    __html: question.question_text || "",
                  }}
                />
              </h2>
              <p className="text-sm text-gray-500">
                ({questionNumber}/{totalQuestions})
              </p>
            </div>

            {/* Options */}
            <div className="mt-4">
              <RadioGroup
                value={localSelection || ""}
                onValueChange={(value) => handleOptionSelect(value)}
              >
                {question.options.map((opt) => {
                  const isSelected = localSelection === opt.id;
                  const isCorrect = opt.is_correct;
                  const showFeedback = mode === "practice" && answered;

                  const optionClasses = cn(
                    "flex items-center space-x-3 mb-3 rounded-md transition-colors select-none",
                    showFeedback && isCorrect && "bg-green-100/50",
                    showFeedback && isSelected && !isCorrect && "bg-red-100/50",
                    !showFeedback &&
                      (isSelected ? "bg-primary/5" : "hover:bg-gray-100")
                  );

                  return (
                    <div key={opt.id} className={optionClasses}>
                      {/* Only radio is clickable */}
                      <RadioGroupItem
                        id={opt.id}
                        value={opt.id}
                        className="cursor-pointer"
                      />
                      {/* Label NOT clickable */}
                      <div className="text-gray-800 select-none pointer-events-none">
                        {opt.option_key ? `${opt.option_key}. ` : ""}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: opt.option_text || "",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Clear choice (left side) */}
            <div className="mt-3 text-left">
              <button
                onClick={handleClearChoice}
                className="text-sm text-blue-600 hover:underline"
                type="button"
              >
                Clear my choice
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
