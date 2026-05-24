const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const regex = /onClick=\{([\s\S]*?)\}/g;
let match;
while ((match = regex.exec(content)) !== null) {
  let inner = match[1].trim();
  if (inner.includes('\n')) inner = inner.split('\n')[0] + ' ...';
  console.log(inner);
}
