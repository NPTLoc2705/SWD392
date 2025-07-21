import React from "react";
import { Globe, Handshake, Lightbulb, Briefcase, MapPin } from "lucide-react";

const AdmissionsPage = () => {
  const features = [
    {
      Icon: Globe,
      title: "Trải nghiệm quốc tế\nvượt trội",
      description:
        "Hiện Trường Đại học FPT đã hợp tác với hơn 200 đối tác tại 36 quốc gia. Sinh viên được du học ngắn hạn 3-6 tháng tại các đại học danh tiếng trên thế giới",
    },
    {
      Icon: Handshake,
      title: "Làm thật trong\ndoanh nghiệp",
      description:
        "100% sinh viên thực tập tại doanh nghiệp từ năm 3, tích lũy kinh nghiệm thực tế.",
    },
    {
      Icon: Lightbulb,
      title: "Giáo dục\nthế hệ mới",
      description:
        "Chương trình đào tạo chuẩn quốc tế. Giảng viên Trường Đại học FPT là các chuyên gia trong và ngoài nước, đầy dẫn chuyên môn sư phạm và kinh nghiệm thực chiến",
    },
    {
      Icon: Briefcase,
      title: "Cơ hội việc làm\ntoàn cầu",
      description:
        "98% sinh viên FPTU có việc làm sau tốt nghiệp, 19% cựu sinh viên FPTU làm việc tại các nước phát triển như Anh, Mỹ, Đức, Nhật, Canada...",
    },
    {
      Icon: MapPin,
      title: "Hệ thống\nrộng khắp",
      description:
        "Trường Đại học FPT có 5 địa điểm đào tạo hệ đại học chính quy tại: Hà Nội, Đà Nẵng, Quy Nhơn, Tp. Hồ Chí Minh và Cần Thơ",
    },
  ];

  return (
    <>
      <div className="relative w-full h-screen">
        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/05/Background-landingpage.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/05/chinh-thuc-bat-dau-3.png"
          alt=""
          className="absolute top-3/9 left-8 md:left-16 lg:left-24 z-20 object-cover"
        />
        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/05/Group-20-2-1.png"
          alt=""
          className="absolute top-82 left-8 md:left-16 lg:left-24 z-20 object-cover"
        />

        <div className="absolute top-1/8 left-8 md:left-16 lg:left-24 z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-2">
            TUYỂN SINH ĐẠI HỌC
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-4 text-center">
            NĂM HỌC 2025
          </h2>
          <div className="absolute top-11/4 left-8 md:left-16 lg:left-24 z-20">
            <button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-20 rounded-full text-lg transition-colors duration-300 shadow-lg">
              ĐĂNG KÝ NGAY
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Vì sao hàng chục nghìn sinh viên
              <span className="text-orange-500 block mt-2">
                chọn FPTU mỗi năm?
              </span>
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {features.map((feature, index) => {
              const { Icon } = feature;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-orange-200"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-500 transition-all duration-300">
                      <Icon
                        size={32}
                        className="text-orange-500 group-hover:text-white transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300 whitespace-pre-line">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-6 w-0 h-1 bg-orange-500 mx-auto rounded-full group-hover:w-16 transition-all duration-500"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 leading-tight">
              Các ngành đào tạo HOT - Chuẩn xu thế AI & Kinh tế số
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Công nghệ thông tin */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Công nghệ thông tin
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">An toàn thông tin</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Công nghệ ô tô số</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Chuyển đổi số</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Kỹ thuật phần mềm</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Thiết kế mỹ thuật số</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Thiết kế vi mạch bán dẫn
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Trí tuệ nhân tạo</span>
                </li>
              </ul>
            </div>

            {/* Công nghệ truyền thông */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Công nghệ truyền thông
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Quan hệ công chúng</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Truyền thông đa phương tiện
                  </span>
                </li>
              </ul>
            </div>

            {/* Luật */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">Luật</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Luật kinh tế</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Luật thương mại quốc tế</span>
                </li>
              </ul>
            </div>

            {/* Quản trị kinh doanh */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Quản trị kinh doanh
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Tài chính đầu tư</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Công nghệ tài chính (Fintech)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Digital Marketing</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Kinh doanh quốc tế</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Logistics và quản lý chuỗi cung ứng toàn cầu
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Quản trị dịch vụ du lịch & lữ hành
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Quản trị khách sạn</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Tài chính doanh nghiệp</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Ngân hàng số – Tài chính (Digital Banking and Finance)
                  </span>
                </li>
              </ul>
            </div>

            {/* Ngôn ngữ Anh */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Ngôn ngữ Anh
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Ngôn ngữ Anh</span>
                </li>
              </ul>
            </div>

            {/* Ngôn ngữ Hàn Quốc */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Ngôn ngữ Hàn Quốc
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Song ngữ Hàn – Anh</span>
                </li>
              </ul>
            </div>

            {/* Ngôn ngữ Nhật */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Ngôn ngữ Nhật
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Song ngữ Nhật – Anh</span>
                </li>
              </ul>
            </div>

            {/* Ngôn ngữ Trung Quốc */}
            <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Ngôn ngữ Trung Quốc
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Song ngữ Trung – Anh</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Học bổng - Ưu đãi - Cơ hội bứt phá */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 leading-tight">
              Học bổng - Ưu đãi - Cơ hội bứt phá
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Học bổng Nguyễn Văn Đạo */}
            <div className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">
                  Học bổng
                  <br />
                  Nguyễn Văn Đạo
                </h3>
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/Edit-trangtuyensinh-FPTU-icon-07.svg"
                    alt="Học bổng"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <p className="text-gray-700 mt-4 mb-2">
                2800 suất học bổng mang tên Giáo sư Nguyễn Văn Đạo có giá trị từ
                100% năm đầu đến 100% toàn khóa học
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </div>

            {/* Học bổng nữ sinh STEM */}
            <div className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">
                  Học bổng
                  <br />
                  nữ sinh STEM
                </h3>
              </div>

              <div className="flex mt-4">
                <div className="flex-1 pr-4">
                  <p className="text-gray-700">
                    Tặng học bổng trị giá 20 triệu đồng cho các thí sinh nữ đăng
                    ký học ngành Công nghệ thông tin
                  </p>
                </div>
                <div className="w-20 h-50 mt-[-100px] hidden md:block">
                  <img
                    src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/Edit-trangtuyensinh-FPTU-icon.svg"
                    alt="Nữ sinh STEM"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </div>

            {/* Chính sách hỗ trợ tài chính */}
            <div className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">
                  Chính sách
                  <br />
                  hỗ trợ tài chính
                </h3>
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/Edit-trangtuyensinh-FPTU-icon-09.svg"
                    alt="Hỗ trợ tài chính"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <p className="text-gray-700 mt-4 mb-2">
                Trường Đại học FPT hỗ trợ 1000 sinh viên theo chương trình "Học
                trước – Trả sau", cho phép sinh viên trả dần học phí sau khi tốt
                nghiệp
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="#"
              className="inline-block bg-orange-500 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-orange-600 transition-colors"
            >
              Tìm hiểu thêm về học bổng
            </a>
          </div>
        </div>
      </div>

      {/* Học phí từng campus */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 leading-tight">
              Học phí từng campus
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>

          {/* Campus cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-8xl mx-auto">
            {/* Quy Nhơn */}
            <div className="rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="h-55 overflow-hidden relative">
                <img
                  src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/anh-campusArtboard-16.avif"
                  alt="Campus Quy Nhơn"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-orange-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-3">Quy Nhơn</h3>
                <div className="text-white/90 space-y-1">
                  <p className="font-semibold">11.060.000 VNĐ</p>
                  <p>đến 17.900.000 VNĐ</p>
                  <p>cho mỗi 1 học kỳ</p>
                </div>
              </div>
            </div>

            {/* TP. HCM */}
            <div className="rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="h-55 overflow-hidden relative">
                <img
                  src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/anh-campusArtboard-17.avif"
                  alt="Campus TP. HCM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-orange-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-3">TP. HCM</h3>
                <div className="text-white/90 space-y-1">
                  <p className="font-semibold">22.120.000 VNĐ</p>
                  <p>đến 35.800.000 VNĐ</p>
                  <p>cho mỗi 1 học kỳ</p>
                </div>
              </div>
            </div>

            {/* Cần Thơ */}
            <div className="rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="h-55 overflow-hidden relative">
                <img
                  src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/anh-campusArtboard-18.avif"
                  alt="Campus Cần Thơ"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-orange-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-3">Cần Thơ</h3>
                <div className="text-white/90 space-y-1">
                  <p className="font-semibold">15.480.000 VNĐ</p>
                  <p>đến 25.060.000 VNĐ</p>
                  <p>cho mỗi 1 học kỳ</p>
                </div>
              </div>
            </div>

            {/* Hà Nội */}
            <div className="rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="h-55 overflow-hidden relative">
                <img
                  src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/anh-campusArtboard-14.avif"
                  alt="Campus Hà Nội"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-orange-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-3">Hà Nội</h3>
                <div className="text-white/90 space-y-1">
                  <p className="font-semibold">22.120.000 VNĐ</p>
                  <p>đến 35.800.000 VNĐ</p>
                  <p>cho mỗi 1 học kỳ</p>
                </div>
              </div>
            </div>

            {/* Đà Nẵng */}
            <div className="rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="h-55 overflow-hidden relative">
                <img
                  src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/04/anh-campusArtboard-15.avif"
                  alt="Campus Đà Nẵng"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-orange-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-3">Đà Nẵng</h3>
                <div className="text-white/90 space-y-1">
                  <p className="font-semibold">15.480.000 VNĐ</p>
                  <p>đến 25.060.000 VNĐ</p>
                  <p>cho mỗi 1 học kỳ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin thêm */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              * Học phí đã bao gồm học phí các môn học và các chi phí dịch vụ
              bắt buộc. Chi tiết học phí từng ngành có thể thay đổi theo từng
              năm học.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 leading-tight">
              Phương thức tuyển sinh
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 max-w-3xl mx-auto">
              Đa dạng phương thức xét tuyển, tối ưu cơ hội trúng tuyển vào Đại
              học FPT
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Method 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-orange-500">
                      Xét kết quả xếp hạng học sinh THPT
                    </h3>
                  </div>
                  <div className="text-gray-600 space-y-4">
                    <p>
                      Đạt xếp hạng Top50 năm 2025 theo điểm học ba lớp 11 và học
                      kỳ 1 lớp 12 (chứng nhận thực hiện trên trang{" "}
                      <a
                        href="https://School-Rank.fpt.edu.vn"
                        className="text-orange-500 hover:underline"
                      >
                        https://School-Rank.fpt.edu.vn
                      </a>
                      )
                    </p>
                    <p>
                      Với điều kiện điểm Toán + điểm 2 môn bất kỳ của học kỳ 2
                      năm lớp 12 đạt từ 21 điểm trở lên
                    </p>
                    <div className="pt-6">
                      <a
                        href="#"
                        className="inline-flex items-center bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 transition-colors hover:scale-105 transform"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        XEM CHI TIẾT
                      </a>
                    </div>
                  </div>
                </div>
                <div className="h-96 md:h-[400px]">
                  <img
                    src="https://vstatic.vietnam.vn/vietnam/resource/IMAGE/2025/4/17/0c9a06cd6dbe47d599e201d5d018e7a1"
                    alt="Xét tuyển học sinh THPT"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Method 2  */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="h-96 md:h-[400px] order-2 md:order-1">
                  <img
                    src="https://toquoc.mediacdn.vn/280518851207290880/2023/8/19/photo-1692428127066-16924281321402027711362.jpg"
                    alt="Kỳ thi đánh giá năng lực"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-10 order-1 md:order-2">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-orange-500">
                      Dựa vào kết quả kỳ thi đánh giá năng lực
                    </h3>
                  </div>
                  <div className="text-gray-600 space-y-4">
                    <p>
                      Điểm trúng tuyển sẽ công bố cụ thể sau khi có kết quả của
                      các kỳ thi này.
                    </p>
                    <div className="pt-6">
                      <a
                        href="#"
                        className="inline-flex items-center bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 transition-colors hover:scale-105 transform"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        XEM CHI TIẾT
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Method 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-orange-500">
                      Xét kết quả thi tốt nghiệp THPT năm 2025
                    </h3>
                  </div>
                  <div className="text-gray-600 space-y-4">
                    <p>
                      Dùng tổ hợp [Toán + 2 môn bất kỳ + Điểm ưu tiên theo quy
                      định của Bộ GD&ĐT]
                    </p>
                    <p>Điểm cụ thể sẽ được công bố sau khi có kết quả thi</p>
                    <div className="pt-6">
                      <a
                        href="#"
                        className="inline-flex items-center bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 transition-colors hover:scale-105 transform"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        XEM CHI TIẾT
                      </a>
                    </div>
                  </div>
                </div>
                <div className="h-96 md:h-[400px]">
                  <img
                    src="https://cdnphoto.dantri.com.vn/XZuTXBJEiNKqXTGFN39iDC9EJ4U=/thumb_w/1020/2024/04/24/dan-tri-01-content-hoc-bong-fptu-2024anh-1-1713950965602.jpg"
                    alt="Kết quả thi tốt nghiệp THPT"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Method 4 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="h-96 md:h-[400px] order-2 md:order-1">
                  <img
                    src="https://baodongkhoi.vn/image/ckeditor/2024/20240704/files/DH%20FPT1.jpg"
                    alt="Phương thức tuyển sinh khác"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-10 order-1 md:order-2">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      4
                    </div>
                    <h3 className="text-2xl font-bold text-orange-500">
                      Phương thức tuyển sinh khác
                    </h3>
                  </div>
                  <div className="text-gray-600 space-y-4">
                    <p>Xét tuyển theo tiêu chí riêng của Trường Đại Học FPT</p>
                    <div className="pt-6">
                      <a
                        href="#"
                        className="inline-flex items-center bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 transition-colors hover:scale-105 transform"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        XEM CHI TIẾT
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmissionsPage;
