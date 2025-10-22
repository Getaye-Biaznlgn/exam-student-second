"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSubjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [subject, setSubject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSubject() {
      try {
        setLoading(true);
        const res = await fetchSubjects();

        if (!res.success || !res.data) {
          setMessage("Failed to load subject details.");
          return;
        }

        const found = res.data.find((s: any) => s.id === id);
        if (!found) {
          setMessage("Subject not found.");
          return;
        }

        setSubject(found);
      } catch (err) {
        console.error("Error loading subject detail:", err);
        setMessage("Error loading subject detail.");
      } finally {
        setLoading(false);
      }
    }

    loadSubject();
  }, [id]);

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading details...</p>;

  if (message)
    return (
      <p className="text-center mt-6 text-red-500 font-medium">{message}</p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="p-6 shadow-md rounded-2xl border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {subject?.name}
            </CardTitle>
            <Button variant="outline" onClick={() => router.back()}>
              ← Back
            </Button>
          </div>
          {subject?.description && (
            <p className="text-gray-600 mt-2">{subject.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Field: {subject?.field || "N/A"}
          </p>
        </CardHeader>

        <CardContent>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">
            Exam Information
          </h3>

          {subject?.exams?.length > 0 ? (
            <div className="mt-3 space-y-3">
              {subject.exams.map((exam: any) => (
                <div
                  key={exam.id}
                  className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h4 className="font-medium text-gray-800">{exam.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Batch: {exam.batch || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {exam.duration_minutes} mins
                  </p>
                  <p className="text-sm text-gray-600">
                    Passing Marks: {exam.passing_marks}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Questions: {exam.total_questions}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mt-3">
              No exams available for this subject.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
