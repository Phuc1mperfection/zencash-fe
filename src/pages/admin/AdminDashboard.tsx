import {
  Shield,
  Users,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-Auth";

const AdminDashboard = () => {
  const { user, userRoles } = useAuth();
 


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-gray-300 hover:text-[#00ed64] transition mr-4"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Quay lại Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10  rounded-xl p-6 border border-gray-800/50 shadow-xl">
            <div className="flex items-center mb-4">
              <Shield className="text-[#00ed64] mr-3" size={24} />
              <h2 className="text-xl font-bold">Admin Control</h2>
            </div>
            <p className="text-gray-300 mb-4">
              {user?.email && `Xin chào, ${user.username || user.email}!`} Bạn
              có quyền truy cập vào các chức năng quản trị.
            </p>
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                Quyền Admin:{" "}
                {userRoles?.includes("ADMIN") ? (
                  <span className="text-[#00ed64]">Hoạt động</span>
                ) : (
                  <span className="text-red-400">Không hoạt động</span>
                )}
              </p>
            </div>
          </div>

          <Link
            to="/admin/users"
            className="bg-white/10  rounded-xl p-6 border border-gray-800/50 shadow-xl hover:bg-white/15 transition"
          >
            <div className="flex items-center mb-4">
              <Users className="text-[#00ed64] mr-3" size={24} />
              <h2 className="text-xl font-bold">Quản lý người dùng</h2>
            </div>
            <p className="text-gray-300">
              Xem, chỉnh sửa và quản lý tài khoản người dùng trong hệ thống.
            </p>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white/10  rounded-xl p-6 border border-gray-800/50 shadow-xl hover:bg-white/15 transition"
          >
            <div className="flex items-center mb-4">
              <Settings className="text-[#00ed64] mr-3" size={24} />
              <h2 className="text-xl font-bold">Cài đặt hệ thống</h2>
            </div>
            <p className="text-gray-300">
              Cấu hình và quản lý các cài đặt hệ thống.
            </p>
          </Link>
        </div>
        
        <div className="bg-white/10  rounded-xl p-6 border border-gray-800/50 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Thông tin quản trị viên</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 mb-2">
                Username:{" "}
                <span className="text-white font-medium">
                  {user?.username || "N/A"}
                </span>
              </p>
              <p className="text-gray-300 mb-2">
                Email:{" "}
                <span className="text-white font-medium">
                  {user?.email || "N/A"}
                </span>
              </p>
              <p className="text-gray-300 mb-2">
                Đăng nhập cuối:{" "}
                <span className="text-white font-medium">
                  Hôm nay, 10:45 AM
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                Roles:
                {userRoles?.map((role: string) => (
                  <span
                    key={role}
                    className="inline-block bg-[#00ed64]/20 text-[#00ed64] px-2 py-1 rounded-md text-sm font-medium ml-2"
                  >
                    {role}
                  </span>
                ))}
              </p>
              <p className="text-gray-300 mb-2">
                Trạng thái:{" "}
                <span className="inline-block bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-sm font-medium">
                  Online
                </span>
              </p>
            </div>{" "}
          </div>
        </div>
       
       
      </div>
    </div>
  );
};

export default AdminDashboard;


