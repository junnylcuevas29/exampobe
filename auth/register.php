<?php
require_once __DIR__ . '/../config/headers.php';
require_once __DIR__.'/../config/Response.php';
require_once __DIR__.'/../config/Validator.php';

require_once __DIR__.'/../config/Database.php';
$db = new Database(); $pdo = $db->pdo;
$data = json_decode(file_get_contents('php://input'), true);
if (!$data['email'] || !$data['password']) { http_response_code(400); echo json_encode(['error'=>'Invalid']); exit;}
$hash = password_hash($data['password'], PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name,email,password) VALUES (?, ?, ?)');
$stmt->execute([$data['name'],$data['email'],$hash]);
echo json_encode(['success'=>true]);
