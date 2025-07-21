import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  UserCheck,
  RefreshCw,
  Search,
  PlusCircle,
  Eye,
  Edit,
  Download,
  ThumbsUp,
  ThumbsDown,
  X,
  ExternalLink,
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
import Toast from "../Components/Toast";

const API_BASE_URL = window.REACT_APP_API_BASE_URL || "https://localhost:7013";

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
    active: true,
    onClick: () => (window.location.href = "/admin/applications"),
    className: "cursor-pointer",
  },
];

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

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});

  // Modal states for viewing images and documents
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Toast functions
  const showToast = (message, type = "success") => {
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

  // Fetch all submitted applications
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://localhost:7013/api/application/admin/submitted",
        {
          headers: getAuthHeaders(),
        }
      );

      // API trả về array trực tiếp
      const applicationsData = response.data || [];

      // Map data và thêm full URL cho imageUrl và documentUrls
      const mappedApplications = applicationsData.map((app) => ({
        ...app,
        imageUrl: app.imageUrl ? `${API_BASE_URL}${app.imageUrl}` : null,
        documentUrls: app.documentUrls
          ? app.documentUrls.map((url) => `${API_BASE_URL}${url}`)
          : [],
      }));

      setApplications(
        Array.isArray(mappedApplications) ? mappedApplications : []
      );
    } catch (err) {
      handleApiError(err, "Có lỗi khi tải danh sách hồ sơ");
    } finally {
      setLoading(false);
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

  // Change application status (Approve/Reject)
  const changeApplicationStatus = async (applicationId, statusValue) => {
    setStatusUpdating((prev) => ({ ...prev, [applicationId]: true }));

    try {
      await axios.patch(
        `https://localhost:7013/api/application/${applicationId}/status`,
        { statusValue },
        { headers: getAuthHeaders() }
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: statusValue } : app
        )
      );

      // Update selected application if it's the one being modified
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication((prev) => ({ ...prev, status: statusValue }));
      }

      const statusText = statusValue === 2 ? "phê duyệt" : "từ chối";
      showToast(`Đã ${statusText} hồ sơ thành công!`, "success");
    } catch (err) {
      handleApiError(err, "Có lỗi khi cập nhật trạng thái hồ sơ");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleApprove = (applicationId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn phê duyệt hồ sơ này? Hành động này không thể hoàn tác."
      )
    ) {
      changeApplicationStatus(applicationId, 2); // Approved = 2
    }
  };

  const handleReject = (applicationId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn từ chối hồ sơ này? Hành động này không thể hoàn tác."
      )
    ) {
      changeApplicationStatus(applicationId, 3); // Rejected = 3
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 0:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: HelpCircle,
          text: "Bản nháp",
        };
      case 1:
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: Clock,
          text: "Đã nộp",
        };
      case 2:
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: CheckCircle,
          text: "Được chấp nhận",
        };
      case 3:
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: XCircle,
          text: "Bị từ chối",
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
      return "Ngày không hợp lệ";
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.programTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentPhone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetailModal = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedApplication(null);
  };

  // Handlers for viewing images and documents
  const handleViewImage = (imageUrl) => {
    setShowImageModal(true);
  };

  const handleViewDocument = (documentUrl, index) => {
    setSelectedDocument({
      url: documentUrl,
      title: `Tài liệu hỗ trợ ${index + 1}`,
    });
    setShowDocumentModal(true);
  };

  // Check if application can be edited (only submitted applications can be approved/rejected)
  const canChangeStatus = (status) => {
    return status === 1; // Only "Đã nộp" applications can be approved/rejected
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <AdminConsultantLayout
        menuItems={adminMenuItems}
        userRole="Admin"
        panelTitle="Admin Panel"
      >
        <div className="space-y-6">
          {/* Search and Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hồ sơ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Tổng: {applications.length} hồ sơ</span>
                <span>
                  Đã nộp:{" "}
                  {applications.filter((app) => app.status === 1).length}
                </span>
                <span>
                  Đã duyệt:{" "}
                  {applications.filter((app) => app.status === 2).length}
                </span>
                <span>
                  Từ chối:{" "}
                  {applications.filter((app) => app.status === 3).length}
                </span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Danh sách hồ sơ xét tuyển
              </h2>
              <button
                onClick={fetchApplications}
                disabled={loading}
                className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Làm mới</span>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Đang tải...</span>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <FileText className="h-12 w-12 mb-4" />
                <p>Không có hồ sơ nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sinh viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chương trình
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày nộp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => {
                      const statusDisplay = getStatusDisplay(
                        application.status
                      );
                      const StatusIcon = statusDisplay.icon;
                      const isUpdating = statusUpdating[application.id];
                      const canEdit = canChangeStatus(application.status);

                      return (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {application.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.studentPhone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {application.programTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {application.programId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusDisplay.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(application.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openDetailModal(application)}
                                className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Xem
                              </button>

                              {/* Approve/Reject buttons - only show for submitted applications */}
                              {canEdit && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApprove(application.id)
                                    }
                                    disabled={isUpdating}
                                    className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUpdating ? (
                                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                    )}
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => handleReject(application.id)}
                                    disabled={isUpdating}
                                    className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUpdating ? (
                                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <ThumbsDown className="h-4 w-4 mr-1" />
                                    )}
                                    Từ chối
                                  </button>
                                </>
                              )}
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

        {/* Detail Modal */}
        {showDetailModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chi tiết hồ sơ xét tuyển
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: {selectedApplication.id}
                  </p>
                  <div className="mt-2">
                    {(() => {
                      const statusDisplay = getStatusDisplay(
                        selectedApplication.status
                      );
                      const StatusIcon = statusDisplay.icon;
                      return (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
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
                      Họ và tên
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.studentName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.studentPhone}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chương trình đào tạo
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedApplication.programTitle}
                  </p>
                </div>

                {selectedApplication.portfolioLink && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Portfolio
                    </label>
                    <a
                      href={selectedApplication.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {selectedApplication.portfolioLink}
                    </a>
                  </div>
                )}

                {selectedApplication.otherLink && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Liên kết khác
                    </label>
                    <a
                      href={selectedApplication.otherLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {selectedApplication.otherLink}
                    </a>
                  </div>
                )}

                {selectedApplication.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ghi chú
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.message}
                    </p>
                  </div>
                )}

                {/* Ảnh hồ sơ */}
                {selectedApplication.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ảnh hồ sơ
                    </label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <div className="relative inline-block">
                        <img
                          src={selectedApplication.imageUrl}
                          alt="Ảnh hồ sơ"
                          className="max-w-xs h-auto rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            handleViewImage(selectedApplication.imageUrl)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tài liệu đính kèm */}
                {selectedApplication.documentUrls &&
                  selectedApplication.documentUrls.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tài liệu đính kèm
                      </label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-3">
                          {selectedApplication.documentUrls.map(
                            (url, index) => (
                              <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all duration-200 group overflow-hidden"
                              >
                                <a
                                  href={url}
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
                            )
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Các tài liệu hỗ trợ như bằng cấp, chứng chỉ, v.v.
                          (PDF, DOC, DOCX)
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </AdminConsultantLayout>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={selectedApplication?.imageUrl}
        title="Ảnh hồ sơ"
      />

      {/* Document Modal */}
      <DocumentModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documentUrl={selectedDocument?.url}
        title={selectedDocument?.title}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </>
  );
};

export default ApplicationManagement;
