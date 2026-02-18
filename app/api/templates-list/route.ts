import { NextResponse } from 'next/server';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Get available templates with their preview images
 * Maps PSD files to corresponding preview images
 */
export async function GET(request: Request) {
    try {
        const templatesPath = join(process.cwd(), 'public', 'templates');
        
        // Get all PSD files
        const files = readdirSync(templatesPath);
        const psdFiles = files.filter(f => f.endsWith('.psd'));
        
        // Map PSD to preview images (JPG/PNG with same name)
        const templates = psdFiles.map(psdFile => {
            const nameWithoutExt = psdFile.replace('.psd', '');
            
            // Check for preview images in different formats
            const previewFormats = ['.jpg', '.jpeg', '.png', '.webp'];
            let previewImage = null;
            
            for (const format of previewFormats) {
                const previewName = nameWithoutExt + format;
                if (readdirSync(templatesPath).includes(previewName)) {
                    previewImage = `/templates/${previewName}`;
                    break;
                }
            }
            
            return {
                id: nameWithoutExt,
                name: nameWithoutExt,
                psdPath: `/templates/${psdFile}`,
                previewImage: previewImage || `/templates/${nameWithoutExt}.jpg`, // Fallback
                description: `Wedding template: ${nameWithoutExt}`
            };
        });
        
        console.log(`📦 Found ${templates.length} templates`);
        templates.forEach(t => console.log(`   - ${t.name}: ${t.previewImage}`));
        
        return NextResponse.json({
            success: true,
            templates: templates,
            message: templates.length > 0 ? 
                `Found ${templates.length} templates` : 
                "No templates found - add preview images to /public/templates/"
        });
    } catch (error) {
        console.error('Error loading templates:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
