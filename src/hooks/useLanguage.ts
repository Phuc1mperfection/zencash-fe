import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-Auth';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  // Thay đổi ngôn ngữ
  const changeLanguage = async (language: string) => {
    try {
      // Cập nhật ngôn ngữ trong i18n
      await i18n.changeLanguage(language);
      
      // Cập nhật ngôn ngữ trong localStorage
      localStorage.setItem('i18nextLng', language);
      
      // Cập nhật ngôn ngữ trong user context nếu đã đăng nhập
      if (user && setUser) {
        const updatedUser = {
          ...user,
          language: language
        };
        
        // Cập nhật user context
        setUser(updatedUser);
        
        // Cập nhật user trong localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          language: language
        }));
        
        // Gọi API để cập nhật ngôn ngữ trên server
        await authService.updateProfile({
          language: language
        });
        
        // Hiển thị thông báo thành công
        toast({
          title: i18n.t('profile.profileUpdated'),
          description: i18n.t('profile.language') + ': ' + language,
        });
      }
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: i18n.t('errors.error'),
        description: i18n.t('errors.serverError'),
        variant: 'destructive',
      });
    }
  };

  // Lấy danh sách ngôn ngữ có sẵn
  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English' },
      { code: 'vi', name: 'Tiếng Việt' }
    ];
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    getAvailableLanguages
  };
}; 