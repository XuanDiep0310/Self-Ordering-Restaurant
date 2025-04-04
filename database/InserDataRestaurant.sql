-- Chọn database
USE SelfOrderingRestaurant;

-- Users table data
INSERT INTO users (username, password, user_type, email, phone, status) VALUES
('admin1', '$2a$12$eNSgp/54S.h3L9EfnQgDbOE2Ww.DW7kxXhcYsmtSp3xMBO5qcUs.6', 'ADMIN', 'admin@restaurant.com', '0987654321', 'Active'),
('staff1', '$2a$12$eNSgp/54S.h3L9EfnQgDbOE2Ww.DW7kxXhcYsmtSp3xMBO5qcUs.6', 'STAFF', 'staff1@restaurant.com', '0987654322', 'Active'),
('staff2', '$2a$12$eNSgp/54S.h3L9EfnQgDbOE2Ww.DW7kxXhcYsmtSp3xMBO5qcUs.6', 'STAFF', 'staff2@restaurant.com', '0987654323', 'Active'),
('customer1', '$2a$12$eNSgp/54S.h3L9EfnQgDbOE2Ww.DW7kxXhcYsmtSp3xMBO5qcUs.6', 'CUSTOMER', 'customer1@gmail.com', '0987123456', 'Active'),
('customer2', '$2a$12$eNSgp/54S.h3L9EfnQgDbOE2Ww.DW7kxXhcYsmtSp3xMBO5qcUs.6', 'CUSTOMER', 'customer2@gmail.com', '0987123457', 'Active'),
('customer3', NULL, 'CUSTOMER', 'customer3@gmail.com', '0987123458', 'Active');

-- Insert Google user
INSERT INTO users (username, google_id, user_type, email, status) VALUES
('googleuser', '118090425294932695342', 'CUSTOMER', 'googleuser@gmail.com', 'Active');

-- Staff table data
INSERT INTO staff (user_id, fullname, position, salary, hire_date, status) VALUES
(1, 'Admin User', 'Manager', 15000000, '2023-01-15', 'Active'),
(2, 'Staff One', 'Waiter', 8000000, '2023-02-10', 'Active'),
(3, 'Staff Two', 'Chef', 12000000, '2023-03-05', 'Active');

-- Customers table data
INSERT INTO customers (user_id, fullname, points) VALUES
(4, 'Customer One', 100),
(5, 'Customer Two', 50),
(6, 'Customer Three', 0),
(7, 'Google User', 25);

-- Shifts table data
INSERT INTO shifts (name, start_time, end_time) VALUES
('Morning', '07:00:00', '15:00:00'),
('Evening', '15:00:00', '23:00:00'),
('Night', '23:00:00', '07:00:00');

