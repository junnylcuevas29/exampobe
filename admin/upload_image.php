<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$upload_dir = __DIR__ . '/../../uploads/';
if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . strtolower($ext);
    $target = $upload_dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $target)) {
        echo json_encode(['filename' => $filename]);
    } else {
        echo json_encode(['error' => 'Failed to upload file']);
    }
    exit;
}

echo json_encode(['error' => 'No image uploaded']);
?>
