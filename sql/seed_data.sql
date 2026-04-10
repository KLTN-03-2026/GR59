-- SQL Script: HỆ THỐNG TRI THỨC DU LỊCH CHUYÊN SÂU (Huế - Đà Nẵng - Quảng Nam) 
-- Phục vụ KLTN với dữ liệu cực kỳ chi tiết cho vùng trọng điểm.

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE trip_items;
TRUNCATE TABLE trips;
TRUNCATE TABLE places;
TRUNCATE TABLE provinces;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. DANH SÁCH TỈNH THÀNH (PROVINCES)
INSERT INTO provinces (id, name, code, region, created_at, updated_at) VALUES 
(1, 'Huế', 'HUE', 'Miền Trung', NOW(), NOW()),
(2, 'Đà Nẵng', 'DN', 'Miền Trung', NOW(), NOW()),
(3, 'Quảng Nam (Hội An)', 'QNA', 'Miền Trung', NOW(), NOW()),
(4, 'Hà Nội', 'HN', 'Miền Bắc', NOW(), NOW()),
(5, 'TP. Hồ Chí Minh', 'HCM', 'Miền Nam', NOW(), NOW());

-- 2. DANH SÁCH ĐỊA ĐIỂM (PLACES)

-- ==========================================
-- [HUẾ - CỐ ĐÔ THẦN KINH]
-- ==========================================
INSERT INTO places (name, province_id, category, description, estimated_duration, average_price, status, created_at, updated_at) VALUES
('Đại Nội Huế', 1, 'CULTURE', 'Hoàng cung của 13 vị vua triều Nguyễn với Ngọ Môn, Điện Thái Hòa, Tử Cấm Thành.', 180, 200000, 'ACTIVE', NOW(), NOW()),
('Chùa Thiên Mụ', 1, 'CULTURE', 'Ngôi chùa cổ nhất Huế bên dòng sông Hương thơ mộng, có tháp Phước Duyên 7 tầng.', 60, 0, 'ACTIVE', NOW(), NOW()),
('Lăng Khải Định', 1, 'CULTURE', 'Kiến trúc giao thoa Đông - Tây cực kỳ tinh xảo và lộng lẫy nhất trong các lăng vua.', 90, 150000, 'ACTIVE', NOW(), NOW()),
('Lăng Tự Đức', 1, 'CULTURE', 'Lăng tẩm thơ mộng nhất, nơi nhà vua nghỉ ngơi, làm thơ và đọc sách.', 120, 150000, 'ACTIVE', NOW(), NOW()),
('Lăng Minh Mạng', 1, 'CULTURE', 'Kiến trúc uy nghiêm, hài hòa tuyệt đối với thiên nhiên hồ nước và núi non.', 120, 150000, 'ACTIVE', NOW(), NOW()),
('Điện Hòn Chén', 1, 'CULTURE', 'Nơi thờ Thánh mẫu Thiên Y A Na với các lễ hội hầu đồng đặc sắc trên sông.', 90, 50000, 'ACTIVE', NOW(), NOW()),
('Chợ Đông Ba', 1, 'CULTURE', 'Khu chợ truyền thống sầm uất, nơi trải nghiệm văn hóa và ẩm thực địa phương.', 120, 0, 'ACTIVE', NOW(), NOW()),
('Cầu Trường Tiền', 1, 'ATTRACTION', 'Cây cầu biểu tượng bắc qua sông Hương, đẹp nhất về đêm khi lên đèn.', 45, 0, 'ACTIVE', NOW(), NOW()),
('Phố Đi Bộ Chu Văn An', 1, 'NIGHTLIFE', 'Khu phố Tây sôi động với nhiều quán bar, pub và nhạc sống về đêm.', 180, 0, 'ACTIVE', NOW(), NOW()),
('Nhà Vườn An Hiên', 1, 'CULTURE', 'Ngôi nhà vườn tiêu biểu nhất xứ Huế với kiến trúc nhà rường và vườn cây trái.', 60, 30000, 'ACTIVE', NOW(), NOW()),
('Trường Quốc Học Huế', 1, 'CULTURE', 'Ngôi trường cổ kính với tường gạch đỏ, nơi Bác Hồ từng theo học.', 45, 0, 'ACTIVE', NOW(), NOW()),
('Sông Hương - Nghe Ca Huế', 1, 'CULTURE', 'Trải nghiệm đi thuyền rồng ngắm cảnh và nghe nhã nhạc cung đình.', 90, 100000, 'ACTIVE', NOW(), NOW()),
-- Ẩm thực Huế
('Cơm Hến Hoa Đông', 1, 'FOOD', 'Địa chỉ cơm hến, bún hến lâu đời và chuẩn vị nhất tại Cồn Hến.', 45, 25000, 'ACTIVE', NOW(), NOW()),
('Bún Bò Huế O Kiều', 1, 'FOOD', 'Quán bún bò nổi tiếng với nước dùng đậm đà, chuẩn vị gốc Huế.', 45, 50000, 'ACTIVE', NOW(), NOW()),
('Bánh Khoái Lạc Thiện', 1, 'FOOD', 'Đặc sản bánh khoái giòn rụm với nước chấm tương đậu gia truyền.', 60, 60000, 'ACTIVE', NOW(), NOW()),
('Chè Hẻm Hùng Vương', 1, 'FOOD', 'Nơi thưởng thức hàng chục loại chè Huế, đặc biệt là chè bột lọc bọc heo quay.', 45, 15000, 'ACTIVE', NOW(), NOW()),
('Bánh Bèo Nậm Lọc Bà Đỏ', 1, 'FOOD', 'Địa chỉ thưởng thức các loại bánh lá Huế nổi tiếng nhất.', 60, 80000, 'ACTIVE', NOW(), NOW()),
('Cà Phê Muối Nguyễn Lương Bằng', 1, 'FOOD', 'Nơi khai sinh ra món cà phê muối đặc sản của xứ Huế.', 45, 25000, 'ACTIVE', NOW(), NOW());

