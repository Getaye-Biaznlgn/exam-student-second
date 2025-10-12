"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Brain, TrendingUp, Clock, Check, Users, FileText, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">

              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  Ace Your Entrance Exam with Confidence
                </h1>
                <p className="text-base text-muted-foreground text-pretty max-w-xl">
                  Practice real exam questions, track your progress, and get ready for Ethiopia's Grade 12 university entrance exam with ease. Your future starts here.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Access thousands of past papers & practice tests</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Timed exams to simulate the real test</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Personalized dashboard to track your progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Designed for Ethiopian Grade 12 students</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto px-6 py-4 text-base font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">200+</div>
                  <div className="text-xs text-muted-foreground">Exams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1k+</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right Side - Student Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center relative overflow-hidden max-w-md mx-auto">
                {/* Decorative stripes */}
                <div className="absolute bottom-0 right-0 w-24 h-24">
                  <div className="absolute bottom-0 right-0 w-6 h-24 bg-white/20 transform rotate-12"></div>
                  <div className="absolute bottom-0 right-6 w-6 h-24 bg-white/20 transform rotate-12"></div>
                  <div className="absolute bottom-0 right-12 w-6 h-24 bg-white/20 transform rotate-12"></div>
                </div>
                
                {/* Student Image */}
                <div className="relative z-10 flex items-center justify-center h-full w-full">
                  <Image
                    src="/student.png"
                    alt="Student Success"
                    width={400}
                    height={500}
                    className="object-contain max-h-full max-w-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* About Section */}
      <section id="about" className="container mx-auto max-w-5xl mt-16 px-4">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">About SmartPrep</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              SmartPrep is Ethiopia's leading online exam preparation platform, designed specifically for university entrance exam candidates. 
              We combine cutting-edge AI technology with comprehensive study materials to help students achieve their academic dreams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Learning</CardTitle>
                <CardDescription>
                  Get instant explanations and personalized study recommendations powered by advanced AI technology.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your improvement with detailed analytics and performance insights across all subjects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-chart-3/10 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>Real Exam Simulation</CardTitle>
                <CardDescription>
                  Practice under real exam conditions with timed tests that mirror actual university entrance exams.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground">
                To democratize access to quality education by providing Ethiopian students with the tools and resources 
                they need to succeed in university entrance exams. We believe every student deserves the opportunity 
                to pursue higher education.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">10,000+ Active Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">95% Success Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">5,000+ Practice Questions</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="text-center py-3">
                  <CardTitle className="text-2xl font-bold text-primary">95%</CardTitle>
                  <CardDescription className="text-xs">Success Rate</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center py-3">
                  <CardTitle className="text-2xl font-bold text-accent">10K+</CardTitle>
                  <CardDescription className="text-xs">Students</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center py-3">
                  <CardTitle className="text-2xl font-bold text-chart-3">5K+</CardTitle>
                  <CardDescription className="text-xs">Questions</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center py-3">
                  <CardTitle className="text-2xl font-bold text-chart-4">24/7</CardTitle>
                  <CardDescription className="text-xs">Support</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto max-w-5xl mt-16 px-4">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Contact Us</h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Have questions? We're here to help! Reach out to our support team for assistance with your exam preparation journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Get in Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email Support</h4>
                      <p className="text-sm text-muted-foreground">support@examprep.com</p>
                      <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Phone Support</h4>
                      <p className="text-xs text-muted-foreground">+251 912 345 678</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM EAT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-chart-3" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Live Chat</h4>
                      <p className="text-xs text-muted-foreground">Available 24/7</p>
                      <p className="text-xs text-muted-foreground">Get instant help with your questions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">Office Location</h3>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-sm">SmartPrep Headquarters</p>
                  <p className="text-xs text-muted-foreground">123 SmartPrep Street</p>
                  <p className="text-xs text-muted-foreground">Addis Ababa, Ethiopia</p>
                  <p className="text-xs text-muted-foreground">P.O. Box 12345</p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Send us a Message</CardTitle>
                <CardDescription className="text-sm">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-sm">First Name</Label>
                      <Input id="firstName" placeholder="John" className="h-9" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="h-9" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contactEmail" className="text-sm">Email</Label>
                    <Input id="contactEmail" type="email" placeholder="john@example.com" className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="subject" className="text-sm">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="message" className="text-sm">Message</Label>
                    <textarea
                      id="message"
                      placeholder="Tell us more about your question..."
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit" className="w-full h-9">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

