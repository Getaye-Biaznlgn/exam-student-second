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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !authLoading) router.push("/select-field");
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
      router.push("/select-field");
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
      const payload: RegisterPayload = { ...formData };
      delete (payload as any).password_confirm; // backend doesn't expect password_confirm

      const res = await registerStudent(formData);

      if (!res.success) throw new Error(res.message || "Registration failed");

      toast({
        title: "Account created!",
        description: "Welcome! Your account has been created successfully.",
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
            <h1 className="text-3xl font-bold mb-2">Welcome to ExamPrep</h1>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>

          <Tabs
            defaultValue={mode}
            onValueChange={(val) => setMode(val)}
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
                    {[
                      { label: "Username", name: "username", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      {
                        label: "Phone Number",
                        name: "phone_number",
                        type: "tel",
                      },
                      { label: "First Name", name: "first_name", type: "text" },
                      { label: "Last Name", name: "last_name", type: "text" },
                      { label: "School ID", name: "school_id", type: "text" },
                      { label: "Student ID", name: "student_id", type: "text" },
                      {
                        label: "Date of Birth",
                        name: "date_of_birth",
                        type: "date",
                      },
                      { label: "Password", name: "password", type: "password" },
                      {
                        label: "Confirm Password",
                        name: "password_confirm",
                        type: "password",
                      },
                    ].map((field) => (
                      <div className="space-y-2" key={field.name}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Input
                          id={field.name}
                          type={field.type}
                          name={field.name}
                          placeholder={field.label}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    ))}
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
