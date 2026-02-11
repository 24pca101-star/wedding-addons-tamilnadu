import Link from "next/link";

export default function Home() {
  const categories = [
    {
      title: "Ceremony & Decor",
      description:
        "Beautiful decorations and ceremonial items for your wedding.",
      link: "/ceremony-decor",
    },
    {
      title: "Apparel & Wearables",
      description:
        "Customized apparel for the bride, groom, and their teams.",
      link: "/apparel-wearables",
    },
    {
      title: "Traditional & Utility Items",
      description: "Traditional items to add a cultural touch.",
      link: "/traditional-utility",
    },
    {
      title: "Guest Gifts & Keepsakes",
      description: "Memorable gifts for your guests.",
      link: "/guest-gifts",
    },
    {
      title: "Photo & Fun Props",
      description:
        "Props to make your wedding photos fun and memorable.",
      link: "/photo-fun-props",
    },
    {
      title: "Ritual Essentials",
      description:
        "Everything you need for your wedding rituals.",
      link: "/ritual-essentials",
    },
  ];

  return (
    <main className="bg-cream min-h-screen">
      <section className="bg-maroon text-cream py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Wedding Add-Ons (Tamil Nadu)
        </h1>
        <p className="text-lg">
          Customize your wedding with our exclusive add-ons and make your
          special day unforgettable.
        </p>
      </section>

      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-maroon mb-8 text-center">
          Explore Our Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center"
            >
              <h3 className="text-xl font-semibold text-maroon mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
