'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { TEMPLATES, MOTIFS } from '@/lib/customizer-presets';

interface EditorProps {
    size: {
        id: string;
        name: string;
        ratio: number;
        dimensions: string;
    };
    onBack: () => void;
}

export default function Editor({ size, onBack }: EditorProps) {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // selectedObject is now a plain object with properties for UI display only
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [zoom, setZoom] = useState(1);
    const [gridActive, setGridActive] = useState(false);
    const [showSafeArea, setShowSafeArea] = useState(true);
    const [isPreview, setIsPreview] = useState(false);
    const [historyState, setHistoryState] = useState<{ stack: string[], index: number }>({
        stack: [],
        index: -1
    });
    const [isProcessingHistory, setIsProcessingHistory] = useState(false);
    const gridRef = useRef(gridActive);
    const processingRef = useRef(isProcessingHistory);

    useEffect(() => { gridRef.current = gridActive; }, [gridActive]);
    useEffect(() => { processingRef.current = isProcessingHistory; }, [isProcessingHistory]);

    const [canvasObjects, setCanvasObjects] = useState<any[]>([]);

    const updateSelectedObjectState = (obj: any) => {
        if (!obj) {
            setSelectedObject(null);
            return;
        }
        setSelectedObject({
            type: obj.type,
            fontFamily: obj.fontFamily,
            fontSize: obj.fontSize,
            textAlign: obj.textAlign,
            charSpacing: obj.charSpacing,
            lineHeight: obj.lineHeight,
            shadow: !!obj.shadow,
            lockMovementX: !!obj.lockMovementX,
        });
    };

    const syncObjects = (canvas: fabric.Canvas) => {
        const active = canvas.getActiveObject();
        const objs = canvas.getObjects().map((obj: any, index) => ({
            id: index,
            type: obj.type,
            text: (obj as any).text || (obj.type === 'FabricImage' ? 'Image' : 'Element'),
            fill: (obj as any).fill,
            visible: obj.visible,
            locked: !!obj.lockMovementX,
            isActive: obj === active,
            ref: obj
        }));
        setCanvasObjects(objs);
    };

    useEffect(() => {
        if (!canvasEl.current || !containerRef.current) return;

        const initCanvas = () => {
            const containerWidth = containerRef.current?.clientWidth || 800;
            const containerHeight = containerRef.current?.clientHeight || 600;

            const isLarge = size.id === 'extra-large' || size.id === 'large';
            const paddingFactor = isLarge ? 0.95 : 0.8; // Larger boards take more screen space

            let canvasWidth = containerWidth * paddingFactor;
            let canvasHeight = canvasWidth / size.ratio;

            if (canvasHeight > containerHeight * paddingFactor) {
                canvasHeight = containerHeight * paddingFactor;
                canvasWidth = canvasHeight * size.ratio;
            }

            const canvas = new fabric.Canvas(canvasEl.current!, {
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: '#FFFFFF',
                preserveObjectStacking: true,
            });

            canvasRef.current = canvas;
            saveHistoryLocal(canvas);

            canvas.on('selection:created', (e) => {
                updateSelectedObjectState(e.selected?.[0]);
                syncObjects(canvas);
            });
            canvas.on('selection:updated', (e) => {
                updateSelectedObjectState(e.selected?.[0]);
                syncObjects(canvas);
            });
            canvas.on('selection:cleared', () => {
                updateSelectedObjectState(null);
                syncObjects(canvas);
            });
            canvas.on('object:modified', () => {
                saveHistoryLocal(canvas);
                updateSelectedObjectState(canvas.getActiveObject());
                syncObjects(canvas);
            });
            canvas.on('object:added', () => {
                if (!processingRef.current) { saveHistoryLocal(canvas); }
                syncObjects(canvas);
            });
            canvas.on('object:removed', () => {
                if (!processingRef.current) { saveHistoryLocal(canvas); }
                syncObjects(canvas);
            });
            canvas.on('object:moving', (options) => {
                if (gridRef.current && options.target) {
                    const gridSize = 20;
                    options.target.set({
                        left: Math.round(options.target.left! / gridSize) * gridSize,
                        top: Math.round(options.target.top! / gridSize) * gridSize
                    });
                }
            });
        };

        const timer = setTimeout(initCanvas, 100);
        return () => {
            clearTimeout(timer);
            canvasRef.current?.dispose();
        };
    }, [size]);

    const saveHistoryLocal = (canvas: fabric.Canvas) => {
        if (processingRef.current) return;
        const json = JSON.stringify(canvas.toJSON());

        setHistoryState(prev => {
            const newStack = prev.stack.slice(0, prev.index + 1);
            newStack.push(json);
            const finalStack = newStack.length > 50 ? newStack.slice(1) : newStack;
            return {
                stack: finalStack,
                index: finalStack.length - 1
            };
        });
    };

    const undo = () => {
        if (historyState.index > 0 && canvasRef.current) {
            const canvas = canvasRef.current;
            setIsProcessingHistory(true);
            const prevIdx = historyState.index - 1;
            const state = historyState.stack[prevIdx];

            if (state && state !== "undefined") {
                canvas.discardActiveObject();
                canvas.loadFromJSON(JSON.parse(state)).then(() => {
                    canvas.renderAll();
                    setHistoryState(prev => ({ ...prev, index: prevIdx }));
                    syncObjects(canvas);
                }).finally(() => {
                    setIsProcessingHistory(false);
                });
            } else {
                setIsProcessingHistory(false);
            }
        }
    };

    const redo = () => {
        if (historyState.index < historyState.stack.length - 1 && canvasRef.current) {
            const canvas = canvasRef.current;
            setIsProcessingHistory(true);
            const nextIdx = historyState.index + 1;
            const state = historyState.stack[nextIdx];

            if (state && state !== "undefined") {
                canvas.discardActiveObject();
                canvas.loadFromJSON(JSON.parse(state)).then(() => {
                    canvas.renderAll();
                    setHistoryState(prev => ({ ...prev, index: nextIdx }));
                    syncObjects(canvas);
                }).finally(() => {
                    setIsProcessingHistory(false);
                });
            } else {
                setIsProcessingHistory(false);
            }
        }
    };

    const handleZoom = (type: 'in' | 'out') => {
        if (!canvasRef.current) return;
        let newZoom = type === 'in' ? zoom + 0.1 : zoom - 0.1;
        newZoom = Math.min(Math.max(0.2, newZoom), 5);
        setZoom(newZoom);
        canvasRef.current.setZoom(newZoom);
        canvasRef.current.renderAll();
    };

    const addText = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const text = new fabric.IText('Double Click to Edit', {
            left: canvas.getWidth() / 4,
            fontSize: 50,
            fontFamily: 'Playfair Display',
            fill: '#800000',
            textAlign: 'center',
            width: canvas.getWidth() * 0.6, // Set width to make textAlign visible
            editable: true,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !canvasRef.current) return;
        const reader = new FileReader();
        reader.onload = async (f) => {
            const data = f.target?.result;
            if (typeof data !== 'string') return;
            try {
                const img = await fabric.FabricImage.fromURL(data);
                if (canvasRef.current) {
                    img.scale(200 / img.width);
                    canvasRef.current.add(img);
                    canvasRef.current.centerObject(img);
                    canvasRef.current.setActiveObject(img);
                    canvasRef.current.renderAll();
                }
            } catch (err) {
                console.error('Error loading image', err);
            }
        };
        reader.readAsDataURL(file);
    };

    const addArrow = (direction: 'left' | 'right' | 'up' | 'down') => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let arrowChar = '→';
        if (direction === 'left') arrowChar = '←';
        if (direction === 'up') arrowChar = '↑';
        if (direction === 'down') arrowChar = '↓';

        const text = new fabric.IText(arrowChar, {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            fontSize: 100,
            fill: '#D4AF37',
            fontWeight: 'bold',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const addShape = (type: 'rect' | 'circle' | 'triangle') => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let shape: fabric.FabricObject;
        const common = {
            left: canvas.getWidth() / 2 - 50,
            top: canvas.getHeight() / 2 - 50,
            fill: 'transparent', // No fill as requested
            stroke: '#000000',    // Black outline
            strokeWidth: 2,       // 2px stroke
        };

        if (type === 'rect') {
            shape = new fabric.Rect({ ...common, width: 100, height: 100 });
        } else if (type === 'circle') {
            shape = new fabric.Circle({ ...common, radius: 50 });
        } else {
            shape = new fabric.Triangle({ ...common, width: 100, height: 100 });
        }

        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
    };

    const clipImage = (type: 'round' | 'rect') => {
        const canvas = canvasRef.current;
        const obj = canvas?.getActiveObject();
        if (!canvas || !obj || obj.type !== 'FabricImage') return;

        if (type === 'round') {
            const radius = Math.min(obj.width, obj.height) / 2;
            const clipPath = new fabric.Circle({
                radius: radius,
                originX: 'center',
                originY: 'center',
            });
            obj.set({ clipPath: clipPath });
        } else {
            obj.set({ clipPath: undefined });
        }
        canvas.renderAll();
        saveHistoryLocal(canvas);
    };

    const loadTemplate = (id: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const tpl = TEMPLATES.find(t => t.id === id);
        if (!tpl) return;

        canvas.clear();
        canvas.set({ backgroundColor: '#FFFFFF' });

        const promises = tpl.objects.map(obj => {
            if (obj.type === 'i-text') {
                const { type, ...options } = obj;
                const t = new fabric.IText(obj.text, options as any);
                canvas.add(t);
                return Promise.resolve();
            }
            return Promise.resolve();
        });

        Promise.all(promises).then(() => {
            canvas.renderAll();
            saveHistoryLocal(canvas);
        });
    };

    const applyGradient = (c1: string, c2: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Clear texture when applying gradient
        const existingTex = canvas.getObjects().find((o: any) => o.id === 'bg-texture');
        if (existingTex) canvas.remove(existingTex);

        const grad = new fabric.Gradient({
            type: 'linear',
            coords: { x1: 0, y1: 0, x2: canvas.getWidth(), y2: canvas.getHeight() },
            colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }]
        });
        canvas.set({ backgroundColor: grad });
        canvas.renderAll();
        saveHistoryLocal(canvas);
    };

    const handleTextEffects = (effect: string, value: any) => {
        const canvas = canvasRef.current;
        const obj = canvas?.getActiveObject() as any;
        if (!canvas || !obj || obj.type !== 'i-text') return;

        if (effect === 'shadow') {
            obj.set({
                shadow: value ? new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 10, offsetX: 5, offsetY: 5 }) : null
            });
        } else {
            obj.set({ [effect]: value });
        }
        canvas.renderAll();
        updateSelectedObjectState(obj);
        saveHistoryLocal(canvas);
    };

    const alignObject = (type: 'center' | 'left' | 'right' | 'top' | 'bottom') => {
        const canvas = canvasRef.current;
        const obj = canvas?.getActiveObject();
        if (!canvas || !obj) return;

        if (type === 'center') {
            canvas.centerObject(obj);
        } else if (type === 'left') {
            obj.set('left', 0);
        } else if (type === 'right') {
            obj.set('left', canvas.width - (obj.getScaledWidth()));
        } else if (type === 'top') {
            obj.set('top', 0);
        } else if (type === 'bottom') {
            obj.set('top', canvas.height - (obj.getScaledHeight()));
        }

        obj.setCoords();
        canvas.renderAll();
        saveHistoryLocal(canvas);
    };

    const saveAsPdf = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const currentZoom = canvas.getZoom();
        canvas.setZoom(1);
        const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 3 });
        canvas.setZoom(currentZoom);

        const pdf = new jsPDF({
            orientation: size.ratio > 1 ? 'landscape' : 'portrait',
            unit: 'in',
            format: size.id === 'extra-large' ? [48, 24] : (size.id === 'large' ? [36, 24] : (size.id === 'medium' ? [24, 18] : [16.5, 11.7]))
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.save(`wedding-sign-${size.id}.pdf`);
    };

    const saveAsImage = () => {
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.toDataURL({ format: 'png', multiplier: 2 });
        const link = document.createElement('a');
        link.download = `sign-design-${size.id}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-112px)] bg-[#FDFBF7] overflow-hidden">
            <Toolbar
                selectedSize={size.name}
                onSave={saveAsPdf}
                onBack={onBack}
                onUndo={undo}
                onRedo={redo}
                onZoomIn={() => handleZoom('in')}
                onZoomOut={() => handleZoom('out')}
                onToggleGrid={() => setGridActive(!gridActive)}
                onTogglePreview={() => setIsPreview(!isPreview)}
                onDelete={() => {
                    const canvas = canvasRef.current;
                    const obj = canvas?.getActiveObject();
                    if (obj) {
                        canvas?.remove(obj);
                        canvas?.renderAll();
                        updateSelectedObjectState(null);
                    }
                }}
                canUndo={historyState.index > 0}
                canRedo={historyState.index < historyState.stack.length - 1}
                zoom={zoom}
                gridActive={gridActive}
                isPreview={isPreview}
                hasSelectedObject={!!selectedObject}
            />
            <div className="flex flex-1 overflow-hidden">
                {!isPreview && (
                    <Sidebar
                        onAddText={addText} onUploadImage={uploadImage}
                        onAddArrow={addArrow}
                        onLoadTemplate={loadTemplate}
                        onColorChange={(c) => {
                            if (canvasRef.current) {
                                const canvas = canvasRef.current;
                                // Clear texture when applying solid color
                                const existingTex = canvas.getObjects().find((o: any) => o.id === 'bg-texture');
                                if (existingTex) canvas.remove(existingTex);

                                canvas.set({ backgroundColor: c });
                                canvas.renderAll();
                                saveHistoryLocal(canvas);
                            }
                        }}
                        onGradientChange={applyGradient}
                        onTextureChange={async (url) => {
                            const canvas = canvasRef.current;
                            if (!canvas) return;

                            const existing = canvas.getObjects().find((o: any) => o.id === 'bg-texture');
                            if (existing) canvas.remove(existing);

                            if (url === 'none') {
                                canvas.renderAll();
                                saveHistoryLocal(canvas);
                                return;
                            }

                            try {
                                // Add a timeout/safety for loading
                                const img = await fabric.FabricImage.fromURL(url, {
                                    crossOrigin: 'anonymous'
                                }).catch(err => {
                                    console.warn('Fallback: Asset not found, using clean background', url);
                                    return null;
                                });

                                if (!img) {
                                    // Fallback to a subtle cream color if the texture fails
                                    canvas.set({ backgroundColor: '#FDFBF7' });
                                    canvas.renderAll();
                                    return;
                                }

                                const pattern = new fabric.Pattern({
                                    source: img.getElement() as HTMLImageElement,
                                    repeat: 'repeat'
                                });

                                canvas.set({ backgroundColor: pattern });
                                canvas.renderAll();
                                saveHistoryLocal(canvas);
                            } catch (err) {
                                console.error('Error applying texture', err);
                                // Fallback
                                canvas.set({ backgroundColor: '#FDFBF7' });
                                canvas.renderAll();
                            }
                        }}
                        onApplyEffect={async (id) => {
                            const canvas = canvasRef.current;
                            if (!canvas) return;

                            const existing = canvas.getObjects().find((o: any) => o.id === 'bg-effect');
                            if (existing) canvas.remove(existing);

                            if (id === 'none') {
                                canvas.renderAll();
                                saveHistoryLocal(canvas);
                                return;
                            }

                            try {
                                const effectRect = new fabric.Rect({
                                    left: 0,
                                    top: 0,
                                    width: canvas.getWidth() * 4,
                                    height: canvas.getHeight() * 4,
                                    selectable: false,
                                    evented: false,
                                    hoverCursor: 'default'
                                });
                                (effectRect as any).id = 'bg-effect';

                                if (id === 'vignette') {
                                    effectRect.set({
                                        fill: new fabric.Gradient({
                                            type: 'radial',
                                            coords: {
                                                r1: 0,
                                                r2: canvas.getWidth() * 0.9,
                                                x1: canvas.getWidth() / 2,
                                                y1: canvas.getHeight() / 2,
                                                x2: canvas.getWidth() / 2,
                                                y2: canvas.getHeight() / 2,
                                            },
                                            colorStops: [
                                                { offset: 0, color: 'rgba(0,0,0,0)' },
                                                { offset: 0.7, color: 'rgba(0,0,0,0.1)' },
                                                { offset: 1, color: 'rgba(0,0,0,0.4)' }
                                            ]
                                        })
                                    });
                                } else if (id === 'noise' || id === 'texture-paper') {
                                    const url = id === 'noise' ? '/textures/noise_pattern.svg' : '/textures/old-paper.svg';
                                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
                                    effectRect.set({
                                        fill: new fabric.Pattern({
                                            source: img.getElement() as HTMLImageElement,
                                            repeat: 'repeat'
                                        }),
                                        opacity: id === 'noise' ? 0.4 : 0.6
                                    });
                                } else if (id === 'glitter') {
                                    const img = await fabric.FabricImage.fromURL('/textures/glitter_pattern.svg', { crossOrigin: 'anonymous' });
                                    effectRect.set({
                                        fill: new fabric.Pattern({
                                            source: img.getElement() as HTMLImageElement,
                                            repeat: 'repeat'
                                        }),
                                        opacity: 0.8
                                    });
                                }

                                // Effects will now always start at index 0 because background is a canvas property
                                canvas.insertAt(0, effectRect);
                                canvas.centerObject(effectRect);
                                canvas.renderAll();
                                saveHistoryLocal(canvas);
                            } catch (err) {
                                console.error('Error applying effect', err);
                            }
                        }}
                        onDelete={() => {
                            const canvas = canvasRef.current;
                            const obj = canvas?.getActiveObject();
                            if (obj) {
                                canvas?.remove(obj);
                                canvas?.renderAll();
                                updateSelectedObjectState(null);
                            }
                        }}
                        onBringForward={() => {
                            const obj = canvasRef.current?.getActiveObject();
                            if (obj) {
                                canvasRef.current?.bringObjectForward(obj);
                                canvasRef.current?.renderAll();
                            }
                        }}
                        onSendBackward={() => {
                            const obj = canvasRef.current?.getActiveObject();
                            if (obj) {
                                canvasRef.current?.sendObjectBackwards(obj);
                                canvasRef.current?.renderAll();
                            }
                        }}
                        onDuplicate={() => {
                            const obj = canvasRef.current?.getActiveObject();
                            if (obj) {
                                obj.clone().then((c: any) => {
                                    c.set({ left: c.left + 20, top: c.top + 20, evented: true });
                                    canvasRef.current?.add(c);
                                    canvasRef.current?.setActiveObject(c);
                                    canvasRef.current?.renderAll();
                                });
                            }
                        }}
                        onLock={() => {
                            const canvas = canvasRef.current;
                            const obj = canvas?.getActiveObject();
                            if (!obj) return;
                            const l = !obj.lockMovementX;
                            obj.set({ lockMovementX: l, lockMovementY: l, lockRotation: l, lockScalingX: l, lockScalingY: l, hasControls: !l });
                            canvas?.renderAll();
                            updateSelectedObjectState(obj);
                        }}
                        onFontSizeChange={(s) => handleTextEffects('fontSize', s)}
                        onFontChange={(f) => handleTextEffects('fontFamily', f)}
                        onAlignChange={(a) => handleTextEffects('textAlign', a)}
                        onLetterSpacing={(s) => handleTextEffects('charSpacing', s)}
                        onLineHeight={(h) => handleTextEffects('lineHeight', h)}
                        onTextShadow={(a) => handleTextEffects('shadow', a)}
                        onAlignBoard={alignObject}
                        onAddShape={addShape}
                        onClipImage={clipImage}
                        onObjectColorChange={(color) => {
                            const canvas = canvasRef.current;
                            const obj = canvas?.getActiveObject();
                            if (obj) {
                                obj.set({ fill: color });
                                canvas?.renderAll();
                                saveHistoryLocal(canvas!);
                            }
                        }}
                        onAddMotif={(motif) => {
                            const canvas = canvasRef.current;
                            if (!canvas || !motif) return;

                            const text = new fabric.IText(motif.emoji, {
                                left: canvas.getWidth() / 2,
                                top: canvas.getHeight() / 2,
                                fontSize: 100,
                                fontFamily: 'Arial', // Generic font for emojis
                                fill: '#800000', // Default luxury maroon
                            });

                            canvas.add(text);
                            canvas.centerObject(text);
                            canvas.setActiveObject(text);
                            canvas.renderAll();
                            saveHistoryLocal(canvas);
                        }}
                        selectedObject={selectedObject}
                        objects={canvasObjects}
                        onSelectObject={(obj) => {
                            if (canvasRef.current) {
                                canvasRef.current.setActiveObject(obj);
                                canvasRef.current.renderAll();
                            }
                        }}
                    />
                )}
                <main ref={containerRef} className="flex-1 flex flex-col items-center justify-center bg-[#FDFBF7] relative overflow-auto transition-all p-12 no-scrollbar scroll-smooth">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-gold/20 shadow-sm z-30">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-maroon uppercase tracking-widest">{size.name}</span>
                            <span className="text-[9px] text-gold font-bold">{size.dimensions}</span>
                        </div>
                    </div>

                    <div className={`flex-1 w-full flex items-center justify-center transition-all ${isPreview ? 'p-0 bg-white' : 'p-4'}`}>
                        {/* Clean Canvas Container */}
                        <div className={`relative bg-white transition-all duration-700 ease-in-out ${isPreview ? 'shadow-none p-0 border-none' : `shadow-[0_45px_100px_rgba(0,0,0,0.15)] p-4 border-8 border-white rounded-[2px] ${size.id === 'extra-large' || size.id === 'large' ? 'scale-105' : 'scale-95'}`}`}>
                            <div className="relative z-10">
                                <canvas ref={canvasEl} className={`touch-none ${!isPreview ? 'border border-gold/5' : ''}`} />
                                {!isPreview && gridActive && (
                                    <div className="absolute inset-0 pointer-events-none z-20" style={{ backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }} />
                                )}

                                {/* Physical Size Labels (Corner marks) */}
                                {!isPreview && (
                                    <>
                                        <div className="absolute -top-6 -left-6 text-[8px] font-black text-gold/40 tracking-widest">0"</div>
                                        <div className="absolute -top-6 -right-6 text-[8px] font-black text-gold/40 tracking-widest">{size.id === 'extra-large' ? '48"' : (size.id === 'large' ? '36"' : (size.id === 'medium' ? '24"' : '16.5"'))}</div>
                                        <div className="absolute -bottom-6 -left-6 text-[8px] font-black text-gold/40 tracking-widest">{size.id === 'extra-large' ? '24"' : (size.id === 'large' ? '24"' : (size.id === 'medium' ? '18"' : '11.7"'))}</div>
                                    </>
                                )}
                            </div>

                            {!isPreview && showSafeArea && (
                                <div className="absolute border border-dashed border-red-200 pointer-events-none opacity-40 z-30"
                                    style={{ inset: `${size.id === 'extra-large' ? '40px' : '20px'}` }}>
                                    <span className="absolute -top-4 left-0 text-[8px] text-red-400 font-bold uppercase tracking-widest bg-white px-2">Safe Print Area</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isPreview && (
                        <div className="fixed bottom-8 right-8 flex items-center gap-4 z-40 px-6 py-4 bg-white/95 backdrop-blur-xl border border-gold/20 rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] animate-fadeIn">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { if (confirm('Clear everything and start fresh?')) { canvasRef.current?.clear(); canvasRef.current?.set({ backgroundColor: '#fff' }); canvasRef.current?.renderAll(); saveHistoryLocal(canvasRef.current!); } }}
                                    className="px-5 py-2.5 bg-white text-gray-500 border border-red-100 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 flex items-center gap-2 group shadow-sm"
                                >
                                    <span className="text-xs transition-transform group-hover:rotate-12">♻️</span>
                                    RESET
                                </button>

                                <button
                                    onClick={saveAsImage}
                                    className="px-6 py-2.5 bg-gradient-to-br from-maroon to-[#600000] text-gold border border-gold/30 rounded-full text-[9px] font-black uppercase tracking-widest hover:shadow-maroon/20 hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 group shadow-md"
                                >
                                    <span className="text-xs transition-transform group-hover:scale-125">🖼️</span>
                                    SAVE AS IMAGE
                                </button>
                            </div>

                            <div className="flex items-center gap-3 text-gold/60 text-[8px] font-black uppercase tracking-[0.2em] pl-6 border-l border-gold/10">
                                <div className="flex flex-col items-end">
                                    <span className="text-[#800000] text-[9px] leading-none mb-0.5">{size.dimensions}</span>
                                    <span className="opacity-40">READY FOR PRINT</span>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
