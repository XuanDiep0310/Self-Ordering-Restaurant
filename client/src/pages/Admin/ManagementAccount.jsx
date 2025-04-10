import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/Admin/Admin_header";
import Sidebar from "./Sidebar";
import editIcon from "../../assets/images/Change_Icon.png";
import deleteIcon from "../../assets/images/Delete_Icon.png";
import { getAllAccounts, addNewAccount, updateAccount, deleteAccountById } from "../../services/AccountService";

const ManagementAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAccounts();
        setAccounts(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tài khoản:", err);
      }
    };

    fetchData();
  }, []);

  const handleAddAccount = () => {
    setNewAccount({
      username: "",
      email: "",
      phone: "",
      password: "",
    });
    setIsAddModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await deleteAccountById(id);
        setAccounts(accounts.filter((acc) => acc.user_id !== id));
        alert("Tài khoản đã được xóa thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa tài khoản:", err);
        alert("Có lỗi xảy ra khi xóa tài khoản.");
      }
    }
  };

  const handleSaveNewAccount = async () => {
    try {
      const newAcc = await addNewAccount(newAccount);
      setAccounts([...accounts, newAcc]);
      alert("Tài khoản đã được thêm thành công!");
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Lỗi khi thêm tài khoản:", err);
      alert("Có lỗi xảy ra khi thêm tài khoản.");
    }
  };

  const handleSaveEditedAccount = async () => {
    try {
      const updatedData = {
        username: editingAccount.username,
        email: editingAccount.email,
        phone: editingAccount.phone,
      };
      await updateAccount(editingAccount.user_id, updatedData);
      setAccounts(
        accounts.map((acc) =>
          acc.user_id === editingAccount.user_id
            ? { ...acc, ...updatedData }
            : acc
        )
      );
      alert("Tài khoản đã được cập nhật thành công!");
      setIsEditModalOpen(false);
      setEditingAccount(null);
    } catch (err) {
      console.error("Lỗi khi lưu tài khoản:", err);
      alert("Có lỗi xảy ra khi lưu tài khoản.");
    }
  };

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ TÀI KHOẢN"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="p-10">
        <div className="flex justify-end mb-4 space-x-4">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md mr-4 flex items-center text-md shadow-md"
            onClick={handleAddAccount}
          >
            Thêm tài khoản
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
        </div>
        <div className="bg-black/50 rounded-lg shadow-lg overflow-hidden w-full h-[450px]">
          <div className="flex bg-[#124035] text-white text-xl font-bold p-4">
            <div className="w-3/10 text-center">Tên đăng nhập</div>
            <div className="w-3/10 text-center">Email</div>
            <div className="w-3/10 text-center">Số điện thoại</div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {accounts.map((acc) => (
              <div
                key={acc.user_id}
                className="flex items-center text-center p-4 mb-2 bg-gray-100 rounded-md hover:shadow transition"
              >
                <div className="w-3/10">{acc.username}</div>
                <div className="w-3/10">{acc.email}</div>
                <div className="w-3/10">{acc.phone}</div>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEditAccount(acc)}
                  >
                    <img src={editIcon} alt="Edit" className="w-10 h-10" />
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteAccount(acc.user_id)}
                  >
                    <img src={deleteIcon} alt="Delete" className="w-10 h-9" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/2">
            <h2 className="text-2xl font-bold mb-4">Thêm tài khoản</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={newAccount.username || ""}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newAccount.email || ""}
                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newAccount.phone || ""}
                onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={newAccount.password || ""}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSaveNewAccount}
              >
                Lưu
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setIsAddModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/2">
            <h2 className="text-2xl font-bold mb-4">Sửa tài khoản</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={editingAccount.username || ""}
                onChange={(e) => setEditingAccount({ ...editingAccount, username: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingAccount.email || ""}
                onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={editingAccount.phone || ""}
                onChange={(e) => setEditingAccount({ ...editingAccount, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSaveEditedAccount}
              >
                Lưu
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setIsEditModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementAccount;