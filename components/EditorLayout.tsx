"use client";

import React, { ReactNode } from "react";

interface EditorLayoutProps {
    children: ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-100">
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
