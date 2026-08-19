import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const apkRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(apkRoot, '..');
const webDir = resolve(apkRoot, 'www');

rmSync(webDir, { recursive: true, force: true });
mkdirSync(webDir, { recursive: true });

for (const file of ['index.html', 'manifest.webmanifest', 'sw.js']) {
  cpSync(resolve(repoRoot, file), resolve(webDir, file));
}
for (const dir of ['icons', 'vendor']) {
  cpSync(resolve(repoRoot, dir), resolve(webDir, dir), { recursive: true });
}

if (!existsSync(resolve(webDir, 'index.html'))) {
  throw new Error('A cópia web do Drifin Slot não foi criada.');
}
console.log(`Arquivos web copiados para ${webDir}`);
