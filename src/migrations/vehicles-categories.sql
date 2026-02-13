CREATE TABLE vehicle_categories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_category_name VARCHAR(50) NOT NULL UNIQUE,
    vehicle_description VARCHAR(300) NULL,
    deleted_by VARCHAR(100) NULL,
    updated_by VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_category_name  ON vehicle_categories(vehicle_category_name);