"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  BookOpen,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-primary/30 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">SmartPrep</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Practice smarter with AI explanations, progress tracking, and
              realistic exam simulations.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                <Link href="#">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                <Link href="#">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                <Link href="#">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                <Link href="#">
                  <Youtube className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <p className="font-semibold mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link className="hover:text-foreground" href="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/select-subject">
                  Take Exam
                </Link>
              </li>
              <li>
                <a className="hover:text-foreground" href="#login">
                  Sign In
                </a>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/">
                  Sign Up
                </Link>
              </li>
              <li>
                <a className="hover:text-foreground" href="#login">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-center md:text-left">
            <p className="font-semibold">Contact</p>
            <div className="flex items-start justify-center md:justify-start gap-3 text-sm text-primary-foreground/80">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>123 Quiz Street, Knowledge City</div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-primary-foreground/80">
              <Phone className="h-4 w-4" />
              <div>+1 (555) 123-4567</div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-primary-foreground/80">
              <Mail className="h-4 w-4" />
              <div>support@examprep.et</div>
            </div>
            <Button className="mt-2" variant="secondary">
              Contact Support
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-xs text-primary-foreground/80 flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} SmartPrep. All rights reserved.
          </span>
          <div className="flex items-center gap-3">
            <Link href="#about" className="hover:text-primary-foreground">
              About
            </Link>
            <Link href="#contact" className="hover:text-primary-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
