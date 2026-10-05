from pathlib import Path
files = [
    'index.html','galeri.html','hakkimizda.html','iletisim.html','urunlerimiz.html','teklif.html',
    'balkon-filesi.html','kedi-filesi.html','kus-filesi.html','insaat-filesi.html','merdiven-boslugu-filesi.html'
]
root = Path('.')
for name in files:
    p = root / name
    if not p.exists():
        print(f'MISSING={name}')
        continue
    t = p.read_text(encoding='utf-8')
    print('FILE=' + name)
    print('COOKIE_BANNER=' + ('YES' if '<div id="cookie-banner"' in t else 'NO'))
    print('POLICY_LINK=' + ('YES' if 'cerez-politikasi.html' in t else 'NO'))
    print('ANIMATION=' + ('YES' if '@keyframes fadeInUp' in t else 'NO'))
policy = root / 'cerez-politikasi.html'
print('POLICY_FILE_EXISTS=' + ('YES' if policy.exists() else 'NO'))
