"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function Home() {
  const categories: Category[] = [
    {
      title: "Ceremony & Decor",
      description: "விழா & அலங்காரம்",
      link: "/ceremony-decor",
      subModules: [
        { title: "Welcome Banner - வரவேற்பு பேனர்", link: "/ceremony-decor/welcome-banner" },
        { title: "Temple Theme Stage Backdrop - கோவில் தீம் மேடை பின்னணி", link: "/ceremony-decor/temple-stage" },
        { title: "Kolam Entrance Board - கோலம் நுழைவுப் பலகை", link: "/ceremony-decor/kolam-entrance" },
        { title: "Directional Sign Boards - வழிகாட்டி பலகைகள்", link: "/ceremony-decor/directional-signs" },
      ],
    },
    {
      title: "Apparel & Wearables",
      description: "உடைகள்",
      link: "/apparel-wearables",
      subModules: [
        { title: "Bride & Groom T-Shirts - 14-", link: "/apparel-wearables/bride-groom-tshirts" },
        { title: "Team Bride T-Shirts - மணப்பெண் குழு டி-ஷர்ட்", link: "/apparel-wearables/team-bride" },
        { title: "Team Groom T-Shirts - மணமகன் குழு டி-ஷர்ட்", link: "/apparel-wearables/team-groom" },
        { title: "Customized Shirts / Kurtas - தனிப்பயன் சட்டை / குர்தா", link: "/apparel-wearables/customized" },
      ],
    },
    {
      title: "Traditional & Utility Items",
      description: "பாரம்பரிய & பயன்பாட்டு பொருட்கள்",
      link: "/traditional-utility",
      subModules: [
        { title: "Printed Visiri (Hand Fan) - அச்சிடப்பட்ட விசிறி 4", link: "/traditional-utility/printed-visiri" },
        { title: "Visiri Bag - விசிறி பை", link: "/traditional-utility/visiri-bag" },
        { title: "Traditional Umbrella / Parasol", link: "/traditional-utility/umbrella" },
      ],
    },
    {
      title: "Guest Gifts & Keepsakes",
      description: "விருந்தினர் பரிசுகள்",
      link: "/guest-gifts",
      subModules: [
        { title: "Welcome / Tote Bag - வரவேற்பு பை பூ", link: "/guest-gifts/tote-bag" },
        { title: "Water Bottle Labels - தண்ணீர் பாட்டில் லேபிள் 4", link: "/guest-gifts/water-labels" },
        { title: "Photo Frame - புகைப்பட சட்டகம்", link: "/guest-gifts/photo-frame" },
        { title: "Fridge Magnet - ஃப்ரிட்ஜ் மேக்னெட்", link: "/guest-gifts/fridge-magnet" },
        { title: "Mini Calendar - சிறிய காலண்டர் 3", link: "/guest-gifts/mini-calendar" },
      ],
    },
    {
      title: "Photo & Fun Props",
      description: "புகைப்பட உபகரணங்கள்",
      link: "/photo-fun-props",
      subModules: [
        { title: "Selfie Frame - செல்ஃபி ஃப்ரேம்", link: "/photo-fun-props/selfie-frame" },
        { title: "Traditional Photo Props - பாரம்பரிய புகைப்பட பொருட்கள்", link: "/photo-fun-props/traditional-props" },
      ],
    },
    {
      title: "Ritual Essentials",
      description: "சடங்கு பொருட்கள்",
      link: "/ritual-essentials",
      subModules: [
        { title: "Pooja Kit Bag", link: "/ritual-essentials/pooja-kit" },
        { title: "Ritual Name Boards - சடங்கு பெயர் பலகை", link: "/ritual-essentials/name-boards" },
      ],
    },
  ];

  // TypeScript state typing
  const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 shadow-lg border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-extrabold text-pink-800 tracking-wide">
            Wedding Add-Ons
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            {categories.map((cat, index) => (
              <div key={index} className="relative group">
                <Link
                  href={cat.link}
                  className="hover:text-pink-600 transition duration-300"
                >
                  {cat.title}
                </Link>

                {/* Dropdown */}
                {cat.subModules && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                    <ul className="flex flex-col p-4">
                      {cat.subModules.map((sub, i) => (
                        <li
                          key={i}
                          className="py-2 hover:bg-pink-50 rounded-lg transition"
                        >
                          <Link
                            href={sub.link}
                            className="text-gray-700 hover:text-pink-700"
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-pink-800 font-bold focus:outline-none text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <ul className="flex flex-col px-4 py-4 gap-2">
              {categories.map((cat, index) => (
                <li key={index}>
                  <div
                    onClick={() =>
                      setMobileDropdown(mobileDropdown === index ? null : index)
                    }
                    className="flex justify-between items-center cursor-pointer py-2 px-2 hover:bg-pink-50 rounded-lg"
                  >
                    <span className="text-pink-800 font-medium">{cat.title}</span>
                    {cat.subModules && <span>▸</span>}
                  </div>

                  {cat.subModules && mobileDropdown === index && (
                    <ul className="flex flex-col pl-4 mt-1">
                      {cat.subModules.map((sub, i) => (
                        <li key={i} className="py-1">
                          <Link
                            href={sub.link}
                            className="text-gray-700 hover:text-pink-700"
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 text-center bg-gradient-to-br from-rose-100 via-amber-50 to-pink-100">
        <h1 className="text-5xl font-extrabold text-pink-800 mb-6 drop-shadow-md">
          Wedding Add-Ons (Tamil Nadu)
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Customize your wedding with our exclusive add-ons and make your
          special day unforgettable.
        </p>
      </section>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-pink-800 mb-12">
          Explore Our Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <Link key={index} href={category.link}>
              <div className="group relative bg-white rounded-3xl p-8 text-center shadow-lg cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl overflow-hidden">
                {/* Soft Glow Background */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-rose-100 via-pink-50 to-amber-100 opacity-0 group-hover:opacity-50 blur-xl transition duration-500"></div>

                <h3 className="relative text-xl font-semibold text-pink-800 mb-4 group-hover:text-rose-600 transition duration-300">
                  {category.title}
                </h3>

                <p className="relative text-sm text-gray-600 group-hover:text-gray-800 transition duration-300">
                  {category.description}
                </p>

                {/* Gold animated line */}
                <div className="relative mt-6 h-1 w-12 mx-auto bg-amber-400 group-hover:w-24 transition-all duration-500 rounded-full"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-pink-800 text-white text-center py-6 mt-12">
        <p className="text-sm">
          © 2026 Wedding Add-Ons Tamil Nadu. Crafted with elegance ✨
        </p>
      </footer>
    </main>
  );
}
