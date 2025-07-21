import React, { useState, useEffect, useCallback, memo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
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
    active: true,
    onClick: () => (window.location.href = "/upload-article"),
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

// Quản lý state bằng useReducer
const initialState = {
  title: "",
  content: "",
  coverImage: null,
  currentImagePath: "",
  editingArticle: null,
  message: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_COVER_IMAGE":
      return { ...state, coverImage: action.payload };
    case "SET_CURRENT_IMAGE_PATH":
      return { ...state, currentImagePath: action.payload };
    case "SET_EDITING_ARTICLE":
      return { ...state, editingArticle: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "RESET_FORM":
      return { ...initialState };
    default:
      return state;
  }
};

const UploadArticlePage = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setArticlesLoading(true);
      const articles = await ArticleService.fetchArticles();
      setArticles(articles);
    } catch (error) {
      dispatch({ type: "SET_MESSAGE", payload: error.message });
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleTitleChange = useCallback(
    debounce((e) => {
      dispatch({ type: "SET_TITLE", payload: e.target.value });
    }, 200),
    []
  );

  const handleContentChange = useCallback(
    debounce((newContent) => {
      dispatch({ type: "SET_CONTENT", payload: newContent });
    }, 300),
    []
  );

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        dispatch({
          type: "SET_MESSAGE",
          payload: "Vui lòng chọn ảnh có kích thước nhỏ hơn 5MB",
        });
        return;
      }
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
        success(compressedFile) {
          dispatch({ type: "SET_COVER_IMAGE", payload: compressedFile });
        },
        error(err) {
          console.error("Image compression failed:", err);
          dispatch({ type: "SET_MESSAGE", payload: "Không thể nén ảnh!" });
        },
      });
    }
  }, []);

  const removeImage = useCallback(() => {
    dispatch({ type: "SET_COVER_IMAGE", payload: null });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("Title", state.title);
    formData.append("Content", state.content);
    if (state.editingArticle) {
      formData.append("ImagePath", state.currentImagePath || "");
    }
    if (state.coverImage) {
      formData.append("image", state.coverImage);
    }

    try {
      const token = localStorage.getItem("token");
      if (state.editingArticle) {
        await ArticleService.updateArticle(
          state.editingArticle.id,
          formData,
          token
        );
        dispatch({
          type: "SET_MESSAGE",
          payload: "Cập nhật bài viết thành công!",
        });
      } else {
        await ArticleService.createArticle(formData, token);
        dispatch({ type: "SET_MESSAGE", payload: "Đăng bài thành công!" });
      }
      resetForm();
      fetchArticles();
      setActiveTab("manage");
    } catch (error) {
      dispatch({ type: "SET_MESSAGE", payload: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    dispatch({ type: "SET_EDITING_ARTICLE", payload: article });
    dispatch({ type: "SET_TITLE", payload: article.title });
    dispatch({ type: "SET_CONTENT", payload: article.content });
    dispatch({
      type: "SET_CURRENT_IMAGE_PATH",
      payload: article.imagePath || "",
    });
    dispatch({ type: "SET_COVER_IMAGE", payload: null });
    setActiveTab("create");
    dispatch({ type: "SET_MESSAGE", payload: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await ArticleService.deleteArticle(id, token);
      setArticles((prev) => prev.filter((item) => item.id !== id));
      dispatch({ type: "SET_MESSAGE", payload: "Xóa bài viết thành công!" });
    } catch (error) {
      dispatch({ type: "SET_MESSAGE", payload: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const handleViewDetail = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const ArticleDetailModal = memo(() => {
    if (!selectedArticle) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Chi tiết bài viết
            </h3>
            <button
              onClick={closeModal}
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
                  <p className="font-semibold text-gray-800">
                    #{selectedArticle.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <CalendarIcon size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(selectedArticle.createdAt)}
                  </p>
                </div>
              </div>

              {selectedArticle.updatedAt && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                    <CalendarIcon size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedArticle.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              {(selectedArticle.imagePath || selectedArticle.image) && (
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
                  <p className="text-gray-800 font-medium">
                    {selectedArticle.title}
                  </p>
                </div>
              </div>

              {(selectedArticle.imagePath || selectedArticle.image) && (
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
                        selectedArticle.imagePath
                          ? `${API_BASE_URL}${selectedArticle.imagePath}`
                          : typeof selectedArticle.image === "string"
                          ? selectedArticle.image
                          : `data:image/jpeg;base64,${selectedArticle.image}`
                      }
                      alt={selectedArticle.title}
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
                      __html: selectedArticle.content,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  closeModal();
                  handleEdit(selectedArticle);
                }}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit size={16} className="mr-2" />
                Chỉnh sửa
              </button>
              <button
                onClick={closeModal}
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

  const CreateEditForm = memo(() => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {state.editingArticle ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h2>
        {state.editingArticle && (
          <button
            onClick={() => {
              resetForm();
              dispatch({ type: "SET_MESSAGE", payload: "" });
            }}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X size={16} className="mr-2" />
            Hủy chỉnh sửa
          </button>
        )}
      </div>

      {state.message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            state.message.toLowerCase().includes("thành công") ||
            state.message.toLowerCase().includes("success")
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center">
            {state.message.toLowerCase().includes("thành công") ? (
              <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            ) : (
              <XCircle size={20} className="mr-2 flex-shrink-0" />
            )}
            <span className="font-medium">{state.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <input
            key="title-input"
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            defaultValue={state.title}
            onChange={handleTitleChange}
            required
            placeholder="Nhập tiêu đề bài viết..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Ảnh đại diện bài viết
          </label>
          {state.editingArticle &&
            state.currentImagePath &&
            !state.coverImage && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
                <img
                  src={`${API_BASE_URL}${state.currentImagePath}`}
                  alt="Current Cover"
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
            {state.coverImage ? (
              <span className="text-sm text-gray-700">
                {state.coverImage.name}
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
                {state.editingArticle
                  ? "Giữ ảnh cũ hoặc chọn ảnh mới"
                  : "Chưa chọn ảnh"}
              </span>
            )}
          </div>

          {state.coverImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(state.coverImage)}
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
              value={state.content}
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
            disabled={loading}
            className="cursor-pointer flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {loading
              ? state.editingArticle
                ? "Đang cập nhật..."
                : "Đang đăng..."
              : state.editingArticle
              ? "Cập nhật bài viết"
              : "Đăng bài viết"}
          </button>
        </div>
      </form>
    </div>
  ));

  const ArticlesManagement = memo(() => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Quản lý bài viết
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchArticles}
            disabled={articlesLoading}
            className="cursor-pointer flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${articlesLoading ? "animate-spin" : ""}`}
            />
            {articlesLoading ? "Đang tải..." : "Làm mới"}
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className="cursor-pointer flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={16} className="mr-2" />
            Tạo bài viết mới
          </button>
        </div>
      </div>

      {state.message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            state.message.toLowerCase().includes("thành công") ||
            state.message.toLowerCase().includes("success")
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center">
            {state.message.toLowerCase().includes("thành công") ? (
              <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            ) : (
              <XCircle size={20} className="mr-2 flex-shrink-0" />
            )}
            <span className="font-medium">{state.message}</span>
          </div>
        </div>
      )}

      {articlesLoading ? (
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
                    <tr class501Name="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        STT
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Ảnh
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Tiêu đề
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Nội dung
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Ngày tạo
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
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
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium">
                          {index + 1}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
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
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                No image
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="max-w-xs">
                            <p
                              className="text-sm font-medium text-gray-900 truncate"
                              title={article.title}
                            >
                              {article.title}
                            </p>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="max-w-md">
                            <p
                              className="text-sm text-gray-600 truncate"
                              title={stripImageTags(article.content)}
                            >
                              {stripImageTags(article.content).substring(
                                0,
                                100
                              )}
                              ...
                            </p>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                          {formatDate(article.createdAt)}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetail(article)}
                              className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={14} className="mr-1" />
                              Xem
                            </button>
                            <button
                              onClick={() => handleEdit(article)}
                              className="flex items-center px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={14} className="mr-1" />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              disabled={deletingId === article.id}
                              className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                              title="Xóa"
                            >
                              {deletingId === article.id ? (
                                <div className="w-3 h-3 border border-red-700 border-t-transparent rounded-full animate-spin mr-1"></div>
                              ) : (
                                <Trash2 size={14} className="mr-1" />
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

      {showModal && <ArticleDetailModal />}
    </div>
  ));

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateEditForm />;
      case "manage":
        return <ArticlesManagement />;
      default:
        return <CreateEditForm />;
    }
  };

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
                dispatch({ type: "SET_MESSAGE", payload: "" });
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
                  {state.editingArticle
                    ? "Chỉnh sửa bài viết"
                    : "Tạo bài viết mới"}
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("manage");
                resetForm();
                dispatch({ type: "SET_MESSAGE", payload: "" });
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
        {renderContent()}
      </div>
    </AdminConsultantLayout>
  );
};

export default memo(UploadArticlePage);
