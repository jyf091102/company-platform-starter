import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url);
const blocked = [
  /sb_(?:secret|service_role)_[A-Za-z0-9_-]+/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\./,
  /\b1[3-9]\d{9}\b/
];
const skip = new Set(['.git', 'node_modules', '.wrangler']);
async function files(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await files(path)); else out.push(path);
  }
  return out;
}
const failures = [];
for (const file of await files(root)) {
  const data = await readFile(file);
  if (data.includes(0)) continue;
  const text = data.toString('utf8');
  for (const pattern of blocked) if (pattern.test(text)) failures.push(`${relative(root.pathname, file)}: ${pattern}`);
}
for (const required of ['index.html','portal.html','_headers','README.md','LICENSE']) {
  try { await readFile(new URL(required, root)); } catch { failures.push(`missing ${required}`); }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Static and secret checks passed.');

