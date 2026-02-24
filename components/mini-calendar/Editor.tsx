'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import Sidebar from './Sidebar';
import Toolbar from '../directional-sign/Toolbar';
import { MONTHS } from '@/lib/calendar-presets';
import { parsePsdToFabric } from '@/utils/psdParser';

interface CalendarSize {
    id: string;
    name: string;
    width: number; // in mm
    height: number; // in mm
    foldedWidth?: number;
    foldedHeight?: number;
}

interface EditorProps {
    size: CalendarSize;
    onBack: () => void;
}

const MM_TO_PX = 3.78; // Basis for screen display approx 96 DPI

export default function Editor({ size, onBack }: EditorProps) {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [zoom, setZoom] = useState(1);
    const [historyState, setHistoryState] = useState<{ stack: string[], index: number }>({ stack: [], index: -1 });
    const [canvasObjects, setCanvasObjects] = useState<any[]>([]);
    const [currentSide, setCurrentSide] = useState<'front' | 'inside'>('front');
    const [gridActive, setGridActive] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // We store the JSON state for each side in folded mode
    const sideStates = useRef<{ front: string; inside: string }>({ front: '', inside: '' });

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
            fill: obj.fill,
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
            const displayWidth = size.width * MM_TO_PX;
            const displayHeight = size.height * MM_TO_PX;

            const canvas = new fabric.Canvas(canvasEl.current!, {
                width: displayWidth,
                height: displayHeight,
                backgroundColor: '#FFFFFF',
                preserveObjectStacking: true,
            });

            canvasRef.current = canvas;

            canvas.on('selection:created', (e) => { updateSelectedObjectState(e.selected?.[0]); syncObjects(canvas); });
            canvas.on('selection:updated', (e) => { updateSelectedObjectState(e.selected?.[0]); syncObjects(canvas); });
            canvas.on('selection:cleared', () => { updateSelectedObjectState(null); syncObjects(canvas); });
            canvas.on('object:modified', () => { saveHistory(canvas); syncObjects(canvas); });
            canvas.on('object:added', () => syncObjects(canvas));
            canvas.on('object:removed', () => syncObjects(canvas));

            // Initial Layout Helper
            const safeArea = new fabric.Rect({
                left: 3 * MM_TO_PX,
                top: 3 * MM_TO_PX,
                width: (size.width - 6) * MM_TO_PX,
                height: (size.height - 6) * MM_TO_PX,
                fill: 'transparent',
                stroke: '#FF0000',
                strokeDashArray: [5, 5],
                strokeWidth: 1,
                selectable: false,
                evented: false,
                opacity: 0.2
            });
            const safeAreaLabel = new fabric.IText('SAFE PRINT AREA', {
                left: 5 * MM_TO_PX,
                top: 5 * MM_TO_PX,
                fontSize: 6,
                fontFamily: 'Outfit',
                fill: '#FF0000',
                opacity: 0.3,
                selectable: false,
                evented: false,
            });

            (safeArea as any).id = 'safe-area-marker';
            canvas.add(safeArea);
            canvas.add(safeAreaLabel);
        };

        initCanvas();
        return () => {
            canvasRef.current?.dispose();
        };
    }, [size]);

    const saveHistory = (canvas: fabric.Canvas) => {
        const json = JSON.stringify(canvas.toJSON());
        setHistoryState(prev => {
            const newStack = prev.stack.slice(0, prev.index + 1);
            newStack.push(json);
            const newIndex = newStack.length - 1;
            setCanUndo(newIndex > 0);
            setCanRedo(false);
            return { stack: newStack, index: newIndex };
        });
    };

    const undo = () => {
        if (historyState.index <= 0) return;
        const newIndex = historyState.index - 1;
        const state = historyState.stack[newIndex];
        canvasRef.current?.loadFromJSON(JSON.parse(state)).then(() => {
            canvasRef.current?.renderAll();
            setHistoryState(prev => ({ ...prev, index: newIndex }));
            setCanUndo(newIndex > 0);
            setCanRedo(true);
        });
    };

    const redo = () => {
        if (historyState.index >= historyState.stack.length - 1) return;
        const newIndex = historyState.index + 1;
        const state = historyState.stack[newIndex];
        canvasRef.current?.loadFromJSON(JSON.parse(state)).then(() => {
            canvasRef.current?.renderAll();
            setHistoryState(prev => ({ ...prev, index: newIndex }));
            setCanUndo(true);
            setCanRedo(newIndex < historyState.stack.length - 1);
        });
    };

    const addText = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const text = new fabric.IText('Your Text Here', {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            fontSize: 24,
            fontFamily: 'Playfair Display',
            fill: '#800000',
            originX: 'center',
            originY: 'center',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const addCalendarGrid = (month: number, year: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const isFullYear = month === -1;
        const monthsToGen = isFullYear ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [month];

        const masterElements: fabric.Object[] = [];

        // Settings for layout
        const cellWidth = isFullYear ? 10 : 20;
        const cellHeight = isFullYear ? 10 : 20;
        const padding = isFullYear ? 1 : 2;
        const monthSpacingX = cellWidth * 7.5;
        const monthSpacingY = cellHeight * 8.5;
        const cols = canvas.getWidth() > canvas.getHeight() ? 4 : 3;

        monthsToGen.forEach((mIndex, idx) => {
            const firstDay = new Date(year, mIndex, 1).getDay();
            const daysInMonth = new Date(year, mIndex + 1, 0).getDate();
            const monthElements: fabric.Object[] = [];

            // Month Title
            const title = new fabric.IText(`${MONTHS[mIndex]} ${year}`, {
                fontSize: isFullYear ? 8 : 14,
                fontWeight: 'bold',
                fontFamily: 'Outfit',
                textAlign: 'center',
                originX: 'center',
                left: (cellWidth * 7) / 2,
                top: isFullYear ? -10 : -20,
                fill: '#800000'
            });
            monthElements.push(title);

            // Day Headers
            const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            days.forEach((d, i) => {
                monthElements.push(new fabric.IText(d, {
                    fontSize: isFullYear ? 6 : 10,
                    fontFamily: 'Outfit',
                    left: i * (cellWidth + padding),
                    top: 0,
                    fontWeight: 'bold',
                    fill: '#D4AF37'
                }));
            });

            // Date numbers
            let rowIdx = 1;
            for (let i = 1; i <= daysInMonth; i++) {
                const colIdx = (firstDay + i - 1) % 7;
                monthElements.push(new fabric.IText(i.toString(), {
                    fontSize: isFullYear ? 6 : 10,
                    fontFamily: 'Outfit',
                    left: colIdx * (cellWidth + padding),
                    top: rowIdx * (cellHeight + padding),
                    fill: '#444'
                }));
                if (colIdx === 6) rowIdx++;
            }

            const monthGroup = new fabric.Group(monthElements, {
                left: isFullYear ? (idx % cols) * monthSpacingX : 0,
                top: isFullYear ? Math.floor(idx / cols) * monthSpacingY : 0,
            });
            masterElements.push(monthGroup);
        });

        const masterGroup = new fabric.Group(masterElements, {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            originX: 'center',
            originY: 'center',
            selectable: true,
            hasControls: true,
        });
        (masterGroup as any).id = 'calendar-grid';

        canvas.add(masterGroup);
        canvas.setActiveObject(masterGroup);
        canvas.renderAll();
    };

    const onToggleSide = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Save current side
        sideStates.current[currentSide] = JSON.stringify(canvas.toJSON());

        const newSide = currentSide === 'front' ? 'inside' : 'front';
        setCurrentSide(newSide);

        // Load new side or clear
        canvas.clear();
        canvas.set({ backgroundColor: '#FFFFFF' });

        const state = sideStates.current[newSide];
        if (state) {
            canvas.loadFromJSON(JSON.parse(state)).then(() => canvas.renderAll());
        } else {
            // Re-add safe area
            const safeArea = new fabric.Rect({
                left: 3 * MM_TO_PX, top: 3 * MM_TO_PX,
                width: (size.width - 6) * MM_TO_PX, height: (size.height - 6) * MM_TO_PX,
                fill: 'transparent', stroke: '#FF0000', strokeDashArray: [5, 5],
                strokeWidth: 1, selectable: false, evented: false, opacity: 0.1
            });
            canvas.add(safeArea);
            canvas.renderAll();
        }
    };

    const handleUploadPsd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const canvas = canvasRef.current;
        if (!file || !canvas) return;

        try {
            const objects = await parsePsdToFabric(file);
            objects.forEach((obj) => {
                canvas.add(obj);
            });
            canvas.renderAll();
            saveHistory(canvas);
        } catch (error) {
            console.error("PSD Parsing Error:", error);
            alert("Failed to parse PSD file. Please make sure it's a valid PSD.");
        }
    };

    const saveAsPdf = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 4 });
        const pdf = new jsPDF({
            orientation: size.width > size.height ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [size.width, size.height]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, size.width, size.height);
        pdf.save(`mini-calendar-${size.id}.pdf`);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#FDFBF7] overflow-hidden">
            <Toolbar
                selectedSize={size.name}
                onSave={saveAsPdf}
                onBack={onBack}
                zoom={zoom}
                onUndo={undo}
                onRedo={redo}
                onZoomIn={() => { setZoom(z => z + 0.1); canvasRef.current?.setZoom(zoom + 0.1); }}
                onZoomOut={() => { setZoom(z => z - 0.1); canvasRef.current?.setZoom(zoom - 0.1); }}
                onToggleGrid={() => setGridActive(!gridActive)}
                onTogglePreview={() => setIsPreview(!isPreview)}
                hasSelectedObject={!!selectedObject}
                canUndo={canUndo}
                canRedo={canRedo}
                gridActive={gridActive}
                isPreview={isPreview}
                onDelete={() => {
                    const obj = canvasRef.current?.getActiveObject();
                    if (obj) { canvasRef.current?.remove(obj); canvasRef.current?.renderAll(); }
                }}
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    onAddText={addText}
                    onAddCalendar={addCalendarGrid}
                    onUploadImage={() => { }}
                    onUploadPsd={handleUploadPsd}
                    onColorChange={(c) => { canvasRef.current?.set({ backgroundColor: c }); canvasRef.current?.renderAll(); }}
                    onTextureChange={() => { }}
                    onApplyEffect={() => { }}
                    onDelete={() => { }}
                    onLock={() => { }}
                    onFontSizeChange={(s) => {
                        const obj = canvasRef.current?.getActiveObject();
                        if (obj) { obj.set({ fontSize: s }); canvasRef.current?.renderAll(); }
                    }}
                    onFontChange={(f) => {
                        const obj = canvasRef.current?.getActiveObject();
                        if (obj) { obj.set({ fontFamily: f }); canvasRef.current?.renderAll(); }
                    }}
                    onAlignChange={() => { }}
                    onObjectColorChange={(c) => {
                        const obj = canvasRef.current?.getActiveObject();
                        if (obj) { obj.set({ fill: c }); canvasRef.current?.renderAll(); }
                    }}
                    onAddMotif={(m) => {
                        const text = new fabric.IText(m.emoji, {
                            fontSize: 40,
                            left: canvasRef.current!.getWidth() / 2,
                            top: canvasRef.current!.getHeight() / 2,
                            originX: 'center', originY: 'center'
                        });
                        canvasRef.current?.add(text);
                        canvasRef.current?.renderAll();
                    }}
                    selectedObject={selectedObject}
                    objects={canvasObjects}
                    onSelectObject={(obj) => { canvasRef.current?.setActiveObject(obj); canvasRef.current?.renderAll(); }}
                    foldedMode={size.id === 'folded'}
                    currentSide={currentSide}
                    onToggleSide={onToggleSide}
                />
                <main ref={containerRef} className="flex-1 overflow-auto flex items-center justify-center p-20 bg-gray-100">
                    <div className="shadow-2xl bg-white relative">
                        {/* Ruler/Scale indicators would go here */}
                        <canvas ref={canvasEl} />
                    </div>
                </main>
            </div>
        </div>
    );
}
