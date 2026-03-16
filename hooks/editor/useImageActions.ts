"use client";

import { useCallback } from "react";
import { Canvas, FabricImage, Shadow } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    saveHistory: () => void;
}

export const useImageActions = ({ canvasRef, saveHistory }: Props) => {
    
    const replaceImage = useCallback((url: string) => {
        const c = canvasRef.current;
        if (!c) return;

        const activeObject = c.getActiveObject() as FabricImage;
        if (!activeObject || activeObject.type !== 'image') {
            console.warn("No image is currently selected to replace.");
            return;
        }

        const {
            left, top, scaleX, scaleY, angle, opacity, flipX, flipY, originX, originY
        } = activeObject;

        const objects = c.getObjects();
        const zIndex = objects.indexOf(activeObject);
        console.log(`Fabric: Replacing image with CORS anonymous: ${url}`);

        FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
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
            console.log(`Fabric: Setting background with CORS anonymous: ${url}`);
            const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
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
        console.log(`Fabric: Adding image with CORS anonymous: ${url}`);

        FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
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
