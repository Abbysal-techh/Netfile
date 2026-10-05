<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';

startSecureSession();
requireLogin();

$pdo = db();
$userId = (int) $_SESSION['user_id'];
$admin = isAdmin();

if ($admin) {
    $users = $pdo->query(
        'SELECT id, name, email, role, created_at
         FROM users
         ORDER BY created_at DESC'
    )->fetchAll();

    $orders = $pdo->query(
        'SELECT orders.id, orders.order_no, orders.product_name, orders.amount,
                orders.status, orders.created_at, users.name AS user_name,
                users.email AS user_email
         FROM orders
         INNER JOIN users ON users.id = orders.user_id
         ORDER BY orders.created_at DESC'
    )->fetchAll();

    $questions = $pdo->query(
        'SELECT questions.id, questions.subject, questions.message,
                questions.status, questions.created_at, users.name AS user_name,
                users.email AS user_email
         FROM questions
         INNER JOIN users ON users.id = questions.user_id
         ORDER BY questions.created_at DESC'
    )->fetchAll();
} else {
    $userStatement = $pdo->prepare(
        'SELECT id, name, email, role, created_at
         FROM users
         WHERE id = :user_id
         LIMIT 1'
    );
    $userStatement->execute(['user_id' => $userId]);
    $users = [$userStatement->fetch()];

    $orderStatement = $pdo->prepare(
        'SELECT id, order_no, product_name, amount, status, created_at
         FROM orders
         WHERE user_id = :user_id
         ORDER BY created_at DESC'
    );
    $orderStatement->execute(['user_id' => $userId]);
    $orders = $orderStatement->fetchAll();

    $questionStatement = $pdo->prepare(
        'SELECT id, subject, message, status, created_at
         FROM questions
         WHERE user_id = :user_id
         ORDER BY created_at DESC'
    );
    $questionStatement->execute(['user_id' => $userId]);
    $questions = $questionStatement->fetchAll();
}

function statusLabel(string $status): string
{
    $labels = [
        'pending' => 'Bekliyor',
        'processing' => 'Hazırlanıyor',
        'completed' => 'Tamamlandı',
        'cancelled' => 'İptal',
        'open' => 'Açık',
        'answered' => 'Yanıtlandı',
        'closed' => 'Kapalı',
    ];

    return $labels[$status] ?? $status;
}

