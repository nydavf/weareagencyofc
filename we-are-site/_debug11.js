const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

const start = js.indexOf('{id:"cardealer"');
const end = js.indexOf('{id:"autoprime"', start);
const section = js.substring(start, end);

// Find where the unclosed string starts
let inStr = false;
let strStartPos = 0;

for (let i = 0; i < section.length; i++) {
  const ch = section[i];
  if (ch === '\\') { i++; continue; } // skip escaped char
  if (ch === '"') {
    if (!inStr) {
      inStr = true;
      strStartPos = i;
    } else {
      inStr = false;
    }
  }
}

if (inStr) {
  console.log('UNCLOSED STRING found!');
  console.log('Starts at position', strStartPos, 'relative to section');
  console.log('Section position', start + strStartPos, 'relative to JS');
  // Show context around the unclosed string start
  console.log('Context around unclosed string start:');
  console.log(JSON.stringify(section.substring(Math.max(0, strStartPos - 50), strStartPos + 100)));
  
  // Find the line number
  const beforeString = section.substring(0, strStartPos);
  const lineNum = beforeString.split('\n').length;
  console.log('Line number in section:', lineNum);
  
  // Find line in full HTML
  const htmlBefore = c.substring(0, start + strStartPos);
  const htmlLineNum = htmlBefore.split('\r\n').length;
  console.log('Approx HTML line number:', htmlLineNum);
}
