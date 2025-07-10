import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Calendar,
  MessageSquare,
  FileText,
} from "lucide-react";
import { getCurrentUser } from "../utils/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("profile");
  
  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Lấy thông tin user hiện tại
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserProfile();
      if (currentUser?.role === "Student") {
        fetchUserTickets();
      }
    } else {
      setLoading(false);
      showMessage("error", "Không thể xác định thông tin người dùng");
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        showMessage("error", "Vui lòng đăng nhập để xem thông tin profile");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://localhost:7013/api/User/${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          password: userData.password || "",
        });
      } else {
        showMessage("error", "Không thể tải thông tin profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);

      if (error.response?.status === 401) {
        showMessage(
          "error",
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại"
        );
      } else if (error.response?.status === 404) {
        showMessage("error", "Không tìm thấy thông tin người dùng");
      } else {
        showMessage("error", "Không thể tải thông tin profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    try {
      setTicketsLoading(true);
      setTicketsError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setTicketsError("Vui lòng đăng nhập để xem danh sách tickets");
        return;
      }

      const response = await axios.get(
        "https://localhost:7013/api/Ticket/student/my-tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setTickets(response.data.data || []);
      } else {
        setTicketsError("Không thể tải danh sách tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      
      if (error.response?.status === 401) {
        setTicketsError("Phiên đăng nhập đã hết hạn");
      } else if (error.response?.status === 403) {
        setTicketsError("Bạn không có quyền xem danh sách tickets");
      } else {
        setTicketsError("Không thể tải danh sách tickets");
      }
    } finally {
      setTicketsLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 0:
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: Clock,
          text: "Chờ xử lý",
        };
      case 1:
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: AlertCircle,
          text: "Đang xử lý",
        };
      case 2:
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: CheckCircle2,
          text: "Hoàn thành",
        };
      case 3:
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: XCircle,
          text: "Đã hủy",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: HelpCircle,
          text: "Không xác định",
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
      console.error("Error formatting date:", error);
      return "Ngày không hợp lệ";
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name - theo regex từ backend: ^[\p{L}\p{M}\s]+$
    if (!formData.name.trim()) {
      newErrors.name = "Tên không được để trống";
    } else if (!/^[\p{L}\p{M}\s]+$/u.test(formData.name.trim())) {
      newErrors.name =
        "Tên chỉ được chứa chữ cái và khoảng trắng, không chứa ký tự đặc biệt";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Tên không được vượt quá 100 ký tự";
    }

    // Validate email - theo regex từ backend
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email không đúng định dạng";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email không được vượt quá 100 ký tự";
    }

    // Validate phone - theo regex từ backend: ^(0[3|5|7|8|9])+([0-9]{8})$
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng Việt Nam";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Số điện thoại phải có đúng 10 chữ số";
    }

    // Validate password (chỉ khi có nhập)
    if (formData.password && formData.password.trim()) {
      if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      } else if (formData.password.length > 100) {
        newErrors.password = "Mật khẩu không được vượt quá 100 ký tự";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showMessage("error", "Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showMessage("error", "Vui lòng đăng nhập để cập nhật thông tin");
        setUpdating(false);
        return;
      }

      // Chuẩn bị data theo format API yêu cầu
      const updateData = {
        Name: formData.name.trim(),
        Email: formData.email.trim(),
        Phone: formData.phone.trim(),
      };

      // Chỉ thêm password nếu user có nhập và không rỗng
      if (formData.password && formData.password.trim()) {
        updateData.Password = formData.password.trim();
      }

      console.log("Sending update data:", updateData); // Debug log

      const response = await axios.put(
        `https://localhost:7013/api/User/UpdateUser/${currentUser.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Cập nhật user state với data mới từ server
        const updatedUserData = response.data.data;
        setUser(updatedUserData);

        // Reset form và thoát edit mode
        setFormData({
          name: updatedUserData.name || "",
          email: updatedUserData.email || "",
          phone: updatedUserData.phone || "",
          password: "",
        });
        setEditMode(false);
        setErrors({});

        showMessage("success", "Cập nhật thông tin thành công!");

        // Cập nhật user trong localStorage để đồng bộ với header
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedStoredUser = {
          ...storedUser,
          name: updatedUserData.name,
          email: updatedUserData.email,
          phone: updatedUserData.phone,
        };
        localStorage.setItem("user", JSON.stringify(updatedStoredUser));
      } else {
        showMessage(
          "error",
          response.data.message || "Cập nhật thông tin thất bại"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      let errorMessage = "Cập nhật thông tin thất bại";

      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message;

        switch (status) {
          case 400:
            errorMessage = serverMessage || "Dữ liệu không hợp lệ";
            break;
          case 401:
            errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại";
            break;
          case 403:
            errorMessage = "Bạn không có quyền cập nhật thông tin này";
            break;
          case 404:
            errorMessage = "Không tìm thấy người dùng";
            break;
          case 500:
            errorMessage = "Lỗi server. Vui lòng thử lại sau";
            break;
          default:
            errorMessage = serverMessage || `Lỗi server (${status})`;
        }

        // Log chi tiết lỗi validation nếu có
        if (error.response.data?.errors) {
          console.error("Validation errors:", error.response.data.errors);
        }
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng";
      }

      showMessage("error", errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset form về giá trị ban đầu
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
    });
    setErrors({});
    setEditMode(false);
    setShowPassword(false);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "Admin":
        return "Quản trị viên";
      case "Consultant":
        return "Tư vấn viên";
      case "Student":
        return "Sinh viên";
      default:
        return role || "Không xác định";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Consultant":
        return "bg-blue-100 text-blue-800";
      case "Student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={32} className="animate-spin text-orange-500 mb-4" />
          <span className="text-gray-600">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  // Error state khi không có user
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertCircle size={32} className="text-red-500 mb-4" />
          <span className="text-gray-600">
            Không thể tải thông tin người dùng
          </span>
          <button
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <User size={32} className="text-orange-500" />
            </div>
            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                  currentUser?.role
                )} bg-white`}
              >
                {getRoleDisplayName(currentUser?.role)}
              </span>
            </div>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-orange-600 px-4 py-2 rounded-lg transition-all duration-200 flex items-center cursor-pointer"
            >
              <Edit3 size={16} className="mr-2" />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            {editMode ? (
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập họ và tên"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <User size={20} className="text-gray-400 mr-3" />
                <span className="text-gray-800">
                  {user?.name || "Chưa cập nhật"}
                </span>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            {editMode ? (
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập email"
                  maxLength={100}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-gray-400 mr-3" />
                <span className="text-gray-800">
                  {user?.email || "Chưa cập nhật"}
                </span>
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            {editMode ? (
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    // Chỉ cho phép nhập số
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleInputChange("phone", value);
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập số điện thoại (VD: 0901234567)"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.phone}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng: 0x xxxxxxxx (x = 3,5,7,8,9)
                </p>
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-gray-400 mr-3" />
                <span className="text-gray-800">
                  {user?.phone || "Chưa cập nhật"}
                </span>
              </div>
            )}
          </div>

          {/* Password Field - Only show in edit mode */}
          {editMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới (để trống nếu không muốn đổi)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu mới"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Tối thiểu 6 ký tự, tối đa 100 ký tự
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {editMode && (
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleSave}
              disabled={updating}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {updating ? (
                <Loader2 size={20} className="animate-spin mr-2" />
              ) : (
                <Save size={20} className="mr-2" />
              )}
              {updating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              onClick={handleCancel}
              disabled={updating}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <X size={20} className="mr-2" />
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderTicketsTab = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <HelpCircle size={32} className="text-orange-500" />
            </div>
            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">Tickets hỗ trợ</h2>
              <p className="text-orange-100 text-sm">Danh sách các yêu cầu hỗ trợ của bạn</p>
            </div>
          </div>
          <button
            onClick={fetchUserTickets}
            disabled={ticketsLoading}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-orange-600 px-4 py-2 rounded-lg transition-all duration-200 flex items-center cursor-pointer"
          >
            <RefreshCw size={16} className={`mr-2 ${ticketsLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {ticketsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-orange-500 mb-4" />
            <span className="text-gray-600">Đang tải danh sách tickets...</span>
          </div>
        ) : ticketsError ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-red-600 mb-4">{ticketsError}</p>
            <button
              onClick={fetchUserTickets}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Bạn chưa có ticket nào</p>
            <p className="text-gray-500 text-sm">
              Các ticket hỗ trợ bạn tạo sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {tickets.filter(t => t.status === 0).length}
                </div>
                <div className="text-sm text-yellow-700">Chờ xử lý</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tickets.filter(t => t.status === 1).length}
                </div>
                <div className="text-sm text-blue-700">Đang xử lý</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 2).length}
                </div>
                <div className="text-sm text-green-700">Hoàn thành</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {tickets.filter(t => t.status === 3).length}
                </div>
                <div className="text-sm text-red-700">Đã hủy</div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const statusDisplay = getStatusDisplay(ticket.status);
                const StatusIcon = statusDisplay.icon;
                
                return (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FileText size={20} className="text-gray-600 mr-2" />
                          <h3 className="font-semibold text-gray-900">
                            {ticket.subject || "Không có tiêu đề"}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                        >
                          <StatusIcon size={14} className="mr-1" />
                          {statusDisplay.text}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(ticket.createdAt)}
                        </div>
                      </div>
                    </div>

                    {ticket.question && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <MessageSquare size={16} className="text-gray-600 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Nội dung:</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-800 text-sm whitespace-pre-wrap">
                            {ticket.question}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={14} className="mr-1" />
                        <span>Sinh viên: {ticket.studentName}</span>
                      </div>
                      {ticket.consultantName && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User size={14} className="mr-1" />
                          <span>Tư vấn viên: {ticket.consultantName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thông tin cá nhân
          </h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <CheckCircle size={20} className="mr-2" />
              ) : (
                <AlertCircle size={20} className="mr-2" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation - Only show for students */}
        {currentUser?.role === "Student" && (
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <User size={16} className="inline mr-2" />
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("tickets")}
                className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "tickets"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <HelpCircle size={16} className="inline mr-2" />
                Tickets hỗ trợ ({tickets.length})
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {currentUser?.role === "Student" && activeTab === "tickets" 
          ? renderTicketsTab() 
          : renderProfileTab()
        }
      </div>
    </div>
  );
};

export default Profile;