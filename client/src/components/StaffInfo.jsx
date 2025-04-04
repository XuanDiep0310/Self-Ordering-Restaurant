import { useState } from "react";
import { updateStaffInfo } from "../services/staffService";
import InputField from "./InputField"; // Import InputField component

const StaffInfo = ({ user, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateStaffInfo(user.id, editedUser);
      setIsEditing(false);
      alert("Thông tin đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating staff info:", error);
      alert("Cập nhật thông tin thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 text-white">
      <div className="bg-[#124035] p-6 rounded shadow-lg w-2/3 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 hover:text-black p-2 bg-red-500"
        >
          X
        </button>

        <h2 className="text-xl font-bold text-center">THÔNG TIN NHÂN VIÊN</h2>
        <div className="flex justify-between items-center mt-8 space-x-8">
          <div className="w-1/4 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full">
              <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full" />
            </div>
            <div className="mt-12 w-full">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="bg-blue-500 text-white px-1 py-3 rounded w-full cursor-pointer"
              >
                {isEditing ? "Lưu" : "Sửa thông tin cá nhân"}
              </button>
              <button className="bg-red-500 text-white px-1 py-3 rounded w-full mt-4 cursor-pointer">
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="space-y-4 w-3/5">
            <InputField
              label="Tên nhân viên"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="SĐT"
              name="phone"
              value={editedUser.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Chức vụ"
              name="position"
              value={editedUser.position}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Lương"
              name="salary"
              value={editedUser.salary}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Mật khẩu"
              name="password"
              value={editedUser.password || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInfo;