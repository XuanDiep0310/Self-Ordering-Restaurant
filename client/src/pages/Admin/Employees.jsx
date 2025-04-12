import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/Admin/Admin_header";
import Sidebar from "./Sidebar";
import editIcon from "../../assets/images/Change_Icon.png";
import deleteIcon from "../../assets/images/Delete_Icon.png";
import {
  getAllEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployeeById,
} from "../../services/employeeService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    fullname: "",
    email: "",
    phone: "",
    position: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhân viên:", err);
      }
    };
    fetchData();
  }, []);

  const handleAddEmployee = () => {
    setNewEmployee({
      fullname: "",
      email: "",
      phone: "",
      position: "",
      username: "",
      password: "",
    });
    setIsAddModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await deleteEmployeeById(id);
        setEmployees(employees.filter((emp) => emp.staffId !== id));
        alert("Nhân viên đã được xóa thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa nhân viên:", err);
        alert("Có lỗi xảy ra khi xóa nhân viên.");
      }
    }
  };

  const handleSaveEditedEmployee = async () => {
    try {
      const updatedData = {
        position: editingEmployee.position,
        salary: editingEmployee.salary,
      };
      await updateEmployee(editingEmployee.staffId, updatedData);
      setEmployees(
        employees.map((emp) =>
          emp.staffId === editingEmployee.staffId
            ? { ...emp, ...updatedData }
            : emp
        )
      );
      alert("Nhân viên đã được cập nhật thành công!");
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error("Lỗi khi lưu nhân viên:", err);
      alert("Có lỗi xảy ra khi lưu nhân viên.");
    }
  };

  const handleSubmitNewEmployee = async () => {
    if (
      !newEmployee.fullname ||
      !newEmployee.email ||
      !newEmployee.phone ||
      !newEmployee.position ||
      !newEmployee.username ||
      !newEmployee.password
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const employeeData = {
      fullname: newEmployee.fullname,
      email: newEmployee.email,
      phone: newEmployee.phone,
      position: newEmployee.position,
      username: newEmployee.username,
      password: newEmployee.password,
    };

    try {
      await addNewEmployee(employeeData);
      alert("Nhân viên đã được thêm thành công!");

      // Reload danh sách nhân viên
      const updatedEmployees = await getAllEmployees();
      setEmployees(updatedEmployees);

      // Reset form và đóng modal
      setNewEmployee({
        fullname: "",
        email: "",
        phone: "",
        position: "",
        username: "",
        password: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      alert("Đã xảy ra lỗi khi thêm nhân viên!");
    }
  };

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ NHÂN VIÊN"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="p-10">
        <div className="flex justify-end mb-4 space-x-4">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md mr-4 flex items-center text-md shadow-md"
            onClick={handleAddEmployee}
          >
            Thêm nhân viên
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
        </div>
        <div className="bg-black/50 rounded-lg shadow-lg overflow-auto w-full h-[580px]">
          <div className="flex bg-[#124035] text-white text-xl font-bold p-4">
            <div className="w-3/10 text-center">Họ tên</div>
            <div className="w-3/10 text-center">Chức vụ</div>
            <div className="w-3/10 text-center">Lương</div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {employees.map((emp) => (
              <div
                key={emp.staffId}
                className="flex items-center text-center p-3 mb-2 bg-gray-100 rounded-md hover:shadow transition"
              >
                <div className="w-3/10">{emp.fullname}</div>
                <div className="w-3/10">{emp.position}</div>
                <div className="w-3/10">
                  {Number(emp.salary || 0).toLocaleString()}đ
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditEmployee(emp)}>
                    <img src={editIcon} alt="Edit" className="w-10 h-10" />
                  </button>
                  <button onClick={() => handleDeleteEmployee(emp.staffId)}>
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
            <h2 className="text-2xl font-bold mb-4">Thêm nhân viên</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Họ tên"
                value={newEmployee.fullname}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, fullname: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Chức vụ"
                value={newEmployee.position}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, position: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={newEmployee.username}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, username: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSubmitNewEmployee}
              >
                Thêm
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
            <h2 className="text-2xl font-bold mb-4">Sửa nhân viên</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Chức vụ"
                value={editingEmployee?.position || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    position: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Lương"
                value={editingEmployee?.salary || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    salary: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSaveEditedEmployee}
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

export default Employees;
