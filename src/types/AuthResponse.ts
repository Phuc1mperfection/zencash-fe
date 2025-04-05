export interface AuthResponse {
    username: string;
    email: string;
    fullname?: string | null; // tên người dùng để hiển thị trên trang cá nhân
    currency?: string | null; // đơn vị tiền tệ ưa thích
    language?: string | null; // ngôn ngữ ưa thích
    accessToken: string;
    refreshToken: string;
  }