import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const adminFeatures = [
  {
    title: "Quản lý bài viết",
    description: "Xem, sửa, xóa các bài viết đã đăng.",
    path: "/articles",
    color: "bg-orange-500",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h5l2-2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Đăng bài viết mới",
    description: "Tạo và đăng bài viết mới lên hệ thống.",
    path: "/upload-article",
    color: "bg-green-500",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Quản lý người dùng",
    description: "Xem và quản lý tài khoản người dùng.",
    path: "/admin/users",
    color: "bg-blue-500",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
      </svg>
    ),
  },
  {
    title: "Quản lý chat hỗ trợ",
    description: "Xem và trả lời tin nhắn từ khách hàng.",
    path: "/admin/chat",
    color: "bg-purple-500",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  // Thêm các chức năng khác nếu cần
];

const Admin = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (user && user.role === 'Student') {
      navigate('/gioi-thieu');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-700 mb-2">Trang quản trị hệ thống tuyển sinh</h1>
        <p className="text-gray-600 mb-8">Chào mừng <span className="font-semibold text-orange-600">{user?.username || "Admin"}</span> đến với dashboard quản trị. Chọn chức năng bên dưới để thao tác.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminFeatures.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => navigate(feature.path)}
              className={`flex flex-col items-start p-6 rounded-2xl shadow hover:shadow-lg transition ${feature.color} hover:scale-105 focus:outline-none`}
            >
              <div className="mb-4">{feature.icon}</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{feature.title}</h2>
                <p className="text-white/90">{feature.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;