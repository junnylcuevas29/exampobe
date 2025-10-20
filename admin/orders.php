<?php
require_once __DIR__ . '/../config/headers.php';

require_once __DIR__ . '/../config/Database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$db = new Database();
$pdo = $db->pdo;

try {
  
  $stmt = $pdo->query("
    SELECT o.order_id, o.user_id, u.name AS user_name, o.total, o.created_at
    FROM orders o
    JOIN users u ON u.user_id = o.user_id
    ORDER BY o.created_at DESC
  ");
  $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

  
  $stmtItems = $pdo->prepare("
    SELECT oi.order_item_id, oi.order_id, oi.manga_id, m.title, oi.qty, oi.price
    FROM order_items oi
    JOIN manga m ON m.manga_id = oi.manga_id
    WHERE oi.order_id = ?
  ");

  foreach ($orders as &$o) {
    $stmtItems->execute([$o['order_id']]);
    $o['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
  }

  echo json_encode($orders);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
