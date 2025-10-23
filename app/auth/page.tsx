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
import {
  registerStudent,
  loginStudent,
  type RegisterPayload,
  type LoginPayload,
} from "@/lib/api";
import { SchoolSelect } from "@/components/school-select";

export default function AuthPage() {
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<
    RegisterPayload & { password_confirm: string }
  >({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    school_id: "",
    student_id: "",
    date_of_birth: "",
    stream: "Natural", // 👈 default
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !authLoading) router.push("/select-subject");
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: LoginPayload = {
        identifier: formData.email,
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

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });
      router.push("/select-subject");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      const res = await registerStudent(formData);

      if (!res.success) throw new Error(res.message || "Registration failed");

      toast({
        title: "Account created!",
        description:
          "Welcome! Your account has been created successfully. Please log in to continue.",
      });

      // prefill email for login
      setFormData((prev) => ({ ...prev, password: "", password_confirm: "" }));
      setMode("login");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description:
          err?.message || "Please try again with different credentials.",
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
            defaultValue={mode}
            onValueChange={(val) => setMode(val as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

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
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
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
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* First Name and Last Name on same row */}
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

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {/* Field Type (Natural / Social) */}
                    <div className="space-y-2">
                      <Label htmlFor="stream">Field Type</Label>
                      <select
                        id="stream"
                        name="stream"
                        value={formData.stream || ""}
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

                    {/* Student ID and Date of Birth on same row */}
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
                          placeholder="Date of Birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* School Selection */}
                    <SchoolSelect
                      value={formData.school_id}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, school_id: value }))
                      }
                      disabled={isSubmitting}
                    />

                    {/* Password and Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password_confirm">Confirm Password</Label>
                      <Input
                        id="password_confirm"
                        type="password"
                        name="password_confirm"
                        placeholder="Confirm Password"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        required
                      />
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
