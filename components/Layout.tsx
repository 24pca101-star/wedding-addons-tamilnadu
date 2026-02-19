"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
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

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const categories: Category[] = [
    {
      title: "Ceremony & Decor",
      description: "விழா & அலங்காரம்",
      link: "/ceremony-decor",
      subModules: [
        { title: "Welcome Banner - வரவேற்பு பேனர்", link: "/ceremony-decor/welcome-banner" },
        { title: "Temple Theme Stage Backdrop - கோவில் தீம் மேடை பின்னணி", link: "/ceremony-decor/temple-theme-stage-backdrop" },
        { title: "Kolam Entrance Board - கோலம் நுழைவுப் பலகை", link: "/ceremony-decor/kolam-entrance-board" },
        { title: "Directional Sign Boards - வழிகாட்டி பலகைகள்", link: "/ceremony-decor/directional-sign-boards" },
      ],
    },
    {
      title: "Apparel & Wearables",
      description: "உடைகள்",
      link: "/apparel-wearables",
      subModules: [
        { title: "Bride & Groom T-Shirts -மணமக்கள் டி-ஷர்ட் ", link: "/apparel-wearables/bride-groom-t-shirts" },
        { title: "Team Bride T-Shirts - மணப்பெண் குழு டி-ஷர்ட்", link: "/apparel-wearables/team-bride-t-shirts" },
        { title: "Team Groom T-Shirts - மணமகன் குழு டி-ஷர்ட்", link: "/apparel-wearables/team-groom-t-shirts" },
        { title: "Customized Shirts / Kurtas - தனிப்பயன் சட்டை / குர்தா", link: "/apparel-wearables/customized-shirts-kurtas" },
      ],
    },
    {
      title: "Traditional & Utility Items",
      description: "பாரம்பரிய & பயன்பாட்டு பொருட்கள்",
      link: "/traditional-utility-items",
      subModules: [
        { title: "Printed Visiri (Hand Fan) - அச்சிடப்பட்ட விசிறி ", link: "/traditional-utility-items/printed-visiri-hand-fan" },
        { title: "Visiri Bag - விசிறி பை", link: "/traditional-utility-items/visiri-bag" },
        { title: "Traditional Umbrella / Parasol - பாரம்பரிய குடை & சிறுகுடை", link: "/traditional-utility-items/traditional-umbrella-parasol" },
      ],
    },
    {
      title: "Guest Gifts & Keepsakes",
      description: "விருந்தினர் பரிசுகள்",
      link: "/guest-gift-keepsakes",
      subModules: [
        { title: "Welcome / Tote Bag - வரவேற்பு டோட் பை", link: "/guest-gift-keepsakes/welcome-tote-bag" },
        { title: "Water Bottle Labels - தண்ணீர் பாட்டில் லேபிள் ", link: "/guest-gift-keepsakes/water-bottle-labels" },
        { title: "Photo Frame - புகைப்பட சட்டகம்", link: "/guest-gift-keepsakes/photo-frame" },
        { title: "Fridge Magnet - ஃப்ரிட்ஜ் மேக்னெட்", link: "/guest-gift-keepsakes/fridge-magnet" },
        { title: "Mini Calendar - சிறிய காலண்டர் ", link: "/guest-gift-keepsakes/mini-calendar" },
      ],
    },
    {
      title: "Photo & Fun Props",
      description: "புகைப்பட உபகரணங்கள்",
      link: "/photo-fun-props",
      subModules: [
        { title: "Selfie Frame - செல்ஃபி ஃப்ரேம்", link: "/photo-fun-props/selfie-frame" },
        { title: "Traditional Photo Props - பாரம்பரிய புகைப்பட பொருட்கள்", link: "/photo-fun-props/traditional-photo-props" },
      ],
    },
    {
      title: "Ritual Essentials",
      description: "சடங்கு பொருட்கள்",
      link: "/ritual-essentials",
      subModules: [
        { title: "Pooja Kit Bag - பூஜை கிட் பை", link: "/ritual-essentials/pooja-kit-bag" },
        { title: "Ritual Name Boards - சடங்கு பெயர் பலகை", link: "/ritual-essentials/ritual-name-boards" },
      ],
    },
  ];

  const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800">
      <main>{children}</main>
    </div>
  );
}
