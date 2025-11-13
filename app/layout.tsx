import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { Suspense } from "react";
import "./globals.css";

// --- NEW IMPORTS ---
import { LayoutProvider } from "@/lib/layout-context";
import { LocaleProvider } from "@/lib/locale-context";
import { MainLayout } from "@/components/MainLayout";

// --- REMOVED IMPORTS ---
// import { Toaster } from "@/components/ui/toaster"
// import { AppBar } from "@/components/app-bar"
// import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "SmartPrep - University Entrance Exam Preparation",
  description:
    "Prepare for Ethiopian university entrance exams with AI-powered practice tests",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <AuthProvider>
            <LocaleProvider>
              {/* 1. Wrap everything with the LayoutProvider */}
              <LayoutProvider>
                {/* 2. Use MainLayout to render the content */}
                <MainLayout>
                  {/* 3. Your page (children) goes inside */}
                  {children}
                </MainLayout>
              </LayoutProvider>
            </LocaleProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
