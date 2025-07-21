import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  X,
  Tag,
} from "lucide-react";

const StudentContactContent = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user && user.id ? user : null;
    } catch {
      return null;
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = getCurrentUser();
      console.log("User ID:", user?.id); // Debug user ID
      if (!user || !user.id) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(
        `https://localhost:7013/api/Appointment/consultant/${user.id}`,
        { headers }
      );

      console.log("API Response:", response.data); // Debug API response

      const appointmentsData = response.data; // Adjusted to match response structure
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      let errorMessage = "Có lỗi không xác định xảy ra";

      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error;

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
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Timeout: Yêu cầu mất quá nhiều thời gian";
      } else {
        errorMessage = err.message || "Có lỗi không xác định xảy ra";
      }

      setError(errorMessage);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    console.log("Appointments State:", appointments); // Debug state
  }, [appointments]);

  const updateAppointmentStatus = async (appointmentId, status) => {
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
        `https://localhost:7013/api/Appointment/${appointmentId}/status`,
        { status: status },
        { headers }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status } : appointment
        )
      );

      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      let errorMessage = "Có lỗi khi cập nhật trạng thái";

      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error;

        switch (status) {
          case 401:
            errorMessage = "Bạn cần đăng nhập để thực hiện thao tác này";
            break;
          case 403:
            errorMessage = "Bạn không có quyền cập nhật trạng thái";
            break;
          case 404:
            errorMessage = "Không tìm thấy lịch hẹn";
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

  const getStatusDisplay = (status) => {
    switch (status) {
      case 0: // Pending
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: AlertCircle,
          text: "Chờ xử lý",
        };
      case 1: // Confirmed
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: Clock,
          text: "Đã xác nhận",
        };
      case 2: // Completed
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
          text: "Lên lịch lại",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: AlertCircle,
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

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setNewStatus(null);
  };

  const AppointmentDetailModal = () => {
    if (!selectedAppointment) return null;

    const statusDisplay = getStatusDisplay(selectedAppointment.status);
    const StatusIcon = statusDisplay.icon;

    const statusFlow = {
      0: [1, 3], // Pending → Confirmed or Cancelled
      1: [2, 3], // Confirmed → Completed or Cancelled
      2: [], // Completed → no change allowed
      3: [], // Cancelled → no change allowed
    };

    const statusLabels = {
      0: "Chờ xử lý",
      1: "Đã xác nhận",
      2: "Hoàn thành",
      3: "Đã hủy",
    };

    const canChangeStatus = statusFlow[selectedAppointment.status].length > 0;

    const statusOptions = statusFlow[selectedAppointment.status].map((value) => ({
      value,
      label: statusLabels[value],
    }));

    const handleStatusChange = async () => {
      if (newStatus !== selectedAppointment.status) {
        await updateAppointmentStatus(selectedAppointment.id, newStatus);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Chi tiết lịch hẹn
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
                  <p className="text-sm text-gray-500">ID Lịch hẹn</p>
                  <p className="font-semibold text-gray-800">
                    {appointments.findIndex(
                      (appointment) => appointment.id === selectedAppointment.id
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
                    {selectedAppointment.studentName || "N/A"}
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
                    {selectedAppointment.consultantName || (
                      <span className="text-gray-500 italic">Chưa phân công</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                  <Calendar size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(selectedAppointment.create_at)}
                  </p>
                </div>
              </div>

              {selectedAppointment.update_at && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                    <Calendar size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedAppointment.update_at)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                  <Tag size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">
                    {selectedAppointment.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <Tag size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vị trí hàng đợi</p>
                  <p className="font-semibold text-gray-800">
                    {selectedAppointment.queuePosition || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 text-sm">
                Cập nhật trạng thái
              </h4>

              {canChangeStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(Number(e.target.value))}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={statusUpdating}
                    >
                      <option value={selectedAppointment.status}>
                        {statusLabels[selectedAppointment.status]} (Hiện tại)
                      </option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleStatusChange}
                      disabled={statusUpdating || newStatus === selectedAppointment.status}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[100px]"
                    >
                      {statusUpdating ? (
                        <div className="flex items-center justify-center">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          Đang cập nhật
                        </div>
                      ) : (
                        "Cập nhật"
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">Gợi ý:</span> Chọn trạng thái mới và nhấn "Cập nhật" để thay đổi
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center text-gray-600">
                    <XCircle size={14} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Lịch hẹn đã được{" "}
                      <span className="font-medium">{statusDisplay.text.toLowerCase()}</span>, không thể chỉnh sửa
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <XCircle
                      size={14}
                      className="text-red-600 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-red-700 font-medium text-sm">Lỗi cập nhật</p>
                      <p className="text-red-600 text-xs mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Phiếu liên hệ sinh viên</h2>
        <button
          onClick={fetchAppointments}
          disabled={loading}
          className="cursor-pointer flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
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
              onClick={fetchAppointments}
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
          <span className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</span>
        </div>
      ) : (
        <>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {error ? "Không thể tải dữ liệu" : "Không có lịch hẹn nào"}
              </p>
              {!error && (
                <p className="text-gray-400 text-sm">
                  Các lịch hẹn từ sinh viên sẽ hiển thị tại đây
                </p>
              )}
            </div>
          ) : (
            <>
              {console.log("Rendering appointments:", appointments)}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Tổng số lịch hẹn:{" "}
                  <span className="font-semibold text-blue-600">{appointments.length}</span>
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
                        Sinh viên
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Tư vấn viên
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Trạng thái
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Số điện thoại
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
                    {appointments.map((appointment, index) => {
                      const statusDisplay = getStatusDisplay(appointment.status);
                      const StatusIcon = statusDisplay.icon;

                      return (
                        <tr
                          key={appointment.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium">
                            {index + 1}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                            {(appointment.studentName || appointment.student?.name) || "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                            {appointment.consultantName || (
                              <span className="text-gray-500 italic">Chưa phân công</span>
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
                            {appointment.phone}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                            {formatDate(appointment.create_at)}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            <button
                              className="cursor-pointer flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              onClick={() => handleViewAppointment(appointment)}
                            >
                              <Calendar size={14} className="mr-1" />
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

      {showModal && <AppointmentDetailModal />}
    </div>
  );
};

export default StudentContactContent;