CREATE TABLE parking_slots(
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_code VARCHAR(10) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    updated_by VARCHAR(100) NULL,
    vehicle_category_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_slot  FOREIGN KEY(vehicle_category_id) REFERENCES vehicle_categories(id) ON DELETE CASCADE
);


CREATE INDEX idx_parking_slot_category_id ON parking_slots(category_id);
CREATE INDEX idx_parking_slot_id ON parking_slots(id);
CREATE INDEX idx_parking_slot_code ON parking_slots(slot_code);