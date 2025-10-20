<?php
require_once __DIR__ . '/../config/headers.php';
require_once __DIR__.'/../config/Response.php';
require_once __DIR__.'/../config/Validator.php';

require_once __DIR__ . '/../config/Database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$db = new Database();
$pdo = $db->pdo;

$method = $_SERVER['REQUEST_METHOD'];

try {
  if ($method === 'GET') {
    $stmt = $pdo->query('SELECT user_id, name, email, created_at, role FROM users ORDER BY created_at DESC');
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
    exit;
  }

  $input = json_decode(file_get_contents('php://input'), true) ?? [];

  if ($method === 'POST') {
   
    if (empty($input['user_id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'user_id required']);
      exit;
    }
    $user_id = intval($input['user_id']);
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $role = in_array($input['role'] ?? '', ['user', 'admin']) ? $input['role'] : 'user';

   
    if ($name === '' || $email === '') {
      http_response_code(400);
      echo json_encode(['error' => 'name and email are required']);
      exit;
    }

    
    $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ?, role = ? WHERE user_id = ?');
    $stmt->execute([$name, $email, $role, $user_id]);

    echo json_encode(['success' => true]);
    exit;
  }

  if ($method === 'DELETE') {
    if (empty($input['user_id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'user_id required']);
      exit;
    }
    $user_id = intval($input['user_id']);

  
    $stmt = $pdo->prepare('DELETE FROM users WHERE user_id = ?');
    $stmt->execute([$user_id]);

    echo json_encode(['success' => true]);
    exit;
  }

 
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
