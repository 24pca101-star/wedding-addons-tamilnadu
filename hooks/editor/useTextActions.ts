"use client";

import { useCallback } from "react";
import { Canvas, Textbox } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    isAlive: React.MutableRefObject<boolean>;
    saveHistory: () => void;
}

export const useTextActions = ({ canvasRef, isAlive, saveHistory }: Props) => {
    
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

    const setTextColor = useCallback((color: string) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject instanceof Textbox) {
            activeObject.set("fill", color);
            c.renderAll();
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    const setTextAlign = useCallback((align: 'left' | 'center' | 'right') => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject instanceof Textbox) {
            activeObject.set("textAlign", align);
            c.renderAll();
            saveHistory();
        }
    }, [canvasRef, saveHistory]);

    const setTextSize = useCallback((value: number | string) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject instanceof Textbox) {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue > 0) {
                activeObject.set("fontSize", numValue);
                activeObject.setCoords();
                c.requestRenderAll();
                saveHistory();
            }
        }
    }, [canvasRef, saveHistory]);

    return {
        addText,
        setFontFamily,
        setTextColor,
        setTextAlign,
        setTextSize
    };
};
