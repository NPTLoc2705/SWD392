import React from 'react'
import {
  FaRocket,
  FaHandshake,
  FaGlobe,
  FaLightbulb,
  FaShieldAlt,
  FaBullseye,
  FaUsers,
} from 'react-icons/fa'

const stats = [
  { value: "401-600", label: "THE Impact Rankings", description: "Trường đại học có sức ảnh hưởng toàn cầu" },
  { value: "5 Sao", label: "QS Stars", description: "Chất lượng đào tạo, Việc làm, Quốc tế hoá, Cơ sở vật chất" },
  { value: "AUN-QA", label: "Chuẩn chất lượng", description: "Đảm bảo chất lượng của Mạng lưới các trường Đại học Đông Nam Á" },
  { value: "ACBSP", label: "Kiểm định", description: "Ngành Quản trị kinh doanh đạt kiểm định của Hội đồng Kiểm định các Trường và Chương trình Kinh doanh Hoa Kỳ" },
];

const objectives = [
  {
    icon: <FaRocket className="text-5xl text-orange-500" />,
    title: "Mục tiêu dài hạn",
    description: "Trở thành doanh nghiệp số và đứng trong Top 50 công ty hàng đầu thế giới về cung cấp dịch vụ, giải pháp chuyển đổi số toàn diện vào năm 2030."
  },
  {
    icon: <FaHandshake className="text-5xl text-orange-500" />,
    title: "Mở rộng hợp tác",
    description: "FPT xây dựng các chương trình hành động cân bằng, toàn diện ở cả ba khía cạnh: Kinh doanh, Công nghệ và Con người."
  },
  {
    icon: <FaGlobe className="text-5xl text-orange-500" />,
    title: "Đón đầu xu hướng",
    description: "FPT tạo dựng hệ sinh thái những dịch vụ, sản phẩm, giải pháp, nền tảng Made by FPT thúc đẩy sự phát triển, tăng trưởng bền vững."
  }
];

const businessAreas = [
  {
    title: "Công nghệ",
    items: ["Công ty Phần mềm FPT", "Công ty Hệ thống Thông tin FPT", "Công ty FPT Smart Cloud"]
  },
  {
    title: "Viễn thông",
    items: ["Công ty Viễn thông FPT", "Công ty Dịch vụ Trực tuyến FPT"]
  },
  {
    title: "Giáo dục",
    items: ["Tổ chức giáo dục FPT (FPT Education)"]
  }
];

const coreValues = [
  { icon: <FaLightbulb className="text-orange-500 text-4xl mb-3" />, title: "Sáng tạo" },
  { icon: <FaShieldAlt className="text-orange-500 text-4xl mb-3" />, title: "Chất lượng" },
  { icon: <FaBullseye className="text-orange-500 text-4xl mb-3" />, title: "Mục tiêu" },
  { icon: <FaUsers className="text-orange-500 text-4xl mb-3" />, title: "Cộng đồng" },
];

