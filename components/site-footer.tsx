"use client";
import Link from "next/link";
import {
  Mail,
  Phone,
  Facebook,
  MessageCircle,
  Twitter,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Image
                  src="/Screenshot 2025-11-10 045055.png"
                  alt="SmartPrep Logo"
                  width={32}
                  height={32}
                  className="text-white"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartPrep</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Join SmartPrep to master Grade 12 entrance exams, practice with
              real questions, and get instant feedback.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="hover:text-blue-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#success-stories"
                  className="hover:text-blue-600 transition-colors"
                >
                  Story
                </Link>
              </li>
              <li>
                <Link
                  href="/#past-exams"
                  className="hover:text-blue-600 transition-colors"
                >
                  Past Exam Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-900 mb-4">Get In Touch</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Email: Smartprep@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+251 114 34554</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2025 All rights reserved</p>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
            <span>
              Designed and Developed by{" "}
              <Link
                href="https://pixeladdis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                PixelAddis Solutions
              </Link>
              .
            </span>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-3">
            <Link
              href="#"
              aria-label="Facebook"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Telegram"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Twitter"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="LinkedIn"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="hover:text-blue-600 transition-colors"
            >
              Terms of Use
            </Link>
            <span>|</span>
            <Link
              href="/privacy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
