-- ==============================================
-- FAKE/TEST DATA - TravelAI Application
-- Generated: 2026-04-01
-- Corrected schema to match actual JPA entities
-- ==============================================

SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================
-- 1. USERS - Dữ liệu người dùng giả
-- ==============================================
INSERT INTO users (id, email, password, full_name, address, avatar_url, phone, role_id, is_active, google_id, facebook_id, is_google_linked, is_facebook_linked, created_at, updated_at) VALUES
(1, 'admin@travelai.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Nguyễn Quản Trị', 'Hà Nội', 'https://via.placeholder.com/150?text=Admin', '0912345678', 1, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(2, 'tuan.nguyen@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Nguyễn Tuấn', '123 Đường Lê Lợi, Đà Nẵng', 'https://via.placeholder.com/150?text=Tuan', '0901234567', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(3, 'linh.pham@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Phạm Linh', '456 Đường Trần Hưng Đạo, Huế', 'https://via.placeholder.com/150?text=Linh', '0902345678', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(4, 'hung.le@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Lê Hùng', '789 Đường Nguyễn Huệ, TP.HCM', 'https://via.placeholder.com/150?text=Hung', '0903456789', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(5, 'mai.tran@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Trần Mai', '321 Đường Hoan Kiếm, Hà Nội', 'https://via.placeholder.com/150?text=Mai', '0904567890', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(6, 'khanh.hoang@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Hoàng Khánh', '654 Đường Bến Thuyền, Đà Nẵng', 'https://via.placeholder.com/150?text=Khanh', '0905678901', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(7, 'duc.phan@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Phan Đức', '987 Đường Sơn Trà, Đà Nẵng', 'https://via.placeholder.com/150?text=Duc', '0906789012', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(8, 'hoa.ngo@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Ngô Hoa', '246 Đường Cầu Nhat, Hội An', 'https://via.placeholder.com/150?text=Hoa', '0907890123', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(9, 'son.dang@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Đặng Sơn', '135 Đường Lê Duẩn, TP.HCM', 'https://via.placeholder.com/150?text=Son', '0908901234', 2, 1, NULL, NULL, 0, 0, NOW(), NOW()),
(10, 'lan.vu@example.com', '$2a$10$SlVH7psbfsQC.mGxVHujL.y5kYfvLWVSTUmJJLHnKXZN7xFHz7mxi', 'Vũ Lan', '468 Đường Thái Phiên, Quảng Nam', 'https://via.placeholder.com/150?text=Lan', '0909012345', 2, 1, NULL, NULL, 0, 0, NOW(), NOW());

-- ==============================================
-- 2. TRIPS - Dữ liệu chuyến du lịch
-- ==============================================
INSERT INTO trips (id, user_id, title, destination, start_date, end_date, status, total_budget, prompt_data, ai_response_data, created_at, updated_at) VALUES
(1, 2, 'Hành trình Đà Nẵng - Hội An Hè 2026', 'Đà Nẵng - Hội An', '2026-06-15', '2026-06-22', 'PLANNED', 15000000, 
  '{"destination": "Da Nang - Hoi An", "duration": 7, "budget": 15000000, "interests": ["beach", "culture", "food"], "groupSize": 2}',
  '{"itinerary": [{"day": 1, "activities": ["Arrive Da Nang", "Ba Na Hills"]}, {"day": 2, "activities": ["My Khe Beach", "Hoi An old town"]}]}',
  '2026-03-01', '2026-03-15'),
(2, 3, 'Khám phá Huế - Thành phố Bình Yên', 'Huế', '2026-07-10', '2026-07-15', 'DRAFT', 8000000,
  '{"destination": "Hue", "duration": 5, "budget": 8000000, "interests": ["history", "culture"], "groupSize": 1}',
  '{"visitPlaces": ["Dai Noi", "Thien Mu", "Imperial Tombs"]}',
  '2026-02-20', '2026-03-10'),
(3, 4, 'Tour Sa Pa - Lên Fansipan', 'Sa Pa', '2026-05-01', '2026-05-04', 'COMPLETED', 10000000,
  '{"destination": "Sapa", "duration": 3, "budget": 10000000, "interests": ["hiking", "nature"], "groupSize": 3}',
  '{"guide": "Local guide", "activities": ["Fansipan trek", "Local market"]}',
  '2026-01-15', '2026-01-30'),
(4, 5, 'Hành trình Phú Quốc - Thiên đường biển', 'Phú Quốc', '2026-08-01', '2026-08-07', 'PLANNED', 20000000,
  '{"destination": "Phu Quoc", "duration": 6, "budget": 20000000, "interests": ["beach", "luxury", "spa"], "groupSize": 2}',
  '{"resorts": ["Vinpearl", "Melia"], "activities": ["Diving", "Water sports"]}',
  '2026-03-05', '2026-03-12'),
(5, 6, 'Gia Lai - Khám phá Tây Nguyên', 'Gia Lai', '2026-07-20', '2026-07-25', 'PLANNED', 7000000,
  '{"destination": "GiaLai", "duration": 5, "budget": 7000000, "interests": ["coffee", "nature"], "groupSize": 1}',
  '{"plantations": ["Coffee tour"], "activities": ["Trekking", "Local culture"]}',
  '2026-02-28', '2026-03-08'),
(6, 7, 'Mekong Delta - Chợ nổi & sông nước', 'Mekong Delta', '2026-09-10', '2026-09-13', 'DRAFT', 5000000,
  '{"destination": "Mekong Delta", "duration": 3, "budget": 5000000, "interests": ["culture", "food"], "groupSize": 4}',
  '{"boats": ["Traditional boats"], "markets": ["Floating markets"]}',
  '2026-03-02', '2026-03-09'),
(7, 8, 'Quy Nhơn - Bãi biển yên bình', 'Quy Nhơn', '2026-06-05', '2026-06-10', 'PLANNED', 9000000,
  '{"destination": "Quy Nhon", "duration": 5, "budget": 9000000, "interests": ["beach", "relaxation"], "groupSize": 2}',
  '{"beaches": ["Quy Nhon beach"], "attractions": ["Eo Gio", "Thap Nhan"]}',
  '2026-02-10', '2026-02-25'),
(8, 9, 'Nha Trang - Thành phố biển sôi động', 'Nha Trang', '2026-07-01', '2026-07-08', 'COMPLETED', 12000000,
  '{"destination": "Nha Trang", "duration": 7, "budget": 12000000, "interests": ["beach", "diving", "nightlife"], "groupSize": 3}',
  '{"dives": ["Diving school", "Island tours"], "activities": ["Vinpearl Land"]}',
  '2026-01-20', '2026-02-01'),
(9, 10, 'Hà Giang - Moto tour huyền thoại', 'Hà Giang', '2026-10-01', '2026-10-10', 'DRAFT', 11000000,
  '{"destination": "Ha Giang", "duration": 9, "budget": 11000000, "interests": ["adventure", "motorcycle"], "groupSize": 2}',
  '{"route": ["Dong Van", "Meo Vac"], "activities": ["Loop road", "Local villages"]}',
  '2026-03-10', '2026-03-15');

-- ==============================================
-- 3. TRIP ITEMS - Mục chi tiết trong chuyến du lịch
-- ==============================================
INSERT INTO trip_items (id, trip_id, place_id, day_number, start_time, end_time, activity_type, activity_name, ai_note, sequence_order, created_at, updated_at) VALUES
(1, 1, 6, 1, '08:00:00', '12:00:00', 'ATTRACTION', 'Bà Nà Hills', 'Tham quan cáp treo 2 chiều, Cầu Vàng', 1, NOW(), NOW()),
(2, 1, NULL, 1, '12:00:00', '14:00:00', 'RESTAURANT', 'Furama Resort', 'Bữa ăn trưa tại khách sạn', 2, NOW(), NOW()),
(3, 1, NULL, 1, '14:30:00', '18:00:00', 'WALKING_TOUR', 'Phố Cổ Hội An', 'Dạo phố cổ, ngắm đèn lồng', 3, NOW(), NOW()),
(4, 1, NULL, 2, '08:00:00', '17:00:00', 'BEACH_DAY', 'Biển Mỹ Khê', 'Thư giãn tại bãi biển', 4, NOW(), NOW()),
(5, 2, 1, 1, '09:00:00', '12:00:00', 'ATTRACTION', 'Đại Nội Huế', 'Vé vào chuồng + hướng dẫn', 1, NOW(), NOW()),
(6, 2, NULL, 1, '12:30:00', '14:00:00', 'RESTAURANT', 'Saigon Morin Hotel', 'Bữa ăn trưa tại khách sạn', 2, NOW(), NOW()),
(7, 2, NULL, 1, '18:00:00', '19:30:00', 'FOOD_EXPERIENCE', 'Bún Bò Huế O Kiều', 'Bữa tối với đặc sản Huế', 3, NOW(), NOW()),
(8, 3, NULL, 1, '06:00:00', '17:00:00', 'TREKKING', 'Fansipan Peak', 'Leo Fansipan bằng tram cáp', 1, NOW(), NOW()),
(9, 3, NULL, 1, '18:00:00', '20:00:00', 'ACCOMMODATION_CHECK', 'Sapa Legend Hotel', '3 đêm tại khách sạn 3 sao', 2, NOW(), NOW()),
(10, 3, NULL, 2, '08:00:00', '17:00:00', 'GUIDED_TOUR', 'Local Guide Tour', 'Hướng dẫn viên toàn thời gian', 3, NOW(), NOW());

-- ==============================================
-- 4. REVIEWS - Đánh giá địa điểm
-- ==============================================
INSERT INTO reviews (id, user_id, place_id, rating, comment, created_at, updated_at) VALUES
(1, 2, 1, 5, 'Đại Nội Huế thật sự là một kiệt tác kiến trúc tuyệt vời! Tâm trạng thanh tịnh và lịch sử sâu sắc. Hướng dẫn viên rất chuyên nghiệp.', NOW(), NOW()),
(2, 3, 6, 4, 'Bà Nà Hills rất đẹp, Cầu Vàng ấn tượng lắm. Tuy nhiên khá đông người, giá vé hơi mắc.', NOW(), NOW()),
(3, 4, 21, 5, 'Phố cổ Hội An kỳ diệu! Kiến trúc cổ kính, ánh đèn lồng về tối rất lãng mạn. Bánh mì Phượng thật ngon!', NOW(), NOW()),
(4, 5, 13, 4, 'Cơm Gà Bà Buội ngon lắm, gà ta thả vườn mềm và thơm. Phục vụ nhanh, giá cả hợp lý.', NOW(), NOW()),
(5, 6, 3, 5, 'Lăng Khải Định - ngoạn mục và trang trọng. Sự giao thoa giữa Đông Tây rất độc đáo.', NOW(), NOW()),
(6, 7, 16, 5, 'Bánh Tráng Cuốn Thịt Heo - đúng là đặc sản của Đà Nẵng. Thơm ngon không tả được!', NOW(), NOW()),
(7, 8, 23, 4, 'Cao Lầu Thanh - hồn cổa Hội An. Sợi mì dai, thịt xá xíu ngon, nước nhân đậm đà.', NOW(), NOW()),
(8, 9, 10, 5, 'Nhà Vườn An Hiên tuyệt đẹp - cho tôi cảm giác bình yên thực sự. Cây cối xanh tốt, kiến trúc hài hòa.', NOW(), NOW()),
(9, 10, 14, 4, 'Đỉnh Bàn Cờ - view tuyệt vời. Hơi mạm khó leo một chút nhưng xứng đáng với tầm nhìn.', NOW(), NOW()),
(10, 2, 2, 5, 'Chùa Thiên Mụ nguy nga lẫm liệu. Tháp Phước Duyên lịch sử, quang cảnh sông Hương tuyệt đẹp.', NOW(), NOW());

-- ==============================================
-- 5. LOCATIONS - Các địa điểm khác (không linked user)
-- ==============================================
INSERT INTO locations (id, name, description, address, category, rating, image_url, latitude, longitude, created_at, updated_at) VALUES
(1, 'Đại Nội Huế', 'Cung điện hoàng gia với kiến trúc lâu đời', '102 Nguyễn Huệ, Huế', 'ATTRACTION', 4.8, 'https://example.com/dai-noi.jpg', 16.4637, 107.5909, NOW(), NOW()),
(2, 'Bà Nà Hills', 'Khu du lịch trên đỉnh núi với Cầu Vàng', 'Hoàng Văn Thụ, Đà Nẵng', 'ATTRACTION', 4.7, 'https://example.com/ba-na.jpg', 15.9333, 107.9, NOW(), NOW()),
(3, 'Phố Cổ Hội An', 'Di sản thế giới UNESCO', 'Trần Phú, Hội An', 'CULTURAL', 4.9, 'https://example.com/hoi-an.jpg', 15.8793, 108.2963, NOW(), NOW()),
(4, 'Cơm Gà Bà Buội', 'Nhà hàng ẩm thực nổi tiếng', 'Nguyễn Thái Học, Hội An', 'RESTAURANT', 4.6, 'https://example.com/com-ga.jpg', 15.8753, 108.3143, NOW(), NOW()),
(5, 'Cầu Rồng', 'Biểu tượng của Đà Nẵng', 'Tôn Đức Thắng, Đà Nẵng', 'LANDMARK', 4.5, 'https://example.com/cau-rong.jpg', 16.0656, 108.2261, NOW(), NOW()),
(6, 'Lăng Khải Định', 'Lăng vua triều Nguyễn', 'Miếu Mộ, Huế', 'HERITAGE', 4.7, 'https://example.com/lang-khai-dinh.jpg', 16.5, 107.6317, NOW(), NOW()),
(7, 'Làng Gốm Thanh Hà', 'Làng nghề gốm sứ truyền thống', 'Thanh Hà, Hội An', 'CULTURAL', 4.4, 'https://example.com/lang-gom.jpg', 15.8393, 108.2543, NOW(), NOW()),
(8, 'Hồ Hoàn Kiếm', 'Trái tim Thủ Đô Hà Nội', 'Hoàn Kiếm, Hà Nội', 'LANDMARK', 4.6, 'https://example.com/ho-hoan-kiem.jpg', 21.0285, 105.8542, NOW(), NOW()),
(9, 'Dinh Độc Lập', 'Di tích lịch sử quan trọng', 'Bạch Đằng, TP.HCM', 'HERITAGE', 4.5, 'https://example.com/dinh-doc-lap.jpg', 10.783, 106.6834, NOW(), NOW()),
(10, 'Cầu Trường Tiền', 'Cây cầu biểu tượng của Huế', 'Trường Tiền, Huế', 'LANDMARK', 4.6, 'https://example.com/cau-truong-tien.jpg', 16.4618, 107.5742, NOW(), NOW());

-- ==============================================
-- 6. USER PREFERENCES - Sở thích người dùng
-- ==============================================
INSERT INTO user_preferences (id, user_id, preferred_categories, allergies, budget_level, created_at, updated_at) VALUES
(1, 2, '["BEACH", "RESTAURANT", "RELAXATION"]', 'Shellfish, Nuts', 'STANDARD', NOW(), NOW()),
(2, 3, '["CULTURAL", "MUSEUM", "HISTORICAL"]', 'Peanuts', 'STANDARD', NOW(), NOW()),
(3, 4, '["NATURE", "TREKKING", "HIKING"]', NULL, 'ECONOMY', NOW(), NOW()),
(4, 5, '["BEACH", "SPA", "LUXURY_RESORT"]', 'Dairy', 'LUXURY', NOW(), NOW()),
(5, 6, '["CULTURAL", "CRAFT", "HISTORICAL"]', NULL, 'STANDARD', NOW(), NOW()),
(6, 7, '["RESTAURANT", "FOOD_TOUR", "LOCAL_MARKET"]', 'Gluten', 'STANDARD', NOW(), NOW()),
(7, 8, '["NATURE", "ADVENTURE", "OUTDOOR"]', NULL, 'STANDARD', NOW(), NOW()),
(8, 9, '["BEACH", "NIGHTLIFE", "ENTERTAINMENT"]', 'Fish', 'STANDARD', NOW(), NOW()),
(9, 10, '["ADVENTURE", "MOTORCYCLE", "TREKKING"]', NULL, 'STANDARD', NOW(), NOW());

-- ==============================================
-- 7. CHAT SESSIONS - Phiên chat người dùng
-- ==============================================
INSERT INTO chat_sessions (id, user_id, trip_id, created_at, updated_at) VALUES
(1, 2, 1, NOW(), NOW()),
(2, 3, 2, NOW(), NOW()),
(3, 4, 3, NOW(), NOW()),
(4, 5, 4, NOW(), NOW()),
(5, 6, 5, NOW(), NOW()),
(6, 7, 6, NOW(), NOW()),
(7, 8, 7, NOW(), NOW()),
(8, 9, 8, NOW(), NOW());

-- ==============================================
-- 8. CHAT MESSAGES - Tin nhắn trong phiên chat
-- ==============================================
INSERT INTO chat_messages (id, session_id, sender, message_content, created_at, updated_at) VALUES
(1, 1, 'USER', 'Mình muốn đi Đà Nẵng 7 ngày với budget 15 triệu. Nên viếng thăm gì?', '2026-03-01 10:00:00', '2026-03-01 10:00:00'),
(2, 1, 'AI', 'Bạn có thể tham quan: Bà Nà Hills, Cầu Vàng, Phố cổ Hội An, biển Mỹ Khê. Budget phân bổ: Khách sạn 6 triệu, ăn uống 4 triệu, vé tham quan 3 triệu, di chuyển 2 triệu.', '2026-03-01 10:05:00', '2026-03-01 10:05:00'),
(3, 1, 'USER', 'Chi tiết ngày 1 và ngày 2 như thế nào?', '2026-03-01 10:10:00', '2026-03-01 10:10:00'),
(4, 1, 'AI', 'Ngày 1: Đến Đà Nẵng -> Khách sạn -> Cầu Rồng. Ngày 2: Bà Nà Hills -> Cầu Vàng -> Làng Pháp.', '2026-03-01 10:15:00', '2026-03-01 10:15:00'),
(5, 2, 'USER', 'Huế có gì hay mà nổi tiếng?', '2026-03-02 09:00:00', '2026-03-02 09:00:00'),
(6, 2, 'AI', 'Huế nổi tiếng với: Đại Nội hoàng cung, Lăng các vua, Chùa Thiên Mụ, Thành Nhân Lăng, nhã nhạc cung đình.', '2026-03-02 09:05:00', '2026-03-02 09:05:00'),
(7, 3, 'USER', 'Mình là người yêu thích trekking, Sa Pa như thế nào?', '2026-03-03 08:30:00', '2026-03-03 08:30:00'),
(8, 3, 'AI', 'Sa Pa tuyệt vời cho trekking: Fansipan (3143m), Bạc Thác, Bản Cát Cát. Nên đi vào tháng 9-10 hoặc 3-4. Hít thở không khí tinh khiết!', '2026-03-03 08:35:00', '2026-03-03 08:35:00'),
(9, 4, 'USER', 'Resort nào ở Phú Quốc tốt nhất cho nghỉ dưỡng?', '2026-03-04 14:00:00', '2026-03-04 14:00:00'),
(10, 4, 'AI', 'Vinpearl Luxury, Melia Phu Quoc, InterContinental là những lựa chọn hàng đầu. Vinpearl có công viên nước riêng, Melia có spa tuyệt vời.', '2026-03-04 14:05:00', '2026-03-04 14:05:00');

-- ==============================================
-- 9. PLACE EXTENSIONS - Dữ liệu mở rộng cho Places
-- ==============================================
INSERT INTO places (id, name, province_id, category, description, estimated_duration, average_price, status, created_at, updated_at) VALUES
(60, 'Thác Ba Hạ', 4, 'NATURE', 'Hệ thống 3 tầng thác tuyệt đẹp ở Bắc Cạn.', 120, 50000, 'ACTIVE', NOW(), NOW()),
(61, 'Lâu Đài Dracula Tây Nguyên', 6, 'ATTRACTION', 'Lâu đài xinh đẹp ở Đà Lạt giữa rừng thông.', 90, 100000, 'ACTIVE', NOW(), NOW()),
(62, 'Chợ Đêm Nha Trang', 7, 'FOOD', 'Chợ đêm sôi động với đủ loại hải sản tươi.', 120, 100000, 'ACTIVE', NOW(), NOW()),
(63, 'Vườn Nho Ninh Thuận', 8, 'NATURE', 'Vườn nho phục vụ du khách tại Ninh Thuận.', 90, 80000, 'ACTIVE', NOW(), NOW()),
(64, 'Lăng Nhân Bộ Tướng', 1, 'CULTURE', 'Di tích lịch sử tại Huế.', 60, 30000, 'ACTIVE', NOW(), NOW()),
(65, 'Hang Tiên Sơn', 4, 'NATURE', 'Hang động kỳ bí với ánh sáng tự nhiên ở Bắc Kạn.', 90, 60000, 'ACTIVE', NOW(), NOW()),
(66, 'Bãi Nước Nóng Bố Nối', 3, 'RELAX', 'Suối nước nóng tự nhiên ở Quảng Nam.', 120, 150000, 'ACTIVE', NOW(), NOW()),
(67, 'Làng Cát Cát', 4, 'CULTURE', 'Làng dân tộc Hnông ở Sa Pa.', 90, 50000, 'ACTIVE', NOW(), NOW()),
(68, 'Khu Đô Thị Đảo Nhân Tạo Tuần Châu', 4, 'ATTRACTION', 'Đảo nhân tạo với mua sắm và giải trí ở Hạ Long.', 180, 200000, 'ACTIVE', NOW(), NOW()),
(69, 'Vùng Muối Ninh Hòa', 7, 'NATURE', 'Cảnh quan muối nguyên chất ở Ninh Hòa.', 60, 0, 'ACTIVE', NOW(), NOW());

-- ==============================================
-- 10. EXTENDED REVIEW DATA
-- ==============================================
INSERT INTO reviews (id, user_id, place_id, rating, comment, created_at, updated_at) VALUES
(11, 2, 60, 5, 'Thác Ba Hạ tuyệt đẹp! Nước trong xanh, khí trời mát mẻ. Lộng lẫy nhất lúc mặt trời lặn.', NOW(), NOW()),
(12, 3, 61, 4, 'Lâu đài Dracula như bước ra từ chuuyện cổ tích. Tiếc là thời gian thăm nhìn hơi chật.', NOW(), NOW()),
(13, 4, 62, 5, 'Chợ đêm Nha Trang - đồ ăn tươi ngon, giá cả công bằng. Cảnh và âm thanh sôi động tuyệt vời!', NOW(), NOW()),
(14, 5, 63, 4, 'Vườn nho Ninh Thuận - độc đáo và lạ lẫm. Có thể hái nho tươi ăn ngay tại vườn.', NOW(), NOW()),
(15, 6, 64, 3, 'Lăng Nhân Bộ Tướng - ít khách nhưng yên tĩnh và sâu sắc. Hướng dẫn viên biết vài chuyện hay.', NOW(), NOW()),
(16, 7, 65, 5, 'Hang Tiên Sơn - hang động quyến rũ với ánh sáng tự nhiên. Phải leo cao nhưng xứng đáng!', NOW(), NOW()),
(17, 8, 66, 4, 'Bãi nước nóng Bố Nối - tuyệt vời cho thư giãn và chữa bệnh. Nước ấm, cơ sở vệ sinh tốt.', NOW(), NOW()),
(18, 9, 67, 5, 'Làng Cát Cát - văn hóa Hnông đặc sắc, nhân dân thân thiện. May sắc từ thổ cẩm rất đẹp.', NOW(), NOW()),
(19, 10, 68, 4, 'Tuần Châu - mua sắm và giải trí tuyệt vời. Hơi mắc nhưng có giá trị.', NOW(), NOW()),
(20, 2, 69, 4, 'Vùng muối Ninh Hòa - cảnh sắc lạ lẫm và tuyệt đẹp. Tour khá thú vị và dạy được nhiều kiến thức.', NOW(), NOW());

-- ==============================================
-- 11. EXTENDED LOCATIONS DATA
-- ==============================================
INSERT INTO locations (id, name, description, address, category, rating, image_url, latitude, longitude, created_at, updated_at) VALUES
(11, 'Thác Ba Hạ', 'Hệ thống 3 tầng thác tuyệt đẹp', 'Bắc Cạn', 'NATURE', 4.8, 'https://example.com/thac-ba-ha.jpg', 22.5333, 105.65, NOW(), NOW()),
(12, 'Lâu Đài Dracula', 'Kiến trúc độc đáo', 'Đà Lạt', 'ATTRACTION', 4.6, 'https://example.com/dracula.jpg', 11.94, 108.44, NOW(), NOW()),
(13, 'Chợ Đêm Nha Trang', 'Ẩm thực đặc sắc', 'Nha Trang', 'RESTAURANT', 4.7, 'https://example.com/cho-dem.jpg', 12.2588, 109.1967, NOW(), NOW()),
(14, 'Vườn Nho Ninh Thuận', 'Ngoài thành phố', 'Ninh Thuận', 'NATURE', 4.5, 'https://example.com/vuon-nho.jpg', 11.56, 109.14, NOW(), NOW()),
(15, 'Lăng Nhân Bộ Tướng', 'Di tích lịch sử', 'Huế', 'HERITAGE', 4.3, 'https://example.com/lang-nhan.jpg', 16.51, 107.56, NOW(), NOW()),
(16, 'Hang Tiên Sơn', 'Thám hiểm hang', 'Bắc Kạn', 'NATURE', 4.8, 'https://example.com/hang-tien-son.jpg', 22.3333, 105.5, NOW(), NOW()),
(17, 'Bãi Nước Nóng Bố Nối', 'Thư giãn', 'Quảng Nam', 'RELAX', 4.6, 'https://example.com/nuoc-nong.jpg', 15.56, 108.32, NOW(), NOW()),
(18, 'Làng Cát Cát', 'Văn hóa bản địa', 'Sa Pa', 'CULTURAL', 4.7, 'https://example.com/cat-cat.jpg', 22.3395, 103.8436, NOW(), NOW()),
(19, 'Tuần Châu', 'Mua sắm giải trí', 'Hạ Long', 'ATTRACTION', 4.5, 'https://example.com/tuan-chau.jpg', 20.908, 107.069, NOW(), NOW()),
(20, 'Vùng Muối Ninh Hòa', 'Cảnh sắc độc đáo', 'Ninh Hòa', 'NATURE', 4.6, 'https://example.com/muoi.jpg', 11.95, 109.08, NOW(), NOW());

-- ==============================================
-- 12. EXTENDED TRIP DATA
-- ==============================================
INSERT INTO trips (id, user_id, title, destination, start_date, end_date, status, total_budget, prompt_data, ai_response_data, created_at, updated_at) VALUES
(10, 2, 'Tour Bắc Cạn - Khám Phá Hoang Dã', 'Bắc Cạn', '2026-04-10', '2026-04-15', 'PLANNED', 6000000,
  '{"destination": "Bac Can", "duration": 5, "interests": ["nature", "waterfall"], "budget": 6000000}',
  '{"waterfall": "Ba Ha", "cave": "Tien Son", "river": "Ban River"}',
  '2026-03-10', '2026-03-12'),
(11, 3, 'Đà Lạt - Thành Phố Yêu Thích', 'Đà Lạt', '2026-05-05', '2026-05-10', 'PLANNED', 8000000,
  '{"destination": "Da Lat", "duration": 5, "interests": ["romance", "flowers"], "budget": 8000000}',
  '{"attractions": ["Dracula Castle", "Flower Gardens"], "food": ["Specialties"]}',
  '2026-03-08', '2026-03-10'),
(12, 4, 'Ninh Thuận - Vùng Đất Nắng', 'Ninh Thuận', '2026-06-20', '2026-06-25', 'DRAFT', 5500000,
  '{"destination": "Ninh Thuan", "duration": 5, "interests": ["sun", "vineyard"], "budget": 5500000}',
  '{"vineyard": "Ninh Thuan Vineyard", "beach": "Various beaches"}',
  '2026-03-05', '2026-03-08'),
(13, 5, 'Hạ Long - Vịnh Kỳ Vĩ', 'Hạ Long', '2026-09-15', '2026-09-20', 'PLANNED', 12000000,
  '{"destination": "Ha Long", "duration": 5, "interests": ["UNESCO", "limestone"], "budget": 12000000}',
  '{"cruise": "Luxury cruise", "caves": ["Thien Cung", "Sung Sot"]}',
  '2026-03-07', '2026-03-12'),
(14, 6, 'Bắc Kạn - Chơi Với Thiên Nhiên', 'Bắc Kạn', '2026-08-08', '2026-08-13', 'DRAFT', 7000000,
  '{"destination": "Bac Kan", "duration": 5, "interests": ["adventure", "cave"], "budget": 7000000}',
  '{"cave": "Tien Son Cave", "lake": "Ba Be Lake"}',
  '2026-02-28', '2026-03-05');

-- ==============================================
-- 13. EXTENDED TRIP ITEMS
-- ==============================================
INSERT INTO trip_items (id, trip_id, place_id, day_number, start_time, end_time, activity_type, activity_name, ai_note, sequence_order, created_at, updated_at) VALUES
(11, 10, 60, 1, '08:00:00', '12:00:00', 'NATURE_ACTIVITY', 'Thác Ba Hạ', 'Thế giới thác nước', 1, NOW(), NOW()),
(12, 10, NULL, 1, '12:30:00', '14:00:00', 'LUNCH', 'Bạch Kạn Hotel', '3 đêm 3 sao', 2, NOW(), NOW()),
(13, 10, 65, 2, '09:00:00', '16:00:00', 'CAVE_EXPLORATION', 'Hang Tiên Sơn', 'Thám hiểm hang', 3, NOW(), NOW()),
(14, 11, 61, 1, '09:00:00', '12:00:00', 'ATTRACTION', 'Lâu Đài Dracula', 'Kiến trúc độc đáo', 1, NOW(), NOW()),
(15, 11, NULL, 1, '13:00:00', '17:00:00', 'ACCOMMODATION_CHECK', 'Dalat Palace', '5 đêm 5 sao', 2, NOW(), NOW()),
(16, 11, NULL, 2, '09:00:00', '12:00:00', 'WALKING_TOUR', 'Vườn Hoa Thành Phố', 'Thăm vườn hoa', 3, NOW(), NOW()),
(17, 12, 63, 1, '09:00:00', '12:00:00', 'VINEYARD_TOUR', 'Vườn Nho', 'Sightseeing & Wine tasting', 1, NOW(), NOW()),
(18, 12, NULL, 1, '14:00:00', '17:00:00', 'BEACH_ACTIVITY', 'Nuit Beach', 'Bãi biển riêng tư', 2, NOW(), NOW()),
(19, 12, 62, 2, '17:00:00', '20:00:00', 'FOOD_EXPERIENCE', 'Chợ Đêm Nha Trang', 'Ẩm thực đêm', 3, NOW(), NOW()),
(20, 13, NULL, 1, '08:00:00', '24:00:00', 'CRUISE', 'Luxury Halong Cruise', '3 đêm 5 sao', 1, NOW(), NOW());

-- ==============================================
-- VERIFY DATA
-- ==============================================
SELECT 'USERS' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'TRIPS', COUNT(*) FROM trips
UNION ALL
SELECT 'TRIP_ITEMS', COUNT(*) FROM trip_items
UNION ALL
SELECT 'REVIEWS', COUNT(*) FROM reviews
UNION ALL
SELECT 'LOCATIONS', COUNT(*) FROM locations
UNION ALL
SELECT 'USER_PREFERENCES', COUNT(*) FROM user_preferences
UNION ALL
SELECT 'CHAT_SESSIONS', COUNT(*) FROM chat_sessions
UNION ALL
SELECT 'CHAT_MESSAGES', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'PLACES', COUNT(*) FROM places;

SET FOREIGN_KEY_CHECKS = 1;
