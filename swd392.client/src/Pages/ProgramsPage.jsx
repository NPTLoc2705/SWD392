import React, { useState } from "react";
import {
  FaCheckCircle,
  FaGlobeAsia,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaHandshake,
  FaRocket,
  FaBookOpen,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const majorsList = [
  "Kỹ thuật phần mềm",
  "Trí tuệ nhân tạo",
  "An toàn thông tin",
  "Quản trị kinh doanh",
  "Kinh doanh quốc tế",
  "Thiết kế đồ họa",
  "Ngôn ngữ Anh",
  "Ngôn ngữ Nhật",
  "Ngôn ngữ Hàn Quốc",
  "Thạc sĩ Quản trị kinh doanh (MBA)",
  "Thạc sĩ Kỹ thuật phần mềm",
  "Tiến sĩ Khoa học máy tính",
  "Chuyển tiếp 1+3, 2+2, 3+1",
  "Bằng đôi quốc tế",
  "Du học chuyển tiếp",
  "Chứng chỉ CNTT",
  "Chứng chỉ ngoại ngữ",
  "Kỹ năng mềm",
  "Khóa học chuyên đề",
];

const programs = [
  {
    title: "Đại học chính quy",
    description:
      "Chương trình đào tạo đại học chính quy với các ngành học hiện đại, chú trọng thực tiễn, ngoại ngữ và kỹ năng mềm.",
    image:
      "https://media.vov.vn/sites/default/files/styles/large/public/2025-01/img_0274.jpg",
    link: "#",
    majors: [
      "Kỹ thuật phần mềm",
      "Trí tuệ nhân tạo",
      "An toàn thông tin",
      "Quản trị kinh doanh",
      "Kinh doanh quốc tế",
      "Thiết kế đồ họa",
      "Ngôn ngữ Anh",
      "Ngôn ngữ Nhật",
      "Ngôn ngữ Hàn Quốc",
    ],
  },
  {
    title: "Sau đại học",
    description:
      "Chương trình đào tạo thạc sĩ, tiến sĩ với đội ngũ giảng viên giàu kinh nghiệm, môi trường nghiên cứu chuyên sâu.",
    image:
      "https://caohoc.fpt.edu.vn/fsb/semba/images/why-choose-image.png",
    link: "#",
    majors: [
      "Thạc sĩ Quản trị kinh doanh (MBA)",
      "Thạc sĩ Kỹ thuật phần mềm",
      "Tiến sĩ Khoa học máy tính",
    ],
  },
  {
    title: "Liên kết quốc tế",
    description:
      "Chương trình liên kết đào tạo với các trường đại học quốc tế, chuyển tiếp học tập và nhận bằng nước ngoài.",
    image:
      "https://daihoc.fpt.edu.vn/wp-content/uploads/2023/02/Dai-hoc-FPT-Da-Nang-3-1536x1024-2.webp",
    link: "#",
    majors: [
      "Chuyển tiếp 1+3, 2+2, 3+1",
      "Bằng đôi quốc tế",
      "Du học chuyển tiếp",
    ],
  },
  {
    title: "Chương trình đào tạo ngắn hạn",
    description:
      "Các khóa học ngắn hạn, chứng chỉ, đào tạo kỹ năng, ngoại ngữ, công nghệ thông tin cho sinh viên và người đi làm.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    link: "#",
    majors: [
      "Chứng chỉ CNTT",
      "Chứng chỉ ngoại ngữ",
      "Kỹ năng mềm",
      "Khóa học chuyên đề",
    ],
  },
];

const reasons = [
  {
    icon: <FaGlobeAsia className="text-4xl text-orange-500 mb-4" />,
    title: "Chuẩn quốc tế",
    desc: "Chương trình đào tạo cập nhật theo chuẩn quốc tế, hợp tác với nhiều trường đại học danh tiếng trên thế giới.",
  },
  {
    icon: <FaUserGraduate className="text-4xl text-orange-500 mb-4" />,
    title: "Trải nghiệm thực tế",
    desc: "Sinh viên được thực tập, làm việc thực tế tại doanh nghiệp, phát triển kỹ năng mềm và ngoại ngữ.",
  },
  {
    icon: <FaChalkboardTeacher className="text-4xl text-orange-500 mb-4" />,
    title: "Giảng viên chất lượng",
    desc: "Đội ngũ giảng viên giàu kinh nghiệm, chuyên môn cao, tận tâm với sinh viên.",
  },
  {
    icon: <FaHandshake className="text-4xl text-orange-500 mb-4" />,
    title: "Cơ hội việc làm rộng mở",
    desc: "Liên kết với hàng trăm doanh nghiệp, tỷ lệ sinh viên có việc làm sau tốt nghiệp luôn ở mức cao.",
  },
];

const timeline = [
  {
    icon: <FaBookOpen className="text-3xl text-orange-500" />,
    title: "Năm 1",
    desc: "Học tiếng Anh, kỹ năng mềm, các môn đại cương và định hướng ngành.",
  },
  {
    icon: <FaRocket className="text-3xl text-orange-500" />,
    title: "Năm 2",
    desc: "Học kiến thức cơ sở ngành, bắt đầu tham gia các dự án thực tế.",
  },
  {
    icon: <FaHandshake className="text-3xl text-orange-500" />,
    title: "Năm 3",
    desc: "On-the-Job Training (OJT) tại doanh nghiệp, học chuyên sâu ngành.",
  },
  {
    icon: <FaCheckCircle className="text-3xl text-orange-500" />,
    title: "Năm 4",
    desc: "Hoàn thiện chuyên ngành, thực hiện đồ án tốt nghiệp, chuẩn bị ra trường.",
  },
];

const activities = [
  {
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    title: "Hoạt động ngoại khóa",
    desc: "Đa dạng câu lạc bộ, sự kiện, hoạt động thể thao, nghệ thuật giúp sinh viên phát triển toàn diện.",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    title: "Trải nghiệm quốc tế",
    desc: "Cơ hội giao lưu, học tập, thực tập tại nước ngoài, mở rộng tầm nhìn toàn cầu.",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    title: "Khởi nghiệp & sáng tạo",
    desc: "Hỗ trợ khởi nghiệp, tham gia các cuộc thi sáng tạo, phát triển ý tưởng kinh doanh.",
  },
];

const faqs = [
  {
    question: "Điều kiện xét tuyển vào Đại học FPT là gì?",
    answer: "Thí sinh tốt nghiệp THPT, đạt điểm chuẩn theo quy định từng năm hoặc có chứng chỉ quốc tế, giải thưởng học sinh giỏi, v.v.",
  },
  {
    question: "Sinh viên có được thực tập tại doanh nghiệp không?",
    answer: "Có. Sinh viên FPTU bắt buộc tham gia kỳ thực tập OJT tại doanh nghiệp trong và ngoài nước.",
  },
  {
    question: "Bằng cấp của Đại học FPT có giá trị quốc tế không?",
    answer: "Bằng cấp của Đại học FPT được công nhận rộng rãi, nhiều chương trình liên kết quốc tế, chuyển tiếp nước ngoài.",
  },
  {
    question: "Có ký túc xá cho sinh viên không?",
    answer: "Có. Trường có hệ thống ký túc xá hiện đại, an ninh, đầy đủ tiện nghi cho sinh viên.",
  },
];

const bannerUrl =
  "https://daihoc.fpt.edu.vn/wp-content/uploads/2024/07/7ea4663893ff30a169ee-jpg.webp";

const ProgramsPage = () => {
  const [selectedMajor, setSelectedMajor] = useState("");
  const [showMajors, setShowMajors] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  // Lọc chương trình theo ngành học
  const filteredPrograms = selectedMajor
    ? programs.filter((p) => p.majors.includes(selectedMajor))
    : programs;

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Banner */}
      <section
        className="relative h-[320px] md:h-[420px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${bannerUrl}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 uppercase">
            Chương trình đào tạo
          </h1>
          <p className="text-lg md:text-2xl text-white font-medium drop-shadow-lg">
            Đa dạng ngành học, chuẩn quốc tế, thực tiễn và hội nhập
          </p>
        </div>
      </section>

      {/* Chọn ngành học */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <span className="font-semibold text-lg text-orange-700">Chọn ngành học:</span>
          <div className="relative w-full md:w-2/3">
            <button
              className="w-full border border-orange-300 rounded-xl px-4 py-3 text-left bg-white shadow hover:shadow-md transition flex items-center justify-between"
              onClick={() => setShowMajors((v) => !v)}
            >
              <span>
                {selectedMajor ? selectedMajor : "Tất cả ngành học"}
              </span>
              {showMajors ? (
                <FaChevronUp className="ml-2 text-orange-500" />
              ) : (
                <FaChevronDown className="ml-2 text-orange-500" />
              )}
            </button>
            {showMajors && (
              <div className="absolute z-20 w-full bg-white border border-orange-200 rounded-xl shadow-lg mt-2 max-h-64 overflow-y-auto">
                <div
                  className="px-4 py-2 hover:bg-orange-50 cursor-pointer"
                  onClick={() => {
                    setSelectedMajor("");
                    setShowMajors(false);
                  }}
                >
                  Tất cả ngành học
                </div>
                {majorsList.map((major) => (
                  <div
                    key={major}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer"
                    onClick={() => {
                      setSelectedMajor(major);
                      setShowMajors(false);
                    }}
                  >
                    {major}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lý do chọn FPTU */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-10 text-center uppercase">
          Vì sao chọn Đại học FPT?
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-orange-700">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lộ trình học tập */}
      <section className="bg-orange-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-10 text-center uppercase">
            Lộ trình học tập
          </h2>
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            {timeline.map((step, idx) => (
              <div
                key={idx}
                className="flex-1 bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center relative mb-8 md:mb-0"
              >
                <div className="mb-4">{step.icon}</div>
                <h4 className="text-lg font-bold text-orange-700 mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.desc}</p>
                {idx < timeline.length - 1 && (
                  <span className="hidden md:block absolute right-[-32px] top-1/2 -translate-y-1/2 w-16 h-1 bg-orange-200"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-10 text-center uppercase">
          Các chương trình đào tạo
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {filteredPrograms.map((program, idx) => (
            <div
              key={program.title}
              className="bg-white rounded-3xl shadow-xl border border-orange-100 flex flex-col md:flex-row overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-orange-400"
            >
              <div className="md:w-1/3 flex-shrink-0">
                <img
                  src={program.image}
                  alt={program.title}
                  className="h-56 md:h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2 group-hover:text-orange-700 transition">
                    {program.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{program.description}</p>
                  <ul className="mb-4 list-disc list-inside text-gray-800 space-y-1">
                    {program.majors.map((major, i) => (
                      <li
                        key={i}
                        className="transition-all duration-200 rounded-lg px-2 py-1 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                      >
                        {major}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <a
                    href={program.link}
                    className="inline-block mt-2 px-6 py-2 bg-orange-500 text-white rounded-xl font-semibold shadow hover:bg-orange-600 transition"
                  >
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </div>
          ))}
          {filteredPrograms.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 py-12">
              Không tìm thấy chương trình phù hợp với ngành học đã chọn.
            </div>
          )}
        </div>
      </section>

      {/* Hoạt động trải nghiệm */}
      <section className="bg-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-10 text-center uppercase">
            Hoạt động trải nghiệm
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {activities.map((act, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
              >
                <img
                  src={act.image}
                  alt={act.title}
                  className="rounded-xl mb-4 w-full h-40 object-cover"
                />
                <h4 className="text-lg font-bold text-orange-700 mb-2">{act.title}</h4>
                <p className="text-gray-600">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-400 py-16 text-center text-white rounded-3xl max-w-5xl mx-auto mb-16 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng trở thành sinh viên FPTU?</h2>
        <p className="text-lg mb-8">
          Đăng ký xét tuyển ngay hôm nay để trải nghiệm môi trường học tập hiện đại, năng động và hội nhập quốc tế.
        </p>
        <a
          href="#"
          className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-xl shadow hover:bg-orange-100 transition"
        >
          Đăng ký xét tuyển
        </a>
      </section>
    </div>
  );
};

export default ProgramsPage;