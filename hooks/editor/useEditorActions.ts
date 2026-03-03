"use client";

import { useCallback } from "react";
import { Canvas, Textbox, Rect, Object as FabricObject } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    isAlive: React.MutableRefObject<boolean>;
    saveHistory: () => void;
}

export const useEditorActions = ({ canvasRef, isAlive, saveHistory }: Props) => {

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
    }, [canvasRef, isAlive, saveHistory]);

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
            saveHistory();
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
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    const bringForward = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            c.bringObjectForward(activeObject);
            c.renderAll();
            saveHistory();
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
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    return {
        addText,
        addRect,
        deleteSelected,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward
    };
};
