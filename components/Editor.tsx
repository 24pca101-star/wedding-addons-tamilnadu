"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { readPsd } from "ag-psd";
import { loadPsdToCanvas } from "@/utils/psdParser";

interface EditorProps {
    templateUrl?: string; // Optional URL for pre-loading a PSD
}

export default function Editor({ templateUrl }: EditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Initialize Fabric Canvas
    useEffect(() => {
        if (canvasRef.current && !canvas) {
            const newCanvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: "#ffffff",
            });
            setCanvas(newCanvas);

            // Event listeners
            newCanvas.on("selection:created", (e) => setSelectedObject(e.selected ? e.selected[0] : null));
            newCanvas.on("selection:updated", (e) => setSelectedObject(e.selected ? e.selected[0] : null));
            newCanvas.on("selection:cleared", () => setSelectedObject(null));

            return () => {
                newCanvas.dispose();
            };
        }
    }, [canvasRef]); // Removed `canvas` dependency to avoid re-init loop

    // Professional Canvas Guides (Bleed & Safe Area)
    const addGuides = (canvas: fabric.Canvas, width: number, height: number) => {
        // Remove existing guides
        canvas.getObjects().filter(obj => (obj as any).isGuide).forEach(obj => canvas.remove(obj));

        // 5mm Bleed (Red dashed line)
        const bleedGuide = new fabric.Rect({
            left: 0, top: 0, width, height,
            stroke: 'red', strokeDashArray: [5, 5], fill: 'transparent',
            selectable: false, evented: false, strokeWidth: 2,
        });
        (bleedGuide as any).isGuide = true;
        (bleedGuide as any).excludeFromExport = true;

        // Safe Area (Cyan dashed line - 5mm in from bleed)
        const safeOffset = 20;
        const safeArea = new fabric.Rect({
            left: safeOffset, top: safeOffset,
            width: width - (safeOffset * 2), height: height - (safeOffset * 2),
            stroke: 'cyan', strokeDashArray: [2, 2], fill: 'transparent',
            selectable: false, evented: false, strokeWidth: 1,
        });
        (safeArea as any).isGuide = true;
        (safeArea as any).excludeFromExport = true;

        canvas.add(bleedGuide, safeArea);
        canvas.bringObjectToFront(bleedGuide);
        canvas.bringObjectToFront(safeArea);
    };

    // Boundary Lock Logic
    const setupCanvasEvents = (canvas: fabric.Canvas) => {
        canvas.on('object:moving', (e: any) => {
            const obj = e.target;
            if (!obj) return;

            // Boundary Lock
            const minLeft = 0, minTop = 0;
            const objWidth = (obj.width || 0) * (obj.scaleX || 1);
            const objHeight = (obj.height || 0) * (obj.scaleY || 1);
            const maxLeft = canvas.width! / canvas.getZoom() - objWidth;
            const maxTop = canvas.height! / canvas.getZoom() - objHeight;

            let targetLeft = Math.max(minLeft, Math.min(obj.left || 0, maxLeft));
            let targetTop = Math.max(minTop, Math.min(obj.top || 0, maxTop));

            // Snap to Center Logic
            const centerX = (canvas.width! / canvas.getZoom()) / 2;
            const centerY = (canvas.height! / canvas.getZoom()) / 2;
            const threshold = 10;

            const objCenterX = targetLeft + objWidth / 2;
            const objCenterY = targetTop + objHeight / 2;

            let snappedX = false;
            let snappedY = false;

            if (Math.abs(objCenterX - centerX) < threshold) {
                targetLeft = centerX - objWidth / 2;
                snappedX = true;
            }
            if (Math.abs(objCenterY - centerY) < threshold) {
                targetTop = centerY - objHeight / 2;
                snappedY = true;
            }

            obj.set({ left: targetLeft, top: targetTop });

            // Visual Snap Guides
            const guides = canvas.getObjects().filter(o => (o as any).isSnapGuide);
            guides.forEach(g => canvas.remove(g));

            if (snappedX) {
                const lineX = new fabric.Line([centerX, 0, centerX, canvas.height! / canvas.getZoom()], {
                    stroke: '#8b5cf6', strokeWidth: 1, selectable: false, evented: false, strokeDashArray: [5, 5]
                });
                (lineX as any).isSnapGuide = true;
                canvas.add(lineX);
            }
            if (snappedY) {
                const lineY = new fabric.Line([0, centerY, canvas.width! / canvas.getZoom(), centerY], {
                    stroke: '#8b5cf6', strokeWidth: 1, selectable: false, evented: false, strokeDashArray: [5, 5]
                });
                (lineY as any).isSnapGuide = true;
                canvas.add(lineY);
            }
        });

        canvas.on('mouse:up', () => {
            const guides = canvas.getObjects().filter(o => (o as any).isSnapGuide);
            guides.forEach(g => canvas.remove(g));
            canvas.requestRenderAll();
        });
    };

    const alignObject = (position: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
        if (!selectedObject || !canvas) return;
        const canvasWidth = canvas.width! / canvas.getZoom();
        const canvasHeight = canvas.height! / canvas.getZoom();
        const objWidth = (selectedObject.width || 0) * (selectedObject.scaleX || 1);
        const objHeight = (selectedObject.height || 0) * (selectedObject.scaleY || 1);

        switch (position) {
            case 'left': selectedObject.set('left', 0); break;
            case 'center': selectedObject.set('left', (canvasWidth - objWidth) / 2); break;
            case 'right': selectedObject.set('left', canvasWidth - objWidth); break;
            case 'top': selectedObject.set('top', 0); break;
            case 'middle': selectedObject.set('top', (canvasHeight - objHeight) / 2); break;
            case 'bottom': selectedObject.set('top', canvasHeight - objHeight); break;
        }
        selectedObject.setCoords();
        canvas.requestRenderAll();
        saveHistory();
    };

    // Zoom to Fit Logic (using setZoom)
    const zoomToFit = (targetWidth?: number, targetHeight?: number) => {
        if (!canvas || !containerRef.current) return;
        const width = targetWidth || canvasSize.width;
        const height = targetHeight || canvasSize.height;
        if (!width || !height) return;

        const padding = 40;
        const containerWidth = containerRef.current.clientWidth - padding;
        const containerHeight = containerRef.current.clientHeight - padding;
        const scale = Math.min(containerWidth / width, containerHeight / height);

        canvas.setZoom(scale);
        canvas.setDimensions({ width: width * scale, height: height * scale });
        canvas.renderAll();
    };

    const setZoom100 = (targetWidth?: number, targetHeight?: number) => {
        if (!canvas) return;
        const width = targetWidth || canvasSize.width;
        const height = targetHeight || canvasSize.height;

        canvas.setZoom(1);
        canvas.setDimensions({ width, height });
        canvas.renderAll();
    };

    // Auto-resize Observer
    useEffect(() => {
        if (!containerRef.current || !canvas) return;

        const resizeObserver = new ResizeObserver(() => {
            zoomToFit();
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [canvas, canvasSize]);

    // Handle File Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !canvas) return;

        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const psd = readPsd(arrayBuffer, { useImageData: true, useCanvas: true });

        await document.fonts.ready;
        const dims = await loadPsdToCanvas(psd, canvas);
        setCanvasSize(dims);
        addGuides(canvas, dims.width, dims.height);
        setupCanvasEvents(canvas);
        zoomToFit(dims.width, dims.height); // Start at fit zoom (Canva style)
    };

    // Load Template from URL
    useEffect(() => {
        const loadTemplate = async () => {
            if (templateUrl && canvas) {
                try {
                    const response = await fetch(templateUrl);
                    if (!response.ok) throw new Error("Failed to load template");
                    const arrayBuffer = await response.arrayBuffer();
                    // @ts-ignore
                    const psd = readPsd(arrayBuffer, { useImageData: true, useCanvas: true });

                    await document.fonts.ready;
                    const dims = await loadPsdToCanvas(psd, canvas);
                    setCanvasSize(dims);
                    addGuides(canvas, dims.width, dims.height);
                    setupCanvasEvents(canvas);
                    zoomToFit(dims.width, dims.height); // Start at fit zoom (Canva style)
                } catch (error) {
                    console.error("Error loading template:", error);
                    alert("Failed to load template configuration.");
                }
            }
        };
        loadTemplate();
    }, [templateUrl, canvas]);


    // Add Text
    const addText = () => {
        if (!canvas) return;
        const text = new fabric.IText("New Text", {
            left: 100,
            top: 100,
            fontFamily: "Arial",
            fill: "#000000",
            fontSize: 40,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
    };

    // Update Text Properties
    const updateTextProperty = (property: string, value: string | number) => {
        if (selectedObject && (selectedObject.type === "i-text" || selectedObject.type === "text")) {
            (selectedObject as fabric.IText).set(property as any, value);
            canvas?.requestRenderAll();
            setSelectedObject({ ...selectedObject } as fabric.Object); // Force re-render
        }
    };

    // Add Image from Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !canvas) return;

        const reader = new FileReader();
        reader.onload = async (f) => {
            const data = f.target?.result as string;
            // Fabric v6: fromURL returns a Promise<Image>
            try {
                const img = await fabric.Image.fromURL(data);
                img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
            } catch (err) {
                console.error("Error loading image:", err);
            }
        };
        reader.readAsDataURL(file);
    };

    // Add Shapes
    const addRectangle = () => {
        if (!canvas) return;
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "red",
            width: 100,
            height: 100,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
    };

    const addCircle = () => {
        if (!canvas) return;
        const circle = new fabric.Circle({
            left: 100,
            top: 100,
            fill: "blue",
            radius: 50,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
    };

    // Layer Management
    const moveLayer = (direction: "up" | "down" | "top" | "bottom") => {
        if (!selectedObject || !canvas) return;

        // Fabric.js v6 uses canvas methods for z-index or object methods
        switch (direction) {
            case "up":
                canvas.bringObjectForward(selectedObject);
                break;
            case "down":
                canvas.sendObjectBackwards(selectedObject);
                break;
            case "top":
                canvas.bringObjectToFront(selectedObject);
                break;
            case "bottom":
                canvas.sendObjectToBack(selectedObject);
                break;
        }
        canvas.requestRenderAll();
    };

    // Delete Object
    const deleteObject = () => {
        if (selectedObject && canvas) {
            canvas.remove(selectedObject);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
        }
    };

    // Download Image (300 DPI High-Res)
    const downloadImage = () => {
        if (!canvas) return;

        // Hide guides for export
        const guides = canvas.getObjects().filter(obj => (obj as any).isGuide);
        guides.forEach(g => g.set('visible', false));

        // 300 DPI Multiplier (300 / 72 = 4.166...)
        const multiplier = 300 / 72;

        const dataURL = canvas.toDataURL({
            format: "png",
            quality: 1,
            multiplier: multiplier / canvas.getZoom(), // Correct for current zoom scale
        });

        // Restore guides
        guides.forEach(g => g.set('visible', true));
        canvas.requestRenderAll();

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "wedding-invitation-300dpi.png";
        link.click();
    };

    // Save Design
    const handleSaveDesign = async () => {
        if (!canvas) return;

        const name = prompt("Enter a name for your design:");
        if (!name) return;

        const canvasJson = canvas.toJSON();
        const previewImage = canvas.toDataURL({ format: "png", multiplier: 0.5 / canvas.getZoom() });

        try {
            const response = await fetch('/api/save-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, canvas_json: canvasJson, preview_image: previewImage }),
            });

            if (response.ok) {
                alert("Design saved successfully!");
            } else {
                alert("Failed to save design.");
            }
        } catch (error) {
            console.error("Error saving design:", error);
            alert("Error saving design.");
        }
    };

    const saveHistory = () => {
        if (!canvas) return;
        const json = JSON.stringify(canvas.toJSON());
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(json);
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0 && canvas) {
            const nextIndex = historyIndex - 1;
            const state = history[nextIndex];
            canvas.loadFromJSON(state).then(() => {
                canvas.renderAll();
                setHistoryIndex(nextIndex);
            });
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1 && canvas) {
            const nextIndex = historyIndex + 1;
            const state = history[nextIndex];
            canvas.loadFromJSON(state).then(() => {
                canvas.renderAll();
                setHistoryIndex(nextIndex);
            });
        }
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === "Delete" || e.key === "Backspace") {
                deleteObject();
            } else if (e.ctrlKey && e.key === "z") {
                undo();
            } else if (e.ctrlKey && e.key === "y") {
                redo();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [canvas, selectedObject, historyIndex, history]);

    const duplicateObject = async () => {
        if (!selectedObject || !canvas) return;
        const cloned = await selectedObject.clone();
        cloned.set({
            left: (selectedObject.left || 0) + 20,
            top: (selectedObject.top || 0) + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        saveHistory();
    };

    // Auto-Save Logic
    const [lastSavedJson, setLastSavedJson] = useState<string>('');
    useEffect(() => {
        if (!canvas) return;

        const autoSaveTimer = setInterval(async () => {
            const currentJson = JSON.stringify(canvas.toJSON());
            if (currentJson === lastSavedJson) return;

            try {
                // Determine a name (could be derived from template or user)
                const name = "AutoSaved_" + new Date().toLocaleTimeString();
                const previewImage = canvas.toDataURL({ format: "png", multiplier: 0.2 });

                await fetch('/api/save-design', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, canvas_json: canvas.toJSON(), preview_image: previewImage }),
                });
                setLastSavedJson(currentJson);
                console.log("Auto-save complete");
            } catch (err) {
                console.error("Auto-save failed:", err);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(autoSaveTimer);
    }, [canvas, lastSavedJson]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-inter">
            {/* Sidebar Tools */}
            <aside className={`
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                fixed md:relative z-40 w-80 h-full bg-white shadow-xl transition-transform duration-300
                flex flex-col border-r border-gray-200
            `}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-maroon to-rose-600 bg-clip-text text-transparent">
                        Design Studio
                    </h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Elements Section */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Add Elements</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={addText} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-rose-200 hover:bg-rose-50 transition-all group">
                                <span className="text-xl">T</span>
                                <span className="text-xs mt-1 text-gray-600">Text</span>
                            </button>
                            <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-rose-200 hover:bg-rose-50 cursor-pointer transition-all group">
                                <span className="text-xl">🖼️</span>
                                <span className="text-xs mt-1 text-gray-600">Image</span>
                                <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </label>
                        </div>
                    </div>

                    {/* Layers Section */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Layers</h3>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar border border-gray-100 rounded-xl p-2 bg-gray-50/50">
                            {canvas?.getObjects().filter(obj => !(obj as any).isGuide).reverse().map((obj, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        canvas.setActiveObject(obj);
                                        canvas.requestRenderAll();
                                    }}
                                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-all ${selectedObject === obj ? 'bg-white shadow-sm border border-rose-100' : 'hover:bg-white/60'}`}
                                >
                                    <span className="text-[10px] text-gray-400 w-4 font-mono">{i + 1}</span>
                                    <span className="flex-1 truncate font-medium text-gray-700">
                                        {(obj as any).name || (obj.type === 'i-text' ? 'Text' : 'Image')}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                obj.set('visible', !obj.visible);
                                                canvas.requestRenderAll();
                                            }}
                                            className={`p-1 rounded hover:bg-white ${!obj.visible ? 'grayscale opacity-30 shadow-none' : 'shadow-sm bg-white'}`}
                                            title="Toggle Visibility"
                                        >
                                            {obj.visible ? '👁️' : '🕶️'}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                (obj as any).locked = !(obj as any).locked;
                                                obj.set({
                                                    selectable: !(obj as any).locked,
                                                    evented: !(obj as any).locked,
                                                    lockMovementX: (obj as any).locked,
                                                    lockMovementY: (obj as any).locked
                                                });
                                                canvas.requestRenderAll();
                                            }}
                                            className={`p-1 rounded hover:bg-white ${(obj as any).locked ? 'bg-rose-500 text-white shadow-rose-200' : 'shadow-sm bg-white'}`}
                                            title="Toggle Lock"
                                        >
                                            {(obj as any).locked ? '🔒' : '🔓'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Properties Section */}
                    {selectedObject ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="h-px bg-gray-100"></div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Properties</h3>
                                <button onClick={duplicateObject} className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors">DUPLICATE</button>
                            </div>

                            {(selectedObject.type === "i-text" || selectedObject.type === "text") && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                                        value={(selectedObject as any).text}
                                        onChange={(e) => updateTextProperty("text", e.target.value)}
                                    />

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Font Family</label>
                                        <select
                                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-rose-500 outline-none"
                                            value={(selectedObject as any).fontFamily}
                                            onChange={(e) => updateTextProperty("fontFamily", e.target.value)}
                                        >
                                            <optgroup label="Tamil Fonts">
                                                <option value="Noto Sans Tamil">Noto Sans Tamil</option>
                                                <option value="Catamaran">Catamaran</option>
                                                <option value="Latha">Latha</option>
                                            </optgroup>
                                            <optgroup label="English Fonts">
                                                <option value="Inter">Inter</option>
                                                <option value="Arial">Arial</option>
                                                <option value="Times New Roman">Serif</option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Size</label>
                                            <input
                                                type="number"
                                                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50"
                                                value={(selectedObject as any).fontSize}
                                                onChange={(e) => updateTextProperty("fontSize", parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Color</label>
                                            <input
                                                type="color"
                                                className="w-full h-[43px] p-1 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
                                                value={(selectedObject as any).fill}
                                                onChange={(e) => updateTextProperty("fill", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Letter Spacing</label>
                                                <span className="text-[10px] text-gray-400">{(selectedObject as any).charSpacing || 0}</span>
                                            </div>
                                            <input
                                                type="range" min="-100" max="1000" step="5"
                                                className="w-full accent-rose-500"
                                                value={(selectedObject as any).charSpacing || 0}
                                                onChange={(e) => updateTextProperty("charSpacing", parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Line Height</label>
                                                <span className="text-[10px] text-gray-400">{(selectedObject as any).lineHeight?.toFixed(1) || 1.1}</span>
                                            </div>
                                            <input
                                                type="range" min="0.5" max="3" step="0.1"
                                                className="w-full accent-rose-500"
                                                value={(selectedObject as any).lineHeight || 1.1}
                                                onChange={(e) => updateTextProperty("lineHeight", parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Align</label>
                                <div className="grid grid-cols-3 gap-1">
                                    <button onClick={() => alignObject('left')} className="p-1.5 border rounded-lg hover:bg-gray-50" title="Align Left">⬅️</button>
                                    <button onClick={() => alignObject('center')} className="p-1.5 border rounded-lg hover:bg-gray-50" title="Align Center">↔️</button>
                                    <button onClick={() => alignObject('right')} className="p-1.5 border rounded-lg hover:bg-gray-50" title="Align Right">➡️</button>
                                    <button onClick={() => alignObject('top')} className="p-1.5 border rounded-lg hover:bg-gray-50" title="Align Top">⬆️</button>
                                    <button onClick={() => alignObject('middle')} className="p-1.5 border rounded-lg hover:bg-gray-50" title="Align Middle">↕️</button>
                                    <button onClick={() => alignObject('bottom')} className="p-1.5 border rounded-lg hover:bg-gray-50" title="Align Bottom">⬇️</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <button onClick={() => moveLayer("top")} className="p-2 text-[10px] font-bold border rounded-lg hover:bg-gray-50 uppercase">To Front</button>
                                <button onClick={() => moveLayer("bottom")} className="p-2 text-[10px] font-bold border rounded-lg hover:bg-gray-50 uppercase">To Back</button>
                            </div>

                            <button onClick={deleteObject} className="w-full py-3 mt-4 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition-colors">
                                Delete Element
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400 text-sm italic">Select an element to edit</div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
                    <button onClick={handleSaveDesign} className="w-full py-4 bg-maroon text-white rounded-xl font-bold shadow-lg shadow-maroon/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Save Design
                    </button>
                    <button onClick={downloadImage} className="w-full py-4 bg-white border-2 border-maroon text-maroon rounded-xl font-bold hover:bg-maroon/5 transition-all">
                        Download Print PDF
                    </button>
                </div>
            </aside>

            {/* Main Canvas Area */}
            <main className="flex-1 flex flex-col relative bg-gray-200 overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg md:hidden">🛠️</button>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button onClick={undo} className="p-1.5 hover:bg-white rounded transition-all" title="Undo (Ctrl+Z)">↩️</button>
                            <button onClick={redo} className="p-1.5 hover:bg-white rounded transition-all" title="Redo (Ctrl+Y)">↪️</button>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <label className="text-xs font-bold text-gray-500 hover:text-rose-600 cursor-pointer flex items-center gap-2">
                            <span>📄</span> IMPORT PSD
                            <input type="file" accept=".psd" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400">ZOOM</span>
                            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                                <span className="text-xs font-bold text-gray-600 px-2 min-w-[3rem]">{(canvas?.getZoom() || 1 * 100).toFixed(0)}%</span>
                                <button onClick={() => zoomToFit()} className="text-[10px] bg-white px-2 py-1 rounded shadow-sm border border-gray-100 hover:bg-gray-50 transition-all font-bold">FIT</button>
                                <button onClick={() => setZoom100()} className="text-[10px] bg-white px-2 py-1 rounded shadow-sm border border-gray-100 hover:bg-gray-50 transition-all font-bold ml-0.5">1:1</button>
                            </div>
                        </div>
                    </div>
                </header>

                <div
                    ref={containerRef}
                    className="flex-1 overflow-auto p-12 flex justify-center items-center relative"
                    style={{
                        backgroundImage: `radial-gradient(#d1d5db 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                >
                    <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-white rounded-sm overflow-hidden">
                        <canvas ref={canvasRef} />
                    </div>
                </div>

                {/* Print Legend */}
                <footer className="bg-white border-t border-gray-200 px-6 py-2 flex items-center gap-8 text-[10px] font-bold text-gray-400">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-1 bg-red-500"></span>
                        <span className="uppercase">5mm Bleed Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-1 bg-cyan-500"></span>
                        <span className="uppercase">Safe Text Zone</span>
                    </div>
                    <div className="ml-auto font-mono text-rose-500">300 DPI PRODUCTION READY</div>
                </footer>
            </main>
        </div>
    );
}
