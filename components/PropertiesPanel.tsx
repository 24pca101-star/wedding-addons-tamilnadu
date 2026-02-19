
import type { Canvas, FabricObject, Textbox } from "fabric";
import { useState, useEffect } from "react";


interface PropertiesPanelProps {
  selectedObject: FabricObject | null;
  canvas: Canvas | null;
}

export default function PropertiesPanel({ selectedObject, canvas }: PropertiesPanelProps) {
  // Always call hooks at the top level
  const [text, setText] = useState("");
  const [color, setColor] = useState<string>("#000000");
  const [fontSize, setFontSize] = useState<number>(24);

   useEffect(() => {
    if (selectedObject?.type === "textbox") {
      const textbox = selectedObject as Textbox;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(textbox.text ?? "");
    }
  }, [selectedObject]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (selectedObject && selectedObject.type === "textbox") {
      selectedObject.set("text", e.target.value);
      canvas?.requestRenderAll();
    }
  };
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    if (selectedObject && selectedObject.type === "textbox") {
      selectedObject.set("fill", e.target.value);
      canvas?.requestRenderAll();
    }
  };
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setFontSize(size);
    if (selectedObject && selectedObject.type === "textbox") {
      selectedObject.set("fontSize", size);
      canvas?.requestRenderAll();
    }
  };

  return (
    <aside className="w-80 bg-white border-l p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      {selectedObject && selectedObject.type === "textbox" ? (
        <>
          <label className="font-semibold mb-2">Text Content</label>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className="border rounded px-2 py-1 mb-4"
          />
          <label className="font-semibold mb-2">Text Color</label>
          <input
            type="color"
            value={typeof color === "string" ? color : "#000000"}
            onChange={handleColorChange}
            className="w-12 h-8 mb-4"
          />
          <label className="font-semibold mb-2">Font Size</label>
          <input
            type="number"
            min={8}
            max={200}
            value={fontSize}
            onChange={handleFontSizeChange}
            className="border rounded px-2 py-1 mb-4"
          />
        </>
      ) : (
        <div className="text-gray-400">Select a layer to edit its properties.</div>
      )}
    </aside>
  );
}

