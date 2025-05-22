import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-Auth";
import AuthForm from "../components/AuthForm";
import { AxiosError } from "axios";
import { showToast } from "../utils/toast";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const signupData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    console.log("Signup Payload:", signupData);
    const loadingToast = showToast.loading("Signing up...");

    try {
      await signup(signupData);
      navigate("/dashboard", { replace: true });
      showToast.dismiss(loadingToast);
      showToast.success("Welcome!");

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      showToast.dismiss(loadingToast);
      showToast.error(axiosError.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#001e2b] to-[#023430]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 w-96 h-96 bg-[#00ed64]/20 rounded-full filter blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 w-96 h-96 bg-[#00684A]/20 rounded-full filter blur-3xl"></div>
      </div>
      <AuthForm type="signup" onSubmit={handleSubmit} />
    </div>
  );
}