-- ==========================================
-- [ĐÀ NẴNG - THÀNH PHỐ ĐÁNG SỐNG]
-- ==========================================
INSERT INTO places (name, province_id, category, description, estimated_duration, average_price, status, created_at, updated_at) VALUES
('Bà Nà Hills', 2, 'ATTRACTION', 'Khu du lịch trên đỉnh núi Chúa với Cầu Vàng, làng Pháp và cáp treo kỷ lục.', 480, 900000, 'ACTIVE', NOW(), NOW()),
('Bán đảo Sơn Trà', 2, 'NATURE', 'Lá phổi xanh của thành phố, tham quan chùa Linh Ứng và ngắm Voọc chà vá chân nâu.', 180, 0, 'ACTIVE', NOW(), NOW()),
('Ngũ Hành Sơn', 2, 'NATURE', 'Quần thể 5 ngọn núi đá vôi với các hang động huyền bí và chùa cổ.', 150, 40000, 'ACTIVE', NOW(), NOW()),
('Cầu Rồng', 2, 'ATTRACTION', 'Biểu tượng của Đà Nẵng, phun lửa và nước vào 21:00 tối cuối tuần.', 45, 0, 'ACTIVE', NOW(), NOW()),
('Cầu Vàng (Golden Bridge)', 2, 'ATTRACTION', 'Cây cầu được nâng đỡ bởi hai bàn tay khổng lồ, điểm check-in nổi tiếng thế giới.', 60, 0, 'ACTIVE', NOW(), NOW()),
('Bảo tàng Điêu khắc Chăm', 2, 'CULTURE', 'Nơi lưu giữ bộ sưu tập hiện vật Chăm Pa lớn nhất thế giới.', 90, 60000, 'ACTIVE', NOW(), NOW()),
('Biển Mỹ Khê', 2, 'NATURE', 'Một trong những bãi biển đẹp nhất hành tinh với bãi cát dài và sóng êm.', 120, 0, 'ACTIVE', NOW(), NOW()),
('Công viên Châu Á (Asia Park)', 2, 'ATTRACTION', 'Khu vui chơi với vòng quay mặt trời Sun Wheel ngắm toàn cảnh thành phố.', 180, 200000, 'ACTIVE', NOW(), NOW()),
('Đèo Hải Vân', 2, 'NATURE', 'Cung đường đèo ven biển đẹp nhất Việt Nam, ranh giới giữa Huế và Đà Nẵng.', 120, 0, 'ACTIVE', NOW(), NOW()),
('Suối Khoáng Nóng Thần Tài', 2, 'RELAX', 'Công viên suối khoáng nóng với nhiều dịch vụ tắm bùn, tắm onsen.', 300, 450000, 'ACTIVE', NOW(), NOW()),
('Chợ Cồn', 2, 'CULTURE', 'Thiên đường ẩm thực với khu ăn vặt cực kỳ đa dạng và rẻ.', 90, 0, 'ACTIVE', NOW(), NOW()),
('Chợ Hàn', 2, 'CULTURE', 'Khu chợ mua sắm đặc sản và quà lưu niệm nổi tiếng nhất Đà Nẵng.', 90, 0, 'ACTIVE', NOW(), NOW()),
('Nhà Thờ Con Gà', 2, 'CULTURE', 'Nhà thờ Chính tòa Đà Nẵng với màu hồng đặc trưng và kiến trúc Gothic.', 45, 0, 'ACTIVE', NOW(), NOW()),
('Đỉnh Bàn Cờ', 2, 'NATURE', 'Điểm cao nhất bán đảo Sơn Trà, nơi có tượng tiên ông ngồi đánh cờ.', 60, 0, 'ACTIVE', NOW(), NOW()),
-- Ẩm thực Đà Nẵng
('Mì Quảng Bà Mua', 2, 'FOOD', 'Thương hiệu mì quảng nổi tiếng nhất với nước nhân đậm đà.', 60, 50000, 'ACTIVE', NOW(), NOW()),
('Bánh Tráng Cuốn Thịt Heo Bi Mỹ', 2, 'FOOD', 'Đặc sản thịt heo hai đầu da cuốn bánh tráng đại lộc.', 60, 100000, 'ACTIVE', NOW(), NOW()),
('Bún Chả Cá Quy Nhơn - Ông Tạ', 2, 'FOOD', 'Quán bún chả cá lâu đời và cực kỳ đông khách tại Đà Nẵng.', 45, 40000, 'ACTIVE', NOW(), NOW()),
('Hải Sản Năm Đảnh', 2, 'FOOD', 'Quán hải sản ngon bổ rẻ nằm trong hẻm sâu nhưng cực kỳ hút khách.', 120, 150000, 'ACTIVE', NOW(), NOW()),
('Bánh Xèo Bà Dưỡng', 2, 'FOOD', 'Món bánh xèo miền Trung giòn tan với nước lèo đặc trưng.', 60, 80000, 'ACTIVE', NOW(), NOW()),
('Chè Liên', 2, 'FOOD', 'Nổi tiếng với món chè thái sầu riêng gây nghiện khắp cả nước.', 30, 30000, 'ACTIVE', NOW(), NOW());

