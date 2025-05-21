import { useState } from "react";
import { updateStaffInfo } from "../../services/staffService";
import InputField from "./InputField";
import { logout } from "../../services/authService";

const StaffInfo = ({ user, onClose }) => {
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

      const { staffId, ...dataToUpdate } = editedUser;
      const response = await updateStaffInfo(dataToUpdate);

      // Log response để xem cấu trúc
      console.log("Update response:", response);

      // Xử lý theo cấu trúc response
      const message =
        typeof response === "string"
          ? response
          : response.message || response.success
          ? "Thông tin đã được cập nhật thành công!"
          : "Đã cập nhật thông tin";

      alert(message);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating staff info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 text-white">
      <div className="bg-[#124035] p-6 rounded shadow-lg w-2/3 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 hover:text-black p-2 bg-red-500 rounded-full h-8 w-8 flex items-center justify-center"
        >
          X
        </button>

        <h2 className="text-xl font-bold text-center">THÔNG TIN NHÂN VIÊN</h2>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 space-x-8">
          <div className="w-1/4 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold">
              {user.fullname?.charAt(0) || "U"}
            </div>
            <div className="mt-12 w-full">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className={`${
                  isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-3 rounded w-full cursor-pointer transition-colors`}
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
                className="bg-red-500 text-white px-4 py-3 rounded w-full mt-4 cursor-pointer hover:bg-red-600 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="space-y-4 w-3/5">
            <InputField
              label="Tên nhân viên"
              name="fullname"
              value={editedUser.fullname || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="SĐT"
              name="phone"
              value={editedUser.phone || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Email"
              name="email"
              value={editedUser.email || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Chức vụ"
              name="position"
              value={editedUser.position || ""}
              onChange={handleInputChange}
              disabled={true}
            />
            <InputField
              label="Lương"
              name="salary"
              value={editedUser.salary || ""}
              onChange={handleInputChange}
              disabled={true}
            />
            {isEditing && (
              <InputField
                label="Mật khẩu mới"
                name="password"
                type="password"
                value={editedUser.password || ""}
                onChange={handleInputChange}
                placeholder="Để trống nếu không thay đổi mật khẩu"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInfo;
