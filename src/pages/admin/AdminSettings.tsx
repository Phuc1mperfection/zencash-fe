import { useState } from "react";
import {
  ChevronLeft,
  Save,
  Globe,
  Mail,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock settings - in a real application, these would be loaded from the API
  const [settings, setSettings] = useState({
    siteName: "ZenCash",
    siteDescription: "Ứng dụng quản lý tài chính cá nhân",
    contactEmail: "admin@zencash.com",
    defaultCurrency: "VND",
    allowRegistration: true,
    emailNotifications: true,
    maintenanceMode: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setSettings({
      ...settings,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call - in a real application, you would save these settings to the backend
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Cài đặt đã được lưu",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link
            to="/admin"
            className="flex items-center text-gray-300 hover:text-[#00ed64] transition mr-4"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Quay lại</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Cài đặt hệ thống</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Site Settings */}
            <div className="bg-white/10  rounded-xl p-6 border border-gray-800/50 shadow-xl lg:col-span-2">
              <div className="flex items-center mb-6">
                <Globe className="text-[#00ed64] mr-3" size={24} />
                <h2 className="text-xl font-bold">Cài đặt chung</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="siteName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Tên ứng dụng
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="siteDescription"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows={3}
                    value={settings.siteDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="defaultCurrency"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Tiền tệ mặc định
                  </label>
                  <select
                    id="defaultCurrency"
                    name="defaultCurrency"
                    value={settings.defaultCurrency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
                  >
                    <option value="VND">VND - Việt Nam Đồng</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div className="bg-white/10  rounded-xl p-6 border border-gray-800/50 shadow-xl">
              <div className="flex items-center mb-6">
                <Mail className="text-[#00ed64] mr-3" size={24} />
                <h2 className="text-xl font-bold">Cài đặt Email</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="rounded border-gray-300/30 text-[#00ed64] focus:ring-[#00ed64] mr-2"
                  />
                  <label
                    htmlFor="emailNotifications"
                    className="text-sm text-gray-300"
                  >
                    Bật thông báo qua email
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white/10  rounded-xl p-6 border border-gray-800/50 shadow-xl mb-8">
            <div className="flex items-center mb-6">
              <Shield className="text-[#00ed64] mr-3" size={24} />
              <h2 className="text-xl font-bold">Cài đặt bảo mật</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowRegistration"
                    name="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={handleChange}
                    className="rounded border-gray-300/30 text-[#00ed64] focus:ring-[#00ed64] mr-2"
                  />
                  <label
                    htmlFor="allowRegistration"
                    className="text-sm text-gray-300"
                  >
                    Cho phép đăng ký tài khoản mới
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="rounded border-gray-300/30 text-[#00ed64] focus:ring-[#00ed64] mr-2"
                  />
                  <label
                    htmlFor="maintenanceMode"
                    className="text-sm text-gray-300"
                  >
                    Bật chế độ bảo trì (Chỉ admin có thể truy cập)
                  </label>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    Cài đặt bảo mật ảnh hưởng đến cách người dùng truy cập và
                    tương tác với hệ thống. Hãy cân nhắc kỹ trước khi thay đổi
                    các cài đặt này.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00ed64] to-[#00684A] text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 ease-in-out shadow-lg shadow-[#00ed64]/20 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Lưu cài đặt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
