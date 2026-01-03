<?php
// db_connect.php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'saagkart_db';
$DB_PORT = 3307;

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
if ($conn->connect_error) {
    http_response_code(500);
    error_log('MySQL Connection Error: ' . $conn->connect_error);
    echo json_encode(['success'=>false,'message'=>'DB connection failed: ' . $conn->connect_error]);
    exit;
}
$conn->set_charset("utf8mb4");
