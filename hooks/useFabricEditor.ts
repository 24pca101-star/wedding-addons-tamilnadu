"use client";

import { useCallback, useState, useEffect } from "react";
import { Object as FabricObject } from "fabric";

// Import modular hooks
import { useCanvasLifecycle } from "./editor/useCanvasLifecycle";
import { useHistory } from "./editor/useHistory";
import { useEditorActions } from "./editor/useEditorActions";
import { useEditorStyles } from "./editor/useEditorStyles";
import { usePsdLoader } from "./editor/usePsdLoader";

export const useFabricEditor = () => {
    // 1. Canvas Lifecycle
    const {
        canvas,
        setCanvas,
        canvasRef,
        isAlive,
        initCanvas,
        disposeCanvas,
        resizeCanvas
    } = useCanvasLifecycle();

    // 2. History Management
    const {
        saveHistory,
        undo,
        redo
    } = useHistory({ canvasRef, isAlive });

    // 3. Editor Actions
    const {
        addText,
        addRect,
        deleteSelected,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward
    } = useEditorActions({ canvasRef, isAlive, saveHistory });

    // 4. Style Management
    const {
        zoom,
        handleZoom,
        setOpacity,
        setFontFamily,
        addSafeArea,
        toggleLock
    } = useEditorStyles({ canvasRef, saveHistory });

    // 5. PSD Loading
    const {
        loadPsdTemplate,
        previewUrl,
        psdMetadata
    } = usePsdLoader({ canvasRef, isAlive, handleZoom });

    // Local state for the facade
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);

    const updateSelection = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const active = c.getActiveObject();
        setSelectedObject(active || null);
    }, [canvasRef]);

    // Glue: Event Listeners
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
            delete (el as any).__fabric_canvas;
        }

        canvasRef.current.dispose();
        canvasRef.current = null;
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
}, [canvas, updateSelection, saveHistory, canvasRef]);
    }, [canvas, updateSelection, saveHistory]);

const latestLoadId = useRef(0);

const loadPsdTemplate = useCallback(async (filename: string, targetCanvas?: Canvas) => {
    const activeCanvas = targetCanvas || canvasRef.current;
    if (!activeCanvas) return;

    const loadId = ++latestLoadId.current;

    try {
        console.log(`Fabric: Loading LAYERED PSD template ${filename} (LoadID: ${loadId})`);

        const response = await fetch(`http://localhost:5199/api/Psd/split/${filename}`);
        if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);

        if (loadId !== latestLoadId.current) return;

        const metadata = await response.json();
        console.log(`Fabric: Metadata received: ${metadata.width}x${metadata.height}, layers: ${metadata.layers.length}`);

        const setupTemplate = async () => {
            if (loadId !== latestLoadId.current) return;

            const el = activeCanvas.lowerCanvasEl;
            if (!el) {
                console.warn("Fabric: Canvas element not ready, retrying...");
                if (isAlive.current) setTimeout(setupTemplate, 100);
                return;
            }

            activeCanvas.clear();
            activeCanvas.backgroundColor = 'white';

            // --- 1. Calculate Target Scale (Fit to Content) ---
            const workspace = document.getElementById('editor-workspace');
            let targetScale = 1;
            if (workspace) {
                const padding = 60; // Padding around canvas
                const availableWidth = workspace.clientWidth - padding;
                const availableHeight = workspace.clientHeight - padding;

                const scaleX = availableWidth / metadata.width;
                const scaleY = availableHeight / metadata.height;
                targetScale = Math.min(scaleX, scaleY, 1); // Scale down to fit, but don't scale up
            }

            const scaledWidth = Math.round(metadata.width * targetScale);
            const scaledHeight = Math.round(metadata.height * targetScale);

            activeCanvas.setDimensions({ width: scaledWidth, height: scaledHeight });
            handleZoom(1); // Keep zoom at 100%

            // 2. Maintain preview state but avoid stationary background ghosting
            const templatePreviewUrl = `http://localhost:5001/preview/${filename.replace('.psd', '.png')}`;
            setPreviewUrl(templatePreviewUrl);

            // 3. Load layers with scaling
            let layersProcessed = 0;
            for (const layer of metadata.layers) {
                if (loadId !== latestLoadId.current) break;
                try {
                    const scaledLeft = layer.left * targetScale;
                    const scaledTop = layer.top * targetScale;
                    const scaledLayerWidth = (layer.width || 200) * targetScale;

                    if (layer.type === 'text' && layer.text) {
                        const text = new Textbox(layer.text.value, {
                            left: scaledLeft,
                            top: scaledTop,
                            width: scaledLayerWidth,
                            fontSize: (layer.text.size || 24) * targetScale,
                            fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                            fill: layer.text.color ? `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${(layer.text.color[3] || 255) / 255})` : "#000000",
                            textAlign: layer.text.alignment || "left",
                            opacity: layer.opacity ?? 1,
                            visible: layer.visible ?? true,
                            psdLayerName: layer.name
                        });
                        activeCanvas.add(text);
                        layersProcessed++;
                    } else {
                        const imageUrl = layer.imageUrl || layer.layerUrl || layer.LayerUrl;
                        if (layer.type === 'image' && imageUrl) {
                            const imgUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:5001${imageUrl}`;
                            const layerImg = await FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' });
                            if (loadId === latestLoadId.current) {
                                layerImg.set({
                                    left: scaledLeft,
                                    top: scaledTop,
                                    scaleX: targetScale,
                                    scaleY: targetScale,
                                    opacity: layer.opacity ?? 1,
                                    visible: layer.visible ?? true,
                                    selectable: true,
                                    psdLayerName: layer.name
                                });
                                activeCanvas.add(layerImg);
                                layersProcessed++;
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Fabric: Failed to load layer', err);
                }
            }

            console.log(`Fabric: Processed ${layersProcessed} layers at ${Math.round(targetScale * 100)}% scale`);
            activeCanvas.requestRenderAll();
        };

        await setupTemplate();
    } catch (error) {
        console.error("Failed to load PSD template:", error);
    }
}, [handleZoom]);

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
