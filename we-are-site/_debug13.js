const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

const start = js.indexOf('{id:"cardealer"');
const end = js.indexOf('{id:"autoprime"', start);
const section = js.substring(start, end);

// Split by newlines and count quotes per line
const lines = section.split(/\r?\n/);
let cumSum = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const qCount = (line.match(/"/g) || []).length;
  cumSum += qCount;
  console.log('Line', i, ': quotes=' + qCount, 'cum=' + cumSum, 'even=' + (cumSum % 2 === 0), ' ->', line.substring(0, 80));
}
