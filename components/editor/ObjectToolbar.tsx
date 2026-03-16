"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Copy, Trash2, MoveUp, MoveDown, AlignCenter, AlignVerticalJustifyCenter } from 'lucide-react';
import { useFabric } from '@/context/FabricContext';

export default function ObjectToolbar() {
    const {
        selectedObject,
        deleteSelected,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        centerObjectH,
        centerObjectV,
        duplicateObject,
        canvas
    } = useFabric();

    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const toolbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!selectedObject || !canvas) {
            setIsVisible(false);
            return;
        }

        const updatePosition = () => {
            const activeObject = canvas.getActiveObject();
            if (!activeObject) {
                setIsVisible(false);
                return;
            }

            const boundingRect = activeObject.getBoundingRect();
            const canvasElement = canvas.lowerCanvasEl;
            if (!canvasElement) return;

            const canvasRect = canvasElement.getBoundingClientRect();

            const top = canvasRect.top + (boundingRect.top * canvas.getZoom()) - 60;
            const left = canvasRect.left + (boundingRect.left * canvas.getZoom()) + (boundingRect.width * canvas.getZoom() / 2);

            setCoords({ top, left });
            setIsVisible(true);
        };

        updatePosition();

        canvas.on('object:moving', updatePosition);
        canvas.on('object:scaling', updatePosition);
        canvas.on('object:rotating', updatePosition);
        canvas.on('selection:updated', updatePosition);

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resizing', updatePosition); // Use resize instead?

        return () => {
            canvas.off('object:moving', updatePosition);
            canvas.off('object:scaling', updatePosition);
            canvas.off('object:rotating', updatePosition);
            canvas.off('selection:updated', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [selectedObject, canvas]);

    if (!isVisible) return null;

    return (
        <div
            ref={toolbarRef}
            className="fixed z-[1000] flex items-center bg-gray-900 text-white rounded-xl shadow-2xl border border-white/10 p-1 animate-in zoom-in-95 duration-200"
            style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                transform: 'translateX(-50%)'
            }}
        >
            <div className="flex items-center gap-1">
                <button
                    onClick={duplicateObject}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors flex flex-col items-center gap-1 group"
                    title="Duplicate"
                >
                    <Copy size={16} className="group-hover:scale-110 transition-transform" />
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                <button
                    onClick={bringForward}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Bring Forward"
                >
                    <MoveUp size={16} className="group-hover:translate-y-[-2px] transition-transform" />
                </button>

                <button
                    onClick={sendBackward}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Send Backward"
                >
                    <MoveDown size={16} className="group-hover:translate-y-[2px] transition-transform" />
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                <button
                    onClick={centerObjectH}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Center Horizontally"
                >
                    <AlignCenter size={16} className="group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={centerObjectV}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Center Vertically"
                >
                    <AlignVerticalJustifyCenter size={16} className="group-hover:scale-110 transition-transform" />
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                <button
                    onClick={deleteSelected}
                    className="p-2 hover:bg-red-500 rounded-lg transition-colors group"
                    title="Delete"
                >
                    <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-white/10 rotate-45" />
        </div>
    );
}
