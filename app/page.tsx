"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
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
      <section className="bg-gradient-to-b from-blue-50/50 to-white min-h-screen flex items-start lg:items-center pt-0">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-7xl mx-auto w-full h-full flex flex-col justify-between">
          {/* Main Content */}
          <div className="p-4 sm:p-8 lg:p-10 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center flex-grow">
            {/* Text Section */}
            <div className="space-y-4 sm:space-y-5 lg:order-1 order-1 mt-0">
              <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight  sm:text-left">
                Your Dream University Is{" "}
                <span className="text-blue-600">Closer Than You Think</span>
              </h1>

              <p className="text-base sm:text-base lg:text-lg text-gray-600 text-center sm:text-left">
                Join 100+ Ethiopian students using SmartPrep to master their
                Grade 12 entrance exams, practice with real questions, and get
                instant feedback — all in one smart learning platform.
              </p>

              {/* Buttons side by side on all screens */}
              <div className="flex flex-row justify-center sm:justify-start gap-3 flex-wrap">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-5 rounded-xl text-lg sm:text-lg w-auto"
                  >
                    Start Practice
                  </Button>
                </Link>
                <Link href="/#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-5 rounded-xl text-lg sm:text-lg w-auto"
                  >
                    See how it works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative flex justify-center lg:justify-end lg:order-2 order-2 mt-4 sm:mt-0">
              {/* Badge */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 lg:top-12 lg:left-8 z-20">
                <div className="relative bg-white rounded-full px-3 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 flex items-center gap-2 border border-blue-100 text-sm sm:text-sm lg:text-base overflow-visible shadow-none">
                  <Check className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                  <span className="font-bold text-gray-800">
                    Got 500+ Score
                  </span>
                  <div
                    className="absolute -bottom-2 right-3 w-0 h-0 
                border-l-[10px] border-l-transparent 
                border-t-[14px] border-t-white 
                border-r-[10px] border-r-transparent 
                border-b-0"
                  />
                </div>
              </div>

              {/* Bigger Circles */}
              <div className="absolute top-3 sm:top-14 lg:top-10 left-10 sm:left-18 w-[200px] h-[200px] sm:w-[270px] sm:h-[270px] lg:w-[400px] lg:h-[400px] bg-blue-500 rounded-full opacity-10 z-0"></div>
              <div className="absolute top-8 sm:top-18 left-14 sm:left-26 w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] lg:w-[340px] lg:h-[340px] bg-blue-600 rounded-full opacity-30 z-10"></div>

              {/* Slightly Larger Image */}
              <div className="relative z-20 w-full max-w-[270px] sm:max-w-[340px] lg:max-w-[520px]">
                <Image
                  src="/111.png"
                  alt="Ethiopian student using SmartPrep"
                  width={700}
                  height={850}
                  className="w-full h-auto object-contain drop-shadow-2xl scale-110"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-blue-50/70 rounded-2xl p-4 sm:p-5 lg:p-6 mx-4 sm:mx-6 lg:mx-10 mb-0">
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
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-40 px-15 relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url('/photo_2025-11-07_11-33-10.jpg')`,
        }}
      >
        {/* Soft dark overlay */}
        <div className="absolute inset-0 bg-blue-400/35 "></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
              How it <span className="text-[#FF8A00]">Works</span>
            </h2>
            <p className="text-gray-100 mt-4 text-base sm:text-lg max-w-3xl mx-auto">
              Join 100+ Ethiopian students using SmartPrep to master their Grade
              12 entrance exams
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
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
              <div
                key={i}
                className="bg-white/60 rounded-[22px] p-8 text-center shadow-lg hover:shadow-2xl 
             transition-transform duration-300 hover:-translate-y-2 border border-blue-900/90 
             flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 rounded bg-blue-500/30 flex items-center justify-center mb-2 shadow-md">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-5 h-5 object-contain opacity-90"
                  />
                </div>

                <h3 className="font-semibold text-lg text-[#0056B3] mb-2">
                  {step.title}
                </h3>

                <p className="text-black text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Exam Library */}
      <section
        id="past-exams"
        className="py-12 sm:py-20 relative bg-[#E6F0FA] overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0C2340] leading-tight">
              Past Exam <span className="text-[#007BFF]">Practice Library</span>
            </h2>
            <p className="text-[#425466] mt-3 sm:mt-4 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Practice with real Ethiopian Secondary Education Leaving Exams
              (ESLE) — the same style, structure, and level of difficulty you'll
              face on test day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[
              {
                subject: "English",
                year: "ESSLCE 2021-2022",
                desc: "Polish your comprehension, grammar, and vocabulary...",
                icon: "/icon-park-outline_english.png",
              },
              {
                subject: "Mathematics",
                year: "ESSLCE 2020-2021",
                desc: "Sharpen your math logic with actual exam questions...",
                icon: "/hugeicons_math.png",
              },
              {
                subject: "History",
                year: "ESSLCE 2018-2019",
                desc: "Challenge your knowledge of Ethiopia and the world...",
                icon: "/ri_ancient-gate-line.png",
              },
              {
                subject: "Physics",
                year: "ESSLCE 2018-2019",
                desc: "Solve authentic physics problems just like the real exam...",
                icon: "/hugeicons_physics.png",
              },
              {
                subject: "Geography",
                year: "ESSLCE 2019-2020",
                desc: "Understand geography with real world map and region questions...",
                icon: "/arcticons_world-geography-alt.png",
              },
              {
                subject: "Biology",
                year: "ESSLCE 2019-2020",
                desc: "Study genetics, ecosystems, and biology-based reasoning...",
                icon: "/group.png",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-[22px] shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-[#E2E8F0] relative"
              >
                <div className="absolute top-0 left-0 right-0 h-[6px] rounded-t-[22px] bg-[#007BFF]" />

                <div className="flex items-center gap-3 mb-4 mt-2">
                  <img
                    src={item.icon}
                    alt=""
                    className="w-10 h-10 object-contain opacity-90"
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-[#0C2340] leading-tight">
                    {item.subject} — {item.year}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-[#425466] leading-relaxed">
                  {item.desc}
                </p>

                <button
                  onClick={() => {
                    const token =
                      localStorage.getItem("token") ||
                      document.cookie.includes("authToken");
                    if (token) {
                      // user is logged in → navigate to page
                      window.location.href = "/select-subject";
                    } else {
                      // not logged in → redirect to login
                      window.location.href = "/auth";
                    }
                  }}
                  className="text-[#007BFF] mt-4 font-semibold text-sm sm:text-base hover:underline"
                >
                  See More
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-14">
            <Link href="/auth">
              <button className="bg-[#FF8A00] hover:bg-[#ff9f33] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg font-semibold text-base sm:text-lg transition">
                SignUp to Explore More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section
        id="features"
        className="py-20 relative text-white bg-cover bg-center bg-no-repeat"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/photo_2025-11-08_11-05-47.jpg')" }}
        />
        <div className="absolute inset-0 bg-[#0A1C3C]/70 backdrop-blur-sm" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-14">
            What You Get with <span className="text-[#FF8A00]">SmartPrep</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {[
              {
                title: "Master Every Subject at Your Own Pace",
                desc: "Access thousands of authentic past exam questions across all subjects. Whether you're in Addis Ababa or a rural village, SmartPrep gives you the same preparation tools as students in the most expensive private schools.",
              },
              {
                title: "Study Anytime, Anywhere",
                desc: "All you need is a phone and internet. Practice during your commute, after school, or late at night. SmartPrep works on your schedule, not the other way around.",
              },
              {
                title: "Know Exactly Where You Stand",
                desc: "Get instant feedback after every practice test. Our AI identifies your strengths and weak points, helping you focus your study time where it matters most—just like having a personal tutor.",
              },
              {
                title: "Join a Community of Dreamers",
                desc: "You're not alone in this journey. Connect with thousands of students across Ethiopia who are preparing together, supporting each other, and working toward their dreams.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`
            bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] 
            p-8 min-h-[240px] 
            ${i % 2 === 1 ? "sm:mt-8" : ""}   /* shift right-side cards down */
          `}
              >
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-[#D8E1EB] leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section
        id="success-stories"
        className="relative py-12 sm:py-16 bg-[url('/photo_2025-11-08_08-03-34.jpg')] bg-cover bg-center bg-no-repeat"
      >
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 to-white/80"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
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

        {/* MOBILE: Image Section on top */}
        <div className="block lg:hidden bg-white pb-10">
          <div className="relative flex justify-center w-full pt-6">
            {" "}
            {/* UPDATED: reduced top padding */}
            {/* Outer Circle */}
            <div className="absolute top-[45%] -translate-y-1/2 w-[280px] h-[280px] bg-[#0057C2] rounded-full z-0"></div>{" "}
            {/* UPDATED: slightly larger & moved up */}
            {/* Inner White Circle */}
            <div className="absolute top-[45%] -translate-y-1/2 w-[220px] h-[220px] bg-white rounded-full z-10 overflow-hidden"></div>{" "}
            {/* UPDATED */}
            {/* Image */}
            <img
              src="/1111.png"
              alt="Student learning"
              className="relative z-20 w-[240px] object-contain drop-shadow-xl -mt-2" // UPDATED: slightly bigger & nudged up
            />
          </div>
        </div>

        {/* TEXT + FORM SECTION */}
        <div className="relative bg-[#0057C2] px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left: Text + Form */}
            <div className="max-w-xl w-full text-center lg:text-left z-10 order-2 lg:order-1">
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

            {/* DESKTOP: Image Section */}
            <div className="relative hidden lg:flex justify-center w-full lg:w-auto order-1 lg:order-2">
              {/* Outer Circle */}
              <div className="absolute top-[35%] -translate-y-1/2 w-[440px] h-[440px] bg-[#0057C2] rounded-full -mt-20 z-0"></div>{" "}
              {/* UPDATED */}
              {/* Inner White Circle */}
              <div className="absolute top-[30%] -translate-y-1/2 w-[340px] h-[340px] bg-white rounded-full z-10 -mt-20 overflow-hidden"></div>{" "}
              {/* UPDATED */}
              {/* Image */}
              <img
                src="/1111.png"
                alt="Student learning"
                className="relative z-20 w-[760px] object-contain drop-shadow-xl -mt-6" // UPDATED: bigger & slightly up
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
