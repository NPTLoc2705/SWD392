import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";

const ProgramDetailPage = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`https://localhost:7013/program-detail/${id}`);
        
        if (!response.ok) {
          throw new Error("Không thể tải chi tiết chương trình");
        }
        
        const data = await response.json();
        setProgram(data);
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgram();
    }
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ngày không hợp lệ";
      }
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="animate-spin text-orange-600 mb-4" />
          <span className="text-gray-600 text-lg">Đang tải thông tin chương trình...</span>
          <span className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</span>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Không tìm thấy chương trình
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "Chương trình này không tồn tại hoặc đã bị xóa"}
            </p>
            <Link
              to="/nganh-hoc"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/nganh-hoc"
              className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại danh sách chương trình
            </Link>

            <div className="flex items-center space-x-4">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                CHƯƠNG TRÌNH ĐÀO TẠO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    program.isActive
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {program.isActive ? (
                    <>
                      <CheckCircle size={14} className="mr-1" />
                      Đang tuyển sinh
                    </>
                  ) : (
                    <>
                      <Clock size={14} className="mr-1" />
                      Ngừng tuyển sinh
                    </>
                  )}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {program.title}
            </h1>

            {/* Program Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <DollarSign size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Học phí</p>
                  <p className="font-bold text-lg text-gray-900">
                    {Number(program.tuitionFee).toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loại chương trình</p>
                  <p className="font-bold text-lg text-gray-900">Đại học</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <Users size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="font-bold text-lg text-gray-900">
                    {program.isActive ? "Đang tuyển" : "Ngừng tuyển"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose max-w-none">
              {/* Description Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Mô tả chương trình
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                    {program.description}
                  </p>
                </div>
              </section>

              {/* Admission Requirements */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Yêu cầu tuyển sinh
                </h2>
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <Users size={24} className="text-orange-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-800 leading-relaxed text-lg">
                      {program.admissionRequirements}
                    </p>
                  </div>
                </div>
              </section>

              {/* Dormitory Information */}
              {program.dormitoryInfo && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Thông tin ký túc xá
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <MapPin size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-blue-900 leading-relaxed text-lg">
                        {program.dormitoryInfo}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Courses */}
              {program.courses && program.courses.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Các môn học tiêu biểu
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {program.courses.map((course, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-800">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Thông tin chương trình có thể thay đổi theo từng kỳ tuyển sinh</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  to="/lien-he"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Users size={16} className="mr-2" />
                  Liên hệ tư vấn
                </Link>
                <Link
                  to="/nop-ho-so"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                >
                  <BookOpen size={16} className="mr-2" />
                  Nộp hồ sơ ngay
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProgramDetailPage;