import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Empacotando PreçoSmart v2.0 Pro para a Chrome Web Store ---');

const zipName = 'precosmart-extension-v2.0.0.zip';
const zipPath = path.resolve(zipName);

// Remover ZIP anterior se existir
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

const itemsToInclude = [
  'manifest.json',
  'icons',
  'content',
  'popup',
  'background',
  'test-store.html'
];

try {
  const filesList = itemsToInclude.map(i => `'${i}'`).join(',');
  const cmd = `powershell -Command "Compress-Archive -Path ${filesList} -DestinationPath '${zipName}' -Force"`;
  execSync(cmd, { stdio: 'inherit' });

  const stats = fs.statSync(zipPath);
  console.log(`\n✓ Pacote v2.0 Pro criado: ${zipName} (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log('✓ Pronto para submissão no Google Chrome Developer Dashboard!');
} catch (err) {
  console.error('Erro ao criar pacote ZIP:', err.message);
  process.exit(1);
}
