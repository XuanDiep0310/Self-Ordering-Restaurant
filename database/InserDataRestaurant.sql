-- Chọn database
USE SelfOrderingRestaurant;

-- Thêm dữ liệu vào bảng Users
INSERT INTO Users (Username, Password, GoogleID, UserType, Email, Phone, Status)
VALUES
('staff1', 'hashed_password1', NULL, 'Staff', 'staff1@example.com', '0123456789', 'Active'),
('staff2', 'hashed_password3', NULL, 'Staff', 'staff2@example.com', '0345678912', 'Active'),
('customer1', 'hashed_password2', NULL, 'Customer', 'customer1@example.com', '0987654321', 'Active'),
('customer2', 'hashed_password4', NULL, 'Customer', 'customer2@example.com', '0765432189', 'Active');

-- Thêm dữ liệu vào bảng Staff
INSERT INTO Staff (User_ID, Fullname, Position, Salary, HireDate, Status)
VALUES
(1, 'Nguyen Van A', 'Manager', 1000.00, '2024-01-01', 'Active'),
(2, 'Le Thi C', 'Waiter', 600.00, '2024-02-15', 'Active');

-- Thêm dữ liệu vào bảng Customers
INSERT INTO Customers (User_ID, Fullname, Points)
VALUES
(3, 'Tran Thi B', 10),
(4, 'Hoang Van D', 20);

-- Thêm dữ liệu vào bảng Shifts
INSERT INTO Shifts (Name, StartTime, EndTime)
VALUES
('Morning', '08:00:00', '12:00:00'),
('Afternoon', '13:00:00', '17:00:00'),
('Evening', '18:00:00', '22:00:00');

-- Thêm dữ liệu vào bảng Tables
INSERT INTO Tables (TableNumber, Capacity, Status, Location, QRCode)
VALUES
(1, 4, 'Available', 'Near Window', 'QR123'),
(2, 2, 'Occupied', 'Corner', 'QR456'),
(3, 6, 'Available', 'Center', 'QR789');

-- Thêm dữ liệu vào bảng Orders
INSERT INTO Orders (Staff_ID, TableNumber, Customer_ID, Status, TotalAmount, Discount, PaymentStatus)
VALUES
(1, 1, 1, 'Pending', 0, 0, 'Unpaid'),
(2, 2, 1, 'Processing', 20.99, 2.00, 'Unpaid');

-- Thêm dữ liệu vào bảng Categories
INSERT INTO Categories (Name, Description, Status)
VALUES
('Main Course', 'Main dishes', 'Active'),
('Beverages', 'Drinks and beverages', 'Active'),
('Desserts', 'Sweet treats', 'Active');

-- Thêm dữ liệu vào bảng Dishes
INSERT INTO Dishes (Category_ID, Name, Description, Price, Status)
VALUES
(1, 'Grilled Chicken', 'Delicious grilled chicken', 5.99, 'Available'),
(2, 'Lemonade', 'Fresh lemonade', 2.49, 'Available'),
(3, 'Chocolate Cake', 'Rich chocolate dessert', 4.99, 'Available');

-- Thêm dữ liệu vào bảng OrderItems
INSERT INTO OrderItems (Order_ID, Dish_ID, Quantity, UnitPrice, Status)
VALUES
(1, 1, 2, 5.99, 'Ordered'),
(1, 2, 1, 2.49, 'Ordered'),
(2, 3, 3, 4.99, 'Ordered');

-- Thêm dữ liệu vào bảng Payments
INSERT INTO Payments (Order_ID, Customer_ID, Amount, PaymentMethod, Status)
VALUES
(1, 1, 12.47, 'Card', 'Success'),
(2, 2, 15.99, 'Cash', 'Pending');
