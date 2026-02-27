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

    // History State
    const history = useRef<string[]>([]);
    const historyIndex = useRef(-1);
    const isReloadingHistory = useRef(false);

    // Tracks whether the canvas instance is still alive (not disposed).
    const isAlive = useRef(false);

    const saveHistory = useCallback(() => {
        if (!canvas || isReloadingHistory.current) return;

        try {
            const json = JSON.stringify(canvas.toJSON());

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
    }, [canvas]);

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
        canvas.setZoom(newZoom);
    }, [canvas]);

    const addSafeArea = useCallback((targetCanvas?: Canvas) => {
        const c = targetCanvas || canvas;
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

    const loadPsdTemplate = useCallback(async (filename: string, targetCanvas?: Canvas) => {
        const activeCanvas = targetCanvas || canvas;
        if (!activeCanvas) return;

        try {
            console.log(`Fabric: Loading PSD template ${filename}`);
            const response = await fetch(`http://localhost:5001/parse/${filename}`);
            if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);
            const metadata = await response.json();
            console.log(`Fabric: Metadata received: ${metadata.width}x${metadata.height}, layers: ${metadata.layers.length}`);

            const previewUrl = `http://localhost:5001/preview/${filename.replace('.psd', '.png')}`;
            console.log(`Fabric: Loading preview from ${previewUrl}`);

            const img = await FabricImage.fromURL(previewUrl, {
                crossOrigin: 'anonymous'
            });
            console.log("Fabric: Preview image loaded successfully");

            const setupTemplate = async () => {
                const el = activeCanvas.lowerCanvasEl;
                if (!el) {
                    console.warn("Fabric: Canvas element not ready, retrying...");
                    if (isAlive.current) setTimeout(setupTemplate, 100);
                    return;
                }

                // activeCanvas.set({ backgroundImage: img });

                // Set initial dimensions based on metadata
                activeCanvas.setDimensions({ width: metadata.width, height: metadata.height });

                img.set({
                    scaleX: metadata.width / img.width!,
                    scaleY: metadata.height / img.height!,
                    originX: 'left',
                    originY: 'top',
                    selectable: false,
                    evented: false
                });

                let finalScale = 1;

                const container = document.getElementById("editor-workspace");
                if (container) {
                    const padding = 160;
                    const availableWidth = container.clientWidth - padding;
                    const availableHeight = container.clientHeight - padding;

                    if (availableWidth > 0 && availableHeight > 0) {
                        const scaleX = availableWidth / metadata.width;
                        const scaleY = availableHeight / metadata.height;
                        finalScale = Math.min(scaleX, scaleY, 1) * 0.9;

                        activeCanvas.setDimensions({
                            width: metadata.width * finalScale,
                            height: metadata.height * finalScale
                        });
                        activeCanvas.setZoom(finalScale);
                        setZoom(finalScale);
                    }
                }

                activeCanvas.renderAll();

                let layersProcessed = 0;

                // Process layers in order (bottom to top usually in metadata)
                for (const layer of metadata.layers) {
                    try {
                        if (layer.type === 'text' && layer.text) {
                            const text = new Textbox(layer.text.value, {
                                left: layer.left,
                                top: layer.top,
                                width: layer.width,
                                fontSize: layer.text.size || 24,
                                fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                                fill: layer.text.color ? `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${layer.text.color[3] / 255})` : "#000000",
                                textAlign: layer.text.alignment || "left",
                                opacity: layer.opacity ?? 1,
                                visible: layer.visible ?? true,
                                psdLayerName: layer.name
                            });
                            activeCanvas.add(text);
                            layersProcessed++;
                        } else if (layer.type === 'image' && layer.imageUrl) {
                            // FabricImage.fromURL is async, but we want to maintain order. 
                            // Actually, adding them as they come is fine if metadata is bottom-to-top.
                            const imgUrl = `http://localhost:5001${layer.imageUrl}`;
                            const layerImg = await FabricImage.fromURL(imgUrl, {
                                crossOrigin: 'anonymous'
                            });

                            layerImg.set({
                                left: layer.left,
                                top: layer.top,
                                opacity: layer.opacity ?? 1,
                                visible: layer.visible ?? true,
                                selectable: true, // Allow moving everything like Canva
                                psdLayerName: layer.name
                            });

                            activeCanvas.add(layerImg);
                            layersProcessed++;
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

            setupTemplate();

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
