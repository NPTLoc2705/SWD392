import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Eye,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ApplicationService from "./applicationService";

const statusColors = {
  Draft: "bg-gray-500",
  Submitted: "bg-blue-500",
  UnderReview: "bg-blue-300",
  "Under Review": "bg-blue-300",
  Approved: "bg-green-500",
  Rejected: "bg-red-500",
};

const statusNames = {
  Draft: "Bản nháp",
  Submitted: "Đã nộp",
  UnderReview: "Đang xem xét",
  "Under Review": "Đang xem xét",
  Approved: "Được chấp nhận",
  Rejected: "Bị từ chối",
};

const getStatusIcon = (statusName) => {
  switch (statusName) {
    case "Draft":
      return <FileText size={14} className="mr-1" />;
    case "Submitted":
      return <Send size={14} className="mr-1" />;
    case "UnderReview":
    case "Under Review":
      return <Clock size={14} className="mr-1" />;
    case "Approved":
      return <CheckCircle size={14} className="mr-1" />;
    case "Rejected":
      return <XCircle size={14} className="mr-1" />;
    default:
      return <FileText size={14} className="mr-1" />;
  }
};

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await ApplicationService.getMyApplications();
      // Transform data to ensure consistent property names
      const transformedData = Array.isArray(data)
        ? data.map((app) => ({
            Id: app.id || app.Id,
            ProgramTitle: app.programTitle || app.ProgramTitle,
            Status: app.status,
            StatusName:
              app.statusName ||
              (app.status === 0
                ? "Draft"
                : app.status === 1
                ? "Submitted"
                : app.status === 2
                ? "Under Review"
                : app.status === 3
                ? "Approved"
                : "Rejected"),
            SubmittedAt: app.submittedAt || app.SubmittedAt,
          }))
        : [];
      setApplications(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error loading applications:", err);
      setError(err.message || "Không thể tải danh sách hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmitApplication = async (id) => {
    setSubmittingId(id);
    try {
      await ApplicationService.submitApplication(id);
      await fetchApplications(); // Refresh data
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err.message || "Không thể nộp hồ sơ");
    } finally {
      setSubmittingId(null);
    }
  };

  const showMessage = (type, message) => {
    setError(type === "error" ? message : null);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              HỒ SƠ CỦA TÔI
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              Quản lý và theo dõi trạng thái các hồ sơ xét tuyển của bạn
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={fetchApplications}
              disabled={isLoading}
              className="cursor-pointer flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={16}
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Đang tải..." : "Làm mới"}
            </button>

            <button
              onClick={() => navigate("/nop-ho-so")}
              className="cursor-pointer flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
            >
              <Plus size={16} className="mr-2" />
              Tạo hồ sơ mới
            </button>
          </div>

          {/* Summary */}
          {applications.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {applications.length}
                </div>
                <div className="text-sm text-gray-600">Tổng hồ sơ</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">
                  {applications.filter((app) => app.Status === 1).length}
                </div>
                <div className="text-sm text-blue-600">Đã nộp</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-800">
                  {applications.filter((app) => app.Status === 3).length}
                </div>
                <div className="text-sm text-green-600">Được chấp nhận</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-800">
                  {applications.filter((app) => app.Status === 0).length}
                </div>
                <div className="text-sm text-orange-600">Bản nháp</div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Messages */}
            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle
                    size={20}
                    className="text-red-600 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-red-700 font-medium">Lỗi:</span>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2
                  size={48}
                  className="animate-spin text-orange-500 mb-4"
                />
                <p className="text-gray-600">Đang tải danh sách hồ sơ...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-20">
                <FileText size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Chưa có hồ sơ nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn chưa tạo hồ sơ xét tuyển nào. Hãy tạo hồ sơ đầu tiên của
                  bạn!
                </p>
                <button
                  onClick={() => navigate("/nop-ho-so")}
                  className="cursor-pointer inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
                >
                  <Plus size={16} className="mr-2" />
                  Tạo hồ sơ mới
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Chương trình đào tạo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ngày nộp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr
                        key={app.Id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText
                              size={16}
                              className="text-orange-500 mr-3 flex-shrink-0"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {app.ProgramTitle || "Chưa có thông tin"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                              statusColors[app.StatusName]
                            }`}
                          >
                            {getStatusIcon(app.StatusName)}
                            {statusNames[app.StatusName] || "Không xác định"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {app.SubmittedAt
                            ? new Date(app.SubmittedAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa nộp"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/nop-ho-so/${app.Id}`)}
                              className="cursor-pointer inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Eye size={14} className="mr-1" />
                              Xem
                            </button>
                            {app.Status === 0 && (
                              <button
                                onClick={() => handleSubmitApplication(app.Id)}
                                disabled={submittingId === app.Id}
                                className="cursor-pointer inline-flex items-center px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {submittingId === app.Id ? (
                                  <>
                                    <Loader2
                                      size={14}
                                      className="mr-1 animate-spin"
                                    />
                                    Đang nộp...
                                  </>
                                ) : (
                                  <>
                                    <Send size={14} className="mr-1" />
                                    Nộp hồ sơ
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
