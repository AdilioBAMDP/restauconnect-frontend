import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(process.cwd(), 'public', 'icons');

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Générer une icône SVG simple
const generateIcon = async (size) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#2563eb"/>
      <text x="${size/2}" y="${size/2 + size/8}" font-family="Arial" font-size="${size/4}" fill="white" text-anchor="middle" dominant-baseline="middle">R</text>
    </svg>
  `;

  const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`✅ Generated ${outputPath}`);
};

// Générer toutes les icônes
Promise.all(sizes.map(size => generateIcon(size)))
  .then(() => console.log('🎉 All icons generated!'))
  .catch(console.error);