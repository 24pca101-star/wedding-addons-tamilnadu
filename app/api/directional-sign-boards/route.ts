import { NextResponse } from "next/server";

export async function GET() {
  const templates = [
    {
      id: 1,
      name: "Traditional Arrow",
      image: "/templates/traditional-arrow.jpg",
      psd_path: "/templates/traditional-arrow.psd",
      preview: "/templates/traditional-arrow.jpg",
      description: "Classic arrow sign for traditional wedding venues."
    },
    {
      id: 2,
      name: "Floral Direction",
      image: "/templates/floral-board.jpg",
      psd_path: "/templates/floral-board.psd",
      preview: "/templates/floral-board.jpg",
      description: "Elegant floral design to guide guests with style."
    },
    {
      id: 3,
      name: "Modern Minimal",
      image: "/templates/modern-board.jpg",
      psd_path: "/templates/modern-board.psd",
      preview: "/templates/modern-board.jpg",
      description: "Minimalist board for contemporary wedding themes."
    },
    {
      id: 4,
      name: "Rustic Wooden",
      image: "/templates/rustic-board.jpg",
      psd_path: "/templates/rustic-board.psd",
      preview: "/templates/rustic-board.jpg",
      description: "Rustic wooden sign for outdoor or barn weddings."
    },
    {
      id: 5,
      name: "Elegant Gold Frame",
      image: "/templates/gold-frame-sign.jpg",
      psd_path: "/templates/gold-frame-sign.psd",
      preview: "/templates/gold-frame-sign.jpg",
      description: "Gold-framed sign for a touch of luxury."
    },
    {
      id: 6,
      name: "Banana Leaf Traditional",
      image: "/templates/banana-leaf-sign.jpg",
      psd_path: "/templates/banana-leaf-sign.psd",
      preview: "/templates/banana-leaf-sign.jpg",
      description: "Banana leaf sign for South Indian wedding traditions."
    },
  ];

  return NextResponse.json(templates);
}
