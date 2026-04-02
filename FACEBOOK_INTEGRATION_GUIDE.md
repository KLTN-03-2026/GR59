# Facebook Login Integration - Setup Instructions

## Tổng quan

Dự án đã được cấu hình để hỗ trợ đăng nhập và đăng ký bằng Facebook OAuth 2.0, cùng với Google OAuth.

## Các files được thêm/cập nhật

### 1. **Services**

- **`facebookService.tsx`** - Xử lý Facebook SDK initialization và login/logout
- **`userService.tsx`** - Thêm function `postLoginFacebook()` để gọi backend

### 2. **Components**

- **`Login.tsx`** - Thêm Facebook login handler
- **`Register.tsx`** - Thêm Facebook signup handler

### 3. **Configuration**

- **`.env.example`** - Mẫu biến môi trường
- **`FACEBOOK_SETUP.md`** - Hướng dẫn chi tiết cấu hình Facebook

## Các bước cấu hình nhanh

### Bước 1: Tạo Facebook App

1. Truy cập https://developers.facebook.com/
2. Tạo một ứng dụng mới hoặc sử dụng ứng dụng hiện có
3. Lấy **App ID**

### Bước 2: Cấu hình Environment

Tạo file `.env.local` (hoặc cập nhật `.env`) với:

```
VITE_FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
```

### Bước 3: Cấu hình Redirect URIs

Trong Settings → Facebook Login, thêm các URL:

```
http://localhost:5173
http://localhost:5173/
https://yourdomain.com
https://yourdomain.com/
```

### Bước 4: Backend Integration

Backend cần xử lý endpoint:

```
POST /api/v1/auth/facebook
```

Nhận request:

```json
{
  "token": "facebook_access_token"
}
```

Trả về response (giống như Google login):

```json
{
  "EC": 0,
  "EM": "Thành công",
  "DT": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "type": "Bearer",
    "user": {
      "id": "...",
      "fullName": "...",
      "email": "...",
      ...
    }
  }
}
```

## Cấu trúc Flow

### Facebook Login Flow:

```
1. User clicks Facebook button
   ↓
2. facebookLogin() → Facebook SDK dialog
   ↓
3. User authenticates & authorizes
   ↓
4. Get accessToken from Facebook
   ↓
5. postLoginFacebook(token) → Backend
   ↓
6. Backend validates token & returns JWT
   ↓
7. Save user info to localStorage
   ↓
8. Redirect to home page
```

## Usage Examples

### Login Component:

```typescript
const loginWithFacebook = async () => {
  try {
    const fbResponse = await facebookLogin({
      scope: "public_profile,email",
    });

    const response = await postLoginFacebook(fbResponse.accessToken);
    // Handle response...
  } catch (error) {
    // Handle error...
  }
};
```

### Register Component:

```typescript
const signupWithFacebook = async () => {
  // Same as login - backend handles signup logic
};
```

## Available Functions

### `facebookService.tsx`

#### `initializeFacebookSDK(appId: string)`

- Khởi tạo Facebook SDK khi component mount
- Gọi tự động trong Login/Register useEffect

#### `facebookLogin(options?: { scope?: string })`

- Hiển thị Facebook login dialog
- Returns: `{ accessToken, userID }`
- Default scope: `public_profile,email`

#### `getFacebookUserInfo(accessToken?: string)`

- Lấy thông tin user từ Facebook Graph API
- Returns: User object với id, name, email, picture, ...

#### `facebookLogout()`

- Đăng xuất khỏi Facebook
- Returns: Promise<void>

### `userService.tsx`

#### `postLoginFacebook(token: string)`

- Gửi Facebook token lên backend
- Backend xác minh token & trả JWT
- Returns: AuthResponse với user info

## Testing

### Local Development:

```bash
npm run dev
# Open http://localhost:5173
# Click Facebook Login/Register button
# Should redirect to home after success
```

### Checklist:

- [ ] Facebook App ID configured in .env
- [ ] Localhost added to Redirect URIs
- [ ] Backend endpoint `/api/v1/auth/facebook` implemented
- [ ] Facebook SDK loads without errors
- [ ] Login/Register flows work
- [ ] User data saved to localStorage

## Troubleshooting

### "App not set up" error

- Verify VITE_FACEBOOK_APP_ID is correct
- Check browser console for exact error

### "Invalid OAuth Redirect URI" error

- Ensure URL matches exactly in Facebook settings
- Include protocol (http/https) and trailing slash

### Token validation fails

- Verify backend is using correct Facebook App Secret
- Check token hasn't expired (usually 60 days)

### User info missing

- Ensure scopes include necessary permissions
- Check Facebook user hasn't revoked permissions

## Advanced Configuration

### Custom Scopes:

```typescript
// In facebookService.tsx
facebookLogin({
  scope: "public_profile,email,user_friends,user_photos",
});
```

### Get Additional User Info:

```typescript
const userInfo = await getFacebookUserInfo(accessToken);
```

### Handle Multiple Providers:

- Google: Uses @react-oauth/google hook
- Facebook: Uses window.FB SDK
- Both save to localStorage with same format

## References

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Facebook Login Scopes](https://developers.facebook.com/docs/facebook-login/permissions)

## Notes

- Facebook SDK is loaded from CDN via script tag instead of npm package
- Token stored in localStorage, consider using secure HttpOnly cookies for sensitive data
- Session persists using localStorage, implement refresh token logic if needed
- Frontend doesn't use Facebook secret - all token validation happens on backend
