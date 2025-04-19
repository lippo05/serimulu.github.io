<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "parcel_tracking";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die(json_encode([]));
}

$sql = "SELECT customer_name, parcel_id, status FROM parcels ORDER BY id DESC";
$result = $conn->query($sql);

$parcels = [];

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $parcels[] = [
      'name' => $row['customer_name'],
      'id' => $row['parcel_id'],
      'status' => $row['status']
    ];
  }
}

echo json_encode($parcels);
$conn->close();
?>
