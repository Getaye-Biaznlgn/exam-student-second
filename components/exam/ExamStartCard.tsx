// components/exam/ExamStartCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { StartExamResponse } from "@/lib/api";

interface Props {
  exam: StartExamResponse["exam"];
  onStart: () => void;
}

export function ExamStartCard({ exam, onStart }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{exam.title}</h1>
        <p>Total Questions: {exam.total_questions}</p>
        <p>Duration: {exam.duration_minutes} minutes</p>
        <p>Passing Marks: {exam.passing_marks}</p>
        <Button className="w-full mt-6" size="lg" onClick={onStart}>
          Start Exam
        </Button>
      </Card>
    </div>
  );
}
