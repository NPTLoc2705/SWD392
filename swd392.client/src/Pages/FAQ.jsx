import React, { useState, useEffect } from "react";
import { FaQuestionCircle, FaSearch } from "react-icons/fa";
import axios from "axios";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  // Static FAQ data (fallback) thêm vào để sử dụng khi API không khả dụng
  const staticFAQs = [
    {
      id: 1,
      question: "Làm thế nào để đăng ký tư vấn tuyển sinh?",
      answer:
        "Bạn có thể đăng ký tư vấn tuyển sinh thông qua trang Liên hệ của chúng tôi. Chọn tab 'Đặt lịch hẹn tư vấn', điền thông tin cá nhân và chọn thời gian phù hợp. Sau khi đăng ký thành công, tư vấn viên sẽ liên hệ với bạn để xác nhận lịch hẹn.",
    },
    {
      id: 2,
      question: "Điều kiện xét tuyển vào Đại học FPT là gì?",
      answer:
        "Điều kiện xét tuyển bao gồm: Tốt nghiệp THPT hoặc tương đương, có điểm thi THPT quốc gia hoặc điểm học bạ THPT, đáp ứng điểm chuẩn của từng ngành. Ngoài ra, thí sinh có thể xét tuyển bằng chứng chỉ quốc tế, giải thưởng học sinh giỏi, hoặc các thành tích đặc biệt khác.",
    },
    {
      id: 3,
      question: "Học phí tại Đại học FPT là bao nhiêu?",
      answer:
        "Học phí tại FPT University dao động từ 60-90 triệu VND/năm tùy theo ngành học. Nhà trường có nhiều chương trình học bổng và hỗ trợ tài chính cho sinh viên có hoàn cảnh khó khăn hoặc thành tích học tập xuất sắc.",
    },
    {
      id: 4,
      question: "Làm thế nào để tôi có thể theo dõi tiến độ học tập?",
      answer:
        "Sau khi đăng nhập vào hệ thống, bạn có thể truy cập trang 'Hồ sơ cá nhân' để xem chi tiết tiến độ học tập, điểm số, và các thành tích đã đạt được. Hệ thống sẽ cập nhật tự động mỗi khi bạn hoàn thành bài học hoặc bài kiểm tra.",
    },
    {
      id: 5,
      question: "Tôi có thể hủy lịch hẹn tư vấn không?",
      answer:
        "Có, bạn có thể hủy lịch hẹn tư vấn trước 24 giờ so với thời gian đã đặt. Để hủy lịch hẹn, vui lòng liên hệ với tư vấn viên qua email hoặc hotline. Nếu hủy trong vòng 24 giờ, có thể áp dụng phí hủy theo quy định.",
    },
    {
      id: 6,
      question: "Tôi quên mật khẩu, làm sao để đặt lại?",
      answer:
        "Trên trang đăng nhập, nhấp vào 'Quên mật khẩu', nhập email đã đăng ký. Hệ thống sẽ gửi link đặt lại mật khẩu đến email của bạn. Làm theo hướng dẫn trong email để tạo mật khẩu mới.",
    },
    {
      id: 7,
      question: "Làm thế nào để tôi liên hệ với tư vấn viên?",
      answer:
        "Bạn có thể liên hệ với tư vấn viên qua nhiều cách: Gửi yêu cầu hỗ trợ qua trang Liên hệ, gọi hotline, gửi email, hoặc đặt lịch hẹn tư vấn trực tiếp. Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.",
    },
    {
      id: 8,
      question: "Tôi có thể thay đổi thông tin cá nhân không?",
      answer:
        "Có, bạn có thể cập nhật thông tin cá nhân trong trang 'Hồ sơ cá nhân'. Một số thông tin như họ tên, số điện thoại có thể chỉnh sửa trực tiếp. Đối với thông tin quan trọng như email, bạn cần xác thực qua OTP.",
    },
  ];

  const bannerUrl =
    "https://cdnphoto.dantri.com.vn/1SRnDHL-g7E3mCBZc-SI-3PVzNU=/thumb_w/1020/2023/09/08/0609dan-tritcbc-acbsp-202412docx-1694147511600.jpeg";

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);

      try {
        const response = await axios.get("https://localhost:7013/api/FAQ");
        if (response.data && response.data.success) {
          setFaqs(response.data.data || []);
        } else {
          setFaqs(staticFAQs);
        }
      } catch (apiError) {
        console.log("API not available, using static data");
        setFaqs(staticFAQs);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setError("Không thể tải dữ liệu FAQ");
      setFaqs(staticFAQs);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Đang tải câu hỏi thường gặp...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans min-h-screen">
      <section
        className="relative h-[320px] md:h-[420px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${bannerUrl}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 uppercase">
            Câu hỏi thường gặp
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 text-xl" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none bg-white shadow-md hover:shadow-lg transition-all duration-300"
          />
        </div>
        {searchTerm && (
          <p className="mt-4 text-gray-600 text-center">
            Tìm thấy{" "}
            <span className="font-semibold text-orange-600">
              {filteredFAQs.length}
            </span>{" "}
            kết quả cho "{searchTerm}"
          </p>
        )}
      </section>

      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-10 text-center uppercase">
          Câu hỏi thường gặp
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center">
            <FaQuestionCircle className="text-red-400 text-3xl mx-auto mb-2" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {filteredFAQs.length === 0 ? (
          <div className="text-center py-16">
            <FaQuestionCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Không tìm thấy câu hỏi nào
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Thử thay đổi từ khóa tìm kiếm để tìm câu hỏi phù hợp.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-600 transition"
            >
              Xóa tìm kiếm
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="border border-orange-100 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
              >
                <button
                  className="cursor-pointer w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
                  onClick={() =>
                    setOpenFAQ(
                      openFAQ === (faq.id || idx) ? null : faq.id || idx
                    )
                  }
                >
                  <span className="flex items-center gap-3 font-semibold text-orange-700">
                    <FaQuestionCircle className="text-orange-400 text-lg flex-shrink-0" />
                    <span className="text-left">{faq.question}</span>
                  </span>
                  <span className="text-orange-500 text-2xl font-bold ml-4">
                    {openFAQ === (faq.id || idx) ? "-" : "+"}
                  </span>
                </button>
                {openFAQ === (faq.id || idx) && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-orange-100 pt-4">
                      <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gradient-to-r from-orange-500 to-orange-400 py-16 text-center text-white rounded-3xl max-w-5xl mx-auto mb-16 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Không tìm thấy câu trả lời?
        </h2>
        <p className="text-lg mb-8">
          Liên hệ với chúng tôi để được tư vấn và hỗ trợ trực tiếp từ đội ngũ
          chuyên viên.
        </p>
        <a
          href="/lien-he"
          className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-xl shadow hover:bg-orange-100 transition"
        >
          Liên hệ ngay
        </a>
      </section>
    </div>
  );
};

export default FAQ;
