"use client";

import { useCallback } from "react";
import { Canvas, Rect, Circle, Triangle, Polygon, Shadow } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    saveHistory: () => void;
}

export const useShapeActions = ({ canvasRef, saveHistory }: Props) => {
    
    const addShape = useCallback((type: string, options: any = {}) => {
        const c = canvasRef.current;
        if (!c) return;

        // Disable drawing mode when adding shapes
        if (c.isDrawingMode) {
            c.isDrawingMode = false;
        }

        let shape: any;
        const color = options.fill || options.color || "#FF5ACD";
        
        const baseOptions = {
            left: 100,
            top: 100,
            fill: color,
            width: options.width || 100,
            height: options.height || 100,
            originX: "center" as const,
            originY: "center" as const,
            ...options
        };

        switch (type) {
            case "rect":
                shape = new Rect(baseOptions);
                break;
            case "circle":
                shape = new Circle({
                    ...baseOptions,
                    radius: options.radius || (baseOptions.width / 2),
                });
                break;
            case "triangle":
                shape = new Triangle(baseOptions);
                break;
            case "line":
                shape = new Rect({
                    ...baseOptions,
                    width: 200,
                    height: 4,
                });
                break;
            case "hexagon":
                shape = new Polygon([
                    { x: 50, y: 0 }, { x: 100, y: 25 }, { x: 100, y: 75 },
                    { x: 50, y: 100 }, { x: 0, y: 75 }, { x: 0, y: 25 }
                ], baseOptions);
                break;
            case "star":
                shape = new Polygon([
                    { x: 50, y: 0 }, { x: 63, y: 38 }, { x: 100, y: 38 },
                    { x: 69, y: 59 }, { x: 82, y: 100 }, { x: 50, y: 75 },
                    { x: 18, y: 100 }, { x: 31, y: 59 }, { x: 0, y: 38 }, { x: 37, y: 38 }
                ], baseOptions);
                break;
            case "diamond":
                shape = new Polygon([
                    { x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }
                ], baseOptions);
                break;
            case "floral":
                shape = new Circle({
                    ...baseOptions,
                    radius: 40,
                    stroke: "#FFFFFF",
                    strokeWidth: 5,
                    shadow: new Shadow({
                        color: "rgba(0,0,0,0.1)",
                        blur: 10,
                        offsetX: 5,
                        offsetY: 5
                    })
                });
                break;
            default:
                shape = new Rect({
                    ...baseOptions,
                    rx: 10,
                    ry: 10
                });
        }

        c.add(shape);
        c.centerObject(shape);
        c.setActiveObject(shape);
        c.requestRenderAll();
        c.fire("object:modified");
        saveHistory();
    }, [canvasRef, saveHistory]);

    return {
        addShape
    };
};
