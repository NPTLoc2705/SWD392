import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { login, googleLogin } from "../Services/authService";
import { getCurrentUser } from "../utils/auth";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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
            } else {
                navigate("/gioi-thieu");
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
            } else {
                navigate("/gioi-thieu");
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

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffb347] via-[#fff6e5] to-[#ffcc80]">
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center border border-orange-200 p-10">
                    <h2 className="text-4xl font-extrabold mb-2 text-orange-600 tracking-wide text-center uppercase">
                        Hệ thống tuyển sinh Đại học FPT
                    </h2>

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email sinh viên"
                            required
                            disabled={loading}
                            className="mb-4 p-3 border border-orange-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-lg disabled:opacity-50"
                        />
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Mật khẩu"
                            required
                            disabled={loading}
                            className="mb-4 p-3 border border-orange-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-lg disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-4 py-3 rounded-xl w-full font-bold text-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                        {error && (
                            <div className="text-red-500 mt-3 text-center text-sm">
                                {error}
                            </div>
                        )}
                    </form>
                    {/* Google Login Button */}
                    <div className="w-full mb-6">
                        <GoogleOAuthProvider clientId={"377229581554-3jvl3aj56jrmof4dnbjnrsudhs6uqmtf.apps.googleusercontent.com"}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap={false}
                                theme="outline"
                                size="large"
                                width="100%"
                                text="signin_with"
                                locale="vi"
                            />
                        </GoogleOAuthProvider>
                    </div>

                    <button
                        type="button"
                        onClick={handleRegisterClick}
                        disabled={loading}
                        className="mt-8 w-full bg-white text-orange-600 px-4 py-3 rounded-xl hover:bg-orange-50 border border-orange-300 font-bold shadow transition disabled:opacity-50"
                    >
                        Đăng ký tài khoản mới
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;