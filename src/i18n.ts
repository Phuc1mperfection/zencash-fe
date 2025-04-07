import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import các file ngôn ngữ
import enTranslation from './locales/en/translation.json';
import viTranslation from './locales/vi/translation.json';

// Khởi tạo i18n
i18n
  // Phát hiện ngôn ngữ của trình duyệt
  .use(LanguageDetector)
  // Tải tài nguyên ngôn ngữ
  .use(Backend)
  // Kết nối với React
  .use(initReactI18next)
  // Khởi tạo i18n
  .init({
    // Tài nguyên ngôn ngữ
    resources: {
      en: {
        translation: enTranslation,
      },
      vi: {
        translation: viTranslation,
      },
    },
    // Ngôn ngữ mặc định
    fallbackLng: 'en',
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    // Cấu hình interpolation
    interpolation: {
      escapeValue: false, // Không escape HTML
    },
    // Cấu hình phát hiện ngôn ngữ
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 