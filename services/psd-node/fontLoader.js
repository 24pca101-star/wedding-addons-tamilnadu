import fs from 'fs';
import path from 'path';
import opentype from 'opentype.js';

/**
 * Scans the fonts directory and provides a map of font names to paths.
 * Also generates CSS @font-face rules.
 */
export function getFontMap(fontsDir) {
    const fontMap = {};
    if (!fs.existsSync(fontsDir)) return fontMap;

    const files = fs.readdirSync(fontsDir);
    for (const file of files) {
        if (file.endsWith('.ttf') || file.endsWith('.otf')) {
            try {
                const fontPath = path.join(fontsDir, file);
                const font = opentype.loadSync(fontPath);
                const familyName = font.names.fontFamily.en;
                const styleName = font.names.fontSubfamily.en;
                const fullName = `${familyName}-${styleName}`.replace(/\s+/g, '');

                fontMap[fullName] = {
                    family: familyName,
                    style: styleName,
                    path: file,
                    fullName: fullName
                };
            } catch (err) {
                console.error(`Failed to load font ${file}:`, err.message);
            }
        }
    }
    return fontMap;
}

export function generateFontFaceCSS(fontMap, baseUrl) {
    let css = '';
    for (const name in fontMap) {
        const font = fontMap[name];
        css += `
@font-face {
  font-family: '${name}';
  src: url('${baseUrl}/fonts/${font.path}') format('${font.path.endsWith('.ttf') ? 'truetype' : 'opentype'}');
  font-weight: normal;
  font-style: normal;
}
`;
    }
    return css;
}
