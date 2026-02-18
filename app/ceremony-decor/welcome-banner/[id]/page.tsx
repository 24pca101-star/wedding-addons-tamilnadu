import Image from "next/image";
import Link from "next/link";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Template extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  image_path: string;
  template_path: string;
}

export default async function BannerDetail({
  params,
}: {
  params: { id: string | number } | Promise<{ id: string | number }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  // Fetch from Database
  const [rows] = await pool.query<Template[]>(
    'SELECT * FROM templates WHERE id = ?',
    [id]
  );
  const selectedDesign = rows[0];

  if (!selectedDesign) {
    return <h1 className="text-center mt-10">Design Not Found</h1>;
  }

  return (
    <div className="min-h-screen bg-rose-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <Image
          src={selectedDesign.image_path}
          alt={selectedDesign.name}
          width={600}
          height={400}
          className="w-full h-80 object-cover rounded-lg"
        />

        <h1 className="text-3xl font-bold mt-6 text-maroon">
          {selectedDesign.name}
        </h1>

        <p className="mt-4 text-gray-600">{selectedDesign.description}</p>

        <div className="mt-8 text-center">
          <Link
            href={`/editor?template=${selectedDesign.template_path}`}
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#f709a3] transition shadow-sm"
          >
            Customize Design
          </Link>
        </div>
      </div>
    </div>
  );
}
