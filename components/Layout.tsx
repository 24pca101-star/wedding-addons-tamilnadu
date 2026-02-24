"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import { usePathname } from 'next/navigation';

interface SubModule {
  title: string;
  link: string;
}

interface Category {
  title: string;
  description: string;
  link: string;
  subModules?: SubModule[];
}

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
      <main className={isEditorPage ? "" : "pt-28"}>{children}</main>

      {/* Footer */}
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
