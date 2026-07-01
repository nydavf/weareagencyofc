const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];
const modelsStart = js.indexOf('const models = [');

let bDepth = 0, cDepth = 0;
let inStr = false, esc = false, strChar = '';

for (let i = modelsStart; i < js.length; i++) {
  const ch = js[i];
  if (esc) { esc = false; continue; }
  if (ch === '\\') { esc = true; continue; }
  if (inStr) {
    if (ch === strChar && !esc) inStr = false;
    continue;
  }
  if (ch === '"' || ch === "'") { inStr = true; strChar = ch; continue; }
  if (ch === '[') bDepth++;
  if (ch === ']') bDepth--;
  if (ch === '{') cDepth++;
  if (ch === '}') cDepth--;

  // After cardealer position, check depth
  if (i === 17187 + 5966) { // cardealer start + cardealer section length
    console.log('After cardealer closing:');
    console.log('  bDepth:', bDepth, 'cDepth:', cDepth);
    console.log('  Context:', JSON.stringify(js.substring(i, i+30)));
  }
}

console.log('Final bDepth:', bDepth, 'cDepth:', cDepth);
