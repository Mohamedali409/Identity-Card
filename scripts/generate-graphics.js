const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const projectsDir = path.join(assetsDir, 'projects');

fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(projectsDir, { recursive: true });

// 1. Profile Avatar SVG (High-tech developer portrait badge)
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1628" />
      <stop offset="50%" stop-color="#090E1A" />
      <stop offset="100%" stop-color="#03060C" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F0FF" />
      <stop offset="100%" stop-color="#0072FF" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="400" height="400" rx="40" fill="url(#bgGrad)" />
  <rect width="396" height="396" x="2" y="2" rx="38" fill="none" stroke="#1E2E4A" stroke-width="2" />
  
  <!-- Subtle Tech Grid -->
  <path d="M 0,100 L 400,100 M 0,200 L 400,200 M 0,300 L 400,300 M 100,0 L 100,400 M 200,0 L 200,400 M 300,0 L 300,400" stroke="#10192A" stroke-width="1" />
  
  <!-- Glowing Circular Tech Ring -->
  <circle cx="200" cy="180" r="110" fill="none" stroke="url(#cyanGrad)" stroke-width="3" filter="url(#cyanGlow)" stroke-dasharray="10 8" />
  <circle cx="200" cy="180" r="120" fill="none" stroke="#00F0FF" stroke-width="1" opacity="0.3" />

  <!-- Abstract Developer Avatar Silhouette -->
  <!-- Head -->
  <circle cx="200" cy="140" r="50" fill="#1A2742" stroke="url(#cyanGrad)" stroke-width="2" />
  <!-- Body/Shoulders -->
  <path d="M 120,270 C 120,210 160,205 200,205 C 240,205 280,210 280,270 C 280,285 270,290 200,290 C 130,290 120,285 120,270 Z" fill="#131E33" stroke="#253A61" stroke-width="2" />

  <!-- Modern Initials Monogram Badge -->
  <g transform="translate(160, 120)">
    <text x="40" y="28" font-family="'Space Grotesk', 'Inter', sans-serif" font-size="28" font-weight="900" fill="#00F0FF" text-anchor="middle" letter-spacing="2">MA</text>
  </g>

  <!-- Verified Developer Check Badge -->
  <g transform="translate(265, 230)">
    <circle cx="16" cy="16" r="16" fill="#00F0FF" filter="url(#cyanGlow)" />
    <path d="M 10,16 L 14,20 L 22,12" fill="none" stroke="#04070D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Bottom Technical Banner -->
  <rect x="50" y="330" width="300" height="36" rx="18" fill="#0A111F" stroke="#1D2C48" stroke-width="1.5" />
  <text x="200" y="353" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#38BDF8" text-anchor="middle" letter-spacing="1">FULL-STACK &amp; BACKEND</text>
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'avatar-mohamed.svg'), avatarSvg);

// 2. Realistic EMV Chip Graphic (SVG)
const chipSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120">
  <defs>
    <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE79A" />
      <stop offset="30%" stop-color="#E5B942" />
      <stop offset="60%" stop-color="#C4961D" />
      <stop offset="100%" stop-color="#F2D175" />
    </linearGradient>
  </defs>
  <!-- Base Chip Body -->
  <rect width="160" height="120" rx="16" fill="url(#goldFoil)" stroke="#78590D" stroke-width="2" />
  <!-- Circuit Traces -->
  <path d="M 0,40 L 45,40 C 55,40 60,45 60,55 L 60,65 C 60,75 55,80 45,80 L 0,80" fill="none" stroke="#78590D" stroke-width="2.5" />
  <path d="M 160,40 L 115,40 C 105,40 100,45 100,55 L 100,65 C 100,75 105,80 115,80 L 160,80" fill="none" stroke="#78590D" stroke-width="2.5" />
  <path d="M 60,0 L 60,40 M 100,0 L 100,40 M 60,120 L 60,80 M 100,120 L 100,80" fill="none" stroke="#78590D" stroke-width="2.5" />
  <!-- Central Micro-processor Core -->
  <rect x="65" y="45" width="30" height="30" rx="6" fill="#A17711" stroke="#FFE79A" stroke-width="1.5" />
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'chip-graphic.svg'), chipSvg);

// 3. Project Visual SVGs
function createProjectSVG(title, subtitle, color1, color2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="600" height="350">
    <defs>
      <linearGradient id="pGrad_${title.replace(/[^a-zA-Z]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0E1626" />
        <stop offset="100%" stop-color="#050811" />
      </linearGradient>
    </defs>
    <rect width="600" height="350" rx="16" fill="url(#bgGrad)" />
    <rect width="596" height="346" x="2" y="2" rx="14" fill="none" stroke="#1D2A42" stroke-width="2" />
    
    <!-- Code Window Header -->
    <rect x="2" y="2" width="596" height="40" rx="14" fill="#131D31" />
    <circle cx="25" cy="22" r="5" fill="#EF4444" />
    <circle cx="42" cy="22" r="5" fill="#F59E0B" />
    <circle cx="59" cy="22" r="5" fill="#10B981" />
    <text x="300" y="26" font-family="monospace" font-size="12" fill="#64748B" text-anchor="middle">api-service.engine.ts</text>

    <!-- Visual Code / Architecture Nodes -->
    <rect x="50" y="80" width="140" height="80" rx="10" fill="#18243D" stroke="${color1}" stroke-width="1.5" />
    <text x="120" y="125" font-family="monospace" font-size="12" font-weight="700" fill="#E2E8F0" text-anchor="middle">API GATEWAY</text>

    <path d="M 190,120 L 250,120" stroke="#00F0FF" stroke-width="2" stroke-dasharray="4 4" />

    <rect x="250" y="80" width="140" height="80" rx="10" fill="#18243D" stroke="${color2}" stroke-width="1.5" />
    <text x="320" y="125" font-family="monospace" font-size="12" font-weight="700" fill="#E2E8F0" text-anchor="middle">SERVICES</text>

    <path d="M 390,120 L 450,120" stroke="#00F0FF" stroke-width="2" stroke-dasharray="4 4" />

    <rect x="450" y="80" width="110" height="80" rx="10" fill="#18243D" stroke="#10B981" stroke-width="1.5" />
    <text x="505" y="125" font-family="monospace" font-size="12" font-weight="700" fill="#E2E8F0" text-anchor="middle">DATABASE</text>

    <!-- Bottom Title Banner -->
    <text x="40" y="260" font-family="sans-serif" font-size="22" font-weight="800" fill="#F8FAFC">${title}</text>
    <text x="40" y="295" font-family="sans-serif" font-size="14" fill="#94A3B8">${subtitle}</text>
  </svg>`;
}

fs.writeFileSync(
  path.join(projectsDir, 'ecommerce-backend.svg'),
  createProjectSVG('E-Commerce REST API Engine', 'Node.js • Express • MongoDB • Redis • Stripe', '#00F0FF', '#38BDF8')
);

fs.writeFileSync(
  path.join(projectsDir, 'taskflow.svg'),
  createProjectSVG('TaskFlow Collaboration Hub', 'Next.js • TypeScript • PostgreSQL • Prisma', '#6366F1', '#A855F7')
);

fs.writeFileSync(
  path.join(projectsDir, 'microservices-gateway.svg'),
  createProjectSVG('Microservices Auth Gateway', 'JWT • Rate Limiting • Docker • Nginx • Redis', '#10B981', '#06B6D4')
);

console.log('All vector graphics and assets generated!');
