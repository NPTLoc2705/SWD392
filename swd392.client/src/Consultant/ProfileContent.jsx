// ProfileContent.jsx
import React from "react";
import {
  User,
  Mail,
  Phone,
  Tag,
  UserCircle,
  CheckCircle,
  Save,
  X,
  Eye,
  EyeOff,
  Camera,
  Edit,
} from "lucide-react";

const ProfileContent = ({
  profile,
  editingProfile,
  profileForm,
  handleProfileFormChange,
  handleProfileSave,
  handleProfileCancel,
  profileLoading,
  error,
  showPassword,
  setShowPassword,
  handleProfileEdit,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Hồ sơ cá nhân</h2>
        {!editingProfile && (
          <button
            onClick={handleProfileEdit}
            className="cursor-pointer flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Edit size={16} className="mr-2" />
            Chỉnh sửa
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <X size={20} className="text-red-600 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-red-700 font-medium">Lỗi:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingProfile) {
            handleProfileSave();
          }
        }}
      >
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
              {editingProfile && (
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <Camera size={14} className="text-gray-600" />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {profile?.name || "Tư vấn viên"}
              </h3>
              <p className="text-sm text-gray-500">
                {profile?.role || "Consultant"}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600">Đang hoạt động</span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                {editingProfile ? (
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                    maxLength={100}
                    autoComplete="name"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User size={16} className="text-gray-500 mr-2" />
                    <span>{profile?.name || "Chưa cập nhật"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                {editingProfile ? (
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nhập email"
                    maxLength={100}
                    autoComplete="email"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail size={16} className="text-gray-500 mr-2" />
                    <span>{profile?.email || "Chưa cập nhật"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                {editingProfile ? (
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại (VD: 0901234567)"
                      maxLength={10}
                      autoComplete="tel"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Định dạng: 0x xxxxxxxx (x = 3,5,7,8,9)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone size={16} className="text-gray-500 mr-2" />
                    <span>{profile?.phone || "Chưa cập nhật"}</span>
                  </div>
                )}
              </div>

              {editingProfile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới (để trống nếu không muốn đổi)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={profileForm.password}
                      onChange={handleProfileFormChange}
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu mới"
                      maxLength={100}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tối thiểu 6 ký tự, tối đa 100 ký tự
                  </p>
                </div>
              )}
            </div>

            {/* <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Người dùng
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Tag size={16} className="text-gray-500 mr-2" />
                  <span>{profile?.id || "N/A"}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <UserCircle size={16} className="text-gray-500 mr-2" />
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    {profile?.role || "Consultant"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái tài khoản
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {profile?.isBanned ? "Bị khóa" : "Hoạt động"}
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {editingProfile && (
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {profileLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {profileLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={handleProfileCancel}
                disabled={profileLoading}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                <X size={16} className="mr-2" />
                Hủy
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileContent;