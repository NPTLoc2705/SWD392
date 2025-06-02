import React from "react";

const StudentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="relative h-90 overflow-hidden">
        <img
          src="https://cdnphoto.dantri.com.vn/bc3uX5ERqIeMwAf685OpDrEGHQM=/thumb_w/1360/2024/07/19/tcbc-truong-dh-fpt-cong-bo-diem-chuan-xet-tuyen-anh-2-1721359772279.jpg"
          alt="Trường Đại học FPT"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">SINH VIÊN</h1>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Dịch vụ sinh viên
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full" style={{background: 'linear-gradient(to right, #E0601A, #E0601A)'}}></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
              Truy cập nhanh các dịch vụ thiết yếu dành cho sinh viên FPT
              University
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="h-56">
                <img
                  src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/11/header-recuirement-png.avif"
                  alt="Academic Portal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-[#F2711F] rounded-xl flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      FPT University Academic Portal
                    </h3>
                    <p className="text-sm font-semibold text-[#E0601A]">
                      (FAPS)
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Truy cập hệ thống học tập trực tuyến, xem lịch học và điểm số
                  một cách dễ dàng.
                </p>
                <button
                  onClick={() =>
                    window.open("https://fap.fpt.edu.vn", "_blank")
                  }
                  className="cursor-pointer w-full bg-[#F2711F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
                >
                  Đăng nhập FAPS
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="h-56">
                <img
                  src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/11/bgocd1-scaled.avif"
                  alt="KTX FPT"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#F2711F] rounded-xl flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      KTX Trường Đại học FPT
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Hệ thống ký túc xá hiện đại với đầy đủ tiện nghi và không gian
                  sống thoải mái.
                </p>
                <button
                  onClick={() =>
                    window.open("https://ocd.fpt.edu.vn/", "_blank")
                  }
                  className="cursor-pointer w-full bg-[#F2711F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
