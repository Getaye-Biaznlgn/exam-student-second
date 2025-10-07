"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft, Calendar } from "lucide-react"
import { mockExams } from "@/lib/mock-data"

export default function SelectBatchPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const field = searchParams.get("field")
  const subject = searchParams.get("subject")

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/")
    }
    if (!field || !subject) {
      router.push("/select-field")
    }
  }, [user, isLoading, field, subject, router])

  if (isLoading || !field || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  // Get unique batches/years from exams
  const batches = Array.from(new Set(mockExams.map((e) => e.batch))).sort((a, b) => b - a)

  const handleBatchSelect = (batch: number) => {
    router.push(`/select-mode?field=${field}&subject=${subject}&batch=${batch}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground capitalize">
              {field} Sciences • {subject}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">Select Batch/Year</h1>
            <p className="text-muted-foreground text-lg">Choose the exam year you want to practice</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <Card
                key={batch}
                className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                onClick={() => handleBatchSelect(batch)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{batch}</CardTitle>
                  <CardDescription>Batch {batch} Exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Select {batch}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
