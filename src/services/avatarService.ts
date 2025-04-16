import api from "./api";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:8080/api";

class AvatarService {
  /**
   * Lấy danh sách tất cả các avatar có sẵn
   */
  async getAllAvatars() {
    try {
      const response = await api.get('/avatar');
      return response.data;
    } catch (error) {
      console.error('Failed to get avatars:', error);
      throw error;
    }
  }

  /**
   * Lấy URL đầy đủ cho một avatar từ tên file
   */
  getAvatarUrl(filename: string | undefined) {
    if (!filename) return null;
    
    // Kiểm tra nếu filename đã là URL đầy đủ
    if (filename.startsWith('http')) {
      return filename;
    }
    
    return `${API_URL}/avatar/${filename}`;
  }

  /**
   * Upload avatar mới
   */
  async uploadAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Khi upload file cần sử dụng FormData, nên cấu hình headers khác
      const response = await api.post('/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Avatar uploaded successfully');
      return response.data; // Trả về tên file đã được lưu
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Failed to upload avatar');
      throw error;
    }
  }
}

export default new AvatarService();