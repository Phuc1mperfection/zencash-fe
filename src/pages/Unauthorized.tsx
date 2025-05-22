import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#001e2b] to-[#023430] p-4">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-2xl shadow-xl text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-400 mb-4" />

        <h1 className="text-3xl font-bold text-white mb-4">
          Truy cập bị từ chối
        </h1>

        <p className="text-gray-300 mb-6">
          Bạn không có quyền truy cập vào trang này. Chỉ quản trị viên mới có
          thể xem trang này.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 border border-gray-600/30 text-white rounded-lg font-medium hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Quay lại Dashboard
          </Link>

          <Link
            to="/"
            className="text-[#00ed64] hover:text-[#00ed64]/80 transition duration-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
