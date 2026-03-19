"use client";

import * as fabric from "fabric";
import { useFabric } from "@/context/FabricContext";
import { Star, Square, Circle, Layout, Leaf } from "lucide-react";

const ELEMENTS = [
    { name: "Rectangle", icon: Square, type: "rect", color: "#FF5ACD" },
    { name: "Circle", icon: Circle, type: "circle", color: "#4B0082" },
    { name: "Star", icon: Star, type: "star", color: "#FFD700" },
    { name: "Leaf", icon: Leaf, type: "floral", color: "#228B22" },
    { name: "Layout", icon: Layout, type: "rect", color: "#00CED1" },
];

export default function ElementsPanel() {
    const { addShape } = useFabric();

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
