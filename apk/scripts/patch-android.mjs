import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const manifestPath = resolve('android/app/src/main/AndroidManifest.xml');
if (!existsSync(manifestPath)) {
  console.warn('Manifesto Android ainda não existe. Execute primeiro: npm run add-android');
  process.exit(0);
}

const source = readFileSync(manifestPath, 'utf8');
if (source.includes('android:screenOrientation="landscape"')) {
  console.log('Orientação landscape já configurada.');
  process.exit(0);
}

const patched = source.replace(/<activity\b([^>]*)>/, (full, attrs) => {
  return `<activity${attrs} android:screenOrientation="landscape">`;
});
if (patched === source) {
  throw new Error('Não foi possível localizar a activity principal no manifesto Android.');
}
writeFileSync(manifestPath, patched);
console.log('Orientação landscape configurada na activity principal.');
