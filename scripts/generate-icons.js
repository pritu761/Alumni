// Simple icon placeholder generator
// In a real app, you'd use proper icon generation tools or design software

const fs = require('fs');
const path = require('path');

// SVG template for basic icon
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#3b82f6"/>
  <circle cx="${size * 0.5}" cy="${size * 0.35}" r="${size * 0.15}" fill="white"/>
  <path d="M ${size * 0.25} ${size * 0.65} Q ${size * 0.5} ${size * 0.8} ${size * 0.75} ${size * 0.65}" 
        stroke="white" stroke-width="${size * 0.03}" fill="none"/>
  <text x="${size * 0.5}" y="${size * 0.9}" font-family="Arial, sans-serif" 
        font-size="${size * 0.1}" fill="white" text-anchor="middle">ALUMNI</text>
</svg>
`;

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const iconsDir = path.join(__dirname, '..', '..', 'public', 'icons');

// Create basic SVG icons
sizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  try {
    fs.writeFileSync(filepath, svgContent.trim());
    console.log(`Created ${filename}`);
  } catch (error) {
    console.error(`Error creating ${filename}:`, error);
  }
});

console.log('Basic icon placeholders created. Convert to PNG using online tools or design software.');
