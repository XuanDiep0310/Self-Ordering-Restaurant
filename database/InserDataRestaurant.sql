-- Chèn dữ liệu vào bảng users
INSERT INTO users (username, password, user_type, email, phone, status) VALUES
('Admin', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'ADMIN', 'admin@nhahang.com', '0901234567', 'Active'),
('nhanvien01', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'STAFF', 'nhanvien01@nhahang.com', '0912345678', 'Active'),
('nhanvien02', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'STAFF', 'nhanvien02@nhahang.com', '0923456789', 'Active'),
('nhanvien03', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'STAFF', 'nhanvien03@nhahang.com', '0934567890', 'Active'),
('khach01', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'CUSTOMER', 'khach01@gmail.com', '0945678901', 'Active'),
('khach02', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'CUSTOMER', 'khach02@gmail.com', '0956789012', 'Active'),
('khach03', NULL, 'CUSTOMER', 'khach03@gmail.com', '0967890123', 'Active'),
('khach04', NULL, 'CUSTOMER', 'khach04@gmail.com', '0978901234', 'Active');

-- Chèn dữ liệu vào bảng staff
INSERT INTO staff (user_id, fullname, position, salary, hire_date, status) VALUES
(1, 'Nguyễn Văn Admin', 'Quản lý', 20000000, '2023-01-01', 'Active'),
(2, 'Trần Thị Nhân Viên', 'Nhân viên phục vụ', 8000000, '2023-02-15', 'Active'),
(3, 'Lê Văn Đầu Bếp', 'Đầu bếp', 12000000, '2023-01-10', 'Active'),
(4, 'Phạm Thị Thu Ngân', 'Thu ngân', 9000000, '2023-03-01', 'Active');

-- Chèn dữ liệu vào bảng customers
INSERT INTO customers (user_id, fullname, points) VALUES
(5, 'Hoàng Văn Khách', 100),
(6, 'Đỗ Thị Hằng', 150),
(7, 'Ngô Minh Tuấn', 50),
(8, 'Vũ Thùy Trang', 80);

-- Chèn dữ liệu vào bảng shifts
INSERT INTO shifts (name, start_time, end_time) VALUES
('Ca sáng', '07:00:00', '15:00:00'),
('Ca chiều', '15:00:00', '23:00:00'),
('Ca đêm', '23:00:00', '07:00:00');

-- Chèn dữ liệu vào bảng staff_shifts
INSERT INTO staff_shifts (shift_id, staff_id, date, status) VALUES
(1, 2, '2025-04-05', 'Assigned'),
(2, 3, '2025-04-05', 'Assigned'),
(3, 4, '2025-04-05', 'Assigned'),
(1, 3, '2025-04-06', 'Assigned'),
(2, 4, '2025-04-06', 'Assigned'),
(3, 2, '2025-04-06', 'Assigned');

-- Chèn dữ liệu vào bảng tables
INSERT INTO tables (capacity, status, location, qrcode) VALUES
(2, 'Available', 'Tầng 1 - Góc cửa sổ', 'https://nhahang.com/qr/table1'),
(4, 'Available', 'Tầng 1 - Giữa', 'https://nhahang.com/qr/table2'),
(6, 'Occupied', 'Tầng 1 - Gần quầy bar', 'https://nhahang.com/qr/table3'),
(8, 'Available', 'Tầng 2 - Ban công', 'https://nhahang.com/qr/table4'),
(2, 'Occupied', 'Tầng 2 - Góc lãng mạn', 'https://nhahang.com/qr/table5');

-- Chèn dữ liệu vào bảng categories
INSERT INTO categories (name, description, image, status) VALUES
('Món khai vị', 'Các món ăn nhẹ khai vị', 'khaivi.jpg', 'Active'),
('Món chính', 'Các món ăn chính', 'monchinh.jpg', 'Active'),
('Món tráng miệng', 'Các món tráng miệng ngọt', 'trangmieng.jpg', 'Active'),
('Đồ uống', 'Các loại nước uống', 'douong.jpg', 'Active'),
('Lẩu & Nướng', 'Các món lẩu và nướng', 'launuong.jpg', 'Active');

