DROP DATABASE IF EXISTS selforderingrestaurant;
-- Tạo Database
CREATE DATABASE SelfOrderingRestaurant;
USE SelfOrderingRestaurant;

-- Users table
CREATE TABLE Users (
    User_ID INT AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NULL,
    GoogleID VARCHAR(50) UNIQUE NULL,
    UserType ENUM ('Staff', 'Customer') NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20) NULL,
    Status ENUM('Active', 'Inactive', 'Pending') DEFAULT 'Active',
    CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    LastLogin DATETIME NULL,
    PRIMARY KEY (User_ID)
);

-- Notifications table
CREATE TABLE Notifications (
    Notification_ID INT AUTO_INCREMENT,
    User_ID INT,
    Title VARCHAR(255),
    Content TEXT,
    ExpiryDate DATETIME NULL,
    CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN DEFAULT FALSE,
    Type ENUM('OrderStatus', 'TableRequest', 'System'),
    PRIMARY KEY (Notification_ID),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- Staff table
CREATE TABLE Staff (
    Staff_ID INT AUTO_INCREMENT,
    User_ID INT UNIQUE,
    Fullname VARCHAR(100) NOT NULL,
    Position VARCHAR(50),
    Salary DECIMAL(10,2),
    HireDate DATE,
    Status ENUM('Active', 'Inactive'),
    PRIMARY KEY (Staff_ID),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- Customers table
CREATE TABLE Customers (
    Customer_ID INT AUTO_INCREMENT,
    User_ID INT UNIQUE,
    Fullname VARCHAR(100) NOT NULL,
    JoinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Points INT DEFAULT 0,
    PRIMARY KEY (Customer_ID),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- Shifts table
CREATE TABLE Shifts (
    Shift_ID INT AUTO_INCREMENT,
    Name VARCHAR(50),
    StartTime TIME,
    EndTime TIME,
    PRIMARY KEY (Shift_ID)
);

-- StaffShifts table
CREATE TABLE StaffShifts (
    StaffShift_ID INT AUTO_INCREMENT PRIMARY KEY,
    Shift_ID INT,
    Staff_ID INT,
    Date DATE,
    Status ENUM('Assigned', 'Completed', 'Absent'),
    UNIQUE (Shift_ID, Staff_ID, Date),
    FOREIGN KEY (Shift_ID) REFERENCES Shifts(Shift_ID) ON DELETE CASCADE,
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID) ON DELETE CASCADE
);

-- Tables table
CREATE TABLE Tables (
    TableNumber INT AUTO_INCREMENT PRIMARY KEY,
    Capacity INT NOT NULL,
    Status ENUM('Available', 'Occupied') DEFAULT 'Available',
    Location VARCHAR(50),
    QRCode VARCHAR(255)
);

-- Orders table
CREATE TABLE Orders (
    Order_ID INT AUTO_INCREMENT,
    Staff_ID INT,
    TableNumber INT,
    Customer_ID INT,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    TotalAmount DECIMAL(10,2) DEFAULT 0,
    Discount DECIMAL(10,2) DEFAULT 0,
    Notes TEXT,
    PaymentStatus ENUM('Paid', 'Unpaid'),
    PRIMARY KEY (Order_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID) ON DELETE SET NULL,
    FOREIGN KEY (TableNumber) REFERENCES Tables(TableNumber) ON DELETE SET NULL,
    FOREIGN KEY (Customer_ID) REFERENCES Customers(Customer_ID) ON DELETE SET NULL
);

-- Payments table
CREATE TABLE Payments (
    Payment_ID INT AUTO_INCREMENT,
    Order_ID INT NOT NULL,
    Customer_ID INT,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod ENUM('Cash', 'Card', 'Online'),
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    TransactionID VARCHAR(255) NULL UNIQUE,
    Status ENUM('Success', 'Failed', 'Pending'),
    PRIMARY KEY (Payment_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Customer_ID) REFERENCES Customers(Customer_ID) ON DELETE SET NULL
);

-- Categories table
CREATE TABLE Categories (
    Category_ID INT AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Image VARCHAR(255),
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    PRIMARY KEY (Category_ID)
);

-- Dishes table
CREATE TABLE Dishes (
    Dish_ID INT AUTO_INCREMENT,
    Category_ID INT,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL,
    Image VARCHAR(255),
    Status ENUM('Available', 'Unavailable') DEFAULT 'Available',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Dish_ID),
    FOREIGN KEY (Category_ID) REFERENCES Categories(Category_ID) ON DELETE SET NULL
);

-- OrderItems table
CREATE TABLE OrderItems (
    Order_ID INT,
    Dish_ID INT,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL DEFAULT 0,
    Notes TEXT,
    Status ENUM('Ordered', 'Processing', 'Served', 'Cancelled'),
    SubTotal DECIMAL(10,2) GENERATED ALWAYS AS (COALESCE(Quantity * UnitPrice, 0)) STORED,
    PRIMARY KEY (Order_ID, Dish_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Dish_ID) REFERENCES Dishes(Dish_ID) ON DELETE CASCADE
);

-- Customer Feedback table
CREATE TABLE CustomerFeedback (
    Feedback_ID INT AUTO_INCREMENT,
    Customer_ID INT,
    Order_ID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    FeedbackDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('New', 'Reviewed', 'Resolved'),
    PRIMARY KEY (Feedback_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customers(Customer_ID) ON DELETE CASCADE,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

-- Suppliers table
CREATE TABLE Suppliers (
    Supplier_ID INT AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    ContactPerson VARCHAR(100),
    Phone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Address TEXT,
    PRIMARY KEY (Supplier_ID)
);

-- Ingredients table
CREATE TABLE Ingredients (
    Ingredient_ID INT AUTO_INCREMENT,
    Supplier_ID INT,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Unit VARCHAR(50),
    CostPerUnit DECIMAL(10,2),
    Status ENUM('Available', 'Low', 'OutOfStock') DEFAULT 'Available',
    MinimumQuantity INT DEFAULT 1,
    PRIMARY KEY (Ingredient_ID),
    FOREIGN KEY (Supplier_ID) REFERENCES Suppliers(Supplier_ID) ON DELETE SET NULL
);

-- DishIngredients table
CREATE TABLE DishIngredients (
    Dish_ID INT,
    Ingredient_ID INT,
    Quantity DECIMAL(10,2),
    PRIMARY KEY (Dish_ID, Ingredient_ID),
    FOREIGN KEY (Dish_ID) REFERENCES Dishes(Dish_ID) ON DELETE CASCADE,
    FOREIGN KEY (Ingredient_ID) REFERENCES Ingredients(Ingredient_ID) ON DELETE CASCADE
);

-- Inventory table
CREATE TABLE Inventory (
    InventoryID INT AUTO_INCREMENT,
    IngredientID INT,
    Quantity DECIMAL(10,2),
    Unit VARCHAR(50),
    Supplier_ID INT,
    LastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (IngredientID, Supplier_ID),
    PRIMARY KEY (InventoryID),
    FOREIGN KEY (IngredientID) REFERENCES Ingredients(Ingredient_ID) ON DELETE CASCADE,
    FOREIGN KEY (Supplier_ID) REFERENCES Suppliers(Supplier_ID) ON DELETE SET NULL
);

ALTER TABLE Users ADD CONSTRAINT chk_users_phone CHECK (Phone REGEXP '^[0-9]{10}$');
ALTER TABLE Suppliers ADD CONSTRAINT chk_suppliers_phone CHECK (Phone REGEXP '^[0-9]{10}$');
ALTER TABLE OrderItems ADD CONSTRAINT chk_orderitems_quantity CHECK (Quantity > 0);
ALTER TABLE Payments ADD CONSTRAINT chk_payments_amount CHECK (Amount > 0);

DELIMITER //

CREATE TRIGGER trg_update_last_login
BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
    SET NEW.LastLogin = CURRENT_TIMESTAMP;
END //

DELIMITER ;


-- update total_amount
DELIMITER //

CREATE TRIGGER trg_update_total_amount
AFTER INSERT OR AFTER UPDATE OR AFTER DELETE ON OrderItems
FOR EACH ROW
BEGIN
    DECLARE order_id INT;
    DECLARE new_total DECIMAL(10,2);

    -- Xác định Order_ID phù hợp
    IF (TG_OP = 'DELETE') THEN
        SET order_id = OLD.Order_ID;
    ELSE
        SET order_id = NEW.Order_ID;
    END IF;

    -- Cập nhật lại TotalAmount
    SELECT COALESCE(SUM(SubTotal), 0)
    INTO new_total
    FROM OrderItems
    WHERE Order_ID = order_id;

    UPDATE Orders
    SET TotalAmount = new_total
    WHERE Order_ID = order_id;
END //

DELIMITER ;

-- Tăng tốc tìm kiếm User theo Username và Email
CREATE INDEX idx_users_username ON Users(Username);
CREATE INDEX idx_users_email ON Users(Email);

-- Tăng tốc tìm kiếm Orders theo Status và Date
CREATE INDEX idx_orders_status ON Orders(Status);
CREATE INDEX idx_orders_date ON Orders(OrderDate);

-- Tăng tốc tìm kiếm Payments theo Status
CREATE INDEX idx_payments_status ON Payments(Status);


