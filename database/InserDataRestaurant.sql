-- Chèn dữ liệu vào bảng users
INSERT INTO users (username, password, user_type, email, phone, status) VALUES
('Admin', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'ADMIN', 'admin@nhahang.com', '0901234567', 'Active'),
('nhanvien01', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'STAFF', 'nhanvien01@nhahang.com', '0912345678', 'Active'),
('nhanvien02', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'STAFF', 'nhanvien02@nhahang.com', '0923456789', 'Active'),
('nhanvien03', '$2a$12$Dz3UiHncevyiMFQEZjGOYetjoo.YbAvqciGlvWErIAfI2upuBqngW', 'STAFF', 'nhanvien03@nhahang.com', '0934567890', 'Active');

-- Chèn dữ liệu vào bảng staff
INSERT INTO staff (user_id, fullname, position, salary, hire_date, status) VALUES
(1, 'Nguyễn Văn Admin', 'Quản lý', 20000000, '2023-01-01', 'Active'),
(2, 'Trần Thị Nhân Viên', 'Nhân viên phục vụ', 8000000, '2023-02-15', 'Active'),
(3, 'Lê Văn Đầu Bếp', 'Đầu bếp', 12000000, '2023-01-10', 'Active'),
(4, 'Phạm Thị Thu Ngân', 'Thu ngân', 9000000, '2023-03-01', 'Active');

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
(6, 'Available', 'Tầng 1 - Gần quầy bar', 'https://nhahang.com/qr/table3'),
(8, 'Available', 'Tầng 2 - Ban công', 'https://nhahang.com/qr/table4'),
(4, 'Available', '', ''),
(4, 'Available', '', ''),
(4, 'Available', '', ''),
(4, 'Available', '', ''),
(4, 'Available', '', ''),
(2, 'Available', 'Tầng 2 - Góc lãng mạn', 'https://nhahang.com/qr/table5');

-- Chèn dữ liệu vào bảng categories
INSERT INTO categories (name, description, image, status) VALUES
('Món khai vị', 'Các món ăn nhẹ khai vị', 'khaivi.jpg', 'Active'),
('Món chính', 'Các món ăn chính', 'monchinh.jpg', 'Active'),
('Món tráng miệng', 'Các món tráng miệng ngọt', 'trangmieng.jpg', 'Active'),
('Đồ uống', 'Các loại nước uống', 'douong.jpg', 'Active'),
('Lẩu & Nướng', 'Các món lẩu và nướng', 'launuong.jpg', 'Active');

-- Chèn dữ liệu vào bảng dishes
INSERT INTO dishes (category_id, name, description, price, image, status) VALUES
(1, 'Gỏi cuốn tôm thịt', 'Gỏi cuốn tươi với tôm, thịt heo và rau thơm', 65000, 'https://naucohungthinh.com/files/media/202109/5519_4.jpg', 'Available'),
(1, 'Chả giò hải sản', 'Chả giò giòn với nhân hải sản', 75000, 'https://giochabobich.com/wp-content/uploads/2023/03/cha-gio-hai-san-1000x565.jpg', 'Available'),
(1, 'Salad trộn kiểu Thái', 'Salad chua cay kiểu Thái', 85000, 'https://cdn.tgdd.vn/2021/07/CookProduct/Tom-tron-mien-kieu-Thai-1080x608.jpg', 'Available'),
(2, 'Cơm tấm sườn bì chả', 'Cơm tấm với sườn nướng, bì và chả', 95000, 'https://cdn.tgdd.vn/Files/2021/08/16/1375565/cach-nau-com-tam-suon-bi-cha-tai-nha-ngon-nhu-ngoai-tiem-202108162244282026.jpg', 'Available'),
(2, 'Bún bò Huế', 'Bún bò Huế đặc biệt cay nồng', 89000, 'https://www.hungryhuy.com/wp-content/uploads/bun-bo-hue-bowl.jpg', 'Available'),
(2, 'Phở bò tái nạm', 'Phở bò với thịt tái và nạm', 79000, 'https://hotel84.com/userfiles/image/amthuc/hanoi/pho-bo-tai-30k.jpg', 'Available'),
(3, 'Chè hạt sen long nhãn', 'Chè hạt sen với long nhãn và thạch', 45000, 'https://bepmina.vn/wp-content/uploads/2021/08/che-hat-sen-long-nhankho-2048x1449.jpeg', 'Available'),
(3, 'Bánh flan caramel', 'Bánh flan mềm mịn với caramel', 35000, 'https://fullofplants.com/wp-content/uploads/2019/05/how-to-make-vegan-creme-caramel-dairy-free-flan-eggless-thumb.jpg', 'Available'),
(4, 'Nước ép cam tươi', 'Nước ép từ cam tươi nguyên chất', 45000, 'https://cdn.tgdd.vn/Files/2018/11/27/1134029/cong-dung-cua-nuoc-cam-tuoi-va-cach-bao-quan-nuoc-cam-tot-nhat-6.jpg', 'Available'),
(4, 'Sinh tố bơ', 'Sinh tố bơ đặc creamy', 55000, 'https://phunugioi.com/wp-content/uploads/2020/11/cach-lam-sinh-to-bo-xoai.jpg', 'Available'),
(4, 'Trà đào cam sả', 'Trà đào thơm mát với cam và sả', 49000, 'https://cdn.dealtoday.vn/1b720191a9c543999ed82e6fe2b71f5f.jpg', 'Available'),
(5, 'Lẩu Thái hải sản', 'Lẩu Thái chua cay với hải sản tươi (phục vụ 2-4 người)', 350000, 'https://cdn.nguyenkimmall.com/images/companies/_1/tin-tuc/kinh-nghiem-meo-hay/n%E1%BA%A5u%20%C4%83n/nau-lau-thai-chuan-vi-ngon-nhu-the-nao.jpg', 'Available'),
(5, 'Bò nướng lá lốt', 'Bò cuộn lá lốt nướng than hoa', 165000, 'https://fujifoods.vn/wp-content/uploads/2021/05/bo-nuong-la-lot-3.jpg', 'Available');

-- Chèn dữ liệu vào bảng notifications
INSERT INTO notifications (table_number, title, content, type) VALUES
(3, 'Yêu cầu thêm nước uống', 'Khách hàng ở bàn 3 cần thêm nước uống', 'TableRequest'),
(5, 'Yêu cầu hỗ trợ', 'Bàn số 5 cần sự hỗ trợ từ nhân viên', 'TableRequest'),
(1, 'Yêu cầu thanh toán', 'Khách hàng ở bàn 1 muốn thanh toán', 'TableRequest'),
(2, 'Yêu cầu khăn giấy', 'Khách hàng ở bàn 2 cần thêm khăn giấy', 'TableRequest'),
(4, 'Yêu cầu đổi món', 'Khách hàng ở bàn 4 muốn đổi món vì quá mặn', 'TableRequest');

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
CALL UpdateDailyRevenue('2025-05-19');
CALL UpdateDailyRevenue('2025-05-20');