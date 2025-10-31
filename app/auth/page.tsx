"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { registerStudent, loginStudent, type LoginPayload } from "@/lib/api";
import { SchoolSelect } from "@/components/school-select";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "register">("login");

  // NOTE: `username` removed, `password_confirm` kept for BE
  const [formData, setFormData] = useState<
    Omit<Parameters<typeof registerStudent>[0], "username"> & {
      password_confirm: string;
    }
  >({
    email: "",
    phone_number: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    school_id: "",
    student_id: "",
    date_of_birth: "",
    stream: "Natural",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) router.push("/select-subject");
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone_number") setPhoneError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* --------------------- LOGIN --------------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: LoginPayload = {
        identifier: formData.phone_number,
        password: formData.password,
      };

      const res = await loginStudent(payload);
      if (!res.success || !res.data)
        throw new Error(res.message || "Login failed");

      const { access_token, refresh_token, ...userData } = res.data;
      await login({
        user: userData,
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      toast({ title: "Welcome back!", description: "Logged in successfully." });
      router.push("/select-subject");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message || "Check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* --------------------- REGISTER --------------------- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ---- Phone validation ----
    const phoneRegex = /^(09\d{8}|\+2519\d{8})$/;
    if (!phoneRegex.test(formData.phone_number)) {
      const msg =
        "Invalid phone. Use 09... (10 digits) or +2519... (12 digits).";
      setPhoneError(msg);
      toast({
        title: "Registration failed",
        description: msg,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // ---- Password match (still client-side) ----
    if (formData.password !== formData.password_confirm) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // SEND **password_confirm** to the backend
      const payload = { ...formData }; // includes password_confirm

      const res = await registerStudent(payload as any); // `any` because BE now expects password_confirm

      if (!res.success) throw new Error(res.message || "Registration failed");

      toast({
        title: "Account created!",
        description: "Your account is ready. Please log in to continue.",
      });

      setFormData((prev) => ({
        ...prev,
        password: "",
        password_confirm: "",
      }));
      setMode("login");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.message || "Try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to SmartPrep</h1>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>

          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* ------------------- LOGIN TAB ------------------- */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-phone">Phone Number</Label>
                      <Input
                        id="login-phone"
                        type="tel"
                        name="phone_number"
                        placeholder="0912345678 or +251912345678"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------------------- REGISTER TAB ------------------- */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Join thousands of students preparing for their exams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* First / Last name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          type="text"
                          name="first_name"
                          placeholder="First Name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          type="text"
                          name="last_name"
                          placeholder="Last Name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        placeholder="0912345678 or +251912345678"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                        className={phoneError ? "border-red-500" : ""}
                      />
                      {phoneError && (
                        <p className="text-xs text-red-500">{phoneError}</p>
                      )}
                    </div>

                    {/* Field Type */}
                    <div className="space-y-2">
                      <Label htmlFor="stream">Field Type</Label>
                      <select
                        id="stream"
                        name="stream"
                        value={formData.stream}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stream: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value="" disabled>
                          Select your field
                        </option>
                        <option value="Natural">Natural</option>
                        <option value="Social">Social</option>
                      </select>
                    </div>

                    {/* Student ID + DOB */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student_id">Student ID</Label>
                        <Input
                          id="student_id"
                          type="text"
                          name="student_id"
                          placeholder="Student ID"
                          value={formData.student_id}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* School */}
                    <SchoolSelect
                      value={formData.school_id}
                      onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, school_id: v }))
                      }
                      disabled={isSubmitting}
                    />

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password – **sent to BE** */}
                    <div className="space-y-2">
                      <Label htmlFor="password_confirm">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="password_confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          name="password_confirm"
                          placeholder="Confirm Password"
                          value={formData.password_confirm}
                          onChange={handleInputChange}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
