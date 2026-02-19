import { NextRequest, NextResponse } from "next/server";


// Example static data; replace with DB fetch in production
const templates = [
  {
    id: 1,
    name: "Classic Floral Banner",
    description: "A timeless floral design for elegant weddings.",
    image_path: "/templates/design-1.jpg",
    template_path: "/templates/design-1.psd",
  },
  {
    id: 2,
    name: "Modern Minimalist",
    description: "Clean lines and modern fonts for a chic celebration.",
    image_path: "/templates/design-2.jpg",
    template_path: "/templates/design-2.psd",
  },
  {
    id: 3,
    name: "Rustic Charm",
    description: "Warm tones and rustic elements for a cozy wedding.",
    image_path: "/templates/design-3.jpg",
    template_path: "/templates/design-3.psd",
  },
  {
    id: 4,
    name: "Glamorous Gold",
    description: "Luxurious gold accents for a glamorous affair.",
    image_path: "/templates/design-4.jpg",
    template_path: "/templates/design-4.psd",
  },
  {
    id: 5,
    name: "Boho Chic",
    description: "Free-spirited design with bohemian flair.",
    image_path: "/templates/design-5.jpg",
    template_path: "/templates/design-5.psd",
  },
  {
    id: 6,
    name: "Vintage Elegance",
    description: "Classic vintage style for a timeless wedding.",
    image_path: "/templates/design-6.jpg",
    template_path: "/templates/design-6.psd",
  },

];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const template = templates.find((t) => t.id === id);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
  // Map template_path to psd_path for frontend compatibility
  const { template_path, ...rest } = template;
  return NextResponse.json({ ...rest, psd_path: template_path });
}
