import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  FileText,
  PlusCircle,
  UserCheck,
  Search,
  RefreshCw,
  Shield,
  ShieldOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaQuestionCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "info":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div
        className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${getToastStyles()} min-w-[300px]`}
      >
        {getIcon()}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const adminMenuItems = [
  {
    id: "articles",
    name: "Quản lý FAQ",
    icon: FaQuestionCircle,
    description: "Xem, sửa, xóa các FAQ.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    active: false,
    onClick: () => (window.location.href = "/admin/faq"), // Thay đổi từ /articles
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
    onClick: () => (window.location.href = "/admin/upload-article"), // Thay đổi từ /upload-article
    className: "cursor-pointer",
  },
  {
    id: "users",
    name: "Quản lý người dùng",
    icon: Users,
    description: "Xem và quản lý tài khoản",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    active: true,
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

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [banLoading, setBanLoading] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://localhost:7013/api/User/GetUser",
        {
          headers: getAuthHeaders(),
        }
      );

      const responseData = response.data || {};
      const usersData = responseData.data || responseData || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      handleApiError(err, "Có lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Ban/Unban user
  const toggleBanUser = async (userId, currentBanStatus) => {
    setBanLoading((prev) => ({ ...prev, [userId]: true }));
    setError(null);

    try {
      let response;

      if (currentBanStatus) {
        // Nếu user hiện tại bị ban, thì unban
        response = await axios.put(
          `https://localhost:7013/api/User/UnbanUser/${userId}`,
          {},
          { headers: getAuthHeaders() }
        );
      } else {
        // Nếu user hiện tại không bị ban, thì ban
        response = await axios.put(
          `https://localhost:7013/api/User/BanUser/${userId}`,
          {},
          { headers: getAuthHeaders() }
        );
      }

      // Update user in local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBanned: !currentBanStatus } : user
        )
      );

      const action = currentBanStatus ? "mở khóa" : "khóa";
      showToast(`${action} tài khoản thành công!`, "success");
    } catch (err) {
      handleApiError(err, "Có lỗi khi cập nhật trạng thái tài khoản");
    } finally {
      setBanLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleApiError = (err, defaultMessage) => {
    let errorMessage = defaultMessage;

    if (err.response) {
      const status = err.response.status;
      const serverMessage =
        err.response.data?.message || err.response.data?.error;

      switch (status) {
        case 401:
          errorMessage = "Bạn cần đăng nhập để thực hiện thao tác này";
          break;
        case 403:
          errorMessage = "Bạn không có quyền thực hiện thao tác này";
          break;
        case 404:
          errorMessage = "Không tìm thấy dữ liệu";
          break;
        case 500:
          errorMessage = serverMessage || "Lỗi server";
          break;
        default:
          errorMessage = serverMessage || defaultMessage;
      }
    } else if (err.request) {
      errorMessage =
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
    }

    setError(errorMessage);
    showToast(errorMessage, "error");
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case "Admin":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          text: "Quản trị viên",
        };
      case "Consultant":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          text: "Tư vấn viên",
        };
      case "Student":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          text: "Sinh viên",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          text: role || "Không xác định",
        };
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ngày không hợp lệ";
      }
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.roleName === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.isBanned) ||
      (statusFilter === "banned" && user.isBanned);

    return matchesSearch && matchesRole && matchesStatus;
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <AdminConsultantLayout
        menuItems={adminMenuItems}
        userRole="Admin"
        panelTitle="Admin Panel"
      >
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex space-x-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="cursor-pointer px-6 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="Admin">Quản trị viên</option>
                  <option value="Consultant">Tư vấn viên</option>
                  <option value="Student">Sinh viên</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="banned">Bị khóa</option>
                </select>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Tổng: {users.length} người dùng</span>
                <span>Hiển thị: {filteredUsers.length}</span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center space-x-2 p-4 mt-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Users List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Danh sách người dùng
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Đang tải...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <Users className="h-12 w-12 mb-4" />
                <p>Không có người dùng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => {
                      const roleDisplay = getRoleDisplay(user.roleName);

                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || "Chưa có tên"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleDisplay.bgColor} ${roleDisplay.color}`}
                            >
                              {roleDisplay.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                {user.email || "Chưa có email"}
                              </div>
                              {user.phone && (
                                <div className="flex items-center mt-1">
                                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.isBanned
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.isBanned ? (
                                <>
                                  <ShieldOff className="h-3 w-3 mr-1" />
                                  Bị khóa
                                </>
                              ) : (
                                <>
                                  <Shield className="h-3 w-3 mr-1" />
                                  Hoạt động
                                </>
                              )}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.roleName !== "Admin" && (
                              <button
                                onClick={() =>
                                  toggleBanUser(user.id, user.isBanned)
                                }
                                disabled={banLoading[user.id]}
                                className={`cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors ${
                                  user.isBanned
                                    ? "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                    : "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
                              >
                                {banLoading[user.id] ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                                ) : user.isBanned ? (
                                  <Shield className="h-4 w-4 mr-1" />
                                ) : (
                                  <ShieldOff className="h-4 w-4 mr-1" />
                                )}
                                {user.isBanned ? "Mở khóa" : "Khóa"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminConsultantLayout>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {/* CSS cho animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default UserManagementPage;
