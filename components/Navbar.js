"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => {
    return pathname === path ? "text-gold" : "text-cream";
  };

  const handleMouseEnter = (menu) => {
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    setOpenMenu(null);
  };

  const menuItems = [
    {
      title: "Ceremony & Decor",
      submenu: [
        "Welcome Banner",
        "Temple Theme Stage Backdrop",
        "Kolam Entrance Board",
        "Directional Sign Boards",
      ],
    },
    {
      title: "Apparel & Wearables",
      submenu: [
        "Bride & Groom T-Shirts",
        "Team Bride T-Shirts",
        "Team Groom T-Shirts",
        "Customized Shirts / Kurtas",
      ],
    },
    {
      title: "Traditional & Utility Items",
      submenu: [
        "Printed Visiri (Hand Fan)",
        "Visiri Bag",
        "Traditional Umbrella / Parasol",
      ],
    },
    {
      title: "Guest Gifts & Keepsakes",
      submenu: [
        "Welcome / Tote Bag",
        "Water Bottle Labels",
        "Photo Frame",
        "Fridge Magnet",
        "Mini Calendar",
      ],
    },
    {
      title: "Photo & Fun Props",
      submenu: ["Selfie Frame", "Traditional Photo Props"],
    },
    {
      title: "Ritual Essentials",
      submenu: ["Pooja Kit Bag", "Ritual Name Boards"],
    },
  ];

  return (
    <nav className="bg-maroon text-cream sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className={`text-2xl font-bold ${isActive("/")}`}>
              Wedding Add-Ons
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {menuItems.map((menu, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleMouseEnter(menu.title)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="font-medium text-cream">
                  {menu.title}
                </button>

                {openMenu === menu.title && (
                  <div className="absolute left-0 mt-2 w-56 bg-white text-maroon rounded-md shadow-lg">
                    {menu.submenu.map((item, idx) => {
                      const slug =
                        "/" +
                        item
                          .toLowerCase()
                          .replace(/[^\w\s]/gi, "")
                          .replace(/\s+/g, "-");

                      return (
                        <Link
                          key={idx}
                          href={slug}
                          className={`block px-4 py-2 text-sm hover:bg-maroon hover:text-cream ${
                            isActive(slug)
                          }`}
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={() =>
                setOpenMenu(openMenu === "mobile" ? null : "mobile")
              }
              className="text-cream hover:text-gold font-medium"
            >
              Menu
            </button>

            {openMenu === "mobile" && (
              <div className="absolute left-0 top-16 w-full bg-maroon text-cream shadow-lg">
                {menuItems.map((menu, index) => (
                  <div key={index} className="border-b border-gold">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === menu.title ? null : menu.title
                        )
                      }
                      className="w-full text-left px-4 py-2 hover:bg-gold hover:text-maroon"
                    >
                      {menu.title}
                    </button>

                    {openMenu === menu.title && (
                      <div className="bg-white text-maroon">
                        {menu.submenu.map((item, idx) => {
                          const slug =
                            "/" +
                            item
                              .toLowerCase()
                              .replace(/[^\w\s]/gi, "")
                              .replace(/\s+/g, "-");

                          return (
                            <Link
                              key={idx}
                              href={slug}
                              className="block px-4 py-2 text-sm hover:bg-maroon hover:text-cream"
                            >
                              {item}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
