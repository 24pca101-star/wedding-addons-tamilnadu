import { useState, ReactNode, isValidElement, cloneElement } from "react";
import type { Canvas, FabricObject } from "fabric";
import Sidebar from "./Sidebar";
import PropertiesPanel from "./PropertiesPanel";

export default function EditorLayout({ children }: { children: ReactNode }) {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [canvasRef, setCanvasRef] = useState<Canvas | null>(null);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar canvas={canvasRef} setSelectedObject={setSelectedObject} />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {isValidElement(children)
          ? cloneElement(children, { setSelectedObject, setCanvasRef } as Record<string, unknown>)
          : children}
      </main>
      <PropertiesPanel selectedObject={selectedObject} canvas={canvasRef} />
    </div>
  );
}
