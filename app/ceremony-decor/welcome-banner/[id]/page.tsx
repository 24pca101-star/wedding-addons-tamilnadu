"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as fabric from "fabric";
import EditorCanvas from "@/components/EditorCanvas";
import Toolbar from "@/components/Toolbar";
import TextControls from "@/components/TextControls";

type FabricCanvas = fabric.Canvas;

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();

  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [, setSelectedText] = useState<fabric.Textbox | null>(null);

  let width = 400;
  let height = 600;

  // ✅ Case 1: route like /5x8
  if (params.id) {
    const parts = (params.id as string).split("x");
    width = Number(parts[0]) * 100;
    height = Number(parts[1]) * 100;
  }

  // ✅ Case 2: query ?width=5&height=8
  const qWidth = searchParams.get("width");
  const qHeight = searchParams.get("height");

  if (qWidth && qHeight) {
    width = Number(qWidth) * 100;
    height = Number(qHeight) * 100;
  }

  // 🧠 Detect selected text
  useEffect(() => {
  if (!canvas) return;

  const updateSelection = () => {
    const active = canvas.getActiveObject();

    if (active && active.type === "textbox") {
      setSelectedText(active as fabric.Textbox);
    } else {
      setSelectedText(null);
    }
  };

  canvas.on("selection:created", updateSelection);
  canvas.on("selection:updated", updateSelection);
  canvas.on("selection:cleared", updateSelection);

  return () => {
    canvas.off("selection:created", updateSelection);
    canvas.off("selection:updated", updateSelection);
    canvas.off("selection:cleared", updateSelection);
  };
}, [canvas]);


  console.log("Canvas Size:", width, height);

  return (
    <div className="flex h-screen">

      {/* 🧰 LEFT PANEL */}
      <div className="w-64 bg-gray-100 p-4 space-y-4 border-r">
        <h2 className="font-semibold text-lg">Text Settings</h2>
        <TextControls canvas={canvas} />
      </div>

      {/* 🎨 MAIN AREA */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 gap-4">

        {/* 🛠 Toolbar */}
        <Toolbar canvas={canvas} />

        {/* 🖼 Canvas */}
        <EditorCanvas width={width} height={height} setCanvas={setCanvas} />

      </div>
    </div>
  );
}
