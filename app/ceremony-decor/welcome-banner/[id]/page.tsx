import Image from "next/image";

export default async function BannerDetail({
  params,
}: {
  params: { id: string | number } | Promise<{ id: string | number }>;
}) {
  // Unwrap params if it’s a promise
  const resolvedParams = await params;

  const bannerDesigns = [
    {
      id: 1,
      name: "Floral Pink",
      image: "/card1.jpg",
      description: "Soft pink floral themed traditional welcome banner.",
    },
    {
      id: 2,
      name: "Soft Blue",
      image: "/card2.jpg",
      description: "Elegant blue tone banner with subtle decorations.",
    },
    {
      id: 3,
      name: "Minimal White",
      image: "/design1.jpg",
      description: "Clean and modern white aesthetic banner.",
    },
    {
      id: 4,
      name: "Traditional Red",
      image: "/design4.jpg",
      description: "Classic red wedding style welcome banner.",
    },
  ];

  const selectedDesign = bannerDesigns.find(
    (design) => design.id === Number(resolvedParams.id)
  );

  if (!selectedDesign) {
    return <h1 className="text-center mt-10">Design Not Found</h1>;
  }

  return (
    <div className="min-h-screen bg-rose-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <Image
          src={selectedDesign.image}
          alt={selectedDesign.name}
          width={800}
          height={320}
          className="w-full h-80 object-cover rounded-lg"
        />

        <h1 className="text-3xl font-bold mt-6 text-maroon">
          {selectedDesign.name}
        </h1>

        <p className="mt-4 text-gray-600">{selectedDesign.description}</p>
      </div>
    </div>
  );
}
