const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

// Find cardealer section
const start = js.indexOf('{id:"cardealer"');
const end = js.indexOf('{id:"autoprime"', start);
const section = js.substring(start, end);

// Count braces and brackets properly
let bDepth = 0, cDepth = 0;
let inStr = false, esc = false, strChar = '';

for (let i = 0; i < section.length; i++) {
  const ch = section[i];
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

  // Report when braces are unbalanced
  if (cDepth < 0) { console.log('NEGATIVE brace depth at', i); }
  if (bDepth < 0) { console.log('NEGATIVE bracket depth at', i); }
}

console.log('Final: brackets=' + bDepth + ' braces=' + cDepth);

// Now check where the extra opens are
bDepth = 0; cDepth = 0;
inStr = false; esc = false; strChar = '';
let maxB = 0, maxC = 0;

for (let i = 0; i < section.length; i++) {
  const ch = section[i];
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
  if (bDepth > maxB) maxB = bDepth;
  if (cDepth > maxC) maxC = cDepth;
}

console.log('Max bracket depth:', maxB, 'Max brace depth:', maxC);

// Sanity check - count all chars
let openCount = 0, closeCount = 0;
for (const ch of section) {
  if (ch === '{') openCount++;
  if (ch === '}') closeCount++;
}
console.log('Raw brace count: open=' + openCount + ' close=' + closeCount + ' diff=' + (openCount - closeCount));
