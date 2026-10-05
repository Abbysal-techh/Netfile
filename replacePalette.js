<![CDATA[
const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'teklif.html',
  'urunlerimiz.html',
  'galeri.html',
  'hakkimizda.html',
  'iletisim.html',
];

const repl = {
  '#F0ECDD': '#f6fafd',
  '#8BA3C5': '#72a3bf',
  '#495B7D': '#446e87',
  '#23354D': '#1d4052',
  '#02122F': '#030f18',
  '#0a0f1a': '#030f18',
  '#121929': '#1d4052',
  '#1e2a3d': '#2a4a5e',
};

function applyHexReplacement(content) {
  let updated = content;
  let changed = false;

  for (const [oldHex, newHex] of Object.entries(repl)) {
    const oldUpper = oldHex.toUpperCase();
    const oldLower = oldHex.toLowerCase();

    if (updated.includes(oldHex)) {
      updated = updated.split(oldHex).join(newHex);
      changed = true;
    }
    if (updated.includes(oldUpper)) {
      updated = updated.split(oldUpper).join(newHex);
      changed = true;
    }
    if (updated.includes(oldLower)) {
      updated = updated.split(oldLower).join(newHex);
      changed = true;
    }
  }

  return { updated, changed };
}

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${file} bulunamadı, atlanıyor.`);
    continue;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const { updated, changed } = applyHexReplacement(original);

  if (changed) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ ${file} güncellendi.`);
  } else {
    console.log(`ℹ️ ${file} için değişiklik gerekmedi.`);
  }
}

console.log('🎉 Tüm renk paleti HEX güncelleme işlemi tamamlandı!');
]]>
