# Hướng dẫn Kỹ thuật & Đặc tả API Backend (TravelAi)

Tài liệu này cung cấp các yêu cầu chi tiết về các API cần thiết để hoàn thiện hệ thống Backend cho ứng dụng TravelAi.

---

## 1. Cấu trúc phản hồi chuẩn (Standardized Response Wrapper)

Tất cả các API phản hồi (Response) **PHẢI** tuân theo cấu trúc JSON sau:

```json
{
  "status": 200,    // 200/201: Thành công, Các mã khác: Lỗi
  "message": "Thông báo cho người dùng",
  "data": { ... }    // Payload thực tế
}
```

---

## 2. Danh mục API (API Catalog)

Prefix: `/api/v1`

### 2.1. Xác thực (Auth)
- `POST /api/v1/auth/register`: Đăng ký tài khoản.
- `POST /api/v1/auth/login`: Đăng nhập hệ thống.
- `POST /api/v1/auth/google`: Đăng nhập qua Google (ID Token).
- `POST /api/v1/auth/facebook`: Đăng nhập qua Facebook (Access Token).
- `POST /api/v1/auth/send-otp`: Gửi mã OTP qua Email.
- `POST /api/v1/auth/verify-otp`: Xác minh OTP.
- `POST /api/v1/auth/reset-password-otp`: Đặt lại mật khẩu mới.

### 2.2. Hồ sơ & Tiện ích (Profile & Utils)
- `GET /api/v1/profile`: Lấy thông tin cá nhân.
- `PATCH /api/v1/profile`: Cập nhật thông tin cá nhân.
- `POST /api/v1/auth/change-password`: Đổi mật khẩu.
- `GET /api/v1/saved-trips`: Lấy danh sách yêu thích.
- `POST /api/v1/saved-trips`: Thêm vào yêu thích.
- `DELETE /api/v1/saved-trips/:id`: Xóa khỏi yêu thích.

### 2.3. Lịch trình (Travel Planner)
- `POST /api/v1/travel-plans`: Tạo/Lưu lịch trình AI gợi ý.
- `GET /api/v1/travel-plans`: Lấy danh sách các bản kế hoạch đã lưu.

### 2.4. Lưu trữ và Cập nhật lịch trình
- `GET /api/v1/travel-plans`: Lấy danh sách lịch trình đã lưu.
- `POST /api/v1/travel-plans`: Lưu một lịch trình mới.
- `PUT /api/v1/travel-plans/{id}`: Cập nhật danh sách địa điểm (`points`) cho một lịch trình (Dùng khi người dùng thêm/xóa địa điểm thủ công).

**Payload mẫu cho `PUT`:**
```json
{
  "points": [
    {
       "id": "p1",
       "name": "Địa điểm A",
       "note": "Nhớ mang theo máy ảnh...", // Ghi chú riêng của người dùng
       "lat": 16.0,
       "lng": 108.0,
       "time": "08:00",
       "day": 1, // Thứ tự ngày (Ngày 1, Ngày 2, ...)
       "type": "attraction",
       "imageUrl": "https://..."
    }
  ]
}
```

---

## 3. Chi tiết Request Body (Request Schemas)

Phần này liệt kê chi tiết các trường dữ liệu mà Frontend sẽ gửi lên.

### 3.1. Đăng ký (Register)
**URL:** `/api/v1/auth/register` | **Method:** `POST`
```json
{
  "full_name": "Nguyễn Văn A", // Bắt buộc, min 4 ký tự
  "email": "user@example.com", // Bắt buộc, định dạng email
  "password": "Password123"    // Bắt buộc, 8-32 ký tự, hoa, thường, số
}
```

### 3.2. Đăng nhập (Login)
**URL:** `/api/v1/auth/login` | **Method:** `POST`
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### 3.3. Đăng nhập Google/Facebook
**URL:** `/api/v1/auth/google` | **Method:** `POST` (Tương tự cho Facebook với trường `accessToken`)
```json
{
  "token": "google_id_token_string"
}
```

