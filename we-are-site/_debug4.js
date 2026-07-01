const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];
const modelsStart = js.indexOf('const models = [');

// Count bracket balance from modelsStart
let depth = 0, inStr = false, esc = false, strChar = '';
let maxDepth = 0;
let lastClose = -1;

for (let i = modelsStart; i < js.length; i++) {
  const ch = js[i];
  if (esc) { esc = false; continue; }
  if (ch === '\\') { esc = true; continue; }
  if (inStr) {
    if (ch === strChar && !esc) inStr = false;
    continue;
  }
  if (ch === '"' || ch === "'") { inStr = true; strChar = ch; continue; }
  if (ch === '[') { depth++; if (depth > maxDepth) maxDepth = depth; }
  if (ch === ']') {
    depth--;
    if (depth === 0) {
      lastClose = i;
      // Continue looking for more
    }
  }
}

console.log('Max depth:', maxDepth);
console.log('Final depth:', depth);
console.log('Last close at position:', lastClose);
console.log('JS total length:', js.length);
if (lastClose > 0) {
  console.log('After last ]:', JSON.stringify(js.substring(lastClose, lastClose + 10)));
}
// If depth never reaches 0, find where ] is expected
if (depth !== 0) {
  console.log('Models array never properly closed!');
  // Find the last ]
  const lastBracket = js.lastIndexOf(']');
  console.log('Last ] at position:', lastBracket);
  console.log('Context:', JSON.stringify(js.substring(Math.max(0, lastBracket - 50), lastBracket + 20)));
}
