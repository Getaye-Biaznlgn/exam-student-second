"use client";

import { useLayout } from "@/lib/layout-context";
import { AppBar } from "@/components/app-bar";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  // Get the showNav state from the context
  const { showNav } = useLayout();

  return (
    <>
      {/* This is the magic: only show AppBar if showNav is true */}
      {showNav && <AppBar />}

      {/* Render the rest of your layout and the page content */}
      {children}
      <SiteFooter />
      <Toaster />
    </>
  );
}
