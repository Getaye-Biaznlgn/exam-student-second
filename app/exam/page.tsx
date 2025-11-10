"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  startExam,
  submitExam,
  submitAnswer,
  fetchAIExplanation,
  getUserProfile,
  clearAnswer,
} from "@/lib/api";
import { useLayout } from "@/lib/layout-context";
import { IncompleteQuestionsModal } from "@/components/exam/IncompleteQuestionsModal";
import { PracticeQuestionCard } from "@/components/PracticeQuestionCard";
import { ExamQuestionCard } from "@/components/exam-question-card";
import { ExamStartCard } from "@/components/exam/ExamStartCard";
import { ExamResultCard } from "@/components/exam/ExamResultCard";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { QuestionSidebar } from "@/components/exam/QuestionSidebar";
import { MobileQuestionOverview } from "@/components/exam/MobileQuestionOverview";
import { QuestionStatusCard } from "@/components/exam/QuestionStatusCard";
import { ExamNavigationBar } from "@/components/exam/ExamNavigationBar";
import { ExamSummary } from "@/components/exam/ExamSummary";
import { ConfirmSubmitModal } from "@/components/exam/ConfirmSubmitModal";
import { QuestionExplanations } from "@/components/exam/QuestionExplanation";

function stripHtmlTags(html: string | null | undefined): string {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function ExamPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Core state ───────────────────────────────────────────────────────
  const [examData, setExamData] = useState<StartExamResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  // ── REFS to avoid stale closures ─────────────────────────────────────
  const answersRef = useRef<Record<string, string>>({});
  const flaggedRef = useRef<Set<string>>(new Set());
  const timeSpentRef = useRef<Record<string, number>>({});

  // Sync state → refs
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    flaggedRef.current = new Set(flagged);
  }, [flagged]);

  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);

  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(
    null
  );
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

  const [profileData, setProfileData] = useState<any>(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteCount, setIncompleteCount] = useState(0);

  // ── Time-up modal state ──────────────────────────────────────────────
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  // ── Central exam timer ───────────────────────────────────────────────
  const durationSeconds = (examData?.exam?.duration_minutes ?? 0) * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

  useEffect(() => {
    if (!examStarted || durationSeconds === 0) return;

    const startTime = Date.now();
    const endTime = startTime + durationSeconds * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemainingSeconds(left);

      if (left <= 0) {
        clearInterval(timer);
        (async () => {
          // Final time capture for current question
          if (currentQuestion && examStarted) {
            const elapsed = Math.floor(
              (Date.now() - startTimeRef.current) / 1000
            );
            const qId = currentQuestion.question.id;
            timeSpentRef.current[qId] =
              (timeSpentRef.current[qId] ?? 0) + elapsed;
          }

          if (!isPracticeMode) {
            // Auto-submit only in exam mode
            await executeSubmit();
            setShowTimeUpModal(true);
          } else {
            // In practice mode, just freeze timer at 0
            setRemainingSeconds(0);
          }
        })();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, durationSeconds]);

  // Reset timer when exam starts
  useEffect(() => {
    if (examStarted) {
      setRemainingSeconds(durationSeconds);
    }
  }, [examStarted, durationSeconds]);

  // ── Fetch exam & profile ─────────────────────────────────────────────
  useEffect(() => {
    const examId = searchParams.get("exam_id");
    const mode = searchParams.get("mode");

    if (!examId || !["exam", "practice"].includes(mode ?? "")) {
      setError("Invalid exam ID or mode.");
      setIsLoading(false);
      return;
    }

    setIsPracticeMode(mode === "practice");

    (async () => {
      try {
        const res = await startExam({ exam_id: examId, mode: mode! });
        if (res.success && res.data) {
          setExamData(res.data);
          setAnswers({});
          setFlagged(new Set());
          answersRef.current = {};
          flaggedRef.current = new Set();
          timeSpentRef.current = {};
        } else setError(res.message ?? "Failed to start exam.");
      } catch {
        setError("Unexpected error.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      const res = await getUserProfile();
      if (res.success && res.data) {
        const field =
          res.data.stream?.charAt(0).toUpperCase() +
            res.data.stream?.slice(1).toLowerCase() || "";
        setProfileData({
          ...res.data,
          stream: ["Natural", "Social"].includes(field) ? field : "N/A",
        });
      }
    })();
  }, []);

  // ── Per-question time tracking ───────────────────────────────────────
  const currentQuestion = examData?.questions?.[currentIdx];

  useEffect(() => {
    if (examStarted && currentQuestion) {
      startTimeRef.current = Date.now();
      if (timeRef.current) clearInterval(timeRef.current);
      timeRef.current = setInterval(() => {}, 1000);
    }
    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
      if (currentQuestion && examStarted) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const qId = currentQuestion.question.id;
        timeSpentRef.current[qId] = (timeSpentRef.current[qId] ?? 0) + elapsed;
      }
    };
  }, [currentIdx, examStarted, currentQuestion]);

  // ── Reset AI when changing question ───────────────────────────────────
  useEffect(() => {
    setAiExplanation(null);
    setAiError(null);
    setIsFetchingAI(false);
  }, [currentIdx]);

  // ── Auth redirect ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!user && !authLoading) router.push("/");
  }, [user, authLoading, router]);

  // ── Hide/Show Main Nav Bar ───────────────────────────────────────────
  const { setShowNav } = useLayout();

  useEffect(() => {
    if (examStarted) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
    return () => {
      setShowNav(true);
    };
  }, [examStarted, setShowNav]);

  // ── Loading / error screens ───────────────────────────────────────────
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
  if (!user || !examData) return null;

  // ── Helpers ───────────────────────────────────────────────────────────
  const updateCurrentTime = () => {
    if (currentQuestion && examStarted) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const qId = currentQuestion.question.id;
      timeSpentRef.current[qId] = (timeSpentRef.current[qId] ?? 0) + elapsed;
      startTimeRef.current = Date.now();
    }
  };

  const handleAnswer = async (optionId: string) => {
    if (!currentQuestion) return;
    const opt = currentQuestion.question.options.find((o) => o.id === optionId);
    if (!opt) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question.id]: optionId,
    }));
    updateCurrentTime();

    try {
      await submitAnswer({
        question_id: currentQuestion.question.id,
        selected_option: opt.option_key,
        time_spent_seconds:
          timeSpentRef.current[currentQuestion.question.id] ?? 0,
        is_flagged: flaggedRef.current.has(currentQuestion.question.id),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = async () => {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.question.id];
      return updated;
    });

    updateCurrentTime();

    try {
      await clearAnswer(currentQuestion.question.id);
    } catch (e) {
      console.error("Error clearing answer:", e);
    }
  };

  const handlePrev = () => {
    updateCurrentTime();
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
    setShowSummary(false);
    setShowSidebarMobile(false);
  };

  const handleNext = () => {
    updateCurrentTime();
    if (currentIdx < (examData?.questions.length ?? 0) - 1)
      setCurrentIdx(currentIdx + 1);
    setShowSummary(false);
    setShowSidebarMobile(false);
  };

  const handleJump = (i: number) => {
    updateCurrentTime();
    setCurrentIdx(i);
    setShowSummary(false);
    setShowSidebarMobile(false);
  };

  const toggleFlag = async () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.question.id;
    const willFlag = !flagged.has(qId);
    const newFlagged = new Set(flagged);
    willFlag ? newFlagged.add(qId) : newFlagged.delete(qId);
    setFlagged(newFlagged);
    updateCurrentTime();

    if (willFlag) {
      const sel = answers[qId];
      const optKey = sel
        ? currentQuestion.question.options.find((o) => o.id === sel)
            ?.option_key ?? null
        : null;
      try {
        await submitAnswer({
          question_id: qId,
          selected_option: optKey,
          time_spent_seconds: timeSpentRef.current[qId] ?? 0,
          is_flagged: true,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // ── FIXED: Use refs in executeSubmit ─────────────────────────────────
  const executeSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);
    updateCurrentTime();

    try {
      const payload = examData!.questions.map((q) => {
        const selId = answersRef.current[q.question.id]; // ← Use ref
        const selKey = selId
          ? q.question.options.find((o) => o.id === selId)?.option_key ?? null
          : null;

        return {
          ...q,
          selected_option: selKey,
          time_spent_seconds: timeSpentRef.current[q.question.id] ?? 0,
          is_flagged: flaggedRef.current.has(q.question.id), // ← Use ref
        };
      });

      const res = await submitExam(examData!.student_exam_id, payload);
      if (res.success && res.data) {
        setFinalResult(res.data);
        setExamCompleted(true);
      } else {
        setError(res.message ?? "Submit failed.");
      }
    } catch (e) {
      setError("Unexpected submit error.");
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = () => {
    const unanswered = examData!.questions.filter(
      (q) =>
        !answersRef.current[q.question.id] &&
        !flaggedRef.current.has(q.question.id)
    );

    if (unanswered.length > 0) {
      setIncompleteCount(unanswered.length);
      setShowIncompleteModal(true);
      return;
    }

    executeSubmit();
  };

  const handleFetchAI = async () => {
    if (!currentQuestion) return;
    setIsFetchingAI(true);
    setAiError(null);
    setAiExplanation(null);
    try {
      const res = await fetchAIExplanation(currentQuestion.question.id);
      if (res.success && res.data?.explanation) {
        const raw = res.data.explanation;
        let parsed: AIExplanation | null = null;
        if (raw.content?.includes("{")) {
          try {
            const json = raw.content
              .replace(/```json\n/g, "")
              .replace(/```/g, "")
              .trim();
            parsed = JSON.parse(json);
          } catch {}
        }
        if (!parsed) {
          parsed = {
            content: raw.content ?? "",
            steps: raw.steps ?? [],
            why_correct: raw.why_correct ?? "",
            why_wrong: "",
            key_concepts: raw.key_concepts ?? [],
            tips: raw.tips ?? "",
          };
        }
        setAiExplanation(parsed);
      } else setAiError(res.message ?? "AI fetch failed.");
    } catch (e) {
      setAiError("Unexpected AI error.");
      console.error(e);
    } finally {
      setIsFetchingAI(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  if (!examStarted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden">
        <ExamStartCard
          exam={examData!.exam}
          onStart={() => setExamStarted(true)}
        />
      </div>
    );
  }

  if (examCompleted) {
    return (
      <ExamResultCard
        result={finalResult}
        exam={examData!.exam}
        onReview={() =>
          router.push(`/review?student_exam_id=${examData!.student_exam_id}`)
        }
        onHome={() => router.push("/")}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Modals */}
      <ConfirmSubmitModal
        open={showConfirmModal}
        unanswered={unansweredCount}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeSubmit}
        isSubmitting={isSubmitting}
      />
      <IncompleteQuestionsModal
        open={showIncompleteModal}
        count={incompleteCount}
        onClose={() => setShowIncompleteModal(false)}
      />

      {/* Time-up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Time is up!
            </h2>
            <p className="text-gray-700 mb-6">
              The exam has been submitted due to time up.
            </p>
            <button
              onClick={() => {
                setShowTimeUpModal(false);
                setExamCompleted(true);
              }}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
            >
              Show Exam Result
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <ExamHeader
        profile={profileData}
        user={user}
        title={examData!.exam.title}
        duration={examData!.exam.duration_minutes}
        remainingSeconds={remainingSeconds}
        showSidebarMobile={showSidebarMobile}
        toggleSidebar={() => setShowSidebarMobile((v) => !v)}
        onTimeUp={executeSubmit}
        isPracticeMode={isPracticeMode}
      />

      <div className="flex flex-1 flex-col lg:flex-row p-4 gap-4">
        {showSidebarMobile && (
          <MobileQuestionOverview
            questions={examData!.questions}
            currentIdx={currentIdx}
            answers={answers}
            flagged={flagged}
            onJump={handleJump}
          />
        )}

        <main className="flex-1 flex flex-col gap-4">
          <div className="flex-1">
            {showSummary ? (
              <ExamSummary
                questions={examData!.questions}
                answers={answers}
                onJump={handleJump}
                onBack={() => setShowSummary(false)}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className="flex flex-row gap-4">
                <QuestionStatusCard
                  answered={answers.hasOwnProperty(
                    currentQuestion!.question.id
                  )}
                  flagged={flagged.has(currentQuestion!.question.id)}
                  isFlagged={flagged.has(currentQuestion!.question.id)}
                  questionNumber={currentIdx + 1}
                  onFlag={toggleFlag}
                />
                <div className="flex-1">
                  {isPracticeMode ? (
                    <PracticeQuestionCard
                      key={currentQuestion!.question.id}
                      question={currentQuestion!.question}
                      questionNumber={currentIdx + 1}
                      totalQuestions={examData!.questions.length}
                      selectedOption={
                        answers[currentQuestion!.question.id] ?? null
                      }
                      onSelectOption={handleAnswer}
                      correctOptionKey={
                        currentQuestion!.question.correct_option ?? null
                      }
                      remainingTime={remainingSeconds}
                    />
                  ) : (
                    <ExamQuestionCard
                      key={currentQuestion!.question.id}
                      question={currentQuestion!.question}
                      questionNumber={currentIdx + 1}
                      totalQuestions={examData!.questions.length}
                      selectedOption={
                        answers[currentQuestion!.question.id] ?? null
                      }
                      onClearChoice={handleClear}
                      onSelectOption={handleAnswer}
                      remainingTime={remainingSeconds}
                    />
                  )}

                  {isPracticeMode && currentQuestion && (
                    <QuestionExplanations
                      staticExplanation={currentQuestion.question.explanation}
                      aiExplanation={aiExplanation}
                      isFetchingAI={isFetchingAI}
                      aiError={aiError}
                      onFetchAI={handleFetchAI}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {!showSummary && (
            <ExamNavigationBar
              canPrev={currentIdx > 0}
              canNext={currentIdx < examData!.questions.length - 1}
              onPrev={handlePrev}
              onNext={handleNext}
              onClear={handleClear}
              onFlag={toggleFlag}
              isFlagged={flagged.has(currentQuestion!.question.id)}
              clearDisabled={!answers[currentQuestion!.question.id]}
              showSummaryBtn={!showSummary}
              onSummary={() => {
                updateCurrentTime();
                setShowSummary(true);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </main>

        <QuestionSidebar
          questions={examData!.questions}
          currentIdx={currentIdx}
          answers={answers}
          flagged={flagged}
          onJump={handleJump}
        />
      </div>
    </div>
  );
}
