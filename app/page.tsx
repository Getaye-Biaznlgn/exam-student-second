"use client";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Clock,
  Check,
  Users,
  FileText,
  Target,
  Smartphone,
  Globe,
  BarChart3,
  MessageCircle,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white -mt-1">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Main Content */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text Section - Always on top in mobile/tablet */}
              <div className="space-y-4 sm:space-y-5 lg:order-1 order-1">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Your Dream University Is{" "}
                  <span className="text-blue-600">Closer Than You Think</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                  Join 100+ Ethiopian students using SmartPrep to master their
                  Grade 12 entrance exams, practice with real questions, and get
                  instant feedback — all in one smart learning platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-5 rounded-xl text-base sm:text-lg w-full sm:w-auto"
                  >
                    Start Practice
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-5 rounded-xl text-base sm:text-lg w-full sm:w-auto"
                  >
                    See how it works
                  </Button>
                </div>
              </div>

              {/* Image Section - Below text on mobile/tablet */}
              <div className="relative flex justify-center lg:justify-end lg:order-2 order-2">
                {/* Badge with Sharp Bottom-Right Triangle Pointer (No Shadow Anywhere) */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 lg:top-12 lg:left-8 z-20">
                  <div className="relative bg-white rounded-full px-2.5 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 flex items-center gap-1.5 sm:gap-2 border border-blue-100 text-xs sm:text-sm lg:text-base overflow-visible shadow-none">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
                    <span className="font-bold text-gray-800">
                      Got 500+ Score
                    </span>

                    {/* Sharp triangle pointer (bottom-right, no shadow) */}
                    <div
                      className="absolute -bottom-2 right-3 w-0 h-0 
    border-l-[10px] border-l-transparent 
    border-t-[14px] border-t-white 
    border-r-[10px] border-r-transparent 
    border-b-0"
                    />
                  </div>
                </div>

                {/* Background Circles */}
                <div className="absolute top-5 sm:top-16 lg:top-12 left-12 sm:left-20 w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] lg:w-[360px] lg:h-[360px] bg-blue-500 rounded-full opacity-10 z-0"></div>
                <div
                  className="absolute top-10 sm:top-20 left-16 sm:left-28 w-[140px] h-[140px] sm:w-[190px] sm:h-[190px] lg:w-[300px] lg:h-[300px] bg-blue-600
          rounded-full opacity-30 z-10"
                ></div>

                {/* Image */}
                <div className="relative z-20 w-full max-w-[220px] sm:max-w-[300px] lg:max-w-[500px]">
                  <Image
                    src="/111.png"
                    alt="Ethiopian student using SmartPrep"
                    width={650}
                    height={800}
                    className="w-full h-auto object-contain drop-shadow-2xl scale-105"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Stats - Always at bottom */}
            <div className="bg-blue-50/70 rounded-2xl p-4 sm:p-5 lg:p-6 mx-4 sm:mx-6 lg:mx-10 lg:-mt-6 order-3">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-xl lg:text-3xl font-bold text-blue-600">
                    5000+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Practice questions
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl lg:text-3xl font-bold text-blue-600">
                    1250+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Active Students
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl lg:text-3xl font-bold text-blue-600">
                    78%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Avg. Score Improvement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        className="py-12 sm:py-16 relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url('/photo_2025-11-07_11-33-10.jpg')`,
        }}
      >
        {/* COLD overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-slate-900/50 to-blue-950/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-xl">
              How it <span className="text-cyan-400">Works</span>
            </h2>
            <p className="text-gray-100 mt-3 text-sm sm:text-base max-w-3xl mx-auto drop-shadow-md">
              Join 100+ Ethiopian students using SmartPrep to master their Grade
              12 entrance exams
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                // Replace with your actual image path
                img: "/Document.png",
                title: "Sign Up",
                desc: "Create account with phone number in 2 minutes.",
              },
              {
                img: "/game-icons_click.png",
                title: "Pick Subject",
                desc: "Choose Math, Physics, Chemistry, Biology, English, and more.",
              },
              {
                img: "/Document.png",
                title: "Practice",
                desc: "Take timed exams or practice at your pace.",
              },
              {
                img: "/dashicons_welcome-learn-more.png",
                title: "Learn & Improve",
                desc: "Get AI explanations, analytics by subject/topic, and personalized study recommendations.",
              },
            ].map((step, i) => (
              <Card
                key={i}
                className="text-center p-6 hover:shadow-2xl transition-all duration-300 border-0 
                     bg-white/70 backdrop-blur-md 
                     border border-blue-500/90
                     hover:bg-white/60 
                     hover:scale-[1.02] 
                     rounded-xl"
              >
                {/* IMAGE ICON */}
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded bg-gray-400/80 flex items-center justify-center ml-4 mb-4 p-4">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="font-bold text-lg text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Exam Library */}
      <section
        className="py-12 sm:py-16 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/Screenshot 2025-11-09 215846.png')`,
        }}
      >
        {/* White Transparent Overlay (control strength via opacity) */}
        <div className="absolute inset-0 bg-white/50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              Past Exam Practice Library
            </h2>
            <p className="text-gray-100 mt-3 text-sm sm:text-base max-w-3xl mx-auto drop-shadow-md">
              Practice with real Ethiopian Secondary Education Leaving Exams
              (ESLE) — the same style, structure, and level of difficulty you'll
              face on test day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                subject: "English",
                year: "ESLE 2021",
                desc: "Practice reading comprehension, grammar, and vocabulary...",
                icon: "/icon-park-outline_english.png",
              },
              {
                subject: "Mathematics",
                year: "ESLE 2020",
                desc: "Master algebra, geometry, calculus...",
                icon: "/hugeicons_math.png",
              },
              {
                subject: "History",
                year: "ESLE 2018",
                desc: "Study Ethiopian and world history...",
                icon: "/ri_ancient-gate-line.png",
              },
              {
                subject: "Physics",
                year: "ESLE 2018",
                desc: "Challenge your problem-solving with mechanics...",
                icon: "/hugeicons_physics.png",
              },
              {
                subject: "Geography",
                year: "ESLE 2019",
                desc: "Challenge your understanding of the world...",
                icon: "/arcticons_world-geography-alt.png",
              },
              {
                subject: "Biology",
                year: "ESLE 2019",
                desc: "Get hands-on with genetics, ecosystems...",
                icon: "/group.png",
              },
            ].map((exam, i) => (
              <Card
                key={i}
                className="hover:shadow-2xl transition-all duration-300 border-0 flex flex-col h-full min-h-[190px] sm:min-h-[210px] backdrop-blur-sm bg-white/70 shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                      <img
                        src={exam.icon}
                        alt={`${exam.subject} icon`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg leading-tight text-gray-900">
                      {exam.subject} — {exam.year}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-gray-700">
                    {exam.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-2">
                  <Button
                    variant="link"
                    className="text-orange-600 p-0 h-auto font-medium text-sm hover:text-orange-700"
                  >
                    See More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Sign Up to Explore More
            </Button>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-12 sm:py-16 bg-cover bg-center bg-no-repeat text-white relative">
        {/* Full-width background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/photo_2025-11-08_11-05-47.jpg')" }}
        />
        {/* Blue overlay with transparency */}
        <div className="absolute inset-0 bg-blue-400/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12">
            What You Get with <span className="text-orange-400">SmartPrep</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                icon: FileText,
                title: "Master Every Subject at Your Own Pace",
                desc: "Access thousands of authentic past exam questions...",
              },
              {
                icon: Smartphone,
                title: "Study Anytime, Anywhere",
                desc: "All you need is a phone and internet...",
              },
              {
                icon: BarChart3,
                title: "Know Exactly Where You Stand",
                desc: "Get instant feedback after every practice test...",
              },
              {
                icon: MessageCircle,
                title: "Join a Community of Dreamers",
                desc: "You're not alone on this journey...",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-blue-800/30 backdrop-blur-md rounded-2xl p-6 border border-blue-50/10"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Success Stories */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10 sm:mb-12">
            Success Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Liya",
                location: "from a small town with few tutors",
                story:
                  "used SmartPrep to turn digital classroom into her personal tutor and scored 500+!",
                stars: 5,
                image: "/111.png",
              },
              {
                name: "Saron",
                location: "from a family with 7 kids",
                story:
                  "used SmartPrep's step-by-step lessons to study between chores and got into her dream school.",
                stars: 5,
                image: "/1111.png",
              },
              {
                name: "Mikiyas",
                location: "barely had time to study",
                story:
                  "SmartPrep's 'learn anytime' model helped him study on the bus and pass with flying colors.",
                stars: 5,
                image: "image.png",
              },
            ].map((story, i) => (
              <Card
                key={i}
                className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(story.stars)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-5 w-5 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>

                {/* Story */}
                <p className="text-gray-700 italic mb-6 text-sm sm:text-base leading-relaxed">
                  "{story.story}"
                </p>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-white shadow-md"
                    style={{ backgroundImage: `url(${story.image})` }}
                  />
                  <div>
                    <p className="font-bold text-gray-900">{story.name}</p>
                    <p className="text-sm text-gray-500">{story.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10 sm:mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "Are the questions similar to real exams?",
                  a: "Yes. All SmartPrep questions are carefully designed...",
                },
                {
                  q: "How is SmartPrep different from other study apps?",
                  a: "Unlike generic quiz apps, SmartPrep is built specifically...",
                },
              ].map((faq, i) => (
                <AccordionItem
                  key={`left-${i}`}
                  value={`left-${i}`}
                  className="bg-gray-50 rounded-xl px-4 sm:px-6 border-0"
                >
                  <AccordionTrigger className="text-base sm:text-lg font-semibold text-gray-900 hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Right Column */}
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "Can I use SmartPrep offline?",
                  a: "Not yet, but we’re working on it! You need an internet connection...",
                },
                {
                  q: "Who creates the questions and study materials?",
                  a: "Our content is created by experienced Ethiopian teachers...",
                },
              ].map((faq, i) => (
                <AccordionItem
                  key={`right-${i}`}
                  value={`right-${i}`}
                  className="bg-gray-50 rounded-xl px-4 sm:px-6 border-0"
                >
                  <AccordionTrigger className="text-base sm:text-lg font-semibold text-gray-900 hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-white">
        <div className="pt-12 sm:pt-16 lg:pt-24"></div>

        <div className="relative bg-[#0057C2] px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left: Text + Form */}
            <div className="max-w-xl w-full text-center lg:text-left z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
                Subscribe for Updates
              </h2>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                Don’t miss out on the latest updates and exclusive content.
                Subscribe now and be the first to know when our scored practice
                test is live. Stay ahead in your language learning journey!
              </p>
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="flex-1 h-12 sm:h-14 rounded-full bg-white text-gray-700 placeholder-gray-400 px-5 sm:px-6 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="submit"
                  className="bg-[#F7931E] hover:bg-[#e58310] text-white px-6 sm:px-8 h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Right: Image */}
            <div className="relative flex justify-center w-full lg:w-auto -mt-8 sm:-mt-12 lg:-mt-20">
              {/* Outer Circle */}
              <div className="absolute top-[40%] -translate-y-1/2 w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] bg-[#0057C2] rounded-full z-0"></div>
              {/* Inner White Circle */}
              <div className="absolute top-[35%] -translate-y-1/2 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[320px] lg:h-[320px] bg-white rounded-full z-10 overflow-hidden"></div>
              {/* Image */}
              <img
                src="/1111.png"
                alt="Student learning"
                className="relative z-20 w-[220px] sm:w-[280px] lg:w-[520px] object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
