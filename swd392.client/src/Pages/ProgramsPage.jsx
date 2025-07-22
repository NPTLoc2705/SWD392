import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  X,
  RefreshCw,
} from "lucide-react";

const API_BASE = "https://localhost:7013/api/programs";

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE}/list-program`);
      
      if (!response.ok) {
        throw new Error("Không thể tải danh sách chương trình đào tạo");
      }
      
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleRefresh = () => {
    fetchPrograms();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/05/doanh-nghiep-3.jpeg"
          alt="Banner Chương trình đào tạo FPTU"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg uppercase">
            CHƯƠNG TRÌNH ĐÀO TẠO
          </h1>
          <p className="text-lg md:text-xl font-medium drop-shadow-lg mb-2">
            Khám phá các ngành học hot, chuẩn xu thế AI & Kinh tế số
          </p>
          <div className="w-24 h-1 bg-orange-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Danh sách chương trình đào tạo
            </h2>
            <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
          </div>

          <div className="flex items-center space-x-4">
            {programs.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{programs.length}</span> chương trình đào tạo
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải chương trình đào tạo...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <X size={48} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : programs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có chương trình đào tạo nào
            </h3>
            <p className="text-gray-500">
              Hiện tại chưa có chương trình đào tạo nào được công bố.
            </p>
          </div>
        ) : (
          /* Programs Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Program Image */}
                <Link to={`/nganh-hoc/${program.id}`} className="block">
                  <div className="relative overflow-hidden h-48">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/vi/thumb/2/2d/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_FPT.svg/1200px-Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_FPT.svg.png"
                      alt={program.title}
                      className="w-full h-[-30px] object-cover duration-300 "
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          program.isActive
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {program.isActive ? (
                          <>
                            <CheckCircle size={12} className="mr-1" />
                            Đang tuyển
                          </>
                        ) : (
                          <>
                            <Clock size={12} className="mr-1" />
                            Ngừng tuyển
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Program Content */}
                <div className="p-6">
                  {/* Program Category */}
                  <div className="flex items-center text-orange-500 text-sm font-medium mb-3">
                    <BookOpen size={14} className="mr-2" />
                    Chương trình đào tạo
                  </div>

                  {/* Title */}
                  <Link to={`/nganh-hoc/${program.id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight hover:text-orange-600 transition-colors duration-200">
                      {program.title}
                    </h3>
                  </Link>

                  {/* Requirements Preview */}
                  {program.admissionRequirements && (
                    <div className="mb-4">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Users size={12} className="mr-2" />
                        <span className="font-medium">Yêu cầu tuyển sinh: {program.admissionRequirements}</span>
                     
                      </div>
                    </div>
                  )}

                  {/* Tuition Fee */}
                  {program.tuitionFee && (
                    <div className="flex items-center text-orange-600 text-sm font-medium mb-4">
                      {/* <DollarSign size={14} className="mr-2" /> */}
                      Học phí: {Number(program.tuitionFee).toLocaleString("vi-VN")} VNĐ
                    </div>
                  )}

                  {/* Read More Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      to={`/nganh-hoc/${program.id}`}
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors duration-200"
                    >
                      Xem chi tiết
                      <svg
                        className="w-4 h-4 ml-1 transition-transform duration-200 hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;