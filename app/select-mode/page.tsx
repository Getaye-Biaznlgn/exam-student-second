"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft, Brain, Clock } from "lucide-react"

export default function SelectModePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const field = searchParams.get("field")
  const subject = searchParams.get("subject")
  const batch = searchParams.get("batch")

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/")
    }
    if (!field || !subject || !batch) {
      router.push("/select-field")
    }
  }, [user, isLoading, field, subject, batch, router])

  if (isLoading || !field || !subject || !batch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const handleModeSelect = (mode: "practice" | "exam") => {
    if (mode === "practice") {
      router.push(`/practice?field=${field}&subject=${subject}&batch=${batch}`)
    } else {
      router.push(`/exam?field=${field}&subject=${subject}&batch=${batch}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground capitalize">
              {field} Sciences • {subject} • Batch {batch}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">Select Mode</h1>
            <p className="text-muted-foreground text-lg">Choose how you want to practice</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Practice Mode */}
            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => handleModeSelect("practice")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Practice Mode</CardTitle>
                <CardDescription>Self-paced learning with instant feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    No time limit
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Instant feedback on answers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Detailed explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    AI tutor support
                  </li>
                </ul>
                <Button className="w-full" size="lg">
                  Start Practice
                </Button>
              </CardContent>
            </Card>

            {/* Exam Mode */}
            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => handleModeSelect("exam")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Exam Mode</CardTitle>
                <CardDescription>Timed simulation of real exam conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Timed exam simulation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Real exam conditions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Results after completion
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Performance analytics
                  </li>
                </ul>
                <Button className="w-full" size="lg" variant="secondary">
                  Start Exam
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
