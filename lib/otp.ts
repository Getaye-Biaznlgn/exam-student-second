// lib/otp.ts
export interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    debug_otp?: string;
    otp_expires_in?: number;
  };
}

export const requestPhoneOtp = async (phone: string): Promise<OtpResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/otp/phone/request`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone }),
    }
  );
  return res.json();
};

export const verifyPhoneOtp = async (
  phone: string,
  code: string
): Promise<OtpResponse> => {
  const form = new URLSearchParams();
  form.append("phone_number", phone);
  form.append("code", code);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/otp/phone/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    }
  );
  return res.json();
};
