"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AppBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Clear user/session data
      router.push("/auth"); // Redirect to auth page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-12 w-24 rounded-lg overflow-hidden">
                <Image
                  src="/photo_2025-11-06_13-44-32.jpg"
                  alt="SmartPrep Logo"
                  width={250}
                  height={150}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <Link
                href="/#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </Link>
            </div>

            <div className="relative group">
              <Link
                href="/#how-it-works"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                How it works
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/#success-stories"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Success Stories
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/#hero"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                our mission
              </Link>
            </div>
            {user && (
              <>
                <Link
                  href="/select-subject"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Exam
                </Link>

                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm font-medium">
                  {user.full_name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/select-subject")}
                >
                  Start Exam
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/select-subject"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Exam
              </Link>
              <Link
                href="/#about"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/#contact"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {user && (
                <>
                  <Link
                    href="/progress"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Progress
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
