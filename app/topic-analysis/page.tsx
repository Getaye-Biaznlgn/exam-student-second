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

export default function TopicAnalysisPage() {
  const [data, setData] = useState<TopicAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchTopicAnalysis();
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || "Failed to load topic analysis.");
        }
      } catch (err) {
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Topic Analysis</h1>

      {/* --- Subjects Section --- */}
      {subjects.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No subjects available.
        </p>
      ) : (
        subjects.map((subject) => (
          <Card
            key={subject.subject_id}
            className="border border-muted shadow-sm"
          >
            <CardHeader>
              <CardTitle>{subject.subject_name}</CardTitle>
              <CardDescription>
                Field: {subject.field} • Avg Accuracy:{" "}
                {subject.average_accuracy.toFixed(2)}%
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {subject.topics.length > 0 ? (
                subject.topics.map((topic) => (
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
                        <strong>Correct Answers:</strong>{" "}
                        {topic.correct_answers}
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
        ))
      )}

      {/* --- Insights Summary --- */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Overall Insights</h2>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="mt-3 text-sm text-muted-foreground">
            Total Subjects: <strong>{overall_insights.total_subjects}</strong>
            <br />
            Total Topics Analyzed:{" "}
            <strong>{overall_insights.total_topics_analyzed}</strong>
            <br />
            Overall Performance:{" "}
            <strong>{overall_insights.overall_performance.toFixed(2)}%</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
