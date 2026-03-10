import { useState, useEffect } from "react";
import { useFabric } from "@/context/FabricContext";

export default function TextPanel() {
    const { addText, selectedObject, setFontFamily } = useFabric();
    const isTextbox = selectedObject?.type === "textbox";

    // Local state to track properties for smooth UI updates
    const [localFontSize, setLocalFontSize] = useState<string | number>(12);
    const [localFill, setLocalFill] = useState<string>("#000000");

    // Sync local state when selection changes or object is modified
    useEffect(() => {
        if (selectedObject) {
            setLocalFontSize(Math.round((selectedObject as any).fontSize || 12));
            setLocalFill((selectedObject as any).fill || "#000000");

            const handleUpdate = () => {
                setLocalFontSize(Math.round((selectedObject as any).fontSize || 12));
                setLocalFill((selectedObject as any).fill || "#000000");
            };

            // Listen for changes made via canvas handles (scaling, etc.)
            selectedObject.on('modified', handleUpdate);
            selectedObject.on('scaling', handleUpdate);

            return () => {
                selectedObject.off('modified', handleUpdate);
                selectedObject.off('scaling', handleUpdate);
            };
        }
    }, [selectedObject]);

    const updateProperty = (prop: string, value: any) => {
        if (!selectedObject) return;

        // Update Fabric Object
        if (prop === "fontSize") {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue > 0) {
                selectedObject.set("fontSize" as any, numValue);
                setLocalFontSize(numValue);
            }
        } else {
            selectedObject.set(prop as any, value);
            if (prop === "fill") setLocalFill(value);
        }

        selectedObject.setCoords();
        selectedObject.canvas?.requestRenderAll();
    };

    const FONTS = [
        { name: "Inter", family: "Inter, sans-serif", type: "Sans" },
        { name: "Montserrat", family: "Montserrat, sans-serif", type: "Sans" },
        { name: "Poppins", family: "Poppins, sans-serif", type: "Sans" },
        { name: "Playfair Display", family: "Playfair Display, serif", type: "Serif" },
        { name: "Roboto Slab", family: "Roboto Slab, serif", type: "Serif" },
        { name: "Cinzel", family: "Cinzel, serif", type: "Serif" },
        { name: "Libre Baskerville", family: "Libre Baskerville, serif", type: "Serif" },
        { name: "Great Vibes", family: "Great Vibes, cursive", type: "Script" },
        { name: "Pacifico", family: "Pacifico, cursive", type: "Script" },
        { name: "Dancing Script", family: "Dancing Script, cursive", type: "Script" },
        { name: "Satisfy", family: "Satisfy, cursive", type: "Script" },
        { name: "Caveat", family: "Caveat, cursive", type: "Script" },
        { name: "Times New Roman", family: "Times New Roman, serif", type: "Serif" },
        { name: "Arial", family: "Arial, sans-serif", type: "Sans" },
    ];

    return (
        <div className="p-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 font-sans">Text Tools</h3>

            <div className="space-y-3 mb-8">
                <button
                    onClick={() => addText("Add a heading")}
                    className="w-full bg-white border-2 border-gray-100 py-4 px-4 rounded-xl text-left hover:border-pink-500 transition-all group flex items-center justify-between"
                >
                    <span className="text-lg font-bold text-gray-800">Add a heading</span>
                    <span className="text-pink-500 opacity-0 group-hover:opacity-100 text-xl font-bold">+</span>
                </button>
                <button
                    onClick={() => addText("Add a subheading")}
                    className="w-full bg-white border-2 border-gray-100 py-3 px-4 rounded-xl text-left hover:border-pink-500 transition-all group flex items-center justify-between"
                >
                    <span className="text-base font-semibold text-gray-700">Add a subheading</span>
                    <span className="text-pink-500 opacity-0 group-hover:opacity-100 font-bold">+</span>
                </button>
                <button
                    onClick={() => addText("Add body text")}
                    className="w-full bg-white border-2 border-gray-100 py-2.5 px-4 rounded-xl text-left hover:border-pink-500 transition-all group flex items-center justify-between"
                >
                    <span className="text-sm font-medium text-gray-600">Add body text</span>
                    <span className="text-pink-500 opacity-0 group-hover:opacity-100 font-bold">+</span>
                </button>
            </div>

            {isTextbox && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-t pt-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Editing Options</h4>

                        <div className="space-y-2 mb-4">
                            <label className="text-xs font-bold text-gray-600">Font Style</label>
                            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                                {FONTS.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => setFontFamily(font.family)}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:border-pink-300 flex items-center justify-between ${(selectedObject as any).fontFamily === font.family
                                            ? "border-pink-500 bg-pink-50"
                                            : "border-gray-50 bg-gray-50"
                                            }`}
                                    >
                                        <span style={{ fontFamily: font.family }} className="text-base truncate">
                                            {font.name}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{font.type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Size</label>
                                <input
                                    type="number"
                                    value={localFontSize}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setLocalFontSize(val);
                                        updateProperty("fontSize", val);
                                    }}
                                    className="w-full bg-gray-50 border-none rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={localFill}
                                        onChange={(e) => updateProperty("fill", e.target.value)}
                                        className="w-full h-9 p-0 border-none rounded-lg cursor-pointer overflow-hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
