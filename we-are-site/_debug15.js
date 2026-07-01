const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

const start = js.indexOf('{id:"cardealer"');
const end = js.indexOf('{id:"autoprime"', start);
const section = js.substring(start, end);

const lines = section.split(/\r?\n/);
const line3 = lines[3];

// Show context around each " position
let positions = [];
for (let i = 0; i < line3.length; i++) {
  if (line3[i] === '"') positions.push(i);
}

for (const pos of positions) {
  const ctx = line3.substring(Math.max(0, pos-3), Math.min(line3.length, pos+4));
  console.log('pos', pos, ':', JSON.stringify(ctx));
}
