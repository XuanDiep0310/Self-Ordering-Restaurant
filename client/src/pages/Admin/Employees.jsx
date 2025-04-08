// import React, { useState, useEffect } from "react";
// import AdminHeader from "../../components/Admin/Admin_header";

// const Employees = () => {

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/staff");
//         const data = await response.json();
//         setEmployees(data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleAddEmployee = () => {
//     setEditingEmployee({ name: "", role: "", salary: "" });
//     setIsModalOpen(true);
//   };

//   const handleEditEmployee = (employee) => {
//     setEditingEmployee(employee);
//     setIsModalOpen(true);
//   };

//   const handleDeleteEmployee = (employeeId) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
//       setEmployees(employees.filter((emp) => emp.id !== employeeId));
//       deleteEmployee(employeeId);
//     }
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setEditingEmployee(null);
//   };

//   const handleSaveEmployee = () => {
//     if (!editingEmployee.name || !editingEmployee.role || !editingEmployee.salary) {
//       alert("Vui lòng điền đầy đủ thông tin!");
//       return;
//     }

//     if (editingEmployee.id) {
//       // Update existing employee
//       setEmployees(
//         employees.map((emp) =>
//           emp.id === editingEmployee.id ? editingEmployee : emp
//         )
//       );
//     } else {
//       // Add new employee
//       setEmployees([
//         ...employees,
//         { ...editingEmployee, id: Date.now() },
//       ]);
//     }

//     setIsModalOpen(false);
//     setEditingEmployee(null);
//   };

//   const updateTableInfo = async (tableId, updatedData) => {
//     try {
//       const response = await fetch(`http://localhost:3000/tôi không thể cập nhật thông tin của bàn cho db.json/${tableId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update table information");
//       }

//       alert("Thông tin bàn đã được cập nhật thành công!");
//     } catch (error) {
//       console.error("Error updating table:", error);
//       alert("Có lỗi xảy ra khi cập nhật thông tin bàn.");
//     }
//   };

//   const addEmployee = async (newEmployee) => {
//     try {
//       const response = await fetch("http://localhost:3000/staff", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newEmployee),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add employee");
//       }

//       alert("Nhân viên đã được thêm thành công!");
//     } catch (error) {
//       console.error("Error adding employee:", error);
//       alert("Có lỗi xảy ra khi thêm nhân viên.");
//     }
//   };

//   const deleteEmployee = async (employeeId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/staff/${employeeId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete employee");
//       }

//       alert("Nhân viên đã được xóa thành công!");
//     } catch (error) {
//       console.error("Error deleting employee:", error);
//       alert("Có lỗi xảy ra khi xóa nhân viên.");
//     }
//   };

//   return (
//     <div className="min-h-screen background-image">
//       <AdminHeader title="QUẢN LÝ NHÂN VIÊN" />

//       <div className="px-15">
//         <div className="flex justify-end mb-2">
//           <button
//             className="bg-white text-[#124035] px-6 py-3 rounded-md mr-4 flex items-center text-md shadow-md"
//             onClick={handleAddEmployee}
//           >
//             <span className="cursor-pointer">Thêm nhân viên</span>
//             <span className="ml-2 text-2xl">
//               <i className="fa-solid fa-circle-plus"></i>
//             </span>
//           </button>
//         </div>

//         <div className="bg-black/70 rounded-lg overflow-hidden w-[100%] h-[550px]">
//           <div className="flex bg-[#124035] text-white text-xl font-bold p-3">
//             <div className="w-1/3 text-center">Tên nhân viên</div>
//             <div className="w-1/3 text-center">Loại nhân viên</div>
//             <div className="w-1/3 text-center">Lương</div>
//           </div>

