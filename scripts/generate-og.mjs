import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const directory = dirname(fileURLToPath(import.meta.url));

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F6F3EE"/>
      <stop offset="100%" stop-color="#EDE7DC"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Left sage accent bar -->
  <rect x="0" y="0" width="6" height="630" fill="#3F5D52"/>

  <!-- Top rule -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#E0DAD0" stroke-width="1"/>

  <!-- Bottom rule -->
  <line x1="80" y1="550" x2="1120" y2="550" stroke="#E0DAD0" stroke-width="1"/>

  <!-- Logo mark — rotated square dot -->
  <rect x="80" y="108" width="12" height="12" rx="2" fill="#3F5D52" transform="rotate(45 86 114)"/>

  <!-- Logo wordmark -->
  <text x="104" y="126" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#1A1815" letter-spacing="-0.5">GLP Index</text>

  <!-- Eyebrow -->
  <text x="80" y="210" font-family="monospace" font-size="14" fill="#6B655C" letter-spacing="3" text-transform="uppercase">INDEPENDENT · CLINICALLY GROUNDED · FREE</text>

  <!-- Main headline line 1 -->
  <text x="80" y="310" font-family="Georgia, serif" font-size="72" font-weight="400" fill="#1A1815" letter-spacing="-2">Plain answers about</text>

  <!-- Main headline line 2 — "your" italic in sage -->
  <text x="80" y="400" font-family="Georgia, serif" font-size="72" font-weight="400" fill="#1A1815" letter-spacing="-2">
    <tspan font-style="italic" fill="#3F5D52">your</tspan>
    <tspan> GLP-1.</tspan>
  </text>

  <!-- Subhead -->
  <text x="80" y="470" font-family="Arial, sans-serif" font-size="22" fill="#3A352E">Ozempic · Wegovy · Mounjaro · Zepbound</text>

  <!-- Right side — stat card -->
  <rect x="820" y="170" width="300" height="210" rx="10" fill="#FBFAF7" stroke="#E0DAD0" stroke-width="1"/>
  <!-- Card top accent -->
  <rect x="844" y="169" width="48" height="2" fill="#3F5D52"/>

  <text x="844" y="208" font-family="monospace" font-size="11" fill="#6B655C" letter-spacing="2">STEP 1 · WEGOVY · 68 WK</text>
  <text x="844" y="305" font-family="Georgia, serif" font-size="80" font-weight="400" fill="#1A1815" letter-spacing="-3">−14.9</text>
  <text x="1030" y="278" font-family="Georgia, serif" font-size="28" fill="#6B655C">%</text>
  <text x="844" y="335" font-family="Arial, sans-serif" font-size="13" fill="#6B655C">avg body weight reduction</text>
  <text x="844" y="353" font-family="Arial, sans-serif" font-size="13" fill="#6B655C">N Engl J Med, 384:989</text>

  <!-- Bottom domain -->
  <text x="80" y="582" font-family="monospace" font-size="14" fill="#6B655C" letter-spacing="2">glpdash.com</text>
</svg>`;

const outputPath = join(directory, "../public/og-default.png");

await sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath);

console.log("Generated og-default.png");
