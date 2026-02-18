import { NextResponse } from "next/server";

// Example static data; replace with DB fetch in production
const templates = [
  {
    id: 1,
    name: "Classic Floral Banner",
    description: "A timeless floral design for elegant weddings.",
    image_path: "/templates/design-1.jpg",
  },
  {
    id: 2,
    name: "Modern Minimalist",
    description: "Clean lines and modern fonts for a chic celebration.",
    image_path: "/templates/design-2.jpg",
  },
  {
    id: 3,
    name: "Rustic Charm",
    description: "Warm tones and rustic elements for a cozy wedding.",
    image_path: "/templates/design-3.jpg",
  },
  {
    id: 4,
    name: "Glamorous Gold",
    description: "Luxurious gold accents for a glamorous affair.",
    image_path: "/templates/design-4.jpg",
  },
  {
    id: 5,
    name: "Boho Chic",
    description: "Free-spirited design with bohemian flair.",
    image_path: "/templates/design-5.jpg",
  },
  {
    id: 6,
    name: "Vintage Elegance",
    description: "Classic vintage style for a timeless wedding.",
    image_path: "/templates/design-6.jpg",
  },
];

export async function GET() {
  return NextResponse.json(templates);
}
