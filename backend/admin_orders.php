<?php
require_once __DIR__.'/db_connect.php';

// Basic HTTP auth (change password later)
$ADMIN_USER = 'admin';
$ADMIN_PASS = 'admin123';
if(!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== $ADMIN_USER || $_SERVER['PHP_AUTH_PW'] !== $ADMIN_PASS){
    header('WWW-Authenticate: Basic realm="Admin Area"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Unauthorized';
    exit;
}

// Update status
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['order_id'])) {
    $order_id = intval($_POST['order_id']);
    $status = $_POST['status'] ?? 'pending';
    $stmt = $conn->prepare("UPDATE orders SET status=? WHERE id=?");
    $stmt->bind_param('si', $status, $order_id);
    $stmt->execute();
}

// Fetch orders
$result = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Admin - Orders</title>
<style>
body{font-family:Arial;padding:16px;background:#f4f6f7}
table{width:100%;border-collapse:collapse}
th,td{border:1px solid #ddd;padding:8px;text-align:left}
th{background:#2a9d8f;color:#fff}
</style>
</head>
<body>
<h2>SaagKart Admin — Orders</h2>
<table>
<tr><th>ID</th><th>Ref</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Cart</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
<?php while($row = $result->fetch_assoc()): ?>
<tr>
<td><?= $row['id'] ?></td>
<td><?= htmlspecialchars($row['order_ref']) ?></td>
<td><?= htmlspecialchars($row['customer_name']) ?></td>
<td><?= htmlspecialchars($row['customer_email']) ?></td>
<td><?= htmlspecialchars($row['customer_phone']) ?></td>
<td><?= nl2br(htmlspecialchars($row['customer_address'])) ?></td>
<td><?php $items = json_decode($row['cart'], true); foreach($items as $it){ echo htmlspecialchars($it['name']).' × '.intval($it['qty']).'<br>'; } ?></td>
<td>₹<?= $row['total'] ?></td>
<td><?= htmlspecialchars($row['status']) ?></td>
<td><?= $row['created_at'] ?></td>
<td>
<form method="post">
<input type="hidden" name="order_id" value="<?= $row['id'] ?>">
<select name="status">
  <option <?php if($row['status']=='pending') echo 'selected';?>>pending</option>
  <option <?php if($row['status']=='paid') echo 'selected';?>>paid</option>
  <option <?php if($row['status']=='shipped') echo 'selected';?>>shipped</option>
  <option <?php if($row['status']=='delivered') echo 'selected';?>>delivered</option>
</select>
<button type="submit">Update</button>
</form>
</td>
</tr>
<?php endwhile; ?>
</table>
</body>
</html>
