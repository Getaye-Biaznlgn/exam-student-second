"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
// import Image from "next/image"; // Image component is not used, can be removed
import {
  startExam,
  StartExamResponse,
  submitExam,
  submitAnswer,
  fetchAIExplanation, // --- NEW ---
  type AIExplanation, // --- NEW ---
  type AIExplanationResponse, // --- NEW ---
} from "@/lib/api";
import { ExamQuestionCard } from "@/components/exam-question-card";
import { ExamTimer } from "@/components/exam-timer";
import { Progress } from "@/components/ui/progress";

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

export default function ExamPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examData, setExamData] = useState<StartExamResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Stores option.id keyed by question.id
  const [flagged, setFlagged] = useState<Set<string>>(new Set()); // Keyed by question.id
  const timeSpentRef = useRef<Record<string, number>>({});
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [finalResult, setFinalResult] = useState<any>(null);

  // --- NEW: AI Explanation State ---
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentAIExplanation, setCurrentAIExplanation] =
    useState<AIExplanation | null>(null);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  // --- END NEW ---

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

    // --- NEW: Set practice mode ---
    setIsPracticeMode(mode === "practice");
    // --- END NEW ---

    async function fetchExam() {
      try {
        const res = await startExam({ exam_id: examId, mode });
        if (res.success && res.data) {
          setExamData(res.data);

          // --- MODIFICATION ---
          // Per request, do not pre-populate answers to ensure a fresh exam.
          // Reset all answer, flag, and time states.
          setAnswers({});
          setFlagged(new Set());
          timeSpentRef.current = {};
          // --- END MODIFICATION ---
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

      if (timeRef.current) {
        clearInterval(timeRef.current);
      }

      // This interval is just a ticker; time is calculated on action
      timeRef.current = setInterval(() => {}, 1000);

      return () => {
        if (timeRef.current) {
          clearInterval(timeRef.current);
        }
        // Record time when component unmounts or question changes
        const now = Date.now();
        const timeSpent = Math.floor((now - startTimeRef.current) / 1000);

        // Ensure currentQuestion hasn't become undefined
        if (currentQuestion) {
          const qId = currentQuestion.question.id;
          timeSpentRef.current[qId] =
            (timeSpentRef.current[qId] || 0) + timeSpent;
        }
      };
    }
  }, [currentQuestionIndex, examStarted, currentQuestion]);

  // --- NEW: Reset AI Explanation when question changes ---
  useEffect(() => {
    setCurrentAIExplanation(null);
    setAIError(null);
    setIsFetchingAI(false);
  }, [currentQuestionIndex]);
  // --- END NEW ---

  const updateCurrentQuestionTime = () => {
    if (currentQuestion && examStarted) {
      const now = Date.now();
      const timeSpent = Math.floor((now - startTimeRef.current) / 1000);
      const qId = currentQuestion.question.id;
      timeSpentRef.current[qId] = (timeSpentRef.current[qId] || 0) + timeSpent;
      startTimeRef.current = now; // Reset start time
    }
  };

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
      const selectedOptionKey =
        currentQuestion.question.options.find((opt) => opt.id === optionId)
          ?.option_key || null;

      if (selectedOptionKey) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.question.id]: optionId,
        }));

        updateCurrentQuestionTime();

        try {
          const answerPayload = {
            question_id: currentQuestion.question.id,
            selected_option: selectedOptionKey,
            time_spent_seconds:
              timeSpentRef.current[currentQuestion.question.id] || 0,
            is_flagged: flagged.has(currentQuestion.question.id),
          };

          const res = await submitAnswer(answerPayload);

          if (!res.success) {
            console.error("Failed to submit answer:", res.message);
          }
        } catch (err) {
          console.error("Error submitting answer:", err);
        }
      }
    }
  };

  const handleNext = () => {
    updateCurrentQuestionTime();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    updateCurrentQuestionTime();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    updateCurrentQuestionTime();
    setCurrentQuestionIndex(index);
  };

  const toggleFlag = async () => {
    if (currentQuestion) {
      const qId = currentQuestion.question.id;
      const newFlagged = new Set(flagged);
      const isNowFlagged = !flagged.has(qId);

      if (isNowFlagged) {
        newFlagged.add(qId);
      } else {
        newFlagged.delete(qId);
      }
      setFlagged(newFlagged);

      const selectedOptionId = answers[qId];
      const selectedOptionKey = selectedOptionId
        ? currentQuestion.question.options.find(
            (opt) => opt.id === selectedOptionId
          )?.option_key || null
        : null;

      updateCurrentQuestionTime();

      try {
        const answerPayload = {
          question_id: qId,
          selected_option: selectedOptionKey,
          time_spent_seconds: timeSpentRef.current[qId] || 0,
          is_flagged: isNowFlagged,
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

    const unansweredCount = questions.length - Object.keys(answers).length;

    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmed) {
        return;
      }
    }

    setIsSubmitting(true);
    updateCurrentQuestionTime();

    try {
      const modifiedQuestions = questions.map((q) => {
        const selectedOptionId = answers[q.question.id];
        const selectedOptionKey = selectedOptionId
          ? q.question.options.find((opt) => opt.id === selectedOptionId)
              ?.option_key || null
          : null;
        return {
          ...q, // Send the full original question object
          selected_option: selectedOptionKey,
          time_spent_seconds: timeSpentRef.current[q.question.id] || 0,
          is_flagged: flagged.has(q.question.id),
        };
      });

      const res = await submitExam(examData.student_exam_id, modifiedQuestions);

      if (res.success && res.data) {
        setFinalResult(res.data); // Store the result { score: 2.17, ... }
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
    alert("Time is up! Your exam will be submitted automatically.");
    handleSubmit();
  };

  // --- NEW: Handle Review Function ---
  const handleReview = () => {
    // Navigate to a review page, passing the student_exam_id
    // You will need to create a new page at /review
    router.push(`/review?student_exam_id=${examData.student_exam_id}`);
  };
  // --- END NEW ---

  // --- NEW: Handle Fetching AI Explanation ---
  const handleFetchAIExplanation = async () => {
    if (!currentQuestion) return;

    setIsFetchingAI(true);
    setAIError(null);
    setCurrentAIExplanation(null);

    try {
      const res = await fetchAIExplanation(currentQuestion.question.id);
      if (res.success && res.data) {
        const rawExplanation = res.data.explanation;
        let parsedExplanation: AIExplanation | null = null;

        // The real data is in a stringified JSON inside the 'content' field
        if (rawExplanation.content && rawExplanation.content.includes("{")) {
          // 1. Clean the string from markdown fences
          const jsonString = rawExplanation.content
            .replace(/```json\n/g, "")
            .replace(/```/g, "")
            .trim();

          // 2. Parse the nested JSON string
          try {
            parsedExplanation = JSON.parse(jsonString) as AIExplanation;
          } catch (parseError) {
            console.error("Failed to parse AI explanation JSON:", parseError);
            setAIError("Failed to parse AI explanation.");
          }
        } else {
          // Fallback if API sends data directly (less likely based on example)
          parsedExplanation = {
            content: rawExplanation.content,
            steps: rawExplanation.steps || [],
            why_correct: rawExplanation.why_correct || "",
            why_wrong: rawExplanation.why_wrong || "",
            key_concepts: rawExplanation.key_concepts || [],
            tips: rawExplanation.tips || "",
          };
        }

        if (parsedExplanation) {
          setCurrentAIExplanation(parsedExplanation);
        }
      } else {
        setAIError(res.message || "Failed to fetch explanation.");
      }
    } catch (err) {
      console.error("Error fetching AI explanation:", err);
      setAIError("An unexpected error occurred.");
    } finally {
      setIsFetchingAI(false);
    }
  };
  // --- END NEW ---

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

  // --- MODIFIED examCompleted RENDER BLOCK ---
  if (examCompleted) {
    // Check if we have the detailed result data from the backend
    // --- MODIFICATION: Use 'score' instead of 'score_percentage' ---
    const hasResultDetails =
      finalResult && typeof finalResult.score === "number";
    const score = hasResultDetails ? finalResult.score : null;
    // --- END MODIFICATION ---

    // Determine 'passed' status from the backend response
    const passed = finalResult ? finalResult.passed : false;

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 text-center">
          <h1 className="text-3xl font-bold">Exam Submitted!</h1>

          {hasResultDetails ? (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold">Your Result</h2>
              <p
                className={`text-5xl font-bold mt-2 ${
                  passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {/* This will now show "2.2%" from 2.17... */}
                {score.toFixed(1)}%
              </p>

              {/* --- NEW: Show correct answers count --- */}
              <p className="text-lg mt-2 text-muted-foreground">
                You got {finalResult.correct_answers} out of{" "}
                {finalResult.total_questions} correct.
              </p>
              {/* --- END NEW --- */}

              <p className="text-lg mt-2 text-muted-foreground">
                (Passing Mark: {examDetails.passing_marks}%)
              </p>
              <p
                className={`text-xl font-semibold mt-4 ${
                  passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {passed
                  ? "Congratulations, you passed!"
                  : "Unfortunately, you did not pass."}
              </p>
            </div>
          ) : (
            // Fallback message if the backend didn't return a score
            <p className="text-muted-foreground mt-2">
              Your results are being processed.
            </p>
          )}

          {/* --- NEW: Button Group for Review/Home --- */}
          <div className="flex gap-4 justify-center mt-6">
            <Button variant="outline" onClick={handleReview}>
              Review Exam
            </Button>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </div>
          {/* --- END NEW --- */}
        </Card>
      </div>
    );
  }
  // --- END: MODIFIED examCompleted RENDER BLOCK ---

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b p-4 sticky top-0 bg-background z-10">
        <div className="text-sm text-muted-foreground">{examDetails.title}</div>
        <ExamTimer durationMinutes={duration} onTimeUp={handleTimeUp} />
        <Progress value={progress} className="mt-2" />
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <div className="flex-1">
            {currentQuestion && (
              <ExamQuestionCard
                key={currentQuestion.question.id} // Add key for proper re-renders
                question={currentQuestion.question}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                selectedOption={answers[currentQuestion.question.id] || null}
                onSelectOption={handleAnswer}
                isPracticeMode={isPracticeMode}
                correctOptionKey={
                  currentQuestion.question.correct_option || null
                }
              />
            )}

            {/* --- NEW: AI EXPLANATION SECTION --- */}
            {isPracticeMode && (
              <div className="mt-4">
                {!currentAIExplanation && !isFetchingAI && (
                  <Button
                    variant="outline"
                    onClick={handleFetchAIExplanation}
                    disabled={isFetchingAI}
                  >
                    Get AI Explanation
                  </Button>
                )}

                {isFetchingAI && (
                  <div className="flex items-center text-muted-foreground p-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Generating AI Explanation...
                  </div>
                )}

                {aiError && (
                  <p className="text-red-500 text-sm mt-2">{aiError}</p>
                )}

                {currentAIExplanation && (
                  <Card className="p-4 mt-2 border-primary/30 border-dashed bg-muted/20">
                    <h3 className="text-lg font-semibold mb-3 text-primary">
                      ✨ AI Explanation
                    </h3>

                    <h4 className="font-semibold mt-4">Explanation:</h4>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {/* Using the new HTML rendering function */}
                      <span dangerouslySetInnerHTML={{ __html: getHtmlContent(currentAIExplanation.content) }} />
                    </p>

                    <h4 className="font-semibold mt-4">Steps:</h4>
                    <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                      {currentAIExplanation.steps.map((step, index) => (
                        <li key={index} className="whitespace-pre-wrap">
                          {/* Assuming steps are already plain text or Markdown meant to be rendered as-is */}
                          {step}
                        </li>
                      ))}
                    </ol>

                    <h4 className="font-semibold mt-4">Why it's Correct:</h4>
                    <p className="text-sm whitespace-pre-wrap text-green-700 dark:text-green-400">
                      {/* Using the new HTML rendering function */}
                      <span dangerouslySetInnerHTML={{ __html: getHtmlContent(currentAIExplanation.why_correct) }} />
                    </p>

                    <h4 className="font-semibold mt-4">
                      Why Others are Wrong:
                    </h4>
                    <p className="text-sm whitespace-pre-wrap text-red-700 dark:text-red-400">
                      {/* Using the new HTML rendering function */}
                      <span dangerouslySetInnerHTML={{ __html: getHtmlContent(currentAIExplanation.why_wrong) }} />
                    </p>

                    <h4 className="font-semibold mt-4">Key Concepts:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      {currentAIExplanation.key_concepts.map(
                        (concept, index) => (
                          <li key={index} className="whitespace-pre-wrap">
                            {/* Assuming concepts are already plain text or Markdown meant to be rendered as-is */}
                            {concept}
                          </li>
                        )
                      )}
                    </ul>

                    <h4 className="font-semibold mt-4">Tips:</h4>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {/* Using the new HTML rendering function */}
                      <span dangerouslySetInnerHTML={{ __html: getHtmlContent(currentAIExplanation.tips) }} />
                    </p>
                  </Card>
                )}
              </div>
            )}
            {/* --- END AI EXPLANATION SECTION --- */}

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
                  currentQuestion && flagged.has(currentQuestion.question.id)
                    ? "destructive" // Make flagged questions stand out
                    : "outline"
                }
              >
                <Flag className="mr-2 h-4 w-4" />
                {currentQuestion && flagged.has(currentQuestion.question.id)
                  ? "Unflag"
                  : "Flag"}
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
          <div className="lg:w-80">
            <Card className="p-4 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const qId = q.question.id;
                  const isCurrent = currentQuestionIndex === index;
                  const isAnswered = answers.hasOwnProperty(qId);
                  const isFlagged = flagged.has(qId);

                  let variant:
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline" = "outline";
                  if (isCurrent) variant = "default";
                  else if (isAnswered) variant = "secondary";
                  else if (isFlagged) variant = "destructive";

                  return (
                    <Button
                      key={qId}
                      variant={variant}
                      className={`h-10 w-10 p-0 ${
                        isCurrent
                          ? "" // 'default' variant
                          : isAnswered
                          ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200" // 'secondary' (customized)
                          : isFlagged
                          ? "bg-red-100 text-red-800 border-red-300 hover:bg-red-200" // 'destructive' (customized)
                          : "" // 'outline'
                      }`}
                      onClick={() => handleQuestionJump(index)}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>{" "}
                  Current
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>{" "}
                  Answered
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>{" "}
                  Flagged
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-background border border-muted-foreground mr-2"></div>{" "}
                  Unanswered
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
