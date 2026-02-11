import Link from "next/link";

export default function GuestGiftsKeepsakes() {
  const items = [
    {
      title: "Welcome / Tote Bag - வரவேற்பு பை பூ",
      link: "/guest-gift-keepsakes/welcome-tote-bag",
    },
    {
      title: "Water Bottle Labels - தண்ணீர் பாட்டில் லேபிள் ",
      link: "/guest-gift-keepsakes/water-bottle-labels",
    },
    {
      title: "Photo Frame - புகைப்பட சட்டகம்",
      link: "/guest-gift-keepsakes/photo-frame",
    },
    {
      title: " Fridge Magnet - ஃப்ரிட்ஜ் மேக்னெட்",
      link: "/guest-gift-keepsakes/fridge-magnet",
    },
    {
        title: "Mini Calendar - சிறிய காலண்டர் ",
        link: "/guest-gift-keepsakes/mini-calendar",
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-10">
      <h1 className="text-4xl font-bold text-maroon mb-6">
        Guest Gifts & Keepsakes
      </h1>

      <p className="mb-10 text-gray-700">
        Traditional and modern guest-gift-keepsakes add-ons for your wedding ceremony.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-maroon">
              {item.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
