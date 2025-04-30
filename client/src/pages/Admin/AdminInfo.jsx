import { useState } from "react";
import { updateStaffInfo } from "../../services/staffService"; // Sử dụng staffService
import InputField from "../../components/Admin/InputField";
import Sidebar from "./Sidebar";
import AdminHeader from "../../components/Admin/Admin_header";
import { logout } from "../../services/authService";

const AdminInfo = ({ user, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const { adminId, ...dataToUpdate } = editedUser; // adminId sẽ bị loại bỏ nếu không cần thiết
      const response = await updateStaffInfo(dataToUpdate); // Sử dụng updateStaffInfo

      console.log("Update response:", response);

      const message =
        typeof response === "string"
          ? response
          : response.message || response.success
          ? "Thông tin đã được cập nhật thành công!"
          : "Đã cập nhật thông tin";

      alert(message);
      setIsEditing(false);
    } catch (error) {
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen background-image">
      <AdminHeader title="THÔNG TIN TÀI KHOẢN" onToggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        className="fixed top-0 left-0 h-full bg-gray-800 text-white z-50"
      />
      <div className="flex justify-center items-center py-10">
      <div className="bg-black/60 p-6 rounded shadow-lg w-8/10 relative ">
        <h2 className="text-2xl font-bold text-left text-white">THÔNG TIN QUẢN TRỊ VIÊN</h2>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 space-x-8">
          <div className="w-1/4 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold">
              {user?.fullname?.charAt(0) || "A"}
            </div>
            <div className="mt-12 w-full">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className={`${
                  isLoading ? "bg-white" : "bg-white "
                } text-black px-4 py-3 rounded w-full cursor-pointer transition-colors`}
                disabled={isLoading}
              >
                {isLoading
                  ? "Đang xử lý..."
                  : isEditing
                  ? "Lưu"
                  : "Sửa thông tin cá nhân"}
              </button>
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser({ ...user });
                    setErrorMessage("");
                  }}
                  className="bg-gray-500 text-white px-4 py-3 rounded w-full mt-4 cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-[#124035] text-white px-4 py-3 rounded w-full mt-4 cursor-pointer hover:bg-[#124035] transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="space-y-4 w-3/5 text-white">
            <InputField
              label="Tên quản trị viên"
              name="fullname"
              value={editedUser.fullname || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="bg-white text-black" // Nội dung bên trong là chữ màu đen
              labelClassName="text-white" // Tên label màu trắng
            />
            <InputField
              label="SĐT"
              name="phone"
              value={editedUser.phone || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="bg-white text-black" // Nội dung bên trong là chữ màu đen
              labelClassName="text-white" // Tên label màu trắng
            />
            <InputField
              label="Email"
              name="email"
              value={editedUser.email || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="bg-white text-black" // Nội dung bên trong là chữ màu đen
              labelClassName="text-white" // Tên label màu trắng
            />
            <InputField
              label="Chức vụ"
              name="position"
              value={editedUser.position || ""}
              onChange={handleInputChange}
              disabled={true}
              className="bg-white text-black" // Nội dung bên trong là chữ màu đen
              labelClassName="text-white" // Tên label màu trắng
            />
            <InputField
              label="Lương"
              name="salary"
              value={editedUser.salary || ""}
              onChange={handleInputChange}
              disabled={true}
              className="bg-white text-black" // Nội dung bên trong là chữ màu đen
              labelClassName="text-white" // Tên label màu trắng
            />
            {isEditing && (
              <InputField
                label="Mật khẩu mới"
                name="password"
                type="password"
                value={editedUser.password || ""}
                onChange={handleInputChange}
                placeholder="Để trống nếu không thay đổi mật khẩu"
                className="bg-white text-black" // Nội dung bên trong là chữ màu đen
                labelClassName="text-white" // Tên label màu trắng
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminInfo;
