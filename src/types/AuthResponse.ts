export interface AuthResponse {
    username: string;
    email: string;
    fullname?: string | null; // tên người dùng để hiển thị trên trang cá nhân
    currency?: string | null; // đơn vị tiền tệ ưa thích
    avatar?: string | null; // tên file avatar của người dùng
    accessToken: string;
    refreshToken: string;
    roles?: string[] | Record<string, string> | Set<string>; // user roles (có thể từ Java Set)
  }