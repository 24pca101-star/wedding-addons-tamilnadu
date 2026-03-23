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
            const url = `http://localhost:5005/api/psd/layers/${filename}`;
            console.log(`Fabric: Fetching layers from ${url} (LoadID: ${loadId})`);

            const response = await fetch(url);
            if (!response.ok) {
                let errorDetails = "";
                try {
                    const errorJson = await response.json();
                    errorDetails = errorJson.details || errorJson.error || "";
                } catch (e) {
                    // Not JSON or no details
                }
                throw new Error(`Metadata fetch failed: ${response.status}${errorDetails ? ` (${errorDetails})` : ""}`);
            }

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
                    const padding = 80;
                    const availableWidth = workspace.clientWidth - padding;
                    const availableHeight = workspace.clientHeight - padding;

                    const scaleX = availableWidth / metadata.width;
                    const scaleY = availableHeight / metadata.height;

                    targetScale = Math.min(scaleX, scaleY, 1) * 0.95;
                } else {
                    targetScale = 0.5;
                }

                // Final Visual Canvas Size (The viewport window)
                const visualWidth = Math.round(metadata.width * targetScale);
                const visualHeight = Math.round(metadata.height * targetScale);

                console.log(`Fabric: Workspace Scale: ${targetScale.toFixed(4)} | Resolution: ${metadata.width}x${metadata.height} | Visual: ${visualWidth}x${visualHeight}`);

                // Set dimensions to the visual size, but zoom the world to match
                activeCanvas.setDimensions({ width: visualWidth, height: visualHeight });
                activeCanvas.setZoom(targetScale);

                // Force a small state change to ensure page.tsx re-renders with new dimensions
                setPreviewUrl(prev => prev || "");

                // 2. Load layers with 1:1 Coordination (No manual scaling!)
                const templatePreviewUrl = `http://localhost:5005/preview/${filename.replace('.psd', '.png')}`;
                setPreviewUrl(templatePreviewUrl);

                let layersProcessed = 0;
                const sortedLayers = [...metadata.layers];
                
                for (const layer of sortedLayers) {
                    if (loadId !== latestLoadId.current) break;

                    try {
                        const originalLeft = layer.left || 0;
                        const originalTop = layer.top || 0;
                        const originalWidth = layer.width || 1;

                        if (layer.type === 'text' && layer.text) {
                            const originalFontSize = layer.text.size || 24;

                            const text = new Textbox(layer.text.value || " ", {
                                left: originalLeft,
                                top: originalTop,
                                width: Math.max(originalWidth, 50),
                                fontSize: originalFontSize,
                                fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                                fill: layer.text.color ? `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${(layer.text.color[3] || 255) / 255})` : "#000000",
                                textAlign: layer.text.alignment || "left",
                                lineHeight: layer.text.lineHeight > 0 && originalFontSize > 0
                                    ? layer.text.lineHeight / originalFontSize
                                    : 1.16,
                                opacity: Math.max((layer.opacity ?? 255) / 255, 0.01),
                                visible: layer.visible ?? true,
                                globalCompositeOperation: (layer.blendMode === 'pass through' || !layer.blendMode) ? 'source-over' : layer.blendMode,
                                psdLayerName: layer.name,
                                originX: 'left',
                                originY: 'top'
                            });
                            activeCanvas.add(text);
                            layersProcessed++;
                        } else {
                            const imageUrl = layer.imageUrl || layer.layerUrl || layer.LayerUrl || layer.url;

                            if (imageUrl) {
                                const imgUrl = imageUrl.startsWith('http')
                                    ? imageUrl
                                    : `http://localhost:5005${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;

                                try {
                                    const layerImg = await FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' });
                                    if (loadId === latestLoadId.current) {
                                        layerImg.set({
                                            left: originalLeft,
                                            top: originalTop,
                                            // scaleX/scaleY should be 1 because coords are 1:1
                                            scaleX: 1,
                                            scaleY: 1,
                                            opacity: (layer.opacity ?? 255) / 255,
                                            visible: layer.visible ?? true,
                                            globalCompositeOperation: (layer.blendMode === 'pass through' || !layer.blendMode) ? 'source-over' : layer.blendMode,
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
