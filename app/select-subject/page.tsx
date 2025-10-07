"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  ArrowLeft,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  MapPin,
  TrendingUp,
  Scale,
} from "lucide-react"
import { mockSubjects } from "@/lib/mock-data"

const subjectIcons = {
  math: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  history: Landmark,
  geography: MapPin,
  economics: TrendingUp,
  civics: Scale,
}

const subjectColors = {
  math: "from-blue-500/20 to-blue-500/5",
  physics: "from-purple-500/20 to-purple-500/5",
  chemistry: "from-green-500/20 to-green-500/5",
  biology: "from-emerald-500/20 to-emerald-500/5",
  history: "from-amber-500/20 to-amber-500/5",
  geography: "from-cyan-500/20 to-cyan-500/5",
  economics: "from-orange-500/20 to-orange-500/5",
  civics: "from-indigo-500/20 to-indigo-500/5",
}

export default function SelectSubjectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const field = searchParams.get("field") as "natural" | "social" | null

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/")
    }
    if (!field) {
      router.push("/select-field")
    }
  }, [user, isLoading, field, router])

  if (isLoading || !field) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const subjects = mockSubjects.filter((s) => s.field === field)
  const fieldTitle = field === "natural" ? "Natural Sciences" : "Social Sciences"

  const handleSubjectSelect = (subjectId: string) => {
    router.push(`/select-batch?field=${field}&subject=${subjectId}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{fieldTitle}</p>
            <h1 className="text-3xl md:text-4xl font-bold">Choose Your Subject</h1>
            <p className="text-muted-foreground text-lg text-pretty">
              Select a subject to start practicing and preparing for your exams
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => {
              const Icon = subjectIcons[subject.id as keyof typeof subjectIcons]
              const colorClass = subjectColors[subject.id as keyof typeof subjectColors]

              return (
                <Card
                  key={subject.id}
                  className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
                  onClick={() => handleSubjectSelect(subject.id)}
                >
                  <CardHeader className="text-center pb-3">
                    <div
                      className={`mx-auto h-16 w-16 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-sm mb-4 min-h-[40px]">
                      {subject.description}
                    </CardDescription>
                    <Button className="w-full" size="sm">
                      Start Practicing
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Info Section */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">What's Next?</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    After selecting a subject, you'll choose your batch/year and then decide between Practice Mode for
                    self-paced learning or Exam Mode for timed simulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
