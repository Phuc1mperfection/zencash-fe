export interface AuthResponse {
    username: string;
    email: string;
    fullname?: string | null; // tên người dùng để hiển thị trên trang cá nhân
    accessToken: string;
    refreshToken: string;
  }