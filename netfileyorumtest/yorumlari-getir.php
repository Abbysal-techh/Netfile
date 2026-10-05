<?php
// ============================================
// Netfile - Onaylı Yorumları Getir
// ============================================
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config.php';

try {
    $stmt = db()->query("
        SELECT isim, konum, puan, yorum,
               DATE_FORMAT(tarih, '%d.%m.%Y') AS tarih
        FROM yorumlar
        WHERE onayli = 1
        ORDER BY tarih DESC
        LIMIT 50
    ");
    echo json_encode($stmt->fetchAll(), JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([]);
}