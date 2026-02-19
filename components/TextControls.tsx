import { Canvas } from "fabric";

type Props = {
  canvas: Canvas | null;
};

export default function TextControls({ canvas }: Props) {

  const changeColor = (color: string) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.set("fill", color);
      canvas.renderAll();
    }
  };

  const changeFontSize = (size: number) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.set("fontSize", size);
      canvas.renderAll();
    }
  };

  const changeOpacity = (value: number) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.set("opacity", value);
      canvas.renderAll();
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      <input type="color" onChange={(e) => changeColor(e.target.value)} />
      <input type="number" placeholder="Font Size" onChange={(e) => changeFontSize(Number(e.target.value))} />
      <input type="range" min="0" max="1" step="0.1" onChange={(e) => changeOpacity(Number(e.target.value))} />
    </div>
  );
}
