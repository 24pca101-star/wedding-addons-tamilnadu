import Link from "next/link";

export default function RitualEssentials() {
  const items = [
    {
      title: "Pooja Kit Bag - பூஜை கிட் பை",
      link: "/ritual-essentials/pooja-kit-bag",
    },
    {
      title: "Ritual Name Boards - சடங்கு பெயர் பலகை",
      link: "/ritual-essentials/ritual-name-boards",
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-10">
      <h1 className="text-4xl font-bold text-maroon mb-6">
        Ritual Essentials - பூஜை தேவைப்பாடுகள்
      </h1>

      <p className="mb-10 text-gray-700">
        Traditional and modern decorative add-ons for your wedding ritual essentials.
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
