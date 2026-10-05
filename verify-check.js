const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
const checks = {
  appLine: /<script\s+src=['\"]app\.js['\"]><\/script>/.test(html),
  helper: /function\s+buildResponsiveSrcset\(/.test(js),
  dataSrc: /data-src=/.test(html),
  badScript: /<script\s+pp\.js>|asrc=/.test(html)
};
console.log(JSON.stringify(checks));
