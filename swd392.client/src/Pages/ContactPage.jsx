import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import axios from "axios";

const ContactPage = () => {
  // State for tab switching
  const [activeTab, setActiveTab] = useState("ticket");

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
  });

  const [appointmentData, setAppointmentData] = useState({
    studentName: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [appointmentErrors, setAppointmentErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false); // Added for payment redirect

  const campuses = [
    {
      city: "HÀ NỘI",
      address:
        "Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, H. Thạch Thất, TP. Hà Nội",
      phone: "(024) 7300 5588",
      email: "tuyensinh.hanoi@fpt.edu.vn",
    },
    {
      city: "TP. HỒ CHÍ MINH",
      address:
        "Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh",
      phone: "(028) 7300 5588",
      email: "daihoc.hcm@fpt.edu.vn",
    },
    {
      city: "ĐÀ NẴNG",
      address:
        "Khu đô thị công nghệ FPT Đà Nẵng, P. Hoà Hải, Q. Ngũ Hành Sơn, TP. Đà Nẵng",
      phone: "(0236) 730 0999",
      email: "dnuni@fe.edu.vn",
    },
    {
      city: "CẦN THƠ",
      address:
        "Số 600 Đường Nguyễn Văn Cừ (nối dài), P. An Bình, Q. Ninh Kiều, TP. Cần Thơ",
      phone: "(0292) 730 3636",
      email: "fptu.cantho@fe.edu.vn",
    },
    {
      city: "QUY NHƠN",
      address:
        "Khu đô thị mới An Phú Thịnh, Phường Nhơn Bình & Phường Đống Đa, TP. Quy Nhơn, Bình Định",
      phone: "(0256) 7300 999",
      email: "qnuni@fe.edu.vn",
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Tiêu đề không được vượt quá 100 ký tự";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Nội dung là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAppointmentForm = () => {
    const newErrors = {};

    if (!appointmentData.studentName.trim()) {
      newErrors.studentName = "Họ và tên là bắt buộc";
    } else if (appointmentData.studentName.trim().length < 2) {
      newErrors.studentName = "Họ và tên phải có ít nhất 2 ký tự";
    } else if (appointmentData.studentName.trim().length > 100) {
      newErrors.studentName = "Họ và tên không được vượt quá 100 ký tự";
    }

    if (!appointmentData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10}$/.test(appointmentData.phone.trim())) {
      newErrors.phone = "Số điện thoại phải có đúng 10 chữ số";
    }

    setAppointmentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "");
      if (phoneValue.length <= 10) {
        setAppointmentData((prev) => ({
          ...prev,
          [name]: phoneValue,
        }));
      }
    } else {
      setAppointmentData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (appointmentErrors[name]) {
      setAppointmentErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
    });
    setErrors({});
  };

  const resetAppointmentForm = () => {
    setAppointmentData({
      studentName: "",
      phone: "",
    });
    setAppointmentErrors({});
  };

  const showAlert = (type, title, message) => {
    setAlert({ type, title, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const createTicket = async (ticketData) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Bạn cần đăng nhập để tạo ticket");
      }

      const response = await axios.post(
        "https://localhost:7013/api/Ticket/create",
        {
          subject: ticketData.title,
          message: ticketData.subject,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi tạo ticket";
        const errors = error.response.data?.errors;

        if (errors && Array.isArray(errors)) {
          throw new Error(errors.join(", "));
        }

        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        throw new Error(error.message || "Có lỗi không xác định xảy ra");
      }
    }
  };

  const bookAppointment = async (bookingData) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Bạn cần đăng nhập để đặt lịch hẹn");
      }

      const response = await axios.post(
        "https://localhost:7013/api/Appointment/book",
        {
          studentName: bookingData.studentName,
          phone: bookingData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Appointment API Error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi đặt lịch hẹn";
        const errors = error.response.data?.errors;

        if (errors && Array.isArray(errors)) {
          throw new Error(errors.join(", "));
        }

        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        throw new Error(error.message || "Có lỗi không xác định xảy ra");
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showAlert(
        "error",
        "Lỗi xác thực",
        "Vui lòng kiểm tra lại thông tin đã nhập"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createTicket(formData);

      console.log("API Response:", result);

      showAlert(
        "success",
        "Thành công!",
        "Ticket đã được tạo thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất."
      );

      resetForm();
    } catch (error) {
      console.error("Submit Error:", error);

      showAlert("error", "Lỗi tạo ticket", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!validateAppointmentForm()) {
      showAlert(
        "error",
        "Lỗi xác thực",
        "Vui lòng kiểm tra lại thông tin đã nhập"
      );
      return;
    }

    setIsBookingAppointment(true);

    try {
      const result = await bookAppointment(appointmentData);
      console.log("Appointment API Response:", result);

      if (result.appointmentId && result.paymentUrl) {
        setPaymentLoading(true);
        localStorage.setItem(
          "pendingAppointment",
          JSON.stringify({
            appointmentId: result.appointmentId,
            studentName: appointmentData.studentName,
            phone: appointmentData.phone,
            consultantId: result.consultantId,
            consultantName: result.consultantName,
            consultantEmail: result.consultantEmail,
          })
        );
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.messsage || "Không thể tạo lịch hẹn hoặc link thanh toán");
      }
    } catch (error) {
      console.error("Appointment Submit Error:", error);
      showAlert("error", "Lỗi đặt lịch hẹn", error.message);
    } finally {
      setIsBookingAppointment(false);
      setPaymentLoading(false);
    }
  };

  const renderTicketTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Đăng ký tư vấn
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-4">
          Để lại thông tin để được hỗ trợ miễn phí
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-orange-500"
            } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder="Nhập tiêu đề nội dung cần hỗ trợ"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            maxLength={10000}
            rows={4}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.subject
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-orange-500"
            } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder="Nhập nội dung cần hỗ trợ..."
          ></textarea>
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {errors.subject}
            </p>
          )}
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.subject.length} / 10000 ký tự
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="cursor-pointer w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transform hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
          <span>{isSubmitting ? "Đang gửi..." : "Gửi ticket"}</span>
        </button>
      </div>
    </div>
  );

  const renderAppointmentTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Đặt lịch hẹn tư vấn
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-4">
          Đặt lịch hẹn trực tiếp với tư vấn viên
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="studentName"
              value={appointmentData.studentName}
              onChange={handleAppointmentInputChange}
              maxLength={100}
              disabled={isBookingAppointment || paymentLoading}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                appointmentErrors.studentName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          {appointmentErrors.studentName && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {appointmentErrors.studentName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="tel"
              name="phone"
              value={appointmentData.phone}
              onChange={handleAppointmentInputChange}
              maxLength={10}
              disabled={isBookingAppointment || paymentLoading}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                appointmentErrors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Nhập số điện thoại (VD: 0901234567)"
            />
          </div>
          {appointmentErrors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {appointmentErrors.phone}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Số điện thoại phải có đúng 10 chữ số
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2">
            Thông tin thanh toán:
          </h4>
          <div className="text-sm text-orange-800 space-y-1">
            <p>
              • Phí tư vấn: <span className="font-semibold">100,000 VND</span>
            </p>
            <p>• Thanh toán qua VNPay an toàn và bảo mật</p>
            <p> • Sau khi thanh toán thành công, chúng tôi sẽ liên hệ xác nhận lịch hẹn</p>
          </div>
        </div>

        <button
          onClick={handleAppointmentSubmit}
          disabled={isBookingAppointment || paymentLoading}
          className="cursor-pointer w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transform hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isBookingAppointment || paymentLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Calendar size={20} />
          )}
          <span>
            {isBookingAppointment
              ? "Đang đặt lịch..."
              : paymentLoading
              ? "Đang chuyển đến thanh toán..."
              : "Đặt lịch và thanh toán"}
          </span>
        </button>
      </div>
    </div>
  );

  const AlertComponent = ({ alert, onClose }) => {
    if (!alert) return null;

    const alertStyles = {
      success: {
        bg: "bg-green-50 border-green-200",
        icon: CheckCircle,
        iconColor: "text-green-600",
        textColor: "text-green-800",
        titleColor: "text-green-900",
      },
      error: {
        bg: "bg-red-50 border-red-200",
        icon: AlertTriangle,
        iconColor: "text-red-600",
        textColor: "text-red-800",
        titleColor: "text-red-900",
      },
    };

    const style = alertStyles[alert.type];
    const IconComponent = style.icon;

    return (
      <div
        className={`fixed top-4 right-4 z-50 max-w-sm w-full ${style.bg} border rounded-lg shadow-lg p-4 transition-all duration-300 animate-in slide-in-from-top-2`}
      >
        <div className="flex items-start">
          <IconComponent
            className={`${style.iconColor} flex-shrink-0 mr-3 mt-0.5`}
            size={20}
          />
          <div className="flex-1">
            <h3 className={`font-semibold ${style.titleColor} text-sm`}>
              {alert.title}
            </h3>
            <p className={`${style.textColor} text-sm mt-1`}>{alert.message}</p>
          </div>
          <button
            onClick={onClose}
            className={`${style.textColor} hover:opacity-70 ml-2 flex-shrink-0`}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <AlertComponent alert={alert} onClose={() => setAlert(null)} />

      <div className="relative h-90 overflow-hidden">
        <img
          src="https://cdnphoto.dantri.com.vn/bc3uX5ERqIeMwAf685OpDrEGHQM=/thumb_w/1360/2024/07/19/tcbc-truong-dh-fpt-cong-bo-diem-chuan-xet-tuyen-anh-2-1721359772279.jpg"
          alt="Trường Đại học FPT"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            LIÊN HỆ
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Thông tin các Campus
            </h2>
            <div
              className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"
              style={{
                background: "linear-gradient(to right, #E0601A, #E0601A)",
              }}
            ></div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-6 mb-6">
              {campuses.slice(0, 3).map((campus, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4"
                  style={{ borderColor: "#E0601A" }}
                >
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4 text-center"
                    style={{ color: "#E0601A" }}
                  >
                    {campus.city}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin
                        className="mt-1 flex-shrink-0"
                        style={{ color: "#E0601A" }}
                        size={16}
                      />
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {campus.address}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone
                        className="text-blue-500 flex-shrink-0"
                        size={16}
                      />
                      <p className="text-gray-700 font-medium text-sm">
                        {campus.phone}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail
                        className="text-green-500 flex-shrink-0"
                        size={16}
                      />
                      <p className="text-gray-700 text-sm">{campus.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
              {campuses.slice(3).map((campus, index) => (
                <div
                  key={index + 3}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4"
                  style={{ borderColor: "#E0601A" }}
                >
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4 text-center"
                    style={{ color: "#E0601A" }}
                  >
                    {campus.city}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin
                        className="mt-1 flex-shrink-0"
                        style={{ color: "#E0601A" }}
                        size={16}
                      />
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {campus.address}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone
                        className="text-blue-500 flex-shrink-0"
                        size={16}
                      />
                      <p className="text-gray-700 font-medium text-sm">
                        {campus.phone}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail
                        className="text-green-500 flex-shrink-0"
                        size={16}
                      />
                      <p className="text-gray-700 text-sm">{campus.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden space-y-6">
            {campuses.map((campus, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4"
                style={{ borderColor: "#E0601A" }}
              >
                <h3
                  className="text-xl font-bold text-gray-800 mb-4 text-center"
                  style={{ color: "#E0601A" }}
                >
                  {campus.city}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin
                      className="mt-1 flex-shrink-0"
                      style={{ color: "#E0601A" }}
                      size={18}
                    />
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {campus.address}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="text-blue-500 flex-shrink-0" size={18} />
                    <p className="text-gray-700 font-medium">{campus.phone}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="text-green-500 flex-shrink-0" size={18} />
                    <p className="text-gray-700">{campus.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Liên hệ và hỗ trợ
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">
            Chọn hình thức liên hệ phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-8 p-2 max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("ticket")}
              className={`cursor-pointer flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === "ticket"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <MessageSquare size={16} className="mr-2" />
              Gửi yêu cầu hỗ trợ
            </button>
            <button
              onClick={() => setActiveTab("appointment")}
              className={`cursor-pointer flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === "appointment"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Calendar size={16} className="mr-2" />
              Đặt lịch hẹn tư vấn
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto ">
          {activeTab === "ticket" ? renderTicketTab() : renderAppointmentTab()}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;