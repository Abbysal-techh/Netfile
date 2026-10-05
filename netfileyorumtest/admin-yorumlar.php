<?php
// ============================================
// Netfile - Yorum Yönetim Paneli
// ============================================
require_once __DIR__ . '/config.php';
session_start();

// --- Giriş ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['sifre'])) {
    if ($_POST['sifre'] === ADMIN_PASS) {
        $_SESSION['admin'] = true;
        header('Location: admin-yorumlar.php');
        exit;
    } else {
        $hata = 'Yanlış şifre';
    }
}

// --- Çıkış ---
if (isset($_GET['cikis'])) {
    session_destroy();
    header('Location: admin-yorumlar.php');
    exit;
}

// --- Giriş yapılmamışsa form göster ---
if (empty($_SESSION['admin'])) {
    ?>
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <title>Admin Giriş - Netfile</title>
        <meta name="robots" content="noindex, nofollow">
        <style>
            body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f6fafd}
            form{background:#fff;padding:36px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.1);width:340px}
            h2{margin:0 0 24px;color:#030f18;text-align:center}
            input{width:100%;padding:14px;margin:8px 0;border:1px solid #ccc;border-radius:10px;box-sizing:border-box;font-size:16px}
            button{width:100%;padding:14px;background:#446e87;color:#fff;border:0;border-radius:10px;font-weight:bold;cursor:pointer;font-size:16px;margin-top:8px}
            button:hover{background:#35566b}
            .hata{color:#dc2626;font-size:14px;text-align:center;margin-top:12px}
        </style>
    </head>
    <body>
    <form method="POST">
        <h2>🔒 Admin Girişi</h2>
        <input type="password" name="sifre" placeholder="Şifre" required autofocus>
        <button type="submit">Giriş Yap</button>
        <?php if (!empty($hata)) echo '<p class="hata">' . htmlspecialchars($hata) . '</p>'; ?>
    </form>
    </body>
    </html>
    <?php
    exit;
}

// --- Onayla / Reddet / Sil ---
if (isset($_GET['onayla'])) {
    db()->prepare("UPDATE yorumlar SET onayli = 1 WHERE id = ?")->execute([(int)$_GET['onayla']]);
    header('Location: admin-yorumlar.php');
    exit;
}
if (isset($_GET['reddet'])) {
    db()->prepare("DELETE FROM yorumlar WHERE id = ?")->execute([(int)$_GET['reddet']]);
    header('Location: admin-yorumlar.php');
    exit;
}
if (isset($_GET['sil'])) {
    db()->prepare("DELETE FROM yorumlar WHERE id = ?")->execute([(int)$_GET['sil']]);
    header('Location: admin-yorumlar.php');
    exit;
}

// --- Yorumları çek ---
$bekleyen = db()->query("SELECT * FROM yorumlar WHERE onayli = 0 ORDER BY tarih DESC")->fetchAll();
$onayli   = db()->query("SELECT * FROM yorumlar WHERE onayli = 1 ORDER BY tarih DESC LIMIT 100")->fetchAll();
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Yorum Yönetimi - Netfile</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        *{box-sizing:border-box}
        body{font-family:system-ui,sans-serif;background:#f6fafd;margin:0;padding:24px;color:#030f18}
        .konteyner{max-width:900px;margin:0 auto}
        .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        h1{margin:0;font-size:24px}
        .cikis{background:#dc2626;color:#fff;padding:10px 20px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:bold}
        .cikis:hover{background:#b91c1c}
        .grup{background:#fff;padding:24px;border-radius:16px;margin-bottom:24px;box-shadow:0 2px 10px rgba(0,0,0,.05)}
        .grup h2{margin:0 0 16px;font-size:18px;color:#030f18;border-bottom:2px solid #e5e7eb;padding-bottom:12px}
        .kart{border:1px solid #e5e7eb;border-radius:12px;padding:18px;margin-bottom:14px;background:#fafbfc}
        .kart:last-child{margin-bottom:0}
        .kart .isim{font-weight:bold;color:#030f18;font-size:16px}
        .kart .meta{font-size:12px;color:#666;margin:6px 0 10px}
        .kart .yorum{margin:10px 0 14px;line-height:1.6;color:#374151}
        .kart .aksiyon{display:flex;gap:8px;flex-wrap:wrap}
        .kart .aksiyon a{padding:8px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:bold;transition:.2s}
        .onayla{background:#16a34a;color:#fff}
        .onayla:hover{background:#15803d}
        .reddet{background:#f59e0b;color:#fff}
        .reddet:hover{background:#d97706}
        .sil{background:#dc2626;color:#fff}
        .sil:hover{background:#b91c1c}
        .bos{color:#999;font-style:italic;text-align:center;padding:20px}
        .yildiz{color:#facc15;font-size:16px}
        .sayac{background:#446e87;color:#fff;font-size:12px;padding:3px 10px;border-radius:12px;margin-left:8px;font-weight:bold}
    </style>
</head>
<body>
    <div class="konteyner">
        <div class="top">
            <h1>📋 Yorum Yönetimi</h1>
            <a href="?cikis=1" class="cikis">Çıkış Yap</a>
        </div>

        <!-- Onay Bekleyenler -->
        <div class="grup">
            <h2>⏳ Onay Bekleyen Yorumlar <span class="sayac"><?= count($bekleyen) ?></span></h2>
            <?php if (empty($bekleyen)): ?>
                <p class="bos">Onay bekleyen yorum yok.</p>
            <?php else: foreach ($bekleyen as $y): ?>
                <div class="kart">
                    <div class="isim">
                        <?= htmlspecialchars($y['isim']) ?>
                        <?= $y['konum'] ? ' - ' . htmlspecialchars($y['konum']) : '' ?>
                    </div>
                    <div class="meta">
                        <span class="yildiz"><?= str_repeat('★', $y['puan']) . str_repeat('☆', 5 - $y['puan']) ?></span>
                        · <?= htmlspecialchars($y['tarih']) ?>
                        · IP: <?= htmlspecialchars($y['ip']) ?>
                    </div>
                    <div class="yorum"><?= nl2br(htmlspecialchars($y['yorum'])) ?></div>
                    <div class="aksiyon">
                        <a href="?onayla=<?= $y['id'] ?>" class="onayla">✓ Onayla</a>
                        <a href="?reddet=<?= $y['id'] ?>" class="reddet" onclick="return confirm('Reddetmek istediğinize emin misiniz?')">✗ Reddet</a>
                    </div>
                </div>
            <?php endforeach; endif; ?>
        </div>

        <!-- Onaylılar -->
        <div class="grup">
            <h2>✅ Onaylı Yorumlar <span class="sayac"><?= count($onayli) ?></span></h2>
            <?php if (empty($onayli)): ?>
                <p class="bos">Henüz onaylı yorum yok.</p>
            <?php else: foreach ($onayli as $y): ?>
                <div class="kart">
                    <div class="isim">
                        <?= htmlspecialchars($y['isim']) ?>
                        <?= $y['konum'] ? ' - ' . htmlspecialchars($y['konum']) : '' ?>
                    </div>
                    <div class="meta">
                        <span class="yildiz"><?= str_repeat('★', $y['puan']) ?></span>
                        · <?= htmlspecialchars($y['tarih']) ?>
                    </div>
                    <div class="yorum"><?= nl2br(htmlspecialchars($y['yorum'])) ?></div>
                    <div class="aksiyon">
                        <a href="?sil=<?= $y['id'] ?>" class="sil" onclick="return confirm('Silmek istediğinize emin misiniz?')">🗑 Sil</a>
                    </div>
                </div>
            <?php endforeach; endif; ?>
        </div>
    </div>
</body>
</html>