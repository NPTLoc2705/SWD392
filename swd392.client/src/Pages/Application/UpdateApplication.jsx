import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Save,
  X,
  Download,
  Eye
} from 'lucide-react';
import ApplicationService from './applicationService';

const UpdateApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    programId: '',
    programTitle: '',
    studentName: '',
    studentPhone: '',
    portfolioLink: '',
    otherLink: '',
    imageUrl: null,
    documentUrls: []
  });
  const [programs, setPrograms] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch application data
        const appData = await ApplicationService.getById(id);
        // Fetch programs list
        const programsData = await ApplicationService.getPrograms();
        
        console.log('Application data:', appData);
        console.log('Programs data:', programsData);
        
        setPrograms(programsData);
        setFormData({
          programId: appData.programId || appData.ProgramId || '',
          programTitle: appData.programTitle || appData.ProgramTitle || '',
          studentName: appData.studentName || appData.StudentName || '',
          studentPhone: appData.studentPhone || appData.StudentPhone || '',
          portfolioLink: appData.portfolioLink || appData.PortfolioLink || '',
          otherLink: appData.otherLink || appData.OtherLink || '',
          imageUrl: appData.imageUrl || appData.ImageUrl || null,
          documentUrls: appData.documentUrls || appData.DocumentUrls || []
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Không thể tải dữ liệu hồ sơ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error khi user thay đổi input
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProgramChange = (e) => {
    const selectedProgram = programs.find(p => p.Id === e.target.value);
    setFormData(prev => ({
      ...prev,
      programId: e.target.value,
      programTitle: selectedProgram?.Title || ''
    }));

    // Clear validation error
    if (validationErrors.programId) {
      setValidationErrors(prev => ({ ...prev, programId: '' }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      
      // For preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          imageUrl: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);

      // Clear validation error
      setValidationErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      // Check file size (5MB max)
      const validFiles = filesArray.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validFiles.length !== filesArray.length) {
        setError('Một số tệp quá lớn (tối đa 5MB)');
      }
      
      setDocumentFiles(prev => [...prev, ...validFiles]);
      
      // Clear validation error
      setValidationErrors(prev => ({ ...prev, documents: '' }));
    }
  };

  const handleRemoveDocument = (index, isNew = false) => {
    if (isNew) {
      setDocumentFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        documentUrls: prev.documentUrls.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate chương trình đào tạo
    if (!formData.programId) {
      errors.programId = 'Vui lòng chọn chương trình đào tạo';
    }

    // Validate tên sinh viên
    if (!formData.studentName.trim()) {
      errors.studentName = 'Vui lòng nhập họ và tên';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all text fields with correct property names
      formDataToSend.append('StudentName', formData.studentName);
      formDataToSend.append('Student_Phone', formData.studentPhone);
      formDataToSend.append('ProgramId', formData.programId);
      formDataToSend.append('PortfolioLink', formData.portfolioLink);
      formDataToSend.append('OtherLink', formData.otherLink);
      
      // Append image file if a new one was selected
      if (imageFile) {
        formDataToSend.append('Image', imageFile);
      }
      
      // Append document files
      documentFiles.forEach(doc => {
        formDataToSend.append('Documents', doc);
      });

      const apiResponse = await ApplicationService.updateApplication(id, formDataToSend);
      console.log('Update successful:', apiResponse);
      
      showMessage('success', 'Cập nhật hồ sơ thành công!');
      setTimeout(() => {
        navigate(`/nop-ho-so/${id}`);
      }, 2000);
    } catch (err) {
      console.error('Error updating application:', err);
      showMessage('error', err.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/nop-ho-so/${id}`);
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

  if (error && !formData.programId) {
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
              Quay lại chi tiết hồ sơ
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              CHỈNH SỬA HỒ SƠ XÉT TUYỂN
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              Cập nhật thông tin hồ sơ xét tuyển của bạn
            </p>
          </div>

          
          {/* Form */}
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

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Student Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin sinh viên
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <User size={16} className="inline mr-2" />
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        validationErrors.studentName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên"
                      required
                    />
                    {validationErrors.studentName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        {validationErrors.studentName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <User size={16} className="inline mr-2" />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="studentPhone"
                      value={formData.studentPhone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
              </div>

              {/* Program Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Thông tin chương trình
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <User size={16} className="inline mr-2" />
                    Chương trình đào tạo <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="programId"
                    value={formData.programId}
                    onChange={handleProgramChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      validationErrors.programId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">-- Chọn chương trình đào tạo --</option>
                    {programs.map(program => (
                      <option key={program.Id} value={program.Id}>
                        {program.Title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.programId && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {validationErrors.programId}
                    </p>
                  )}
                  {formData.programTitle && (
                    <div className="p-3 bg-gray-50 rounded-lg mt-2">
                      <p className="text-sm text-gray-600">Chương trình đã chọn:</p>
                      <p className="font-medium text-gray-800">{formData.programTitle}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Links Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Liên kết
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <LinkIcon size={16} className="inline mr-2" />
                      Liên kết Portfolio
                    </label>
                    <input
                      type="url"
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="https://example.com/portfolio"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <LinkIcon size={16} className="inline mr-2" />
                      Liên kết khác
                    </label>
                    <input
                      type="url"
                      name="otherLink"
                      value={formData.otherLink}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Ảnh hồ sơ
                </h3>
                <div className="space-y-4">
                  {formData.imageUrl && (
                    <div className="flex items-center space-x-4">
                      <img 
                        src={formData.imageUrl} 
                        alt="Ảnh hồ sơ hiện tại" 
                        className="h-20 w-20 rounded-lg object-cover shadow-md"
                      />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Ảnh hiện tại</p>
                        <p>Chọn ảnh mới để thay thế</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors">
                      <Upload size={16} className="mr-2" />
                      {formData.imageUrl ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                    {imageFile && (
                      <span className="text-sm text-gray-700">
                        Ảnh mới: {imageFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Chọn ảnh đại diện cho hồ sơ của bạn (định dạng: JPG, PNG)
                  </p>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                  Tài liệu hỗ trợ
                </h3>
                
                {/* Existing Documents */}
                {formData.documentUrls.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Tài liệu hiện có:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.documentUrls.map((doc, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={16} className="text-blue-600 mr-2" />
                              <span className="text-sm text-gray-700">Tài liệu {index + 1}</span>
                            </div>
                            <div className="flex space-x-2">
                              <a 
                                href={doc} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <Eye size={14} />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument(index, false)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Documents */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors">
                      <Upload size={16} className="mr-2" />
                      Thêm tài liệu mới
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleDocumentChange}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-700">
                      {documentFiles.length > 0 
                        ? `${documentFiles.length} tệp mới đã chọn` 
                        : 'Chưa chọn tệp mới nào'}
                    </span>
                  </div>

                  {/* New Documents Preview */}
                  {documentFiles.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Tài liệu mới sẽ được thêm:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {documentFiles.map((doc, index) => (
                          <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText size={16} className="text-green-600 mr-2" />
                                <div className="text-sm">
                                  <p className="text-gray-700 truncate">{doc.name}</p>
                                  <p className="text-xs text-gray-500">{Math.round(doc.size / 1024)} KB</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument(index, true)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Hỗ trợ PDF, DOC, DOCX (Tối đa 5MB mỗi file)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    <X size={16} className="mr-2" />
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateApplication;