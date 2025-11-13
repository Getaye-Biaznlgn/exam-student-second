// ...existing code...
"use client";
import { useEffect, useState } from "react";
import {
  fetchExamHistory,
  fetchMyCompletedLiveExams,
  fetchLiveExamResults,
} from "@/lib/api";
import type { ExamHistoryItem } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Target,
  Radio,
} from "lucide-react";

// === LIVE EXAM TYPES ===
type LiveExamSummary = {
  student_exam_id: string;
  exam_id: string;
  exam_title: string;
  subject: string;
  score: number;
  score_percentage: number;
  total_questions: number;
  passing_marks: number;
  passed: boolean;
  start_time: string;
  end_time: string;
  completed_at: string;
};

type LiveExamDetail = {
  student_exam_id: string;
  exam: {
    id: string;
    title: string;
    subject: string;
    total_questions: number;
    passing_marks: number;
  };
  results: {
    score: number;
    score_percentage: number;
    correct_answers: number;
    incorrect_answers: number;
    unanswered: number;
    total_questions: number;
    passed: boolean;
    time_spent_seconds: number;
    time_spent_minutes: number;
  };
  start_time: string;
  end_time: string;
  completed_at: string;
  questions: Array<{
    question_id: string;
    question_text: string;
    question_number: number;
    options: Array<{
      option_id: string;
      option_key: string;
      option_text: string;
      is_correct: boolean;
      is_selected: boolean;
    }>;
    selected_option_id?: string | null;
    selected_option_key?: string | null;
    correct_option_id?: string | null;
    correct_option_key?: string | null;
    is_correct?: boolean | null;
    time_spent_seconds: number;
  }>;
};

// Unified history item
type UnifiedHistoryItem =
  | {
      type: "exam" | "practice";
      data: ExamHistoryItem;
    }
  | {
      type: "live";
      summary: LiveExamSummary;
      detail?: LiveExamDetail;
    };

