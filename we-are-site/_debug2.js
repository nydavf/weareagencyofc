const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];
const start = js.indexOf('{id:"cardealer"');
// Find where the cardealer section ends (before {id:"autoprime")
const endAutoprime = js.indexOf('{id:"autoprime"', start);
const cardealerSection = js.substring(start, endAutoprime);
console.log('Cardealer section length:', cardealerSection.length);
// Count all braces
let openBr = 0, closeBr = 0;
for (let i = 0; i < cardealerSection.length; i++) {
  const ch = cardealerSection[i];
  if (ch === '{') openBr++;
  if (ch === '}') closeBr++;
}
console.log('Open braces:', openBr, 'Close braces:', closeBr);
console.log('Difference:', openBr - closeBr, '(positive = unclosed)');
// Find the exact closing position of the cardealer object
// We need to find where this model ends
// It should be at some position where depth goes back to 0
let depth = 0;
let inStr = false, esc = false, strChar = '';
for (let i = 0; i < cardealerSection.length; i++) {
  const ch = cardealerSection[i];
  if (esc) { esc = false; continue; }
  if (ch === '\\') { esc = true; continue; }
  if (inStr) {
    if (ch === strChar && !esc) inStr = false;
    continue;
  }
  if (ch === '"' || ch === "'") { inStr = true; strChar = ch; continue; }
  if (ch === '{') depth++;
  if (ch === '}') {
    depth--;
    if (depth === 0) {
      console.log('Object closes properly at position', i, 'char:', JSON.stringify(ch));
      console.log('After close:', JSON.stringify(cardealerSection.substring(i, i+10)));
    }
  }
}
console.log('Final depth:', depth);
// Also check the last 200 chars
console.log('Last 200 chars:');
console.log(cardealerSection.substring(cardealerSection.length-200));
