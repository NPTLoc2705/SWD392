import React, { useState, useEffect, useCallback, memo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Compressor from "compressorjs";
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";
import {
  FileText,
  PlusCircle,
  Users,
  UserCheck,
  MessageCircle,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  XCircle,
  Save,
  X,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaQuestionCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const adminMenuItems = [
  {
    id: "faqs",
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
    active: true,
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

const API_BASE_URL = "https://localhost:7013";

// Service để xử lý API
const ArticleService = {
  fetchArticles: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Articles`);
      return res.data.data || [];
    } catch (error) {
      throw new Error("Không thể tải danh sách bài viết");
    }
  },
  createArticle: async (formData, token) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/Articles`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng bài thất bại.");
    }
  },
  updateArticle: async (id, formData, token) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/Articles/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Cập nhật bài viết thất bại."
      );
    }
  },
  deleteArticle: async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/Articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      throw new Error("Xóa bài viết thất bại!");
    }
  },
};

const stripImageTags = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const imgs = div.querySelectorAll("img");
  imgs.forEach((img) => img.remove());
  return div.innerText;
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

const UploadArticlePage = memo(() => {
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchArticles = useCallback(async () => {
    try {
      setArticlesLoading(true);
      const articles = await ArticleService.fetchArticles();
      setArticles(articles);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const showToast = useCallback((msg, type) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  }, []);

  const handleEdit = useCallback((article) => {
    setSelectedArticle(article);
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
      await ArticleService.deleteArticle(deletingId, token);
      setArticles((prev) => prev.filter((item) => item.id !== deletingId));
      showToast("Xóa bài viết thành công!", "success");
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

  const handleViewDetail = useCallback((article) => {
    setSelectedArticle(article);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedArticle(null);
    setDeletingId(null);
  }, []);

  const ArticleDetailModal = memo(({ article, onEdit, onClose }) => {
    if (!article) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Chi tiết bài viết
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
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID Bài viết</p>
                  <p className="font-semibold text-gray-800">#{article.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <CalendarIcon size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(article.createdAt)}
                  </p>
                </div>
              </div>

              {article.updatedAt && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                    <CalendarIcon size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(article.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              {(article.imagePath || article.image) && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                    <ImageIcon size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ảnh đại diện</p>
                    <p className="font-semibold text-gray-800">Có ảnh</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Tiêu đề</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 font-medium">{article.title}</p>
                </div>
              </div>

              {(article.imagePath || article.image) && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ImageIcon size={16} className="text-gray-600" />
                    <h4 className="font-semibold text-gray-800">
                      Ảnh đại diện
                    </h4>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <img
                      src={
                        article.imagePath
                          ? `${API_BASE_URL}${article.imagePath}`
                          : typeof article.image === "string"
                          ? article.image
                          : `data:image/jpeg;base64,${article.image}`
                      }
                      alt={article.title}
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MessageCircle size={16} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Nội dung</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div
                    className="prose max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: article.content,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onEdit(article);
                  onClose();
                }}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit size={16} className="mr-2" />
                Chỉnh sửa
              </button>
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
    const [coverImage, setCoverImage] = useState(null);

    const handleChange = useCallback((e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleContentChange = useCallback((newContent) => {
      setForm((prev) => ({ ...prev, content: newContent }));
    }, []);

    const handleImageChange = useCallback((e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast("Vui lòng chọn ảnh có kích thước nhỏ hơn 5MB", "error");
          return;
        }
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1200,
          maxHeight: 1200,
          success(compressedFile) {
            setCoverImage(compressedFile);
          },
          error(err) {
            console.error("Image compression failed:", err);
            showToast("Không thể nén ảnh!", "error");
          },
        });
      }
    }, [showToast]);

    const removeImage = useCallback(() => {
      setCoverImage(null);
    }, []);

    const handleFormSubmit = useCallback(
      (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) {
          showToast("Vui lòng nhập đầy đủ tiêu đề và nội dung", "error");
          return;
        }
        onSubmit({ ...form, coverImage });
      },
      [form, coverImage, onSubmit, showToast]
    );

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
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
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors"
              required
              placeholder="Nhập tiêu đề bài viết..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Ảnh đại diện bài viết <span className="text-red-500">*</span>
            </label>
            {isEditing && form.imagePath && !coverImage && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
                <img
                  src={`${API_BASE_URL}${form.imagePath}`}
                  alt="Current Cover"
                  required
                  className="w-32 h-20 object-cover rounded-lg shadow"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition-colors">
                <ImageIcon size={16} className="mr-2" />
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {coverImage ? (
                <span className="text-sm text-gray-700">
                  {coverImage.name}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-2 text-red-500 hover:text-red-700 text-xs"
                  >
                    (Xóa)
                  </button>
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  {isEditing ? "Giữ ảnh cũ hoặc chọn ảnh mới" : "Chưa chọn ảnh"}
                </span>
              )}
            </div>

            {coverImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Preview"
                  className="rounded-lg shadow max-h-48 object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                value={form.content}
                onEditorChange={handleContentChange}
                init={{
                  height: 400,
                  menubar: true,
                  license_key: "gpl",
                  plugins: [
                    "advlist autolink lists link image charmap preview",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table help",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | link image media | preview fullscreen | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:15px } img { max-width: 100%; height: auto; }",
                  file_picker_callback: function (callback, value, meta) {
                    if (meta.filetype === "image") {
                      let input = document.createElement("input");
                      input.setAttribute("type", "file");
                      input.setAttribute("accept", "image/*");
                      input.onchange = function () {
                        let file = this.files[0];
                        let reader = new FileReader();
                        reader.onload = function () {
                          let id = "blobid" + new Date().getTime();
                          let blobCache =
                            window.tinymce.activeEditor.editorUpload.blobCache;
                          let base64 = reader.result.split(",")[1];
                          let blobInfo = blobCache.create(id, file, base64);
                          blobCache.add(blobInfo);
                          callback(blobInfo.blobUri(), { title: file.name });
                        };
                        reader.readAsDataURL(file);
                      };
                      input.click();
                    }
                  },
                  images_upload_handler: (blobInfo, progress) =>
                    new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = () => reject("File reading failed");
                      reader.readAsDataURL(blobInfo.blob());
                    }),
                }}
              />
            </div>
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
                  {isEditing ? "Đang cập nhật..." : "Đang đăng..."}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {isEditing ? "Cập nhật bài viết" : "Đăng bài viết"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  });

  const ArticlesManagement = memo(({ articles, loading, onEdit, onDelete, onViewDetail, onRefresh }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Quản lý bài viết
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
            Tạo bài viết mới
          </button>
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
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                Không có bài viết nào
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Các bài viết sẽ hiển thị tại đây
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Tổng số bài viết:{" "}
                  <span className="font-semibold text-blue-600">
                    {articles.length}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-3 text-left text-sm font-medium text-gray-700">
                        STT
                      </th>
                      <th className="border border-gray-200 px-2 py-3 text-left text-sm font-medium text-gray-700">
                        Ảnh
                      </th>
                      <th className="border border-gray-200 px-2 py-3 text-left text-sm font-medium text-gray-700">
                        Tiêu đề
                      </th>
                      <th className="border border-gray-200 px-2 py-3 text-left text-sm font-medium text-gray-700">
                        Nội dung
                      </th>
                      <th className="border border-gray-200 px-2 py-3 text-left text-sm font-medium text-gray-700">
                        Ngày tạo
                      </th>
                      <th className="border border-gray-200 px-2 py-3 text-left text-sm font-medium text-gray-700">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, index) => (
                      <tr
                        key={article.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-200 px-2 py-3 text-sm text-gray-900 font-medium">
                          {index + 1}
                        </td>
                        <td className="border border-gray-200 px-2 py-3">
                          {article.imagePath || article.image ? (
                            <img
                              src={
                                article.imagePath
                                  ? `${API_BASE_URL}${article.imagePath}`
                                  : typeof article.image === "string"
                                  ? article.image
                                  : `data:image/jpeg;base64,${article.image}`
                              }
                              alt={article.title}
                              className="w-12 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                No image
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 px-2 py-3">
                          <div className="max-w-xs">
                            <p
                              className="text-sm font-medium text-gray-900 truncate"
                              title={article.title}
                            >
                              {article.title}
                            </p>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-2 py-3">
                          <div className="max-w-md">
                            <p
                              className="text-sm text-gray-600 truncate"
                              title={stripImageTags(article.content)}
                            >
                              {stripImageTags(article.content).substring(0, 50)}
                              ...
                            </p>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-2 py-3 text-sm text-gray-900">
                          {formatDate(article.createdAt)}
                        </td>
                        <td className="border border-gray-200 px-2 py-3">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onViewDetail(article)}
                              className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={12} className="mr-1" />
                              Xem
                            </button>
                            <button
                              onClick={() => onEdit(article)}
                              className="flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={12} className="mr-1" />
                              Sửa
                            </button>
                            <button
                              onClick={() => onDelete(article.id)}
                              disabled={deletingId === article.id}
                              className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                              title="Xóa"
                            >
                              {deletingId === article.id ? (
                                <div className="w-2 h-2 border border-red-700 border-t-transparent rounded-full animate-spin mr-1"></div>
                              ) : (
                                <Trash2 size={12} className="mr-1" />
                              )}
                              Xóa
                            </button>
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
                Xác nhận xóa bài viết
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
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
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const handleSubmit = useCallback(
    async (data) => {
      if (!data) {
        setActiveTab("manage");
        setSelectedArticle(null);
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("Title", data.title);
      formData.append("Content", data.content);
      if (data.id) {
        formData.append("ImagePath", data.imagePath || "");
      }
      if (data.coverImage) {
        formData.append("image", data.coverImage);
      }

      try {
        const token = localStorage.getItem("token");
        if (data.id) {
          await ArticleService.updateArticle(data.id, formData, token);
          showToast("Cập nhật bài viết thành công!", "success");
        } else {
          await ArticleService.createArticle(formData, token);
          showToast("Đăng bài thành công!", "success");
        }
        setSelectedArticle(null);
        setActiveTab("manage");
        fetchArticles();
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchArticles, showToast]
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
              onClick={() => {
                setActiveTab("create");
                setMessage("");
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
                  {selectedArticle ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("manage");
                setSelectedArticle(null);
                setMessage("");
              }}
              className={`cursor-pointer flex-1 px-6 py-4 text-sm font-medium rounded-r-xl transition-colors ${
                activeTab === "manage"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText size={16} />
                <span>Quản lý bài viết</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <CreateEditForm
            onSubmit={handleSubmit}
            initialForm={
              selectedArticle
                ? {
                    id: selectedArticle.id,
                    title: selectedArticle.title,
                    content: selectedArticle.content,
                    imagePath: selectedArticle.imagePath || "",
                  }
                : { title: "", content: "", imagePath: "" }
            }
            isEditing={!!selectedArticle}
            isSubmitting={loading}
            error={message}
          />
        ) : (
          <ArticlesManagement
            articles={articles}
            loading={articlesLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewDetail={handleViewDetail}
            onRefresh={fetchArticles}
          />
        )}

        {showModal && deletingId && (
          <ConfirmDeleteModal
            isOpen={showModal}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        {showModal && selectedArticle && !deletingId && (
          <ArticleDetailModal
            article={selectedArticle}
            onEdit={handleEdit}
            onClose={closeModal}
          />
        )}
      </div>
    </AdminConsultantLayout>
  );
});

export default memo(UploadArticlePage);