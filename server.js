import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Set cache headers similar to vercel.json
const staticOptions = {
  setHeaders: (res, filePath) => {
    const base = path.basename(filePath);
    if (base === 'sw.js' || base === 'version.json') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (base === 'index.html' || base === 'manifest.webmanifest') {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
};

// Serve static assets from project root
app.use(express.static(__dirname, staticOptions));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
