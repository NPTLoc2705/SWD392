import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Search,
  Phone,
  Mail,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

const PageNotFound = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500"></div>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-5/12 p-10 lg:p-16 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="relative mb-8">
                <div className="text-[180px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-orange-600 flex items-center justify-center">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#FF6600"
                      strokeWidth="8"
                      strokeDasharray="10 5"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Oops! Trang không tồn tại
              </h2>
              <p className="text-gray-600 text-center max-w-sm mb-8">
                Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển hoặc không tồn
                tại.
              </p>
            </div>

            <div className="lg:w-7/12 bg-gray-50 p-10 lg:p-16 flex flex-col justify-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-20"></div>

              <div className="relative z-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1.5 h-8 bg-orange-500 inline-block mr-3 rounded-full"></span>
                  Không tìm thấy trang
                </h1>

                <p className="text-lg text-gray-600 mb-8 border-l-4 border-orange-200 pl-4">
                  Chúng tôi không thể tìm thấy trang bạn yêu cầu. Lỗi này có thể
                  xảy ra vì nhiều lý do:
                </p>

                <ul className="space-y-4 mb-10">
                  {[
                    "URL nhập vào không chính xác",
                    "Trang đã bị xóa hoặc di chuyển",
                    "Bạn không có quyền truy cập trang này",
                  ].map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="h-8 w-8 bg-orange-100 rounded-full text-orange-500 mr-3 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <Link
                    to="/"
                    onClick={scrollToTop}
                    className="group px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center transition-all transform hover:-translate-y-1"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <Home className="w-4 h-4" />
                    </div>
                    <span>Trang chủ</span>
                  </Link>

                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-4 bg-white text-gray-800 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all transform hover:-translate-y-1"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowLeft className="w-4 h-4 text-gray-600" />
                    </div>
                    <span>Quay lại</span>
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-4 bg-white text-gray-800 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all transform hover:-translate-y-1"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <RefreshCw className="w-4 h-4 text-gray-600" />
                    </div>
                    <span>Tải lại</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;
