const BASE_URL = "http://65.1.135.121:8000/api";
import { School } from "./types";

/** -------- Types -------- */

export interface RegisterPayload {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  school_id: string;
  student_id: string;
  date_of_birth: string;
  stream: "Natural" | "Social";
}
// --- Interface for My Progress Response ---
export interface MyProgressResponse {
  total_exams: number;
  completed_exams: number;
  average_score: number;
  total_questions_attempted: number;
  correct_answers: number;
  accuracy_percentage: number;
  subjects_performance: {
    [subjectName: string]: {
      exams_taken: number;
      total_score: number;
      average_score: number;
    };
  };
}
export interface StudentDashboardResponse {
  performance_overview: {
    overall_average_score: number;
    total_exams_taken: number;
    completed_exams: number;
    accuracy_percentage: number;
    total_questions_attempted: number;
    correct_answers: number;
  };
  recent_trend: {
    date: string;
    score: number;
    exam_title: string;
    subject: string;
    mode: string;
  }[];
  rank_percentile: {
    rank: number;
    percentile: number;
    total_students: number;
    performance_level: string;
  };
  subject_breakdown: {
    [subjectName: string]: {
      exams_taken: number;
      total_score: number;
      average_score: number;
      highest_score: number;
      lowest_score: number;
      improvement_trend: string;
      strength_level: string;
    };
  };
  practice_vs_exam: {
    practice: {
      total_attempts: number;
      average_score: number;
      highest_score: number;
      average_time_minutes: number;
      accuracy_rate: number;
    };
    exam: {
      total_attempts: number;
      average_score: number;
      highest_score: number;
      average_time_minutes: number;
      accuracy_rate: number;
    };
  };
  time_management: {
    student_avg_time_per_question: number;
    top_performers_avg_time: number;
    efficiency_rating: string;
    time_comparison: string;
  };
  improvement_tracking: {
    score_growth: number;
    most_improved_subject: string | null;
    needs_attention_subjects: string[];
    improvement_rate: number;
  };
  recommendations: {
    type: string;
    message: string;
    priority: string;
    action: string;
  }[];
  last_updated: string;
}
// --- Interface for Topic Analysis Response (Updated) ---

export interface Topic {
  topic_id: string;
  topic_name: string;
  description: string;
  total_questions_attempted: number;
  correct_answers: number;
  accuracy_percentage: number;
  average_time_per_question: number;
  difficulty_level: string;
  strength_level: string;
  improvement_trend: string;
  recommendation: string;
}

export interface Subject {
  subject_id: string;
  subject_name: string;
  subject_description: string | null;
  field: string;
  total_topics: number;
  topics_attempted: number;
  average_accuracy: number;
  strong_topics_count: number;
  weak_topics_count: number;
  improving_topics_count: number;
  topics: Topic[];
}

export interface OverallInsights {
  strong_topics: string[];
  weak_topics: string[];
  improving_topics: string[];
  total_subjects: number;
  total_topics_analyzed: number;
  overall_performance: number;
}

export interface TopicAnalysisResponse {
  subjects: Subject[];
  overall_insights: OverallInsights;
}
// --- Interface for Exam History Item ---
export interface ExamHistoryItem {
  id: string;
  exam_title: string;
  exam_subject: string;
  exam_duration: number;
  exam_passing_marks: number;
  mode: "exam" | "practice";
  start_time: string;
  end_time: string | null;
  score: number | string | null;
  is_completed: boolean;
  time_spent_total_seconds: number | null;
  time_spent_minutes: number;
  is_passed: boolean;
  created_at: string;
}

// --- Interface for Exam History Response ---
export type ExamHistoryResponse = ExamHistoryItem[];

export interface LoginPayload {
  identifier: string;
  password: string;
}
export interface StartExamPayload {
  exam_id: string;
  mode: "exam" | "practice";
}
export interface StartExamRequest {
  exam_id: string;
  mode: "exam" | "practice";
}

// Interface for a single option
interface QuestionOption {
  id: string;
  option_key: string;
  option_text: string;
}

// Interface for the nested question data
interface QuestionDetail {
  id: string;
  question_text: string;
  options: QuestionOption[];
  explanation: string | null; // <-- More accurate type
  correct_option?: string; // <-- ADDED: Optional field for practice mode
}

// Interface for a single question in the student's exam
interface StudentQuestion {
  id: string;
  question: QuestionDetail;
  selected_option: string | null;
  time_spent_seconds: number;
  is_correct: boolean | null;
  is_flagged: boolean;
  ai_explanation: string | null;
  // You could also add these fields from your JSON
  // created_at: string;
  // updated_at: string;
}

// Your main response interface, now using the helper interfaces
export interface StartExamResponse {
  student_exam_id: string;
  mode: "practice" | "exam"; // Using literal types is even better
  exam: {
    id: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
    passing_marks: number;
  };
  questions: StudentQuestion[];
}
interface SubmitAnswer {
  question_id: string; // Refers to question.question.id (inner ID)
  selected_option: string | null; // Refers to option_key (e.g., "D")
  time_spent_seconds: number;
  is_flagged: boolean;
}

interface SubmitExamPayload {
  student_exam_id: string;
  answers: SubmitAnswer[];
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
}
export interface AIExplanation {
  content: string;
  steps: string[];
  why_correct: string;
  why_wrong: string;
  key_concepts: string[];
  tips: string;
}

