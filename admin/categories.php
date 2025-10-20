<?php
require_once __DIR__ . '/../config/headers.php';

require_once __DIR__ . '/../config/Database.php';
$db = new Database();
$pdo = $db->pdo;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $stmt = $pdo->query('SELECT category_id, name FROM categories ORDER BY name ASC');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
