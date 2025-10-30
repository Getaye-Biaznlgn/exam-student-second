// components/exam/QuestionStatusCard.tsx
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  answered: boolean;
  flagged: boolean;
  questionNumber: number;
  onFlag: () => void; // NEW: toggle flag
  isFlagged: boolean; // NEW: same as `flagged` (for consistency)
}

export function QuestionStatusCard({
  answered,
  flagged,
  questionNumber,
  onFlag,
  isFlagged = flagged, // fallback
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

        <div className="flex items-center justify-between">
          {/* Flag/Unflag Button (same style as ExamNavigationBar) */}
          <Button
            onClick={onFlag}
            variant={isFlagged ? "destructive" : "outline"}
            size="sm"
            className="h-8 px-2 text-xs"
          >
            <Flag className="h-3.5 w-3.5 mr-1" />
            {isFlagged ? "Unflag" : "Flag"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
