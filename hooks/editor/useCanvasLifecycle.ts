"use client";

import { useCallback, useState, useRef } from "react";
import { Canvas } from "fabric";

export const useCanvasLifecycle = () => {
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const isAlive = useRef(false);

    const initCanvas = useCallback((el: HTMLCanvasElement, options: any) => {
        if (canvasRef.current) return canvasRef.current;

        if ((el as any).__fabric_canvas) {
            const existing = (el as any).__fabric_canvas;
            canvasRef.current = existing;
            setCanvas(existing);
            return existing;
        }

        try {
            console.log("Fabric: Initializing Canvas v7");
            const c = new Canvas(el, {
                ...options,
                preserveObjectStacking: true,
            });

            (el as any).__fabric_canvas = c;
            isAlive.current = true;
            canvasRef.current = c;
            setCanvas(c);
            return c;
        } catch (err) {
            console.error("Fabric: Canvas init failed", err);
            return null;
        }
    }, []);

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
            setCanvas(null);
        }
    }, []);

    const resizeCanvas = useCallback((width: number, height: number) => {
        const c = canvasRef.current;
        if (!c || !c.lowerCanvasEl) return;
        c.setDimensions({ width, height });
        c.renderAll();
    }, []);

    return {
        canvas,
        setCanvas,
        canvasRef,
        isAlive,
        initCanvas,
        disposeCanvas,
        resizeCanvas
    };
};
