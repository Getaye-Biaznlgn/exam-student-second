"use client";

import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface PracticeQuestionCardProps {
  question: {
    id: string;
    question_text: string;
    options: {
      id: string;
      option_key?: string;
      option_text: string;
    }[];
    correct_option: string;
  };
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  remainingTime: number;
}

export function PracticeQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  remainingTime,
}: PracticeQuestionCardProps) {
  const [answered, setAnswered] = useState(false);
  const [localSelection, setLocalSelection] = useState<string | null>(
    selectedOption
  );

  const handleOptionSelect = (optionId: string) => {
    if (answered) return; // Prevent any change after answer

    setLocalSelection(optionId);
    setAnswered(true);
    onSelectOption(optionId);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-50 py-8 px-3">
      {/* Timer */}
      <div className="w-full max-w-2xl flex justify-end mb-3">
        <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm font-medium shadow-sm">
          Time left:{" "}
          <span className="font-semibold text-gray-800">
            {formatTime(remainingTime)}
          </span>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="w-full max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-5 pb-0 shadow-sm">
        {/* Question Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
            <span
              dangerouslySetInnerHTML={{
                __html: question.question_text || "",
              }}
            />
          </h2>
          <p className="text-sm text-gray-500 whitespace-nowrap ml-3">
            ({questionNumber}/{totalQuestions})
          </p>
        </div>

        {/* Options */}
        <div className="mt-3 space-y-2">
          <RadioGroup
            value={localSelection || ""}
            onValueChange={answered ? undefined : handleOptionSelect}
            disabled={answered}
          >
            {question.options
              .slice()
              .sort((a, b) =>
                (a.option_key ?? "").localeCompare(b.option_key ?? "")
              )
              .map((opt, idx, arr) => {
                const isSelected = localSelection === opt.id;
                const isCorrect = opt.option_key === question.correct_option;
                const showFeedback = answered;

                const optionClasses = cn(
                  "flex items-center space-x-3 rounded-md transition-colors select-none py-2 px-3 cursor-pointer border text-sm sm:text-base",
                  showFeedback && isCorrect && "bg-green-100 border-green-400",
                  showFeedback &&
                    isSelected &&
                    !isCorrect &&
                    "bg-red-100 border-red-400",
                  !showFeedback &&
                    (isSelected
                      ? "bg-primary/5 border-primary/20"
                      : "hover:bg-gray-100 border-transparent"),
                  answered && "cursor-not-allowed opacity-90",
                  idx === arr.length - 1 ? "mb-0" : "mb-2" // remove bottom space after last option
                );

                return (
                  <div key={opt.id} className={optionClasses}>
                    <RadioGroupItem
                      id={opt.id}
                      value={opt.id}
                      disabled={answered}
                      className="cursor-pointer data-[state=checked]:cursor-not-allowed"
                    />
                    <label
                      htmlFor={opt.id}
                      className={cn(
                        "flex items-center text-gray-800 select-none cursor-pointer flex-1",
                        answered && "cursor-not-allowed"
                      )}
                    >
                      {opt.option_key && (
                        <span className="font-medium mr-2">
                          {opt.option_key}.
                        </span>
                      )}
                      <span
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
      </div>
    </div>
  );
}
