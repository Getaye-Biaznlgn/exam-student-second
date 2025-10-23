"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSubjects } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [subject, setSubject] = useState<any | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubject() {
      try {
        setLoading(true);
        // Try to get subject from sessionStorage
        const stored = sessionStorage.getItem("selectedSubject");

        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.id === id) {
            setSubject(parsed);
            setLoading(false);
            return;
          }
        }

        // If no subject found locally, fetch from backend as fallback
        const res = await fetchSubjects();
        if (!res.success || !res.data) {
          setMessage("Failed to load subject information.");
          return;
        }

        const found = res.data.find((s: any) => s.id === id);
        if (!found) {
          setMessage("Subject not found.");
          return;
        }

        setSubject(found);
      } catch (err) {
        console.error("Error loading subject:", err);
        setMessage("Error loading subject data.");
      } finally {
        setLoading(false);
      }
    }

    loadSubject();
  }, [id]);

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading subject...</p>;

  if (message)
    return (
      <p className="text-center mt-6 text-red-500 font-medium">{message}</p>
    );

  if (!subject)
    return (
      <p className="text-center mt-6 text-gray-500">
        No subject data available.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card className="p-6 shadow-md rounded-2xl border">
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-700 mt-2">
            Exams under this Subject
          </h3>

          {subject.exams?.length > 0 ? (
            <div className="mt-4 space-y-4">
              {subject.exams.map((exam: any) => (
                <div
                  key={exam.id}
                  className={`border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer ${
                    selectedExam === exam.id ? "ring-2 ring-blue-400" : ""
                  }`}
                  onClick={() =>
                    setSelectedExam(selectedExam === exam.id ? null : exam.id)
                  }
                >
                  <h4 className="font-medium text-gray-800 text-lg">
                    {exam.title}
                  </h4>
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

                  {selectedExam === exam.id && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() =>
                          router.push(
                            `/exam?page=exam&exam_id=${exam.id}&mode=exam`
                          )
                        }
                      >
                        Exam Mode
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-gray-200 hover:bg-gray-300"
                        onClick={() =>
                          router.push(
                            `/exam?page=exam&exam_id=${exam.id}&mode=practice`
                          )
                        }
                      >
                        Practice Mode
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mt-4">
              No exams available for this subject yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
