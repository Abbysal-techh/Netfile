<?php
// ============================================
// Netfile - Yorum Gönderme
// ============================================
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config.php';

// Sadece POST kabul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Geçersiz istek']);
    exit;
}

// Verileri al ve temizle
$isim  = trim(strip_tags($_POST['isim'] ?? ''));
$konum = trim(strip_tags($_POST['konum'] ?? ''));
$puan  = (int)($_POST['puan'] ?? 5);
$yorum = trim(strip_tags($_POST['yorum'] ?? ''));
$kvkk  = isset($_POST['kvkk']);

// Doğrulama
if (mb_strlen($isim) < 2 || mb_strlen($isim) > 100) {
    echo json_encode(['success' => false, 'message' => 'İsim 2-100 karakter olmalı']);
    exit;
}
if (mb_strlen($yorum) < 10 || mb_strlen($yorum) > 1000) {
    echo json_encode(['success' => false, 'message' => 'Yorum 10-1000 karakter olmalı']);
    exit;
}
if (!$kvkk) {
    echo json_encode(['success' => false, 'message' => 'Yayın izni vermelisiniz']);
    exit;
}
if ($puan < 1 || $puan > 5) $puan = 5;

// Spam koruması: aynı IP'den 24 saatte en fazla 3 yorum
$ip = $_SERVER['REMOTE_ADDR'] ?? '';

try {
    $stmt = db()->prepare("SELECT COUNT(*) FROM yorumlar WHERE ip = ? AND tarih > (NOW() - INTERVAL 1 DAY)");
    $stmt->execute([$ip]);
    if ($stmt->fetchColumn() >= 3) {
        echo json_encode(['success' => false, 'message' => 'Çok fazla yorum gönderdiniz, lütfen sonra tekrar deneyin.']);
        exit;
    }

    // Kaydet (onayli = 0, yani onay bekliyor)
    $stmt = db()->prepare("INSERT INTO yorumlar (isim, konum, puan, yorum, ip, onayli) VALUES (?, ?, ?, ?, ?, 0)");
    $stmt->execute([$isim, $konum, $puan, $yorum, $ip]);

    // E-posta bildirimi (opsiyonel, XAMPP'te çalışmayabilir)
    $mesaj = "Yeni yorum geldi:\n\n";
    $mesaj .= "İsim: $isim\n";
    $mesaj .= "Konum: $konum\n";
    $mesaj .= "Puan: $puan/5\n";
    $mesaj .= "Yorum: $yorum\n\n";
    $mesaj .= "Onaylamak için: http://netfile.local/netfile/netfileyorumtest/admin-yorumlar.php";
    @mail(BILDIRIM_EMAIL, 'Netfile - Yeni Yorum', $mesaj, "From: noreply@netfile.com.tr\r\nContent-Type: text/plain; charset=UTF-8");

    echo json_encode(['success' => true, 'message' => 'Yorumunuz alındı, onaydan sonra yayınlanacak.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Kayıt sırasında hata oluştu']);
}