export default function AboutPage() {
  return (
<div className="bg-white font-sans">     
      <section
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center text-white rounded-b-3xl shadow-lg"
        style={{
          backgroundImage: "url('https://i.chungta.vn/2023/09/08/-8391-1694146544_1200x0.jpg"
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-b-3xl"></div>
        <div className="relative text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Giới thiệu Đại Học FPT</h1>
          <p className="text-xl md:text-2xl font-medium drop-shadow-lg">Nơi kiến tạo tương lai, phát triển tài năng Việt</p>
        </div>
      </section>

      {/* === Core Values Section === */}
      <section className="max-w-5xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center uppercase tracking-wider">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 w-full hover:shadow-xl transition"
            >
              <div className="flex justify-center w-full">{value.icon}</div>
              <h4 className="text-lg font-semibold text-gray-700 text-center mt-2">{value.title}</h4>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* === About FPT University Section === */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <img
              src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/03/dai-hoc-fpt-da-nang-1.jpeg"
              alt="FPT University Students"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-orange-600 mb-4">Về Đại Học FPT</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Đại học FPT được thành lập ngày 8/9/2006 theo Quyết định của Thủ tướng Chính phủ, là trường đại học đầu tiên của Việt Nam do một doanh nghiệp đứng ra thành lập.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Với triết lý giáo dục thực tiễn, chương trình đào tạo của Đại học FPT được thiết kế bám sát nhu cầu thực tế của doanh nghiệp, kết hợp đào tạo kiến thức chuyên môn, kỹ năng mềm, ngoại ngữ và cập nhật công nghệ mới nhất.
            </p>
          </div>
        </section>

        {/* === International Recognition Section === */}
        <section className="bg-white p-12 rounded-3xl mb-24 shadow-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-orange-600 mb-4">Đẳng cấp quốc tế</h2>
              <h3 className="text-xl text-orange-500 font-semibold mb-4">Giải thưởng & thành tựu</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Trường Đại học FPT phát triển theo các mục tiêu phát triển bền vững của Liên Hiệp Quốc, được xếp hạng trên các bảng xếp hạng uy tín thế giới như THE Impact Rankings và QS Stars.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-[#fff6e5] p-6 rounded-2xl shadow text-center">
                  <p className="text-3xl font-bold text-blue-800">{stat.value}</p>
                  <p className="text-lg font-semibold text-orange-500 mt-1">{stat.label}</p>
                  <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === Objectives Section === */}
        <section className="text-center mb-24">
          <h2 className="text-3xl font-bold text-orange-600 mb-4 uppercase">Mục tiêu</h2>
          <p className="max-w-3xl mx-auto text-gray-700 mb-12 text-lg">
            FPT tiếp tục theo đuổi mục tiêu lớn dài hạn, xây dựng các chương trình hành động cân bằng và toàn diện trên mọi khía cạnh để mang lại giá trị bền vững.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {objectives.map((obj, index) => (
              <div key={index} className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
                {obj.icon}
                <h3 className="text-xl font-semibold text-gray-800 my-4">{obj.title}</h3>
                <p className="text-gray-600 leading-relaxed">{obj.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === Business Areas Section === */}
        {/* === Business Areas Section === */}
<section className="py-20 bg-white rounded-3xl mb-24 shadow-lg">
  <h2 className="text-3xl font-bold text-center mb-12 uppercase text-orange-600 tracking-wider">
    Lĩnh vực kinh doanh cốt lõi
  </h2>
  <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
    {businessAreas.map((area, index) => (
      <div
        key={index}
        className="bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center"
      >
        <img
          src={
            index === 0
              ? "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
              : index === 1
              ? "https://i.chungta.vn/2016/01/31/IMG-4470-6320-1454253101_1200x0.jpg"
              : "https://daihoc.fpt.edu.vn/wp-content/uploads/2024/05/1S6A0725-1024x683.jpg"
          }
          alt={area.title}
          className="rounded-xl mb-6 w-full h-40 object-cover shadow"
        />
        <h3 className="text-2xl font-bold text-orange-600 mb-4 text-center">{area.title}</h3>
        <ul className="space-y-2">
          {area.items.map((item, i) => (
            <li key={i} className="text-lg text-gray-700 text-center">{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>
        {/* === Educational Philosophy Section === */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-orange-600 mb-4">Triết lý đào tạo</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Triết lý đào tạo của trường là “Giáo dục đào tạo là tổ chức và quản trị việc tự học của người học”. Phương pháp này đã được các trường tiên tiến trên thế giới áp dụng và chứng tỏ ưu việt trong việc giúp người học phát huy tính chủ động, sáng tạo.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Đặc biệt, sinh viên được huấn luyện thực tế về nghề nghiệp tương lai qua giai đoạn On-the-Job-Training (OJT) tại các doanh nghiệp trong và ngoài nước.
            </p>
          </div>
          <div>
            <img
              src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/05/doanh-nghiep-3.jpeg"
              alt="FPT University Campus"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* === Mission & Vision Section === */}
                {/* === Mission & Vision Section === */}
        <section className="grid md:grid-cols-2 gap-8 mb-24">
  <div className="bg-blue-800 text-white p-10 rounded-2xl shadow-lg flex flex-col justify-center items-center">
    <img
      src="https://daihoc.fpt.edu.vn/wp-content/uploads/2023/01/Sinh_vien_DHFPT_tham_quan_FPT_software_han_quoc_1-1024x768.jpeg"
      alt="Mission"
      className="rounded-xl mb-8 w-96 h-72 object-cover" 
    />
    <h3 className="text-2xl font-bold mb-3 flex items-center">
      <FaRocket className="mr-3 text-orange-400" />
      Sứ mệnh
    </h3>
    <p className="text-lg text-center">Cung cấp năng lực cạnh tranh toàn cầu cho người học, góp phần mở mang bờ cõi trí tuệ đất nước.</p>
  </div>
  <div className="bg-orange-500 text-white p-10 rounded-2xl shadow-lg flex flex-col justify-center items-center">
    <img
      src="https://daihoc.fpt.edu.vn/hcm/wp-content/uploads/2025/05/3-scaled.jpg"
      alt="Vision"
      className="rounded-xl mb-8 w-96 h-72 object-cover" 
    />
    <h3 className="text-2xl font-bold mb-3 flex items-center">
      <FaGlobe className="mr-3 text-blue-800" />
      Tầm nhìn
    </h3>
    <p className="text-lg text-center">Trở thành một hệ thống giáo dục có đẳng cấp quốc tế, nơi các thế hệ tài năng của Việt Nam được trang bị các kỹ năng và kiến thức để thành công.</p>
  </div>
</section>
        {/* === Contact/Email Consultation Section === */}
<section className="max-w-2xl mx-auto mb-24 bg-white rounded-2xl shadow-lg p-10 text-center">
  <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4">
    Đăng ký nhận tư vấn
  </h2>
  <p className="text-gray-700 mb-6">
    Để lại email, chúng tôi sẽ liên hệ tư vấn miễn phí về các chương trình đào tạo, tuyển sinh và học bổng của Đại học FPT.
  </p>
  <form
    className="flex flex-col md:flex-row items-center gap-4 justify-center"
    onSubmit={e => {
      e.preventDefault();
      alert("Cảm ơn bạn đã đăng ký nhận tư vấn! Chúng tôi sẽ liên hệ sớm nhất.");
    }}
  >
    <input
      type="email"
      required
      placeholder="Nhập email của bạn"
      className="flex-1 px-4 py-3 rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
    />
    <button
      type="submit"
      className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow hover:bg-orange-600 transition"
    >
      Gửi đăng ký
    </button>
  </form>
</section>                                         
      </main>
    </div>
  )
}