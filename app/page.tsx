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
import { useLocale } from "@/lib/locale-context";

export default function LandingPage() {
  const { t, formatNumber } = useLocale();

  const stats = [
    {
      value: `${formatNumber(5000)}+`,
      label: t("landing.stats.questionsLabel"),
    },
    {
      value: `${formatNumber(1250)}+`,
      label: t("landing.stats.studentsLabel"),
    },
    {
      value: formatNumber(0.78, {
        style: "percent",
        maximumFractionDigits: 0,
      }),
      label: t("landing.stats.improvementLabel"),
    },
  ];

  const howItWorksSteps = [
    { key: "signUp", img: "/Document.png" },
    { key: "pickSubject", img: "/game-icons_click.png" },
    { key: "practice", img: "/Document.png" },
    { key: "learn", img: "/dashicons_welcome-learn-more.png" },
  ] as const;

  const pastExamItems = [
    { key: "english", icon: "/icon-park-outline_english.png" },
    { key: "mathematics", icon: "/hugeicons_math.png" },
    { key: "history", icon: "/ri_ancient-gate-line.png" },
    { key: "physics", icon: "/hugeicons_physics.png" },
    { key: "geography", icon: "/arcticons_world-geography-alt.png" },
    { key: "biology", icon: "/group.png" },
  ] as const;

  const featureItems = [
    "masterSubjects",
    "studyAnytime",
    "knowStanding",
    "community",
  ] as const;

  const successStories = ["liya", "saron", "mikiyas"] as const;

  const faqKeys = [
    "realExams",
    "difference",
    "offline",
    "contentCreators",
  ] as const;

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white min-h-[80vh] lg:min-h-screen flex items-start lg:items-center pt-0">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-7xl mx-auto w-full h-full flex flex-col justify-between ">
          {/* Main Content */}
          <div className="p-4 sm:p-8 lg:p-10 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center flex-grow">
            {/* Text Section */}
            <div className="space-y-4 sm:space-y-5 lg:order-1 order-1 mt-0">
              <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight  sm:text-left">
                {t("landing.hero.titleStart")}{" "}
                <span className="text-blue-600">
                  {t("landing.hero.titleHighlight")}
                </span>
              </h1>

              <p className="text-base sm:text-base lg:text-lg text-gray-600 text-center sm:text-left">
                {t("landing.hero.description")}
              </p>

              {/* Buttons side by side on all screens */}
              <div className="flex flex-row justify-center sm:justify-start gap-3 flex-wrap">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-5 rounded-xl text-lg sm:text-lg w-auto"
                  >
                    {t("landing.hero.primaryCta")}
                  </Button>
                </Link>
                <Link href="/#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-5 rounded-xl text-lg sm:text-lg w-auto"
                  >
                    {t("landing.hero.secondaryCta")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative flex justify-center lg:justify-end lg:order-2 order-2 mt-4 sm:mt-0">
              {/* Badge */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 lg:top-12 lg:left-8 z-20">
                <div
                  className="relative bg-white rounded-full px-3 py-1.5 flex items-center gap-2 border border-blue-100 text-sm overflow-visible shadow-none
  -translate-x-14 sm:translate-x-0"
                >
                  <Check className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                  <span className="font-bold text-gray-800">
                    {t("landing.hero.badge")}
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
              <div
                className="absolute top-8 sm:top-18 left-14 sm:left-26 
             w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] 
             lg:w-[340px] lg:h-[340px] rounded-full opacity-90 z-10"
                style={{ backgroundColor: "#004B84" }}
              ></div>

              {/* Slightly Larger Image */}
              <div className="relative z-20 w-full max-w-[270px] sm:max-w-[340px] lg:max-w-[520px]">
                <Image
                  src="/111.png"
                  alt={t("landing.hero.imageAlt")}
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
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-lg sm:text-xl lg:text-3xl font-bold text-blue-600">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
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
              {t("landing.howItWorks.title")}{" "}
              <span className="text-[#FF8A00]">
                {t("landing.howItWorks.highlight")}
              </span>
            </h2>
            <p className="text-gray-100 mt-4 text-base sm:text-lg max-w-3xl mx-auto">
              {t("landing.howItWorks.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, i) => (
              <div
                key={step.key}
                className="bg-white/60 rounded-[22px] p-8 text-center shadow-lg hover:shadow-2xl 
             transition-transform duration-300 hover:-translate-y-2 border border-blue-900/90 
             flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 rounded bg-blue-500/30 flex items-center justify-center mb-2 shadow-md">
                  <img
                    src={step.img}
                    alt={t(`landing.howItWorks.steps.${step.key}.title`)}
                    className="w-5 h-5 object-contain opacity-90"
                  />
                </div>

                <h3 className="font-semibold text-lg text-[#0056B3] mb-2">
                  {t(`landing.howItWorks.steps.${step.key}.title`)}
                </h3>

                <p className="text-black text-sm leading-relaxed">
                  {t(`landing.howItWorks.steps.${step.key}.description`)}
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
              {t("landing.pastExams.title")}{" "}
              <span className="text-[#007BFF]">
                {t("landing.pastExams.highlight")}
              </span>
            </h2>
            <p className="text-[#425466] mt-3 sm:mt-4 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
              {t("landing.pastExams.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {pastExamItems.map((item) => (
              <div
                key={item.key}
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
                    {t(`landing.pastExams.items.${item.key}.subject`)} —{" "}
                    {t(`landing.pastExams.items.${item.key}.year`)}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-[#425466] leading-relaxed">
                  {t(`landing.pastExams.items.${item.key}.description`)}
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
                  {t("landing.pastExams.seeMore")}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-14">
            <Link href="/auth">
              <button className="bg-[#FF8A00] hover:bg-[#ff9f33] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg font-semibold text-base sm:text-lg transition">
                {t("landing.pastExams.cta")}
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
            {t("landing.features.title")}{" "}
            <span className="text-[#FF8A00]">
              {t("landing.features.highlight")}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {featureItems.map((key, i) => (
              <div
                key={key}
                className={`
            bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] 
            p-8 min-h-[240px] 
            ${i % 2 === 1 ? "sm:mt-8" : ""}   /* shift right-side cards down */
          `}
              >
                <h3 className="text-lg font-semibold mb-3">
                  {t(`landing.features.items.${key}.title`)}
                </h3>
                <p className="text-[#D8E1EB] leading-relaxed text-sm">
                  {t(`landing.features.items.${key}.description`)}
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
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-14">
            {t("landing.successStories.title")}{" "}
            <span className="text-[#007BFF]">
              {t("landing.successStories.highlight")}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {successStories.map((key, i) => (
              <Card
                key={key}
                className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-5 w-5 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>

                {/* Story */}
                <p className="text-gray-700 italic mb-6 text-sm sm:text-base leading-relaxed">
                  "{t(`landing.successStories.items.${key}.story`)}"
                </p>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-white shadow-md"
                    style={{
                      backgroundImage: `url(${
                        key === "liya"
                          ? "/111.png"
                          : key === "saron"
                          ? "/1111.png"
                          : "image.png"
                      })`,
                    }}
                  />
                  <div>
                    <p className="font-bold text-gray-900">
                      {t(`landing.successStories.items.${key}.name`)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t(`landing.successStories.items.${key}.location`)}
                    </p>
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
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-14">
            {t("landing.faq.title")}{" "}
            <span className="text-[#007BFF]">{t("landing.faq.highlight")}</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqKeys.slice(0, 2).map((key, i) => (
                <AccordionItem
                  key={`left-${key}`}
                  value={`left-${i}`}
                  className="bg-gray-50 rounded-xl px-4 sm:px-6 border-0"
                >
                  <AccordionTrigger className="text-base sm:text-lg font-semibold text-gray-900 hover:no-underline py-4">
                    {t(`landing.faq.items.${key}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base pb-4">
                    {t(`landing.faq.items.${key}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Right Column */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqKeys.slice(2).map((key, i) => (
                <AccordionItem
                  key={`right-${key}`}
                  value={`right-${i}`}
                  className="bg-gray-50 rounded-xl px-4 sm:px-6 border-0"
                >
                  <AccordionTrigger className="text-base sm:text-lg font-semibold text-gray-900 hover:no-underline py-4">
                    {t(`landing.faq.items.${key}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base pb-4">
                    {t(`landing.faq.items.${key}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-white py-12">
        {/* Top spacing for large screens only */}
        <div className="pt-8 sm:pt-12 lg:pt-20"></div>

        {/* MOBILE IMAGE SECTION */}
        <div className="block lg:hidden bg-white pb-8 sm:pb-12">
          <div className="relative flex justify-center w-full pt-4">
            {/* Outer Circle */}
            <div className="absolute top-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-[#0057C2] rounded-full z-0"></div>
            {/* Inner Circle */}
            <div className="absolute top-1/2 -translate-y-1/2 w-[190px] h-[190px] bg-white rounded-full z-10 overflow-hidden"></div>
            {/* Image */}
            <img
              src="/1111.png"
              alt={t("landing.newsletter.imageAlt")}
              className="relative z-20 w-[220px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* TEXT + FORM SECTION */}
        <div className="relative bg-[#0057C2] px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            {/* LEFT: TEXT + FORM */}
            <div className="max-w-xl w-full text-center lg:text-left z-10 order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
                {t("landing.newsletter.title")}
              </h2>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                {t("landing.newsletter.description")}
              </p>

              {/* FORM */}
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder={t("landing.newsletter.emailPlaceholder")}
                  className="w-full sm:flex-1 h-12 sm:h-14 rounded-full bg-white text-gray-700 placeholder-gray-400 px-5 sm:px-6 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#F7931E] hover:bg-[#e58310] text-white px-8 sm:px-10 h-12 sm:h-14 rounded-full text-base font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  {t("landing.newsletter.cta")}
                </button>
              </form>

              {/* Optional small text under input on mobile */}
              <p className="text-xs text-white/70 mt-3 sm:mt-4">
                {t("landing.newsletter.privacyNote")}
              </p>
            </div>

            {/* DESKTOP IMAGE SECTION */}
            <div className="relative hidden lg:flex justify-center w-full lg:w-auto order-1 lg:order-2">
              {/* Outer Circle */}
              <div className="absolute top-[35%] -translate-y-1/2 w-[440px] h-[440px] bg-[#0057C2] rounded-full -mt-20 z-0"></div>
              {/* Inner White Circle */}
              <div className="absolute top-[30%] -translate-y-1/2 w-[340px] h-[340px] bg-white rounded-full z-10 -mt-20 overflow-hidden"></div>
              {/* Image */}
              <img
                src="/1111.png"
                alt={t("landing.newsletter.imageAlt")}
                className="relative z-20 w-[720px] object-contain drop-shadow-xl -mt-6"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
