"use client";

import { useCallback, useState } from "react";
import { Canvas, Textbox, Rect, Object as FabricObject } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    saveHistory: () => void;
}

export const useEditorStyles = ({ canvasRef, saveHistory }: Props) => {
    const [zoom, setZoom] = useState(1);

    const handleZoom = useCallback((value: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const newZoom = Math.min(Math.max(0.1, value), 5);
        setZoom(newZoom);
        c.setZoom(newZoom);
    }, [canvasRef]);

    const setOpacity = useCallback((value: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            activeObject.set("opacity", value);
            c.renderAll();
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    const setFontFamily = useCallback((font: string) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject instanceof Textbox) {
            activeObject.set("fontFamily", font);
            c.renderAll();
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

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
    }, [canvasRef]);

    const toggleLock = useCallback((target?: FabricObject) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = target || c.getActiveObject();
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
                selectable: !isLocked, // Also toggle selectability
            });
            c.renderAll();
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    const centerObjectH = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.centerObjectH(activeObject);
            activeObject.setCoords(); // Required to update the bounding box and controls
            c.renderAll();
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    const centerObjectV = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.centerObjectV(activeObject);
            activeObject.setCoords();
            c.renderAll();
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    return {
        zoom,
        handleZoom,
        setOpacity,
        setFontFamily,
        addSafeArea,
        toggleLock,
        centerObjectH,
        centerObjectV
    };
};
