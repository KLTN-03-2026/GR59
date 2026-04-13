# Hướng dẫn Kỹ thuật & Đặc tả API Backend (TravelAi)

Tài liệu này cung cấp các yêu cầu chi tiết về các API cần thiết để hoàn thiện hệ thống Backend cho ứng dụng TravelAi.

---

## 1. Cấu trúc phản hồi chuẩn (Standardized Response Wrapper)

Tất cả các API phản hồi (Response) **PHẢI** tuân theo cấu trúc JSON sau:

```json
{
  "status": 200,    // 200/201: Thành công, Các mã khác: Lỗi
  "message": "Thông báo cho người dùng",
  "data": { ... }    // Payload thực tế - Bắt buộc dùng key "data"
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

### 2.3. Khám phá & Tài nguyên (Explore & Resources)
- `GET /api/v1/places`: Danh sách các địa điểm tham quan (Landmarks).
- `GET /api/v1/hotels`: Danh sách khách sạn.
- `GET /api/v1/restaurants`: Danh sách nhà hàng.
- `GET /api/v1/sample-itineraries`: Danh sách lịch trình mẫu chuyên nghiệp.

### 2.4. Lịch trình cá nhân (Travel Planner)
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
**URL:** `/api/v1/sample-itineraries` | **Method:** `GET`
**Mô tả:** Chứa danh sách các lộ trình được chuyên gia thiết kế, hỗ trợ cấu trúc lồng ghép theo ngày.
- **Response Data (Mảng Object):**
```json
[
  {
    "id": "31",
    "trip_name": "Khám phá Đà Lạt mộng mơ",
    "duration": "5 ngày 4 đêm",
    "price": 3500000,
    "rating": 4.9,
    "img": "url_anh_cover",
    "location": "Đà Lạt",
    "category": "nature",
    "maxPeople": 4,
    "itinerary": [
      {
        "day": 1,
        "date": "2024-05-01",
        "theme": "Sắc hoa thành phố",
        "activities": [
          { "time": "08:00", "location": "Sân bay Liên Khương", "note": "Hành trình bắt đầu", "lat": 11.7508, "lng": 108.3689 },
          { "time": "12:00", "location": "Lẩu gà lá é Tao Ngộ", "note": "Thưởng thức ẩm thực", "lat": 11.9360, "lng": 108.4485 }
        ]
      },
      {
        "day": 2,
        "date": "2024-05-02",
        "theme": "Săn mây đại ngàn",
        "activities": [
           { "time": "04:30", "location": "Cầu gỗ săn mây", "note": "Trải nghiệm bình minh", "lat": 11.9056, "lng": 108.5492 }
        ]
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
      "day": 1,
      "date": "20/05/2026",
      "locations": [
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
          "imageUrl": "url_anh_dep"
        }
      ]
    },
    {
      "day": 2,
      "date": "21/05/2026",
      "locations": [
        {
          "id": "point_03",
          "name": "Sun World Bà Nà Hills",
          "lat": 15.9975,
          "lng": 107.992,
          "time": "09:00",
          "type": "attraction",
          "description": "Khởi đầu ngày 2 tại đỉnh núi Chúa với không khí trong lành...",
          "imageUrl": "url_anh_ba_na"
        },
        {
          "id": "point_04",
          "name": "Cầu Vàng (Golden Bridge)",
          "lat": 15.9950,
          "lng": 107.9876,
          "time": "11:00",
          "type": "attraction",
          "description": "Check-in biểu tượng du lịch nổi tiếng ngay tại Bà Nà...",
          "imageUrl": "url_anh_cau_vang"
        }
      ]
    },
    {
      "day": 3,
      "date": "22/05/2026",
      "locations": [
        {
          "id": "point_05",
          "name": "Phố cổ Hội An",
          "lat": 15.8794,
          "lng": 108.3283,
          "time": "15:00",
          "type": "attraction",
          "description": "Ngày 3 khám phá vẻ đẹp cổ kính của di sản văn hóa thế giới...",
          "imageUrl": "url_anh_hoi_an"
        }
      ]
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

### 3.13. Khách sạn & Nhà hàng (Hotels & Restaurants)
**URL:** `/api/v1/hotels` | `/api/v1/restaurants` | **Method:** `GET`
**Mô tả:** Lấy danh sách tài nguyên phục vụ trang Khám phá.
- **Yêu cầu Schema:**
```json
{
  "id": "string",
  "title": "string",
  "location": "string",
  "rating": "number",
  "reviews": "string (e.g. '1.5k')",
  "img": "string (URL)",
  "desc": "string",
  "type": "string (e.g. 'bed', 'food')",
  "category": "string"
}
```

---

## 4. Đặc tả dữ liệu Chi tiết (Detailed Schema Mapping)

Phần này định nghĩa cấu trúc dữ liệu đầy đủ cho API Chi tiết (`/places/:id` hoặc `/hotels/:id`). Dữ liệu này trực tiếp quyết định khả năng hiển thị của trang **Destination Detail**.

### 4.1. JSON Schema Chi tiết Đầy đủ

```json
{
  "id": 1,
  "name": "Chi tiết tên tài nguyên",
  "location": "Địa chỉ cụ thể",
  "rating": 4.8,
  "reviews": "1.2k",
  "image": "url_anh_chinh",
  "type": "MODERN",
  "status": "ACTIVE",
  "provinceId": 1,
  
  "description": "Mô tả dài giới thiệu về địa điểm/khách sạn.",
  "price": "1.200.000đ - 5.000.000đ",
  "distance": "1.5 km từ trung tâm",
  "time": "Phục vụ 24/7",
  
  "gallery": [
    "url_anh_1", "url_anh_2", "url_anh_3"
  ],
  
  "coordinates": {
    "lat": 16.0471,
    "lng": 108.2062
  },

  "quickInfo": [
    { "label": "Giờ nhận phòng", "value": "14:00" },
    { "label": "Wifi", "value": "Miễn phí" }
  ],

  "services": [
    {
      "id": 101,
      "name": "Dịch vụ A",
      "type": "food",
      "price": "50.000đ",
      "image": "url_anh"
    }
  ],

  "reviewsData": {
    "average": 4.8,
    "total": 1240,
    "breakdown": [
      { "stars": 5, "percentage": 85 },
      { "stars": 4, "percentage": 10 },
      { "stars": 3, "percentage": 5 },
      { "stars": 2, "percentage": 0 },
      { "stars": 1, "percentage": 0 }
    ],
    "list": [
      {
        "user": "Tên người dùng",
        "avatar": "url_avatar",
        "rating": 5,
        "date": "2 tuần trước",
        "tag": "Khách du lịch",
        "content": "Bình luận chi tiết của khách..."
      }
    ]
  },

  "travelTips": [
    { "icon": "Camera", "title": "Góc chụp đẹp", "content": "Mô tả mẹo..." }
  ],
  
  "weatherCurrent": {
    "temp": 28,
    "description": "Nắng nhẹ",
    "icon": "Sun"
  }
}
```

### 4.2. Ánh xạ Giao diện (UI Mapping)

| Nhóm dữ liệu | Trường JSON | Vị trí hiển thị trên Frontend |
| :--- | :--- | :--- |
| **Hero Section** | `name`, `image`, `location`, `rating` | Ảnh bìa, Tiêu đề lớn và thông tin cơ bản đầu trang. |
| **Quick Stats Bar** | `price`, `distance`, `time` | Thanh 3 ô thông tin nhanh ngay dưới ảnh bìa. |
| **Overview Tab** | `description`, `gallery` | Nội dung văn bản giới thiệu và slide ảnh slide-show. |
| **Services Tab** | `services` | Danh sách các thẻ dịch vụ đi kèm ngay bên dưới tab. |
| **Reviews Tab** | `reviewsData` | Biểu đồ tỉ lệ sao và danh sách các bình luận chi tiết. |
| **Tips Tab** | `travelTips` | Các khối thông tin mẹo vặt, lưu ý cho người dùng. |
| **Sidebar** | `coordinates`, `quickInfo`, `weatherCurrent` | Bản đồ Google Maps, danh sách thông tin kỹ thuật và thời tiết. |

---

## 5. Lưu ý quan trọng cho Backend
- **Key phản hồi**: Luôn sử dụng `data` cấp cao nhất để chứa payload.
- **Đồng bộ Schema**: Các trường như `id`, `title`, `img` trong `places/hotels/restaurants` cần đặt tên thống nhất để FE dễ dàng hiển thị trong Tab "Tất cả".
- [ ] **Tọa độ Marker**: Mỗi `activity` trong lịch trình mẫu **CẦN** có trường `lat` và `lng` để bản đồ có thể hiển thị chính xác vị trí và vẽ đường đi logic.
- [ ] **Phân chia theo ngày**: Backend **BẮT BUỘC** trả về thêm trường `day: 1`, `day: 2` để FE có thể hiển thị dữ liệu theo từng Tab Ngày tương ứng.
