import { useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const useAutoRefreshToken = () => {
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = authService.getAccessToken();
      if (!token) return;

      // Kiểm tra token còn hạn trong 5 phút nữa không
      const isExpired = authService.isTokenExpired(token);
      if (isExpired) {
        try {
          const newTokens = await authService.refreshToken();
          toast.success('Token đã được làm mới tự động');
          console.log('Token refreshed automatically:', newTokens);
        } catch (error) {
          console.error('Failed to refresh token:', error);
          toast.error('Không thể làm mới token, vui lòng đăng nhập lại');
          authService.logout();
          window.location.href = '/login';
        }
      }
    };

    // Kiểm tra mỗi 4 phút
    const interval = setInterval(checkAndRefreshToken, 4 * 60 * 1000);
    
    // Kiểm tra ngay khi component mount
    checkAndRefreshToken();

    return () => clearInterval(interval);
  }, []);
};

export default useAutoRefreshToken; 