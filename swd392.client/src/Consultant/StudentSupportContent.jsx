import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HelpCircle,
  RefreshCw,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import TicketDetailModal from "./TicketDetailModal";

const StudentSupportContent = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

      const response = await axios.get(
        "https://localhost:7013/api/Ticket/consultant/assigned",
        {
          headers,
        }
      );

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

  useEffect(() => {
    fetchTickets();
  }, []);

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
    setShowModal(true);
  };

  return (
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
                <div className ="text-sm text-gray-600">
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

      {showModal && (
        <TicketDetailModal
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          setShowModal={setShowModal}
          tickets={tickets}
          setTickets={setTickets}
          setError={setError}
        />
      )}
    </div>
  );
};

export default StudentSupportContent;