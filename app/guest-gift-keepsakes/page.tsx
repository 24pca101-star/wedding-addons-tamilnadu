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
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{ backgroundImage: 'url(/textures/white-marble.svg)', backgroundSize: 'cover' }}
      />

      {/* Hero Section - No Border, Just Glow */}
      <div className="relative z-10 py-24 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-block mb-4">
            <span className="text-2xl animate-pulse">🎁</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-maroon mb-6 leading-tight tracking-tight">
            Guest Gifts & Keepsakes
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-xl md:text-2xl text-maroon/80 font-light italic">
              விருந்தினர் பரிசுகள்
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Traditional and modern keepsakes to thank your guests and make your wedding memorable.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto pb-24 px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative block p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 h-full"
            >
              {/* Glass Card Background */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm border border-white/50 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgb(212,175,55,0.15)] group-hover:bg-white/80 transition-all duration-500" />

              {/* Decorative Corners with Glow */}
              <div className="corner-tr absolute top-5 right-5 w-9 h-9 border-t-2 border-r-2 border-gold/40 rounded-tr-xl group-hover:border-gold transition-colors duration-500" />
              <div className="corner-bl absolute bottom-5 left-5 w-9 h-9 border-b-2 border-l-2 border-gold/40 rounded-bl-xl group-hover:border-gold transition-colors duration-500" />

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="w-12 h-12 flex items-center justify-center bg-cream/50 rounded-full mb-4 group-hover:bg-gold/10 transition-colors duration-500 text-2xl">
                    {item.icon}
                  </div>
                  <h2 className="text-2xl font-serif text-maroon font-medium mb-2 group-hover:text-pink-900 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gold/80 font-medium tracking-wide">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex justify-end items-center mt-auto">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/20 text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 transform group-hover:rotate-[-45deg]">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Creative Footer Element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      <div className="relative z-10 flex justify-center pb-12 opacity-60">
        <div className="flex items-center gap-3">
          <span className="text-gold text-xl">❦</span>
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">Luxury Collection</span>
          <span className="text-gold text-xl">❦</span>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        :root {
          --gold: #D4AF37;
          --maroon: #800000;
          --cream: #FFFDD0;
        }

        body {
          font-family: 'Outfit', sans-serif;
        }

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .bg-gold { background-color: var(--gold); }
        .text-gold { color: var(--gold); }
        .border-gold { border-color: var(--gold); }
        
        .bg-maroon { background-color: var(--maroon); }
        .text-maroon { color: var(--maroon); }

        .bg-cream { background-color: var(--cream); }

        @keyframes glowCorner {
          0%   { box-shadow: none; }
          50%  { box-shadow: 2px 2px 10px 1px rgba(212,175,55,0.55), -1px -1px 6px 0px rgba(212,175,55,0.25); }
          100% { box-shadow: none; }
        }

        .group:hover .corner-tr,
        .group:hover .corner-bl {
          animation: glowCorner 1.8s ease-in-out infinite;
          border-color: var(--gold);
          filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.9));
        }
      `}</style>
    </div>
  );
}
