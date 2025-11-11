"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSubjects, getUserProfile } from "@/lib/api";
import { fetchAvailableLiveExams, LiveExam } from "@/lib/api";
import { Button } from "@/components/ui/button";
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

/* --------------------------------------------------------------
   1. Loading spinner
   -------------------------------------------------------------- */
function AnimatedLoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4 w-full max-w-md mx-auto">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading subjects...</p>
    </div>
  );
}

/* --------------------------------------------------------------
   2. Icon mapper
   -------------------------------------------------------------- */
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
  return BookOpen;
};

/* --------------------------------------------------------------
   3. UTC to Ethiopian time (Africa/Addis_Ababa = UTC+3)
   -------------------------------------------------------------- */
const toEthiopianTime = (utcIso: string): string => {
  const date = new Date(utcIso);
  return new Intl.DateTimeFormat("en-ET", {
    timeZone: "Africa/Addis_Ababa",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

/* --------------------------------------------------------------
   4. Countdown to target
   -------------------------------------------------------------- */
const Countdown: React.FC<{ target: Date }> = ({ target }) => {
  const calculate = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return { h, m, s };
  };

  const [{ h, m, s }, setTime] = useState(calculate());

  useEffect(() => {
    const id = setInterval(() => setTime(calculate()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <span className="font-mono text-red-600 font-bold">
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
      {String(s).padStart(2, "0")}
    </span>
  );
};

/* --------------------------------------------------------------
   5. Modal for exam details
   -------------------------------------------------------------- */
const ExamDetailsModal: React.FC<{
  exam: LiveExam | null;
  onClose: () => void;
}> = ({ exam, onClose }) => {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-[#0C2340] mb-3">{exam.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Subject:</strong> {exam.subject_name}
          </p>
          <p>
            <strong>Duration:</strong> {exam.duration_minutes} minutes
          </p>
          <p>
            <strong>Total Questions:</strong> {exam.total_questions}
          </p>
          <p>
            <strong>Passing Marks:</strong> {exam.passing_marks}
          </p>
          <p>
            <strong>Start:</strong> {toEthiopianTime(exam.start_time)}
          </p>
          <p>
            <strong>End:</strong> {toEthiopianTime(exam.end_time)}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              onClose();
              window.location.href = `/exam?exam_id=${exam.id}&mode=exam&type=live`;
            }}
          >
            Enter Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------
   6. Compact Live Exam Card
   -------------------------------------------------------------- */
const LiveExamCard: React.FC<{ exam: LiveExam }> = ({ exam }) => {
  const start = new Date(exam.start_time);
  const end = new Date(exam.end_time);
  const now = Date.now();
  const [showModal, setShowModal] = useState(false);

  const isUpcoming = now < start.getTime();
  const isRunning = now >= start.getTime() && now <= end.getTime();

  return (
    <>
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-red-200 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
            {isRunning ? "LIVE NOW" : "UPCOMING"}
          </span>
          {isUpcoming && <Countdown target={start} />}
        </div>

        <h3 className="font-bold text-base text-[#0C2340] line-clamp-1">
          {exam.title}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2">
          {exam.subject_name} • {exam.duration_minutes} min
        </p>

        <div className="flex justify-between mt-2">
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-xs"
            onClick={() => setShowModal(true)}
          >
            View Details
          </Button>
          {isRunning && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs"
              onClick={() =>
                (window.location.href = `/exam?exam_id=${exam.id}&mode=exam&type=live`)
              }
            >
              Enter Now
            </Button>
          )}
        </div>
      </div>

      {showModal && (
        <ExamDetailsModal exam={exam} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

/* --------------------------------------------------------------
   7. Main Page
   -------------------------------------------------------------- */
export default function SelectSubjectPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [userField, setUserField] = useState<string>("");
  const [message, setMessage] = useState("");
  const [liveExam, setLiveExam] = useState<LiveExam | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);

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

  useEffect(() => {
    async function loadLiveExam() {
      try {
        setLiveLoading(true);
        const res = await fetchAvailableLiveExams();

        // unify both server shapes:
        // - res.data = LiveExam[] (older/unwrapped)
        // - res.data = { data: LiveExam[], meta: ... } (wrapped)
        const list: LiveExam[] = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [];

        if (res.success && Array.isArray(list) && list.length > 0) {
          const exam = list.find((e) => e.can_take);
          setLiveExam(exam ?? null);
        } else {
          setLiveExam(null);
        }
      } catch (err) {
        console.error("Failed to fetch live exams", err);
        setLiveExam(null);
      } finally {
        setLiveLoading(false);
      }
    }
    loadLiveExam();
  }, []);

  const handleSubjectClick = (subject: any) => {
    sessionStorage.setItem("selectedSubject", JSON.stringify(subject));
    router.push(`/select-subject/${subject.id}`);
  };

  if (loading) return <AnimatedLoadingIndicator />;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* Header + Live Exam */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0C2340] leading-tight text-center sm:text-left">
          {userField
            ? `${
                userField.charAt(0).toUpperCase() + userField.slice(1)
              } Field Subjects`
            : "Available Subjects"}
        </h2>

        <div className="sm:max-w-xs w-full">
          {!liveLoading && liveExam ? (
            <LiveExamCard exam={liveExam} />
          ) : liveLoading ? (
            <div className="bg-gray-100 rounded-xl h-24 animate-pulse" />
          ) : null}
        </div>
      </div>

      {message && (
        <p className="text-red-500 text-sm mb-6 text-center">{message}</p>
      )}

      {/* Subjects */}
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
                <div className="absolute top-0 left-0 right-0 h-[6px] rounded-t-[22px] bg-[#007BFF]" />
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
