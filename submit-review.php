<?php
// Basit yorum saklama sistemi - JSON dosyası tabanlı
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONS isteği için
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Yorum dosyası yolu
$reviewsFile = 'reviews.json';

// POST isteği
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSON verisini al
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Veri doğrulama
    if (!isset($input['rating']) && !isset($input['text'])) {
        echo json_encode(['success' => false, 'message' => 'En az puan veya yorum gerekli']);
        exit;
    }
    
    // Yorum verisini hazırla
    $review = [
        'name' => isset($input['name']) && !empty($input['name']) ? htmlspecialchars($input['name']) : 'Anonim',
        'rating' => isset($input['rating']) ? intval($input['rating']) : 0,
        'text' => isset($input['text']) ? htmlspecialchars($input['text']) : '',
        'date' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] // Basit spam koruması için
    ];
    
    // Mevcut yorumları oku
    $reviews = [];
    if (file_exists($reviewsFile)) {
        $reviews = json_decode(file_get_contents($reviewsFile), true) ?: [];
    }
    
    // Yeni yorumu başa ekle
    array_unshift($reviews, $review);
    
    // En fazla 50 yorum tut (performans için)
    if (count($reviews) > 50) {
        $reviews = array_slice($reviews, 0, 50);
    }
    
    // Yorumları kaydet
    if (file_put_contents($reviewsFile, json_encode($reviews, JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'message' => 'Yorum başarıyla kaydedildi']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Yorum kaydedilemedi']);
    }
    exit;
}

// GET isteği - yorumları listele
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $reviews = [];
    if (file_exists($reviewsFile)) {
        $reviews = json_decode(file_get_contents($reviewsFile), true) ?: [];
    }
    echo json_encode(['success' => true, 'reviews' => $reviews]);
    exit;
}
?>