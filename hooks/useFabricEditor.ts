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
        redo
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
    } = usePsdLoader({ canvasRef, isAlive, handleZoom });

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

    // 6. Mockup Mode (Automated vs Manual)
    const [mockupMode, setMockupMode] = useState<"automated" | "manual">("automated");
    const [isPreview, setIsPreview] = useState(false);

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

    // 7. Memoize the return value to prevent context consumers from re-rendering on every editor render
    const value = useMemo(() => ({
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
        mockupMode,
        setMockupMode,
        isPreview,
        setIsPreview,
        autoLayout,
        replaceImage,
        addImage,
        addShape,
        duplicateObject
    }), [
        canvas, setCanvas, initCanvas, addText, addRect, deleteSelected, selectedObject, 
        undo, redo, zoom, handleZoom, addSafeArea, toggleLock, toggleVisibility, 
        resizeCanvas, disposeCanvas, bringToFront, sendToBack, bringForward, 
        sendBackward, setOpacity, setFontFamily, setTextSize, setTextColor, 
        setTextAlign, loadPsdTemplate, previewUrl, psdMetadata, centerObjectH, 
        centerObjectV, setBackgroundImage, mockupMode, setMockupMode, isPreview, 
        setIsPreview, autoLayout, replaceImage, addImage, addShape, duplicateObject
    ]);

    return value;
};
