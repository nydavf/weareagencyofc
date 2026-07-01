const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];
const modelsStart = js.indexOf('const models = [');

let bDepth = 0, cDepth = 0;
let inStr = false, esc = false, strChar = '';
let minDepth = 0;

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
  
  if (bDepth < minDepth) {
    console.log('Bracket depth went negative at', i, ':', bDepth);
    console.log('Context:', js.substring(i-30, i+30));
  }
  if (cDepth < minDepth) {
    console.log('Brace depth went negative at', i, ':', cDepth);
    console.log('Context:', js.substring(i-30, i+30));
  }
  
  // Check for model transitions
  if (ch === '{' && bDepth === 1) {
    // This is a top-level model object
    const nextFew = js.substring(i, i+60);
    if (nextFew.includes('id:"')) {
      const idMatch = nextFew.match(/id:"([^"]+)"/);
      if (idMatch) {
        console.log(`Model ${idMatch[1]} at position ${i}: bDepth=${bDepth} cDepth=${cDepth}`);
      }
    }
  }
}
