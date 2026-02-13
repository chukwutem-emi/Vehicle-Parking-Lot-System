CREATE TABLE vehicles(
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number  VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type_id INT NOT NULL,
    vehicle_owner_phone VARCHAR(12) NOT NULL,
    vehicle_owner_address VARCHAR(200) NOT NULL,
    vehicle_owner_next_of_kin VARCHAR(100) NOT NULL,
    vehicle_owner_next_of_kin_phone VARCHAR(12) NOT NULL,
    vehicle_owner_next_of_kin_address VARCHAR(200) NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicle FOREIGN KEY(vehicle_type_id) REFERENCES vehicle_types(id) ON DELETE SET NULL
);

CREATE INDEX idx_vehicles_number ON vehicles(vehicle_number);