/**
 * Generate SEO images (OG image and logo) using Sharp
 * Run with: node scripts/generate-seo-images.js
 */

const sharp = require('sharp');
const path = require('path');

const BLUE = '#2563EB';
const DARK_BLUE = '#1E40AF';

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // Create SVG with the design
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${DARK_BLUE};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${BLUE};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGradient)"/>

      <!-- Subtle pattern overlay -->
      <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="1" fill="white" fill-opacity="0.1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#dots)"/>

      <!-- M&T Logo Box -->
      <rect x="520" y="180" width="160" height="160" rx="24" fill="white"/>
      <text x="600" y="290" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${BLUE}" text-anchor="middle">M&amp;T</text>

      <!-- Main Text -->
      <text x="600" y="420" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">Anatol M&amp;T</text>

      <!-- Subtitle -->
      <text x="600" y="480" font-family="Arial, sans-serif" font-size="28" fill="white" fill-opacity="0.9" text-anchor="middle">Masaż Warszawa (Gocław)</text>

      <!-- Decorative line -->
      <rect x="450" y="510" width="300" height="3" rx="2" fill="white" fill-opacity="0.3"/>
    </svg>
  `;

  const outputPath = path.join(__dirname, '../public/og-image.jpg');

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  console.log('Created: public/og-image.jpg (1200x630)');
}

async function generateLogo() {
  const size = 512;

  // Create SVG with the logo design
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${DARK_BLUE};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${BLUE};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" rx="64" fill="url(#logoGradient)"/>

      <!-- M&T Text -->
      <text x="256" y="300" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="white" text-anchor="middle">M&amp;T</text>
    </svg>
  `;

  const outputPath = path.join(__dirname, '../public/logo.png');

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log('Created: public/logo.png (512x512)');
}

async function main() {
  try {
    await generateOgImage();
    await generateLogo();
    console.log('\nSEO images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

main();
