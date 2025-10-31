const BASE_URL = "http://65.1.135.121:8000/api";
import { School } from "./types";

export interface RegisterPayload {
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
// --- Interface for an individual Answer ---
export interface ExamAnswer {
  question_id: string;
  question_text: string;
  selected_option: string | null;
  correct_option: string;
  is_correct: boolean | null;
  is_flagged: boolean;
  time_spent_seconds: number;
  explanation: string;
  ai_explanation: string | null;
}

// --- Interface for the Result summary ---
export interface ExamResult {
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
  passing_threshold: number;
  time_spent_seconds: number;
  time_spent_minutes: number;
}

// --- UPDATED Interface for Exam History Item ---
export interface ExamHistoryItem {
  id: string;
  exam_title: string;
  exam_subject: string;
  exam_duration: number;
  exam_passing_marks: number;
  mode: "exam" | "practice";
  start_time: string;
  end_time: string | null;
  score: string | null; // CHANGED: Now only string | null
  is_completed: boolean;
  time_spent_total_seconds: number | null;
  time_spent_minutes: number;
  is_passed: boolean;
  created_at: string;
  result: ExamResult | null; // NEW: Added result object
  answers: ExamAnswer[]; // NEW: Added answers array
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

// This function remains unchanged. It's a great generic parser.
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

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  const fullUrl = `${BASE_URL}${endpoint}`;

  // Set default headers. Allow overriding with options.headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: headers,
    });

    // *** GLOBAL 401 (UNAUTHORIZED) HANDLER ***
    if (res.status === 401) {
      clearTokens(); // Clear expired tokens and user data

      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }

      return {
        success: false,
        message: "Your session has expired. Please log in again.",
      };
    }

    return handleResponse<T>(res);
  } catch (error) {
    console.error("API Fetch Network Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "A network error occurred.",
    };
  }
}

export function fetchSchools(): Promise<ApiResponse<School[]>> {
  return apiFetch<School[]>("/admin/public/schools", { method: "GET" });
}

export function registerStudent(
  payload: RegisterPayload
): Promise<ApiResponse<any>> {
  return apiFetch<any>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function startExam(
  payload: StartExamPayload
): Promise<ApiResponse<StartExamResponse>> {
  return apiFetch<StartExamResponse>("/student-exams/start-exam", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitExam(
  studentExamId: string,
  questions: StartExamResponse["questions"]
): Promise<ApiResponse<any>> {
  const payload: SubmitExamPayload = {
    student_exam_id: studentExamId,
    answers: questions.map((q) => ({
      question_id: q.question.id,
      selected_option: q.selected_option,
      time_spent_seconds: q.time_spent_seconds || 0,
      is_flagged: q.is_flagged || false,
    })),
  };

  return apiFetch<any>("/student-exams/submit-exam", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMyProgress(): Promise<ApiResponse<MyProgressResponse>> {
  return apiFetch<MyProgressResponse>("/student-exams/my-progress", {
    method: "GET",
  });
}

export function fetchStudentDashboard(): Promise<
  ApiResponse<StudentDashboardResponse>
> {
  return apiFetch<StudentDashboardResponse>("/student-exams/dashboard", {
    method: "GET",
  });
}

export function fetchTopicAnalysis(): Promise<
  ApiResponse<TopicAnalysisResponse>
> {
  return apiFetch<TopicAnalysisResponse>("/student-exams/topic-analysis", {
    method: "GET",
  });
}

export function fetchExamHistory(
  mode: "exam" | "practice"
): Promise<ApiResponse<ExamHistoryResponse>> {
  return apiFetch<ExamHistoryResponse>(
    `/student-exams/exam-history?mode=${mode}`,
    {
      method: "GET",
    }
  );
}

export function fetchAIExplanation(
  questionId: string
): Promise<ApiResponse<AIExplanationResponse>> {
  return apiFetch<AIExplanationResponse>(
    `/student-exams/questions/${questionId}/ai-explanation`,
    {
      method: "GET",
    }
  );
}

export function submitAnswer(answer: SubmitAnswer): Promise<ApiResponse<any>> {
  const payload = {
    question_id: answer.question_id,
    selected_option: answer.selected_option,
    time_spent_seconds: answer.time_spent_seconds || 0,
    is_flagged: answer.is_flagged || false,
  };

  return apiFetch<any>("/student-exams/submit-answer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginStudent(payload: LoginPayload): Promise<ApiResponse<any>> {
  return apiFetch<any>("/auth/login/student", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getUserProfile(): Promise<ApiResponse<any>> {
  return apiFetch<any>("/auth/student/profile", {
    method: "GET",
  });
}

export function updateUserProfile(
  updatedData: Record<string, any>
): Promise<ApiResponse<any>> {
  return apiFetch<any>("/auth/student/profile/update", {
    method: "PUT", // or PATCH
    body: JSON.stringify(updatedData),
  });
}

// This function is the only one that needs to be `async`
// because it has custom logic *after* the API call.
export async function fetchSubjects(): Promise<ApiResponse<any[]>> {
  // Use `any` here since the wrapper structure is { data: { data: [...] } }
  const response = await apiFetch<any>("/student/subjects", {
    method: "GET",
  });

  // Maintain the original logic to unwrap the nested `data` array
  if (response.success && response.data?.data) {
    // Return the response with the `data` property pointing to the *inner* array
    return { ...response, data: response.data.data as any[] };
  }

  // Return the original response if unwrapping isn't possible
  return response;
}

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