export default function ExamHistoryPage() {
  const [mode, setMode] = useState<"exam" | "practice" | "live">("exam");
  const [history, setHistory] = useState<UnifiedHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<UnifiedHistoryItem | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Load history based on mode
  useEffect(() => {
    if (selectedItem) return;

    async function loadHistory() {
      setLoading(true);
      setError(null);
      setHistory([]);

      try {
        if (mode === "live") {
          const res = await fetchMyCompletedLiveExams();
          if (res.success && res.data?.exams) {
            const liveItems: UnifiedHistoryItem[] = res.data.exams.map(
              (exam: LiveExamSummary) => ({
                type: "live",
                summary: exam,
              })
            );
            setHistory(liveItems);
          } else {
            setError(res.message || "No live exams found");
          }
        } else {
          const res = await fetchExamHistory(mode);
          if (res.success && Array.isArray(res.data)) {
            const items: UnifiedHistoryItem[] = res.data.map(
              (item: ExamHistoryItem) => ({
                type: mode,
                data: item,
              })
            );
            // Sort: completed first, then newest
            const sorted = items.sort((a, b) => {
              const aTime =
                a.type === "live" ? a.summary.start_time : a.data.start_time;
              const bTime =
                b.type === "live" ? b.summary.start_time : b.data.start_time;
              return new Date(bTime).getTime() - new Date(aTime).getTime();
            });
            setHistory(sorted);
          } else {
            setError(res.message || "Failed to load history");
          }
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [mode, selectedItem]);

  // Handle item selection (fetch detail for live exams)
  const handleSelectItem = async (item: UnifiedHistoryItem) => {
    if (item.type !== "live" || item.detail) {
      setSelectedItem(item);
      return;
    }

    setLoadingDetail(true);
    try {
      const res = await fetchLiveExamResults(item.summary.student_exam_id);
      if (res.success && res.data) {
        setSelectedItem({
          ...item,
          detail: res.data as LiveExamDetail,
        });
      } else {
        setError("Failed to load exam details");
      }
    } catch (err) {
      setError("Error loading exam details");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBack = () => setSelectedItem(null);
  const handleRetry = () => {
    setSelectedItem(null);
    setError(null);
  };

  const renderLoading = () => (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      Loading {mode} history...
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-40 text-red-500">
      <p>{error}</p>
      <Button onClick={handleRetry} className="mt-4">
        Retry
      </Button>
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
      <p>No {mode} history found.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Exam History"
        description="View your previous exam, practice, and live exam sessions"
      />

      <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Mode Toggle - Hidden when viewing details */}
        {!selectedItem && (
          <div className="flex justify-center">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(val) =>
                val && setMode(val as "exam" | "practice" | "live")
              }
              className="inline-flex shadow-sm"
            >
              <ToggleGroupItem value="exam" aria-label="Exam Mode">
                <Target className="h-4 w-4 mr-2" />
                Exam
              </ToggleGroupItem>
              <ToggleGroupItem value="practice" aria-label="Practice Mode">
                <Clock className="h-4 w-4 mr-2" />
                Practice
              </ToggleGroupItem>
              <ToggleGroupItem value="live" aria-label="Live Exams">
                <Radio className="h-4 w-4 mr-2" />
                Live Exams
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : selectedItem ? (
          loadingDetail ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-10 w-10 animate-spin" />
              <span className="ml-3 text-lg">Loading exam details...</span>
            </div>
          ) : (
            <UnifiedReviewView item={selectedItem} onBack={handleBack} />
          )
        ) : history.length === 0 ? (
          renderEmpty()
        ) : (
          <UnifiedHistoryGrid history={history} onSelect={handleSelectItem} />
        )}
      </div>
    </div>
  );
}

// === Unified History Grid ===
function UnifiedHistoryGrid({
  history,
  onSelect,
}: {
  history: UnifiedHistoryItem[];
  onSelect: (item: UnifiedHistoryItem) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {history.map((item) => {
        if (item.type === "live") {
          const s = item.summary;
          return (
            <Card
              key={s.student_exam_id}
              onClick={() => onSelect(item)}
              className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">
                      {s.exam_title}
                    </CardTitle>
                  </div>
                  <Badge variant={s.passed ? "success" : "destructive"}>
                    {s.passed ? "Passed" : "Failed"}
                  </Badge>
                </div>
                <CardDescription className="text-sm mt-1">
                  {s.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Score:</span>{" "}
                  {s.score_percentage.toFixed(1)}%
                </p>
                <p className="text-muted-foreground">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {new Date(s.completed_at).toLocaleDateString()} at{" "}
                  {new Date(s.completed_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-muted-foreground">
                  <Target className="inline h-4 w-4 mr-1" />
                  Passing: {s.passing_marks}%
                </p>
              </CardContent>
            </Card>
          );
        }

        // Exam / Practice Mode
        const d = item.data;
        return (
          <Card
            key={d.id}
            onClick={() => d.is_completed && onSelect(item)}
            className={`hover:shadow-md transition-shadow ${
              d.is_completed ? "cursor-pointer" : "cursor-default opacity-75"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-semibold pr-2">
                  {d.exam_title}
                </CardTitle>
                <Badge
                  variant={
                    d.is_completed
                      ? d.is_passed
                        ? "success"
                        : "destructive"
                      : "outline"
                  }
                >
                  {d.is_completed
                    ? d.is_passed
                      ? "Passed"
                      : "Failed"
                    : "In Progress"}
                </Badge>
              </div>
              <CardDescription className="text-sm mt-1">
                Subject: {d.exam_subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {d.is_completed && d.result ? (
                <p>
                  Score:{" "}
                  <span className="font-medium">
                    {d.result.correct_answers} / {d.result.total_questions}
                  </span>{" "}
                  ({d.result.score.toFixed(2)}%)
                </p>
              ) : (
                <p>
                  Score: <span className="text-muted-foreground">N/A</span>
                </p>
              )}
              <p>
                <Clock className="inline h-4 w-4 mr-1 text-muted-foreground" />
                Time Spent: {d.time_spent_minutes.toFixed(2)} min
              </p>
              <p>
                <Target className="inline h-4 w-4 mr-1 text-muted-foreground" />
                Passing Mark: {d.exam_passing_marks}%
              </p>
              <div className="pt-2 text-xs text-muted-foreground">
                {d.is_completed ? "Completed" : "Started"}:{" "}
                {new Date(
                  d.is_completed ? d.end_time! : d.start_time
                ).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// === Unified Review View ===
function UnifiedReviewView({
  item,
  onBack,
}: {
  item: UnifiedHistoryItem;
  onBack: () => void;
}) {
  if (item.type === "live" && !item.detail) return null;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to History
      </Button>

      {item.type === "live" ? (
        <LiveResultSummary item={item.detail!} />
      ) : (
        <ResultSummaryCard item={item.data} />
      )}

      <h2 className="text-xl font-semibold flex items-center gap-2">
        Question Review
      </h2>

      {item.type === "live" ? (
        <LiveQuestionReview questions={item.detail!.questions} />
      ) : Array.isArray(item.data.answers) && item.data.answers.length > 0 ? (
        <div className="space-y-4">
          {item.data.answers.map((answer, i) => (
            <QuestionReviewCard key={i} answer={answer} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No answer details available for this session.
        </p>
      )}
    </div>
  );
}

// === Live Exam Summary ===
function LiveResultSummary({ item }: { item: LiveExamDetail }) {
  const r = item.results;
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Radio className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl">{item.exam.title}</CardTitle>
            <CardDescription>
              {item.exam.subject} • Completed on{" "}
              {new Date(item.completed_at).toLocaleString()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase">Status</p>
            <p
              className={`text-2xl font-bold ${
                r.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {r.passed ? "PASSED" : "FAILED"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase">Score</p>
            <p className="text-2xl font-bold">
              {r.score_percentage.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase">Correct</p>
            <p className="text-2xl font-bold">
              {r.correct_answers} / {r.total_questions}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase">Time</p>
            <p className="text-2xl font-bold">
              {r.time_spent_minutes.toFixed(1)} min
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// === Live Questions Review ===
function LiveQuestionReview({
  questions,
}: {
  questions: LiveExamDetail["questions"];
}) {
  if (!questions || questions.length === 0) {
    return <p className="text-muted-foreground">No questions available.</p>;
  }

  return (
    <div className="space-y-5">
      {questions.map((q) => {
        const selected = q.options.find((o) => o.is_selected);
        const correct = q.options.find((o) => o.is_correct);
        const isCorrect = q.is_correct === true;

        return (
          <Card
            key={q.question_id}
            className={isCorrect ? "" : "border-red-200"}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">
                Question {q.question_number}
              </CardTitle>
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : q.is_correct === false ? (
                <XCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Badge variant="secondary">Not Answered</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: q.question_text }}
              />

              <div className="grid gap-3 text-sm">
                <div
                  className={`flex items-start p-3 rounded-lg border ${
                    selected
                      ? isCorrect
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                      : "bg-gray-50"
                  }`}
                >
                  <span className="font-medium w-32">Your Answer:</span>
                  <div
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html:
                        selected?.option_text ||
                        "<em class='text-muted-foreground'>Not answered</em>",
                    }}
                  />
                </div>

                {correct && (
                  <div className="flex items-start p-3 rounded-lg bg-green-50 border border-green-300">
                    <span className="font-medium w-32">Correct Answer:</span>
                    <div
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: correct.option_text }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// === Reuse Existing Components ===
function ResultSummaryCard({ item }: { item: ExamHistoryItem }) {
  if (!item.is_completed || !item.result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{item.exam_title}</CardTitle>
          <CardDescription>This exam was not completed.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { result } = item;
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>{item.exam_title}</CardTitle>
        <CardDescription>
          Subject: {item.exam_subject} | Completed:{" "}
          {new Date(item.end_time!).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Status</p>
            <p
              className={`text-lg font-bold ${
                result.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.passed ? "Passed" : "Failed"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Score</p>
            <p className="text-lg font-bold">{result.score.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Correct</p>
            <p className="text-lg font-bold">
              {result.correct_answers} / {result.total_questions}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">
              Time Spent
            </p>
            <p className="text-lg font-bold">
              {result.time_spent_minutes.toFixed(2)} min
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionReviewCard({ answer, index }: { answer: any; index: number }) {
  const isCorrect = answer.is_correct;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">
          Question {index + 1}
        </CardTitle>
        {isCorrect ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: answer.question_text }}
        />
        <hr />
        <div className="space-y-2 text-sm">
          <div
            className={`flex items-start p-2 rounded-md ${
              !isCorrect ? "bg-red-100 dark:bg-red-900/30" : ""
            }`}
          >
            <span className="font-medium w-32 flex-shrink-0">Your Answer:</span>
            <span
              className={!isCorrect ? "text-red-700 dark:text-red-300" : ""}
            >
              {answer.selected_option || (
                <span className="italic text-muted-foreground">
                  Not Answered
                </span>
              )}
            </span>
          </div>
          <div
            className={`flex items-start p-2 rounded-md ${
              !isCorrect ? "bg-green-100 dark:bg-green-900/30" : ""
            }`}
          >
            <span className="font-medium w-32 flex-shrink-0">
              Correct Answer:
            </span>
            <span
              className={!isCorrect ? "text-green-700 dark:text-green-300" : ""}
            >
              {answer.correct_option}
            </span>
          </div>
        </div>
        {(answer.explanation || answer.ai_explanation) && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2 text-sm">Explanation</h4>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: answer.explanation || answer.ai_explanation || "",
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
