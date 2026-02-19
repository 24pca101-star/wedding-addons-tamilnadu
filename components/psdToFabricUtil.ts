
// Utility to convert ag-psd layers to fabric.js objects
// This is a basic example; you can extend it for more layer types and properties


import type { Canvas } from "fabric";
import * as fabric from "fabric";

type PsdLayer = {
  canvas?: HTMLCanvasElement;
  text?: {
    text: string;
    font?: {
      sizes?: number[];
      colors?: (string | [number, number, number])[];
    };
  };
  left?: number;
  top?: number;
  children?: PsdLayer[];
};

export function addPsdLayersToFabricCanvas(
  psd: { children?: PsdLayer[] },
  fabricCanvas: Canvas
) {
  function processLayer(layer: PsdLayer) {
    // Raster/image layer
    if (layer.canvas) {
    
      const img = new fabric.Image(layer.canvas, {
        left: layer.left,
        top: layer.top,
        selectable: false, // LOCK raster layers
        evented: false,
      });
      fabricCanvas.add(img);
    } else if (layer.text) {
      // Text layer (editable)
      let fill = "#000";
      if (layer.text.font?.colors?.[0]) {
        // Convert [r,g,b] to hex if needed
        const c = layer.text.font.colors[0];
        if (Array.isArray(c) && c.length === 3) {
          fill = `#${c.map(x => x.toString(16).padStart(2, "0")).join("")}`;
        } else if (typeof c === "string") {
          fill = c;
        }
      }
      
      const text = new fabric.Textbox(layer.text.text, {
        left: layer.left,
        top: layer.top,
        fontSize: layer.text.font?.sizes?.[0] || 24,
        fill,
        selectable: true,
        evented: true,
        editable: true,
      });
      fabricCanvas.add(text);
    }
    // Support nested layers (groups/folders)
    if (layer.children && Array.isArray(layer.children)) {
      layer.children.forEach(processLayer);
    }
  }
  if (!psd.children) return;
  psd.children.forEach(processLayer);
}