//           <div className="p-3 overflow-y-auto max-h-[450px]">
//             {employees.map((employee) => (
//               <div
//                 key={employee.id}
//                 className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-md"
//               >
//                 <div className="w-1/3 text-center">{employee.name}</div>
//                 <div className="w-1/3 text-center">{employee.role}</div>
//                 <div className="w-1/3 flex justify-between items-center px-4">
//                   <span>{employee.salary}</span>
//                   <div className="flex space-x-4">
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleEditEmployee(employee)}
//                     >
//                       <i className="fa-solid fa-pen text-blue-500"></i>
//                     </button>
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleDeleteEmployee(employee.id)}
//                     >
//                       <i className="fa-solid fa-trash text-red-500"></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={() =>
//           updateTableInfo(1, { status: "Occupied", capacity: 6 })
//         }
//       >
//         Cập nhật bàn
//       </button>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-[#124035] rounded-lg p-8 w-2/3">
//             <h2 className="text-3xl font-bold text-center text-white py-5">
//               {editingEmployee?.id ? "SỬA NHÂN VIÊN" : "THÊM NHÂN VIÊN"}
//             </h2>
//             <div className="bg-white p-4 rounded-lg">
//               <div className="mb-4">
//                 <label className="block text-lg font-bold mb-2">Tên nhân viên:</label>
//                 <input
//                   type="text"
//                   value={editingEmployee?.name || ""}
//                   onChange={(e) =>
//                     setEditingEmployee({ ...editingEmployee, name: e.target.value })
//                   }
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-lg font-bold mb-2">Loại nhân viên:</label>
//                 <input
//                   type="text"
//                   value={editingEmployee?.role || ""}
//                   onChange={(e) =>
//                     setEditingEmployee({ ...editingEmployee, role: e.target.value })
//                   }
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-lg font-bold mb-2">Lương:</label>
//                 <input
//                   type="text"
//                   value={editingEmployee?.salary || ""}
//                   onChange={(e) =>
//                     setEditingEmployee({ ...editingEmployee, salary: e.target.value })
//                   }
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//                   onClick={handleSaveEmployee}
//                 >
//                   {editingEmployee?.id ? "Sửa" : "Thêm"}
//                 </button>
//                 <button
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//                   onClick={handleModalClose}
//                 >
//                   Hủy bỏ
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Employees;

import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/Admin/Admin_header";
import Sidebar from "./Sidebar";

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3000/staff");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = () => {
    setEditingEmployee({
      fullname: "",
      position: "",
      salary: "",
      hire_date: new Date().toISOString().split("T")[0],
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setEmployees(employees.filter((emp) => emp.id !== employeeId));
      deleteEmployee(employeeId);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = async () => {
    const emp = editingEmployee;
    if (!emp.fullname || !emp.position || !emp.salary || !emp.hire_date || !emp.status) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (emp.id) {
      await fetch(`http://localhost:3000/staff/${emp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emp),
      });
      setEmployees(employees.map((e) => (e.id === emp.id ? emp : e)));
    } else {
      const newEmp = {
        ...emp,
        id: Date.now().toString(),
        user_id: Date.now(),
      };
      await addEmployee(newEmp);
      setEmployees([...employees, newEmp]);
    }

    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const addEmployee = async (newEmployee) => {
    try {
      const response = await fetch("http://localhost:3000/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      alert("Nhân viên đã được thêm thành công!");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:3000/staff/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      alert("Nhân viên đã được xóa thành công!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Có lỗi xảy ra khi xóa nhân viên.");
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen background-image">
      <AdminHeader title="QUẢN LÝ NHÂN VIÊN" onToggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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

        {/* <div className="bg-black/70 rounded-lg overflow-hidden w-[100%] h-[550px]">
          <div className="flex bg-[#124035] text-white text-xl font-bold p-3">
            <div className="w-1/3 text-center">Họ tên</div>
            <div className="w-1/3 text-center">Chức vụ</div>
            <div className="w-1/3 text-center">Lương</div>
          </div>

          <div className="p-3 overflow-y-auto max-h-[450px]">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-md"
              >
                <div className="w-1/5 text-center">{employee.fullname}</div>
                <div className="w-1/5 text-center">{employee.position}</div>
                <div className="w-1/5 text-center">{employee.salary.toLocaleString()}đ</div>
                <div className="w-1/5 flex justify-between items-center px-4">
                  <div className="flex left-19   space-x-2">
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
        </div> */}
        <div className="bg-black/70 rounded-lg overflow-hidden w-full h-[550px]">
  <div className="flex bg-[#124035] text-white text-xl font-bold p-3">
    <div className="w-1/4 text-center">Họ tên</div>
    <div className="w-1/4 text-center">Chức vụ</div>
    <div className="w-1/4 text-center">Lương</div>
  </div>

  <div className="p-3 overflow-y-auto max-h-[450px]">
    {employees.map((employee) => (
      <div
        key={employee.id}
        className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-md"
      >
        <div className="w-1/4 text-center">{employee.fullname}</div>
        <div className="w-1/4 text-center">{employee.position}</div>
        <div className="w-1/4 text-center">{employee.salary.toLocaleString()}đ</div>
        <div className="w-1/4 flex justify-center space-x-4">
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
                <label className="block text-lg font-bold mb-2">Họ tên:</label>
                <input
                  type="text"
                  value={editingEmployee?.fullname || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, fullname: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Chức vụ:</label>
                <input
                  type="text"
                  value={editingEmployee?.position || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, position: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Lương:</label>
                <input
                  type="number"
                  value={editingEmployee?.salary || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, salary: Number(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Ngày vào làm:</label>
                <input
                  type="date"
                  value={editingEmployee?.hire_date || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, hire_date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Trạng thái:</label>
                <select
                  value={editingEmployee?.status || "Active"}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
