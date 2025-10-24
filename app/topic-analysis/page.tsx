"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTopicAnalysis } from "@/lib/api"; // adjust this import path to where your fetch function is
import type { TopicAnalysisResponse } from "@/types"; // adjust path if necessary
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

  const { topic_analysis, topic_insights } = data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Topic Analysis</h1>

      {/* --- Insights Section --- */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Insights Summary</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Strong Topics</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {topic_insights.strong_topics.map((t) => (
                <Badge
                  key={t}
                  variant="default"
                  className="bg-green-600 text-white"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium">Weak Topics</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {topic_insights.weak_topics.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-red-600 text-white"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium">Improving Topics</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {topic_insights.improving_topics.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="border-blue-600 text-blue-600"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            Total Topics Analyzed:{" "}
            <strong>{topic_insights.total_topics_analyzed}</strong> <br />
            Overall Topic Performance:{" "}
            <strong>
              {topic_insights.overall_topic_performance.toFixed(1)}%
            </strong>
          </div>
        </CardContent>
      </Card>

      {/* --- Per-Topic Analysis --- */}
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(topic_analysis).map(([topicName, topic]) => (
          <Card key={topicName} className="border border-muted">
            <CardHeader>
              <h3 className="font-semibold text-lg">{topicName}</h3>
              <p className="text-sm text-muted-foreground">
                {topic.subject_area_name}
              </p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Total Questions:</strong>{" "}
                {topic.total_questions_attempted}
              </p>
              <p>
                <strong>Correct Answers:</strong> {topic.correct_answers}
              </p>
              <p>
                <strong>Accuracy:</strong> {topic.accuracy_percentage}%
              </p>
              <p>
                <strong>Average Time:</strong> {topic.average_time_per_question}
                s
              </p>
              <p>
                <strong>Difficulty:</strong> {topic.difficulty_level}
              </p>
              <p>
                <strong>Strength Level:</strong> {topic.strength_level}
              </p>
              <p>
                <strong>Trend:</strong> {topic.improvement_trend}
              </p>
              <p>
                <strong>Recommendation:</strong> {topic.recommendation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
