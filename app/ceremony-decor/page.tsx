import Link from "next/link";

export default function CeremonyDecor() {
  const items = [
    {
      title: "Welcome Banner",
      link: "/ceremony-decor/welcome-banner",
    },
    {
      title: "Temple Theme Stage Backdrop",
      link: "/ceremony-decor/temple-theme-stage-backdrop",
    },
    {
      title: "Kolam Entrance Board",
      link: "/ceremony-decor/kolam-entrance-board",
    },
    {
      title: "Directional Sign Boards",
      link: "/ceremony-decor/directional-sign-boards",
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-10">
      <h1 className="text-4xl font-bold text-maroon mb-6">
        Ceremony & Decor
      </h1>

      <p className="mb-10 text-gray-700">
        Traditional and modern decorative add-ons for your wedding ceremony.
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
