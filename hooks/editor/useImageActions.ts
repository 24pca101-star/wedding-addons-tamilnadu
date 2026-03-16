"use client";

import { useCallback } from "react";
import { Canvas, FabricImage, Shadow } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    saveHistory: () => void;
}

export const useImageActions = ({ canvasRef, saveHistory }: Props) => {
    
    const replaceImage = useCallback((url: string, mode: 'cover' | 'contain' | 'stretch' = 'cover') => {
        const c = canvasRef.current;
        if (!c) return;

        const activeObject = c.getActiveObject() as FabricImage;
        if (!activeObject || activeObject.type !== 'image') {
            console.warn("No image is currently selected to replace.");
            return;
        }

        // Get the target visual dimensions of the current object
        const targetWidth = activeObject.width * activeObject.scaleX;
        const targetHeight = activeObject.height * activeObject.scaleY;

        const {
            left, top, angle, opacity, flipX, flipY, originX, originY
        } = activeObject;

        const objects = c.getObjects();
        const zIndex = objects.indexOf(activeObject);

        FabricImage.fromURL(url).then((img) => {
            let finalScaleX = 1;
            let finalScaleY = 1;

            if (mode === 'stretch') {
                finalScaleX = targetWidth / img.width;
                finalScaleY = targetHeight / img.height;
            } else if (mode === 'contain') {
                const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
                finalScaleX = scale;
                finalScaleY = scale;
            } else {
                // Default: Cover (Fill)
                const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
                finalScaleX = scale;
                finalScaleY = scale;
            }

            img.set({
                left,
                top,
                scaleX: finalScaleX,
                scaleY: finalScaleY,
                angle: angle || 0,
                opacity: opacity !== undefined ? opacity : 1,
                flipX: flipX || false,
                flipY: flipY || false,
                originX: originX || 'left',
                originY: originY || 'top',
                shadow: activeObject.shadow || new Shadow({
                    color: 'rgba(0,0,0,0.1)',
                    blur: 10,
                    offsetX: 0,
                    offsetY: 4
                })
            });

            c.remove(activeObject);
            c.add(img);
            c.moveObjectTo(img, zIndex);
            c.setActiveObject(img);
            c.requestRenderAll();
            c.fire("object:modified");
            saveHistory();
        }).catch(err => {
            console.error("Failed to load image for replacement:", err);
        });
    }, [canvasRef, saveHistory]);

    const setBackgroundImage = useCallback(async (url: string) => {
        const c = canvasRef.current;
        if (!c) return;

        try {
            const img = await FabricImage.fromURL(url);
            const scale = Math.min(c.width! / img.width!, c.height! / img.height!);

            c.set({ backgroundImage: img });

            img.set({
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                left: c.width! / 2,
                top: c.height! / 2,
            });

            c.renderAll();
            saveHistory();
        } catch (err) {
            console.error("Failed to set canvas background image", err);
        }
    }, [canvasRef, saveHistory]);

    const addImage = useCallback((url: string) => {
        const c = canvasRef.current;
        if (!c) return;

        FabricImage.fromURL(url).then((img) => {
            const targetSize = Math.min(c.width! * 0.7, c.height! * 0.7);
            const scale = Math.min(targetSize / img.width!, targetSize / img.height!);

            img.set({
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                shadow: new Shadow({
                    color: 'rgba(0,0,0,0.1)',
                    blur: 10,
                    offsetX: 0,
                    offsetY: 4
                })
            });

            c.add(img);
            c.centerObject(img);
            c.setActiveObject(img);
            c.requestRenderAll();
            c.fire("object:modified");
            saveHistory();
        });
    }, [canvasRef, saveHistory]);

    return {
        replaceImage,
        setBackgroundImage,
        addImage
    };
};
