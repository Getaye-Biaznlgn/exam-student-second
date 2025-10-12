import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { AppBar } from "@/components/app-bar"
import { SiteFooter } from "@/components/site-footer"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "SmartPrep - University Entrance Exam Preparation",
  description: "Prepare for Ethiopian university entrance exams with AI-powered practice tests",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <AppBar />
            {children}
            <SiteFooter />
            <Toaster />
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
