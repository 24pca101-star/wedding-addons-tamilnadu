"use client";

import React from "react";
import Image from "next/image";

interface PsdEditorProps {
    psdUrl: string;
    jpgUrl: string;
}

export default function PsdEditor({ psdUrl, jpgUrl }: PsdEditorProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <h2 className="text-xl font-bold mb-4">PSD Editor</h2>
            <div className="border border-gray-300 p-2 bg-white shadow-sm">
                <Image
                    src={jpgUrl}
                    alt="Template Preview"
                    width={400}
                    height={300}
                    style={{ objectFit: "contain" }}
                />
            </div>
            <p className="mt-4 text-gray-500">
                Editing for {psdUrl} is currently under maintenance.
            </p>
        </div>
    );
}
