// components/exam/ExamSummary.tsx
import { Button } from "@/components/ui/button";

interface Question {
  question: { id: string };
}
interface Props {
  questions: Question[];
  answers: Record<string, string>;
  onJump: (idx: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ExamSummary({
  questions,
  answers,
  onJump,
  onBack,
  onSubmit,
  isSubmitting,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-2 border-b pb-2">Exam Summary</h2>
      <div className="max-h-[70vh] overflow-y-auto">
        <ul>
          {questions.map((q, i) => (
            <li
              key={q.question.id}
              className="flex justify-between items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onJump(i)}
            >
              <span className="font-medium text-gray-800">
                Question {i + 1}
              </span>
              {answers.hasOwnProperty(q.question.id) ? (
                <span className="text-sm text-green-600 font-medium">
                  Answer Saved
                </span>
              ) : (
                <span className="text-sm text-gray-500">Not Answered</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t gap-2">
        <Button variant="outline" onClick={onBack}>
          Back to Exam
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Now"}
        </Button>
      </div>
    </div>
  );
}
