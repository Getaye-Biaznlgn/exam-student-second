// components/exam/MobileQuestionOverview.tsx
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

export function MobileQuestionOverview({
  questions,
  currentIdx,
  answers,
  flagged,
  onJump,
}: Props) {
  return (
    <div className="lg:hidden w-full bg-white p-4 rounded-lg border shadow-lg z-10 sticky top-16 mb-4">
      <h3 className="text-lg font-semibold mb-4">Exam Overview</h3>
      <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-[70vh] overflow-y-auto">
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
    </div>
  );
}
