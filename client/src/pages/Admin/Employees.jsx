import React, { useState } from "react";
import AdminHeader from "../../components/Admin/Admin_header";

const Employees = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Luong Kim Ngan", role: "Nhân viên phục vụ", salary: "7.000.000đ" },
    { id: 2, name: "Cao Xuan Diep", role: "Bếp trưởng", salary: "20.000.000đ" },
    { id: 3, name: "Trần Quang Huy", role: "Nhân viên nhà bếp", salary: "7.000.000đ" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleAddEmployee = () => {
    setEditingEmployee({ name: "", role: "", salary: "" });
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setEmployees(employees.filter((emp) => emp.id !== employeeId));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = () => {
    if (!editingEmployee.name || !editingEmployee.role || !editingEmployee.salary) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingEmployee.id) {
      // Update existing employee
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id ? editingEmployee : emp
        )
      );
    } else {
      // Add new employee
      setEmployees([
        ...employees,
        { ...editingEmployee, id: Date.now() },
      ]);
    }

    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen background-image">
      <AdminHeader title="QUẢN LÝ NHÂN VIÊN" />

      <div className="px-15">
        <div className="flex justify-end mb-2">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md mr-4 flex items-center text-md shadow-md"
            onClick={handleAddEmployee}
          >
            <span className="cursor-pointer">Thêm nhân viên</span>
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
        </div>

        <div className="bg-black/70 rounded-lg overflow-hidden w-[100%] h-[550px]">
          <div className="flex bg-[#124035] text-white text-xl font-bold p-3">
            <div className="w-1/3 text-center">Tên nhân viên</div>
            <div className="w-1/3 text-center">Loại nhân viên</div>
            <div className="w-1/3 text-center">Lương</div>
          </div>

          <div className="p-3 overflow-y-auto max-h-[450px]">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-md"
              >
                <div className="w-1/3 text-center">{employee.name}</div>
                <div className="w-1/3 text-center">{employee.role}</div>
                <div className="w-1/3 flex justify-between items-center px-4">
                  <span>{employee.salary}</span>
                  <div className="flex space-x-4">
                    <button
                      className="focus:outline-none"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <i className="fa-solid fa-pen text-blue-500"></i>
                    </button>
                    <button
                      className="focus:outline-none"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <i className="fa-solid fa-trash text-red-500"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#124035] rounded-lg p-8 w-2/3">
            <h2 className="text-3xl font-bold text-center text-white py-5">
              {editingEmployee?.id ? "SỬA NHÂN VIÊN" : "THÊM NHÂN VIÊN"}
            </h2>
            <div className="bg-white p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Tên nhân viên:</label>
                <input
                  type="text"
                  value={editingEmployee?.name || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Loại nhân viên:</label>
                <input
                  type="text"
                  value={editingEmployee?.role || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Lương:</label>
                <input
                  type="text"
                  value={editingEmployee?.salary || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, salary: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={handleSaveEmployee}
                >
                  {editingEmployee?.id ? "Sửa" : "Thêm"}
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={handleModalClose}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;