const fs = require('fs');
const path = require('path');

const createIcon = (size) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#grad)"/>
  <g transform="translate(256, 256)">
    <rect x="-120" y="-100" width="110" height="200" rx="8" fill="#ffffff" opacity="0.95"/>
    <line x1="-100" y1="-70" x2="-30" y2="-70" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/>
    <line x1="-100" y1="-40" x2="-30" y2="-40" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/>
    <line x1="-100" y1="-10" x2="-30" y2="-10" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/>
    <line x1="-100" y1="20" x2="-30" y2="20" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/>
    <line x1="-100" y1="50" x2="-30" y2="50" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/>
    <rect x="10" y="-100" width="110" height="200" rx="8" fill="#ffffff" opacity="0.95"/>
    <line x1="30" y1="-70" x2="100" y2="-70" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
    <line x1="30" y1="-40" x2="100" y2="-40" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
    <line x1="30" y1="-10" x2="100" y2="-10" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="100" y2="20" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
    <line x1="30" y1="50" x2="100" y2="50" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
    <rect x="-5" y="-105" width="10" height="210" fill="#ffffff" opacity="0.3"/>
  </g>
</svg>`;
  
  return svg;
};

fs.writeFileSync(path.join(__dirname, '../public/icons/icon-192.svg'), createIcon(192));
fs.writeFileSync(path.join(__dirname, '../public/icons/icon-512.svg'), createIcon(512));

console.log('Icons created successfully!');
