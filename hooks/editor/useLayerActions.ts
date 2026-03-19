"use client";

import { useCallback } from "react";
import { Canvas, Rect, Object as FabricObject } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    saveHistory: () => void;
}

export const useLayerActions = ({ canvasRef, saveHistory }: Props) => {
    
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
    }, [canvasRef, saveHistory]);

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
    }, [canvasRef, saveHistory]);

    const bringToFront = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.bringObjectToFront(activeObject);
            c.renderAll();
            c.fire("object:modified");
        }
    }, [canvasRef, saveHistory]);

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
            c.fire("object:modified");
        }
    }, [canvasRef, saveHistory]);

    const bringForward = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.bringObjectForward(activeObject);
            c.renderAll();
            c.fire("object:modified");
        }
    }, [canvasRef, saveHistory]);

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
            c.fire("object:modified");
        }
    }, [canvasRef, saveHistory]);

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
                // selectable: !isLocked, // Keep selectable so we can unlock it via toolbar
            });
            c.renderAll();
            c.fire("object:modified");
        }
    }, [canvasRef, saveHistory]);

    const centerObjectH = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.centerObjectH(activeObject);
            activeObject.setCoords();
            c.renderAll();
            c.fire("object:modified");
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
            c.fire("object:modified");
        }
    }, [canvasRef, saveHistory]);

    const setOpacity = useCallback((value: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            activeObject.set("opacity", value);
            c.renderAll();
            c.fire("selection:updated");
        }
    }, [canvasRef, saveHistory]);

    const toggleVisibility = useCallback((target?: FabricObject) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = target || c.getActiveObject();
        if (activeObject) {
            activeObject.set("visible", !activeObject.visible);
            c.requestRenderAll();
            c.fire("object:modified");
        }
    }, [canvasRef, saveHistory]);

    const duplicateObject = useCallback(async () => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (!activeObject) return;

        const cloned = await activeObject.clone();
        cloned.set({
            left: (activeObject.left || 0) + 20,
            top: (activeObject.top || 0) + 20,
        });
        c.add(cloned);
        c.setActiveObject(cloned);
        c.renderAll();
        c.fire("object:modified");
    }, [canvasRef, saveHistory]);

    const rotate = useCallback((angle: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            activeObject.set("angle", (activeObject.angle || 0) + angle);
            activeObject.setCoords();
            c.renderAll();
            c.fire("object:modified");
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    return {
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
        duplicateObject,
        rotate
    };
};
