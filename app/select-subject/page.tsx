"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSubjects, getUserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";

// Import Lucide icons
import {
  BookOpen,
  Calculator,
  Atom,
  Globe,
  Briefcase,
  Palette,
  Heart,
  Laptop,
  Beaker,
  Languages,
  Music,
  Scale,
  DollarSign,
  Users,
  Building,
  Code,
  PenTool,
} from "lucide-react";

function AnimatedLoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4 w-full max-w-md mx-auto">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading subjects...</p>
    </div>
  );
}

// Map field/stream to appropriate icon
const getSubjectIcon = (field: string) => {
  const normalized = field.toLowerCase().trim();

  if (normalized.includes("science")) return Atom;
  if (normalized.includes("math")) return Calculator;
  if (normalized.includes("english") || normalized.includes("language"))
    return Languages;
  if (normalized.includes("history") || normalized.includes("social"))
    return BookOpen;
  if (normalized.includes("commerce") || normalized.includes("business"))
    return Briefcase;
  if (normalized.includes("arts") || normalized.includes("humanities"))
    return Palette;
  if (normalized.includes("medical") || normalized.includes("biology"))
    return Heart;
  if (normalized.includes("engineering") || normalized.includes("tech"))
    return Laptop;
  if (normalized.includes("chemistry")) return Beaker;
  if (normalized.includes("physics")) return Atom;
  if (normalized.includes("accountancy") || normalized.includes("economics"))
    return DollarSign;
  if (normalized.includes("law") || normalized.includes("legal")) return Scale;
  if (normalized.includes("computer") || normalized.includes("it")) return Code;
  if (normalized.includes("design") || normalized.includes("art"))
    return PenTool;
  if (normalized.includes("music")) return Music;
  if (normalized.includes("geography")) return Globe;
  if (normalized.includes("political") || normalized.includes("civics"))
    return Users;
  if (normalized.includes("management") || normalized.includes("admin"))
    return Building;

  // Default fallback
  return BookOpen;
};

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
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0C2340] text-center mb-10 sm:mb-14 leading-tight">
        {userField
          ? `${
              userField.charAt(0).toUpperCase() + userField.slice(1)
            } Field Subjects`
          : "Available Subjects"}
      </h2>

      {message && (
        <p className="text-red-500 text-sm mb-6 text-center">{message}</p>
      )}

      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredSubjects.map((subject) => {
            const Icon = getSubjectIcon(
              subject.field || subject.stream || subject.name || ""
            );

            return (
              <div
                key={subject.id}
                onClick={() => handleSubjectClick(subject)}
                className="bg-white rounded-[22px] shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-[#E2E8F0] relative cursor-pointer group"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[6px] rounded-t-[22px] bg-[#007BFF]" />

                {/* Icon + Content */}
                <div className="flex items-start gap-4 mt-2">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-[#007BFF]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-[#0C2340] leading-tight">
                      {subject.name || "Unnamed Subject"}
                    </h3>

                    {subject.description && (
                      <p className="mt-2 text-sm sm:text-base text-[#425466] leading-relaxed line-clamp-3">
                        {subject.description}
                      </p>
                    )}

                    <button className="mt-4 font-semibold text-sm sm:text-base text-[#007BFF] hover:underline inline-flex items-center gap-1">
                      View Exams
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">
          No subjects found for your field type.
        </p>
      )}
    </div>
  );
}
