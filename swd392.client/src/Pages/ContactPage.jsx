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
} from "lucide-react";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Tiêu đề không được vượt quá 100 ký tự";
    }

    // Validate subject (content)
    if (!formData.subject.trim()) {
      newErrors.subject = "Nội dung là bắt buộc";
    }

    setErrors(newErrors);
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

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
    });
    setErrors({});
  };

  const showAlert = (type, title, message) => {
    setAlert({ type, title, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getAuthToken = () => {
    // Get token from localStorage, sessionStorage, or your auth context
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
          subject: ticketData.title, // Map title to subject
          message: ticketData.subject, // Map subject to message
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
        // Server responded with error status
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi tạo ticket";
        const errors = error.response.data?.errors;

        if (errors && Array.isArray(errors)) {
          throw new Error(errors.join(", "));
        }

        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        // Other error
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
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
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Tạo ticket hỗ trợ
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
                  className={`w-full px-4 py-3 rounded border ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#F2711F]"
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
                  className={`w-full px-4 py-3 rounded border ${
                    errors.subject
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#F2711F]"
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
                className="cursor-pointer w-full bg-[#E0601A] text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transform hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
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
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
