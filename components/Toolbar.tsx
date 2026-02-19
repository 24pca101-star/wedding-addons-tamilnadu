import * as fabric from "fabric";

type FabricCanvas = fabric.Canvas;

type Props = {
  canvas: FabricCanvas | null;
};

export default function Toolbar({ canvas }: Props) {
  const download = () => {
    if (!canvas) return;

    const data = canvas.toDataURL({
      format: "png",
      multiplier: 2,
    });

    const link = document.createElement("a");
    link.href = data;
    link.download = "banner.png";
    link.click();
  };

  return (
    <button onClick={download}>
      Download
    </button>
  );
}
