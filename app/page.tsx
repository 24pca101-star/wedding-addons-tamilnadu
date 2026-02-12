export default function Home() {
  return (
    <section className="text-center py-24">
      <h1 className="text-5xl font-extrabold text-pink-800 mb-6">
        Wedding Add-Ons (Tamil Nadu)
      </h1>
      <p className="text-lg max-w-2xl mx-auto text-gray-700">
        Customize your wedding with our exclusive add-ons and make your
        special day unforgettable.
      </p>

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          { title: "Ceremony & Decor", desc: "விழா & அலங்காரம்", link: "/ceremony-decor" },
          { title: "Apparel & Wearables", desc: "உடைகள்", link: "/apparel-wearables" },
          { title: "Traditional & Utility Items", desc: "பாரம்பரிய & பயன்பாட்டு பொருட்கள்", link: "/traditional-utility-items" },
          { title: "Guest Gifts & Keepsakes", desc: "விருந்தினர் பரிசுகள்", link: "/guest-gift-keepsakes" },
          { title: "Photo & Fun Props", desc: "புகைப்பட உபகரணங்கள்", link: "/photo-fun-props" },
          { title: "Ritual Essentials", desc: "சடங்கு பொருட்கள்", link: "/ritual-essentials" },
        ].map((cat, i) => (
          <a key={i} href={cat.link} className="group relative bg-white rounded-3xl p-8 text-center shadow-lg cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-rose-100 via-pink-50 to-amber-100 opacity-0 group-hover:opacity-50 blur-xl transition duration-500"></div>
            <h3 className="relative text-xl font-semibold text-pink-800 mb-4 group-hover:text-rose-600 transition duration-300">{cat.title}</h3>
            <p className="relative text-sm text-gray-600 group-hover:text-gray-800 transition duration-300">{cat.desc}</p>
            <div className="relative mt-6 h-1 w-12 mx-auto bg-amber-400 group-hover:w-24 transition-all duration-500 rounded-full"></div>
          </a>
        ))}
      </div>
    </section>
  );
}
