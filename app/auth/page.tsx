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
  requestPhoneOtp, // Added
  verifyPhoneOtp, // Added
  type LoginPayload,
  // Assuming these types are exported from your api file
  type PhoneOtpRequest,
  type PhoneOtpVerify,
} from "@/lib/api";
import { SchoolSelect } from "@/components/school-select";
import { Eye, EyeOff } from "lucide-react";

// Helper for phone validation
const PHONE_REGEX = /^\+2519\d{8}$/;
const PHONE_PREFIX = "+251";
const INVALID_PHONE_MSG = "Invalid phone. Please enter 9 digits (e.g., 912345678).";

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
    phone_number: PHONE_PREFIX,
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

  // --- Registration Step State ---
  const [registrationStep, setRegistrationStep] = useState<1 | 2 | 3>(1); // 1: Phone, 2: OTP, 3: Registration Form
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  // --- End Registration Step State ---

  useEffect(() => {
    if (user && !authLoading) router.push("/select-subject");
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      setPhoneError(null);
      // Only allow digits, max 9 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 9);
      // Store with prefix for API
      const fullNumber = PHONE_PREFIX + digitsOnly;
      setFormData((prev) => ({ ...prev, phone_number: fullNumber }));
      
      // Reset OTP status if phone number changes
      if (registrationStep > 1) {
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setOtpCode("");
        setVerifiedPhoneNumber("");
        setRegistrationStep(1); // Reset to step 1 if phone changes
      }
    } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePhone = () => {
    if (!PHONE_REGEX.test(formData.phone_number)) {
      setPhoneError(INVALID_PHONE_MSG);
      toast({
        title: "Invalid Phone Number",
        description: INVALID_PHONE_MSG,
        variant: "destructive",
      });
      return false;
    }
    setPhoneError(null);
    return true;
  };

  // Get phone number without prefix for display
  const getPhoneDisplay = (phone: string) => {
    return phone.startsWith(PHONE_PREFIX) ? phone.slice(PHONE_PREFIX.length) : phone.replace(/\D/g, "");
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

  /* --------------------- OTP HANDLERS --------------------- */
  const handleSendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validatePhone()) return;

    setIsSendingOtp(true);
    try {
      const payload: PhoneOtpRequest = {
        phone_number: formData.phone_number,
      };
      await requestPhoneOtp(payload);

      toast({
        title: "OTP Sent!",
        description: "A verification code has been sent to your phone.",
      });
      setIsOtpSent(true);
      setIsOtpVerified(false); // Reset verification status
      setOtpCode(""); // Clear old code
      if (registrationStep === 1) {
        setRegistrationStep(2); // Move to OTP verification step only if on step 1
      }
    } catch (err: any) {
      toast({
        title: "Failed to send OTP",
        description:
          err?.message || "Please check the phone number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const payload: PhoneOtpVerify = {
        phone_number: formData.phone_number,
        code: otpCode,
      };
      await verifyPhoneOtp(payload);

      toast({
        title: "Phone Verified!",
        description: "Your phone number has been successfully verified.",
      });
      setIsOtpVerified(true);
      setVerifiedPhoneNumber(formData.phone_number); // Store verified phone number
      setRegistrationStep(3); // Move to registration form step
    } catch (err: any) {
      toast({
        title: "Verification Failed",
        description: err?.message || "The code is incorrect or has expired.",
        variant: "destructive",
      });
      setIsOtpVerified(false);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /* --------------------- REGISTER --------------------- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ---- 1. OTP Verification Check (Safety check) ----
    if (!isOtpVerified || !verifiedPhoneNumber) {
      toast({
        title: "Verification Required",
        description:
          "Please verify your phone number before creating an account.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // ---- 2. Password match ----
    if (formData.password !== formData.password_confirm) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // ---- 3. Submit Registration ----
    try {
      const payload = { ...formData, phone_number: verifiedPhoneNumber }; // Use verified phone number
      const res = await registerStudent(payload as any);

      if (!res.success) throw new Error(res.message || "Registration failed");

      toast({
        title: "Account created!",
        description: "Your account is ready. Please log in to continue.",
      });

      // Reset fields and switch to login
      setFormData((prev) => ({
        ...prev,
        password: "",
        password_confirm: "",
        phone_number: PHONE_PREFIX,
      }));
      setIsOtpSent(false);
      setIsOtpVerified(false);
      setOtpCode("");
      setVerifiedPhoneNumber("");
      setRegistrationStep(1); // Reset to step 1
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
            onValueChange={(v) => {
              setMode(v as "login" | "register");
              // Reset registration step when switching tabs
              if (v === "register") {
                setRegistrationStep(1);
                setVerifiedPhoneNumber("");
                setIsOtpSent(false);
                setIsOtpVerified(false);
                setOtpCode("");
                setFormData((prev) => ({ ...prev, phone_number: PHONE_PREFIX }));
              } else {
                setFormData((prev) => ({ ...prev, phone_number: PHONE_PREFIX }));
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* ------------------- LOGIN TAB (Unchanged) ------------------- */}
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
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-sm">
                          {PHONE_PREFIX}
                        </span>
                        <Input
                          id="login-phone"
                          type="tel"
                          name="phone_number"
                          placeholder="912345678"
                          value={getPhoneDisplay(formData.phone_number)}
                          onChange={handleInputChange}
                          maxLength={9}
                          required
                          className="rounded-l-none"
                        />
                      </div>
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

            {/* ------------------- REGISTER TAB (Step-based) ------------------- */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    {registrationStep === 1 && "Enter your phone number to get started"}
                    {registrationStep === 2 && "Verify your phone number with the code sent"}
                    {registrationStep === 3 && "Complete your registration"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Step 1: Phone Number */}
                  {registrationStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-sm">
                            {PHONE_PREFIX}
                          </span>
                          <Input
                            id="phone_number"
                            type="tel"
                            name="phone_number"
                            placeholder="912345678"
                            value={getPhoneDisplay(formData.phone_number)}
                            onChange={handleInputChange}
                            maxLength={9}
                            required
                            className={`rounded-l-none ${phoneError ? "border-red-500" : ""}`}
                          />
                        </div>
                        {phoneError && (
                          <p className="text-xs text-red-500">{phoneError}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleSendOtp}
                        disabled={
                          isSendingOtp || 
                          getPhoneDisplay(formData.phone_number).length !== 9 ||
                          !PHONE_REGEX.test(formData.phone_number)
                        }
                      >
                        {isSendingOtp ? "Sending..." : "Send Verification Code"}
                      </Button>
                    </div>
                  )}

                  {/* Step 2: OTP Verification */}
                  {registrationStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp_code">Verification Code</Label>
                        <p className="text-sm text-muted-foreground">
                          We sent a verification code to {formData.phone_number}
                        </p>
                        <Input
                          id="otp_code"
                          type="text"
                          name="otp_code"
                          placeholder="123456"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          disabled={isVerifyingOtp || isOtpVerified}
                          className="text-center text-2xl tracking-widest"
                        />
                        {isOtpVerified && (
                          <p className="text-sm font-medium text-green-600">
                            ✓ Phone number verified successfully!
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setRegistrationStep(1);
                            setOtpCode("");
                            setIsOtpSent(false);
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={handleVerifyOtp}
                          disabled={
                            isVerifyingOtp ||
                            isOtpVerified ||
                            otpCode.length !== 6
                          }
                        >
                          {isVerifyingOtp
                            ? "Verifying..."
                            : isOtpVerified
                            ? "Verified"
                            : "Verify"}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? "Sending..." : "Resend Code"}
                      </Button>
                    </div>
                  )}

                  {/* Step 3: Registration Form */}
                  {registrationStep === 3 && (
                  <form onSubmit={handleRegister} className="space-y-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="mb-2"
                        onClick={() => {
                          setRegistrationStep(1);
                          setIsOtpVerified(false);
                          setVerifiedPhoneNumber("");
                          setIsOtpSent(false);
                          setOtpCode("");
                          // Reset form data phone number
                          setFormData((prev) => ({ ...prev, phone_number: PHONE_PREFIX }));
                        }}
                      >
                        ← Back to Phone Number
                      </Button>
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

                      {/* Verified Phone Display (Read-only) */}
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                          {verifiedPhoneNumber} ✓ Verified
                        </div>
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
                              stream: e.target.value as "Natural" | "Social",
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

                      {/* Confirm Password */}
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

                      {/* Create Account Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
