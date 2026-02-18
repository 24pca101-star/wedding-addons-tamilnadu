import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { readPsd } from 'ag-psd';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const templateName = searchParams.get('template') || 'design-6.psd';
    
    try {
        const filePath = join(process.cwd(), 'public', 'templates', templateName);
        console.log(`\n📋 Analyzing PSD: ${templateName} at ${filePath}`);
        
        const buffer = readFileSync(filePath);
        console.log(`📦 File size: ${Math.round(buffer.length / 1024 / 1024)}MB`);
        
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        
        // Parse metadata only
        let psd = readPsd(arrayBuffer, { skipCompositeImageData: true, skipLayerImageData: true });
        
        const metadataInfo = {
            fileName: templateName,
            fileSize: `${Math.round(buffer.length / 1024 / 1024)}MB`,
            width: psd.width,
            height: psd.height,
            hasCompositeCanvas: !!psd.canvas,
            compositeCanvasSize: psd.canvas ? { width: psd.canvas.width, height: psd.canvas.height } : null,
            layerCount: psd.children?.length || 0,
            layerDetails: psd.children?.map((layer, idx) => ({
                index: idx,
                name: layer.name || `Layer ${idx}`,
                type: layer.text ? 'text' : (layer.canvas ? 'image' : (layer.children ? 'group' : 'other')),
                hasCanvas: !!layer.canvas,
                hasText: !!layer.text,
                hasChildren: layer.children?.length || 0,
                hidden: layer.hidden,
                dimensions: { w: layer.width, h: layer.height, x: layer.left, y: layer.top }
            })) || []
        };
        
        // Now try loading with image data
        let imageLoadSuccess = false;
        let imageDiagnostics: any = null;
        
        try {
            console.log("🎨 Attempting to load image data...");
            psd = readPsd(arrayBuffer, { skipCompositeImageData: false, skipLayerImageData: false });
            imageLoadSuccess = true;
            console.log("✅ Image data loaded successfully");
            
            imageDiagnostics = {
                compositeLoaded: !!psd.canvas,
                compositeType: psd.canvas ? typeof psd.canvas : null,
                compositeCanvasInfo: psd.canvas ? {
                    width: psd.canvas.width,
                    height: psd.canvas.height,
                    hasGetContext: typeof psd.canvas.getContext === 'function'
                } : null,
                layersWithImages: psd.children?.filter((l: any) => l.canvas).length || 0
            };
        } catch (imgErr) {
            console.log("⚠️ Image data loading failed");
            imageDiagnostics = {
                error: imgErr instanceof Error ? imgErr.message : String(imgErr),
                reason: "ag-psd canvas rendering not available - this is normal on server-side"
            };
        }
        
        return NextResponse.json({
            status: "Analysis Complete",
            metadata: metadataInfo,
            imageLoading: {
                success: imageLoadSuccess,
                diagnostics: imageDiagnostics
            },
            recommendation: !imageLoadSuccess ? 
                "⚠️ Consider converting PSD to PNG as fallback" :
                "✅ PSD has visual content available"
        });
        
    } catch (error) {
        console.error('Error analyzing PSD:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : String(error),
            hint: "Check if PSD file exists and is valid"
        }, { status: 500 });
    }
}