-- StaffShifts table data
INSERT INTO staff_shifts (shift_id, staff_id, date, status) VALUES
(1, 1, CURDATE(), 'Assigned'),
(2, 2, CURDATE(), 'Assigned'),
(3, 3, CURDATE(), 'Assigned'),
(1, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Assigned'),
(2, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Assigned');

-- Tables table data
INSERT INTO tables (capacity, status, location, qrcode) VALUES
(2, 'Available', 'Window', 'https://qrexample.com/table1'),
(4, 'Available', 'Center', 'https://qrexample.com/table2'),
(6, 'Available', 'Garden', 'https://qrexample.com/table3'),
(8, 'Available', 'VIP Room', 'https://qrexample.com/table4'),
(2, 'Available', 'Bar', 'https://qrexample.com/table5');

-- Categories table data
INSERT INTO categories (name, description, image, status) VALUES
('Appetizers', 'Start your meal right with our delicious appetizers', 'appetizers.jpg', 'Active'),
('Main Courses', 'Hearty and satisfying main dishes', 'maincourses.jpg', 'Active'),
('Desserts', 'Sweet treats to end your meal', 'desserts.jpg', 'Active'),
('Beverages', 'Refreshing drinks and beverages', 'beverages.jpg', 'Active'),
('Specials', 'Chef\'s special dishes of the day', 'specials.jpg', 'Active');

-- Dishes table data
INSERT INTO dishes (category_id, name, description, price, image, status) VALUES
(1, 'Spring Rolls', 'Fresh vegetables wrapped in rice paper', 50000, 'springrolls.jpg', 'Available'),
(1, 'Garlic Bread', 'Crispy bread with garlic butter', 40000, 'garlicbread.jpg', 'Available'),
(2, 'Beef Steak', 'Premium beef cooked to your preference', 250000, 'beefsteak.jpg', 'Available'),
(2, 'Seafood Pasta', 'Linguine with mixed seafood in tomato sauce', 180000, 'seafoodpasta.jpg', 'Available'),
(3, 'Chocolate Cake', 'Rich chocolate cake with ganache', 75000, 'chocolatecake.jpg', 'Available'),
(3, 'Ice Cream', 'Selection of premium ice cream flavors', 50000, 'icecream.jpg', 'Available'),
(4, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 45000, 'orangejuice.jpg', 'Available'),
(4, 'Iced Coffee', 'Vietnamese style iced coffee with condensed milk', 40000, 'icedcoffee.jpg', 'Available'),
(5, 'Chef\'s Special Soup', 'Daily special soup made by our chef', 80000, 'specialsoup.jpg', 'Available');

-- Orders table data
INSERT INTO orders (staff_id, table_number, customer_id, status, discount, notes, payment_status) VALUES
(1, 1, 1, 'Completed', 0, 'No spicy food', 'Paid'),
(2, 2, 2, 'Processing', 10000, 'Birthday celebration', 'Unpaid'),
(3, 3, 4, 'Pending', 0, NULL, 'Unpaid');

-- OrderItems table data
INSERT INTO order_items (order_id, dish_id, quantity, unit_price, notes, status) VALUES
(1, 1, 2, 50000, NULL, 'Served'),
(1, 3, 1, 250000, 'Medium rare', 'Served'),
(1, 7, 2, 45000, NULL, 'Served'),
(2, 2, 1, 40000, NULL, 'Processing'),
(2, 4, 2, 180000, 'Extra cheese', 'Ordered'),
(2, 5, 1, 75000, NULL, 'Ordered'),
(3, 6, 2, 50000, NULL, 'Ordered'),
(3, 8, 3, 40000, NULL, 'Ordered');

-- Payments table data
INSERT INTO payments (order_id, customer_id, amount, payment_method, status, transaction_id) VALUES
(1, 1, 390000, 'Cash', 'Success', NULL),
(2, 2, 475000, 'Card', 'Pending', 'TXN123456789');

-- Notifications table data
INSERT INTO notifications (user_id, title, content, type, is_read) VALUES
(4, 'Order Completed', 'Your order #1 has been completed', 'OrderStatus', FALSE),
(5, 'Order Processing', 'Your order #2 is being processed', 'OrderStatus', FALSE),
(2, 'Table Request', 'Table #2 has requested assistance', 'TableRequest', TRUE),
(3, 'Table Request', 'Table #3 has requested assistance', 'TableRequest', FALSE);

-- Suppliers table data
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('Fresh Produce Co.', 'John Smith', '0912345678', 'contact@freshproduce.com', '123 Farmer St, District 1'),
('Meat Suppliers Inc.', 'Mary Johnson', '0923456789', 'orders@meatsuppliers.com', '456 Butcher Ave, District 2'),
('Beverage Distributors', 'David Lee', '0934567890', 'sales@beveragedist.com', '789 Drink Blvd, District 3');

-- Ingredients table data
INSERT INTO ingredients (supplier_id, name, description, unit, cost_per_unit, status, minimum_quantity) VALUES
(1, 'Rice Paper', 'For spring rolls', 'Pack', 15000, 'Available', 10),
(1, 'Fresh Vegetables', 'Mixed vegetables', 'Kg', 20000, 'Available', 5),
(2, 'Beef', 'Premium steak cuts', 'Kg', 300000, 'Available', 2),
(2, 'Seafood Mix', 'Mix of shrimp, squid, and mussels', 'Kg', 250000, 'Available', 3),
(3, 'Orange', 'Fresh oranges for juice', 'Kg', 30000, 'Available', 5),
(3, 'Coffee Beans', 'Premium Vietnamese coffee beans', 'Kg', 200000, 'Available', 2);

-- DishIngredients table data
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity) VALUES
(1, 1, 1),  -- Spring Rolls use Rice Paper
(1, 2, 0.5),  -- Spring Rolls use Fresh Vegetables
(3, 3, 0.3),  -- Beef Steak uses Beef
(4, 4, 0.25),  -- Seafood Pasta uses Seafood Mix
(7, 5, 0.5),  -- Fresh Orange Juice uses Oranges
(8, 6, 0.05);  -- Iced Coffee uses Coffee Beans

-- Inventory table data
INSERT INTO inventory (ingredient_id, quantity, unit, supplier_id) VALUES
(1, 50, 'Pack', 1),
(2, 15, 'Kg', 1),
(3, 10, 'Kg', 2),
(4, 12, 'Kg', 2),
(5, 20, 'Kg', 3),
(6, 8, 'Kg', 3);

-- Customer Feedback table data
INSERT INTO customer_feedback (customer_id, order_id, rating, comment, status) VALUES
(1, 1, 5, 'Excellent service and delicious food!', 'Reviewed'),
(2, 2, 4, 'Good food but service was a bit slow', 'New');