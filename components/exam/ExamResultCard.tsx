// components/exam/ExamResultCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Result {
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
}

interface Props {
  result: Result | null;
  exam: { passing_marks: number };
  onReview: () => void;
  onHome: () => void;
}

export function ExamResultCard({ result, exam, onReview, onHome }: Props) {
  const hasDetails = result && typeof result.score === "number";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">Exam Submitted!</h1>

        {hasDetails ? (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold">Your Result</h2>
            <p
              className={`text-5xl font-bold mt-2 ${
                result.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.score.toFixed(1)}%
            </p>
            <p className="text-lg mt-2 text-muted-foreground">
              You got {result.correct_answers} out of {result.total_questions}{" "}
              correct.
            </p>
            <p className="text-lg mt-2 text-muted-foreground">
              (Passing Mark: {exam.passing_marks}%)
            </p>
            <p
              className={`text-xl font-semibold mt-4 ${
                result.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.passed
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
          <Button variant="outline" onClick={onReview}>
            Review Exam
          </Button>
          <Button onClick={onHome}>Back to Home</Button>
        </div>
      </Card>
    </div>
  );
}
