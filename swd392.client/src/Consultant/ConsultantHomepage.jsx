import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HelpCircle,
  Phone,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  X,
  User,
  Calendar as CalendarIcon,
  Tag,
  MessageCircle,
} from "lucide-react";
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";

const ConsultantHomepage = () => {
  const [activePage, setActivePage] = useState("student-support");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  const supportItems = [
    {
      id: "student-support",
      name: "Phiếu hỗ trợ SV",
      icon: HelpCircle,
      description: "Xử lý yêu cầu hỗ trợ",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      active: activePage === "student-support",
      onClick: () => setActivePage("student-support"),
      className: "cursor-pointer",
    },
    {
      id: "student-contact",
      name: "Phiếu liên hệ SV",
      icon: Phone,
      description: "Quản lý liên hệ sinh viên",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      active: activePage === "student-contact",
      onClick: () => setActivePage("student-contact"),
      className: "cursor-pointer",
    },
  ];

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get("https://localhost:7013/api/Ticket/consultant/assigned", {
        headers,
      });

      const responseData = response.data || {};
      const ticketsData = responseData.data || [];

      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (err) {
      let errorMessage = "Có lỗi không xác định xảy ra";

      if (err.response) {
        const status = err.response.status;
        const serverMessage =
          err.response.data?.message || err.response.data?.error;

        switch (status) {
          case 401:
            errorMessage = "Bạn cần đăng nhập để xem dữ liệu";
            break;
          case 403:
            errorMessage = "Bạn không có quyền truy cập dữ liệu này";
            break;
          case 404:
            errorMessage = "Không tìm thấy dữ liệu";
            break;
          case 500:
            errorMessage = "Lỗi server. Vui lòng thử lại sau";
            break;
          default:
            errorMessage = serverMessage || `Lỗi server (${status})`;
        }
      } else if (err.request) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Timeout: Yêu cầu mất quá nhiều thời gian";
      } else {
        errorMessage = err.message || "Có lỗi không xác định xảy ra";
      }

      setError(errorMessage);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    setStatusUpdating(true);
    setError(null);

    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await axios.put(
        `https://localhost:7013/api/Ticket/${ticketId}/status/update`,
        { status },
        { headers }
      );

      // Update the ticket in the local state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );

      // Update selected ticket if it's the one being modified
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      let errorMessage = "Có lỗi khi cập nhật trạng thái";

      if (err.response) {
        const status = err.response.status;
        const serverMessage =
          err.response.data?.message || err.response.data?.error;

        switch (status) {
          case 401:
            errorMessage = "Bạn cần đăng nhập để thực hiện thao tác này";
            break;
          case 403:
            errorMessage = "Bạn không có quyền cập nhật trạng thái";
            break;
          case 404:
            errorMessage = "Không tìm thấy phiếu hỗ trợ";
            break;
          case 400:
            errorMessage = serverMessage || "Dữ liệu không hợp lệ";
            break;
          default:
            errorMessage = serverMessage || "Lỗi server";
        }
      } else if (err.request) {
        errorMessage = "Không thể kết nối đến server";
      }

      setError(errorMessage);
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    if (activePage === "student-support") {
      fetchTickets();
    }
  }, [activePage]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 0:
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: AlertCircle,
          text: "Chờ xử lý",
        };
      case 1:
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: Clock,
          text: "Đang xử lý",
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
      console.error("Error formatting date:", error);
      return "Ngày không hợp lệ";
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setNewStatus(null);
  };

  const TicketDetailModal = () => {
    if (!selectedTicket) return null;

    const statusDisplay = getStatusDisplay(selectedTicket.status);
    const StatusIcon = statusDisplay.icon;

 const statusFlow = {
  0: [1],       // From "Chờ xử lý" → "Đang xử lý"
  1: [2, 3],    // From "Đang xử lý" → "Hoàn thành" or "Đã hủy"
  2: [],        // From "Hoàn thành" → no change allowed
  3: [],        // From "Đã hủy" → no change allowed
};

const statusLabels = {
  0: "Chờ xử lý",
  1: "Đang xử lý",
  2: "Hoàn thành",
  3: "Đã hủy",
};

// Only allow forward transitions based on current status
const statusOptions = statusFlow[selectedTicket.status].map((value) => ({
  value,
  label: statusLabels[value],
}));
    const handleStatusChange = async () => {
      if (newStatus !== selectedTicket.status) {
        await updateTicketStatus(selectedTicket.id, newStatus);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Chi tiết phiếu hỗ trợ
            </h3>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500 cursor-pointer" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <Tag size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID Phiếu</p>
                  <p className="font-semibold text-gray-800">
                    {tickets.findIndex(
                      (ticket) => ticket.id === selectedTicket.id
                    ) + 1}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                  <StatusIcon size={20} className={statusDisplay.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                  >
                    <StatusIcon size={12} className="mr-1" />
                    {statusDisplay.text}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <User size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sinh viên</p>
                  <p className="font-semibold text-gray-800">
                    {selectedTicket.studentName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                  <User size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tư vấn viên</p>
                  <p className="font-semibold text-gray-800">
                    {selectedTicket.consultantName || (
                      <span className="text-gray-500 italic">
                        Chưa phân công
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                  <CalendarIcon size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
              </div>

              {selectedTicket.updatedAt && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 tap-10 bg-indigo-100 rounded-lg">
                    <CalendarIcon size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedTicket.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-gray-600" />
                <h4 className="font-semibold text-gray-800">Tiêu đề</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">
                  {selectedTicket.subject || "Không có tiêu đề"}
                </p>
              </div>
            </div>

            {selectedTicket.question && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <HelpCircle size={16} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-800">
                    Nội dung câu hỏi
                  </h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedTicket.question}
                  </p>
                </div>
              </div>
            )}

            {selectedTicket.answer && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <h4 className="font-semibold text-gray-800">Câu trả lời</h4>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedTicket.answer}
                  </p>
                </div>
              </div>
            )}

            {selectedTicket.priority && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Độ ưu tiên</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedTicket.priority}</p>
                </div>
              </div>
            )}

            {selectedTicket.category && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Danh mục</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedTicket.category}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Cập nhật trạng thái</h4>
              <div className="flex items-center space-x-4">
<select
  value={newStatus}
  onChange={(e) => setNewStatus(Number(e.target.value))}
  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
  disabled={statusUpdating || statusOptions.length === 0}
>
  {statusOptions.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>

                <button
                  onClick={handleStatusChange}
                  disabled={statusUpdating || newStatus === selectedTicket.status}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {statusUpdating ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={closeModal}
              className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StudentSupportContent = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Phiếu hỗ trợ sinh viên
        </h2>
        <button
          onClick={fetchTickets}
          disabled={loading}
          className="cursor-pointer flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle size={20} className="text-red-600 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-red-700 font-medium">Lỗi tải dữ liệu:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchTickets}
              className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
            >
              Thử lại
            </button>
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
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {error ? "Không thể tải dữ liệu" : "Không có phiếu hỗ trợ nào"}
              </p>
              {!error && (
                <p className="text-gray-400 text-sm">
                  Các phiếu hỗ trợ từ sinh viên sẽ hiển thị tại đây
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Tổng số phiếu:{" "}
                  <span className="font-semibold text-blue-600">
                    {tickets.length}
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
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        STT
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Tiêu đề
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Sinh viên
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Tư vấn viên
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Trạng thái
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
                    {tickets.map((ticket, index) => {
                      const statusDisplay = getStatusDisplay(ticket.status);
                      const StatusIcon = statusDisplay.icon;

                      return (
                        <tr
                          key={ticket.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium">
                            {index + 1}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            <div className="max-w-xs">
                              <p
                                className="text-sm font-medium text-gray-900 truncate"
                                title={ticket.subject}
                              >
                                {ticket.subject || "Không có tiêu đề"}
                              </p>
                              {ticket.question && (
                                <p
                                  className="text-xs text-gray-500 mt-1 truncate"
                                  title={ticket.question}
                                >
                                  {ticket.question}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                            {ticket.studentName || "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                            {ticket.consultantName || (
                              <span className="text-gray-500 italic">
                                Chưa phân công
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                            >
                              <StatusIcon size={12} className="mr-1" />
                              {statusDisplay.text}
                            </span>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                            {formatDate(ticket.createdAt)}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            <button
                              className="cursor-pointer flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              <Eye size={14} className="mr-1" />
                              Xem
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {showModal && <TicketDetailModal />}
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case "students":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Quản lý sinh viên</h2>
            <p>Nội dung quản lý sinh viên sẽ được triển khai ở đây...</p>
          </div>
        );
      case "programs":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Chương trình học</h2>
            <p>Nội dung chương trình học sẽ được triển khai ở đây...</p>
          </div>
        );
      case "appointments":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Lịch hẹn</h2>
            <p>Nội dung quản lý lịch hẹn sẽ được triển khai ở đây...</p>
          </div>
        );
      case "reports":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Báo cáo</h2>
            <p>Nội dung báo cáo sẽ được triển khai ở đây...</p>
          </div>
        );
      case "messages":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Tin nhắn</h2>
            <p>Nội dung tin nhắn sẽ được triển khai ở đây...</p>
          </div>
        );
      case "student-support":
        return <StudentSupportContent />;
      case "student-contact":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Phiếu liên hệ sinh viên
            </h2>
            <p>
              Nội dung quản lý liên hệ sinh viên sẽ được triển khai ở đây...
            </p>
          </div>
        );
      default:
        return <ConsultantHomepage />;
    }
  };

  return (
    <AdminConsultantLayout
      supportItems={supportItems}
      userRole="Consultant"
      panelTitle="Consultant Panel"
    >
      {renderContent()}
    </ AdminConsultantLayout>
  );
};

export default ConsultantHomepage;