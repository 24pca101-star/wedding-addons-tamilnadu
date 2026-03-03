"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Canvas, Textbox, FabricImage } from "fabric";

interface Props {
    canvasRef: React.MutableRefObject<Canvas | null>;
    isAlive: React.MutableRefObject<boolean>;
    handleZoom: (value: number) => void;
}

export const usePsdLoader = ({ canvasRef, isAlive, handleZoom }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [psdMetadata, setPsdMetadata] = useState<any>(null);
    const latestLoadId = useRef(0);

    // Dynamic Font Loading
    useEffect(() => {
        const loadPsdFonts = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/psd/fonts");
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

            const response = await fetch(`http://localhost:5199/api/Psd/split/${filename}`);
            if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);

            if (loadId !== latestLoadId.current) return;

            const metadata = await response.json();
            setPsdMetadata(metadata);
            console.log(`Fabric: Metadata received: ${metadata.width}x${metadata.height}, layers: ${metadata.layers.length}`);

            const setupTemplate = async () => {
                if (loadId !== latestLoadId.current) return;

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
                if (workspace) {
                    const padding = 60; // Padding around canvas
                    const availableWidth = workspace.clientWidth - padding;
                    const availableHeight = workspace.clientHeight - padding;

                    const scaleX = availableWidth / metadata.width;
                    const scaleY = availableHeight / metadata.height;
                    targetScale = Math.min(scaleX, scaleY, 1);
                }

                const scaledWidth = Math.round(metadata.width * targetScale);
                const scaledHeight = Math.round(metadata.height * targetScale);

                activeCanvas.setDimensions({ width: scaledWidth, height: scaledHeight });
                activeCanvas.setZoom(1);
                handleZoom(1);

                // 2. Load layers with Manual Scaling (Explicit Property Calculation)
                const templatePreviewUrl = `http://localhost:5001/preview/${filename.replace('.psd', '.png')}`;
                setPreviewUrl(templatePreviewUrl);

                let layersProcessed = 0;
                for (const layer of metadata.layers) {
                    if (loadId !== latestLoadId.current) break;
                    try {
                        const scaledLeft = layer.left * targetScale;
                        const scaledTop = layer.top * targetScale;
                        const scaledLayerWidth = (layer.width || 200) * targetScale;

                        if (layer.type === 'text' && layer.text) {
                            const text = new Textbox(layer.text.value, {
                                left: scaledLeft,
                                top: scaledTop,
                                width: scaledLayerWidth,
                                fontSize: (layer.text.size || 24) * targetScale,
                                fontFamily: layer.text.font || "Inter, Arial, sans-serif",
                                fill: layer.text.color ? `rgba(${layer.text.color[0]}, ${layer.text.color[1]}, ${layer.text.color[2]}, ${(layer.text.color[3] || 255) / 255})` : "#000000",
                                textAlign: layer.text.alignment || "left",
                                lineHeight: layer.text.lineHeight > 0 && layer.text.size > 0
                                    ? layer.text.lineHeight / layer.text.size
                                    : 1.16,
                                opacity: layer.opacity ?? 1,
                                visible: layer.visible ?? true,
                                psdLayerName: layer.name,
                                originX: 'left',
                                originY: 'top'
                            });
                            activeCanvas.add(text);
                            layersProcessed++;
                        } else {
                            const imageUrl = layer.imageUrl || layer.layerUrl || layer.LayerUrl;
                            if (layer.type === 'image' && imageUrl) {
                                const imgUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:5001${imageUrl}`;
                                const layerImg = await FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' });
                                if (loadId === latestLoadId.current) {
                                    layerImg.set({
                                        left: scaledLeft,
                                        top: scaledTop,
                                        scaleX: targetScale,
                                        scaleY: targetScale,
                                        opacity: layer.opacity ?? 1,
                                        visible: layer.visible ?? true,
                                        selectable: true,
                                        psdLayerName: layer.name,
                                        originX: 'left',
                                        originY: 'top'
                                    });
                                    activeCanvas.add(layerImg);
                                    layersProcessed++;
                                }
                            }
                        }
                    } catch (err) {
                        console.warn('Fabric: Failed to load layer', err);
                    }
                }

                console.log(`Fabric: Processed ${layersProcessed} layers at ${Math.round(targetScale * 100)}% scale`);
                activeCanvas.requestRenderAll();
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
