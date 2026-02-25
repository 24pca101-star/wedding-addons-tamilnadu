"use client";

import { Undo2, Redo2, Download, Lock, Unlock, MoveUp, MoveDown, ChevronsUp, ChevronsDown } from "lucide-react";
import { useFabric } from "@/context/FabricContext";

type Props = {
  download: (format: "png" | "pdf") => void;
};

export default function Toolbar({ download }: Props) {
  const {
    canvas,
    undo,
    redo,
    toggleLock,
    selectedObject,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    setOpacity
  } = useFabric();

  const isLocked = selectedObject?.lockMovementX;
  const currentOpacity = selectedObject?.opacity ?? 1;

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-30">
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors flex items-center gap-1 text-sm font-medium"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
          <span>Undo</span>
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors flex items-center gap-1 text-sm font-medium"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
          <span>Redo</span>
        </button>

        {selectedObject && (
          <div className="h-6 w-[1px] bg-gray-200 mx-2" />
        )}

        {selectedObject && (
          <div className="flex items-center gap-1">
            <button
              onClick={bringToFront}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
              title="Bring to Front"
            >
              <ChevronsUp size={18} />
            </button>
            <button
              onClick={bringForward}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
              title="Bring Forward"
            >
              <MoveUp size={18} />
            </button>
            <button
              onClick={sendBackward}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
              title="Send Backward"
            >
              <MoveDown size={18} />
            </button>
            <button
              onClick={sendToBack}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
              title="Send to Back"
            >
              <ChevronsDown size={18} />
            </button>
          </div>
        )}

        {selectedObject && (
          <div className="h-6 w-[1px] bg-gray-200 mx-2" />
        )}

        {selectedObject && (
          <div className="flex items-center gap-3 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentOpacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
            />
            <span className="text-xs font-bold text-gray-600 w-8">{Math.round(currentOpacity * 100)}%</span>
          </div>
        )}

        {selectedObject && (
          <div className="h-6 w-[1px] bg-gray-200 mx-2" />
        )}

        {selectedObject && (
          <button
            onClick={toggleLock}
            className={`p-2 rounded-md transition-colors flex items-center gap-1 text-sm font-medium ${isLocked ? "bg-pink-50 text-pink-600" : "hover:bg-gray-100 text-gray-700"
              }`}
            title={isLocked ? "Unlock Object" : "Lock Object"}
          >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            <span>{isLocked ? "Locked" : "Lock"}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => download("png")}
            className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all hover:bg-white hover:shadow-sm"
          >
            PNG
          </button>
          <button
            onClick={() => download("pdf")}
            className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all hover:bg-white hover:shadow-sm"
          >
            PDF
          </button>
        </div>

        <button
          onClick={() => download("png")}
          className="bg-pink-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-pink-700 transition-all shadow-md flex items-center gap-2 active:scale-95"
        >
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
