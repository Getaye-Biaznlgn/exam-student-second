// components/exam/QuestionSidebar.tsx
import { Flag } from "lucide-react";

interface Question {
  question: { id: string };
}
interface Props {
  questions: Question[];
  currentIdx: number;
  answers: Record<string, string>;
  flagged: Set<string>;
  onJump: (idx: number) => void;
}

export function QuestionSidebar({
  questions,
  currentIdx,
  answers,
  flagged,
  onJump,
}: Props) {
  return (
    <aside className="hidden lg:block lg:w-80 flex-shrink-0 bg-white p-4 rounded-lg border shadow-sm sticky top-24 h-fit">
      <h3 className="text-lg font-semibold mb-4">Exam Overview</h3>
      <div className="grid grid-cols-6 gap-2">
        {questions.map((q, i) => {
          const qId = q.question.id;
          const isCurrent = currentIdx === i;
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
            <button key={qId} className={styles} onClick={() => onJump(i)}>
              {i + 1}
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

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-blue-600 mr-2 border border-blue-700" />
          Current
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-gray-400 mr-2 border border-gray-500" />
          Answered
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-white mr-2 border border-gray-300" />
          Not Answered
        </div>
        <div className="flex items-center">
          <Flag className="w-4 h-4 text-red-500 mr-2" fill="currentColor" />
          Flagged for Review
        </div>
      </div>
    </aside>
  );
}
