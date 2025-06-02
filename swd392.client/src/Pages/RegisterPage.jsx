import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../Services/authService";

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await register(form.email, form.password, form.name, form.phone);
            setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffb347] via-[#fff6e5] to-[#ffcc80]">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center border border-orange-200 p-10">
                <img
                    src="https://uni.fpt.edu.vn/Data/Sites/1/media/logo-ftu.png"
                    alt="FPT University Logo"
                    className="w-40 mb-6 drop-shadow-xl"
                />
                <h2 className="text-4xl font-extrabold mb-2 text-orange-600 tracking-wide text-center uppercase">
                    Đăng ký tài khoản
                </h2>
                <form onSubmit={handleSubmit} className="w-full mt-4">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Họ và tên"
                        className="mb-4 p-3 border border-orange-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-lg"
                    />
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email sinh viên"
                        className="mb-4 p-3 border border-orange-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-lg"
                    />
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mật khẩu"
                        className="mb-4 p-3 border border-orange-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-lg"
                    />
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                        className="mb-4 p-3 border border-orange-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-lg"
                    />
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-4 py-3 rounded-xl w-full font-bold text-lg shadow-lg transition"
                    >
                        Đăng ký
                    </button>
                    {error && (
                        <div className="text-red-500 mt-3 text-center">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-600 mt-3 text-center">{success}</div>
                    )}
                </form>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-8 w-full bg-white text-orange-600 px-4 py-3 rounded-xl hover:bg-orange-50 border border-orange-300 font-bold shadow transition"
                >
                    Quay lại đăng nhập
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;