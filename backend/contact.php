<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/db_connect.php';

// IMPORTANT: Check if connection works
if ($conn === null || $conn->connect_error) {
    echo json_encode(['success'=>false,'message'=>'DB connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success'=>false,'message'=>'Method not allowed']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '') {
    echo json_encode(['success'=>false,'message'=>'Name and email required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO contact (name,email,message) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $name, $email, $message);

if ($stmt->execute()) {
    echo json_encode(['success'=>true,'contact_id'=>$stmt->insert_id]);
} else {
    echo json_encode(['success'=>false,'message'=>'DB insert failed: '.$stmt->error]);
}

$stmt->close();
$conn->close();
?>
