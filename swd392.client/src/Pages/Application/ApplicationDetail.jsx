import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Send,
  FileText,
  User,
  Link as LinkIcon,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Loader2,
  Eye,
  Download,
  Phone,
  Hash,
  ZoomIn,
  ExternalLink,
  X,
} from "lucide-react";
import ApplicationService from "./applicationService";

const API_BASE_URL = window.REACT_APP_API_BASE_URL || "https://localhost:7013";

const statusConfig = {
  0: {
    name: "Bản nháp",
    color: "bg-gray-500",
    icon: FileText,
    description: "Hồ sơ chưa được nộp",
  },
  1: {
    name: "Đã nộp",
    color: "bg-blue-500",
    icon: Send,
    description: "Hồ sơ đã được nộp",
  },
  2: {
    name: "Đang xem xét",
    color: "bg-yellow-500",
    icon: Clock,
    description: "Hồ sơ đang được xem xét",
  },
  3: {
    name: "Được chấp nhận",
    color: "bg-green-500",
    icon: CheckCircle,
    description: "Hồ sơ đã được chấp nhận",
  },
  4: {
    name: "Bị từ chối",
    color: "bg-red-500",
    icon: XCircle,
    description: "Hồ sơ bị từ chối",
  },
};

// Toast Component
const Toast = ({ message, type = "info", onClose, autoClose = true }) => {
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

// Modal component for viewing images
const ImageModal = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

// Modal component for viewing documents
const DocumentModal = ({ isOpen, onClose, documentUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <div className="flex items-center space-x-2">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ExternalLink size={14} className="mr-1" />
              Mở tab mới
            </a>
            <a
              href={documentUrl}
              download
              className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Download size={14} className="mr-1" />
              Tải xuống
            </a>
            <button
              onClick={onClose}
              className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <X size={14} className="mr-1" />
              Đóng
            </button>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-600">
            Vui lòng mở hoặc tải xuống để xem tài liệu.
          </p>
        </div>
      </div>
    </div>
  );
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Toast and Confirm Modal states
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await ApplicationService.getById(id);
        console.log("Application data from API:", data);

        // Map all fields từ API response - thêm tiền tố URL cho imageUrl và documentUrls
        const mappedApplication = {
          id: data.id || "",
          studentId: data.studentId || "",
          studentName: data.studentName || "",
          studentPhone: data.studentPhone || "",
          programId: data.programId || "",
          programTitle: data.programTitle || "",
          imageUrl: data.imageUrl ? `${API_BASE_URL}${data.imageUrl}` : null,
          documentUrls: data.documentUrls
            ? data.documentUrls.map((url) => `${API_BASE_URL}${url}`)
            : [],
          portfolioLink: data.portfolioLink || "",
          otherLink: data.otherLink || "",
          submittedAt: data.submittedAt || null,
          statusName: data.statusName || "",
          status: data.status !== undefined ? data.status : 0,
          errorCode: data.errorCode || null,
          message: data.message || "",
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
        };

        console.log("Mapped application:", mappedApplication);
        setApplication(mappedApplication);
      } catch (err) {
        console.error("Error loading application:", err);
        setError(err.message || "Không thể tải thông tin hồ sơ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleBack = () => navigate("/nop-ho-so/ho-so-cua-toi");
  const handleEdit = () => navigate(`/nop-ho-so/${id}/chinh-sua`);

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      await ApplicationService.submitApplication(id);
      showToast("Hồ sơ đã được nộp thành công!", "success");

      // Refresh application data
      const updatedData = await ApplicationService.getById(id);
      const mappedUpdatedData = {
        id: updatedData.id || "",
        studentId: updatedData.studentId || "",
        studentName: updatedData.studentName || "",
        studentPhone: updatedData.studentPhone || "",
        programId: updatedData.programId || "",
        programTitle: updatedData.programTitle || "",
        imageUrl: updatedData.imageUrl
          ? `${API_BASE_URL}${updatedData.imageUrl}`
          : null,
        documentUrls: updatedData.documentUrls
          ? updatedData.documentUrls.map((url) => `${API_BASE_URL}${url}`)
          : [],
        portfolioLink: updatedData.portfolioLink || "",
        otherLink: updatedData.otherLink || "",
        submittedAt: updatedData.submittedAt || null,
        statusName: updatedData.statusName || "",
        status: updatedData.status !== undefined ? updatedData.status : 0,
        errorCode: updatedData.errorCode || null,
        message: updatedData.message || "",
        createdAt: updatedData.createdAt || null,
        updatedAt: updatedData.updatedAt || null,
      };
      setApplication(mappedUpdatedData);
    } catch (err) {
      console.error("Error submitting application:", err);
      showToast(err.message || "Không thể nộp hồ sơ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDocument = (documentUrl, index) => {
    setSelectedDocument({
      url: documentUrl,
      title: `Tài liệu hỗ trợ ${index + 1}`,
    });
    setShowDocumentModal(true);
  };

  const getStatusConfig = (status) => statusConfig[status] || statusConfig[0];
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                size={48}
                className="animate-spin text-orange-500 mb-4"
              />
              <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <AlertTriangle size={64} className="mx-auto text-red-500 mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không thể tải hồ sơ
              </h3>
              <p className="text-gray-600 mb-6">
                {error || "Hồ sơ này không tồn tại hoặc đã bị xóa"}
              </p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
              >
                <ArrowLeft size={20} className="mr-2" />
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không tìm thấy hồ sơ
              </h3>
              <p className="text-gray-600 mb-6">
                Hồ sơ này không tồn tại hoặc đã bị xóa
              </p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
              >
                <ArrowLeft size={20} className="mr-2" />
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusConfig(application.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại danh sách hồ sơ
            </button>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              CHI TIẾT HỒ SƠ XÉT TUYỂN
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              Xem chi tiết và quản lý hồ sơ xét tuyển của bạn
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin hồ sơ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Hash size={16} className="inline mr-2" />
                      Mã hồ sơ
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 font-mono text-sm">
                        {application.id || "Chưa có mã"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <StatusIcon size={16} className="inline mr-2" />
                      Trạng thái
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color} mr-2`}
                        >
                          <StatusIcon size={12} className="mr-1" />
                          {statusInfo.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {statusInfo.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin sinh viên
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 font-medium">
                        {application.studentName || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Số điện thoại
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">
                        {application.studentPhone || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin chương trình
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Chương trình đào tạo{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 font-medium">
                        {application.programTitle || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Ngày nộp
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">
                        {application.submittedAt
                          ? formatDate(application.submittedAt)
                          : "Chưa nộp"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Liên kết
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon size={16} className="inline mr-2" />
                      Liên kết Portfolio (Tùy chọn)
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {application.portfolioLink ? (
                        <a
                          href={application.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {application.portfolioLink}
                        </a>
                      ) : (
                        <p className="text-gray-500 italic">Chưa có</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon size={16} className="inline mr-2" />
                      Liên kết khác (Tùy chọn)
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {application.otherLink ? (
                        <a
                          href={application.otherLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {application.otherLink}
                        </a>
                      ) : (
                        <p className="text-gray-500 italic">Chưa có</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Ảnh hồ sơ <span className="text-red-500">*</span>
                </h3>
                {application.imageUrl ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="relative inline-block">
                      <img
                        src={application.imageUrl}
                        alt="Ảnh hồ sơ"
                        className="max-w-xs h-auto rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 italic">Chưa có ảnh hồ sơ</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Tài liệu hỗ trợ <span className="text-red-500">*</span>
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  {application.documentUrls &&
                  application.documentUrls.length > 0 ? (
                    <div className="space-y-3">
                      {application.documentUrls.map((doc, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all duration-200 group overflow-hidden"
                        >
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 cursor-pointer block"
                          >
                            <div className="flex items-center">
                              <FileText
                                size={18}
                                className="text-orange-600 mr-3 group-hover:text-orange-700 transition-colors"
                              />
                              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                Tài liệu {index + 1}
                              </span>
                            </div>
                            <div className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-700 rounded-md group-hover:bg-orange-200 transition-colors text-sm font-medium">
                              <ExternalLink size={12} className="mr-1" />
                              Mở mới
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có tài liệu nào</p>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    Các tài liệu hỗ trợ như bằng cấp, chứng chỉ, v.v. (PDF, DOC,
                    DOCX)
                  </p>
                </div>
              </div>

              {application.message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                    <CheckCircle size={18} className="mr-2" />
                    Thông báo từ hệ thống
                  </h3>
                  <p className="text-blue-700">{application.message}</p>
                </div>
              )}
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                {application.status === 0 && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Edit size={16} className="mr-2" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={handleSubmitClick}
                      disabled={isSubmitting}
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Đang nộp...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Nộp hồ sơ
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Xác nhận nộp hồ sơ"
        message="Bạn có chắc chắn muốn nộp hồ sơ này? Sau khi nộp, bạn sẽ không thể chỉnh sửa hồ sơ nữa."
        confirmText="Nộp hồ sơ"
        cancelText="Hủy bỏ"
        type="warning"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={application?.imageUrl}
        title="Ảnh hồ sơ"
      />

      <DocumentModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documentUrl={selectedDocument?.url}
        title={selectedDocument?.title}
      />
    </div>
  );
};

export default ApplicationDetail;
