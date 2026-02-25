"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import * as fabric from "fabric";

export const useFabricEditor = () => {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
    const [zoom, setZoom] = useState(1);

    // History State
    const history = useRef<string[]>([]);
    const historyIndex = useRef(-1);
    const isReloadingHistory = useRef(false);

    // Tracks whether the canvas instance is still alive (not disposed).
    // Used to guard async callbacks that could resolve after dispose().
    const isAlive = useRef(false);

    const saveHistory = useCallback(() => {
        if (!canvas || isReloadingHistory.current) return;

        const json = JSON.stringify(canvas.toJSON());

        // If we are in the middle of history, discard future states
        if (historyIndex.current < history.current.length - 1) {
            history.current = history.current.slice(0, historyIndex.current + 1);
        }

        history.current.push(json);
        historyIndex.current = history.current.length - 1;

        // Limit history size
        if (history.current.length > 50) {
            history.current.shift();
            historyIndex.current--;
        }
    }, [canvas]);

    const undo = useCallback(() => {
        if (!canvas || historyIndex.current <= 0) return;

        isReloadingHistory.current = true;
        historyIndex.current--;
        const json = history.current[historyIndex.current];

        canvas.loadFromJSON(json).then(() => {
            // Guard: canvas may have been disposed while the Promise was in-flight.
            if (!isAlive.current || !canvas.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            canvas.renderAll();
            isReloadingHistory.current = false;
        });
    }, [canvas]);

    const redo = useCallback(() => {
        if (!canvas || historyIndex.current >= history.current.length - 1) return;

        isReloadingHistory.current = true;
        historyIndex.current++;
        const json = history.current[historyIndex.current];

        canvas.loadFromJSON(json).then(() => {
            // Guard: canvas may have been disposed while the Promise was in-flight.
            if (!isAlive.current || !canvas.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            canvas.renderAll();
            isReloadingHistory.current = false;
        });
    }, [canvas]);

    const resizeCanvas = useCallback((width: number, height: number) => {
        if (!canvas) return;
        // Guard against calling setDimensions on a disposed canvas.
        // After dispose(), fabric tears down the internal lower/upper canvas elements.
        if (!canvas.lowerCanvasEl) return;
        canvas.setDimensions({ width, height });
        canvas.renderAll();
    }, [canvas]);

    const initCanvas = useCallback((el: HTMLCanvasElement, options: any) => {
        // Defensive check using the ref to prevent double initialization
        if (canvasRef.current) {
            console.log("Fabric: Canvas already exists in Ref, skipping initialization.");
            return canvasRef.current;
        }

        // Tag check on element itself
        // @ts-expect-error - Custom property __fabric_canvas for manual detection
        if (el.__fabric_canvas) {
            console.log("Fabric: Canvas already exists on DOM element, skipping.");
            // @ts-expect-error - Custom property __fabric_canvas
            const existing = el.__fabric_canvas;
            canvasRef.current = existing;
            setCanvas(existing);
            return existing;
        }

        console.log("Fabric: Creating new Canvas instance");
        const c = new fabric.Canvas(el, {
            ...options,
            preserveObjectStacking: true,
        });

        // @ts-expect-error - Custom property __fabric_canvas for manual detection
        el.__fabric_canvas = c;

        // Initial history save
        const initialJson = JSON.stringify(c.toJSON());
        history.current = [initialJson];
        historyIndex.current = 0;

        isAlive.current = true;
        canvasRef.current = c;
        setCanvas(c);
        return c;
    }, []);

    const addText = useCallback((text: string = "Type here...") => {
        if (!canvas) return;
        const textbox = new fabric.Textbox(text, {
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            width: 250,
            fontSize: 40,
            fontFamily: "Inter, Arial, sans-serif",
            fill: "#000000",
            textAlign: "center",
            originX: "center",
            originY: "center",
        });

        if (canvas) {
            canvas.add(textbox);
            canvas.setActiveObject(textbox);
            // Use a small timeout to ensure Fabric internals are ready for editing mode
            setTimeout(() => {
                if (textbox.canvas && typeof (textbox.canvas as any).getElement === 'function') {
                    const el = (textbox.canvas as any).getElement();
                    if (el) {
                        textbox.enterEditing();
                        textbox.selectAll();
                        textbox.canvas.renderAll();
                    }
                }
            }, 150);
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const addRect = useCallback(() => {
        if (!canvas) return;
        const rect = new fabric.Rect({
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            fill: "#FF5ACD",
            width: 150,
            height: 150,
            originX: "center",
            originY: "center",
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
        saveHistory();
    }, [canvas, saveHistory]);

    const deleteSelected = useCallback(() => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
            canvas.remove(...activeObjects);
            canvas.discardActiveObject();
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const updateSelection = useCallback(() => {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        setSelectedObject(active || null);
    }, [canvas]);

    const bringToFront = useCallback(() => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringObjectToFront(activeObject);
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const sendToBack = useCallback(() => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendObjectToBack(activeObject);
            // Ensure safe area stays at the very bottom if it exists
            const safeArea = canvas.getObjects().find((obj: any) => (obj as any).isSafeArea);
            if (safeArea && safeArea !== activeObject) {
                canvas.sendObjectToBack(safeArea);
            }
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const bringForward = useCallback(() => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringObjectForward(activeObject);
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const sendBackward = useCallback(() => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendObjectBackwards(activeObject);
            // Ensure safe area stays at the very bottom
            const safeArea = canvas.getObjects().find((obj) => (obj as any).isSafeArea);
            if (safeArea && safeArea !== activeObject) {
                canvas.sendObjectToBack(safeArea);
            }
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const setOpacity = useCallback((value: number) => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set("opacity", value);
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const setFontFamily = useCallback((font: string) => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "textbox") {
            (activeObject as fabric.Textbox).set("fontFamily", font);
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const handleZoom = useCallback((value: number) => {
        if (!canvas) return;
        const newZoom = Math.min(Math.max(0.1, value), 5);
        setZoom(newZoom);
        canvas.setZoom(newZoom);
    }, [canvas]);

    const addSafeArea = useCallback((targetCanvas?: fabric.Canvas) => {
        const c = targetCanvas || canvas;
        if (!c) return;

        // Check if safe area already exists
        const existing = c.getObjects().find((obj: any) => (obj as any).isSafeArea);
        if (existing) return;

        const margin = 40;
        const rect = new fabric.Rect({
            left: margin,
            top: margin,
            width: c.width! - margin * 2,
            height: c.height! - margin * 2,
            fill: "transparent",
            stroke: "#FFB6C1",
            strokeDashArray: [10, 5],
            selectable: false,
            evented: false,

            isSafeArea: true,
        });
        c.add(rect);
        c.sendObjectToBack(rect);
        c.renderAll();
    }, [canvas]);

    const toggleLock = useCallback(() => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            const isLocked = !activeObject.lockMovementX;
            activeObject.set({
                lockMovementX: isLocked,
                lockMovementY: isLocked,
                lockScalingX: isLocked,
                lockScalingY: isLocked,
                lockRotation: isLocked,
                editable: !isLocked, // For Textbox
                hasControls: !isLocked,
            });
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const disposeCanvas = useCallback(() => {
        if (canvasRef.current) {
            console.log("Fabric: Disposing canvas instance");
            // Mark dead first so any in-flight async callbacks (e.g. undo/redo) bail out.
            isAlive.current = false;
            canvasRef.current.dispose();
            canvasRef.current = null;
            setCanvas(null);
        }
    }, []);

    useEffect(() => {
        if (!canvas) return;

        const handleObjectModified = () => saveHistory();

        canvas.on("selection:created", updateSelection);
        canvas.on("selection:updated", updateSelection);
        canvas.on("selection:cleared", updateSelection);
        canvas.on("object:modified", handleObjectModified);

        return () => {
            canvas.off("selection:created", updateSelection);
            canvas.off("selection:updated", updateSelection);
            canvas.off("selection:cleared", updateSelection);
            canvas.off("object:modified", handleObjectModified);
        };
    }, [canvas, updateSelection, saveHistory]);

    const loadPsdTemplate = useCallback(async (filename: string, targetCanvas?: fabric.Canvas) => {
        const activeCanvas = targetCanvas || canvas;
        if (!activeCanvas) return;

        try {
            // 1. Fetch metadata from Node.js service
            const response = await fetch(`http://localhost:5001/parse/${filename}`);
            if (!response.ok) throw new Error("Metadata fetch failed");
            const metadata = await response.json();

            // 2. Set background image from preview (use .png extension for URL)
            const previewUrl = `http://localhost:5001/preview/${filename.replace('.psd', '.png')}`;
            const img = await fabric.FabricImage.fromURL(previewUrl, {
                crossOrigin: 'anonymous'
            });

            // Adjust canvas size to match PSD - Ensure canvas element is ready
            const applyLayout = () => {
                try {
                    const hasInternalCanvas = activeCanvas && (activeCanvas as any).elements && (activeCanvas as any).elements.canvas;
                    const el = hasInternalCanvas ? (activeCanvas as any).getElement() : null;

                    if (el) {
                        activeCanvas.setDimensions({ width: metadata.width, height: metadata.height });

                        img.set({
                            scaleX: metadata.width / img.width!,
                            scaleY: metadata.height / img.height!,
                            originX: 'left',
                            originY: 'top'
                        });

                        activeCanvas.backgroundImage = img;

                        const container = el.parentElement;
                        if (container) {
                            const padding = 80;
                            const availableWidth = container.clientWidth - padding;
                            const availableHeight = container.clientHeight - padding;

                            if (availableWidth > 0 && availableHeight > 0) {
                                const scaleX = availableWidth / metadata.width;
                                const scaleY = availableHeight / metadata.height;
                                const finalScale = Math.min(scaleX, scaleY, 1);

                                activeCanvas.setZoom(finalScale);
                                setZoom(finalScale);
                            }
                        }

                        activeCanvas.requestRenderAll();
                    } else {
                        throw new Error("Canvas element not yet ready");
                    }
                } catch (e) {
                    console.warn("Canvas element not fully ready, retrying in 100ms...");
                    setTimeout(applyLayout, 100);
                }
            };
            applyLayout();

            // 3. Recreate editable layers (text for now)
            metadata.layers.forEach((layer: any) => {
                if (layer.type === 'text' && layer.text) {
                    const text = new fabric.Textbox(layer.text.value, {
                        left: layer.left,
                        top: layer.top,
                        width: layer.width,
                        fontSize: layer.text.size,
                        fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                        fill: `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${layer.text.color[3] / 255})`,
                        textAlign: layer.text.alignment,
                        psdLayerName: layer.name
                    });
                    activeCanvas.add(text);
                }
            });

            activeCanvas.renderAll();
            saveHistory();
        } catch (error) {
            console.error("Failed to load PSD template:", error);
        }
    }, [canvas, saveHistory]);

    return {
        canvas,
        setCanvas,
        initCanvas,
        addText,
        addRect,
        deleteSelected,
        selectedObject,
        undo,
        redo,
        zoom,
        handleZoom,
        addSafeArea,
        toggleLock,
        resizeCanvas,
        disposeCanvas,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        setOpacity,
        setFontFamily,
        loadPsdTemplate,
    };
};