### 3.4. Quên mật khẩu & OTP
**URL:** `/api/v1/auth/send-otp` | **Method:** `POST`
```json
{
  "email": "user@example.com"
}
```
**URL:** `/api/v1/auth/verify-otp` | **Method:** `POST`
```json
{
  "email": "user@example.com",
  "otp": 123456 // 6 chữ số
}
```

### 3.5. Cập nhật Profile
**URL:** `/api/v1/profile` | **Method:** `PATCH`
```json
{
  "name": "Tên mới",         // Optional
  "phone": "0987654321",     // Optional
  "address": "Địa chỉ mới",  // Optional
  "bio": "Thông tin giới thiệu", // Optional
  "avatar": "url_tới_ảnh"    // Optional
}
```

### 3.6. Tạo lịch trình du lịch (Planner)
**URL:** `/api/v1/travel-plans` | **Method:** `POST`
```json
{
  "destination": "Đà Nẵng",
  "travelDate": "20/05/2026 - 25/05/2026", // Chuỗi định dạng range "dd/mm/yyyy - dd/mm/yyyy"
  "interests": ["Ẩm thực", "Thiên nhiên"],    // Mảng string các sở thích
  "budget": "5 - 10 triệu",                // Các giá trị: "Dưới 5 triệu", "5 - 10 triệu", "10 - 20 triệu", "Trên 20 triệu"
  "peopleGroup": "2",                       // Số người (dưới dạng string)
  "createdAt": "2026-04-07T07:30:00.000Z",  // ISO Date string
  "userId": "nguyenvanan"                   // Hiện tại FE đang gửi username hoặc "Guest"
}
```

### 3.7. Đổi mật khẩu
**URL:** `/api/v1/auth/change-password` | **Method:** `POST`
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

---

## 4. Quản trị viên (Admin Only)

Các API này yêu cầu quyền `ADMIN`:
- `GET /api/v1/admin/stats`: Trả về dữ liệu thống kê tổng quát.
- `GET /api/v1/admin/users`: Danh sách người dùng hệ thống.
- `DELETE /api/v1/admin/hotels/:id`: Xóa khách sạn khỏi hệ thống.
- `DELETE /api/v1/admin/restaurants/:id`: Xóa nhà hàng khỏi hệ thống.

### 3.8. Quản lý Tài nguyên (Admin)
Các API này dành cho Admin để quản lý dữ liệu hệ thống.

**URL:** `/api/v1/admin/hotels` | **Method:** `POST` (Tương tự `PATCH /admin/hotels/:id`)
```json
{
  "name": "Grand Azure Resort",
  "location": "Đà Nẵng, Việt Nam",
  "rating": 4.9,
  "reviews": "2.4k",
  "type": "RESORT", // RESORT, CỔ ĐIỂN, HIỆN ĐẠI
  "status": "HOẠT ĐỘNG", // HOẠT ĐỘNG, BẢO TRÌ
  "image": "url_ảnh"
}
```

**URL:** `/api/v1/admin/restaurants` | **Method:** `POST` (Tương tự `PATCH /admin/restaurants/:id`)
```json
{
  "name": "The Azure Kitchen",
  "location": "Quận 1, TP. Hồ Chí Minh",
  "rating": 4.8,
  "reviews": "1.2k",
  "cuisine": "VIỆT NAM", // VIỆT NAM, CHÂU Á, CHÂU ÂU
  "status": "ĐANG MỞ", // ĐANG MỞ, TẠM ĐÓNG
  "image": "url_ảnh"
}
```

### 3.9. Tin tức & Cẩm nang (News)
**URL:** `/api/v1/news` | **Method:** `GET`
**Mô tả:** Lấy danh sách các bài viết tin tức, cẩm nang du lịch.
- **Query Params:** `category`, `limit`, `page`.
- **Response Data (Mảng Object):**
```json
[
  {
    "id": 1,
    "title": "Bí kíp săn vé máy bay giá rẻ",
    "excerpt": "Những mẹo hữu ích để bạn có chuyến đi tiết kiệm...",
    "image": "url_anh_thumbnail",
    "category": "tip", // "tip", "news", "guide"
    "date": "2026-04-01T00:00:00Z",
    "readTime": "5", // Phút đọc
    "isFeatured": true
  }
]
```

