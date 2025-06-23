import { useState, useEffect } from "react";
import { updateStaffInfo, getStaffInfo } from "../../services/staffService";
import InputField from "../../components/Admin/InputField";
import Sidebar from "./Sidebar";
import AdminHeader from "../../components/Admin/Admin_header";
import { logout } from "../../services/authService";

const AdminInfo = ({ user: userProp, onClose }) => {
  const [user, setUser] = useState(userProp || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(userProp ? { ...userProp } : {});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userProp) {
      getStaffInfo()
        .then((data) => {
          setUser(data);
          setEditedUser({ ...data });
        })
        .catch(() => setErrorMessage("Không thể lấy thông tin quản trị viên!"));
    }
  }, [userProp]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const { adminId, ...dataToUpdate } = editedUser;
      await updateStaffInfo(dataToUpdate);
      alert("Thông tin đã được cập nhật thành công!");
      setIsEditing(false);
      const updated = await getStaffInfo();
      setUser(updated);
      setEditedUser({ ...updated });
    } catch {
      setErrorMessage("Đã xảy ra lỗi khi cập nhật thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    alert("Đăng xuất thành công!");
    onClose();
  };

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="THÔNG TIN TÀI KHOẢN"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        className="fixed top-0 left-0 h-full bg-gray-800 text-white z-50"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <h1 className="text-3xl font-bold text-white text-center tracking-wide">
              THÔNG TIN QUẢN TRỊ VIÊN
            </h1>
          </div>

          {/* Error Message */}
                      {errorMessage && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 px-6 py-4 rounded-xl mb-6 animate-pulse">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-24">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                      {user?.fullname?.charAt(0) || "A"}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mt-4">
                    {user?.fullname || "Quản trị viên"}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {user?.position || "Administrator"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      isLoading
                        ? "bg-gray-500 cursor-not-allowed"
                        : isEditing
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                          : "bg-gradient-to-r from-[#124035] to-[#1a5c42] hover:from-[#0d2e26] hover:to-[#155238] text-white shadow-lg"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : isEditing ? "Lưu thay đổi" : "Sửa thông tin"}
                  </button>

                  {isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedUser({ ...user });
                        setErrorMessage("");
                      }}
                      className="w-full px-6 py-3 rounded-xl font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30 hover:bg-gray-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Hủy
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 rounded-xl font-medium bg-[#124035] hover:bg-[#0d2e26] text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Chi tiết thông tin
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tên quản trị viên
                      </label>
                      <input
                        name="fullname"
                        value={editedUser.fullname || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                          isEditing
                            ? "bg-white/20 border-[#124035]/50 text-white placeholder-gray-400 focus:border-[#124035] focus:ring-2 focus:ring-[#124035]/20"
                            : "bg-white/10 border-gray-600 text-gray-300 cursor-not-allowed"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        name="phone"
                        value={editedUser.phone || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                          isEditing
                            ? "bg-white/20 border-[#124035]/50 text-white placeholder-gray-400 focus:border-[#124035] focus:ring-2 focus:ring-[#124035]/20"
                            : "bg-white/10 border-gray-600 text-gray-300 cursor-not-allowed"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={editedUser.email || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                          isEditing
                            ? "bg-white/20 border-[#124035]/50 text-white placeholder-gray-400 focus:border-[#124035] focus:ring-2 focus:ring-[#124035]/20"
                            : "bg-white/10 border-gray-600 text-gray-300 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Chức vụ
                      </label>
                      <input
                        name="position"
                        value={editedUser.position || ""}
                        disabled={true}
                        className="w-full px-4 py-3 rounded-xl border bg-white/5 border-gray-700 text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Lương
                      </label>
                      <input
                        name="salary"
                        value={editedUser.salary || ""}
                        disabled={true}
                        className="w-full px-4 py-3 rounded-xl border bg-white/5 border-gray-700 text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Mật khẩu mới
                        </label>
                        <input
                          name="password"
                          type="password"
                          value={editedUser.password || ""}
                          onChange={handleInputChange}
                          placeholder="Để trống nếu không thay đổi mật khẩu"
                          className="w-full px-4 py-3 rounded-xl border bg-white/20 border-[#124035]/50 text-white placeholder-gray-400 focus:border-[#124035] focus:ring-2 focus:ring-[#124035]/20 transition-all duration-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;