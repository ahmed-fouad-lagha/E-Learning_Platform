#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 E-Learning Platform - Favicon Generator');
console.log('='.repeat(50));
console.log('');

// Read the SVG favicon
const svgFavicon = fs.readFileSync('./public/favicon.svg', 'utf8');

// Create different sized icons using SVG
const createSvgIcon = (size, filename) => {
  const scaledSvg = svgFavicon.replace(
    'width="32" height="32" viewBox="0 0 32 32"',
    `width="${size}" height="${size}" viewBox="0 0 32 32"`
  );
  
  fs.writeFileSync(`./public/${filename}`, scaledSvg);
  console.log(`✅ Created: ${filename} (${size}x${size})`);
};

// Create Apple Touch Icon (larger, more detailed)
const createAppleTouchIcon = () => {
  const appleSvg = `<svg width="180" height="180" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle with gradient -->
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="book-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="32" height="32" rx="6" fill="url(#bg-gradient)"/>
  
  <!-- Open book icon -->
  <g transform="translate(6, 8)">
    <!-- Left page -->
    <path d="M2 2 C2 2, 8 4, 10 6 L10 14 C8 12, 2 10, 2 10 Z" fill="url(#book-gradient)" stroke="white" stroke-width="0.5"/>
    <!-- Right page -->
    <path d="M18 2 C18 2, 12 4, 10 6 L10 14 C12 12, 18 10, 18 10 Z" fill="url(#book-gradient)" stroke="white" stroke-width="0.5"/>
    <!-- Spine -->
    <line x1="10" y1="6" x2="10" y2="14" stroke="white" stroke-width="1"/>
    <!-- Pages lines -->
    <line x1="4" y1="8" x2="8" y2="8.5" stroke="#1d4ed8" stroke-width="0.3"/>
    <line x1="4" y1="10" x2="8" y2="10.5" stroke="#1d4ed8" stroke-width="0.3"/>
    <line x1="12" y1="8.5" x2="16" y2="8" stroke="#1d4ed8" stroke-width="0.3"/>
    <line x1="12" y1="10.5" x2="16" y2="10" stroke="#1d4ed8" stroke-width="0.3"/>
  </g>
  
  <!-- Graduation cap accent -->
  <g transform="translate(20, 4)">
    <rect x="0" y="0" width="8" height="2" rx="1" fill="#10b981"/>
    <polygon points="2,2 6,2 4,4" fill="#10b981"/>
    <circle cx="7" cy="2.5" r="0.5" fill="#fbbf24"/>
  </g>
</svg>`;

  fs.writeFileSync('./public/apple-touch-icon.svg', appleSvg);
  console.log('✅ Created: apple-touch-icon.svg (180x180)');
};

// Create the manifest icon sizes
const createManifestIcons = () => {
  // 192x192 icon
  createSvgIcon(192, 'icon-192x192.svg');
  
  // 512x512 icon  
  createSvgIcon(512, 'icon-512x512.svg');
};

// Create a simple ICO placeholder (browsers will fallback to SVG)
const createIcoPlaceholder = () => {
  const icoContent = `<!-- This is a placeholder. Browsers will use favicon.svg -->
<!-- To create a true .ico file, use an online converter -->`;
  
  fs.writeFileSync('./public/favicon.ico.txt', icoContent);
  console.log('✅ Created: favicon.ico.txt (placeholder)');
};

// Update manifest.json
const updateManifest = () => {
  const manifestPath = './public/manifest.json';
  let manifest = {};
  
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }
  
  manifest.icons = [
    {
      "src": "/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.svg", 
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ];
  
  // Ensure other manifest properties exist
  if (!manifest.name) manifest.name = "E-Learning Platform";
  if (!manifest.short_name) manifest.short_name = "EduDZ";
  if (!manifest.description) manifest.description = "منصة التعلم الإلكتروني الجزائرية للتحضير لامتحان البكالوريا";
  if (!manifest.theme_color) manifest.theme_color = "#3b82f6";
  if (!manifest.background_color) manifest.background_color = "#ffffff";
  if (!manifest.display) manifest.display = "standalone";
  if (!manifest.start_url) manifest.start_url = "/";
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Updated: manifest.json with new icons');
};

// Generate all favicon files
console.log('📱 Generating favicon files...');
console.log('');

try {
  createManifestIcons();
  createAppleTouchIcon();
  createIcoPlaceholder();
  updateManifest();
  
  console.log('');
  console.log('🎯 Favicon Generation Complete!');
  console.log('');
  console.log('📝 Files Created:');
  console.log('   • favicon.svg (main favicon)');
  console.log('   • apple-touch-icon.svg (Apple devices)');
  console.log('   • icon-192x192.svg (PWA small)');
  console.log('   • icon-512x512.svg (PWA large)');
  console.log('   • manifest.json (updated)');
  console.log('');
  console.log('⚡ Next Steps:');
  console.log('   1. Test favicon in browser');
  console.log('   2. Verify PWA manifest');
  console.log('   3. Check mobile appearance');
  console.log('   4. Consider creating favicon.ico for older browsers');
  console.log('');
  console.log('🌐 Online ICO Generator:');
  console.log('   https://favicon.io/favicon-converter/');
  console.log('   Upload favicon.svg to create favicon.ico');
  
} catch (error) {
  console.error('❌ Error generating favicons:', error.message);
}

console.log('');
console.log('='.repeat(50));
