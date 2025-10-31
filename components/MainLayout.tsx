"use client";

import { useLayout } from "@/lib/layout-context";
import { AppBar } from "@/components/app-bar";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation"; // ✅ add this
import type React from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { showNav } = useLayout();
  const pathname = usePathname(); // ✅ get current route

  // ✅ only show footer on home page
  const showFooter = pathname === "/";

  return (
    <>
      {/* show AppBar if showNav is true */}
      {showNav && <AppBar />}

      {/* main content */}
      {children}

      {/* only show footer on home page */}
      {showFooter && <SiteFooter />}

      <Toaster />
    </>
  );
}
