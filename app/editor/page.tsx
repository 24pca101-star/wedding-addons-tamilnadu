"use client";

import Editor from "@/components/Editor";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EditorWrapper() {
    const searchParams = useSearchParams();
    const template = searchParams.get("template") || undefined;
    return <Editor templateUrl={template} />;
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <EditorWrapper />
        </Suspense>
    );
}
