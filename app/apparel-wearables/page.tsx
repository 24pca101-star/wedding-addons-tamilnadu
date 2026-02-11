import Link from "next/link";

export default function ApparelWearables() {
  const items = [
    {
      title: "Bride & Groom T-Shirts",
      link: "/apparel-wearables/bride-groom-t-shirts",
    },
    {
      title: "Team Bride T-Shirts",
      link: "/apparel-wearables/team-bride-t-shirts",
    },
    {
      title: "Team Groom T-Shirts",
      link: "/apparel-wearables/team-groom-t-shirts",
    },
    {
      title: "Customized Shirts & Kurtas",
      link: "/apparel-wearables/customized-shirts-kurtas",
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-10">
      <h1 className="text-4xl font-bold text-maroon mb-6">
        Apparel & Wearables - ஆடை மற்றும் அணிகலன்கள்
      </h1>

      <p className="mb-10 text-gray-700">
        Traditional and modern decorative add-ons for your wedding apparel and wearables.
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
