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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/welcome-banner-template')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch templates');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setBannerDesigns(data);
        } else {
          console.error("Received data is not an array:", data);
          setError("Failed to load templates: Invalid data format");
        }
      })
      .catch(err => {
        console.error("Failed to load templates", err);
        setError("Unable to load designs at the moment. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-rose-50 p-10">
      <h1 className="text-3xl font-bold text-center text-maroon mb-4">
        Welcome Banner
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Choose a design and customize it as you wish ✨
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-8 border-2 border-dashed border-red-200 rounded-xl bg-white max-w-2xl mx-auto">
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-[#f709a3] transition shadow-sm"
          >
            Try Again
          </button>
        </div>
      ) : bannerDesigns.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-xl">No banner designs found ✨</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {bannerDesigns.map((design) => (
            <div
              key={design.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={design.image_path}
                alt={design.name}
                width={400} // Set a default width
                height={224} // Set a default height (16:9 ratio)
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {design.name}
                </h2>

                <Link
                  href={`/ceremony-decor/welcome-banner/${design.id}`}
                  className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-[#f709a3] transition shadow-sm"
                >
                  Customize
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
