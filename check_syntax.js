var fs = require('fs');
var content = fs.readFileSync('/home/ubuntu/mini-car-game/index.html', 'utf8');
var scripts = [];
var startTag = '<script';
var endTag = '</script>';
var pos = 0;
while (true) {
  var start = content.indexOf(startTag, pos);
  if (start === -1) break;
  // Check it's not a src script
  var tagEnd = content.indexOf('>', start);
  var tagContent = content.slice(start, tagEnd + 1);
  if (tagContent.indexOf('src=') === -1) {
    var bodyStart = tagEnd + 1;
    var bodyEnd = content.indexOf(endTag, bodyStart);
    scripts.push(content.slice(bodyStart, bodyEnd));
    pos = bodyEnd + endTag.length;
  } else {
    pos = tagEnd + 1;
  }
}
console.log('Found', scripts.length, 'inline script blocks');
var allJs = scripts.join('\n');
try {
  new Function(allJs);
  console.log('Syntax OK - no errors');
} catch(e) {
  console.error('Syntax error:', e.message);
  // Find approximate line
  var lines = allJs.split('\n');
  var lineMatch = e.stack.match(/:(\d+):/);
  if (lineMatch) {
    var lineNum = parseInt(lineMatch[1]) - 2; // offset for Function wrapper
    console.log('Near line', lineNum, ':', lines[lineNum - 1]);
    console.log('Context:');
    for (var i = Math.max(0, lineNum-3); i < Math.min(lines.length, lineNum+3); i++) {
      console.log(i+1, ':', lines[i]);
    }
  }
}
