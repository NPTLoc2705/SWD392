import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Send, 
  FileText, 
  User, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Loader2,
  Eye,
  Download,
  Phone,
  Hash,
  ZoomIn,
  ExternalLink,
  X
} from 'lucide-react';
import ApplicationService from './applicationService';

const statusColors = {
  'Draft': 'bg-gray-500',
  'Submitted': 'bg-blue-500',
  'UnderReview': 'bg-blue-300',
  'Under Review': 'bg-blue-300',
  'Approved': 'bg-green-500',
  'Rejected': 'bg-red-500',
};

const statusNames = {
  'Draft': 'Bản nháp',
  'Submitted': 'Đã nộp',
  'UnderReview': 'Đang xem xét',
  'Under Review': 'Đang xem xét',
  'Approved': 'Được chấp nhận',
  'Rejected': 'Bị từ chối'
};

const getStatusIcon = (statusName) => {
  switch (statusName) {
    case 'Draft':
      return <FileText size={16} className="mr-2" />;
    case 'Submitted':
      return <Send size={16} className="mr-2" />;
    case 'UnderReview':
    case 'Under Review':
      return <Clock size={16} className="mr-2" />;
    case 'Approved':
      return <CheckCircle size={16} className="mr-2" />;
    case 'Rejected':
      return <XCircle size={16} className="mr-2" />;
    default:
      return <FileText size={16} className="mr-2" />;
  }
};

// Modal component for viewing images
const ImageModal = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

