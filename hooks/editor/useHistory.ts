"use client";

import { useCallback, useRef } from "react";
import { Canvas } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    isAlive: React.MutableRefObject<boolean>;
}

export const useHistory = ({ canvasRef, isAlive }: Props) => {
    const history = useRef<string[]>([]);
    const historyIndex = useRef(-1);
    const isReloadingHistory = useRef(false);

    const saveHistory = useCallback(() => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas || isReloadingHistory.current) return;

        try {
            const json = JSON.stringify(currentCanvas.toJSON());

            if (historyIndex.current < history.current.length - 1) {
                history.current = history.current.slice(0, historyIndex.current + 1);
            }

            history.current.push(json);
            historyIndex.current = history.current.length - 1;

            if (history.current.length > 50) {
                history.current.shift();
                historyIndex.current--;
            }
        } catch (err) {
            console.warn("Fabric: History save failed", err);
        }
    }, [canvasRef]);

    const undo = useCallback(async () => {
        const c = canvasRef.current;
        if (!c || historyIndex.current <= 0) return;

        isReloadingHistory.current = true;
        historyIndex.current--;
        const json = history.current[historyIndex.current];

        try {
            await c.loadFromJSON(json);
            if (!isAlive.current || !c.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            c.renderAll();
        } catch (err) {
            console.error("Fabric: Undo failed", err);
        } finally {
            isReloadingHistory.current = false;
        }
    }, [canvasRef, isAlive]);

    const redo = useCallback(async () => {
        const c = canvasRef.current;
        if (!c || historyIndex.current >= history.current.length - 1) return;

        isReloadingHistory.current = true;
        historyIndex.current++;
        const json = history.current[historyIndex.current];

        try {
            await c.loadFromJSON(json);
            if (!isAlive.current || !c.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            c.renderAll();
        } catch (err) {
            console.error("Fabric: Redo failed", err);
        } finally {
            isReloadingHistory.current = false;
        }
    }, [canvasRef, isAlive]);

    return {
        saveHistory,
        undo,
        redo,
        history,
        historyIndex,
        isReloadingHistory
    };
};
