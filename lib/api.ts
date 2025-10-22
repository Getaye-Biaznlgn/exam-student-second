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
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
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
  const res = await fetch(`${BASE_URL}/student/exams/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
