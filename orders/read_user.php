<?php
require_once __DIR__ . '/../config/headers.php';
require_once __DIR__.'/../config/Response.php';
require_once __DIR__.'/../config/Validator.php';

require_once __DIR__ . '/../config/Database.php';
$db = new Database();
$pdo = $db->pdo;

$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing user_id']);
  exit;
}

$stmt = $pdo->prepare('SELECT order_id, total, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC');
$stmt->execute([$user_id]);
echo json_encode($stmt->fetchAll());
