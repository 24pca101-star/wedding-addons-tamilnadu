"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Template {
    id: number;
    name: string;
    description: string;
    image_path: string;
}

interface TemplateCardProps {
    template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
                <Image
                    src={template.image_path}
                    alt={template.name}
                    fill
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <Link
                    href={`/templates/${template.id}/editor`}
                    className="mt-4 inline-block bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm"
                >
                    Customize
                </Link>
            </div>
        </div>
    );
}