### 3.10. Đánh giá của người dùng (Reviews)
**URL:** `/api/v1/reviews` | **Method:** `POST`
**Mô tả:** Đăng tải đánh giá mới cho hệ thống hoặc một địa điểm/trải nghiệm cụ thể.
- **Request Body:**
```json
{
  "rating": 5,
  "comment": "Chuyến đi thật tuyệt vời! Lịch trình rất hợp lý...",
  "images": [
    "url_anh_1", "url_anh_2"
  ],
  "targetId": "123" // ID của địa điểm hoặc lịch trình nếu có (tùy chọn)
}
```

**URL:** `/api/v1/reviews` | **Method:** `GET`
**Mô tả:** Lấy danh sách các bài đánh giá để hiển thị trên trang Review hoặc chi tiết địa điểm.
- **Query Params:** `targetId` (nếu lọc theo địa điểm), `limit`.
- **Response Data (Mảng Object):**
```json
[
  {
    "id": 1,
    "userName": "Linh Nguyễn",
    "avatar": "url_avatar",
    "timeAgo": "2 ngày trước",
    "rating": 5,
    "comment": "Chuyến đi thật tuyệt vời!...",
    "images": ["url_anh_1"]
  }
]
```

### 3.11. Chi tiết địa điểm (Destination Detail)
**URL:** `/api/v1/places/:id` | **Method:** `GET`
**Mô tả:** Lấy thông tin chi tiết đầy đủ của một địa điểm cụ thể để hiển thị trang Destination Detail.
- **Response Data (Object):**
```json
{
  "id": "1",
  "title": "Phố cổ Hội An",
  "location": "Quảng Nam",
  "rating": 4.8,
  "reviews": "1.2k",
  "img": "url_anh_chinh",
  "desc": "Hội An nổi tiếng với vẻ đẹp lãng mạn, cổ kính...",
  "type": "pin",
  "category": "culture",
  "previewVideo": "url_video_neu_co",
  "gallery": [ 
    "url_anh_1", "url_anh_2", "url_anh_3"
  ],
  "features": ["Wifi free", "Bể bơi", "Spa"], 
  "mapCoordinates": { 
     "lat": 15.8794,
     "lng": 108.3283
  }
}
```

### 3.12. Lịch trình mẫu (Sample Itineraries)
**URL:** `/api/v1/places?type=itinerary` | **Method:** `GET`
**Mô tả:** Trang Khám phá (Explore) và Lịch trình mẫu (Sample Itinerary) dùng chung cấu trúc Places nhưng lọc theo `type=itinerary`.
- **Response Data (Mảng Object):**
```json
[
  {
    "id": "19",
    "title": "Hành trình Di sản miền Trung",
    "img": "url_anh_cover",
    "price": 1500000,
    "maxPeople": 5,
    "location": "Đà Nẵng",
    "duration": "3 Ngày 2 Đêm",
    "rating": 4.9,
    "category": "culture",
    "type": "itinerary",
    "steps": [ 
      {
        "time": "08:00",
        "activity": "Đón khách tại sân bay Đà Nẵng",
        "dist": "2km từ TT"
      }
    ]
  }
]
```

---

## 5. Luồng xử lý AI Planner (Chi tiết)

Đây là luồng quan trọng nhất, nơi AI tính toán và trả về lộ trình tối ưu.

### 5.1. Bước 1: Frontend gửi yêu cầu (Request)
**URL:** `/api/v1/travel-plans-ai` | **Method:** `POST`

