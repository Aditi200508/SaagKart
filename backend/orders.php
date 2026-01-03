<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success'=>false,'message'=>'Method not allowed']);
    exit;
}
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) { echo json_encode(['success'=>false,'message'=>'Invalid JSON']); exit; }

$customer_name = trim($data['customer_name'] ?? '');
$customer_email = trim($data['customer_email'] ?? '');
$customer_phone = trim($data['customer_phone'] ?? '');
$customer_address = trim($data['customer_address'] ?? '');
$cart = $data['cart'] ?? [];
$total = floatval($data['total'] ?? 0);

if ($customer_name === '' || $customer_email === '' || empty($cart)) {
    echo json_encode(['success'=>false,'message'=>'Missing required fields']);
    exit;
}

$cart_json = json_encode($cart, JSON_UNESCAPED_UNICODE);
$order_ref = 'SK' . time() . rand(10,99);
$status = 'pending';

$stmt = $conn->prepare("INSERT INTO orders (order_ref,customer_name,customer_email,customer_phone,customer_address,cart,total,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param('sssssdss', $order_ref, $customer_name, $customer_email, $customer_phone, $customer_address, $cart_json, $total, $status);

if ($stmt->execute()) {
    echo json_encode(['success'=>true,'order_ref'=>$order_ref,'order_id'=>$stmt->insert_id]);
} else {
    echo json_encode(['success'=>false,'message'=>'DB insert failed']);
}
$stmt->close();
$conn->close();
