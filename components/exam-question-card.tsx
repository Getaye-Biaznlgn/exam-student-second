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
    if (localSelection) return;
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

      {/* Main Card */}
      <Card className="w-full max-w-3xl shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            {/* Question Header */}
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
              <RadioGroup value={localSelection || ""}>
                {question.options
                  .slice()
                  .sort((a, b) =>
                    (a.option_key ?? "").localeCompare(b.option_key ?? "")
                  )
                  .map((opt, idx, arr) => {
                    const isSelected = localSelection === opt.id;
                    const isCorrect = opt.is_correct;
                    const showFeedback = mode === "practice" && answered;

                    const optionClasses = cn(
                      "flex items-start gap-3 py-2 px-3 mb-3 rounded-md transition-colors select-none border",
                      showFeedback &&
                        isCorrect &&
                        "bg-green-100/50 border-green-300",
                      showFeedback &&
                        isSelected &&
                        !isCorrect &&
                        "bg-red-100/50 border-red-300",
                      !showFeedback &&
                        (isSelected
                          ? "bg-primary/5 border-primary/20"
                          : "hover:bg-gray-100 border-transparent"),
                      localSelection &&
                        localSelection !== opt.id &&
                        "opacity-50 cursor-not-allowed"
                    );

                    return (
                      <div
                        key={opt.id}
                        className={optionClasses}
                        onClick={() => {
                          if (!localSelection) handleOptionSelect(opt.id);
                        }}
                      >
                        <RadioGroupItem
                          id={opt.id}
                          value={opt.id}
                          disabled={
                            !!localSelection && localSelection !== opt.id
                          }
                          className="mt-1 cursor-pointer data-[state=checked]:cursor-not-allowed"
                        />
                        <label
                          htmlFor={opt.id}
                          className="flex items-start text-gray-800 select-none cursor-pointer flex-1"
                        >
                          {opt.option_key && (
                            <span className="font-medium mr-2 shrink-0">
                              {opt.option_key}.
                            </span>
                          )}
                          <span
                            className="flex-1"
                            dangerouslySetInnerHTML={{
                              __html: opt.option_text || "",
                            }}
                          />
                        </label>
                      </div>
                    );
                  })}
              </RadioGroup>
            </div>

            {/* Clear choice button */}
            <div className="mt-3 text-left">
              <button
                onClick={handleClearChoice}
                className="text-sm text-blue-600 hover:underline transition"
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
