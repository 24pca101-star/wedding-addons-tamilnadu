import Link from "next/link";

export default function PhotoFunProps() {
  const items = [
    {
      title: "Selfie-Frame Photo Props - செல்பி ஃப்ரேம்",
      link: "/photo-fun-props/selfie-frame",
    },
    {
      title: "Traditional Photo Props - பாரம்பரிய புகைப்பட பொருட்கள்",
      link: "/photo-fun-props/traditional-photo-props",
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-10">
      <h1 className="text-4xl font-bold text-maroon mb-6">
        Photo & Fun Props - புகைப்படம் மற்றும் விளையாட்டு அணிகலன்கள்
      </h1>

      <p className="mb-10 text-gray-700">
        Traditional and modern decorative add-ons for your wedding photo and fun props.
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
