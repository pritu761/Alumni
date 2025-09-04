const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

async function generatePNGIcons() {
  const iconsDir = path.join(__dirname, 'public', 'icons');
  
  // Create a simple SVG template
  const createSVG = (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#3b82f6"/>
      <circle cx="${size * 0.5}" cy="${size * 0.35}" r="${size * 0.15}" fill="white"/>
      <path d="M ${size * 0.25} ${size * 0.65} Q ${size * 0.5} ${size * 0.8} ${size * 0.75} ${size * 0.65}" stroke="white" stroke-width="${size * 0.03}" fill="none"/>
      <text x="${size * 0.5}" y="${size * 0.9}" font-family="Arial, sans-serif" font-size="${size * 0.1}" fill="white" text-anchor="middle">ALUMNI</text>
    </svg>
  `;

  for (const size of sizes) {
    try {
      const svgBuffer = Buffer.from(createSVG(size));
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
        
      console.log(`Generated ${outputPath}`);
    } catch (error) {
      console.error(`Error generating ${size}x${size} icon:`, error);
    }
  }
}

generatePNGIcons().then(() => {
  console.log('All PNG icons generated successfully!');
}).catch((error) => {
  console.error('Error generating icons:', error);
});
