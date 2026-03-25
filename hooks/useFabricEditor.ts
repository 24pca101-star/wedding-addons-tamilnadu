import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { Object as FabricObject, PencilBrush, Group } from "fabric";

// ... [skipping middle part for brevity in thought, but I will provide full replacement content]

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
        setTextSize,
        toggleBold,
        toggleItalic
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
        setFillColor,
        toggleVisibility,
        duplicateObject,
        rotate
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

    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [brushColor, setBrushColorState] = useState("#3B82F6"); 
    const [brushWidth, setBrushWidthState] = useState(5);
    const [isEraserMode, setIsEraserMode] = useState(false);
    
    // Use a ref for immediate brush updates to avoid React state lag during drawing
    const brushSettingsRef = useRef({ color: "#3B82F6", width: 5, isEraser: false });
    const drawingGroupRef = useRef<any>(null);

    const setBrushColor = useCallback((color: string) => {
        const c = canvasRef.current;
        brushSettingsRef.current.color = color;
        brushSettingsRef.current.isEraser = false;
        
        console.log(`Fabric: setBrushColor -> ${color}`);
        setBrushColorState(color);
        setIsEraserMode(false);

        if (c && c.isDrawingMode && c.freeDrawingBrush) {
            c.freeDrawingBrush.color = color;
            c.freeDrawingBrush.width = brushSettingsRef.current.width;
            (c.freeDrawingBrush as any).globalCompositeOperation = "source-over";
        }
    }, [canvasRef]);

    const setBrushWidth = useCallback((width: number) => {
        const c = canvasRef.current;
        brushSettingsRef.current.width = width;
        
        console.log(`Fabric: setBrushWidth -> ${width}`);
        setBrushWidthState(width);

        if (c && c.freeDrawingBrush) {
            c.freeDrawingBrush.width = brushSettingsRef.current.isEraser ? width * 3 : width;
        }
    }, [canvasRef]);

    const setEraserMode = useCallback((enabled: boolean) => {
        const c = canvasRef.current;
        brushSettingsRef.current.isEraser = enabled;
        
        console.log(`Fabric: setEraserMode -> ${enabled}`);
        setIsEraserMode(enabled);

        if (c && c.isDrawingMode && c.freeDrawingBrush) {
            if (enabled) {
                c.freeDrawingBrush.color = "rgba(0,0,0,1)";
                (c.freeDrawingBrush as any).globalCompositeOperation = "destination-out";
                c.freeDrawingBrush.width = brushSettingsRef.current.width * 3;
            } else {
                c.freeDrawingBrush.color = brushSettingsRef.current.color;
                (c.freeDrawingBrush as any).globalCompositeOperation = "source-over";
                c.freeDrawingBrush.width = brushSettingsRef.current.width;
            }
        }
    }, [canvasRef]);

    const toggleDrawingMode = useCallback((enabled?: boolean) => {
        const c = canvasRef.current;
        if (!c) return;
        const newMode = enabled !== undefined ? enabled : !c.isDrawingMode;
        
        console.log(`Fabric: toggleDrawingMode -> ${newMode}`);
        c.isDrawingMode = newMode;
        setIsDrawingMode(newMode);

        if (newMode) {
            if (!c.freeDrawingBrush) {
                c.freeDrawingBrush = new PencilBrush(c);
            }
            const { color, width, isEraser } = brushSettingsRef.current;
            c.freeDrawingBrush.width = isEraser ? width * 3 : width;
            // Use light pink during drawing for eraser, source-over so it's visible
            c.freeDrawingBrush.color = isEraser ? "rgba(255,192,203,0.5)" : color;
            (c.freeDrawingBrush as any).globalCompositeOperation = "source-over";
            
            c.discardActiveObject();
            c.requestRenderAll();
        }
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
        
        // Segregate drawing paths into a dedicated group
        const onPathCreated = (e: any) => {
            const path = e.path;
            if (!path) return;

            // Ensure we have a drawing group
            if (!drawingGroupRef.current) {
                // Try to find existing group (e.g. after undo/load)
                drawingGroupRef.current = c.getObjects().find((obj: any) => obj.isDrawingGroup);
                
                if (!drawingGroupRef.current) {
                    const group = new Group([], {
                        selectable: false,
                        evented: false,
                        objectCaching: true,
                    });
                    (group as any).isDrawingGroup = true;
                    c.add(group);
                    drawingGroupRef.current = group;
                }
            }

            if (brushSettingsRef.current.isEraser) {
                path.set({
                    globalCompositeOperation: "destination-out",
                    stroke: "rgba(0,0,0,1)",
                });
            }

            c.remove(path);
            drawingGroupRef.current.add(path);
            drawingGroupRef.current.set("dirty", true);
            c.renderAll();
            handleHistorySave();
        };

        c.on("object:added", (e: any) => {
            // Skip paths as they are handled by path:created to avoid duplication
            if (e.target.type !== "path") {
                handleHistorySave();
            }
        });
        
        c.on("object:removed", handleHistorySave);
        c.on("path:created" as any, onPathCreated);

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
            c.off("path:created" as any, onPathCreated);
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
        duplicateObject,
        rotate,
        toggleBold,
        toggleItalic,
        isDrawingMode,
        toggleDrawingMode,
        setFillColor,
        brushColor,
        brushWidth,
        isEraserMode,
        setBrushColor,
        setBrushWidth,
        setEraserMode
    }), [
        canvas, setCanvas, initCanvas, addText, addRect, deleteSelected, selectedObject, selectionVersion, saveHistory,
        undo, redo, canUndo, canRedo, pauseHistory, resumeHistory, zoom, handleZoom, addSafeArea, toggleLock, toggleVisibility, 
        resizeCanvas, disposeCanvas, bringToFront, sendToBack, bringForward, 
        sendBackward, setOpacity, setFontFamily, setTextSize, setTextColor, 
        setTextAlign, loadPsdTemplate, previewUrl, psdMetadata, centerObjectH, 
        centerObjectV, setBackgroundImage, replaceImage, addImage, addShape, duplicateObject, rotate, toggleBold, toggleItalic,
        isDrawingMode, toggleDrawingMode, setFillColor,
        brushColor, brushWidth, isEraserMode, setBrushColor, setBrushWidth, setEraserMode
    ]);

    return value;
};
