import React, { useEffect, useState, useCallback, memo } from "react";
import axios from "axios";
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
import {
  FileText,
  PlusCircle,
  Users,
  MessageCircle,
  RefreshCw,
  XCircle,
  CheckCircle,
  Eye,
  UserCheck,
  X,
  BookOpen,
} from "lucide-react";

const API_BASE_URL = "https://localhost:7013";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const adminMenuItems = [
  {
    id: "faqs",
    name: "Quản lý FAQ",
    icon: FaQuestionCircle,
    description: "Xem, sửa, xóa các FAQ.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    active: true,
    onClick: () => (window.location.href = "/admin/faq"),
    className: "cursor-pointer",
  },
  {
    id: "articles",
    name: "Quản lý bài viết",
    icon: PlusCircle,
    description: "Xem, sửa, xóa các bài viết đã đăng.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    active: false,
    onClick: () => (window.location.href = "/admin/upload-article"),
    className: "cursor-pointer",
  },
  {
    id: "users",
    name: "Quản lý người dùng",
    icon: Users,
    description: "Xem và quản lý tài khoản.",
    color: "text-green-600",
    bgColor: "bg-green-50",
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
    active: false,
    onClick: () => (window.location.href = "/admin/majors"),
    className: "cursor-pointer",
  },
];

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

