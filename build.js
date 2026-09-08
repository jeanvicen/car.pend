import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy static assets to dist
const filesToCopy = ['index.html', 'manifest.webmanifest', 'version.json', 'sw.js', 'vehicle-engine.js'];
for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
}

const dirsToCopy = ['icons', 'assets', 'vendor'];
for (const dir of dirsToCopy) {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(distDir, dir), { recursive: true });
  }
}

console.log('Build completed successfully: assets copied to dist/');
