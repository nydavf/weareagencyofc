const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

const start = js.indexOf('{id:"cardealer"');
const end = js.indexOf('{id:"autoprime"', start);
const section = js.substring(start, end);

const lines = section.split(/\r?\n/);
const line3 = lines[3]; // products line

// Find all " positions
let positions = [];
for (let i = 0; i < line3.length; i++) {
  if (line3[i] === '"') {
    positions.push(i);
  }
}

console.log('Line 3 has', positions.length, 'quotes');
console.log('Line 3:');
console.log(line3);
console.log('Quote positions:', JSON.stringify(positions));