// API Service
const FAQService = {
  fetchFAQs: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/FAQ`);
      return response.data.data || [];
    } catch (error) {
      throw new Error("Không thể tải danh sách FAQ");
    }
  },
  createFAQ: async (faqData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/FAQ`, faqData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Tạo FAQ thất bại");
    }
  },
  updateFAQ: async (id, faqData, token) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/FAQ/${id}`,
        faqData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Cập nhật FAQ thất bại");
    }
  },
  deleteFAQ: async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/FAQ/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      throw new Error("Xóa FAQ thất bại!");
    }
  },
};

const FAQCRUDPage = memo(() => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("create");
  const [showModal, setShowModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [message, setMessage] = useState("");

  const user = getCurrentUser();

  const fetchFAQs = useCallback(async () => {
    try {
      setLoading(true);
      const faqs = await FAQService.fetchFAQs();
      setFaqs(faqs);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const showToast = useCallback((msg, type) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  }, []);

  const handleEdit = useCallback((faq) => {
    setActiveTab("create");
    setShowModal(false);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setDeletingId(id);
    setShowModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingId) return;

    try {
      const token = localStorage.getItem("token");
      await FAQService.deleteFAQ(deletingId, token);
      setFaqs((prev) => prev.filter((item) => item.id !== deletingId));
      showToast("Xóa FAQ thành công!", "success");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setDeletingId(null);
      setShowModal(false);
    }
  }, [deletingId, showToast]);

  const handleCancelDelete = useCallback(() => {
    setShowModal(false);
    setDeletingId(null);
  }, []);

  const handleViewDetail = useCallback((faq) => {
    setSelectedFaq(faq);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedFaq(null);
    setDeletingId(null);
  }, []);

  const FAQDetailModal = memo(({ faq, onEdit, onClose }) => {
    if (!faq) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Chi tiết FAQ
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <FaQuestionCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID FAQ</p>
                  <p className="font-semibold text-gray-800">#{faq.id}</p>
                </div>
              </div>

              {faq.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(faq.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FaQuestionCircle size={16} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Câu hỏi</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 font-medium">{faq.question}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MessageCircle size={16} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Câu trả lời</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {user && user.role === "Admin" && (
                <button
                  onClick={() => {
                    onEdit(faq);
                    onClose();
                  }}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <FaEdit size={16} className="mr-2" />
                  Chỉnh sửa
                </button>
              )}
              <button
                onClick={onClose}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const CreateEditForm = memo(({ onSubmit, initialForm, isEditing, isSubmitting, error }) => {
    const [form, setForm] = useState(initialForm);

    const handleChange = useCallback((e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleFormSubmit = useCallback(
      (e) => {
        e.preventDefault();
        if (!form.question.trim() || !form.answer.trim()) {
          showToast("Vui lòng nhập đầy đủ câu hỏi và câu trả lời", "error");
          return;
        }
        onSubmit(form);
      },
      [form, onSubmit, showToast]
    );

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Chỉnh sửa FAQ" : "Tạo FAQ mới"}
          </h2>
          {isEditing && (
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
          <div
            className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-700"
          >
            <div className="flex items-center">
              <XCircle size={20} className="mr-2 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Câu hỏi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors"
              rows="3"
              placeholder="Nhập câu hỏi..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Câu trả lời <span className="text-red-500">*</span>
            </label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors"
              rows="5"
              placeholder="Nhập câu trả lời..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isEditing ? "Đang cập nhật..." : "Đang lưu..."}
                </>
              ) : (
                <>
                  <FaSave size={16} className="mr-2" />
                  {isEditing ? "Cập nhật FAQ" : "Lưu FAQ"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  });

  const FAQsManagement = memo(({ faqs, loading, onEdit, onDelete, onViewDetail, onRefresh, showToast }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Quản lý FAQ</h2>
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
          {user && user.role === "Admin" && (
            <button
              onClick={() => onEdit(null)}
              className="cursor-pointer flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              Tạo FAQ mới
            </button>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.toLowerCase().includes("thành công")
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center">
            {message.toLowerCase().includes("thành công") ? (
              <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            ) : (
              <XCircle size={20} className="mr-2 flex-shrink-0" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw size={32} className="animate-spin text-blue-600 mb-4" />
          <span className="text-gray-600 text-lg">Đang tải dữ liệu...</span>
          <span className="text-gray-500 text-sm mt-2">
            Vui lòng chờ trong giây lát
          </span>
        </div>
      ) : (
        <>
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <FaQuestionCircle
                size={64}
                className="mx-auto text-gray-300 mb-4"
              />
              <p className="text-gray-500 text-lg mb-2">Không có FAQ nào</p>
              <p className="text-gray-400 text-sm mt-2">
                Các FAQ sẽ hiển thị tại đây
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Tổng số FAQ:{" "}
                  <span className="font-semibold text-blue-600">
                    {faqs.length}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
                </div>
              </div>

              <div className="overflow-hidden">
                <table className="w-full border-collapse bg-white table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 w-16">
                        STT
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 w-1/3">
                        Câu hỏi
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 w-1/3">
                        Câu trả lời
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 w-1/4">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map((faq, index) => (
                      <tr
                        key={faq.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="w-full">
                            <p
                              className="text-sm font-medium text-gray-900 break-words line-clamp-3"
                              title={faq.question}
                            >
                              {faq.question}
                            </p>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="w-full">
                            <p
                              className="text-sm text-gray-600 break-words line-clamp-3"
                              title={faq.answer}
                            >
                              {faq.answer.length > 120
                                ? `${faq.answer.substring(0, 120)}...`
                                : faq.answer}
                            </p>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => onViewDetail(faq)}
                              className="cursor-pointer inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={12} className="mr-1" />
                              Xem
                            </button>
                            {user && user.role === "Admin" && (
                              <>
                                <button
                                  onClick={() => onEdit(faq)}
                                  className="cursor-pointer inline-flex items-center px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <FaEdit size={12} className="mr-1" />
                                  Sửa
                                </button>
                                <button
                                  onClick={() => onDelete(faq.id)}
                                  disabled={deletingId === faq.id}
                                  className="cursor-pointer inline-flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                                  title="Xóa"
                                >
                                  {deletingId === faq.id ? (
                                    <div className="w-3 h-3 border border-red-700 border-t-transparent rounded-full animate-spin mr-1"></div>
                                  ) : (
                                    <FaTrash size={12} className="mr-1" />
                                  )}
                                  Xóa
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  ));

  const ConfirmDeleteModal = memo(({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <XCircle size={24} className="text-red-600 mr-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa FAQ
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa FAQ này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Xóa FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const handleSubmit = useCallback(
    async (form) => {
      if (!form) {
        setActiveTab("manage");
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (form.id) {
          await FAQService.updateFAQ(
            form.id,
            { question: form.question, answer: form.answer },
            token
          );
          showToast("Cập nhật FAQ thành công!", "success");
        } else {
          await FAQService.createFAQ(
            { question: form.question, answer: form.answer },
            token
          );
          showToast("Tạo FAQ thành công!", "success");
        }
        setActiveTab("manage");
        fetchFAQs();
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchFAQs, showToast]
  );

  return (
    <AdminConsultantLayout
      menuItems={adminMenuItems}
      userRole="Admin"
      panelTitle="Admin Panel"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-l-xl transition-colors cursor-pointer ${
                activeTab === "create"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <PlusCircle size={16} />
                <span>Tạo FAQ mới</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-r-xl transition-colors cursor-pointer ${
                activeTab === "manage"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText size={16} />
                <span>Quản lý FAQ</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <CreateEditForm
            onSubmit={handleSubmit}
            initialForm={
              selectedFaq
                ? { id: selectedFaq.id, question: selectedFaq.question, answer: selectedFaq.answer }
                : { question: "", answer: "" }
            }
            isEditing={!!selectedFaq}
            isSubmitting={loading}
            error={message}
          />
        ) : (
          <FAQsManagement
            faqs={faqs}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewDetail={handleViewDetail}
            onRefresh={fetchFAQs}
            showToast={showToast}
          />
        )}

        {showModal && deletingId && (
          <ConfirmDeleteModal
            isOpen={showModal}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        {showModal && selectedFaq && !deletingId && (
          <FAQDetailModal
            faq={selectedFaq}
            onEdit={handleEdit}
            onClose={closeModal}
          />
        )}
      </div>
    </AdminConsultantLayout>
  );
});

export default memo(FAQCRUDPage);