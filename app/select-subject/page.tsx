"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSubjects, getUserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";

function AnimatedLoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4 w-full max-w-md mx-auto">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading subjects...</p>
    </div>
  );
}

export default function SelectSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [userField, setUserField] = useState<string>("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true);
        const userRes = await getUserProfile();
        if (!userRes.success || !userRes.data) {
          setMessage("Failed to load user profile.");
          return;
        }

        const stream =
          userRes.data.stream?.toLowerCase() ||
          userRes.data.field?.toLowerCase() ||
          "";
        setUserField(stream);

        const subjectsRes = await fetchSubjects();
        if (!subjectsRes.success || !subjectsRes.data) {
          setMessage("Failed to load subjects.");
          return;
        }

        const subjectsArray = Array.isArray(subjectsRes.data)
          ? subjectsRes.data
          : [];

        const filtered = subjectsArray.filter(
          (subject: any) =>
            subject.field?.toLowerCase() === stream ||
            subject.stream?.toLowerCase() === stream
        );

        setFilteredSubjects(filtered);
      } catch (error) {
        console.error("Error loading subjects:", error);
        setMessage("Something went wrong while fetching subjects.");
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  const handleSubjectClick = (subject: any) => {
    sessionStorage.setItem("selectedSubject", JSON.stringify(subject));
    router.push(`/select-subject/${subject.id}`);
  };

  if (loading) return <AnimatedLoadingIndicator />;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {userField
          ? `Available ${
              userField.charAt(0).toUpperCase() + userField.slice(1)
            } Field Subjects`
          : "Available Subjects"}
      </h2>

      {message && (
        <p className="text-red-500 text-sm mb-4 text-center">{message}</p>
      )}

      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="border rounded-xl p-4 hover:shadow-lg transition bg-white cursor-pointer"
              onClick={() => handleSubjectClick(subject)}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {subject.name || "Unnamed Subject"}
              </h3>
              {subject.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {subject.description}
                </p>
              )}
              <div className="mt-3">
                <Button className="w-full">View Exams</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">
          No subjects found for your field type.
        </p>
      )}
    </div>
  );
}
