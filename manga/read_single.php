<?php
require_once __DIR__ . '/../../api/config/Database.php';
require_once __DIR__ . '/../config/headers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = new Database();
    $pdo = $db->pdo;

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        echo json_encode(['error' => true, 'message' => 'Invalid ID']);
        exit;
    }

    $stmt = $pdo->prepare('
        SELECT 
            m.manga_id,
            m.title,
            m.author,
            m.description,
            m.price,
            m.stock,
            m.image,
            m.category_id,
            m.created_at,
            c.name AS category_name,
            CASE 
                WHEN m.image IS NOT NULL AND m.image <> "" 
                THEN CONCAT("http://localhost/MangaStore/uploads/", m.image)
                ELSE "http://localhost/MangaStore/uploads/default.jpg"
            END AS image_url
        FROM manga m
        LEFT JOIN categories c ON m.category_id = c.category_id
        WHERE m.manga_id = ?
    ');
    $stmt->execute([$id]);
    $manga = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($manga) {
        echo json_encode($manga);
    } else {
        echo json_encode(['error' => true, 'message' => 'Manga not found']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
