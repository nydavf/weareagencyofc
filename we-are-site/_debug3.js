const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

// Extract the models array and everything after it
const modelsStart = js.indexOf('const models = [');
// Find where models ends (the ]; that closes it)
let depth = 0, inStr = false, esc = false, strChar = '';
let modelsEnd = -1;
for (let i = modelsStart; i < js.length; i++) {
  const ch = js[i];
  if (esc) { esc = false; continue; }
  if (ch === '\\') { esc = true; continue; }
  if (inStr) {
    if (ch === strChar && !esc) inStr = false;
    continue;
  }
  if (ch === '"' || ch === "'") { inStr = true; strChar = ch; continue; }
  if (ch === '[') depth++;
  if (ch === ']') {
    depth--;
    if (depth === 0) { modelsEnd = i + 1; break; }
  }
}

if (modelsEnd === -1) {
  console.log('ERROR: Could not find end of models array!');
  process.exit(1);
}

const modelsCode = js.substring(modelsStart, modelsEnd);
console.log('Models code length:', modelsCode.length);
console.log('Models ends with:', JSON.stringify(modelsCode.substring(modelsCode.length-50)));

// Try to use Function constructor to parse
try {
  new Function('return (' + modelsCode.replace('const models = ', '') + ')');
  console.log('SUCCESS: Models array is valid JavaScript!');
} catch (e) {
  console.log('PARSE ERROR:', e.message);
  const msg = e.message;
  const posMatch = msg.match(/position (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1]);
    console.log('Error at position:', pos);
    console.log('Context:', modelsCode.substring(Math.max(0, pos-50), pos+50));
  }
}
