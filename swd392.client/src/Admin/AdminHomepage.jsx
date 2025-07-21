import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";
import adminMenuItems from "./adminMenuItems";

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
