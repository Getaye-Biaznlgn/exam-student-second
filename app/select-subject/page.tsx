"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSubjects, getUserProfile } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SelectSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
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

        setSubjects(subjectsArray);
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

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-600">Loading subjects...</p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card className="p-6 shadow-md rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            {userField
              ? `Available ${
                  userField.charAt(0).toUpperCase() + userField.slice(1)
                } Field Subjects`
              : "Available Subjects"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {message && (
            <p className="text-red-500 text-sm mb-4 text-center">{message}</p>
          )}

          {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="border rounded-xl p-4 hover:shadow-lg transition bg-white cursor-pointer"
                  onClick={() => router.push(`/select-subject/${subject.id}`)}
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
                    <Button className="w-full">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-6">
              No subjects found for your field type.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
