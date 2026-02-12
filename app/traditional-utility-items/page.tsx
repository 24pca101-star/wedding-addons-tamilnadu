import Link from "next/link";

export default function TraditionalUtilityItems() {
  const items = [
    {
      title: "Printed Visiri (Hand Fan) - அச்சிடப்பட்ட விசிறி ",
      link: "/traditional-utility-items/printed-visiri-hand-fan",
    },
    {
      title: "Traditional Umbrella & Parasol - பழைய காத்திருக்கும் மற்றும் பாரசூல ்",
      link: "/traditional-utility-items/traditional-umbrella-parasol",
    },
    {
      title: "Visiri Bag - விசிறி பை",
      link: "/traditional-utility-items/visiri-bag",
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-10">
      <h1 className="text-4xl font-bold text-maroon mb-6">
        Traditional Utility Items - பாரம்பரிய பயன்பாட்டு உருப்படிகள்
      </h1>

      <p className="mb-10 text-gray-700">
        Traditional and modern decorative add-ons for your wedding utility items.
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
