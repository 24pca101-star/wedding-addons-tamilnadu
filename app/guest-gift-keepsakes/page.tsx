"use client";

import Link from "next/link";
import React from "react";

export default function GuestGiftsKeepsakes() {
  const items = [
    {
      title: "Welcome / Tote Bag",
      subtitle: "வரவேற்பு டோட் பை",
      link: "/guest-gift-keepsakes/welcome-tote-bag",
      icon: "🛍️",
    },
    {
      title: "Water Bottle Labels",
      subtitle: "தண்ணீர் பாட்டில் லேபிள்",
      link: "/guest-gift-keepsakes/water-bottle-labels",
      icon: "💧",
    },
    {
      title: "Photo Frame",
      subtitle: "புகைப்பட சட்டகம்",
      link: "/guest-gift-keepsakes/photo-frame",
      icon: "🖼️",
    },
    {
      title: "Fridge Magnet",
      subtitle: "ஃப்ரிட்ஜ் மேக்னெட்",
      link: "/guest-gift-keepsakes/fridge-magnet",
      icon: "🧲",
    },
    {
      title: "Mini Calendar",
      subtitle: "சிறிய காலண்டர்",
      link: "/guest-gift-keepsakes/mini-calendar",
      icon: "📅",
    },
  ];

  return (
    <section className="text-center py-24 min-h-screen bg-white">
      <div className="inline-block mb-4">
        <span className="text-4xl">🎁</span>
      </div>
      <h1 className="text-5xl font-extrabold text-pink-800 mb-6">
        Guest Gifts & Keepsakes
      </h1>
      <p className="text-lg max-w-2xl mx-auto text-gray-700">
        Traditional and modern keepsakes to thank your guests and make your wedding memorable.
      </p>

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item, index) => (
          <Link key={index} href={item.link} className="group relative bg-white rounded-3xl p-8 text-center shadow-lg cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-rose-100 via-pink-50 to-amber-100 opacity-0 group-hover:opacity-50 blur-xl transition duration-500"></div>
            <div className="relative z-10 flex flex-col items-center justify-center gap-2 mb-4">
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="text-xl font-semibold text-pink-800 group-hover:text-rose-600 transition duration-300">{item.title}</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-800 transition duration-300">{item.subtitle}</p>
            </div>
            <div className="relative mt-auto h-1 w-12 mx-auto bg-amber-400 group-hover:w-24 transition-all duration-500 rounded-full"></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
