// components/exam/ExamNavigationBar.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RefreshCw, Flag, List } from "lucide-react";

interface Props {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  onFlag: () => void;
  isFlagged: boolean;
  clearDisabled: boolean;
  showSummaryBtn: boolean;
  onSummary: () => void;
  isSubmitting: boolean;
}

export function ExamNavigationBar({
  canPrev,
  canNext,
  onPrev,
  onNext,
  onClear,
  onFlag,
  isFlagged,
  clearDisabled,
  showSummaryBtn,
  onSummary,
  isSubmitting,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-between p-4 bg-white rounded-lg border shadow-md sticky bottom-0 z-10 w-full">
      <Button onClick={onPrev} disabled={!canPrev} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={onClear}
          variant="outline"
          className="text-yellow-600 border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700"
          disabled={clearDisabled}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Clear
        </Button>

        <Button
          onClick={onFlag}
          variant={isFlagged ? "destructive" : "outline"}
        >
          <Flag className="mr-2 h-4 w-4" />
          {isFlagged ? "Unflag" : "Flag"}
        </Button>

        {showSummaryBtn && (
          <Button variant="outline" onClick={onSummary} className="lg:hidden">
            <List className="mr-2 h-4 w-4" /> Summary
          </Button>
        )}
      </div>

      {canNext ? (
        <Button onClick={onNext}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={onSummary} disabled={isSubmitting}>
          Submit Exam
        </Button>
      )}
    </div>
  );
}
