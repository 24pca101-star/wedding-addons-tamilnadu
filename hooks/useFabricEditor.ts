import { useCallback, useState, useEffect, useMemo } from "react";
import { Object as FabricObject } from "fabric";

// Import granular feature hooks
import { useCanvasLifecycle } from "./editor/useCanvasLifecycle";
import { useHistory } from "./editor/useHistory";
import { usePsdLoader } from "./editor/usePsdLoader";
import { useTextActions } from "./editor/useTextActions";
import { useImageActions } from "./editor/useImageActions";
import { useLayerActions } from "./editor/useLayerActions";
import { useViewActions } from "./editor/useViewActions";
import { useShapeActions } from "./editor/useShapeActions";

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
        redo,
        canUndo,
        canRedo,
        pauseHistory,
        resumeHistory
    } = useHistory({ canvasRef, isAlive });

    // 3. View Actions (Moved up to provide stable handleZoom)
    const {
        zoom,
        handleZoom,
        addSafeArea
    } = useViewActions({ canvasRef });

    // 4. PSD Loading
    const {
        loadPsdTemplate,
        previewUrl,
        psdMetadata
    } = usePsdLoader({ canvasRef, isAlive, handleZoom, saveHistory, pauseHistory, resumeHistory });

    // 5. Feature Actions (Granular)
    const {
        addText,
        setFontFamily,
        setTextColor,
        setTextAlign,
        setTextSize
    } = useTextActions({ canvasRef, isAlive, saveHistory });

    const {
        replaceImage,
        setBackgroundImage,
        addImage
    } = useImageActions({ canvasRef, saveHistory });

    const {
        addRect,
        deleteSelected,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        toggleLock,
        centerObjectH,
        centerObjectV,
        setOpacity,
        toggleVisibility,
        duplicateObject
    } = useLayerActions({ canvasRef, saveHistory });

    const {
        addShape
    } = useShapeActions({ canvasRef, saveHistory });

    // Local state for the facade
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
    const [selectionVersion, setSelectionVersion] = useState(0);

    const updateSelection = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const active = c.getActiveObject();
        setSelectedObject(active || null);
        setSelectionVersion(v => v + 1);
    }, [canvasRef]);

    // Glue: Event Listeners
    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;

        const handleHistorySave = () => saveHistory();

        c.on("selection:created", updateSelection);
        c.on("selection:updated", updateSelection);
        c.on("selection:cleared", updateSelection);
        c.on("object:modified", (e) => {
            handleHistorySave();
            updateSelection();
        });
        c.on("object:scaling", updateSelection);
        c.on("object:moving", updateSelection);
        c.on("object:rotating", updateSelection);
        c.on("object:added", handleHistorySave);
        c.on("object:removed", handleHistorySave);

        return () => {
            c.off("selection:created", updateSelection);
            c.off("selection:updated", updateSelection);
            c.off("selection:cleared", updateSelection);
            c.off("object:modified", handleHistorySave);
            c.off("object:scaling", updateSelection);
            c.off("object:moving", updateSelection);
            c.off("object:rotating", updateSelection);
            c.off("object:added", handleHistorySave);
            c.off("object:removed", handleHistorySave);
        };
    }, [canvas, updateSelection, saveHistory, canvasRef]);

    // 7. Memoize the return value to prevent context consumers from re-rendering on every editor render
    const value = useMemo(() => ({
        canvas,
        setCanvas,
        initCanvas,
        addText,
        addRect,
        deleteSelected,
        selectedObject,
        selectionVersion,
        saveHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        pauseHistory,
        resumeHistory,
        zoom,
        handleZoom,
        addSafeArea,
        toggleLock,
        toggleVisibility,
        resizeCanvas,
        disposeCanvas,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        setOpacity,
        setFontFamily,
        setTextSize,
        setTextColor,
        setTextAlign,
        loadPsdTemplate,
        previewUrl,
        psdMetadata,
        centerObjectH,
        centerObjectV,
        setBackgroundImage,
        replaceImage,
        addImage,
        addShape,
        duplicateObject
    }), [
        canvas, setCanvas, initCanvas, addText, addRect, deleteSelected, selectedObject, selectionVersion, saveHistory,
        undo, redo, canUndo, canRedo, pauseHistory, resumeHistory, zoom, handleZoom, addSafeArea, toggleLock, toggleVisibility, 
        resizeCanvas, disposeCanvas, bringToFront, sendToBack, bringForward, 
        sendBackward, setOpacity, setFontFamily, setTextSize, setTextColor, 
        setTextAlign, loadPsdTemplate, previewUrl, psdMetadata, centerObjectH, 
        centerObjectV, setBackgroundImage, replaceImage, addImage, addShape, duplicateObject
    ]);

    return value;
};
