<?php
// save_parcel.php

$host = "localhost"; // or your server
$user = "root";      // your MySQL username
$pass = "";          // your MySQL password
$db   = "parcel_tracking";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$name = $conn->real_escape_string($data['name']);
$parcelID = $conn->real_escape_string($data['parcelID']);
$status = $conn->real_escape_string($data['status']);

$sql = "INSERT INTO parcels (customer_name, parcel_id, status) VALUES ('$name', '$parcelID', '$status')";
if ($conn->query($sql) === TRUE) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => $conn->error]);
}
$conn->close();
?>
