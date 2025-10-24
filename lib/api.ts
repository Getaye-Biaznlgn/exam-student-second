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

export interface StartExamResponse {
  student_exam_id: string;
  mode: string;
  exam: {
    id: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
    passing_marks: number;
  };
  questions: {
    id: string;
    question: {
      id: string;
      question_text: string;
      options: {
        id: string;
        option_key: string;
        option_text: string;
      }[];
      explanation: string;
    };
    selected_option: string | null;
    time_spent_seconds: number;
    is_correct: boolean | null;
    is_flagged: boolean;
    ai_explanation: string | null;
  }[];
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
): Promise<ApiResponse<any>> {
  const token = getAccessToken(); // Get the token

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add the Authorization header if a token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/student-exams/start-exam`, {
    method: "POST",
    headers: headers, // Use the updated headers
    body: JSON.stringify(payload),
  });

  return handleResponse<any>(res);
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
