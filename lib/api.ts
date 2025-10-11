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
}

export interface LoginPayload {
  identifier: string; // can be email or username
  password: string;
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

  // Attempt to parse JSON
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    // If response is not JSON, wrap it
    return {
      success: false,
      message: "Unexpected response format.",
      data: { raw: text.slice(0, 200) } as T,
      meta: {},
    };
  }

  // If response is ok, return it
  if (res.ok) return data;

  // Handle error responses with structured message
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

/** Fetch all schools */
export async function fetchSchools(): Promise<ApiResponse<School[]>> {
  const res = await fetch(`${BASE_URL}/admin/public/schools`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<School[]>(res);
}

/** Register a new student */
export async function registerStudent(
  payload: RegisterPayload
): Promise<ApiResponse<any>> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<any>(res);
}

/** Login an existing student */
export async function loginStudent(
  payload: LoginPayload
): Promise<ApiResponse<any>> {
  const res = await fetch(`${BASE_URL}/auth/login/student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<any>(res);
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
