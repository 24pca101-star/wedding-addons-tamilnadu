"use client";

import Editor from "@/components/Editor";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EditorWrapper() {
    const searchParams = useSearchParams();
    // Support both ?template= and ?psd= for backward compatibility
    const template = searchParams.get("template") || searchParams.get("psd") || undefined;
    return <Editor templateUrl={template} />;
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <EditorWrapper />
        </Suspense>
    );
}
