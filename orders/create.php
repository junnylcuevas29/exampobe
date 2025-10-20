<?php
require_once __DIR__ . '/../config/headers.php';
require_once __DIR__.'/../config/Response.php';
require_once __DIR__.'/../config/Validator.php';

require_once __DIR__.'/../config/Database.php';
$db = new Database(); $pdo = $db->pdo;
$data = json_decode(file_get_contents('php://input'), true);
if (!$data['user_id'] || !$data['items']) { http_response_code(400); echo json_encode(['error'=>'Invalid']); exit;}
$pdo->beginTransaction();
try{
  $stmt = $pdo->prepare('INSERT INTO orders (user_id,total,created_at) VALUES (?, ?, NOW())');
  $stmt->execute([$data['user_id'], $data['total']]);
  $order_id = $pdo->lastInsertId();
  $stmtIt = $pdo->prepare('INSERT INTO order_items (order_id,manga_id,qty,price) VALUES (?,?,?,?)');
  foreach ($data['items'] as $it){
    $stmtIt->execute([$order_id, $it['manga_id'], $it['qty'], $it['price']]);
    // update stock
    $pdo->prepare('UPDATE manga SET stock = stock - ? WHERE manga_id = ?')->execute([$it['qty'], $it['manga_id']]);
  }
  $pdo->commit();
  echo json_encode(['order_id'=>$order_id]);
}catch(Exception $e){
  $pdo->rollBack();
  http_response_code(500);
  echo json_encode(['error'=>$e->getMessage()]);
}
