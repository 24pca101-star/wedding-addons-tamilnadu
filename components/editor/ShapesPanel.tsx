"use client";

import * as fabric from "fabric";
import { Square, Circle, Triangle, Hexagon, Star, Diamond } from "lucide-react";
import { useFabric } from "@/context/FabricContext";

const SHAPES = [
    { name: "Rectangle", icon: Square, type: "rect" },
    { name: "Circle", icon: Circle, type: "circle" },
    { name: "Triangle", icon: Triangle, type: "triangle" },
    { name: "Hexagon", icon: Hexagon, type: "hexagon" },
    { name: "Star", icon: Star, type: "star" },
    { name: "Diamond", icon: Diamond, type: "diamond" },
];

export default function ShapesPanel() {
    const { canvas } = useFabric();
    const addShape = (type: string) => {
        if (!canvas) return;

        let shape: fabric.Object;
        const baseOptions = {
            left: 100,
            top: 100,
            fill: "#FF5ACD",
            width: 100,
            height: 100,
            originX: "center" as const,
            originY: "center" as const,
        };

        switch (type) {
            case "rect":
                shape = new fabric.Rect(baseOptions);
                break;
            case "circle":
                shape = new fabric.Circle({
                    ...baseOptions,
                    radius: 50,
                });
                break;
            case "triangle":
                shape = new fabric.Triangle(baseOptions);
                break;
            case "hexagon":
                shape = new fabric.Polygon([
                    { x: 50, y: 0 },
                    { x: 100, y: 25 },
                    { x: 100, y: 75 },
                    { x: 50, y: 100 },
                    { x: 0, y: 75 },
                    { x: 0, y: 25 }
                ], baseOptions);
                break;
            case "star":
                shape = new fabric.Polygon([
                    { x: 50, y: 0 },
                    { x: 63, y: 38 },
                    { x: 100, y: 38 },
                    { x: 69, y: 59 },
                    { x: 82, y: 100 },
                    { x: 50, y: 75 },
                    { x: 18, y: 100 },
                    { x: 31, y: 59 },
                    { x: 0, y: 38 },
                    { x: 37, y: 38 }
                ], baseOptions);
                break;
            case "diamond":
                shape = new fabric.Polygon([
                    { x: 50, y: 0 },
                    { x: 100, y: 50 },
                    { x: 50, y: 100 },
                    { x: 0, y: 50 }
                ], baseOptions);
                break;
            default:
                shape = new fabric.Rect(baseOptions);
        }

        canvas.add(shape);
        canvas.centerObject(shape);
        canvas.setActiveObject(shape);
        canvas.requestRenderAll();
        canvas.fire("object:modified");
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 font-sans">Shapes</h3>
            <div className="grid grid-cols-2 gap-3">
                {SHAPES.map((shape) => (
                    <button
                        key={shape.name}
                        onClick={() => addShape(shape.type)}
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-all border-2 border-transparent hover:border-pink-200 group"
                    >
                        <shape.icon className="w-8 h-8 mb-2 text-gray-600 group-hover:text-pink-600" />
                        <span className="text-xs font-bold text-gray-700">{shape.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
