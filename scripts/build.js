const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const clientDir = path.resolve(rootDir, 'client');
const clientDist = path.resolve(clientDir, 'dist');
const rootDist = path.resolve(rootDir, 'dist');

console.log('[build.js] Root directory:', rootDir);
console.log('[build.js] Client directory:', clientDir);

console.log('[build.js] Executing Vite build in client...');
execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

if (!fs.existsSync(clientDist)) {
  console.error('[build.js] ERROR: client/dist does not exist after build!');
  process.exit(1);
}

console.log('[build.js] Mirroring client/dist -> root dist...');
if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.cpSync(clientDist, rootDist, { recursive: true, force: true });

const indexHtml = path.resolve(rootDist, 'index.html');
if (!fs.existsSync(indexHtml)) {
  console.error('[build.js] ERROR: root dist/index.html does not exist!');
  process.exit(1);
}

console.log('[build.js] Output verified successfully at:', rootDist);
console.log('[build.js] Files in root dist:', fs.readdirSync(rootDist));
