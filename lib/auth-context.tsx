// lib/authContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { saveTokens, clearTokens, getAccessToken, getUserProfile } from "./api";

export interface User {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: string;
  student_id: string;
  date_of_birth: string;
  stream?: "Natural" | "Social"; // 👈 added here
  profile_picture?: string | null;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage and refresh user profile
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = getAccessToken();
        if (!token) return setLoading(false);

        const storedUser =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setAccessToken(token);
        }

        // 👇 Fetch latest profile from backend
        const res = await getUserProfile();
        if (res.success && res.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        clearTokens();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  /** Called after successful login */
  const login = async ({
    user,
    accessToken,
    refreshToken,
  }: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  }) => {
    saveTokens(accessToken, refreshToken);
    setAccessToken(accessToken);

    // Fetch full profile after login
    const res = await getUserProfile();
    const finalUser = res.success && res.data ? res.data : user;

    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
  };

  /** Called when logging out */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    clearTokens();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook for easy access to auth context */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
