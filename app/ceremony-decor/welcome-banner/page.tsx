"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Template {
  id: number;
  name: string;
  image_path: string;
}

export default function WelcomeBanner() {
  const [bannerDesigns, setBannerDesigns] = useState<Template[]>([]);

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => setBannerDesigns(data))
      .catch(err => console.error("Failed to load templates", err));
  }, []);

  return (
    <div className="min-h-screen bg-rose-50 p-10">
      <h1 className="text-3xl font-bold text-center text-maroon mb-4">
        Welcome Banner
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Choose a design and customize it as you wish ✨
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {bannerDesigns.map((design) => (
          <div
            key={design.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <Image
              src={design.image_path}
              alt={design.name}
              width={400}
              height={250}
              className="w-full h-56 object-cover"
            />

            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {design.name}
              </h2>

              <Link
                href={`/ceremony-decor/welcome-banner/${design.id}`}
                className="inline-block bg-maroon text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Customize
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
