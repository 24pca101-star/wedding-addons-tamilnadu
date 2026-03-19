"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Canvas, Textbox, FabricImage } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    isAlive: React.MutableRefObject<boolean>;
    handleZoom: (value: number) => void;
    saveHistory: () => void;
    pauseHistory: () => void;
    resumeHistory: () => void;
}

export const usePsdLoader = ({ canvasRef, isAlive, handleZoom, saveHistory, pauseHistory, resumeHistory }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [psdMetadata, setPsdMetadata] = useState<any>(null);
    const latestLoadId = useRef(0);

    // Dynamic Font Loading
    useEffect(() => {
        const loadPsdFonts = async () => {
            try {
                const response = await fetch("http://localhost:5005/api/psd/fonts");
                if (!response.ok) return;
                const data = await response.json();
                if (data.css) {
                    let styleTag = document.getElementById("psd-fonts-style");
                    if (!styleTag) {
                        styleTag = document.createElement("style");
                        styleTag.id = "psd-fonts-style";
                        document.head.appendChild(styleTag);
                    }
                    styleTag.innerHTML = data.css;
                    console.log("Fabric: PSD Fonts loaded dynamically");
                }
            } catch (err) {
                console.warn("Fabric: Could not load extra PSD fonts", err);
            }
        };
        loadPsdFonts();
    }, []);

    const loadPsdTemplate = useCallback(async (filename: string, targetCanvas?: Canvas) => {
        const activeCanvas = targetCanvas || canvasRef.current;
        if (!activeCanvas) return;

        const loadId = ++latestLoadId.current;

        try {
            console.log(`Fabric: Loading LAYERED PSD template ${filename} (LoadID: ${loadId})`);

            const response = await fetch(`http://localhost:5005/api/psd/layers/${filename}`);
            if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);

            if (loadId !== latestLoadId.current) return;

            const metadata = await response.json();
            setPsdMetadata(metadata);
            console.log(`Fabric: Metadata received: ${metadata.width}x${metadata.height}, layers: ${metadata.layers.length}`);

            const setupTemplate = async () => {
                if (loadId !== latestLoadId.current) return;

                pauseHistory();
                const el = activeCanvas.lowerCanvasEl;
                if (!el) {
                    console.warn("Fabric: Canvas element not ready, retrying...");
                    if (isAlive.current) setTimeout(setupTemplate, 100);
                    return;
                }

                activeCanvas.clear();
                activeCanvas.backgroundColor = 'white';

                // --- 1. Calculate Target Scale (Fit to Content) ---
                const workspace = document.getElementById('editor-workspace');
                let targetScale = 1;

                if (workspace && workspace.clientWidth > 0 && workspace.clientHeight > 0) {
                    const padding = 80; // Total padding around canvas
                    const availableWidth = workspace.clientWidth - padding;
                    const availableHeight = workspace.clientHeight - padding;

                    const scaleX = availableWidth / metadata.width;
                    const scaleY = availableHeight / metadata.height;

                    // Use a slightly smaller scale (0.9x of fit) to prevent "zoomed in" feel
                    targetScale = Math.min(scaleX, scaleY, 1) * 0.9;

                    console.log(`Fabric: Workspace size ${workspace.clientWidth}x${workspace.clientHeight}`);
                    console.log(`Fabric: Calculated targetScale: ${targetScale.toFixed(4)} (FitX: ${scaleX.toFixed(4)}, FitY: ${scaleY.toFixed(4)})`);
                } else {
                    console.warn("Fabric: Workspace element not found or has no size. Using default scale 0.5");
                    targetScale = 0.5;
                }

                const scaledWidth = Math.round(metadata.width * targetScale);
                const scaledHeight = Math.round(metadata.height * targetScale);

                console.log(`Fabric: Final Canvas Dimensions: ${scaledWidth}x${scaledHeight} (Scale: ${targetScale})`);

                activeCanvas.setDimensions({ width: scaledWidth, height: scaledHeight });
                activeCanvas.setZoom(1);
                handleZoom(1);

                // Force a small state change to ensure page.tsx re-renders with new dimensions
                setPreviewUrl(prev => prev || "");

                // 2. Load layers with Manual Scaling (Explicit Property Calculation)
                const templatePreviewUrl = `http://localhost:5005/preview/${filename.replace('.psd', '.png')}`;
                setPreviewUrl(templatePreviewUrl);

                let layersProcessed = 0;
                // Layers are now provided in Bottom-to-Top order from the server
                const sortedLayers = [...metadata.layers];
                for (const layer of sortedLayers) {
                    if (loadId !== latestLoadId.current) break;

                    try {
                        const scaledLeft = Math.round(layer.left * targetScale);
                        const scaledTop = Math.round(layer.top * targetScale);
                        const scaledLayerWidth = Math.round((layer.width || 1) * targetScale);

                        if (layer.type === 'text' && layer.text) {
                            // Defensive check for font size
                            const originalFontSize = layer.text.size || 24;
                            const scaledFontSize = originalFontSize * targetScale;

                            const text = new Textbox(layer.text.value || " ", {
                                left: scaledLeft,
                                top: scaledTop,
                                width: Math.max(scaledLayerWidth, 50),
                                fontSize: scaledFontSize > 1 ? scaledFontSize : 12,
                                fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                                fill: layer.text.color ? `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${(layer.text.color[3] || 255) / 255})` : "#000000",
                                textAlign: layer.text.alignment || "left",
                                lineHeight: layer.text.lineHeight > 0 && originalFontSize > 0
                                    ? layer.text.lineHeight / originalFontSize
                                    : 1.16,
                                opacity: Math.max((layer.opacity ?? 255) / 255, 0.01), // Avoid total invisibility
                                visible: layer.visible ?? true,
                                psdLayerName: layer.name,
                                originX: 'left',
                                originY: 'top'
                            });
                            activeCanvas.add(text);
                            layersProcessed++;
                        } else {
                            // Robust check for any image/design layer
                            const imageUrl = layer.imageUrl || layer.layerUrl || layer.LayerUrl || layer.url;

                            if (imageUrl) {
                                // Use relative path if it's a local storage path, otherwise use as is
                                const imgUrl = imageUrl.startsWith('http')
                                    ? imageUrl
                                    : (imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`);

                                try {
                                    const layerImg = await FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' });
                                    if (loadId === latestLoadId.current) {
                                        layerImg.set({
                                            left: scaledLeft,
                                            top: scaledTop,
                                            scaleX: targetScale,
                                            scaleY: targetScale,
                                            opacity: (layer.opacity ?? 255) / 255,
                                            visible: layer.visible ?? true,
                                            selectable: true,
                                            psdLayerName: layer.name,
                                            originX: 'left',
                                            originY: 'top'
                                        });
                                        activeCanvas.add(layerImg);
                                        layersProcessed++;
                                    }
                                } catch (err) {
                                    console.warn(`Fabric: Failed to load image layer "${layer.name}":`, err);
                                }
                            }
                        }
                    } catch (err) {
                        console.warn(`Fabric: Failed to load layer "${layer.name}":`, err);
                    }
                }

                console.log(`Fabric: Processed ${layersProcessed} layers at ${Math.round(targetScale * 100)}% scale`);
                activeCanvas.requestRenderAll();
                resumeHistory();
                saveHistory();
            };

            await setupTemplate();
        } catch (error) {
            console.error("Failed to load PSD template:", error);
        }
    }, [canvasRef, isAlive, handleZoom]);

    return {
        loadPsdTemplate,
        previewUrl,
        psdMetadata
    };
};
