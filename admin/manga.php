<?php
require_once __DIR__ . '/../config/headers.php';
require_once __DIR__ . '/../config/Database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$db = new Database();
$pdo = $db->pdo;
$method = $_SERVER['REQUEST_METHOD'];


$uploadDir = __DIR__ . '/../../../uploads/';
$baseURL = 'http://localhost/MangaStore/uploads/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

try {
    
    if ($method === 'GET') {
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
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

   
    if ($method === 'POST') {
        $manga_id = $_POST['manga_id'] ?? null;
        $title = trim($_POST['title'] ?? '');
        $price = isset($_POST['price']) ? floatval($_POST['price']) : null;
        $author = trim($_POST['author'] ?? '');
        $description = $_POST['description'] ?? '';
        $stock = intval($_POST['stock'] ?? 0);
        $category_id = intval($_POST['category_id'] ?? 0);
        $imageName = null;

        if ($title === '' || $price === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Title and price are required']);
            exit;
        }

       
        if (!empty($_FILES['image']['name'])) {
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];
            $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));

            if (!in_array($ext, $allowed)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid image type. Allowed: jpg, jpeg, png, gif']);
                exit;
            }

            $imageName = uniqid('manga_', true) . '.' . $ext;
            $uploadPath = $uploadDir . $imageName;
            move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath);
        }

        
        if ($manga_id) {
            
            if ($imageName) {
                $stmt = $pdo->prepare('SELECT image FROM manga WHERE manga_id = ?');
                $stmt->execute([$manga_id]);
                $oldImage = $stmt->fetchColumn();
                if ($oldImage && file_exists($uploadDir . $oldImage)) {
                    unlink($uploadDir . $oldImage);
                }
            }

            
            $sql = 'UPDATE manga 
                    SET title=?, author=?, description=?, price=?, stock=?, category_id=?';
            $params = [$title, $author, $description, $price, $stock, $category_id];

            if ($imageName) {
                $sql .= ', image=?';
                $params[] = $imageName;
            }

            $sql .= ' WHERE manga_id=?';
            $params[] = $manga_id;

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['success' => true, 'message' => 'Manga updated successfully']);
            exit;
        }

        
        $stmt = $pdo->prepare("
            INSERT INTO manga (title, author, description, price, stock, image, category_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$title, $author, $description, $price, $stock, $imageName, $category_id]);

        echo json_encode([
            'success' => true,
            'manga_id' => $pdo->lastInsertId(),
            'image_url' => $imageName ? $baseURL . $imageName : $baseURL . 'default.jpg'
        ]);
        exit;
    }

    
    if ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['manga_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'manga_id required']);
            exit;
        }

        $manga_id = intval($data['manga_id']);
        $stmt = $pdo->prepare('SELECT image FROM manga WHERE manga_id = ?');
        $stmt->execute([$manga_id]);
        $img = $stmt->fetchColumn();

        if ($img && file_exists($uploadDir . $img)) {
            unlink($uploadDir . $img);
        }

        $stmt = $pdo->prepare('DELETE FROM manga WHERE manga_id = ?');
        $stmt->execute([$manga_id]);
        echo json_encode(['success' => true, 'message' => 'Manga deleted successfully']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
