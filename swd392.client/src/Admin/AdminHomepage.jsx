import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaQuestionCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";
// import adminMenuItems from "./adminMenuItems";
const adminMenuItems = [
  {
    id: "articles",
    name: "Quản lý FAQ",
    icon: FaQuestionCircle,
    description: "Xem, sửa, xóa các FAQ.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    active: false,
    onClick: () => (window.location.href = "/admin/faq"),
    className: "cursor-pointer",
  },
  {
    id: "upload-article",
    name: "Quản lý bài viết",
    icon: PlusCircle,
    description: "Xem, sửa, xóa các bài viết đã đăng.",
    color: "text-green-600",
    bgColor: "bg-green-50",
    active: false,
    onClick: () => (window.location.href = "/admin/upload-article"),
    className: "cursor-pointer",
  },
  {
    id: "users",
    name: "Quản lý người dùng",
    icon: Users,
    description: "Xem và quản lý tài khoản.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    active: false,
    onClick: () => (window.location.href = "/admin/users"),
    className: "cursor-pointer",
  },
  {
    id: "ticket-assignment",
    name: "Giao ticket",
    icon: UserCheck,
    description: "Giao ticket cho consultant phù hợp.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    active: false,
    onClick: () => (window.location.href = "/admin/ticket-assignment"),
    className: "cursor-pointer",
  },
  {
    id: "applications",
    name: "Quản lý hồ sơ",
    icon: FileText,
    description: "Xem và quản lý hồ sơ xét tuyển.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    active: false,
    onClick: () => (window.location.href = "/admin/applications"),
    className: "cursor-pointer",
  },
];


const AdminHomepage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Debug: log adminMenuItems
  console.log('AdminHomepage adminMenuItems:', adminMenuItems);

  useEffect(() => {
    if (user && user.role === "Student") {
      navigate("/gioi-thieu");
    }
  }, [user, navigate]);

  return (
    <AdminConsultantLayout
      menuItems={adminMenuItems}
      userRole="Admin"
      panelTitle="Admin Panel"
    >
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-orange-700 mb-2">
          Trang quản trị hệ thống tuyển sinh
        </h1>
        <p className="text-gray-600 mb-8">
          Chào mừng{" "}
          <span className="font-semibold text-orange-600">
            {user?.username || "Admin"}
          </span>{" "}
          đến với dashboard quản trị. Chọn chức năng bên trái để thao tác.
        </p>
        {/* Nội dung chính của admin có thể đặt ở đây */}
      </div>
    </AdminConsultantLayout>
  );
};

export default AdminHomepage;
