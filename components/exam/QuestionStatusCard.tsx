// components/exam/QuestionStatusCard.tsx
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Flag } from "lucide-react";

interface Props {
  answered: boolean;
  flagged: boolean;
  questionNumber: number;
}

export function QuestionStatusCard({
  answered,
  flagged,
  questionNumber,
}: Props) {
  return (
    <Card className="hidden sm:block w-48 p-4 sticky top-24 h-fit flex-shrink-0">
      <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
        Q. {questionNumber} STATUS
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {answered ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-gray-400" />
          )}
          <span
            className={
              answered ? "text-green-600 font-medium" : "text-gray-500"
            }
          >
            {answered ? "Answered" : "Not Answered"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Flag
            className={`h-5 w-5 ${flagged ? "text-red-600" : "text-gray-400"}`}
          />
          <span
            className={flagged ? "text-red-600 font-medium" : "text-gray-500"}
          >
            {flagged ? "Flagged" : "Not Flagged"}
          </span>
        </div>
      </div>
    </Card>
  );
}
