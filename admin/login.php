<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';

startSecureSession();

if (!empty($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim((string) ($_POST['email'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if (!validCsrfToken($_POST['csrf_token'] ?? null)) {
        $error = 'Oturum doğrulanamadı. Lütfen sayfayı yenileyip tekrar deneyin.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        $error = 'Geçerli bir e-posta adresi ve şifre girin.';
    } else {
        $statement = db()->prepare(
            'SELECT id, name, email, password_hash, role
             FROM users
             WHERE email = :email
             LIMIT 1'
        );
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int) $user['id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

            header('Location: dashboard.php');
            exit;
        }

        $error = 'E-posta adresi veya şifre hatalı.';
    }
}
?>
<!doctype html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Yönetim Paneli | Giriş</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="login-page">
    <main class="login-shell">
        <section class="brand-panel" aria-label="Panel tanıtımı">
            <a class="brand" href="../index.html">
                <span class="brand-mark" aria-hidden="true">A</span>
                <span>Antalya Net</span>
            </a>
            <div class="brand-copy">
                <p class="eyebrow">Güvenli yönetim alanı</p>
                <h1>Hesabınıza hoş geldiniz.</h1>
                <p>Siparişlerinizi ve destek taleplerinizi tek ekrandan takip edin.</p>
            </div>
            <p class="brand-foot">Yetkinize göre kişiselleştirilmiş görünüm</p>
        </section>

        <section class="login-card">
            <div class="mobile-brand">
                <span class="brand-mark" aria-hidden="true">A</span>
                <span>Antalya Net</span>
            </div>
            <p class="eyebrow">Panel girişi</p>
            <h2>Tekrar merhaba</h2>
            <p class="muted">Devam etmek için hesap bilgilerinizi girin.</p>

            <?php if ($error !== ''): ?>
                <div class="alert" role="alert"><?= e($error) ?></div>
            <?php endif; ?>

            <form method="post" action="login.php" class="login-form">
                <input type="hidden" name="csrf_token" value="<?= e(csrfToken()) ?>">

                <label for="email">E-posta adresi</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    placeholder="ornek@site.com"
                    value="<?= e($email) ?>"
                    required
                    autofocus
                >

                <label for="password">Şifre</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Şifrenizi girin"
                    required
                >

                <button type="submit">Giriş yap <span aria-hidden="true">→</span></button>
            </form>

            <p class="login-note">Giriş bilgileriniz şifreli bağlantı üzerinden doğrulanır.</p>
        </section>
    </main>
</body>
</html>