export interface AIExplanationResponse {
  question_id: string;
  explanation: AIExplanation;
  cached: boolean;
}

/** -------- Helper: handle responses -------- */
async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      success: false,
      message: "Unexpected response format.",
      data: { raw: text.slice(0, 200) } as T,
      meta: {},
    };
  }

  if (res.ok) return data;

  const errorMessage =
    data?.message ||
    (typeof data === "object"
      ? Object.values(data).flat().join(", ")
      : `Request failed with status ${res.status}`);

  return {
    success: false,
    message: errorMessage,
    data: data?.data || data || {},
    meta: data?.meta || {},
  };
}

/** -------- API calls -------- */
export async function fetchSchools(): Promise<ApiResponse<School[]>> {
  const res = await fetch(`${BASE_URL}/admin/public/schools`);
  return handleResponse<School[]>(res);
}

export async function registerStudent(
  payload: RegisterPayload
): Promise<ApiResponse<any>> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // 👈 includes stream now
  });
  return handleResponse<any>(res);
}
export async function startExam(
  payload: StartExamPayload
): Promise<ApiResponse<StartExamResponse>> {
  // <-- Use your specific interface
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/student-exams/start-exam`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  // Pass the specific type to handleResponse as well
  return handleResponse<StartExamResponse>(res);
}

export async function submitExam(
  studentExamId: string,
  questions: StartExamResponse["questions"]
): Promise<ApiResponse<any>> {
  const token = getAccessToken();

  const payload: SubmitExamPayload = {
    student_exam_id: studentExamId,
    answers: questions.map((q) => ({
      question_id: q.question.id, // Use inner question.id
      selected_option: q.selected_option, // null if unanswered
      time_spent_seconds: q.time_spent_seconds || 0,
      is_flagged: q.is_flagged || false,
    })),
  };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/student-exams/submit-exam`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse<any>(res);
}
export async function fetchMyProgress(): Promise<
  ApiResponse<MyProgressResponse>
> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/student-exams/my-progress`, {
    method: "GET",
    headers,
  });

  return res.json();
}
// --- Fetch Function for Student Dashboard ---
export async function fetchStudentDashboard(): Promise<
  ApiResponse<StudentDashboardResponse>
> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/student-exams/dashboard`, {
    method: "GET",
    headers,
  });

  return res.json();
}
// --- Fetch Function for Topic Analysis (Updated) ---
export async function fetchTopicAnalysis(): Promise<
  ApiResponse<TopicAnalysisResponse>
> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/student-exams/topic-analysis`, {
    method: "GET",
    headers,
  });

  const data = await res.json();

  // optional safety check to ensure structure consistency
  if (!data?.data?.subjects || !data?.data?.overall_insights) {
    throw new Error("Invalid response format from topic-analysis API");
  }

  return {
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta || {},
  };
}
// --- Fetch Function for Exam History ---
export async function fetchExamHistory(
  mode: "exam" | "practice"
): Promise<ApiResponse<ExamHistoryResponse>> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${BASE_URL}/student-exams/exam-history?mode=${mode}`,
    {
      method: "GET",
      headers,
    }
  );

  return res.json();
}
// --- AI Explanation ---
export async function fetchAIExplanation(
  questionId: string
): Promise<ApiResponse<AIExplanationResponse>> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${BASE_URL}/student-exams/questions/${questionId}/ai-explanation`,
    {
      method: "GET",
      headers,
    }
  );

  return handleResponse<AIExplanationResponse>(res);
}

export async function submitAnswer(
  answer: SubmitAnswer
): Promise<ApiResponse<any>> {
  const token = getAccessToken();

  const payload = {
    question_id: answer.question_id, // Expects question.question.id
    selected_option: answer.selected_option,
    time_spent_seconds: answer.time_spent_seconds || 0,
    is_flagged: answer.is_flagged || false,
  };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/student-exams/submit-answer`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse<any>(res);
}
export async function loginStudent(
  payload: LoginPayload
): Promise<ApiResponse<any>> {
  const res = await fetch(`${BASE_URL}/auth/login/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(res);
}

export async function getUserProfile(): Promise<ApiResponse<any>> {
  const token = getAccessToken();
  if (!token) {
    return { success: false, message: "No access token found" };
  }

  const res = await fetch(`${BASE_URL}/auth/student/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<any>(res);
}
// api.ts (add this below getUserProfile)

export async function updateUserProfile(
  updatedData: Record<string, any>
): Promise<ApiResponse<any>> {
  const token = getAccessToken();
  if (!token) {
    return { success: false, message: "No access token found" };
  }

  const res = await fetch(`${BASE_URL}/auth/student/profile/update`, {
    method: "PUT", // or PATCH — confirm which one backend supports
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  return handleResponse<any>(res);
}
export async function fetchSubjects(): Promise<ApiResponse<any[]>> {
  const token = getAccessToken();
  if (!token) {
    return { success: false, message: "No access token found" };
  }

  const res = await fetch(`${BASE_URL}/student/subjects`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await handleResponse<any>(res);

  // The BE now wraps subjects in `data`
  if (response.success && response.data?.data) {
    return { ...response, data: response.data.data };
  }

  return response;
}

/** -------- Optional: token helpers -------- */
export function saveTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem("access_token", accessToken);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function getAccessToken(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;
}

export function getRefreshToken(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem("refresh_token")
    : null;
}