Dữ liệu FE gửi lên khi người dùng nhấn "Tối ưu hóa lộ trình":
```json
{
  "destination": "Đà Nẵng",
  "travelDate": "20/05/2026 - 22/05/2026",
  "interests": ["Văn hóa", "Ẩm thực"],
  "budget": "5 - 10 triệu",
  "peopleGroup": "2",
  "userId": "UserID_hoac_Guest"
}
```

### 5.2. Bước 2: Backend trả về kết quả (Response)
Backend cần trả về một mảng các địa điểm đã được sắp xếp theo thời gian và quãng đường tối ưu nhất.

**Cấu trúc dữ liệu trong `data`:**
```json
{
  "status": 200,
  "message": "Lộ trình AI đã được tạo thành công",
  "data": [
    {
      "id": "point_01",
      "name": "Bán đảo Sơn Trà",
      "lat": 16.1214,
      "lng": 108.277,
      "time": "08:30",
      "type": "attraction",
      "description": "Mô tả ngắn về địa điểm và lý do AI gợi ý...",
      "imageUrl": "url_anh_dep"
    },
    {
      "id": "point_02",
      "name": "Chùa Linh Ứng",
      "lat": 16.1004,
      "lng": 108.277,
      "time": "10:30",
      "type": "attraction",
      "description": "Điểm đến tiếp theo thuận đường di chuyển...",
      "imageUrl": "url_anh_dep",
      "day": 1
    },
    {
      "id": "point_03",
      "name": "Sun World Bà Nà Hills",
      "lat": 15.9975,
      "lng": 107.992,
      "time": "09:00",
      "type": "attraction",
      "description": "Khởi đầu ngày 2 tại đỉnh núi Chúa với không khí trong lành...",
      "imageUrl": "url_anh_ba_na",
      "day": 2
    },
    {
      "id": "point_04",
      "name": "Cầu Vàng (Golden Bridge)",
      "lat": 15.9950,
      "lng": 107.9876,
      "time": "11:00",
      "type": "attraction",
      "description": "Check-in biểu tượng du lịch nổi tiếng ngay tại Bà Nà...",
      "imageUrl": "url_anh_cau_vang",
      "day": 2
    },
    {
      "id": "point_05",
      "name": "Phố cổ Hội An",
      "lat": 15.8794,
      "lng": 108.3283,
      "time": "15:00",
      "type": "attraction",
      "description": "Ngày 3 khám phá vẻ đẹp cổ kính của di sản văn hóa thế giới...",
      "imageUrl": "url_anh_hoi_an",
      "day": 3
    }
  ]
}
```

### 5.3. Giải thích các trường dữ liệu quan trọng
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `name` | String | Tên địa điểm hiển thị trên Sidebar và Map. |
| `lat`, `lng` | Float | Tọa độ GPS để FE vẽ dấu ghim và tính khoảng cách. |
| `time` | String | Định dạng `HH:mm`. Dùng để sắp xếp thứ tự trên Timeline. |
| `type` | String | Phân loại: `attraction` (tham quan), `restaurant` (ăn uống), `hotel` (nghỉ ngơi). |
| `description`| String | Nội dung để AI "thuyết minh" về địa điểm này. |
| `note` | String | Ghi chú cá nhân của người dùng cho địa điểm này (Tùy chọn). |
| `day` | Number | **Quan trọng**: Thứ tự ngày của địa điểm (1, 2, 3...). FE dựa vào đây để phân Tab. |

---

> [!IMPORTANT]
> - **Phân chia theo ngày**: Backend **BẮT BUỘC** trả về thêm trường `day: 1`, `day: 2` để FE có thể hiển thị dữ liệu theo từng Tab Ngày tương ứng.
> - **Tối ưu di chuyển**: Backend nên ưu tiên sắp xếp các điểm có tọa độ gần nhau vào cùng một buổi để giảm thời gian di chuyển (Dùng thuật toán TSP - Traveling Salesperson Problem cơ bản).
> - **Dữ liệu bổ sung**: Khuyến khích trả về `imageUrl` chất lượng cao và `description` hấp dẫn để tăng trải nghiệm người dùng.
