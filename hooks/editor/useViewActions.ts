"use client";

import { useCallback, useState } from "react";
import { Canvas, Rect } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
}

export const useViewActions = ({ canvasRef }: Props) => {
    const [zoom, setZoom] = useState(1);

    const handleZoom = useCallback((value: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const newZoom = Math.min(Math.max(0.1, value), 5);
        setZoom(newZoom);
        c.setZoom(newZoom);
    }, [canvasRef]);

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

    return {
        zoom,
        handleZoom,
        addSafeArea
    };
};
