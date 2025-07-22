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
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";
import Toast from "../Components/Toast";

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
    active: true,
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

const TicketAssignmentPage = () => {
  const [tickets, setTickets] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState(null);

  // Toast functions
  const showToast = (message, type = 'success') => {
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

  // Fetch all tickets
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://localhost:7013/api/Ticket", {
        headers: getAuthHeaders(),
      });

      const responseData = response.data || {};
      const ticketsData = responseData.data || [];
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (err) {
      handleApiError(err, "Có lỗi khi tải danh sách ticket");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available consultants
  const fetchConsultants = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7013/api/Ticket/consultants-available",
        { headers: getAuthHeaders() }
      );

      const responseData = response.data || {};
      const consultantsData = responseData.data || [];
      setConsultants(Array.isArray(consultantsData) ? consultantsData : []);
    } catch (err) {
      handleApiError(err, "Có lỗi khi tải danh sách consultant");
    }
  };

  // Assign ticket to consultant
  const assignTicket = async (ticketId, consultantId) => {
    setAssignLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `https://localhost:7013/api/Ticket/${ticketId}/assign`,
        { consultantId },
        { headers: getAuthHeaders() }
      );

      const responseData = response.data || {};
      const updatedTicket = responseData.data;

      // Update ticket in local state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...updatedTicket } : ticket
        )
      );

      setShowAssignModal(false);
      setSelectedTicket(null);

      // Show success toast
      const assignedConsultant = consultants.find(c => c.id === consultantId);
      showToast(`Đã giao ticket "${selectedTicket?.subject}" cho ${assignedConsultant?.name} thành công!`, 'success');
    } catch (err) {
      handleApiError(err, "Có lỗi khi giao ticket");
    } finally {
      setAssignLoading(false);
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
    showToast(errorMessage, 'error'); // Show error toast
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
          icon: UserCheck,
          text: "Đã giao",
        };
      case 2:
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: CheckCircle,
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
      return "Ngày không hợp lệ";
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.consultantName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAssignModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedTicket(null);
  };

  useEffect(() => {
    fetchTickets();
    fetchConsultants();
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
                placeholder="Tìm kiếm ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Tổng: {tickets.length} tickets</span>
              <span>Consultant khả dụng: {consultants.length}</span>
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

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 ">
              Danh sách tickets
            </h2>
            <button
              onClick={() => {
                fetchTickets();
                fetchConsultants();
              }}
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
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <FileText className="h-12 w-12 mb-4" />
              <p>Không có ticket nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sinh viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consultant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => {
                    const statusDisplay = getStatusDisplay(ticket.status);
                    const StatusIcon = statusDisplay.icon;

                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.subject}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {ticket.question}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ticket.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ticket.studentEmail}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ticket.consultantName || "Chưa giao"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.status === 0 && (
                            <button
                              onClick={() => openAssignModal(ticket)}
                              className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Giao
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

      {/* Assign Modal */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Giao ticket cho consultant
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Ticket: {selectedTicket.subject}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn consultant:
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {consultants.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      Không có consultant khả dụng
                    </p>
                  ) : (
                    consultants.map((consultant) => (
                      <button
                        key={consultant.id}
                        onClick={() =>
                          assignTicket(selectedTicket.id, consultant.id)
                        }
                        disabled={assignLoading}
                        className="cursor-pointer w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">
                          {consultant.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {consultant.email}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeAssignModal}
                disabled={assignLoading}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                Hủy
              </button>
            </div>

            {assignLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                <RefreshCw className="h-6 w-6 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Đang giao...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminConsultantLayout>

    {/* Toast Notification */}
    {toast && (
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={hideToast} 
      />
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

export default TicketAssignmentPage;
