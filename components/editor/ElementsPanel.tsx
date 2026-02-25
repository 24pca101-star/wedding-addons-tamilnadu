"use client";

import * as fabric from "fabric";
import { useFabric } from "@/context/FabricContext";
import { Star, Square, Circle, Layout, Leaf } from "lucide-react";

export default function ElementsPanel() {
    const { canvas } = useFabric();

    const ELEMENTS = [
        { name: "Square", icon: Square, type: "rect" },
        { name: "Circle", icon: Circle, type: "circle" },
        { name: "Star", icon: Star, type: "star" },
        { name: "Divider", icon: Layout, type: "line" },
        { name: "Floral", icon: Leaf, type: "floral", color: "#FF69B4" },
        { name: "Vine", icon: Leaf, type: "floral", color: "#32CD32" },
    ];

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
        canvas.requestRenderAll();
        canvas.fire("object:modified");
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 font-sans">Elements</h3>
            <div className="grid grid-cols-2 gap-3">
                {ELEMENTS.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => addShape(item.type, { color: item.color })}
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-all border-2 border-transparent hover:border-pink-200 group"
                    >
                        <item.icon className="w-8 h-8 mb-2 text-gray-600 group-hover:text-pink-600" />
                        <span className="text-xs font-bold text-gray-700">{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
