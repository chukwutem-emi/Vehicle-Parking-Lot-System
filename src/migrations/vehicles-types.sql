CREATE TABLE vehicle_types(
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_category_id INT NOT NULL,
    vehicle_type_name VARCHAR(100) NOT NULL UNIQUE,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    updated_by VARCHAR(100) NULL,
    delete_by VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicle_type FOREIGN KEY(Vehicle_category_id) REFERENCES vehicle_categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_vehicle_type_name ON vehicle_types(vehicle_type_name);