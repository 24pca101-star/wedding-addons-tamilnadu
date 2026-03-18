"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    isAlive: React.MutableRefObject<boolean>;
}

export const useHistory = ({ canvasRef, isAlive }: Props) => {
    const history = useRef<string[]>([]);
    const historyIndex = useRef(-1);
    const isReloadingHistory = useRef(false);
    const [historyVersion, setHistoryVersion] = useState(0);

    const saveHistory = useCallback(() => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas || isReloadingHistory.current) return;

        try {
            const json = JSON.stringify(currentCanvas.toJSON());
            
            // Deduplicate: Don't save if state is same as last
            if (history.current.length > 0 && history.current[historyIndex.current] === json) {
                return;
            }

            if (historyIndex.current < history.current.length - 1) {
                history.current = history.current.slice(0, historyIndex.current + 1);
            }

            history.current.push(json);
            historyIndex.current = history.current.length - 1;

            if (history.current.length > 50) {
                history.current.shift();
                historyIndex.current--;
            }
            setHistoryVersion((v: number) => v + 1);
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
            const state = JSON.parse(json);
            await c.loadFromJSON(state);
            if (!isAlive.current || !c.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            c.renderAll();
            c.fire("selection:updated");
            setHistoryVersion((v: number) => v + 1);
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
            const state = JSON.parse(json);
            await c.loadFromJSON(state);
            if (!isAlive.current || !c.lowerCanvasEl) {
                isReloadingHistory.current = false;
                return;
            }
            c.renderAll();
            c.fire("selection:updated");
            setHistoryVersion((v: number) => v + 1);
        } catch (err) {
            console.error("Fabric: Redo failed", err);
        } finally {
            isReloadingHistory.current = false;
        }
    }, [canvasRef, isAlive]);

    const pauseHistory = useCallback(() => {
        isReloadingHistory.current = true;
    }, []);

    const resumeHistory = useCallback(() => {
        isReloadingHistory.current = false;
    }, []);

    return {
        saveHistory,
        undo,
        redo,
        canUndo: historyIndex.current > 0,
        canRedo: historyIndex.current < history.current.length - 1,
        pauseHistory,
        resumeHistory,
        history,
        historyIndex,
        isReloadingHistory
    };
};
