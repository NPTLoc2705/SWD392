import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { login, googleLogin } from "../Services/authService";
import { getCurrentUser } from "../utils/auth";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      const user = getCurrentUser();
      if (user && user.isBanned === "True") {
        setError("Tài khoản của bạn đã bị cấm.");
      } else if (user && user.role === "Admin") {
        navigate("/admin");
      } else if (user && user.role === "Consultant") {
        navigate("/consultant");
      } else {
        navigate("/tuyen-sinh");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      await googleLogin(credentialResponse.credential);
      const user = getCurrentUser();
      if (user && user.isBanned === "True") {
        setError("Tài khoản của bạn đã bị cấm.");
      } else if (user && user.role === "Admin") {
        navigate("/admin");
      } else if (user && user.role === "Consultant") {
        navigate("/consultant");
      } else {
        navigate("/tuyen-sinh");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Đăng nhập Google thất bại");
  };

  const handleBackClick = () => {
    navigate("/"); // Quay lại trang homepage
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-25 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="fixed top-6 left-6 p-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-full hover:shadow-xl hover:bg-white transition-all duration-300 group z-20 border border-orange-100"
      >
        <ArrowLeft 
          size={20} 
          className="cursor-pointer text-gray-600 group-hover:text-orange-500 transition-colors duration-200" 
        />
      </button>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center">
            <img
              src="https://daihoc.fpt.edu.vn/wp-content/uploads/2023/04/cropped-cropped-2021-FPTU-Long-300x93.png"
              alt="FPT University"
              className="h-12 mx-auto mb-4"
            />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
              Đăng nhập
            </h1>
            <p className="text-gray-500 text-sm text-center mb-5">
              Chào mừng bạn trở lại với FPT University
            </p>

        {/* Login Form */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 rounded-r-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" 
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  // placeholder="your.email@fpt.edu.vn"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200/60 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" 
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  // placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200/60 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 bg-white/70 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-600 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200/60"></div>
            <span className="px-4 text-sm text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-200/60"></div>
          </div>

          {/* Google Login */}
          <div className="mb-6">
            <GoogleOAuthProvider
              clientId="377229581554-3jvl3aj56jrmof4dnbjnrsudhs6uqmtf.apps.googleusercontent.com"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signin_with"
                width="100%"
                locale="vi"
              />
            </GoogleOAuthProvider>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={handleRegisterClick}
                disabled={loading}
                className="cursor-pointer text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400/80">
            © 2025 FPT University. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;