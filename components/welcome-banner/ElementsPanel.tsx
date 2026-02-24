"use client";

import * as fabric from "fabric";
import { Heart, Star, Sparkles, Square, Circle, Minus, Flower2, Leaf } from "lucide-react";

type Props = {
    canvas: fabric.Canvas | null;
};

const ELEMENTS = [
    { name: "Heart", icon: Heart, type: "icon" },
    { name: "Star", icon: Star, type: "icon" },
    { name: "Sparkle", icon: Sparkles, type: "icon" },
    { name: "Square", icon: Square, type: "rect" },
    { name: "Circle", icon: Circle, type: "circle" },
    { name: "Divider", icon: Minus, type: "line" },
];

const FLORAL = [
    { name: "Rose", icon: Flower2, color: "#FF1493" },
    { name: "Lily", icon: Flower2, color: "#FFD700" },
    { name: "Leaf", icon: Leaf, color: "#228B22" },
    { name: "Vine", icon: Leaf, color: "#32CD32" },
];

export default function ElementsPanel({ canvas }: Props) {

    const addShape = (type: string, options: any = {}) => {
        if (!canvas) return;

        let shape: fabric.Object;
        const color = options.color || "#FF5ACD";

        switch (type) {
            case "rect":
                shape = new fabric.Rect({
                    width: 100,
                    height: 100,
                    fill: color,
                    left: 100,
                    top: 100
                });
                break;
            case "circle":
                shape = new fabric.Circle({
                    radius: 50,
                    fill: color,
                    left: 100,
                    top: 100
                });
                break;
            case "line":
                shape = new fabric.Rect({
                    width: 200,
                    height: 4,
                    fill: color,
                    left: 100,
                    top: 100
                });
                break;
            case "floral":
                // Create a stylized floral element using a group or a path
                // For now, let's just add a colorful circle that represents the floral item
                shape = new fabric.Circle({
                    radius: 40,
                    fill: color,
                    stroke: "#FFFFFF",
                    strokeWidth: 5,
                    left: 100,
                    top: 100,
                    shadow: new fabric.Shadow({
                        color: "rgba(0,0,0,0.1)",
                        blur: 10,
                        offsetX: 5,
                        offsetY: 5
                    })
                });
                break;
            default:
                shape = new fabric.Rect({
                    width: 80,
                    height: 80,
                    fill: color,
                    rx: 10,
                    ry: 10,
                    left: 100,
                    top: 100
                });
        }

        canvas.add(shape);
        canvas.centerObject(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        canvas.fire("object:modified");
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 font-sans">Elements</h3>

            <div className="grid grid-cols-2 gap-3 mb-8">
                {ELEMENTS.map((el) => (
                    <button
                        key={el.name}
                        onClick={() => addShape(el.type)}
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-all border-2 border-transparent hover:border-pink-200 group"
                    >
                        <el.icon className="w-8 h-8 mb-2 text-gray-600 group-hover:text-pink-600" />
                        <span className="text-xs font-bold text-gray-700">{el.name}</span>
                    </button>
                ))}
            </div>

            <div className="">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Floral Cliparts</h4>
                <div className="grid grid-cols-2 gap-3">
                    {FLORAL.map((flower) => (
                        <button
                            key={flower.name}
                            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-all border-2 border-transparent hover:border-pink-200 group"
                            onClick={() => addShape("floral", { color: flower.color })}
                        >
                            <flower.icon style={{ color: flower.color }} className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-700">{flower.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
