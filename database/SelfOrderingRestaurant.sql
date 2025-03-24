DROP DATABASE IF EXISTS selforderingrestaurant;
-- Tạo Database
CREATE DATABASE SelfOrderingRestaurant;
USE SelfOrderingRestaurant;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    google_id VARCHAR(50) UNIQUE NULL,
    user_type ENUM ('Staff', 'Customer') NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NULL,
    status ENUM('Active', 'Inactive', 'Pending') DEFAULT 'Active',
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    PRIMARY KEY (user_id)
);

-- Notifications table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    expiry_date DATETIME NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('OrderStatus', 'TableRequest', 'System'),
    PRIMARY KEY (notification_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Staff table
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT,
    user_id INT UNIQUE,
    fullname VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    salary BIGINT,
    hire_date DATE,
    status ENUM('Active', 'Inactive'),
    PRIMARY KEY (staff_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Customers table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT,
    user_id INT UNIQUE,
    fullname VARCHAR(100) NOT NULL,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    points INT DEFAULT 0,
    PRIMARY KEY (customer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Shifts table
CREATE TABLE shifts (
    shift_id INT AUTO_INCREMENT,
    name VARCHAR(50),
    start_time TIME,
    end_time TIME,
    PRIMARY KEY (shift_id)
);

-- StaffShifts table
CREATE TABLE staff_shifts (
    staff_shift_id INT AUTO_INCREMENT PRIMARY KEY,
    shift_id INT,
    staff_id INT,
    date DATE,
    status ENUM('Assigned', 'Completed', 'Absent'),
    UNIQUE (shift_id, staff_id, Date),
    FOREIGN KEY (shift_id) REFERENCES shifts(shift_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
);

-- Tables table
CREATE TABLE tables (
    table_number INT AUTO_INCREMENT PRIMARY KEY,
    capacity INT NOT NULL,
    status ENUM('Available', 'Occupied') DEFAULT 'Available',
    location VARCHAR(50),
    qrcode VARCHAR(255)
);

-- Orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT,
    staff_id INT,
    table_number INT,
    customer_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    total_amount BIGINT DEFAULT 0,
    discount BIGINT DEFAULT 0,
    notes TEXT,
    payment_status ENUM('Paid', 'Unpaid'),
    PRIMARY KEY (order_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (table_number) REFERENCES tables(table_number) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

-- Payments table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    customer_id INT,
    amount BIGINT NOT NULL,
    payment_method ENUM('Cash', 'Card', 'Online'),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255) NULL UNIQUE,
    status ENUM('Success', 'Failed', 'Pending'),
    PRIMARY KEY (payment_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

-- Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    PRIMARY KEY (category_id)
);

-- Dishes table
CREATE TABLE dishes (
    dish_id INT AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price BIGINT NOT NULL,
    image VARCHAR(255),
    status ENUM('Available', 'Unavailable') DEFAULT 'Available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (dish_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- OrderItems table
CREATE TABLE order_items (
    order_id INT,
    dish_id INT,
    quantity INT NOT NULL,
    unit_price BIGINT NOT NULL DEFAULT 0,
    notes TEXT,
    status ENUM('Ordered', 'Processing', 'Served', 'Cancelled'),
    sub_total BIGINT GENERATED ALWAYS AS (COALESCE(quantity * unit_price, 0)) STORED,
    PRIMARY KEY (order_id, dish_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(dish_id) ON DELETE CASCADE
);

-- Customer Feedback table
CREATE TABLE customer_feedback (
    feedback_id INT AUTO_INCREMENT,
    customer_id INT,
    order_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    feedback_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('New', 'Reviewed', 'Resolved'),
    PRIMARY KEY (feedback_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Suppliers table
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    PRIMARY KEY (supplier_id)
);

-- Ingredients table
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT,
    supplier_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    cost_per_unit BIGINT,
    status ENUM('Available', 'Low', 'OutOfStock') DEFAULT 'Available',
    minimum_quantity INT DEFAULT 1,
    PRIMARY KEY (ingredient_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

-- DishIngredients table
CREATE TABLE dish_ingredients (
    dish_id INT,
    ingredient_id INT,
    quantity DECIMAL(10, 2),
    PRIMARY KEY (dish_id, ingredient_id),
    FOREIGN KEY (dish_id) REFERENCES dishes(dish_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
);

-- Inventory table
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT,
    ingredient_id INT,
    quantity BIGINT,
    unit VARCHAR(50),
    supplier_id INT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (ingredient_id, supplier_id),
    PRIMARY KEY (inventory_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

ALTER TABLE users ADD CONSTRAINT chk_users_phone CHECK (phone REGEXP '^[0-9]{10}$');
ALTER TABLE suppliers ADD CONSTRAINT chk_suppliers_phone CHECK (phone REGEXP '^[0-9]{10}$');
ALTER TABLE order_items ADD CONSTRAINT chk_orderitems_quantity CHECK (quantity > 0);
ALTER TABLE payments ADD CONSTRAINT chk_payments_amount CHECK (amount > 0);

DELIMITER //

CREATE TRIGGER trg_update_last_login
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.last_login = CURRENT_TIMESTAMP;
END //

DELIMITER ;


DELIMITER //

-- Trigger cho INSERT
CREATE TRIGGER trg_update_total_amount_insert AFTER INSERT ON order_items 
FOR EACH ROW 
BEGIN
    DECLARE new_total BIGINT;
    
    -- Tính tổng mới
    SELECT COALESCE(SUM(sub_total), 0)
    INTO new_total
    FROM order_items
    WHERE order_id = NEW.order_id;
    
    -- Cập nhật tổng
    UPDATE orders
    SET total_amount = new_total
    WHERE order_id = NEW.order_id;
END//

-- Trigger cho UPDATE
CREATE TRIGGER trg_update_total_amount_update AFTER UPDATE ON order_items 
FOR EACH ROW 
BEGIN
    DECLARE new_total BIGINT;
    
    -- Tính tổng mới
    SELECT COALESCE(SUM(sub_total), 0)
    INTO new_total
    FROM order_items
    WHERE order_id = NEW.order_id;
    
    -- Cập nhật tổng
    UPDATE orders
    SET total_amount = new_total
    WHERE order_id = NEW.order_id;
END//

-- Trigger cho DELETE
CREATE TRIGGER trg_update_total_amount_delete AFTER DELETE ON order_items 
FOR EACH ROW 
BEGIN
    DECLARE new_total BIGINT;
    
    -- Tính tổng mới
    SELECT COALESCE(SUM(sub_total), 0)
    INTO new_total
    FROM order_items
    WHERE order_id = OLD.order_id;
    
    -- Cập nhật tổng
    UPDATE orders
    SET total_amount = new_total
    WHERE order_id = OLD.order_id;
END//

DELIMITER ;

-- Tăng tốc tìm kiếm User theo Username và Email
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Tăng tốc tìm kiếm Orders theo Status và Date
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Tăng tốc tìm kiếm Payments theo Status
CREATE INDEX idx_payments_status ON payments(status);


