"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Microscope, Globe, Users, Award, TrendingUp } from "lucide-react"

export default function SelectFieldPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const handleFieldSelect = (field: "natural" | "social") => {
    router.push(`/select-subject?field=${field}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExamPrep</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">Welcome, {user.full_name}!</h1>
            <p className="text-muted-foreground text-lg text-pretty">
              Choose your field of study to begin your exam preparation journey
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-xs text-muted-foreground">Active Students</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-chart-3 mx-auto mb-2" />
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-xs text-muted-foreground">Practice Questions</div>
              </CardContent>
            </Card>
          </div>

          {/* Field Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Natural Sciences */}
            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
              onClick={() => handleFieldSelect("natural")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Microscope className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Natural Sciences</CardTitle>
                <CardDescription className="text-base">
                  Perfect for students pursuing engineering, medicine, and technology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-medium">Mathematics</span>
                    <span className="text-muted-foreground ml-auto">500+ questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-medium">Physics</span>
                    <span className="text-muted-foreground ml-auto">400+ questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-medium">Chemistry</span>
                    <span className="text-muted-foreground ml-auto">450+ questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-medium">Biology</span>
                    <span className="text-muted-foreground ml-auto">350+ questions</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Select Natural Sciences
                </Button>
              </CardContent>
            </Card>

            {/* Social Sciences */}
            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
              onClick={() => handleFieldSelect("social")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl">Social Sciences</CardTitle>
                <CardDescription className="text-base">
                  Ideal for students interested in humanities, law, and social studies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="font-medium">History</span>
                    <span className="text-muted-foreground ml-auto">300+ questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="font-medium">Geography</span>
                    <span className="text-muted-foreground ml-auto">350+ questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="font-medium">Economics</span>
                    <span className="text-muted-foreground ml-auto">280+ questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="font-medium">Civics</span>
                    <span className="text-muted-foreground ml-auto">250+ questions</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" variant="secondary">
                  Select Social Sciences
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Banner */}
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-center text-sm text-muted-foreground text-pretty">
                <span className="font-semibold text-foreground">Pro Tip:</span> You can switch between fields anytime to
                practice questions from different subjects and broaden your knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
