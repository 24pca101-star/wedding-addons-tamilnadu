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
        psdMetadata
    };
};
