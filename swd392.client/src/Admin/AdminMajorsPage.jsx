import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
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

const API_BASE = "https://localhost:7013/api/programs";

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

// Create/Edit Form Component
const CreateEditForm = memo(
  ({ onSubmit, initialForm, editId, error, isSubmitting }) => {
    const [form, setForm] = useState(initialForm);

    const handleChange = useCallback((e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }, []);

    const handleFormSubmit = useCallback(
      (e) => {
        e.preventDefault();
        onSubmit(form);
      },
      [form, onSubmit]
    );

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {editId ? "Chỉnh sửa ngành học" : "Tạo ngành học mới"}
          </h2>
          {editId && (
            <button
              onClick={() => onSubmit(null)}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={16} className="mr-2" />
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-700">
            <div className="flex items-center">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
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

          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">
              Trạng thái hoạt động
            </label>
            <div className="relative">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                disabled={isSubmitting}
                className="sr-only peer"
                id="isActiveToggle"
              />
              <label
                htmlFor="isActiveToggle"
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer peer-focus:ring-2 peer-focus:ring-orange-500 peer-focus:ring-offset-2 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed ${
                  form.isActive
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                title={form.isActive ? "Đang tuyển sinh" : "Ngừng tuyển sinh"}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    form.isActive ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </label>
            </div>
            <span
              className={`text-sm ${
                form.isActive ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              {form.isActive ? "Đang tuyển sinh" : "Ngừng tuyển sinh"}
            </span>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  {editId ? "Đang cập nhật..." : "Đang thêm..."}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {editId ? "Cập nhật ngành học" : "Tạo ngành học"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

// Majors Management Component
const MajorsManagement = memo(
  ({ majors, searchTerm, onEdit, onDelete, onDetail, onRefresh, loading }) => {
    const filteredMajors = useMemo(
      () =>
        majors.filter(
          (major) =>
            major.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            major.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            major.admissionRequirements
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        ),
      [majors, searchTerm]
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

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý ngành học
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="cursor-pointer flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={16}
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
            <button
              onClick={() => onEdit(null)}
              className="cursor-pointer flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              Tạo ngành học mới
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm ngành học..."
                defaultValue={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Tổng: {majors.length} ngành</span>
              <span>
                Đang tuyển: {majors.filter((major) => major.isActive).length}
              </span>
              <span>
                Ngừng tuyển: {majors.filter((major) => !major.isActive).length}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw size={32} className="animate-spin text-blue-600 mb-4" />
            <span className="text-gray-600 text-lg">Đang tải dữ liệu...</span>
            <span className="text-gray-500 text-sm mt-2">
              Vui lòng chờ trong giây lát
            </span>
          </div>
        ) : filteredMajors.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Không có ngành học nào</p>
            <p className="text-gray-400 text-sm mt-2">
              Các ngành học sẽ hiển thị tại đây
            </p>
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
                  const toggleId = `toggle-${major.id}`;

                  return (
                    <tr key={major.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {major.title}
                          </div>
                          <div
                            className="text-sm text-gray-500 line-clamp-2 break-words max-w-[10rem] md:max-w-[14rem] lg:max-w-[18rem] xl:max-w-[22rem] 2xl:max-w-[26rem]"
                            title={major.description}
                          >
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
                          <div className="relative">
                            <input
                              type="checkbox"
                              id={toggleId}
                              checked={major.isActive}
                              onChange={async () => {
                                const newStatus = !major.isActive;
                                const updateData = {
                                  title: major.title,
                                  description: major.description,
                                  admissionRequirements:
                                    major.admissionRequirements,
                                  tuitionFee: major.tuitionFee,
                                  dormitoryInfo: major.dormitoryInfo,
                                  isActive: newStatus,
                                };
                                try {
                                  await axios.put(
                                    `${API_BASE}/update/${major.id}`,
                                    updateData,
                                    { headers: getAuthHeaders() }
                                  );
                                  showToast(
                                    "Cập nhật trạng thái thành công!",
                                    "success"
                                  );
                                  onRefresh();
                                } catch (err) {
                                  showToast(
                                    "Lỗi khi cập nhật trạng thái",
                                    "error"
                                  );
                                }
                              }}
                              className="sr-only peer"
                            />
                            {/* <label
                              htmlFor={toggleId}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer peer-focus:ring-2 peer-focus:ring-orange-500 peer-focus:ring-offset-2 ${
                                major.isActive
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                              title={
                                major.isActive
                                  ? "Nhấn để tắt tuyển sinh"
                                  : "Nhấn để bật tuyển sinh"
                              }
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                  major.isActive
                                    ? "translate-x-5"
                                    : "translate-x-1"
                                }`}
                              />
                            </label> */}
                          </div>
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
                            onClick={() => onDetail(major)}
                            className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Xem
                          </button>
                          <button
                            onClick={() => onEdit(major)}
                            className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Sửa
                          </button>
                          <button
                            onClick={() => onDelete(major.id)}
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
    );
  }
);

const AdminMajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const getAuthHeaders = useCallback(() => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleApiError = useCallback(
    (err, defaultMessage) => {
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
    },
    [showToast]
  );

  const fetchMajors = useCallback(async () => {
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
  }, [getAuthHeaders, handleApiError]);

  useEffect(() => {
    fetchMajors();
  }, [fetchMajors]);

  const handleSubmit = useCallback(
    async (form) => {
      if (!form) {
        setEditId(null);
        setError("");
        return;
      }

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
        } else {
          await axios.post(`${API_BASE}/create`, requestData, {
            headers: getAuthHeaders(),
          });
          showToast("Thêm ngành học thành công!", "success");
        }

        setEditId(null);
        setError("");
        await fetchMajors();
        setActiveTab("manage");
      } catch (err) {
        handleApiError(
          err,
          editId ? "Lỗi khi cập nhật ngành học" : "Lỗi khi thêm ngành học"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editId, getAuthHeaders, showToast, handleApiError, fetchMajors]
  );

  const handleEdit = useCallback(
    (major) => {
      setEditId(major ? major.id : null);
      setActiveTab("create");
      if (showDetailModal) {
        setShowDetailModal(false);
      }
    },
    [showDetailModal]
  );

  const handleDeleteClick = useCallback((id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
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
  }, [itemToDelete, getAuthHeaders, showToast, handleApiError, fetchMajors]);

  const handleCancelDelete = useCallback(() => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  }, []);

  const openDetailModal = useCallback((major) => {
    setSelectedMajor(major);
    setShowDetailModal(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedMajor(null);
  }, []);

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = useCallback(
    (value) => {
      debouncedSetSearchTerm(value);
    },
    [debouncedSetSearchTerm]
  );

  const getStatusDisplay = useCallback((isActive) => {
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
  }, []);

  return (
    <>
      <AdminConsultantLayout
        menuItems={adminMenuItems}
        userRole="Admin"
        panelTitle="Admin Panel"
      >
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab("create");
                  setError("");
                }}
                className={`cursor-pointer flex-1 px-6 py-4 text-sm font-medium rounded-l-xl transition-colors ${
                  activeTab === "create"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <PlusCircle size={16} />
                  <span>
                    {editId ? "Chỉnh sửa ngành học" : "Tạo ngành học mới"}
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("manage");
                  setEditId(null);
                  setError("");
                }}
                className={`cursor-pointer flex-1 px-6 py-4 text-sm font-medium rounded-r-xl transition-colors ${
                  activeTab === "manage"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen size={16} />
                  <span>Quản lý ngành học</span>
                </div>
              </button>
            </div>
          </div>

          {activeTab === "create" ? (
            <CreateEditForm
              onSubmit={handleSubmit}
              initialForm={
                editId
                  ? majors.find((m) => m.id === editId) || emptyMajor
                  : emptyMajor
              }
              editId={editId}
              error={error}
              isSubmitting={isSubmitting}
            />
          ) : (
            <MajorsManagement
              majors={majors}
              searchTerm={searchTerm}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onDetail={openDetailModal}
              onRefresh={fetchMajors}
              onSearch={handleSearchChange}
              loading={loading}
            />
          )}
        </div>
      </AdminConsultantLayout>

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
                  <div className="mt-1 flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedMajor.isActive}
                        disabled
                        className="sr-only peer"
                        id="detailToggle"
                      />
                      <label
                        htmlFor="detailToggle"
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out opacity-50 ${
                          selectedMajor.isActive
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                            selectedMajor.isActive
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </label>
                    </div>
                    <span
                      className={`text-sm ${
                        selectedMajor.isActive
                          ? "text-green-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {selectedMajor.isActive
                        ? "Đang tuyển sinh"
                        : "Ngừng tuyển sinh"}
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
