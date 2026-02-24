"use client";

import { ReactNode } from "react";
import { usePathname } from 'next/navigation';
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const isEditorPage = pathname.includes('directional-sign-boards') ||
    pathname.includes('welcome-banner') ||
    pathname.includes('temple-theme-stage-backdrop');

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800">
      <Navbar />
      <main className="pt-28">{children}</main>

      {!isEditorPage && (
        <footer className="bg-pink-800 text-white text-center py-6 mt-12">
          <p className="text-sm">
            © 2026 Wedding Add-Ons Tamil Nadu. Crafted with elegance ✨
          </p>
        </footer>
      )}
    </div>
  );
}
