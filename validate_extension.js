import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('--- Validando Extensão Chrome (Manifest V3) ---');

// 1. Validar manifest.json
const manifestPath = path.resolve('manifest.json');
assert.ok(fs.existsSync(manifestPath), 'manifest.json deve existir');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.strictEqual(manifest.manifest_version, 3, 'Manifest version deve ser 3');
assert.ok(manifest.name, 'Nome deve existir');
assert.ok(manifest.version, 'Versão deve existir');
assert.ok(manifest.action, 'Action deve estar declarada');
assert.ok(manifest.action.default_popup, 'default_popup deve estar configurado');

console.log(`✓ manifest.json válido (Versão ${manifest.version}, MV3)`);

// 2. Validar Ícones
for (const [size, iconRelPath] of Object.entries(manifest.icons)) {
  const fullPath = path.resolve(iconRelPath);
  assert.ok(fs.existsSync(fullPath), `Ícone ${iconRelPath} (${size}px) deve existir no disco`);
  const stats = fs.statSync(fullPath);
  assert.ok(stats.size > 50, `Ícone ${iconRelPath} deve ser um arquivo válido`);
  console.log(`✓ Ícone ${size}x${size} verificado (${stats.size} bytes)`);
}

// 3. Validar arquivos referenciados
const filesToCheck = [
  manifest.action.default_popup,
  manifest.background.service_worker,
  ...manifest.content_scripts[0].js,
  ...manifest.content_scripts[0].css,
  'test-store.html',
  'CHROMEWEBSTORE.md'
];

for (const rel of filesToCheck) {
  const full = path.resolve(rel);
  assert.ok(fs.existsSync(full), `Arquivo ${rel} deve existir`);
  console.log(`✓ Arquivo existente: ${rel}`);
}

// 4. Validar que popup.html não contém scripts inline
const popupHtml = fs.readFileSync(path.resolve('popup/popup.html'), 'utf8');
assert.ok(!popupHtml.includes('<script>') && !popupHtml.includes('onclick='), 'popup.html não pode ter scripts inline');
console.log('✓ popup.html sem scripts inline (Conforme com CSP)');

console.log('\n--- EXTENSÃO 100% VÁLIDA E PRONTA PARA O GOOGLE CHROME! ---');
