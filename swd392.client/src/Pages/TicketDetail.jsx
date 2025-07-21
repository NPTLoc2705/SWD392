import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Loader2,
  RefreshCw,
  Star,
  HelpCircle,
  Send,
} from "lucide-react";
import { getCurrentUser } from "../utils/auth";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const currentUser = getCurrentUser();

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://localhost:7013/api/Ticket/${id}/ticket-detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTicket(response.data.data);
        if (response.data.data.feedback) {
          setFeedback(response.data.data.feedback);
        }
      } else {
        setError(response.data.message || "Failed to load ticket");
      }
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching the ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      setSubmittingFeedback(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://localhost:7013/api/Feedback/${ticket.id}`,
        {
          rating: feedbackRating,
          comment: feedbackComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setFeedback(response.data);
        setShowFeedbackForm(false);
        fetchTicket(); // Refresh ticket data to get updated feedback
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 0: // Pending
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: Clock,
          text: "Chờ xử lý",
        };
      case 1: // Assigned
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: AlertCircle,
          text: "Đang xử lý",
        };
      case 2: // Answered
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: CheckCircle2,
          text: "Hoàn thành",
        };
      case 3: // Cancelled
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={32} className="animate-spin text-orange-500 mb-4" />
          <span className="text-gray-600">Đang tải thông tin ticket...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertCircle size={32} className="text-red-500 mb-4" />
          <span className="text-gray-600">{error}</span>
          <button
            onClick={fetchTicket}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <HelpCircle size={32} className="text-gray-500 mb-4" />
          <span className="text-gray-600">Không tìm thấy ticket</span>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(ticket.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại
          </button>
          <button
            onClick={fetchTicket}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <RefreshCw size={18} className="mr-2" />
            Làm mới
          </button>
        </div>

        {/* Ticket Info Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {ticket.subject}
                </h1>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}
                  >
                    <StatusIcon size={16} className="mr-1" />
                    {statusDisplay.text}
                  </span>
                  <span className="ml-3 text-sm text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2 text-gray-700">
                <FileText size={16} className="mr-2" />
                <span className="font-medium">Nội dung ticket:</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {ticket.question}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <User size={16} className="mr-2" />
                  Sinh viên
                </h3>
                <p className="text-gray-800">{ticket.studentName}</p>
                <p className="text-gray-600 text-sm flex items-center">
                  <Mail size={14} className="mr-1" />
                  {ticket.studentEmail}
                </p>
              </div>

              {ticket.consultantName && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <User size={16} className="mr-2" />
                    Tư vấn viên
                  </h3>
                  <p className="text-gray-800">{ticket.consultantName}</p>
                </div>
              )}
            </div>

            {/* Feedback section */}
            {ticket.status === 2 && ( // Only show for answered tickets
              <div className="border-t border-gray-200 pt-4">
                {feedback ? (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Star size={16} className="mr-2" />
                      Đánh giá của bạn
                    </h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`${i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-gray-700">
                        ({feedback.rating}/5)
                      </span>
                    </div>
                    {feedback.comment && (
                      <div className="bg-white rounded p-3 mt-2">
                        <p className="text-gray-800">{feedback.comment}</p>
                      </div>
                    )}
                    {feedback.response && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-blue-700 mb-1">
                          Phản hồi từ tư vấn viên:
                        </h4>
                        <div className="bg-white rounded p-3">
                          <p className="text-gray-800">{feedback.response}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : currentUser?.role === "Student" ? (
                  <div className="bg-orange-50 rounded-lg p-4">
                    {showFeedbackForm ? (
                      <div>
                        <h3 className="font-medium text-orange-800 mb-3">
                          Đánh giá hỗ trợ
                        </h3>
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">
                            Điểm đánh giá (1-5 sao)
                          </label>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setFeedbackRating(rating)}
                                className="mr-2 focus:outline-none"
                              >
                                <Star
                                  size={24}
                                  className={`${rating <= feedbackRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">
                            Nhận xét (không bắt buộc)
                          </label>
                          <textarea
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows="3"
                            placeholder="Nhận xét về chất lượng hỗ trợ..."
                          ></textarea>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSubmitFeedback}
                            disabled={submittingFeedback}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center"
                          >
                            {submittingFeedback && (
                              <Loader2
                                size={18}
                                className="animate-spin mr-2"
                              />
                            )}
                            Gửi đánh giá
                          </button>
                          <button
                            onClick={() => setShowFeedbackForm(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-orange-800 mb-1">
                            Bạn hài lòng với hỗ trợ này?
                          </h3>
                          <p className="text-sm text-orange-700">
                            Hãy gửi đánh giá để giúp chúng tôi cải thiện chất
                            lượng dịch vụ
                          </p>
                        </div>
                        <button
                          onClick={() => setShowFeedbackForm(true)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                          <Star size={16} className="mr-2" />
                          Đánh giá ngay
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;