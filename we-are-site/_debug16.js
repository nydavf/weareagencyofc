const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

const start = js.indexOf('{id:"cardealer"');
const end = js.indexOf('{id:"autoprime"', start);
const section = js.substring(start, end);

const lines = section.split(/\r?\n/);
const line3 = lines[3];

// Print char by char around the suspicious area (position 325-340)
console.log('Char by char around pos 325-340:');
for (let i = 325; i < 340 && i < line3.length; i++) {
  console.log(`  pos ${i}: char=${JSON.stringify(line3[i])} code=${line3.charCodeAt(i)}`);
}

console.log('\nLine 3 length:', line3.length);
console.log('\nFull line 3:');
console.log(line3);
