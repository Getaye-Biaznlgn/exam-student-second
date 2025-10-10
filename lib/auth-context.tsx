// lib/authContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { saveTokens, clearTokens, getAccessToken } from "./api";

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
  profile_picture?: string | null;
  [key: string]: any; // to allow flexibility for backend response
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

  // Restore session from localStorage
  useEffect(() => {
    try {
      const token = getAccessToken();
      const userData =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (token && userData) {
        setAccessToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (err) {
      console.error("Error restoring auth session:", err);
      clearTokens();
    } finally {
      setLoading(false);
    }
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
    setUser(user);
    setAccessToken(accessToken);
    saveTokens(accessToken, refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
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
