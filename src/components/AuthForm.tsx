import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Github } from "lucide-react";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <div className="w-full max-w-md p-8 backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {type === "login" ? "Welcome Back" : "Create Account"}
      </h2>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-6">
        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-[#24292F] text-white py-3 px-4 rounded-lg hover:bg-[#24292F]/90 transition duration-300">
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-gray-300/30 w-full"></div>
        <span className="bg-transparent text-gray-300 px-3 text-sm">or</span>
        <div className="border-t border-gray-300/30 w-full"></div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {type === "signup" && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              name="username"
              className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
              placeholder="John Doe"
              required
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {type === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full px-4 py-3 bg-white/5 border border-gray-300/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent transition duration-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition duration-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        )}

        {type === "login" && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-200">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300/30 text-[#00ed64] focus:ring-[#00ed64]"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-[#00ed64] hover:text-[#00ed64]/80 transition duration-200"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-[#00ed64] to-[#00684A] text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 ease-in-out shadow-lg shadow-[#00ed64]/20"
        >
          {type === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-300">
        {type === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <Link
          to={type === "login" ? "/signup" : "/login"}
          className="text-[#00ed64] hover:text-[#00ed64]/80 transition duration-200"
        >
          {type === "login" ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
