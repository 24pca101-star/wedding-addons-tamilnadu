import type { Canvas, Object as FabricObject } from "fabric";

interface SidebarProps {
  canvas: Canvas | null;
  setSelectedObject: (obj: FabricObject | null) => void;
}

export default function Sidebar({ canvas, setSelectedObject }: SidebarProps) {
  // Example: Select first text object on canvas
  const handleTextClick = () => {
    if (!canvas) return;
    const textObj = canvas.getObjects().find((obj: { type: string; }) => obj.type === "textbox");
    if (textObj) {
      canvas.setActiveObject(textObj);
      setSelectedObject(textObj as FabricObject);
      canvas.requestRenderAll();
    }
  };

  return (
    <aside className="w-64 bg-white border-r p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-4">Edit</h2>
      <nav className="flex flex-col gap-2">
        <button className="text-left hover:text-pink-600" onClick={handleTextClick}>Text</button>
        <button className="text-left hover:text-pink-600">Images</button>
        <button className="text-left hover:text-pink-600">Background</button>
        <button className="text-left hover:text-pink-600">Layers</button>
      </nav>
    </aside>
  );
}
