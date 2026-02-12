"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface SubMenuItem {
  name: string;
  path: string;
}

interface MenuItem {
  title: string;
  basePath: string;
  submenu: SubMenuItem[];
}

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const [desktopOpenMenu, setDesktopOpenMenu] = useState<string | null>(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? "text-gold font-semibold" : "";
  };

  const menuItems: MenuItem[] = [
    {
      title: "Ceremony & Decor",
      basePath: "/ceremony-decor",
      submenu: [
        { name: "Welcome Banner", path: "/welcome-banner" },
        { name: "Temple Theme Stage Backdrop", path: "/temple-theme-stage-backdrop" },
        { name: "Kolam Entrance Board", path: "/kolam-entrance-board" },
        { name: "Directional Sign Boards", path: "/directional-sign-boards" },
      ],
    },
    {
      title: "Apparel & Wearables",
      basePath: "/apparel-wearables",
      submenu: [
        { name: "Bride & Groom T-Shirts", path: "/bride-groom-t-shirts" },
        { name: "Team Bride T-Shirts", path: "/team-bride-t-shirts" },
        { name: "Team Groom T-Shirts", path: "/team-groom-t-shirts" },
        { name: "Customized Shirts / Kurtas", path: "/customized-shirts-kurtas" },
      ],
    },
    {
      title: "Traditional & Utility Items",
      basePath: "/traditional-utility-items",
      submenu: [
        { name: "Printed Visiri (Hand Fan)", path: "/printed-visiri-hand-fan" },
        { name: "Visiri Bag", path: "/visiri-bag" },
        { name: "Traditional Umbrella / Parasol", path: "/traditional-umbrella-parasol" },
      ],
    },
    {
      title: "Guest Gifts & Keepsakes",
      basePath: "/guest-gift-keepsakes",
      submenu: [
        { name: "Welcome Tote Bag", path: "/welcome-tote-bag" },
        { name: "Water Bottle Labels", path: "/water-bottle-labels" },
        { name: "Photo Frame", path: "/photo-frame" },
        { name: "Fridge Magnet", path: "/fridge-magnet" },
        { name: "Mini Calendar", path: "/mini-calendar" },
      ],
    },
    {
      title: "Photo & Fun Props",
      basePath: "/photo-fun-props",
      submenu: [
        { name: "Selfie Frame", path: "/selfie-frame" },
        { name: "Traditional Photo Props", path: "/traditional-photo-props" },
      ],
    },
    {
      title: "Ritual Essentials",
      basePath: "/ritual-essentials",
      submenu: [
        { name: "Pooja Kit Bag", path: "/pooja-kit-bag" },
        { name: "Ritual Name Boards", path: "/ritual-name-boards" },
      ],
    },
  ];

  return (
    <nav className="bg-maroon text-cream sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold ${isActive("/")}`}>Wedding Add-Ons</Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((menu, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setDesktopOpenMenu(menu.title)}
                onMouseLeave={() => setDesktopOpenMenu(null)}
              >
                <button className="font-medium hover:text-gold transition">{menu.title}</button>

                {desktopOpenMenu === menu.title && (
                  <div className="absolute left-0 mt-2 w-64 bg-white text-maroon rounded-md shadow-lg">
                    {menu.submenu.map((item, idx) => {
                      const slug = `${menu.basePath}${item.path}`;
                      return (
                        <Link
                          key={idx}
                          href={slug}
                          className={`block px-4 py-2 text-sm hover:bg-maroon hover:text-cream transition ${isActive(slug)}`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="font-medium hover:text-gold"
            >
              ☰ Menu
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-maroon text-cream shadow-lg">
          {menuItems.map((menu, index) => (
            <div key={index} className="border-t border-gold">
              <button
                onClick={() =>
                  setMobileOpenMenu(
                    mobileOpenMenu === menu.title ? null : menu.title
                  )
                }
                className="w-full text-left px-4 py-3 hover:bg-gold hover:text-maroon"
              >
                {menu.title}
              </button>

              {mobileOpenMenu === menu.title && (
                <div className="bg-white text-maroon">
                  {menu.submenu.map((item, idx) => {
                    const slug = `${menu.basePath}${item.path}`;
                    return (
                      <Link
                        key={idx}
                        href={slug}
                        className="block px-4 py-2 text-sm hover:bg-maroon hover:text-cream"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
