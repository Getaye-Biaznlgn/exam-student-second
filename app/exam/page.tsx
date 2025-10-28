"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// --- MODIFICATION: Added Dialog components for custom modal ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
// --- MODIFICATION: Added new icons ---
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  List,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  startExam,
  StartExamResponse,
  submitExam,
  submitAnswer,
  fetchAIExplanation,
  // --- MODIFICATION: Import getUserProfile ---
  getUserProfile,
  type AIExplanation,
  type AIExplanationResponse,
} from "@/lib/api";
import { ExamQuestionCard } from "@/components/exam-question-card";
import { ExamTimer } from "@/components/exam-timer";

/**
 * Removes all HTML tags from a string.
 */
function stripHtmlTags(htmlString: string | null | undefined): string {
  if (typeof htmlString !== "string") {
    return "";
  }
  return htmlString.replace(/<[^>]*>/g, "").trim();
}

export default function ExamPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examData, setExamData] = useState<StartExamResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const timeSpentRef = useRef<Record<string, number>>({});
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [finalResult, setFinalResult] = useState<any>(null);

  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentAIExplanation, setCurrentAIExplanation] =
    useState<AIExplanation | null>(null);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  // --- MODIFICATION: State for summary and modal flow ---
  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

  // --- MODIFICATION: State for profile data ---
  const [profileData, setProfileData] = useState<any>(null);

  // --- NEW: State for mobile sidebar visibility ---
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

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

    setIsPracticeMode(mode === "practice");

    async function fetchExam() {
      try {
        const res = await startExam({ exam_id: examId, mode });
        if (res.success && res.data) {
          setExamData(res.data);
          setAnswers({});
          setFlagged(new Set());
          timeSpentRef.current = {};
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

  // --- MODIFICATION: Fetch user profile data for header ---
  useEffect(() => {
    async function fetchProfile() {
      const res = await getUserProfile();
      if (res.success && res.data) {
        const field =
          res.data.stream?.charAt(0).toUpperCase() +
            res.data.stream?.slice(1).toLowerCase() || "";

        setProfileData({
          ...res.data,
          stream: field === "Natural" || field === "Social" ? field : "N/A",
        });
      }
    }
    fetchProfile();
  }, []);

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

      timeRef.current = setInterval(() => {}, 1000);

      return () => {
        if (timeRef.current) {
          clearInterval(timeRef.current);
        }
        const now = Date.now();
        const timeSpent = Math.floor((now - startTimeRef.current) / 1000);

        if (currentQuestion) {
          const qId = currentQuestion.question.id;
          timeSpentRef.current[qId] =
            (timeSpentRef.current[qId] || 0) + timeSpent;
        }
      };
    }
  }, [currentQuestionIndex, examStarted, currentQuestion]);

  // Reset AI Explanation when question changes
  useEffect(() => {
    setCurrentAIExplanation(null);
    setAIError(null);
    setIsFetchingAI(false);
  }, [currentQuestionIndex]);

  const updateCurrentQuestionTime = () => {
    if (currentQuestion && examStarted) {
      const now = Date.now();
      const timeSpent = Math.floor((now - startTimeRef.current) / 1000);
      const qId = currentQuestion.question.id;
      timeSpentRef.current[qId] = (timeSpentRef.current[qId] || 0) + timeSpent;
      startTimeRef.current = now;
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

  // This function sends data to the BE
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

  // --- MODIFIED: Does NOT send to BE ---
  const handleClearChoice = () => {
    if (currentQuestion) {
      const qId = currentQuestion.question.id;

      // Remove the answer from the local state only
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[qId];
        return newAnswers;
      });

      updateCurrentQuestionTime();
      // No API call is made
    }
  };

  const handleNext = () => {
    updateCurrentQuestionTime();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowSummary(false);
      setShowSidebarMobile(false); // Hide mobile sidebar on next
    }
  };

  const handlePrevious = () => {
    updateCurrentQuestionTime();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowSummary(false);
      setShowSidebarMobile(false); // Hide mobile sidebar on previous
    }
  };

  const handleQuestionJump = (index: number) => {
    updateCurrentQuestionTime();
    setCurrentQuestionIndex(index);
    setShowSummary(false);
    setShowSidebarMobile(false); // Hide mobile sidebar on jump
  };

  // --- MODIFIED: Only sends to BE when FLAGGING ---
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
      setFlagged(newFlagged); // Update state immediately

      const selectedOptionId = answers[qId];
      const selectedOptionKey = selectedOptionId
        ? currentQuestion.question.options.find(
            (opt) => opt.id === selectedOptionId
          )?.option_key || null
        : null;

      updateCurrentQuestionTime();

      // Only send API call if IS NOW FLAGGED
      if (isNowFlagged) {
        try {
          const answerPayload = {
            question_id: qId,
            selected_option: selectedOptionKey,
            time_spent_seconds: timeSpentRef.current[qId] || 0,
            is_flagged: isNowFlagged, // This will be true
          };

          const res = await submitAnswer(answerPayload);
          if (!res.success) {
            console.error("Failed to update flag:", res.message);
          }
        } catch (err) {
          console.error("Error updating flag:", err);
        }
      }
      // No API call is made when un-flagging
    }
  };

  // --- MODIFICATION: This is the actual submission logic ---
  const executeSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowConfirmModal(false); // Close modal if it was open
    updateCurrentQuestionTime();

    // Before final submit, compile all local answers
    try {
      const modifiedQuestions = questions.map((q) => {
        const selectedOptionId = answers[q.question.id];
        const selectedOptionKey = selectedOptionId
          ? q.question.options.find((opt) => opt.id === selectedOptionId)
              ?.option_key || null
          : null;
        return {
          ...q,
          selected_option: selectedOptionKey, // Send the final answer (or null if cleared)
          time_spent_seconds: timeSpentRef.current[q.question.id] || 0,
          is_flagged: flagged.has(q.question.id), // Send final flag status
        };
      });

      const res = await submitExam(examData.student_exam_id, modifiedQuestions);

      if (res.success && res.data) {
        setFinalResult(res.data);
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

  // --- MODIFICATION: This handler shows the summary screen ---
  const handleShowSummary = () => {
    updateCurrentQuestionTime();
    setShowSummary(true);
  };

  // --- MODIFICATION: This handler checks before final submit ---
  const handleFinalSubmit = () => {
    if (isSubmitting) return;

    const count = questions.length - Object.keys(answers).length;
    setUnansweredCount(count);

    if (count > 0) {
      setShowConfirmModal(true); // Show custom modal
    } else {
      executeSubmit(); // Submit directly if all are answered
    }
  };

  const handleTimeUp = () => {
    alert("Time is up! Your exam will be submitted automatically.");
    executeSubmit(); // Use the new final submit function
  };

  const handleReview = () => {
    router.push(`/review?student_exam_id=${examData.student_exam_id}`);
  };

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
        if (rawExplanation.content && rawExplanation.content.includes("{")) {
          const jsonString = rawExplanation.content
            .replace(/```json\n/g, "")
            .replace(/```/g, "")
            .trim();
          try {
            parsedExplanation = JSON.parse(jsonString) as AIExplanation;
          } catch (parseError) {
            console.error("Failed to parse AI explanation JSON:", parseError);
            setAIError("Failed to parse AI explanation.");
          }
        } else {
          // This block seems to be using an undefined variable `rawM`. I'll correct it to use `rawExplanation` if it's meant to be a fallback.
          parsedExplanation = {
            content: rawExplanation.content,
            steps: rawExplanation.steps || [],
            why_correct: rawExplanation.why_correct || "",
            why_wrong: "", // Setting a default or correcting the intended source
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

  // --- START: Unchanged Blocks (Start/Completed) ---
  if (!examStarted) {
    return (
      // --- MODIFICATION: Added max-w-lg and centered card in flex to be mobile friendly ---
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {examDetails.title}
          </h1>
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
    const hasResultDetails =
      finalResult && typeof finalResult.score === "number";
    const score = hasResultDetails ? finalResult.score : null;
    const passed = finalResult ? finalResult.passed : false;
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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
                {score.toFixed(1)}%
              </p>
              <p className="text-lg mt-2 text-muted-foreground">
                You got {finalResult.correct_answers} out of{" "}
                {finalResult.total_questions} correct.
              </p>
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
            <p className="text-muted-foreground mt-2">
              Your results are being processed.
            </p>
          )}
          <div className="flex gap-4 flex-col sm:flex-row justify-center mt-6">
            <Button variant="outline" onClick={handleReview}>
              Review Exam
            </Button>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </div>
        </Card>
      </div>
    );
  }
  // --- END: Unchanged Blocks ---

  // --- MODIFICATION: Added Custom Modal ---
  const renderConfirmationModal = () => (
    <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogDescription>
            You have {unansweredCount} unanswered question(s). Are you sure you
            want to submit?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button onClick={executeSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Anyway"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // --- NEW: Main Exam Layout (Mobile Responsive) ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* --- MODIFICATION: Render the modal --- */}
      {renderConfirmationModal()}

      {/* 1. Static Header (Mobile: Timer Only) */}
      <header className="border-b p-3 sticky top-0 bg-white z-20 flex justify-between items-center shadow-md">
        {/* Basic Info (Hidden on Mobile) */}
        <div className="hidden sm:flex flex-col text-xs text-gray-700 space-y-1">
          <div className="flex gap-3 items-center">
            <span className="font-semibold w-28">Full Name:</span>
            <span>
              {profileData
                ? `${profileData.first_name || ""} ${
                    profileData.last_name || ""
                  }`.toUpperCase()
                : user.name?.toUpperCase() || "..."}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="font-semibold w-28">Stream:</span>
            <span>{profileData?.stream || "..."}</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="font-semibold w-28">Student ID:</span>
            <span>{profileData?.student_id || "..."}</span>
          </div>
        </div>
        {/* Timer, Title & Mobile Overview Button */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSidebarMobile(!showSidebarMobile)}
            className="lg:hidden mr-4" // Only show on small/medium screens
          >
            {showSidebarMobile ? (
              <X className="h-5 w-5" />
            ) : (
              <List className="h-5 w-5" />
            )}
          </Button>
          <div className="text-right">
            <div className="text-lg font-semibold text-red-600">
              <ExamTimer durationMinutes={duration} onTimeUp={handleTimeUp} />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {examDetails.title}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Body (Content + Sidebar) */}
      {/* --- MODIFICATION: Default flex-col, lg:flex-row --- */}
      <div className="flex flex-1 flex-col lg:flex-row p-4 gap-4">
        {/* --- NEW: Mobile Sidebar (Question Overview) --- */}
        {showSidebarMobile && (
          <div className="lg:hidden w-full bg-white p-4 rounded-lg border shadow-lg z-10 sticky top-16 mb-4">
            <h3 className="text-lg font-semibold mb-4">Exam Overview</h3>
            <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-[70vh] overflow-y-auto">
              {questions.map((q, index) => {
                const qId = q.question.id;
                const isCurrent = currentQuestionIndex === index;
                const isAnswered = answers.hasOwnProperty(qId);
                const isFlagged = flagged.has(qId);

                let styles =
                  "h-9 w-9 p-0 rounded-sm text-sm font-medium transition-colors relative flex items-center justify-center ";

                if (isCurrent) {
                  styles +=
                    "bg-blue-600 text-white ring-2 ring-blue-800 ring-offset-2";
                } else if (isAnswered) {
                  styles += "bg-gray-400 text-white hover:bg-gray-500";
                } else {
                  styles +=
                    "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300";
                }

                return (
                  <button
                    key={qId}
                    className={styles}
                    onClick={() => handleQuestionJump(index)}
                  >
                    {index + 1}
                    {isFlagged && (
                      <Flag
                        className="absolute top-0.5 right-0.5 h-3 w-3 text-red-500"
                        fill="currentColor"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* --- END: Mobile Sidebar --- */}

        {/* 3. Main Content Area (Questions or Summary) */}
        <main className="flex-1 flex flex-col gap-4">
          <div className="flex-1">
            {showSummary ? (
              // --- MODIFIED: Summary View ---
              <div className="bg-white p-4 rounded-lg border shadow-sm h-full">
                <h2 className="text-xl font-semibold mb-2 border-b pb-2">
                  Exam Summary
                </h2>
                <div className="max-h-[70vh] overflow-y-auto">
                  <ul>
                    {questions.map((q, index) => (
                      <li
                        key={q.question.id}
                        className="flex justify-between items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleQuestionJump(index)}
                      >
                        <span className="font-medium text-gray-800">
                          Question {index + 1}
                        </span>
                        {answers.hasOwnProperty(q.question.id) ? (
                          <span className="text-sm text-green-600 font-medium">
                            Answer Saved
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Not Answered
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* --- MODIFICATION: Added navigation buttons to summary --- */}
                <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSummary(false)}
                  >
                    Back to Exam
                  </Button>
                  <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Now"}
                  </Button>
                </div>
              </div>
            ) : (
              // --- Existing Question View ---
              currentQuestion && (
                // --- MODIFICATION: Changed to flex-row and hidden status card on mobile ---
                <div className="flex flex-row gap-4">
                  {/* --- MODIFICATION: Status Card (Hidden on Mobile) --- */}
                  <Card className="hidden sm:block w-48 p-4 sticky top-24 h-fit flex-shrink-0">
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                      Q. {currentQuestionIndex + 1} STATUS
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {answers.hasOwnProperty(currentQuestion.question.id) ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-gray-400" />
                        )}
                        <span
                          className={
                            answers.hasOwnProperty(currentQuestion.question.id)
                              ? "text-green-600 font-medium"
                              : "text-gray-500"
                          }
                        >
                          {answers.hasOwnProperty(currentQuestion.question.id)
                            ? "Answered"
                            : "Not Answered"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag
                          className={`h-5 w-5 ${
                            flagged.has(currentQuestion.question.id)
                              ? "text-red-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={
                            flagged.has(currentQuestion.question.id)
                              ? "text-red-600 font-medium"
                              : "text-gray-500"
                          }
                        >
                          {flagged.has(currentQuestion.question.id)
                            ? "Flagged"
                            : "Not Flagged"}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* --- MODIFICATION: Wrapper for question card + AI --- */}
                  {/* P-4 added to maintain spacing for the question on mobile when the status card is hidden */}
                  <div className="flex-1">
                    <ExamQuestionCard
                      key={currentQuestion.question.id}
                      question={currentQuestion.question}
                      questionNumber={currentQuestionIndex + 1}
                      totalQuestions={questions.length}
                      selectedOption={
                        answers[currentQuestion.question.id] || null
                      }
                      onSelectOption={handleAnswer}
                      isPracticeMode={isPracticeMode}
                      correctOptionKey={
                        currentQuestion.question.correct_option || null
                      }
                    />

                    {/* AI EXPLANATION SECTION */}
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
                              {stripHtmlTags(currentAIExplanation.content)}
                            </p>
                            {/* ... etc ... */}
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* --- Unified Navigation Bar --- */}
          {/* Added sticky bottom and fixed width on mobile for better usability */}
          <div className="flex flex-wrap gap-2 justify-between p-4 bg-white rounded-lg border shadow-md sticky bottom-0 z-10 w-full">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={handleClearChoice}
                variant="outline"
                className="text-yellow-600 border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700"
                disabled={!answers[currentQuestion?.question.id]}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button
                onClick={toggleFlag}
                variant={
                  currentQuestion && flagged.has(currentQuestion.question.id)
                    ? "destructive"
                    : "outline"
                }
              >
                <Flag className="mr-2 h-4 w-4" />
                {currentQuestion && flagged.has(currentQuestion.question.id)
                  ? "Unflag"
                  : "Flag"}
              </Button>
              {/* --- MODIFICATION: Added a 'View Summary' button for mobile context, hidden on the summary page itself --- */}
              {!showSummary && (
                <Button
                  variant="outline"
                  onClick={handleShowSummary}
                  className="lg:hidden"
                >
                  <List className="mr-2 h-4 w-4" /> Summary
                </Button>
              )}
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              // --- MODIFICATION: Button now shows summary first ---
              <Button onClick={handleShowSummary} disabled={isSubmitting}>
                Submit Exam
              </Button>
            )}
          </div>
        </main>

        {/* 4. Sidebar (Exam Overview) - Hidden on Mobile */}
        {/* --- MODIFICATION: Hidden on mobile (default) and only block on large screens --- */}
        <aside className="hidden lg:block lg:w-80 flex-shrink-0 bg-white p-4 rounded-lg border shadow-sm sticky top-24 h-fit">
          <h3 className="text-lg font-semibold mb-4">Exam Overview</h3>
          {/* --- UPDATED GRID COLUMNS for better fit on 80-width sidebar --- */}
          <div className="grid grid-cols-6 gap-2">
            {questions.map((q, index) => {
              const qId = q.question.id;
              const isCurrent = currentQuestionIndex === index;
              const isAnswered = answers.hasOwnProperty(qId);
              const isFlagged = flagged.has(qId);

              let styles =
                "h-9 w-9 p-0 rounded-sm text-sm font-medium transition-colors relative flex items-center justify-center ";

              // --- MODIFICATION: Sidebar color logic ---
              if (isCurrent) {
                styles +=
                  "bg-blue-600 text-white ring-2 ring-blue-800 ring-offset-2"; // Current (Blue)
              } else if (isAnswered) {
                styles += "bg-gray-400 text-white hover:bg-gray-500"; // Answered (Gray)
              } else {
                styles +=
                  "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"; // Not Answered (White)
              }

              return (
                <button
                  key={qId}
                  className={styles}
                  onClick={() => handleQuestionJump(index)}
                >
                  {index + 1}
                  {isFlagged && (
                    <Flag
                      className="absolute top-0.5 right-0.5 h-3 w-3 text-red-500" // Flag is now Red
                      fill="currentColor"
                    />
                  )}
                </button>
              );
            })}
          </div>
          {/* --- MODIFICATION: UPDATED LEGEND --- */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-sm bg-blue-600 mr-2 border border-blue-700"></div>
              Current
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-sm bg-gray-400 mr-2 border border-gray-500"></div>
              Answered
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-sm bg-white mr-2 border border-gray-300"></div>
              Not Answered
            </div>
            <div className="flex items-center">
              <Flag className="w-4 h-4 text-red-500 mr-2" fill="currentColor" />
              Flagged for Review
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
