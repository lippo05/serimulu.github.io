<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "parcel_tracking";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$originalID = $conn->real_escape_string($data['originalID']);
$newName = $conn->real_escape_string($data['name']);
$newID = $conn->real_escape_string($data['id']);

$sql = "UPDATE parcels SET customer_name = '$newName', parcel_id = '$newID' WHERE parcel_id = '$originalID'";

if ($conn->query($sql) === TRUE) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => $conn->error]);
}

$conn->close();
?>