-- Chèn dữ liệu vào bảng dishes
INSERT INTO dishes (category_id, name, description, price, image, status) VALUES
(1, 'Gỏi cuốn tôm thịt', 'Gỏi cuốn tươi với tôm, thịt heo và rau thơm', 65000, 'goicuon.jpg', 'Available'),
(1, 'Chả giò hải sản', 'Chả giò giòn với nhân hải sản', 75000, 'chagio.jpg', 'Available'),
(1, 'Salad trộn kiểu Thái', 'Salad chua cay kiểu Thái', 85000, 'salad.jpg', 'Available'),
(2, 'Cơm tấm sườn bì chả', 'Cơm tấm với sườn nướng, bì và chả', 95000, 'comtam.jpg', 'Available'),
(2, 'Bún bò Huế', 'Bún bò Huế đặc biệt cay nồng', 89000, 'bunbo.jpg', 'Available'),
(2, 'Phở bò tái nạm', 'Phở bò với thịt tái và nạm', 79000, 'pho.jpg', 'Available'),
(3, 'Chè hạt sen long nhãn', 'Chè hạt sen với long nhãn và thạch', 45000, 'che.jpg', 'Available'),
(3, 'Bánh flan caramel', 'Bánh flan mềm mịn với caramel', 35000, 'flan.jpg', 'Available'),
(4, 'Nước ép cam tươi', 'Nước ép từ cam tươi nguyên chất', 45000, 'nuoccam.jpg', 'Available'),
(4, 'Sinh tố bơ', 'Sinh tố bơ đặc creamy', 55000, 'sinhtobo.jpg', 'Available'),
(4, 'Trà đào cam sả', 'Trà đào thơm mát với cam và sả', 49000, 'tradao.jpg', 'Available'),
(5, 'Lẩu Thái hải sản', 'Lẩu Thái chua cay với hải sản tươi (phục vụ 2-4 người)', 350000, 'lauthai.jpg', 'Available'),
(5, 'Bò nướng lá lốt', 'Bò cuộn lá lốt nướng than hoa', 165000, 'bonuong.jpg', 'Available');

-- Chèn dữ liệu vào bảng orders
INSERT INTO orders (staff_id, table_number, customer_id, order_date, status, notes, payment_status) VALUES
(2, 3, 1, '2025-04-05 12:30:00', 'Completed', 'Khách yêu cầu ít cay', 'Paid'),
(3, 5, 2, '2025-04-05 13:15:00', 'Processing', 'Khách dị ứng hải sản', 'Unpaid'),
(4, 3, 3, '2025-04-04 19:20:00', 'Completed', NULL, 'Paid'),
(2, 1, 4, '2025-04-04 20:10:00', 'Completed', 'Khách muốn thêm đá', 'Paid');

-- Chèn dữ liệu vào bảng order_items (lưu ý cần chỉnh sửa order_id và dish_id phù hợp)
INSERT INTO order_items (order_id, dish_id, quantity, unit_price, notes, status) VALUES
(1, 1, 2, 65000, NULL, 'Served'),
(1, 5, 1, 89000, 'Ít cay', 'Served'),
(1, 10, 2, 55000, NULL, 'Served'),
(2, 4, 1, 95000, NULL, 'Processing'),
(2, 7, 1, 45000, NULL, 'Processing'),
(2, 11, 2, 49000, 'Thêm đá', 'Ordered'),
(3, 12, 1, 350000, NULL, 'Served'),
(3, 9, 4, 45000, NULL, 'Served'),
(4, 6, 2, 79000, NULL, 'Served'),
(4, 8, 2, 35000, NULL, 'Served');

-- Chèn dữ liệu vào bảng payments
INSERT INTO payments (order_id, customer_id, amount, payment_method, transaction_id, status) VALUES
(1, 1, 329000, 'Cash', NULL, 'Success'),
(3, 3, 530000, 'Card', 'TXN12345678', 'Success'),
(4, 4, 228000, 'Online', 'TXN23456789', 'Success');

