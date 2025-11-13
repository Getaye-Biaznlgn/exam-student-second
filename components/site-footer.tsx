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
import { useLocale } from "@/lib/locale-context";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Image
                  src="/new.png"
                  alt={t("branding.logoAlt")}
                  width={32}
                  height={32}
                  className="text-white"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {t("common.appName")}
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              {t("footer.description")}
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("footer.linksTitle")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t("footer.links.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t("footer.links.features")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#success-stories"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t("footer.links.stories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#past-exams"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t("footer.links.pastExams")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("footer.contactTitle")}
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>
                  {t("footer.emailLabel")}: {t("footer.emailAddress")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>{t("footer.phoneNumber")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{t("footer.bottom.copyright")}</p>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
            <span>
              {t("footer.bottom.designedBy")}{" "}
              <Link
                href="https://pixeladdis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                {t("footer.bottom.companyName")}
              </Link>
              .
            </span>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-3">
            <Link
              href="#"
              aria-label={t("footer.social.facebook")}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label={t("footer.social.telegram")}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label={t("footer.social.twitter")}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label={t("footer.social.linkedin")}
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
              {t("footer.bottom.terms")}
            </Link>
            <span>{t("footer.bottom.separator")}</span>
            <Link
              href="/privacy"
              className="hover:text-blue-600 transition-colors"
            >
              {t("footer.bottom.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
