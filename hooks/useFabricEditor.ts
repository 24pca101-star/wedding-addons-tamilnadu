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
        toggleLock,
        centerObjectH,
        centerObjectV
    } = useEditorStyles({ canvasRef, saveHistory });

    // 5. PSD Loading
    const {
        loadPsdTemplate,
        previewUrl,
        psdMetadata
    } = usePsdLoader({ canvasRef, isAlive, handleZoom });

    // 6. Mockup Mode (Automated vs Manual)
    const [mockupMode, setMockupMode] = useState<"automated" | "manual">("automated");

    // Local state for the facade
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);

    const autoLayout = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const objects = c.getObjects("image");
        if (objects.length === 0) return;

        const img = objects[objects.length - 1] as any;
        const targetSize = Math.min(c.width! * 0.8, c.height! * 0.8);
        const scale = Math.min(targetSize / img.width!, targetSize / img.height!);

        img.set({
            scaleX: scale,
            scaleY: scale,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            hasControls: false
        });

        c.centerObject(img);
        c.discardActiveObject();
        c.requestRenderAll();
        c.fire("object:modified");
    }, [canvasRef]);

    const updateSelection = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const active = c.getActiveObject();
        setSelectedObject(active || null);
    }, [canvasRef]);

    // Glue: Event Listeners
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
        psdMetadata,
        centerObjectH,
        centerObjectV,
        mockupMode,
        setMockupMode,
        autoLayout
    };
};
