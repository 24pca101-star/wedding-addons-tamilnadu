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
        const c = canvasRef.current;
        if (!c || historyIndex.current <= 0) return;

        isReloadingHistory.current = true;
        historyIndex.current--;
        const json = history.current[historyIndex.current];

        c.loadFromJSON(json).then(() => {
            if (!isAlive.current || !c.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            c.renderAll();
            isReloadingHistory.current = false;
        }).catch(err => {
            console.error("Fabric: Undo failed", err);
            isReloadingHistory.current = false;
        });
    }, []);

    const redo = useCallback(() => {
        const c = canvasRef.current;
        if (!c || historyIndex.current >= history.current.length - 1) return;

        isReloadingHistory.current = true;
        historyIndex.current++;
        const json = history.current[historyIndex.current];

        c.loadFromJSON(json).then(() => {
            if (!isAlive.current || !c.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            c.renderAll();
            isReloadingHistory.current = false;
        }).catch(err => {
            console.error("Fabric: Redo failed", err);
            isReloadingHistory.current = false;
        });
    }, []);

    const resizeCanvas = useCallback((width: number, height: number) => {
        const c = canvasRef.current;
        if (!c || !c.lowerCanvasEl) return;
        c.setDimensions({ width, height });
        c.renderAll();
    }, []);

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
        const c = canvasRef.current;
        if (!c || !isAlive.current) return;

        const textbox = new Textbox(text, {
            left: c.width! / 2,
            top: c.height! / 2,
            width: 250,
            fontSize: 40,
            fontFamily: "Inter, Arial, sans-serif",
            fill: "#000000",
            textAlign: "center",
            originX: "center",
            originY: "center",
        });

        c.add(textbox);
        c.setActiveObject(textbox);

        const el = c.lowerCanvasEl;
        if (el) el.focus();

        setTimeout(() => {
            if (textbox.canvas && isAlive.current) {
                textbox.enterEditing();
                textbox.selectAll();
                textbox.canvas.requestRenderAll();
            }
        }, 100);

        c.requestRenderAll();
        saveHistory();
    }, [saveHistory]);

    const addRect = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const rect = new Rect({
            left: c.width! / 2,
            top: c.height! / 2,
            fill: "#FF5ACD",
            width: 150,
            height: 150,
            originX: "center",
            originY: "center",
        });
        c.add(rect);
        c.setActiveObject(rect);
        c.renderAll();
        saveHistory();
    }, [saveHistory]);

    const deleteSelected = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObjects = c.getActiveObjects();
        if (activeObjects.length > 0) {
            c.remove(...activeObjects);
            c.discardActiveObject();
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const updateSelection = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const active = c.getActiveObject();
        setSelectedObject(active || null);
    }, []);

    const bringToFront = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.bringObjectToFront(activeObject);
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const sendToBack = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.sendObjectToBack(activeObject);
            const safeArea = c.getObjects().find((obj: any) => (obj as any).isSafeArea);
            if (safeArea && safeArea !== activeObject) {
                c.sendObjectToBack(safeArea);
            }
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const bringForward = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.bringObjectForward(activeObject);
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const sendBackward = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.sendObjectBackwards(activeObject);
            const safeArea = c.getObjects().find((obj: any) => (obj as any).isSafeArea);
            if (safeArea && safeArea !== activeObject) {
                c.sendObjectToBack(safeArea);
            }
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const setOpacity = useCallback((value: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            activeObject.set("opacity", value);
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const setFontFamily = useCallback((font: string) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject instanceof Textbox) {
            activeObject.set("fontFamily", font);
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const handleZoom = useCallback((value: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const newZoom = Math.min(Math.max(0.1, value), 5);
        setZoom(newZoom);
        c.setZoom(newZoom);
    }, []);

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
            // @ts-expect-error - Custom property
            isSafeArea: true,
        });
        c.add(rect);
        c.sendObjectToBack(rect);
        c.renderAll();
    }, []);

    const toggleLock = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            const isLocked = !activeObject.lockMovementX;
            activeObject.set({
                lockMovementX: isLocked,
                lockMovementY: isLocked,
                lockScalingX: isLocked,
                lockScalingY: isLocked,
                lockRotation: isLocked,
                // @ts-expect-error - Textbox only
                editable: !isLocked,
                hasControls: !isLocked,
            });
            c.renderAll();
            saveHistory();
        }
    }, [saveHistory]);

    const disposeCanvas = useCallback(() => {
        if (canvasRef.current) {
            console.log("Fabric: Disposing canvas");
            isAlive.current = false;

            const el = canvasRef.current.lowerCanvasEl;
            if (el) {
                // @ts-expect-error Custom property
                delete el.__fabric_canvas;
            }

            canvasRef.current.dispose();
            canvasRef.current = null;
            setCanvas(null);
        }
    }, []);

    useEffect(() => {
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
        const c = canvasRef.current;
        if (!c) return;

        const handleObjectModified = () => saveHistory();

        c.on("selection:created", updateSelection);
        c.on("selection:updated", updateSelection);
        c.on("selection:cleared", updateSelection);
        c.on("object:modified", handleObjectModified);

        return () => {
            c.off("selection:created", updateSelection);
            c.off("selection:updated", updateSelection);
            c.off("selection:cleared", updateSelection);
            c.off("object:modified", handleObjectModified);
        };
    }, [canvas, updateSelection, saveHistory]);

    const latestLoadId = useRef(0);

    const loadPsdTemplate = useCallback(async (filename: string, targetCanvas?: Canvas) => {
        const activeCanvas = targetCanvas || canvasRef.current;
        if (!activeCanvas) return;

        const loadId = ++latestLoadId.current;

        try {
            console.log(`Fabric: Loading LAYERED PSD template ${filename} (LoadID: ${loadId})`);

            const response = await fetch(`http://localhost:5001/parse/${filename}`);
            if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);

            if (loadId !== latestLoadId.current) return;

            const metadata = await response.json();
            console.log(`Fabric: Metadata received: ${metadata.width}x${metadata.height}, layers: ${metadata.layers.length}`);

            setPsdMetadata(metadata);

            const setupTemplate = async () => {
                if (loadId !== latestLoadId.current) return;

                const el = activeCanvas.lowerCanvasEl;
                if (!el) {
                    console.warn("Fabric: Canvas element not ready, retrying...");
                    if (isAlive.current) setTimeout(setupTemplate, 100);
                    return;
                }

                activeCanvas.clear();

                // 1. Load Background/Clean Preview first if available
                const previewUrl = `http://localhost:5001/preview/${filename.replace('.psd', '.png')}`;
                try {
                    const bgImg = await FabricImage.fromURL(previewUrl, { crossOrigin: 'anonymous' });
                    if (loadId === latestLoadId.current) {
                        bgImg.set({
                            left: 0,
                            top: 0,
                            scaleX: metadata.width / bgImg.width!,
                            scaleY: metadata.height / bgImg.height!,
                            selectable: false,
                            evented: false,
                            // @ts-expect-error - Custom property
                            isPsdBackground: true
                        });
                        activeCanvas.backgroundImage = bgImg;
                    }
                } catch (err) {
                    console.warn("Fabric: Failed to load background", err);
                }

                // 2. Load layers
                let layersProcessed = 0;
                for (const layer of metadata.layers) {
                    if (loadId !== latestLoadId.current) break;
                    try {
                        if (layer.type === 'text' && layer.text) {
                            const text = new Textbox(layer.text.value, {
                                left: layer.left,
                                top: layer.top,
                                width: layer.width || 200,
                                fontSize: layer.text.size || 24,
                                fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                                fill: layer.text.color ? `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${(layer.text.color[3] || 255) / 255})` : "#000000",
                                textAlign: layer.text.alignment || "left",
                                opacity: layer.opacity ?? 1,
                                visible: layer.visible ?? true,
                                // @ts-expect-error - Custom property
                                psdLayerName: layer.name
                            });
                            activeCanvas.add(text);
                            layersProcessed++;
                        } else if (layer.type === 'image' && layer.imageUrl) {
                            const imgUrl = `http://localhost:5001${layer.imageUrl}`;
                            const layerImg = await FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' });
                            if (loadId === latestLoadId.current) {
                                layerImg.set({
                                    left: layer.left,
                                    top: layer.top,
                                    opacity: layer.opacity ?? 1,
                                    visible: layer.visible ?? true,
                                    selectable: true,
                                    // @ts-expect-error - Custom property
                                    psdLayerName: layer.name
                                });
                                activeCanvas.add(layerImg);
                                layersProcessed++;
                            }
                        }
                    } catch (err) {
                        console.error(`Fabric: Failed to process layer ${layer.name}`, err);
                    }
                }

                console.log(`Fabric: Processed ${layersProcessed} layers`);
                activeCanvas.requestRenderAll();

                setTimeout(() => {
                    saveHistory();
                    console.log("Fabric: PSD template setup complete");
                }, 500);
            };

            await setupTemplate();

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