// Modal component for viewing documents
const DocumentModal = ({ isOpen, onClose, documentUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <div className="flex items-center space-x-2">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ExternalLink size={14} className="mr-1" />
              Mở tab mới
            </a>
            <a
              href={documentUrl}
              download
              className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Download size={14} className="mr-1" />
              Tải xuống
            </a>
            <button
              onClick={onClose}
              className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <X size={14} className="mr-1" />
              Đóng
            </button>
          </div>
        </div>
        <div className="w-full h-full">
          <iframe
            src={documentUrl}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await ApplicationService.getById(id);
        console.log('Application data:', data); // Debug log
        
        // Map all fields from API response to ensure consistency
        const mappedApplication = {
          id: data.id || data.Id || '',
          studentId: data.studentId || data.StudentId || '',
          studentName: data.studentName || data.StudentName || '',
          studentPhone: data.studentPhone || data.StudentPhone || '',
          programId: data.programId || data.ProgramId || '',
          programTitle: data.programTitle || data.ProgramTitle || '',
          imageUrl: data.imageUrl || data.ImageUrl || null,
          documentUrls: data.documentUrls || data.DocumentUrls || [],
          portfolioLink: data.portfolioLink || data.PortfolioLink || '',
          otherLink: data.otherLink || data.OtherLink || '',
          submittedAt: data.submittedAt || data.SubmittedAt || null,
          statusName: data.statusName || data.StatusName || '',
          status: data.status || data.Status || 0,
          errorCode: data.errorCode || data.ErrorCode || null,
          message: data.message || data.Message || '',
          createdAt: data.createdAt || data.CreatedAt || null,
          updatedAt: data.updatedAt || data.UpdatedAt || null
        };
        
        setApplication(mappedApplication);
      } catch (err) {
        console.error('Error loading application:', err);
        setError(err.message || 'Không thể tải thông tin hồ sơ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleBack = () => {
    navigate('/nop-ho-so/ho-so-cua-toi');
  };

  const handleEdit = () => {
    navigate(`/nop-ho-so/${id}/chinh-sua`);
  };

  const handleSubmit = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn nộp hồ sơ này? Sau khi nộp, bạn sẽ không thể chỉnh sửa.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await ApplicationService.submitApplication(id);
      setSuccess('Hồ sơ đã được nộp thành công!');
      // Refresh application data
      const updatedData = await ApplicationService.getById(id);
      const mappedUpdatedData = {
        id: updatedData.id || updatedData.Id || '',
        studentId: updatedData.studentId || updatedData.StudentId || '',
        studentName: updatedData.studentName || updatedData.StudentName || '',
        studentPhone: updatedData.studentPhone || updatedData.StudentPhone || '',
        programId: updatedData.programId || updatedData.ProgramId || '',
        programTitle: updatedData.programTitle || updatedData.ProgramTitle || '',
        imageUrl: updatedData.imageUrl || updatedData.ImageUrl || null,
        documentUrls: updatedData.documentUrls || updatedData.DocumentUrls || [],
        portfolioLink: updatedData.portfolioLink || updatedData.PortfolioLink || '',
        otherLink: updatedData.otherLink || updatedData.OtherLink || '',
        submittedAt: updatedData.submittedAt || updatedData.SubmittedAt || null,
        statusName: updatedData.statusName || updatedData.StatusName || '',
        status: updatedData.status || updatedData.Status || 0,
        errorCode: updatedData.errorCode || updatedData.ErrorCode || null,
        message: updatedData.message || updatedData.Message || '',
        createdAt: updatedData.createdAt || updatedData.CreatedAt || null,
        updatedAt: updatedData.updatedAt || updatedData.UpdatedAt || null
      };
      setApplication(mappedUpdatedData);
    } catch (err) {
      setError(err.message || 'Không thể nộp hồ sơ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDocument = (documentUrl, index) => {
    setSelectedDocument({
      url: documentUrl,
      title: `Tài liệu hỗ trợ ${index + 1}`
    });
    setShowDocumentModal(true);
  };

  const showMessage = (type, message) => {
    if (type === 'success') {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={48} className="animate-spin text-orange-500 mb-4" />
              <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <AlertTriangle size={64} className="mx-auto text-red-500 mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không thể tải hồ sơ
              </h3>
              <p className="text-gray-600 mb-6">
                {error || 'Hồ sơ này không tồn tại hoặc đã bị xóa'}
              </p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
              >
                <ArrowLeft size={20} className="mr-2" />
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không tìm thấy hồ sơ
              </h3>
              <p className="text-gray-600 mb-6">
                Hồ sơ này không tồn tại hoặc đã bị xóa
              </p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
              >
                <ArrowLeft size={20} className="mr-2" />
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
           {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại danh sách hồ sơ
            </button>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              CHI TIẾT HỒ SƠ XÉT TUYỂN
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              Xem chi tiết và quản lý hồ sơ xét tuyển của bạn
            </p>
          </div>

         

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Messages */}
            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle size={20} className="text-red-600 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-red-700 font-medium">Lỗi:</span>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-green-700 font-medium">Thành công:</span>
                    <p className="text-green-600 text-sm mt-1">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Application Details */}
            <div className="p-8 space-y-8">
              {/* Application Info */}
              

              {/* Student Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin sinh viên
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Họ và tên
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 font-medium">
                        {application.studentName || 'Chưa có thông tin'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Số điện thoại
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">
                        {application.studentPhone || 'Chưa có thông tin'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin chương trình
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Chương trình đào tạo
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 font-medium">
                        {application.programTitle || 'Chưa có thông tin'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Ngày nộp
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">
                        {application.submittedAt
                          ? new Date(application.submittedAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Chưa nộp'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin thời gian
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Ngày tạo
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">
                        {application.createdAt
                          ? new Date(application.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Không có thông tin'
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Cập nhật lần cuối
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">
                        {application.updatedAt
                          ? new Date(application.updatedAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Không có thông tin'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Liên kết
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon size={16} className="inline mr-2" />
                      Liên kết Portfolio
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {application.portfolioLink ? (
                        <a 
                          href={application.portfolioLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {application.portfolioLink}
                        </a>
                      ) : (
                        <p className="text-gray-500 italic">Chưa có</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon size={16} className="inline mr-2" />
                      Liên kết khác
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {application.otherLink ? (
                        <a 
                          href={application.otherLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {application.otherLink}
                        </a>
                      ) : (
                        <p className="text-gray-500 italic">Chưa có</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Ảnh hồ sơ
                </h3>
                {application.imageUrl ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="relative inline-block">
                      <img 
                        src={application.imageUrl} 
                        alt="Ảnh hồ sơ" 
                        className="max-w-xs h-auto rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowImageModal(true)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg cursor-pointer"
                           onClick={() => setShowImageModal(true)}>
                        <ZoomIn size={24} className="text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Nhấp vào ảnh để xem kích thước đầy đủ</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 italic">Chưa có ảnh hồ sơ</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Tài liệu hỗ trợ
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  {application.documentUrls && application.documentUrls.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {application.documentUrls.map((doc, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <FileText size={20} className="text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-gray-700">Tài liệu {index + 1}</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleViewDocument(doc, index)}
                              className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <Eye size={14} className="mr-1" />
                              Xem tài liệu
                            </button>
                            <div className="flex space-x-2">
                              <a 
                                href={doc} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              >
                                <ExternalLink size={12} className="mr-1" />
                                Mở mới
                              </a>
                              <a 
                                href={doc} 
                                download
                                className="flex-1 inline-flex items-center justify-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                              >
                                <Download size={12} className="mr-1" />
                                Tải xuống
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có tài liệu nào</p>
                  )}
                </div>
              </div>

              {/* Messages from API */}
              {application.message && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông báo từ hệ thống</h3>
                  <p className="text-gray-700">{application.message}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                {application.status === 0 && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Edit size={16} className="mr-2" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Đang nộp...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Nộp hồ sơ
                        </>
                      )}
                    </button>
                  </>
                )}
                <button
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={application?.imageUrl}
        title="Ảnh hồ sơ"
      />

      {/* Document Modal */}
      <DocumentModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documentUrl={selectedDocument?.url}
        title={selectedDocument?.title}
      />
    </div>
  );
};

export default ApplicationDetail;