"use client";

import { cn } from "@/lib/utils";

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
import { ExamTimer } from "@/components/exam-timer";
import { ExamQuestionCard } from "@/components/exam-question-card";
import {
  BookOpen,
  Clock,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  XCircle,
  Calendar,
  Users,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { mockExams } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ExamPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  const exam = mockExams.find((e) => e.id === params.examId);
  const currentQuestion = exam?.questions[currentQuestionIndex];

  useEffect(() => {
    if (!exam) {
      router.push("/exams");
    }
  }, [exam, router]);

  if (!exam) {
    return null;
  }

  const handleStartExam = () => {
    setExamStarted(true);
    setExamFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
  };

  const handleSelectOption = (optionId: string) => {
    if (currentQuestion) {
      setAnswers(new Map(answers.set(currentQuestion.id, optionId)));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    setShowSubmitDialog(false);
    setExamFinished(true);
  };

  const handleTimeUp = () => {
    setShowTimeUpDialog(true);
    setExamFinished(true);
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;

    exam.questions.forEach((question) => {
      const selectedOptionId = answers.get(question.id);
      if (selectedOptionId) {
        const selectedOption = question.options.find(
          (opt) => opt.id === selectedOptionId
        );
        if (selectedOption?.is_correct) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const unanswered = exam.questions.length - (correct + incorrect);
    const scorePercentage = Math.round((correct / exam.questions.length) * 100);
    const passed =
      scorePercentage >= (exam.passing_marks / exam.total_marks) * 100;

    return { correct, incorrect, unanswered, scorePercentage, passed };
  };

  if (examFinished) {
    const results = calculateResults();

    return (
      <div className="flex flex-col h-full">
        <DashboardHeader
          title="Exam Results"
          description="Your performance summary"
        />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card
              className={
                results.passed ? "border-success/50" : "border-destructive/50"
              }
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {results.passed ? (
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-destructive" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-2xl">
                      {results.passed ? "Congratulations!" : "Keep Practicing"}
                    </CardTitle>
                    <CardDescription>
                      {results.passed
                        ? "You've passed the exam successfully"
                        : "You need more practice to pass this exam"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <Award className="h-8 w-8 text-primary" />
                    <p className="text-3xl font-bold">
                      {results.scorePercentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-success/10 border border-success/20">
                    <CheckCircle className="h-8 w-8 text-success" />
                    <p className="text-3xl font-bold">{results.correct}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <XCircle className="h-8 w-8 text-destructive" />
                    <p className="text-3xl font-bold">{results.incorrect}</p>
                    <p className="text-sm text-muted-foreground">Incorrect</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <AlertTriangle className="h-8 w-8 text-accent-foreground" />
                    <p className="text-3xl font-bold">{results.unanswered}</p>
                    <p className="text-sm text-muted-foreground">Unanswered</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Analysis
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-3 rounded-lg bg-accent/5">
                      <span className="text-muted-foreground">
                        Accuracy Rate
                      </span>
                      <span className="font-semibold">
                        {answers.size > 0
                          ? Math.round((results.correct / answers.size) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-accent/5">
                      <span className="text-muted-foreground">
                        Completion Rate
                      </span>
                      <span className="font-semibold">
                        {Math.round(
                          (answers.size / exam.questions.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-accent/5">
                      <span className="text-muted-foreground">
                        Passing Score Required
                      </span>
                      <span className="font-semibold">
                        {Math.round(
                          (exam.passing_marks / exam.total_marks) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleStartExam} className="flex-1">
                    Retake Exam
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/exams")}
                  >
                    Back to Exams
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/progress")}
                  >
                    View Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Time's Up!</AlertDialogTitle>
              <AlertDialogDescription>
                The exam time has expired. Your answers have been automatically
                submitted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowTimeUpDialog(false)}>
                View Results
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader
          title={exam.title}
          description="Exam instructions and details"
        />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <GraduationCap className="h-3 w-3" />
                    {exam.field}
                  </Badge>
                  {exam.batch && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" />
                      Batch {exam.batch}
                    </Badge>
                  )}
                  {exam.year && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" />
                      {exam.year}
                    </Badge>
                  )}
                </div>
                <CardTitle>Exam Instructions</CardTitle>
                <CardDescription>
                  Please read carefully before starting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10">
                    <BookOpen className="h-8 w-8 text-accent-foreground" />
                    <div>
                      <p className="text-2xl font-bold">
                        {exam.questions.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {exam.duration_minutes}
                      </p>
                      <p className="text-sm text-muted-foreground">Minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-chart-3/10">
                    <Award className="h-8 w-8 text-chart-3" />
                    <div>
                      <p className="text-2xl font-bold">{exam.total_marks}</p>
                      <p className="text-sm text-muted-foreground">
                        Total Marks
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Important Instructions:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>
                      The exam is timed. Once started, the timer cannot be
                      paused.
                    </li>
                    <li>
                      You can navigate between questions and change your answers
                      before submitting.
                    </li>
                    <li>
                      All questions must be answered to achieve the best score.
                    </li>
                    <li>The exam will auto-submit when time runs out.</li>
                    <li>
                      You need{" "}
                      {Math.round(
                        (exam.passing_marks / exam.total_marks) * 100
                      )}
                      % to pass this exam.
                    </li>
                    <li>
                      No explanations will be n during the exam - this simulates
                      real exam conditions.
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleStartExam} className="flex-1">
                    Start Exam
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/exams")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title={exam.title} description="Exam in progress" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Left side - Question and controls */}
          <div className="flex-1 space-y-6">
            {/* Timer and Progress */}
            <div className="grid gap-4 md:grid-cols-2">
              {exam.duration_minutes && (
                <ExamTimer
                  durationMinutes={exam.duration_minutes}
                  onTimeUp={handleTimeUp}
                />
              )}

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Answered</span>
                      <span className="font-medium">
                        {answers.size} / {exam.questions.length}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(
                            (answers.size / exam.questions.length) *
                            100
                          ).toFixed(0)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question */}
            {currentQuestion && (
              <ExamQuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={exam.questions.length}
                selectedOption={answers.get(currentQuestion.id) || null}
                onSelectOption={handleSelectOption}
              />
            )}

            {/* Navigation */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of{" "}
                    {exam.questions.length}
                  </span>

                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button onClick={() => setShowSubmitDialog(true)}>
                      Submit Exam
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-80 shrink-0">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">Question Navigator</CardTitle>
                <CardDescription className="text-xs">
                  Click to jump to any question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((question, index) => {
                    const isAnswered = answers.has(question.id);
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <button
                        key={question.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={cn(
                          "h-10 rounded-lg border-2 font-medium text-sm transition-colors",
                          isCurrent &&
                            "border-primary bg-primary text-primary-foreground",
                          !isCurrent &&
                            isAnswered &&
                            "border-success/50 bg-success/10 text-success",
                          !isCurrent &&
                            !isAnswered &&
                            "border-border hover:border-primary/50"
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-primary bg-primary" />
                    <span className="text-muted-foreground">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-success/50 bg-success/10" />
                    <span className="text-muted-foreground">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-border" />
                    <span className="text-muted-foreground">Not answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answers.size} out of {exam.questions.length}{" "}
              questions. Are you sure you want to submit? You won't be able to
              change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitExam}>
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
