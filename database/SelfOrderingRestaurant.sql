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
    user_type ENUM ('STAFF', 'CUSTOMER', 'ADMIN') NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NULL,
    status ENUM('Active', 'Inactive', 'Pending') DEFAULT 'Active',
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    PRIMARY KEY (user_id)
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

-- Notifications table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT,
    table_number INT,
    title VARCHAR(255),
    content TEXT,
    expiry_date DATETIME NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('OrderStatus', 'TableRequest', 'System'),
    PRIMARY KEY (notification_id),
    FOREIGN KEY (table_number) REFERENCES tables(table_number) ON DELETE CASCADE
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

-- Bảng doanh thu
CREATE TABLE Revenue (
    Revenue_ID INT AUTO_INCREMENT,
    Date DATE NOT NULL,
    
    -- Doanh thu tổng hợp
    TotalRevenue DECIMAL(12,2) DEFAULT 0,
    TotalOrders INT DEFAULT 0,
    TotalCustomers INT DEFAULT 0,
    
    -- Phân loại doanh thu theo danh mục
    FoodRevenue DECIMAL(10,2) DEFAULT 0,
    DrinkRevenue DECIMAL(10,2) DEFAULT 0,
    OtherRevenue DECIMAL(10,2) DEFAULT 0,
    
    -- Phân tích chiết khấu và doanh thu thuần
    TotalDiscount DECIMAL(10,2) DEFAULT 0,
    NetRevenue DECIMAL(12,2) GENERATED ALWAYS AS (TotalRevenue - TotalDiscount) STORED,
    
    -- Thông tin bổ sung
    AverageOrderValue DECIMAL(10,2) GENERATED ALWAYS AS (CASE WHEN TotalOrders > 0 THEN TotalRevenue/TotalOrders ELSE 0 END) STORED,
    Staff_ID INT,
    Notes TEXT,
    
    -- Thông tin thời gian
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (Revenue_ID),
    UNIQUE (Date),
    FOREIGN KEY (Staff_ID) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- Index để tăng tốc độ truy vấn theo ngày
CREATE INDEX idx_revenue_date ON Revenue(Date);

-- Thêm procedure để cập nhật bảng Revenue từ bảng Orders
DELIMITER //
CREATE PROCEDURE UpdateDailyRevenue(IN input_date DATE)
BEGIN
    -- Kiểm tra xem đã có dữ liệu cho ngày này chưa
    IF EXISTS (SELECT 1 FROM Revenue WHERE Date = input_date) THEN
        -- Cập nhật bản ghi hiện có
        UPDATE Revenue r
        SET 
            TotalRevenue = (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(order_date) = input_date AND Status = 'Completed'),
            TotalOrders = (SELECT COUNT(*) FROM orders WHERE DATE(order_date) = input_date AND Status = 'Completed'),
            TotalCustomers = (SELECT COUNT(DISTINCT Customer_ID) FROM orders WHERE DATE(order_date) = input_date AND Status = 'Completed'),
            TotalDiscount = (SELECT COALESCE(SUM(Discount), 0) FROM orders WHERE DATE(order_date) = input_date AND Status = 'Completed'),
            FoodRevenue = (
                SELECT COALESCE(SUM(oi.sub_total), 0)
                FROM orders o
                JOIN order_items oi ON o.order_id = oi.order_id
                JOIN dishes d ON oi.dish_id = d.dish_id
                JOIN categories c ON d.category_id = c.category_id
                WHERE DATE(o.order_date) = input_date
                AND o.status = 'Completed'
                AND c.name NOT LIKE '%drink%' AND c.name NOT LIKE '%beverage%'
            ),
            DrinkRevenue = (
                SELECT COALESCE(SUM(oi.sub_total), 0)
                FROM orders o
                JOIN order_items oi ON o.order_id = oi.order_id
                JOIN dishes d ON oi.dish_id = d.dish_id
                JOIN categories c ON d.category_id = c.category_id
                WHERE DATE(o.order_date) = input_date
                AND o.status = 'Completed'
                AND (c.name LIKE '%drink%' OR c.name LIKE '%beverage%')
            ),
            UpdatedAt = CURRENT_TIMESTAMP
        WHERE Date = input_date;
        
        -- Cập nhật OtherRevenue
        UPDATE Revenue
        SET OtherRevenue = TotalRevenue - (FoodRevenue + DrinkRevenue)
        WHERE Date = input_date;
    ELSE
        -- Tạo bản ghi mới nếu chưa tồn tại
        INSERT INTO Revenue (
            Date, 
            TotalRevenue, 
            TotalOrders, 
            TotalCustomers, 
            TotalDiscount,
            FoodRevenue,
            DrinkRevenue
        )
        SELECT 
            input_date,
            COALESCE(SUM(o.total_amount), 0) AS total_nevenue,
            COUNT(*) AS total_orders,
            COUNT(DISTINCT o.customer_id) AS TotalCustomers,
            COALESCE(SUM(o.discount), 0) AS TotalDiscount,
            (
                SELECT COALESCE(SUM(oi.sub_total), 0)
                FROM orders o2
                JOIN order_items oi ON o2.order_id = oi.order_id
                JOIN dishes d ON oi.dish_id = d.dish_id
                JOIN categories c ON d.category_id = c.category_id
                WHERE DATE(o2.order_date) = input_date
                AND o2.status = 'Completed'
                AND c.name NOT LIKE '%drink%' AND c.name NOT LIKE '%beverage%'
            ) AS FoodRevenue,
            (
                SELECT COALESCE(SUM(oi.sub_total), 0)
                FROM orders o2
                JOIN order_items oi ON o2.order_id = oi.order_id
                JOIN dishes d ON oi.dish_id = d.dish_id
                JOIN categories c ON d.category_id = c.category_id
                WHERE DATE(o2.order_date) = input_date
                AND o2.status = 'Completed'
                AND (c.name LIKE '%drink%' OR c.name LIKE '%beverage%')
            ) AS DrinkRevenue
        FROM orders o
        WHERE DATE(o.order_date) = input_date
        AND o.status = 'Completed';
        
        -- Cập nhật OtherRevenue cho bản ghi mới
        UPDATE Revenue
        SET OtherRevenue = TotalRevenue - (FoodRevenue + DrinkRevenue)
        WHERE Date = input_date;
    END IF;
END;
//
DELIMITER ;

-- Tạo lập lịch tự động cập nhật doanh thu hàng ngày
DELIMITER //
CREATE EVENT evt_daily_revenue_update
ON SCHEDULE EVERY 1 DAY STARTS CURRENT_DATE + INTERVAL 23 HOUR + INTERVAL 59 MINUTE
DO
BEGIN
    CALL UpdateDailyRevenue(CURRENT_DATE);
END;
//
DELIMITER ;


