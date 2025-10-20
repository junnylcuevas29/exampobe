<?php
require_once __DIR__ . '/../config/headers.php';
require_once __DIR__.'/../config/Response.php';
require_once __DIR__.'/../config/Validator.php';

require_once __DIR__.'/../config/Database.php';
$db = new Database();
$pdo = $db->pdo;

$data = json_decode(file_get_contents('php://input'), true);


$stmt = $pdo->prepare('SELECT user_id, name, email, password, role FROM users WHERE email = ?');
$stmt->execute([$data['email']]);
$user = $stmt->fetch();

if (!$user || !password_verify($data['password'], $user['password'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Invalid credentials']);
  exit;
}


unset($user['password']);

echo json_encode(['user' => $user]);
