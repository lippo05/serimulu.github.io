CREATE TABLE parcels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255),
  parcel_id VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
