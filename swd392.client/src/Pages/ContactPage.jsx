import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const provinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bạc Liêu",
    "Bắc Kạn",
    "Bắc Giang",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Dương",
    "Bình Định",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Cần Thơ",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Đồng Nai",
    "Đồng Tháp",
    "Điện Biên",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hoà Bình",
    "Hậu Giang",
    "Hưng Yên",
    "TP. Hồ Chí Minh",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lào Cai",
    "Lạng Sơn",
    "Lâm Đồng",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên - Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

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

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate province
    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    }

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Tiêu đề không được vượt quá 100 ký tự";
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
      fullName: "",
      phone: "",
      email: "",
      province: "",
      title: "",
      content: "",
    });
    setErrors({});
  };

  const showAlert = (type, title, message) => {
    setAlert({ type, title, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showAlert(
        "error",
        "Lỗi xác thực",
        "Vui lòng kiểm tra lại thông tin đã nhập"
      );
      return;
    }

    console.log("Form data:", formData);

    showAlert(
      "success",
      "Thành công!",
      "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn sớm nhất."
    );
    resetForm();
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

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Đăng ký tư vấn
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
              <p className="text-gray-600 mt-4">
                Để lại thông tin để được tư vấn miễn phí
              </p>
            </div>

            <div className="space-y-6">
              {/* <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#F2711F]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Nhập họ tên của bạn"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#F2711F]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#F2711F]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tỉnh / thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded border ${errors.province ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#F2711F]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                >
                  <option value="">Chọn tỉnh / thành phố</option>
                  {provinces.map((province, index) => (
                    <option key={index} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {errors.province}
                  </p>
                )}
              </div> */}
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
                  className={`w-full px-4 py-3 rounded border ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#F2711F]"
                  } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Nhập tiêu đề nội dung cần tư vấn"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {errors.title}
                  </p>
                )}
                {/* <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.title.length} / 100 ký tự
                </div> */}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nội dung
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  maxLength={10000}
                  rows={4}
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F2711F] focus:border-transparent transition-all duration-200 resize-vertical"
                  placeholder="Nhập nội dung cần tư vấn..."
                ></textarea>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.content.length} / 10000 ký tự
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="cursor-pointer w-full bg-[#E0601A] text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transform hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Send size={20} />
                <span>Gửi đăng ký</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
