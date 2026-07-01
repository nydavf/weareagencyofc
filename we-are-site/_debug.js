const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];
const start = js.indexOf('{id:"cardealer"');
let depth = 0;
let inStr = false;
let esc = false;
let strChar = '';
let i;
for (i = start; i < js.length; i++) {
  const ch = js[i];
  if (esc) { esc = false; continue; }
  if (ch === '\\') { esc = true; continue; }
  if (inStr) {
    if (ch === strChar && !esc) { inStr = false; }
    else if (ch === '\\') { esc = true; }
    continue;
  }
  if (ch === '"' || ch === "'") { inStr = true; strChar = ch; continue; }
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      console.log('Found closing } at position', i);
      console.log('Next 20 chars:', JSON.stringify(js.substring(i, i + 20)));
      break;
    }
  }
}
if (depth !== 0) console.log('ERROR: depth is', depth, '- unclosed braces!');
else console.log('OK: cardealer object properly closed');
