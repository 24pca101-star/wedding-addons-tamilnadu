"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import {
    Canvas,
    Object as FabricObject,
    Textbox,
    Rect,
    Circle,
    Triangle,
    Polygon,
    Shadow,
    FabricImage
} from "fabric";

export const useFabricEditor = () => {
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
    const [zoom, setZoom] = useState(1);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [psdMetadata, setPsdMetadata] = useState<any>(null);

    // History State
    const history = useRef<string[]>([]);
    const historyIndex = useRef(-1);
    const isReloadingHistory = useRef(false);

    // Tracks whether the canvas instance is still alive (not disposed).
    const isAlive = useRef(false);

    const saveHistory = useCallback(() => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas || isReloadingHistory.current) return;

        try {
            const json = JSON.stringify(currentCanvas.toJSON());

            if (historyIndex.current < history.current.length - 1) {
                history.current = history.current.slice(0, historyIndex.current + 1);
            }

            history.current.push(json);
            historyIndex.current = history.current.length - 1;

            if (history.current.length > 50) {
                history.current.shift();
                historyIndex.current--;
            }
        } catch (err) {
            console.warn("Fabric: History save failed", err);
        }
    }, []);

    const undo = useCallback(() => {
        if (!canvas || historyIndex.current <= 0) return;

        isReloadingHistory.current = true;
        historyIndex.current--;
        const json = history.current[historyIndex.current];

        canvas.loadFromJSON(json).then(() => {
            if (!isAlive.current || !canvas.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            canvas.renderAll();
            isReloadingHistory.current = false;
        }).catch(err => {
            console.error("Fabric: Undo failed", err);
            isReloadingHistory.current = false;
        });
    }, [canvas]);

    const redo = useCallback(() => {
        if (!canvas || historyIndex.current >= history.current.length - 1) return;

        isReloadingHistory.current = true;
        historyIndex.current++;
        const json = history.current[historyIndex.current];

        canvas.loadFromJSON(json).then(() => {
            if (!isAlive.current || !canvas.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            canvas.renderAll();
            isReloadingHistory.current = false;
        }).catch(err => {
            console.error("Fabric: Redo failed", err);
            isReloadingHistory.current = false;
        });
    }, [canvas]);

    const resizeCanvas = useCallback((width: number, height: number) => {
        if (!canvas || !canvas.lowerCanvasEl) return;
        canvas.setDimensions({ width, height });
        canvas.renderAll();
    }, [canvas]);

    const initCanvas = useCallback((el: HTMLCanvasElement, options: any) => {
        if (canvasRef.current) return canvasRef.current;

        // @ts-expect-error - Custom property
        if (el.__fabric_canvas) {
            // @ts-expect-error - Custom property
            const existing = el.__fabric_canvas;
            canvasRef.current = existing;
            setCanvas(existing);
            return existing;
        }

        try {
            console.log("Fabric: Initializing Canvas v7");
            const c = new Canvas(el, {
                ...options,
                preserveObjectStacking: true,
            });

            // @ts-expect-error - Custom property
            el.__fabric_canvas = c;

            const initialJson = JSON.stringify(c.toJSON());
            history.current = [initialJson];
            historyIndex.current = 0;

            isAlive.current = true;
            canvasRef.current = c;
            setCanvas(c);
            return c;
        } catch (err) {
            console.error("Fabric: Canvas init failed", err);
            return null;
        }
    }, []);

    const addText = useCallback((text: string = "Type here...") => {
        if (!canvas || !isAlive.current) return;

        const textbox = new Textbox(text, {
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

        canvas.add(textbox);
        canvas.setActiveObject(textbox);

        const el = canvas.lowerCanvasEl;
        if (el) el.focus();

        setTimeout(() => {
            if (textbox.canvas && isAlive.current) {
                textbox.enterEditing();
                textbox.selectAll();
                textbox.canvas.requestRenderAll();
            }
        }, 100);

        canvas.requestRenderAll();
        saveHistory();
    }, [canvas, saveHistory]);

    const addRect = useCallback(() => {
        if (!canvas) return;
        const rect = new Rect({
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
        if (activeObject instanceof Textbox) {
            activeObject.set("fontFamily", font);
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const handleZoom = useCallback((value: number) => {
        if (!canvas) return;
        const newZoom = Math.min(Math.max(0.1, value), 5);
        setZoom(newZoom);
    }, [canvas]);

    const addSafeArea = useCallback((targetCanvas?: Canvas) => {
        const c = targetCanvas || canvasRef.current;
        if (!c || !c.lowerCanvasEl) return;

        const existing = c.getObjects().find((obj: any) => (obj as any).isSafeArea);
        if (existing) return;

        const margin = 40;
        const rect = new Rect({
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
    }, []);

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
                editable: !isLocked,
                hasControls: !isLocked,
            });
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const disposeCanvas = useCallback(() => {
        if (canvasRef.current) {
            console.log("Fabric: Disposing canvas");
            isAlive.current = false;

            // Clean up the DOM element reference so we don't reuse a destroyed canvas
            const el = canvasRef.current.lowerCanvasEl;
            if (el) {
                // @ts-expect-error Custom property
                delete el.__fabric_canvas;
            }

            canvasRef.current.dispose();
            canvasRef.current = null;
            // Intentionally not calling setCanvas(null) to avoid React dependency loop
        }
    }, []);

    useEffect(() => {
        // Load fonts from the PSD service
        const loadPsdFonts = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/psd/fonts");
                if (!response.ok) return;
                const data = await response.json();
                if (data.css) {
                    let styleTag = document.getElementById("psd-fonts-style");
                    if (!styleTag) {
                        styleTag = document.createElement("style");
                        styleTag.id = "psd-fonts-style";
                        document.head.appendChild(styleTag);
                    }
                    styleTag.innerHTML = data.css;
                    console.log("Fabric: PSD Fonts loaded dynamically");
                }
            } catch (err) {
                console.warn("Fabric: Could not load extra PSD fonts", err);
            }
        };
        loadPsdFonts();
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

    // Track loading to prevent race conditions
    const latestLoadId = useRef(0);

    const loadPsdTemplate = useCallback(async (filename: string, targetCanvas?: Canvas) => {
        const activeCanvas = targetCanvas || canvasRef.current;
        if (!activeCanvas) return;

        const loadId = ++latestLoadId.current;

        try {
            console.log(`Fabric: Loading LAYERED PSD template ${filename} (LoadID: ${loadId})`);

            // Fetch from .NET service split endpoint
            const response = await fetch(`http://localhost:5199/api/Psd/split/${filename}`);
            if (!response.ok) throw new Error(`Metadata split fetch failed: ${response.status}`);

            // If another load started, abort this one
            if (loadId !== latestLoadId.current) return;

            const metadata = await response.json();
            console.log(`Fabric: Metadata received: ${metadata.width}x${metadata.height}, layers: ${metadata.layers.length}`);

            const setupTemplate = async () => {
                // If another load started, abort
                if (loadId !== latestLoadId.current) return;

                const el = activeCanvas.lowerCanvasEl;
                if (!el) {
                    console.warn("Fabric: Canvas element not ready, retrying...");
                    if (isAlive.current) setTimeout(setupTemplate, 100);
                    return;
                }

                // IMPORTANT: Clear the canvas before loading a new template
                activeCanvas.clear();

                // Try to determine a CSS zoom scale so it fits the workspace on load.
                // The canvas internal dimensions will remain exactly 1:1 with the PSD.
                const container = document.getElementById("editor-workspace");
                let availableWidth = container ? container.clientWidth - 100 : 1200;
                let availableHeight = container ? container.clientHeight - 100 : 800;

                const scaleX = availableWidth / metadata.width;
                const scaleY = availableHeight / metadata.height;
                // Use a more generous fit scale
                const finalScale = Math.min(scaleX, scaleY, 1) * 0.95;
                setZoom(finalScale);

                activeCanvas.setDimensions({
                    width: metadata.width,
                    height: metadata.height
                });

                setPsdMetadata({
                    ...metadata,
                    width: metadata.width,
                    height: metadata.height
                });

                // Iterate layers to add interactive overlays (both images and text)
                console.log(`Fabric: Reconstructing ${metadata.layers?.length || 0} layers...`);

                let layersAdded = 0;
                for (const layer of (metadata.layers || [])) {
                    if (loadId !== latestLoadId.current) break;
                    if (!layer.visible) continue;

                    try {
                        if (layer.type === 'text' && layer.text) {
                            const text = new Textbox(layer.text.value, {
                                left: layer.left,
                                top: layer.top,
                                width: layer.width > 0 ? layer.width : 200,
                                fontSize: layer.text.size || 40,
                                fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                                fill: layer.text.color ? `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${(layer.text.color[3] ?? 255) / 255})` : "#000000",
                                textAlign: layer.text.alignment || 'left',
                                opacity: (layer.opacity ?? 255) / 255,
                                selectable: true,
                                evented: true,
                                editable: true,
                                isPsdLayer: true,
                                psdLayerName: layer.name
                            } as any);
                            activeCanvas.add(text);
                            layersAdded++;
                        } else if (layer.type === 'image' && layer.layerUrl) {
                            // Load individual image layer
                            const img = await FabricImage.fromURL(layer.layerUrl, { crossOrigin: 'anonymous' });
                            if (loadId !== latestLoadId.current) break;
                            img.set({
                                originX: 'left',
                                originY: 'top',
                                left: layer.left,
                                top: layer.top,
                                opacity: (layer.opacity ?? 255) / 255,
                                selectable: true,
                                evented: true,
                                isPsdLayer: true,
                                psdLayerName: layer.name
                            } as any);
                            activeCanvas.add(img);
                            layersAdded++;
                        }
                    } catch (err) {
                        console.error(`Fabric: Failed to add layer ${layer.name}`, err);
                    }
                }

                console.log(`Fabric: Successfully added ${layersAdded} layers to canvas`);
                activeCanvas.requestRenderAll();
                setTimeout(() => {
                    saveHistory();
                    console.log("Fabric: PSD template setup complete");
                }, 200);
            };

            setupTemplate();

        } catch (error) {
            console.error("Failed to load PSD template:", error);
        }
    }, [saveHistory]);

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
        previewUrl,
        psdMetadata
    };
};
