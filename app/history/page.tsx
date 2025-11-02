"use client";

import { useEffect, useState } from "react";
import { fetchExamHistory } from "@/lib/api";
import type { ExamHistoryItem, ExamAnswer } from "@/lib/api"; // Assuming ExamAnswer is defined in api types
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
} from "lucide-react";

// Helper type, assuming ExamAnswer might not be exported from your api lib
type Answer = {
  question_id: string;
  question_text: string;
  selected_option: string;
  correct_option: string;
  is_correct: boolean;
  explanation: string | null;
  [key: string]: any; // Allow other properties
};

// Define the main page component
export default function ExamHistoryPage() {
  const [mode, setMode] = useState<"exam" | "practice">("exam");
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW STATE ---
  // State to hold the currently selected history item for detailed review
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<ExamHistoryItem | null>(null);

  // Effect to load history when mode changes
  useEffect(() => {
    // Don't load if a review is active
    if (selectedHistoryItem) return;

    async function loadHistory() {
      setLoading(true);
      setError(null);
      setHistory([]);
      try {
        const res = await fetchExamHistory(mode);
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            // Sort completed exams to the top
            const sortedData = res.data.sort((a, b) => {
              // Primary sort: completed (true) come before in-progress (false)
              if (a.is_completed && !b.is_completed) return -1;
              if (!a.is_completed && b.is_completed) return 1;

              // Secondary sort: newer (by start_time) come first
              return (
                new Date(b.start_time).getTime() -
                new Date(a.start_time).getTime()
              );
            });
            setHistory(sortedData);
          } else {
            console.error("API returned non-array data:", res.data);
            setError("Failed to load history: Invalid data format.");
          }
        } else {
          setError(res.message || "Failed to load history");
        }
      } catch (err) {
        setError("Error fetching history");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [mode, selectedHistoryItem]); // Re-run if mode changes or if we go back from review

  // Handler for the "Retry" button
  async function handleRetry() {
    setLoading(true);
    setError(null);
    setHistory([]);
    try {
      const res = await fetchExamHistory(mode);
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          // Sort completed exams to the top
          const sortedData = res.data.sort((a, b) => {
            if (a.is_completed && !b.is_completed) return -1;
            if (!a.is_completed && b.is_completed) return 1;
            return (
              new Date(b.start_time).getTime() -
              new Date(a.start_time).getTime()
            );
          });
          setHistory(sortedData);
        } else {
          console.error("API returned non-array data:", res.data);
          setError("Failed to load history: Invalid data format.");
        }
      } else {
        setError(res.message || "Failed to load history");
      }
    } catch (err) {
      setError("Error fetching history");
    } finally {
      setLoading(false);
    }
  }

  // --- NEW ---
  // Handler to go back from review view to the grid view
  const handleBackToGrid = () => {
    setSelectedHistoryItem(null);
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      Loading {mode} history...
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-40 text-red-500">
      <p>{error}</p>
      <Button onClick={handleRetry} className="mt-4">
        Retry
      </Button>
    </div>
  );

  // Render empty state
  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
      <p>No {mode} history found.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Exam History"
        description="View your previous exam and practice sessions"
      />

      <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Toggle for Mode Selection - Hide if reviewing an item */}
        {!selectedHistoryItem && (
          <div className="flex justify-between items-center">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(val) =>
                val && setMode(val as "exam" | "practice")
              }
              className="flex gap-2"
            >
              <ToggleGroupItem
                value="exam"
                className={`px-4 py-2 rounded-md border ${
                  mode === "exam"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Exam Mode
              </ToggleGroupItem>
              <ToggleGroupItem
                value="practice"
                className={`px-4 py-2 rounded-md border ${
                  mode === "practice"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Practice Mode
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}

        {/* Conditional Content Area */}
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : selectedHistoryItem ? ( // --- NEW: Check if an item is selected
          <ExamReviewView
            item={selectedHistoryItem}
            onBack={handleBackToGrid}
          />
        ) : !Array.isArray(history) || history.length === 0 ? (
          renderEmpty()
        ) : (
          <HistoryCardGrid
            history={history}
            onSelect={setSelectedHistoryItem}
          />
        )}
      </div>
    </div>
  );
}

// --- NEW COMPONENT: History Card Grid ---
// Renders the grid of exam history cards
function HistoryCardGrid({
  history,
  onSelect,
}: {
  history: ExamHistoryItem[];
  onSelect: (item: ExamHistoryItem) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {history.map((item) => (
        <Card
          key={item.id}
          onClick={() => item.is_completed && onSelect(item)} // Only clickable if completed
          className={`hover:shadow-md transition-shadow ${
            item.is_completed ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-semibold pr-2">
                {item.exam_title}
              </CardTitle>
              <Badge
                variant={
                  item.is_completed
                    ? item.is_passed
                      ? "success" // Use "success" variant (assumed green)
                      : "destructive" // Use "destructive" variant (assumed red)
                    : "outline"
                }
                className="flex-shrink-0"
              >
                {item.is_completed
                  ? item.is_passed
                    ? "Passed"
                    : "Failed" // Changed "Completed" to "Failed"
                  : "In Progress"}
              </Badge>
            </div>
            <CardDescription className="text-sm mt-1">
              Subject: {item.exam_subject}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            {/* --- UPDATED: Show score from result object --- */}
            {item.is_completed && item.result ? (
              <p>
                Score:{" "}
                <span className="font-medium">
                  {item.result.correct_answers} / {item.result.total_questions}
                </span>{" "}
                ({item.result.score.toFixed(2)}%)
              </p>
            ) : (
              <p>
                Score: <span className="text-muted-foreground">N/A</span>
              </p>
            )}
            <p>
              <Clock className="inline h-4 w-4 mr-1 text-muted-foreground" />
              Time Spent: {item.time_spent_minutes.toFixed(2)} min
            </p>
            <p>
              <Target className="inline h-4 w-4 mr-1 text-muted-foreground" />
              Passing Mark: {item.exam_passing_marks}%
            </p>

            <div className="flex justify-between items-center pt-2">
              <p className="text-xs text-muted-foreground">
                {item.is_completed ? "Completed" : "Started"}:{" "}
                {new Date(
                  item.is_completed ? item.end_time! : item.start_time
                ).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- NEW COMPONENT: Exam Review View ---
// Renders the detailed view for a single exam history item
function ExamReviewView({
  item,
  onBack,
}: {
  item: ExamHistoryItem;
  onBack: () => void;
}) {
  // Ensure answers is an array, default to empty array if null/undefined
  const answers: Answer[] = Array.isArray(item.answers) ? item.answers : [];

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to History
      </Button>

      <ResultSummaryCard item={item} />

      <h2 className="text-xl font-semibold">Question Review</h2>

      {answers.length > 0 ? (
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <QuestionReviewCard
              key={answer.question_id || index}
              answer={answer}
              index={index}
            />
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

// --- NEW COMPONENT: Result Summary Card ---
// Displays the overall result summary at the top of the review page
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

// --- NEW COMPONENT: Question Review Card ---
// Displays a single question and its answer/explanation
function QuestionReviewCard({
  answer,
  index,
}: {
  answer: Answer;
  index: number;
}) {
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
        {/* Question Text */}
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: answer.question_text }}
        />

        <hr />

        {/* Answers */}
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

        {/* Explanation */}
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
