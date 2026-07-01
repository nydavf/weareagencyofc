const fs = require('fs');
const c = fs.readFileSync('C:/Users/ELIAS PGON/we-are-site/index.html', 'utf8');
const m = c.match(/<script>([\s\S]*?)<\/script>/);
const js = m[1];

// Analyze the models array - track each model's brace/bracket balance
const modelIds = ['barberking', 'modaluxo', 'solarprime', 'cardealer', 'autoprime', 'vidafit', 'saudeplus', 'homevision', 'saborarte'];

let prevEnd = js.indexOf('const models = [');
let inStr = false, esc = false, strChar = '';

// Count braces and brackets for each model
for (const id of modelIds) {
  const start = js.indexOf('{id:"' + id + '"', prevEnd);
  if (start === -1) { console.log('Could not find model:', id, 'after position', prevEnd); continue; }
  // Find the next model start or end of array
  const nextId = modelIds[modelIds.indexOf(id) + 1];
  let end;
  if (nextId) {
    end = js.indexOf('{id:"' + nextId + '"', start);
  } else {
    end = js.indexOf('];', start) + 1;
  }
  if (end === -1 || end === 0) {
    console.log('Could not find end for model:', id);
    continue;
  }
  const section = js.substring(start, end);
  let bDepth = 0, cDepth = 0;
  let inStr2 = false, esc2 = false, strChar2 = '';
  for (let i = 0; i < section.length; i++) {
    const ch = section[i];
    if (esc2) { esc2 = false; continue; }
    if (ch === '\\') { esc2 = true; continue; }
    if (inStr2) {
      if (ch === strChar2 && !esc2) inStr2 = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr2 = true; strChar2 = ch; continue; }
    if (ch === '[') bDepth++;
    if (ch === ']') bDepth--;
    if (ch === '{') cDepth++;
    if (ch === '}') cDepth--;
  }
  const unbalanced = (bDepth !== 0 || cDepth !== 0);
  console.log(id + ': ' + 'brackets=' + (bDepth === 0 ? 'OK' : 'IMBALANCE:' + bDepth) + ' braces=' + (cDepth === 0 ? 'OK' : 'IMBALANCE:' + cDepth) + ' len=' + section.length);
  if (unbalanced) {
    console.log('  Section last 100 chars:', JSON.stringify(section.substring(section.length-100)));
  }
  prevEnd = end;
}
