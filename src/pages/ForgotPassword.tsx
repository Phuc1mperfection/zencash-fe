import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import { useToast } from "../hooks/use-toast";
import { ArrowLeftIcon } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//regex là một biểu thức chính quy dùng để kiểm tra định dạng email
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email hợp lệ",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      await authService.resetPassword(email);
      setIsSuccess(true);
      toast({
        title: "Yêu cầu đã được gửi",
        description:
          "Vui lòng kiểm tra email của bạn để được hướng dẫn tiếp theo",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau",
        variant: "destructive",
      });
      console.error("Error sending password reset request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#001e2b] to-[#023430] p-4">
      <div className="w-full max-w-md p-8  bg-white/10 rounded-2xl shadow-xl">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center text-gray-300 hover:text-[#00ed64] transition duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại đăng nhập
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Quên mật khẩu?
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu.
        </p>

        {isSuccess ? (
          <div className="bg-[#00ed64]/20 border border-[#00ed64]/30 rounded-lg p-4 mb-6">
            <h3 className="text-[#00ed64] font-medium text-lg mb-2">
              Yêu cầu đã được gửi!
            </h3>
            <p className="text-gray-300">
              Chúng tôi đã ghi nhận yêu cầu khôi phục mật khẩu của bạn. Vui lòng
              kiểm tra email để được hướng dẫn tiếp theo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#00ed64] to-[#00684A] text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 ease-in-out shadow-lg shadow-[#00ed64]/20 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  Đang xử lý...
                </div>
              ) : (
                "Gửi yêu cầu"
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-gray-300">
          Đã nhớ mật khẩu?{" "}
          <Link
            to="/login"
            className="text-[#00ed64] hover:text-[#00ed64]/80 transition duration-200"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
