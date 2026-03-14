"use client";

import { useCallback } from "react";
import { Canvas, Textbox, Rect, Object as FabricObject, FabricImage, Shadow } from "fabric";

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

    const replaceImage = useCallback((url: string) => {
        const c = canvasRef.current;
        if (!c) return;

        const activeObject = c.getActiveObject() as FabricImage;
        if (!activeObject || activeObject.type !== 'image') {
            console.warn("No image is currently selected to replace.");
            return;
        }

        // Capture properties of the existing image to preserve them
        const {
            left, top, scaleX, scaleY, angle, opacity, flipX, flipY, originX, originY
        } = activeObject;

        // Remember the z-index of the original object
        const objects = c.getObjects();
        const zIndex = objects.indexOf(activeObject);

        FabricImage.fromURL(url).then((img) => {
            // Apply all the captured visual properties to the new image
            img.set({
                left,
                top,
                scaleX: scaleX !== undefined ? scaleX : 1,
                scaleY: scaleY !== undefined ? scaleY : 1,
                angle: angle || 0,
                opacity: opacity !== undefined ? opacity : 1,
                flipX: flipX || false,
                flipY: flipY || false,
                originX: originX || 'left',
                originY: originY || 'top',
                // Re-apply the shadow if it existed, or add a subtle one
                shadow: activeObject.shadow || new Shadow({
                    color: 'rgba(0,0,0,0.1)',
                    blur: 10,
                    offsetX: 0,
                    offsetY: 4
                })
            });

            // Remove the old image
            c.remove(activeObject);

            // Add the new image
            c.add(img);

            // Re-stack it exactly where the old image was
            c.moveObjectTo(img, zIndex);

            // Select the new image
            c.setActiveObject(img);
            c.requestRenderAll();
            c.fire("object:modified");
            saveHistory();
        }).catch(err => {
            console.error("Failed to load image for replacement:", err);
        });
    }, [canvasRef, saveHistory]);

    return {
        addText,
        addRect,
        deleteSelected,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        replaceImage
    };
};
