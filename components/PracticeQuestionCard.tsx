"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    correct_option: string; // ← key like "B"
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
    setLocalSelection(optionId);
    setAnswered(true);
    onSelectOption(optionId);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-50 py-10">
      {/* Timer */}
      <div className="w-full max-w-3xl flex justify-end mb-4 pr-4">
        <div className="bg-white border rounded-md px-4 py-2 text-sm font-medium shadow-sm">
          Time left:{" "}
          <span className="font-semibold text-gray-800">
            {Math.floor(remainingTime / 60)
              .toString()
              .padStart(2, "0")}
            :{(remainingTime % 60).toString().padStart(2, "0")}
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
                {question.options
                  .slice() // make a copy (to avoid mutating original)
                  .sort((a, b) =>
                    (a.option_key ?? "").localeCompare(b.option_key ?? "")
                  )
                  .map((opt) => {
                    const isSelected = localSelection === opt.id;
                    const isCorrect =
                      opt.option_key === question.correct_option;
                    const showFeedback = answered;

                    const optionClasses = cn(
                      "flex items-center space-x-3 mb-3 rounded-md transition-colors select-none py-2 px-3 cursor-pointer",
                      showFeedback &&
                        isCorrect &&
                        "bg-green-100 border border-green-400",
                      showFeedback &&
                        isSelected &&
                        !isCorrect &&
                        "bg-red-100 border border-red-400",
                      !showFeedback &&
                        (isSelected
                          ? "bg-primary/5 border border-primary/20"
                          : "hover:bg-gray-100 border border-transparent")
                    );

                    return (
                      <div key={opt.id} className={optionClasses}>
                        <RadioGroupItem
                          id={opt.id}
                          value={opt.id}
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor={opt.id}
                          className="flex items-center text-gray-800 select-none cursor-pointer"
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
        </CardContent>
      </Card>
    </div>
  );
}