-- Chèn dữ liệu vào bảng notifications
INSERT INTO notifications (table_number, title, content, type) VALUES
(3, 'Yêu cầu thêm nước uống', 'Khách hàng ở bàn 3 cần thêm nước uống', 'TableRequest'),
(5, 'Yêu cầu hỗ trợ', 'Bàn số 5 cần sự hỗ trợ từ nhân viên', 'TableRequest'),
(1, 'Yêu cầu thanh toán', 'Khách hàng ở bàn 1 muốn thanh toán', 'TableRequest'),
(2, 'Yêu cầu khăn giấy', 'Khách hàng ở bàn 2 cần thêm khăn giấy', 'TableRequest'),
(4, 'Yêu cầu đổi món', 'Khách hàng ở bàn 4 muốn đổi món vì quá mặn', 'TableRequest');

-- Chèn dữ liệu vào bảng customer_feedback
INSERT INTO customer_feedback (customer_id, order_id, rating, comment, status) VALUES
(1, 1, 5, 'Thức ăn rất ngon và nhân viên phục vụ tận tình', 'New'),
(3, 3, 4, 'Món ăn ngon nhưng phục vụ hơi chậm', 'New'),
(4, 4, 5, 'Tuyệt vời! Sẽ quay lại lần sau', 'New');

-- Chèn dữ liệu vào bảng suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('Công ty TNHH Thực phẩm Sạch', 'Nguyễn Văn A', '0912345678', 'contact@thucphamsach.vn', '123 Đường Lê Lợi, Quận 1, TP.HCM'),
('Công ty Hải sản Tươi Sống', 'Trần Thị B', '0923456789', 'sales@haisantuoisong.vn', '456 Đường Nguyễn Huệ, Quận 1, TP.HCM'),
('Nhà cung cấp Rau Hữu cơ', 'Lê Văn C', '0934567890', 'info@rauhuuco.vn', '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM');

-- Chèn dữ liệu vào bảng ingredients
INSERT INTO ingredients (supplier_id, name, description, unit, cost_per_unit, status, minimum_quantity) VALUES
(1, 'Thịt bò', 'Thịt bò Úc nhập khẩu', 'kg', 350000, 'Available', 5),
(1, 'Thịt heo', 'Thịt heo sạch từ trang trại', 'kg', 180000, 'Available', 10),
(2, 'Tôm sú', 'Tôm sú tươi size 30-40', 'kg', 320000, 'Available', 3),
(2, 'Mực ống', 'Mực ống tươi', 'kg', 280000, 'Available', 2),
(3, 'Rau xà lách', 'Rau xà lách hữu cơ', 'kg', 60000, 'Available', 2),
(3, 'Rau thơm các loại', 'Bộ rau thơm đủ loại', 'bó', 15000, 'Available', 20);

-- Chèn dữ liệu vào bảng dish_ingredients
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity) VALUES
(1, 3, 0.2),  -- Gỏi cuốn cần 0.2kg tôm
(1, 2, 0.15), -- Gỏi cuốn cần 0.15kg thịt heo
(1, 6, 0.1),  -- Gỏi cuốn cần 0.1 bó rau thơm
(4, 2, 0.25), -- Cơm tấm cần 0.25kg thịt heo
(5, 1, 0.3),  -- Bún bò cần 0.3kg thịt bò
(6, 1, 0.25), -- Phở bò cần 0.25kg thịt bò
(12, 3, 0.5), -- Lẩu Thái cần 0.5kg tôm
(12, 4, 0.3), -- Lẩu Thái cần 0.3kg mực
(13, 1, 0.4); -- Bò nướng cần 0.4kg thịt bò

-- Chèn dữ liệu vào bảng inventory
INSERT INTO inventory (ingredient_id, quantity, unit, supplier_id) VALUES
(1, 20, 'kg', 1),
(2, 35, 'kg', 1),
(3, 15, 'kg', 2),
(4, 8, 'kg', 2),
(5, 12, 'kg', 3),
(6, 50, 'bó', 3);

-- Gọi procedure cập nhật doanh thu cho các ngày đã có đơn hàng
CALL UpdateDailyRevenue('2025-04-04');
CALL UpdateDailyRevenue('2025-04-05');