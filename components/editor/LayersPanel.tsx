"use client";

import { useFabric } from "@/context/FabricContext";
import { Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import * as fabric from "fabric";

export default function LayersPanel() {
    const {
        canvas,
        selectedObject,
        deleteSelected,
        bringForward,
        sendBackward,
        toggleLock
    } = useFabric();

    const [layers, setLayers] = useState<fabric.Object[]>([]);

    const refreshLayers = () => {
        if (!canvas) return;
        // Reversed so top layers appear at the top of the list
        const objects = [...canvas.getObjects()].reverse();
        setLayers(objects);
    };

    useEffect(() => {
        if (!canvas) return;

        const handleUpdate = () => refreshLayers();

        canvas.on("object:added", handleUpdate);
        canvas.on("object:removed", handleUpdate);
        canvas.on("selection:created", handleUpdate);
        canvas.on("selection:cleared", handleUpdate);
        canvas.on("selection:updated", handleUpdate);

        refreshLayers();

        return () => {
            canvas.off("object:added", handleUpdate);
            canvas.off("object:removed", handleUpdate);
            canvas.off("selection:created", handleUpdate);
            canvas.off("selection:cleared", handleUpdate);
            canvas.off("selection:updated", handleUpdate);
        };
    }, [canvas]);

    const handleToggleVisibility = (e: React.MouseEvent, obj: fabric.Object) => {
        e.stopPropagation();
        obj.set("visible", !obj.visible);
        canvas?.requestRenderAll();
        refreshLayers();
    };

    const handleSelect = (obj: fabric.Object) => {
        if (!canvas) return;
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
    };

    const getLayerName = (obj: any) => {
        if (obj.psdLayerName) return obj.psdLayerName;
        if (obj.type === "textbox" || obj.type === "text") return obj.text?.substring(0, 20) || "Text Layer";
        return `${obj.type.charAt(0).toUpperCase() + obj.type.slice(1)} Layer`;
    };

    const getLayerType = (obj: any) => {
        if (obj.type === "textbox" || obj.type === "text") return "TEXT";
        if (obj.type === "fabric-image" || obj.type === "image") return "IMAGE";
        return "SHAPE";
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Layers</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => deleteSelected()}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                        title="Delete Selected"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {layers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm italic">
                        No layers found
                    </div>
                ) : (
                    layers.map((obj, index) => {
                        const isSelected = selectedObject === obj;
                        const layerType = getLayerType(obj);
                        const layerName = getLayerName(obj);

                        return (
                            <div
                                key={index}
                                onClick={() => handleSelect(obj)}
                                className={`group flex flex-col p-3 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                                    ? "border-pink-500 bg-pink-50/30"
                                    : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Thumbnail Placeholder */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${layerType === "TEXT" ? "bg-blue-100 text-blue-600" :
                                        layerType === "IMAGE" ? "bg-purple-100 text-purple-600" :
                                            "bg-orange-100 text-orange-600"
                                        }`}>
                                        {layerType.charAt(0)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-gray-800 truncate">
                                            {layerName}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                            {layerType}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                bringForward();
                                            }}
                                            className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-gray-600"
                                            title="Move Up"
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                sendBackward();
                                            }}
                                            className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-gray-600"
                                            title="Move Down"
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 border-l pl-3 ml-1">
                                        <button
                                            onClick={(e) => handleToggleVisibility(e, obj)}
                                            className={`p-1 rounded transition-colors ${obj.visible ? "text-gray-400 hover:text-pink-500" : "text-pink-500"
                                                }`}
                                        >
                                            {obj.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>

                                        {/* Lock mechanism if supported by hook, else hide or add toggleLock to hook if missing */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLock(obj);
                                                refreshLayers();
                                            }}
                                            className={`p-1 rounded transition-colors ${(obj as any).selectable === false ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
                                                }`}
                                        >
                                            {(obj as any).selectable === false ? <Lock size={16} /> : <Unlock size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t bg-gray-50/50">
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                    Select a layer to adjust its properties. Drag layers to reorder them on the canvas.
                </p>
            </div>
        </div>
    );
}
