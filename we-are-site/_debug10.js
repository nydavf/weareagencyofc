const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

// Find cardealer section only - no template literals in data
const start = js.indexOf('{id:"cardealer"');
const end = js.indexOf('{id:"autoprime"', start);
const section = js.substring(start, end);

// Simple counting: just count { and } chars that are NOT inside " strings
let inDouble = false, esc = false;
let countOpen = 0, countClose = 0;
let depth = 0;
let maxDepth = 0;

for (let i = 0; i < section.length; i++) {
  const ch = section[i];
  
  if (esc) { esc = false; continue; }
  if (ch === '\\') { esc = true; continue; }
  
  if (inDouble) {
    if (ch === '"' && !esc) inDouble = false;
    continue;
  }
  
  if (ch === '"') { inDouble = true; continue; }
  
  if (ch === '{') { countOpen++; depth++; if (depth > maxDepth) maxDepth = depth; }
  if (ch === '}') { countClose++; depth--; }
}

console.log('Open braces:', countOpen, 'Close braces:', countClose);
console.log('Depth:', depth, 'Max depth:', maxDepth);

// Now check if there are unclosed " somewhere
let quoteCount = 0;
for (let i = 0; i < section.length; i++) {
  if (section[i] === '"') quoteCount++;
}
console.log('Total double-quotes:', quoteCount, '(should be even:', quoteCount % 2 === 0, ')');
