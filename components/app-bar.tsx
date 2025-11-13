"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function AppBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLocale();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-5 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between relative">
          {/* Logo & Brand */}
          <Link href="/" className="relative flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-visible z-50 -mb-6 md:-mb-8">
              <Image
                src="/new.png"
                alt={t("branding.logoAlt")}
                width={240}
                height={240}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl px-2 md:text-3xl font-extrabold tracking-tight text-[#004B84] leading-none">
              SmartPrep
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.features")}
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.howItWorks")}
            </Link>
            <Link
              href="/#success-stories"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.successStories")}
            </Link>
            <Link
              href="/#hero"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.ourMission")}
            </Link>

            {user && (
              <>
                <Link
                  href="/select-subject"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {t("navigation.exam")}
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {t("navigation.dashboard")}
                </Link>
                <Link
                  href="/profile"
                  className="text-sm px-2 font-medium hover:text-primary transition-colors"
                >
                  {t("navigation.profile")}
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            <LanguageSwitcher className="hidden md:block" />

            {user ? (
              <div className="flex items-center gap-3 md:gap-4">
                <span className="hidden sm:inline text-sm font-medium">
                  {user.full_name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/select-subject")}
                  className="px-4"
                >
                  {t("exam.startExam")}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  {t("auth.logout")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="px-4">
                    {t("auth.signIn")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-1"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-5 mt-1">
            <nav className="flex flex-col gap-4 px-2">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navigation.home")}
              </Link>
              <Link
                href="/select-subject"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navigation.exam")}
              </Link>
              <Link
                href="/#about"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navigation.about")}
              </Link>
              <Link
                href="/#contact"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navigation.contact")}
              </Link>

              {user && (
                <>
                  <Link
                    href="/progress"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navigation.progress")}
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navigation.dashboard")}
                  </Link>
                </>
              )}
            </nav>
            <LanguageSwitcher className="mt-5 md:hidden px-2" withLabel />
          </div>
        )}
      </div>
    </header>
  );
}
