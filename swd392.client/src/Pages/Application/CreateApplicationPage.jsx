import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Link,
  Image,
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import ApplicationService from "./applicationService";

const CreateApplicationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ProgramId: "",
    PortfolioLink: "",
    OtherLink: "",
  });
  const [programs, setPrograms] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await ApplicationService.getPrograms();
        console.log("Programs programs:", data);
        setPrograms(data);
      } catch (err) {
        console.error("Failed to load programs:", err);
        setError("Không thể tải danh sách chương trình đào tạo");
      }
    };
    fetchPrograms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error khi user thay đổi input
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (setFileFunction) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileFunction(e.target.files[0]);

      // Clear validation error khi user chọn file
      setValidationErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files) {
      setDocumentFiles(Array.from(e.target.files));

      // Clear validation error khi user chọn documents
      setValidationErrors((prev) => ({ ...prev, documents: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate chương trình đào tạo
    if (!formData.ProgramId) {
      errors.programId = "Vui lòng chọn chương trình đào tạo";
    }

    // Validate ảnh hồ sơ (bắt buộc)
    if (!imageFile) {
      errors.image = "Vui lòng chọn ảnh hồ sơ";
    }

    // Validate tài liệu hỗ trợ (bắt buộc)
    if (documentFiles.length === 0) {
      errors.documents = "Vui lòng chọn ít nhất một tài liệu hỗ trợ";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showMessage = (type, message) => {
    if (type === "success") {
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
      showMessage("error", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const request = {
        ...formData,
        Image: imageFile,
        Documents: documentFiles,
      };

      const response = await ApplicationService.createDraft(request);
      showMessage("success", "Hồ sơ đã được lưu thành bản nháp thành công!");
      setTimeout(() => {
        navigate(`/nop-ho-so/ho-so-cua-toi`);
      }, 2000);
    } catch (err) {
      showMessage("error", err.message || "Có lỗi xảy ra khi lưu hồ sơ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="relative h-90 overflow-hidden">
        <img
          src="https://cdnphoto.dantri.com.vn/bc3uX5ERqIeMwAf685OpDrEGHQM=/thumb_w/1360/2024/07/19/tcbc-truong-dh-fpt-cong-bo-diem-chuan-xet-tuyen-anh-2-1721359772279.jpg"
          alt="Trường Đại học FPT"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            TẠO HỒ SƠ XÉT TUYỂN
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tạo hồ sơ xét tuyển mới
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              Điền thông tin để tạo hồ sơ xét tuyển của bạn
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle
                    size={20}
                    className="text-green-600 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-green-700 font-medium">
                      Thành công:
                    </span>
                    <p className="text-green-600 text-sm mt-1">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Chương trình đào tạo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User size={16} className="inline mr-2" />
                  Chương trình đào tạo <span className="text-red-500">*</span>
                </label>
                <select
                  name="ProgramId"
                  value={formData.ProgramId}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    validationErrors.programId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">-- Chọn chương trình đào tạo --</option>
                  {Array.isArray(programs) &&
                    programs.map((program) =>
                      program?.Id && program?.Title ? (
                        <option key={program.Id} value={program.Id}>
                          {program.Title}
                        </option>
                      ) : null
                    )}
                </select>
                {validationErrors.programId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {validationErrors.programId}
                  </p>
                )}
              </div>

              {/* Portfolio Link */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Link size={16} className="inline mr-2" />
                  Liên kết Portfolio (Tùy chọn)
                </label>
                <input
                  type="url"
                  name="PortfolioLink"
                  value={formData.PortfolioLink}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="https://example.com/portfolio"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Other Link */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Link size={16} className="inline mr-2" />
                  Liên kết khác (Tùy chọn)
                </label>
                <input
                  type="url"
                  name="OtherLink"
                  value={formData.OtherLink}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Ảnh hồ sơ */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Image size={16} className="inline mr-2" />
                  Ảnh hồ sơ <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label
                    className={`cursor-pointer flex items-center px-4 py-2 rounded-lg shadow transition-colors ${
                      validationErrors.image
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    } text-white disabled:opacity-50`}
                  >
                    <Upload size={16} className="mr-2" />
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange(setImageFile)}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                  {imageFile ? (
                    <span className="text-sm text-gray-700">
                      {imageFile.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Chưa chọn ảnh</span>
                  )}
                </div>
                {validationErrors.image && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {validationErrors.image}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Chọn ảnh đại diện cho hồ sơ của bạn (định dạng: JPG, PNG)
                </p>
              </div>

              {/* Tài liệu hỗ trợ */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FileText size={16} className="inline mr-2" />
                  Tài liệu hỗ trợ <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label
                    className={`cursor-pointer flex items-center px-4 py-2 rounded-lg shadow transition-colors ${
                      validationErrors.documents
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    } text-white disabled:opacity-50`}
                  >
                    <Upload size={16} className="mr-2" />
                    Chọn tài liệu
                    <input
                      type="file"
                      multiple
                      onChange={handleDocumentChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-700">
                    {documentFiles.length > 0
                      ? `${documentFiles.length} tệp đã chọn`
                      : "Chưa chọn tệp nào"}
                  </span>
                </div>
                {validationErrors.documents && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {validationErrors.documents}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Tải lên các tài liệu hỗ trợ như bằng cấp, chứng chỉ, v.v.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transform hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Đang lưu bản nháp...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      <span>Lưu bản nháp</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateApplicationPage;
