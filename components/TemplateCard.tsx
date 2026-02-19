import Link from "next/link";
import Image from "next/image";
interface TemplateCardProps {
  template: {
    id: number;
    name: string;
    description: string;
    image_path: string;
  };
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
      <Image
        src={template.image_path}
        alt={template.name}
        width={400}
        height={224}
        className="w-full h-56 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {template.name}
          </h2>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {template.description}
          </p>
        </div>
        <Link
          href={`/templates/${template.id}`}
          className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-[#f709a3] transition shadow-sm text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
