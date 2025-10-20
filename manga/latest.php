<?php
require_once __DIR__ . '/../../api/config/Database.php';
require_once __DIR__ . '/../config/headers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = new Database();
    $pdo = $db->pdo;
    $baseURL = 'http://localhost/MangaStore/uploads/';

    $stmt = $pdo->query("
        SELECT 
            m.*, 
            c.name AS category_name,
            CASE 
                WHEN m.image IS NOT NULL AND m.image <> '' 
                THEN CONCAT('$baseURL', m.image)
                ELSE CONCAT('$baseURL', 'default.jpg')
            END AS image_url
        FROM manga m
        LEFT JOIN categories c ON m.category_id = c.category_id
        ORDER BY m.created_at DESC
        LIMIT 8
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
