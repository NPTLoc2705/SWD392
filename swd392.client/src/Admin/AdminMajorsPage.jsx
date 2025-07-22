import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";
import {
  FileText,
  PlusCircle,
  Users,
  UserCheck,
  Edit,
  Trash2,
  RefreshCw,
  XCircle,
  Save,
  X,
  BookOpen,
  Search,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { FaQuestionCircle } from "react-icons/fa";
import Toast from "../Components/Toast";

const API_BASE = "https://localhost:7013/api/programs";

// Toast Component
const ToastComponent = ({
  message,
  type = "info",
  onClose,
  autoClose = true,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose, autoClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "error":
        return <AlertTriangle size={20} className="text-red-600" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />;
      default:
        return <AlertTriangle size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`flex items-center p-4 border rounded-lg shadow-lg transition-all duration-300 ${getToastStyles()}`}
      >
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 hover:opacity-70 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Confirm Modal Component
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle size={24} className="text-red-600" />,
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "success":
        return {
          icon: <CheckCircle size={24} className="text-green-600" />,
          confirmButton: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      default:
        return {
          icon: <AlertTriangle size={24} className="text-orange-600" />,
          confirmButton:
            "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
        };
    }
  };

  const styles = getModalStyles();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 mr-4">{styles.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 transition-colors ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
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
    description: "Xem và quản lý tài khoản",
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
  {
    id: "majors",
    name: "Quản lý ngành học",
    icon: BookOpen,
    description: "Xem, thêm, sửa, xóa các ngành học.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    active: true,
    onClick: () => (window.location.href = "/admin/majors"),
    className: "cursor-pointer",
  },
];

const emptyMajor = {
  title: "",
  description: "",
  admissionRequirements: "",
  tuitionFee: "",
  dormitoryInfo: "",
  isActive: true,
};

const AdminMajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyMajor);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Thêm state cho modal xem chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
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

  const fetchMajors = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE}/admin/list-program`, {
        headers: getAuthHeaders(),
      });
      setMajors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      handleApiError(err, "Không thể tải danh sách ngành học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { id, ...payload } = form;
      const requestData = {
        ...payload,
        tuitionFee: form.tuitionFee === "" ? 0 : Number(form.tuitionFee),
      };

      if (editId) {
        await axios.put(`${API_BASE}/update/${editId}`, requestData, {
          headers: getAuthHeaders(),
        });
        showToast("Cập nhật ngành học thành công!", "success");
        // Nếu ngành học vừa chuyển sang ngừng tuyển, giữ modal mở và cập nhật trạng thái ngay
        if (requestData.isActive === false) {
          setForm((prev) => ({ ...prev, isActive: false }));
          await fetchMajors();
          // Không đóng modal, chỉ cập nhật lại danh sách majors để trạng thái hiển thị đúng
          setIsSubmitting(false);
          return;
        }
      } else {
        await axios.post(`${API_BASE}/create`, requestData, {
          headers: getAuthHeaders(),
        });
        showToast("Thêm ngành học thành công!", "success");
      }

      // Đóng modal hoặc form tùy thuộc vào trạng thái
      if (editId) {
        setShowEditModal(false);
      } else {
        setShowForm(false);
      }

      setForm(emptyMajor);
      setEditId(null);
      await fetchMajors();
    } catch (err) {
      handleApiError(
        err,
        editId ? "Lỗi khi cập nhật ngành học" : "Lỗi khi thêm ngành học"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (major) => {
    setForm({
      title: major.title || "",
      description: major.description || "",
      admissionRequirements: major.admissionRequirements || "",
      tuitionFee: major.tuitionFee || "",
      dormitoryInfo: major.dormitoryInfo || "",
      isActive: major.isActive,
    });
    setEditId(major.id);
    setShowEditModal(true); // Mở modal thay vì setShowForm(true)
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setForm(emptyMajor);
    setEditId(null);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setShowConfirmModal(false);
    setLoading(true);
    setError("");

    try {
      await axios.delete(`${API_BASE}/delete/${itemToDelete}`, {
        headers: getAuthHeaders(),
      });
      showToast("Xóa ngành học thành công!", "success");
      await fetchMajors();
    } catch (err) {
      try {
        await axios.post(
          `${API_BASE}/delete`,
          { id: itemToDelete },
          { headers: getAuthHeaders() }
        );
        showToast("Xóa ngành học thành công!", "success");
        await fetchMajors();
      } catch (secondErr) {
        handleApiError(secondErr, "Lỗi khi xóa ngành học");
      }
    } finally {
      setLoading(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setForm(emptyMajor);
    setEditId(null);
  };

  const filteredMajors = majors.filter(
    (major) =>
      major.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      major.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      major.admissionRequirements
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusDisplay = (isActive) => {
    return isActive
      ? {
          color: "text-green-600",
          bgColor: "bg-green-100",
          text: "Đang tuyển",
          dotColor: "bg-green-500",
        }
      : {
          color: "text-red-600",
          bgColor: "bg-red-100",
          text: "Ngừng tuyển",
          dotColor: "bg-red-500",
        };
  };

  // Thêm hàm để mở modal chi tiết
  const openDetailModal = (major) => {
    setSelectedMajor(major);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMajor(null);
  };

  return (
    <>
      <AdminConsultantLayout
        menuItems={adminMenuItems}
        userRole="Admin"
        panelTitle="Admin Panel"
      >
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm ngành học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Tổng: {majors.length} ngành</span>
                <span>
                  Đang tuyển: {majors.filter((major) => major.isActive).length}
                </span>
                <span>
                  Ngừng tuyển:{" "}
                  {majors.filter((major) => !major.isActive).length}
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editId ? "Chỉnh sửa ngành học" : "Thêm ngành học mới"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên ngành <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập tên ngành học"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Học phí <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="tuitionFee"
                      value={form.tuitionFee}
                      onChange={handleChange}
                      type="number"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập học phí"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập mô tả ngành học"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu tuyển sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="admissionRequirements"
                      value={form.admissionRequirements}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập yêu cầu tuyển sinh"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thông tin ký túc xá
                    </label>
                    <input
                      name="dormitoryInfo"
                      value={form.dormitoryInfo}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập thông tin ký túc xá"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Đang hoạt động
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    disabled={isSubmitting}
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    <X size={16} className="mr-2" />
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        {editId ? "Đang lưu..." : "Đang thêm..."}
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        {editId ? "Lưu thay đổi" : "Thêm ngành học"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Danh sách ngành học
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={fetchMajors}
                  disabled={loading}
                  className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Làm mới</span>
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm ngành học</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Đang tải...</span>
              </div>
            ) : filteredMajors.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <BookOpen className="h-12 w-12 mb-4" />
                <p>Không có ngành học nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngành học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Học phí
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Yêu cầu tuyển sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMajors.map((major) => {
                      const statusDisplay = getStatusDisplay(major.isActive);

                      return (
                        <tr key={major.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {major.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2 break-words max-w-[10rem] md:max-w-[14rem] lg:max-w-[18rem] xl:max-w-[22rem] 2xl:max-w-[26rem]" title={major.description}>
                                {major.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {major.tuitionFee?.toLocaleString("vi-VN")} VNĐ
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full mr-2 ${statusDisplay.dotColor}`}
                                ></span>
                                {statusDisplay.text}
                              </span>
                              <input
                                type="checkbox"
                                checked={major.isActive}
                                onChange={async (e) => {
                                  const newStatus = e.target.checked;
                                  // Chỉ gửi các trường cần thiết cho update
                                  const updateData = {
                                    title: major.title,
                                    description: major.description,
                                    admissionRequirements: major.admissionRequirements,
                                    tuitionFee: major.tuitionFee,
                                    dormitoryInfo: major.dormitoryInfo,
                                    isActive: newStatus
                                  };
                                  try {
                                    await axios.put(`${API_BASE}/update/${major.id}`,
                                      updateData,
                                      { headers: getAuthHeaders() }
                                    );
                                    showToast("Cập nhật trạng thái thành công!", "success");
                                    await fetchMajors();
                                  } catch (err) {
                                    showToast("Lỗi khi cập nhật trạng thái", "error");
                                  }
                                }}
                                className="ml-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                                title="Bật/tắt trạng thái tuyển sinh"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 line-clamp-2">
                              {major.admissionRequirements}
                            </div>
                            {major.dormitoryInfo && (
                              <div className="text-xs text-gray-500 mt-1">
                                KTX: {major.dormitoryInfo}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openDetailModal(major)}
                                className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <BookOpen className="h-4 w-4 mr-1" />
                                Xem
                              </button>
                              <button
                                onClick={() => handleEdit(major)}
                                className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteClick(major.id)}
                                className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xóa
                              </button>
                            </div>
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

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa ngành học"
        message="Bạn có chắc chắn muốn xóa ngành học này? Hành động này không thể hoàn tác."
        confirmText="Xóa ngành học"
        cancelText="Hủy bỏ"
        type="danger"
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chỉnh sửa ngành học
                </h3>
                <p className="text-sm text-gray-600 mt-1">ID: {editId}</p>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên ngành <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập tên ngành học"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Học phí <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="tuitionFee"
                      value={form.tuitionFee}
                      onChange={handleChange}
                      type="number"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập học phí"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập mô tả ngành học"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu tuyển sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="admissionRequirements"
                    value={form.admissionRequirements}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập yêu cầu tuyển sinh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thông tin ký túc xá
                  </label>
                  <input
                    name="dormitoryInfo"
                    value={form.dormitoryInfo}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập thông tin ký túc xá"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Đang hoạt động
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  <X size={16} className="mr-2" />
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMajor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết ngành học
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ID: {selectedMajor.id}
                </p>
                <div className="mt-2">
                  {(() => {
                    const statusDisplay = getStatusDisplay(
                      selectedMajor.isActive
                    );
                    return (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${statusDisplay.dotColor}`}
                        ></span>
                        {statusDisplay.text}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <button
                onClick={closeDetailModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên ngành
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">
                    {selectedMajor.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Học phí
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">
                    {selectedMajor.tuitionFee?.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả ngành học
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {selectedMajor.description}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yêu cầu tuyển sinh
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">
                    {selectedMajor.admissionRequirements}
                  </p>
                </div>
              </div>

              {selectedMajor.dormitoryInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thông tin ký túc xá
                  </label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      {selectedMajor.dormitoryInfo}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái hoạt động
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMajor.isActive}
                      disabled
                      className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {selectedMajor.isActive
                        ? "Đang hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID ngành học
                  </label>
                  <p className="mt-1 text-sm text-gray-500 font-mono">
                    {selectedMajor.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  closeDetailModal();
                  handleEdit(selectedMajor);
                }}
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <Edit size={16} className="mr-2" />
                Chỉnh sửa
              </button>
              <button
                onClick={closeDetailModal}
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                <X size={16} className="mr-2" />
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <ToastComponent
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default AdminMajorsPage;