function formatDate(string $date): string
{
    return date('d.m.Y H:i', strtotime($date));
}
?>
<!doctype html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Yönetim Paneli | Kontrol Merkezi</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="dashboard-page">
    <div class="dashboard-shell">
        <aside class="sidebar">
            <a class="brand" href="dashboard.php">
                <span class="brand-mark" aria-hidden="true">A</span>
                <span>Antalya Net</span>
            </a>
            <nav aria-label="Panel menüsü">
                <a class="nav-link active" href="#overview"><span aria-hidden="true">⌂</span> Genel bakış</a>
                <?php if ($admin): ?>
                    <a class="nav-link" href="#users"><span aria-hidden="true">♙</span> Kullanıcılar</a>
                <?php endif; ?>
                <a class="nav-link" href="#orders"><span aria-hidden="true">□</span> Siparişler</a>
                <a class="nav-link" href="#questions"><span aria-hidden="true">?</span> Sorular</a>
            </nav>
            <div class="sidebar-user">
                <div class="avatar"><?= e(mb_strtoupper(mb_substr((string) $_SESSION['name'], 0, 1))) ?></div>
                <div>
                    <strong><?= e((string) $_SESSION['name']) ?></strong>
                    <span><?= $admin ? 'Yönetici' : 'Kullanıcı' ?></span>
                </div>
            </div>
        </aside>

        <main class="dashboard-main">
            <header class="topbar">
                <div>
                    <p class="eyebrow"><?= $admin ? 'Yönetici görünümü' : 'Hesabım' ?></p>
                    <h1>Merhaba, <?= e((string) $_SESSION['name']) ?></h1>
                </div>
                <form method="post" action="logout.php">
                    <input type="hidden" name="csrf_token" value="<?= e(csrfToken()) ?>">
                    <button type="submit" class="logout-button">Çıkış yap</button>
                </form>
            </header>

            <section id="overview" class="summary-grid" aria-label="Özet bilgiler">
                <article class="summary-card accent-card">
                    <span class="summary-icon" aria-hidden="true">□</span>
                    <div>
                        <p><?= $admin ? 'Toplam sipariş' : 'Siparişlerim' ?></p>
                        <strong><?= count($orders) ?></strong>
                    </div>
                </article>
                <article class="summary-card">
                    <span class="summary-icon" aria-hidden="true">?</span>
                    <div>
                        <p><?= $admin ? 'Toplam soru' : 'Sorularım' ?></p>
                        <strong><?= count($questions) ?></strong>
                    </div>
                </article>
                <article class="summary-card">
                    <span class="summary-icon" aria-hidden="true"><?= $admin ? '♙' : '✓' ?></span>
                    <div>
                        <p><?= $admin ? 'Kayıtlı kullanıcı' : 'Hesap türü' ?></p>
                        <strong><?= $admin ? count($users) : 'Standart' ?></strong>
                    </div>
                </article>
            </section>

            <?php if ($admin): ?>
                <section id="users" class="panel-section">
                    <div class="section-heading">
                        <div>
                            <p class="eyebrow">Kayıtlar</p>
                            <h2>Kullanıcılar</h2>
                        </div>
                        <span class="count-pill"><?= count($users) ?> kişi</span>
                    </div>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ad soyad</th>
                                    <th>E-posta</th>
                                    <th>Rol</th>
                                    <th>Kayıt tarihi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td><strong><?= e($user['name']) ?></strong></td>
                                        <td><?= e($user['email']) ?></td>
                                        <td><span class="role-badge"><?= $user['role'] === 'admin' ? 'Yönetici' : 'Kullanıcı' ?></span></td>
                                        <td><?= e(formatDate($user['created_at'])) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </section>
            <?php else: ?>
                <section class="panel-section profile-panel">
                    <div class="section-heading">
                        <div>
                            <p class="eyebrow">Profil</p>
                            <h2>Hesap bilgilerim</h2>
                        </div>
                    </div>
                    <dl class="profile-grid">
                        <div><dt>Ad soyad</dt><dd><?= e($users[0]['name']) ?></dd></div>
                        <div><dt>E-posta</dt><dd><?= e($users[0]['email']) ?></dd></div>
                        <div><dt>Üyelik tarihi</dt><dd><?= e(formatDate($users[0]['created_at'])) ?></dd></div>
                    </dl>
                </section>
            <?php endif; ?>

            <section id="orders" class="panel-section">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">Satış takibi</p>
                        <h2><?= $admin ? 'Tüm siparişler' : 'Siparişlerim' ?></h2>
                    </div>
                    <span class="count-pill"><?= count($orders) ?> kayıt</span>
                </div>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Sipariş no</th>
                                <?php if ($admin): ?><th>Müşteri</th><?php endif; ?>
                                <th>Ürün</th>
                                <th>Tutar</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ($orders === []): ?>
                                <tr><td colspan="<?= $admin ? 6 : 5 ?>" class="empty-state">Henüz sipariş kaydı yok.</td></tr>
                            <?php endif; ?>
                            <?php foreach ($orders as $order): ?>
                                <tr>
                                    <td><strong><?= e($order['order_no']) ?></strong></td>
                                    <?php if ($admin): ?>
                                        <td><?= e($order['user_name']) ?><small><?= e($order['user_email']) ?></small></td>
                                    <?php endif; ?>
                                    <td><?= e($order['product_name']) ?></td>
                                    <td><?= number_format((float) $order['amount'], 2, ',', '.') ?> ₺</td>
                                    <td><span class="status status-<?= e($order['status']) ?>"><?= e(statusLabel($order['status'])) ?></span></td>
                                    <td><?= e(formatDate($order['created_at'])) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </section>

            <section id="questions" class="panel-section">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">Destek merkezi</p>
                        <h2><?= $admin ? 'Tüm sorular' : 'Sorularım' ?></h2>
                    </div>
                    <span class="count-pill"><?= count($questions) ?> kayıt</span>
                </div>
                <div class="question-list">
                    <?php if ($questions === []): ?>
                        <p class="empty-state">Henüz soru kaydı yok.</p>
                    <?php endif; ?>
                    <?php foreach ($questions as $question): ?>
                        <article class="question-card">
                            <div class="question-head">
                                <div>
                                    <h3><?= e($question['subject']) ?></h3>
                                    <?php if ($admin): ?>
                                        <p><?= e($question['user_name']) ?> · <?= e($question['user_email']) ?></p>
                                    <?php endif; ?>
                                </div>
                                <span class="status status-<?= e($question['status']) ?>"><?= e(statusLabel($question['status'])) ?></span>
                            </div>
                            <p><?= nl2br(e($question['message'])) ?></p>
                            <time datetime="<?= e($question['created_at']) ?>"><?= e(formatDate($question['created_at'])) ?></time>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>
        </main>
    </div>
</body>
</html>

