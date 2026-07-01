const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];
const modelsStart = js.indexOf('const models = [');

// Count bracket and brace balance
let bDepth = 0, cDepth = 0;
let inStr = false, esc = false, strChar = '';

// Find position where models should close
const modelsArrStart = modelsStart + 'const models = '.length; // position of [

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
  
  // Check for servicesData declaration (signals end of models)
  if (js.substring(i, i+20) === 'const servicesData = ') {
    console.log('Found servicesData at position', i);
    console.log('Bracket depth at that point:', bDepth);
    console.log('Brace depth at that point:', cDepth);
    console.log('Context before:', js.substring(i-50, i));
    break;
  }
}

console.log('Final bracket depth:', bDepth);
console.log('Final brace depth:', cDepth);
