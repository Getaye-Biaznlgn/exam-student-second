"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import Image from "next/image";
import {
  startExam,
  StartExamResponse,
  submitExam,
  submitAnswer,
} from "@/lib/api";
import { ExamQuestionCard } from "@/components/exam-question-card";
import { ExamTimer } from "@/components/exam-timer";
import { Progress } from "@/components/ui/progress";

export default function ExamPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examData, setExamData] = useState<StartExamResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Stores option.id (e.g., "742c59f8-9d47-4d57-baca-22b9cf66b1a0") keyed by question.id
  const [flagged, setFlagged] = useState<Set<string>>(new Set()); // Keyed by question.id
  const timeSpentRef = useRef<Record<string, number>>({}); // Changed to ref for synchronous updates
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track time spent on the current question
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const examId = searchParams.get("exam_id");
    const mode = searchParams.get("mode");

    if (!examId || (mode !== "exam" && mode !== "practice")) {
      setError("Invalid exam ID or mode provided.");
      setIsLoading(false);
      return;
    }

    async function fetchExam() {
      try {
        const res = await startExam({ exam_id: examId, mode });
        if (res.success && res.data) {
          setExamData(res.data);
        } else {
          setError(res.message || "Failed to start the exam.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExam();
  }, [searchParams]);

  const examDetails = examData?.exam;
  const questions = examData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const duration = examDetails?.duration_minutes || 0;

  // Start timer for current question
  useEffect(() => {
    if (examStarted && currentQuestion) {
      startTimeRef.current = Date.now();
      timeRef.current = setInterval(() => {
        timeSpentRef.current = {
          ...timeSpentRef.current,
          [currentQuestion.question.id]:
            Math.floor((Date.now() - startTimeRef.current) / 1000) +
            (timeSpentRef.current[currentQuestion.question.id] || 0),
        };
      }, 1000);

      return () => {
        if (timeRef.current) {
          clearInterval(timeRef.current);
        }
      };
    }
  }, [currentQuestionIndex, examStarted, currentQuestion]);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-4">Loading Exam...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!user || !examData || !examDetails) return null;

  const handleAnswer = async (optionId: string) => {
    if (currentQuestion) {
      // Find the option_key (e.g., "D") for the selected optionId
      const selectedOptionKey =
        currentQuestion.question.options.find((opt) => opt.id === optionId)
          ?.option_key || null;

      if (selectedOptionKey) {
        // Update local answers state with option.id
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.question.id]: optionId,
        }));

        // Send answer to backend with option_key
        try {
          const answerPayload = {
            question_id: currentQuestion.question.id, // Use inner question.id
            selected_option: selectedOptionKey,
            time_spent_seconds:
              timeSpentRef.current[currentQuestion.question.id] || 0,
            is_flagged: flagged.has(currentQuestion.question.id),
          };

          const res = await submitAnswer(answerPayload);
          if (!res.success) {
            console.error("Failed to submit answer:", res.message);
            // Optionally, add toast notification here
          }
        } catch (err) {
          console.error("Error submitting answer:", err);
          // Optionally, add toast notification here
        }
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const toggleFlag = async () => {
    if (currentQuestion) {
      setFlagged((prev) => {
        const newFlagged = new Set(prev);
        if (newFlagged.has(currentQuestion.question.id)) {
          newFlagged.delete(currentQuestion.question.id);
        } else {
          newFlagged.add(currentQuestion.question.id);
        }
        return newFlagged;
      });

      // Find the option_key for the current answer (if any)
      const selectedOptionId = answers[currentQuestion.question.id];
      const selectedOptionKey = selectedOptionId
        ? currentQuestion.question.options.find(
            (opt) => opt.id === selectedOptionId
          )?.option_key || null
        : null;

      // Send updated flag status to backend
      try {
        const answerPayload = {
          question_id: currentQuestion.question.id, // Use inner question.id
          selected_option: selectedOptionKey,
          time_spent_seconds:
            timeSpentRef.current[currentQuestion.question.id] || 0,
          is_flagged: !flagged.has(currentQuestion.question.id), // Updated flag status
        };

        const res = await submitAnswer(answerPayload);
        if (!res.success) {
          console.error("Failed to update flag:", res.message);
        }
      } catch (err) {
        console.error("Error updating flag:", err);
      }
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Update time spent for the current question before submitting
    if (currentQuestion) {
      const now = Date.now();
      timeSpentRef.current[currentQuestion.question.id] =
        (timeSpentRef.current[currentQuestion.question.id] || 0) +
        Math.floor((now - startTimeRef.current) / 1000);
    }

    try {
      const modifiedQuestions = questions.map((q) => {
        const selectedOptionId = answers[q.question.id];
        const selectedOptionKey = selectedOptionId
          ? q.question.options.find((opt) => opt.id === selectedOptionId)
              ?.option_key || null
          : null;
        return {
          ...q,
          selected_option: selectedOptionKey,
          time_spent_seconds: timeSpentRef.current[q.question.id] || 0,
          is_flagged: flagged.has(q.question.id),
        };
      });

      const res = await submitExam(examData.student_exam_id, modifiedQuestions);
      if (res.success) {
        setExamCompleted(true);
      } else {
        const errorMessage =
          typeof res.message === "string"
            ? res.message
            : JSON.stringify(res.message);
        setError(errorMessage || "Failed to submit exam.");
      }
    } catch (err) {
      setError("An unexpected error occurred while submitting.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <h1 className="text-3xl font-bold">{examDetails.title}</h1>
          <p>Total Questions: {examDetails.total_questions}</p>
          <p>Duration: {examDetails.duration_minutes} minutes</p>
          <p>Passing Marks: {examDetails.passing_marks}</p>
          <Button
            className="w-full mt-6"
            size="lg"
            onClick={() => setExamStarted(true)}
          >
            Start Exam
          </Button>
        </Card>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 text-center">
          <h1 className="text-3xl font-bold">Exam Submitted!</h1>
          <p className="text-muted-foreground mt-2">
            Your results will be processed and available in your dashboard.
          </p>
          <Button className="mt-6" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b p-4">
        <div className="text-sm text-muted-foreground">{examDetails.title}</div>
        <ExamTimer durationMinutes={duration} onTimeUp={handleTimeUp} />
        <Progress value={progress} className="mt-2" />
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <ExamQuestionCard
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedOption={answers[currentQuestion.question.id] || null}
              onSelectOption={handleAnswer}
            />
            <div className="flex justify-between mt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={toggleFlag}
                variant={
                  flagged.has(currentQuestion.question.id)
                    ? "default"
                    : "outline"
                }
              >
                <Flag className="mr-2 h-4 w-4" />
                {flagged.has(currentQuestion.question.id) ? "Unflag" : "Flag"}
              </Button>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                </Button>
              )}
            </div>
          </div>
          <div className="hidden lg:block w-80">
            <Card className="p-4 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <Button
                    key={q.question.id}
                    variant={
                      currentQuestionIndex === index
                        ? "default"
                        : answers[q.question.id]
                        ? "secondary"
                        : flagged.has(q.question.id)
                        ? "destructive"
                        : "outline"
                    }
                    className={`h-10 w-10 ${
                      currentQuestionIndex === index
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : answers[q.question.id]
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : flagged.has(q.question.id)
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-black"
                    }`}
                    onClick={() => handleQuestionJump(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
