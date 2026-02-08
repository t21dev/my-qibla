import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// Read the SVG files
const svg192 = readFileSync(join(publicDir, 'pwa-192x192.svg'))
const svg512 = readFileSync(join(publicDir, 'pwa-512x512.svg'))
const ogSvg = readFileSync(join(publicDir, 'og-image.svg'))

// Generate PWA icons
await sharp(svg192)
  .resize(192, 192)
  .png()
  .toFile(join(publicDir, 'pwa-192x192.png'))

await sharp(svg512)
  .resize(512, 512)
  .png()
  .toFile(join(publicDir, 'pwa-512x512.png'))

// Generate Apple touch icon (180x180)
await sharp(svg192)
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'))

// Generate OG image for social sharing (1200x630)
await sharp(ogSvg)
  .resize(1200, 630)
  .png()
  .toFile(join(publicDir, 'og-image.png'))

console.log('All icons and OG image generated successfully!')
