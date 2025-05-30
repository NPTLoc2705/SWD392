import React from 'react';
import { Facebook, Youtube, Phone, Mail, Instagram, ChevronRight, Twitter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  
  const quickLinks = [
    { name: "Giới thiệu", path: "/gioi-thieu" },
    { name: "Tin tức & Sự kiện", path: "/tin-tuc-su-kien" },
    { name: "Ngành học", path: "/nganh-hoc" },
    { name: "Tuyển sinh", path: "/tuyen-sinh" },
    { name: "Trải nghiệm toàn cầu", path: "/trai-nghiem-toan-cau" },
  ];

  const resourceLinks = [
    { name: "Thư viện", path: "#" },
    { name: "Học liệu điện tử", path: "#" },
    { name: "Lịch học - lịch thi", path: "#" },
    { name: "Đời sống sinh viên", path: "#" },
    { name: "Cựu sinh viên", path: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50">
      <div className="relative h-8 overflow-hidden">
        {/* <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="#FF6600" 
            fillOpacity="0.15"
            d="M0,32L80,42.7C160,53,320,75,480,69.3C640,64,800,32,960,21.3C1120,11,1280,21,1360,26.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z">
          </path>
        </svg> */}
      </div>

      <div className="container mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <img
                src="https://daihoc.fpt.edu.vn/wp-content/uploads/2023/04/cropped-cropped-2021-FPTU-Long-300x93.png"
                alt="FPT University"
                className="h-14 w-auto"
              />
            </div>
            
            <h2 className="text-xl font-bold text-orange-500 mb-4 flex items-center">
              <span className="w-1.5 h-8 bg-orange-500 mr-2.5 rounded-sm"></span>
              TRƯỜNG ĐẠI HỌC FPT
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed border-l-4 border-orange-200 pl-4 italic">
              Đại học đổi mới sáng tạo hàng đầu Việt Nam - Nơi đào tạo những nhân tài công nghệ cho tương lai
            </p>

            <div className="flex flex-col space-y-4 mb-8">
              <div className="flex items-center hover:translate-x-1 transition-transform">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                </div>
                <a href="tel:18006600" className="text-gray-700 hover:text-orange-500 transition font-medium">
                  1800 6600 (Tổng đài miễn phí)
                </a>
              </div>
              <div className="flex items-center hover:translate-x-1 transition-transform">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <a href="mailto:daihoc@fpt.edu.vn" className="text-gray-700 hover:text-orange-500 transition font-medium">
                  daihoc@fpt.edu.vn
                </a>
              </div>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-8 h-full">
              <div>
                <h3 className="text-lg font-bold mb-6 text-gray-800 relative">
                  <span className="bg-orange-100 absolute -left-2.5 top-0 h-full w-1.5 rounded-full"></span>
                  Liên kết nhanh
                </h3>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index} className="transform hover:translate-x-2 transition-transform duration-200">
                      <Link to={link.path} className="text-gray-600 hover:text-orange-500 transition flex items-center">
                        <ChevronRight className="w-4 h-4 mr-2 text-orange-500" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              

              <div>
                <h3 className="text-lg font-bold mb-6 text-gray-800 relative">
                  <span className="bg-orange-100 absolute -left-2.5 top-0 h-full w-1.5 rounded-full"></span>
                  Tài nguyên
                </h3>
                <ul className="space-y-3">
                  {resourceLinks.map((link, index) => (
                    <li key={index} className="transform hover:translate-x-2 transition-transform duration-200">
                      <Link to={link.path} className="text-gray-600 hover:text-orange-500 transition flex items-center">
                        <ChevronRight className="w-4 h-4 mr-2 text-orange-500" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold mb-6 text-gray-800 relative">
              <span className="bg-orange-100 absolute -left-2.5 top-0 h-full w-1.5 rounded-full"></span>
              Nhận thông tin mới nhất
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Đăng ký nhận bản tin để cập nhật thông tin mới nhất từ FPT University về các sự kiện, học bổng và chương trình đào tạo.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="pl-5 pr-12 py-3.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Bằng cách đăng ký, bạn đồng ý với các <a href="#" className="text-blue-500 hover:underline">điều khoản</a> và <a href="#" className="text-blue-500 hover:underline">chính sách bảo mật</a> của chúng tôi.
            </p>
          </div>
        </div>

        <div className="relative flex items-center my-10 mt-[-20px]">
          <div className="flex-grow border-t border-gray-200"></div>
          <div className="mx-4 flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-200"></div>
            <div className="w-2 h-2 rounded-full bg-orange-300"></div>
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </div>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>


        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 mb-4 md:mb-0">
            © 2025 <span className="text-orange-500 font-medium">FPT University</span>. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center">
              <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
              Chính sách bảo mật
            </a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center">
              <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
              Điều khoản sử dụng
            </a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center">
              <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;