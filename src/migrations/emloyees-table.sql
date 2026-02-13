CREATE TABLE employees(
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    employer_id INT NOT NULL,
    phone VARCHAR(12) NOT NULL UNIQUE,
    employee_address VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    payment_status ENUM('NOT-PAID', "PAID") DEFAULT 'NOT-PAID',
    status ENUM('FAILED', 'PENDING', "SUCCESS")  DEFAULT 'PENDING',
    deleted_by VARCHAR(100) NULL,
    updated_by VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee FOREIGN kEY(employer_id) REFERENCES employers(id) ON DELETE SET NULL
);

CREATE INDEX idx_employees_email ON employees(email);