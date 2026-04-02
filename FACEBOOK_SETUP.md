# Facebook OAuth Setup Guide

## Yêu cầu

1. Một tài khoản Facebook Developer: https://developers.facebook.com/
2. Một ứng dụng Facebook được tạo trong Developer Console

## Các bước thiết lập

### 1. Tạo ứng dụng Facebook

- Đăng nhập vào [Facebook Developers](https://developers.facebook.com/)
- Nhấp vào "Create App" → chọn "Consumer"
- Điền thông tin ứng dụng (tên, email, mục đích)
- Chọn "Facebook Login" từ danh sách sản phẩm

### 2. Cấu hình Facebook Login

- Vào `Settings` → `Basic` để lấy **App ID**
- Nhấp vào `Settings` → `Basic` và copy **App ID**
- Vào `Facebook Login` → `Settings`
- Thêm các URL vào **Valid OAuth Redirect URIs**:
  ```
  http://localhost:5173
  http://localhost:5173/
  https://yourdomain.com
  https://yourdomain.com/
  ```

### 3. Cấu hình phiên bản API

- Vào `Settings` → `Basic`
- Tìm **API Version** và chọn phiên bản mới nhất (hiện tại là v18.0 trở lên)

### 4. Cấu hình Environment variables

Thêm vào file `.env` hoặc `.env.local`:

```
VITE_FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
```

Hoặc nếu sử dụng `.env.production`:

```
VITE_FACEBOOK_APP_ID=YOUR_PRODUCTION_APP_ID
```

### 5. Cấu hình Backend

Backend cần xử lý endpoint `POST /api/v1/auth/facebook` nhận:

```json
{
  "token": "facebook_access_token"
}
```

Và trả về:

```json
{
  "EC": 0,
  "EM": "Thành công",
  "DT": {
    "accessToken": "your_jwt_token",
    "refreshToken": "your_refresh_token",
    "type": "Bearer",
    "user": {
      "id": "user_id",
      "fullName": "User Name",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "role": "user",
      "status": "active"
    }
  }
}
```

### 6. Lấy thông tin người dùng Facebook

Sử dụng Facebook Graph API để lấy thông tin:

```
GET https://graph.facebook.com/me?fields=id,name,email,picture&access_token=ACCESS_TOKEN
```

## Frontend Implementation

### Classes được sử dụng:

- `facebookService.tsx` - Xử lý Facebook SDK initialization
- `Login.tsx` - Xử lý Facebook login
- `Register.tsx` - Xử lý Facebook signup

### Functions chính:

#### `initializeFacebookSDK(appId: string)`

Khởi tạo Facebook SDK khi component mount

#### `facebookLogin(options: { scope?: string })`

Hiển thị Facebook login dialog

#### `getFacebookUserInfo(accessToken?: string)`

Lấy thông tin người dùng từ Facebook

#### `facebookLogout()`

Đăng xuất khỏi Facebook

## Kiểm tra

1. Mở ứng dụng ở `http://localhost:5173`
2. Nhấp vào nút Facebook Login/Signup
3. Cho phép ứng dụng truy cập thông tin Facebook
4. Kiểm tra xem đã redirect về Home hoặc chuyển hướng thành công chưa

## Tuy chỉnh Scopes

Hiện tại sử dụng scope: `public_profile,email`

Để thêm scopes khác, thay đổi trong `facebookService.tsx`:

```typescript
facebookLogin({
  scope: "public_profile,email,user_friends,user_photos",
});
```

Tham khảo: [Facebook Login Scopes](https://developers.facebook.com/docs/facebook-login/permissions)

## Xử lý lỗi thường gặp

### "App not set up"

- Kiểm tra Facebook App ID có đúng không
- Kiểm tra URL localhost có trong Valid OAuth Redirect URIs không

### "Invalid OAuth Redirect URI"

- Đảm bảo URL chính xác với protocol (http/https)
- Thêm cả với dấu "/" ở cuối

### "Access Denied"

- Người dùng không được phép truy cập hoặc từ chối
- Kiểm tra scopes được yêu cầu

## Stack sử dụng

- React 18
- TypeScript
- Axios (HTTP requests)
- React Toastify (Notifications)
- Vite (Build tool)
