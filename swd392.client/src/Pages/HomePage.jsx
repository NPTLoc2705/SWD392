import React from "react";
import { getUser, logout } from "../Services/authService";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffb347] via-[#fff6e5] to-[#ffcc80]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center border border-orange-200 p-10">
        <img
          src="https://uni.fpt.edu.vn/Data/Sites/1/media/logo-ftu.png"
          alt="FPT University Logo"
          className="w-40 mb-6 drop-shadow-xl"
        />
        <h1 className="text-3xl font-extrabold mb-2 text-orange-600 tracking-wide text-center uppercase">
          Chào mừng, {user?.name || "Sinh viên"}!
        </h1>
        <p className="mb-8 text-gray-700 font-medium text-center text-lg">
          Bạn đã đăng nhập vào hệ thống tuyển sinh Đại học FPT.
        </p>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-4 py-3 rounded-xl w-full font-bold text-lg shadow-lg transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default HomePage;