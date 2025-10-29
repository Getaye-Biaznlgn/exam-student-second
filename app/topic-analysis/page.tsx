"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTopicAnalysis } from "@/lib/api";
import type { TopicAnalysisResponse } from "@/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // make sure you have this utility (ShadCN includes it)

export default function TopicAnalysisPage() {
  const [data, setData] = useState<TopicAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchTopicAnalysis();
        if (res.success) {
          setData(res.data);
          if (res.data.subjects.length > 0) {
            setSelectedSubjectId(res.data.subjects[0].subject_id); // select first subject by default
          }
        } else {
          setError(res.message || "Failed to load topic analysis.");
        }
      } catch {
        setError("An error occurred while fetching topic analysis.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          Loading topic analysis...
        </span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  if (!data) return null;

  const { subjects, overall_insights } = data;
  const selectedSubject = subjects.find(
    (subject) => subject.subject_id === selectedSubjectId
  );

  return (
    <div className="p-6 space-y-6 no-scrollbar overflow-y-auto h-screen">
      <h1 className="text-2xl font-bold mb-4">Topic Analysis</h1>

      {/* --- Overall Insights --- */}
      <Card className="border border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Overall Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <h3 className="text-lg font-semibold">
                {overall_insights.total_subjects}
              </h3>
            </Card>

            <Card className="bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Total Topics Analyzed
              </p>
              <h3 className="text-lg font-semibold">
                {overall_insights.total_topics_analyzed}
              </h3>
            </Card>

            <Card className="bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Overall Performance
              </p>
              <h3 className="text-lg font-semibold">
                {overall_insights.overall_performance.toFixed(2)}%
              </h3>
            </Card>
          </div>

          <div>
            <h3 className="font-medium">Strong Topics</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {overall_insights.strong_topics.length > 0 ? (
                overall_insights.strong_topics.map((t) => (
                  <Badge key={t} className="bg-green-600 text-white">
                    {t}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No strong topics yet.
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium">Weak Topics</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {overall_insights.weak_topics.length > 0 ? (
                overall_insights.weak_topics.map((t) => (
                  <Badge key={t} className="bg-red-600 text-white">
                    {t}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No weak topics yet.
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium">Improving Topics</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {overall_insights.improving_topics.length > 0 ? (
                overall_insights.improving_topics.map((t) => (
                  <Badge
                    key={t}
                    className="border-blue-600 text-blue-600"
                    variant="outline"
                  >
                    {t}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No improving topics yet.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Subject Filter (Horizontal List) --- */}
      {subjects.length > 0 && (
        <div className="flex overflow-x-auto gap-2 py-2 no-scrollbar">
          {subjects.map((subject) => (
            <button
              key={subject.subject_id}
              onClick={() => setSelectedSubjectId(subject.subject_id)}
              className={cn(
                "px-4 py-2 rounded-full border transition-all whitespace-nowrap",
                selectedSubjectId === subject.subject_id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-700"
              )}
            >
              {subject.subject_name}
            </button>
          ))}
        </div>
      )}

      {/* --- Selected Subject Topics --- */}
      {selectedSubject ? (
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle>{selectedSubject.subject_name}</CardTitle>
            <CardDescription>
              Field: {selectedSubject.field} • Avg Accuracy:{" "}
              {selectedSubject.average_accuracy.toFixed(2)}%
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {selectedSubject.topics.length > 0 ? (
              selectedSubject.topics.map((topic) => (
                <div
                  key={topic.topic_id}
                  className="border border-border rounded-lg p-3 space-y-1"
                >
                  <h3 className="font-semibold text-base">
                    {topic.topic_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.description || "No description provided."}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 text-sm mt-2">
                    <p>
                      <strong>Accuracy:</strong>{" "}
                      {topic.accuracy_percentage.toFixed(2)}%
                    </p>
                    <p>
                      <strong>Difficulty:</strong> {topic.difficulty_level}
                    </p>
                    <p>
                      <strong>Strength:</strong> {topic.strength_level}
                    </p>
                    <p>
                      <strong>Trend:</strong> {topic.improvement_trend}
                    </p>
                    <p>
                      <strong>Questions Attempted:</strong>{" "}
                      {topic.total_questions_attempted}
                    </p>
                    <p>
                      <strong>Correct Answers:</strong> {topic.correct_answers}
                    </p>
                    <p>
                      <strong>Avg Time:</strong>{" "}
                      {topic.average_time_per_question}s
                    </p>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">
                    <strong>Recommendation:</strong> {topic.recommendation}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No topics analyzed for this subject.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground text-center">
          No subject selected.
        </p>
      )}
    </div>
  );
}
