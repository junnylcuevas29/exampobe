<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/headers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = new Database();
    $pdo = $db->pdo;

    
    $usersStmt = $pdo->query("SELECT COUNT(*) AS total_users FROM users");
    $users = $usersStmt->fetch()['total_users'];

    
    $revenueStmt = $pdo->query("SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders");
    $revenue = $revenueStmt->fetch()['total_revenue'];

    
    $ordersStmt = $pdo->query("SELECT COUNT(*) AS total_orders FROM orders");
    $total_orders = $ordersStmt->fetch()['total_orders'];

    
    $topStmt = $pdo->query("
        SELECT m.title, SUM(oi.qty) AS total_sold
        FROM order_items oi
        JOIN manga m ON m.manga_id = oi.manga_id
        GROUP BY m.title
        ORDER BY total_sold DESC
        LIMIT 1
    ");
    $top = $topStmt->fetch() ?: ['title' => 'No sales yet', 'total_sold' => 0];

    
    $lowStockStmt = $pdo->query("SELECT COUNT(*) AS low_stock FROM manga WHERE stock <= 5");
    $low_stock = $lowStockStmt->fetch()['low_stock'];

   
    $recentOrdersStmt = $pdo->query("
        SELECT o.order_id, u.name AS user_name, o.total, o.created_at
        FROM orders o
        JOIN users u ON u.user_id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 5
    ");
    $recent_orders = $recentOrdersStmt->fetchAll();

    echo json_encode([
        'total_users' => $users,
        'total_revenue' => $revenue,
        'total_orders' => $total_orders,
        'top_selling' => $top,
        'low_stock' => $low_stock,
        'recent_orders' => $recent_orders
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