-- ==========================================
-- [QUẢNG NAM - HỘI AN - DI SẢN THỜI GIAN]
-- ==========================================
INSERT INTO places (name, province_id, category, description, estimated_duration, average_price, status, created_at, updated_at) VALUES
('Phố Cổ Hội An', 3, 'CULTURE', 'Quần thể kiến trúc cổ kính với chùa Cầu, nhà cổ Tân Ký, hội quán Quảng Đông.', 240, 80000, 'ACTIVE', NOW(), NOW()),
('Chùa Cầu (Japanese Bridge)', 3, 'CULTURE', 'Biểu tượng của Hội An, cây cầu do thương nhân Nhật Bản xây dựng từ thế kỷ 17.', 30, 0, 'ACTIVE', NOW(), NOW()),
('Thánh địa Mỹ Sơn', 3, 'CULTURE', 'Di sản thế giới với những ngôi đền tháp Chăm Pa cổ xưa đầy huyền bí.', 180, 150000, 'ACTIVE', NOW(), NOW()),
('Cù Lao Chàm', 3, 'NATURE', 'Khu dự trữ sinh quyển thế giới với các hoạt động lặn ngắm san hô.', 480, 600000, 'ACTIVE', NOW(), NOW()),
('Rừng Dừa Bảy Mẫu', 3, 'NATURE', 'Trải nghiệm đi thúng chai, xem múa thúng và đánh bắt cá truyền thống.', 120, 150000, 'ACTIVE', NOW(), NOW()),
('Làng Gốm Thanh Hà', 3, 'CULTURE', 'Ngôi làng nghề truyền thống với bảo tàng gốm terracotta độc đáo.', 90, 40000, 'ACTIVE', NOW(), NOW()),
('Làng Rau Trà Quế', 3, 'NATURE', 'Trải nghiệm làm nông dân và thưởng thức rau sạch nổi tiếng.', 90, 50000, 'ACTIVE', NOW(), NOW()),
('Biển An Bàng', 3, 'RELAX', 'Top 50 bãi biển đẹp nhất thế giới, không gian yên bình và thư giãn.', 180, 0, 'ACTIVE', NOW(), NOW()),
('Công viên Ấn Tượng Hội An', 3, 'CULTURE', 'Nơi diễn ra show diễn thực cảnh "Ký ức Hội An" hoành tráng nhất VN.', 180, 600000, 'ACTIVE', NOW(), NOW()),
('VinWonders Nam Hội An', 3, 'ATTRACTION', 'Khu tổ hợp giải trí, văn hóa và động vật safari lớn nhất miền Trung.', 480, 600000, 'ACTIVE', NOW(), NOW()),
('Tượng đài Mẹ Thứ', 3, 'CULTURE', 'Tượng đài Bà mẹ Việt Nam Anh hùng lớn nhất nước tại Tam Kỳ.', 60, 0, 'ACTIVE', NOW(), NOW()),
-- Ẩm thực Hội An & Quảng Nam
('Cơm Gà Bà Buội', 3, 'FOOD', 'Tiệm cơm gà lâu đời nhất Hội An, đặc trưng với gà ta thả vườn.', 60, 50000, 'ACTIVE', NOW(), NOW()),
('Bánh Mì Phượng', 3, 'FOOD', 'Ổ bánh mì được đầu bếp nổi tiếng Anthony Bourdain khen ngợi hết lời.', 30, 35000, 'ACTIVE', NOW(), NOW()),
('Cao Lầu Thanh', 3, 'FOOD', 'Món ăn linh hồn của Hội An với sợi mì dai và thịt xá xíu đậm đà.', 45, 40000, 'ACTIVE', NOW(), NOW()),
('Nước Mót Hội An', 3, 'FOOD', 'Thức uống thảo mộc trang trí hoa sen cực kỳ đẹp và thanh mát.', 15, 15000, 'ACTIVE', NOW(), NOW()),
('Bún Chả Cá Quy Nhơn Hội An', 3, 'FOOD', 'Món bún chả cá thơm ngon với nước dùng từ xương cá cờ.', 45, 30000, 'ACTIVE', NOW(), NOW()),
('Bê Thui Cầu Mống', 3, 'FOOD', 'Đặc sản Quảng Nam nổi tiếng nhất nhì vùng đất này.', 60, 150000, 'ACTIVE', NOW(), NOW());

-- ==========================================
-- BỔ SUNG CÁC VÙNG KHÁC (MIỀN BẮC & MIỀN NAM)
-- ==========================================
INSERT INTO places (name, province_id, category, description, estimated_duration, average_price, status, created_at, updated_at) VALUES
('Hồ Hoàn Kiếm', 4, 'NATURE', 'Trái tim của Hà Nội với Đền Ngọc Sơn.', 60, 0, 'ACTIVE', NOW(), NOW()),
('Văn Miếu Quốc Tử Giám', 4, 'CULTURE', 'Trường đại học đầu tiên của Việt Nam.', 90, 30000, 'ACTIVE', NOW(), NOW()),
('Dinh Độc Lập', 5, 'CULTURE', 'Di tích lịch sử quan trọng tại Sài Gòn.', 120, 65000, 'ACTIVE', NOW(), NOW()),
('Nhà thờ Đức Bà', 5, 'CULTURE', 'Biểu tượng kiến trúc Sài Gòn.', 45, 0, 'ACTIVE', NOW(), NOW());

insert into roles values
(1,'Người dùng', 1, 'USER'),
(2,'Quản trị viên', 1, 'ADMIN')


-- CẬP NHẬT TỔNG QUAN
SELECT count(*) as total_places FROM places;
