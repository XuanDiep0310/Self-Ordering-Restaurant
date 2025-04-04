import React from "react";

const Employees = () => {
  const employees = [
    { name: "Luong Kim Ngan", role: "Nhân viên phục vụ", salary: "7.000.000đ" },
    { name: "Cao Xuan Diep", role: "Bếp trưởng", salary: "20.000.000đ" },
    { name: "Trần Quang Huy", role: "Nhân viên nhà bếp", salary: "7.000.000đ" },
  ];

  const handleAddEmployee = () => {
    console.log("Add employee clicked");
  };

  const handleEditEmployee = (employee) => {
    console.log("Edit employee:", employee);
  };

  const handleDeleteEmployee = (employee) => {
    console.log("Delete employee:", employee);
  };

  return (
    <div className="min-h-screen background-image">
      {/* Header */}
      <header className="flex items-center bg-green-700 text-white px-4 py-3 w-1/4">
        <button
          className="text-2xl mr-4 focus:outline-none"
          onClick={() => console.log("Menu icon clicked")}
        >
          ☰
        </button>
        <h1 className="text-xl font-bold">QUẢN LÝ NHÂN VIÊN</h1>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <button
            className="bg-white text-green-600 px-8 py-4 rounded-md flex items-center text-xl shadow-md"
            onClick={handleAddEmployee}
          >
            <span className="cursor-pointer">Thêm</span>
            <span className="ml-2 text-2xl">+</span>
          </button>
        </div>

        {/* Employee Table */}
        <div className="bg-black bg-opacity-40 rounded-lg mt-8 overflow-hidden">
          {/* Table Header */}
          <div className="flex bg-green-700 text-white text-xl font-bold p-4">
            <div className="w-1/3 text-center">Tên nhân viên</div>
            <div className="w-1/3 text-center">Loại nhân viên</div>
            <div className="w-1/3 text-center">Lương</div>
          </div>

          {/* Table Rows */}
          {employees.map((employee, index) => (
            <div
              key={index}
              className="flex items-center bg-white text-black text-base p-4 mb-4 border-b border-gray-300 rounded-lg shadow-sm"
            >
              <div className="w-1/3 text-center">{employee.name}</div>
              <div className="w-1/3 text-center">{employee.role}</div>
              <div className="w-1/3 flex justify-between items-center px-4">
                <span>{employee.salary}</span>
                <div className="flex space-x-4">
                  <button
                    className="text-blue-500 focus:outline-none hover:text-blue-700"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-500 focus:outline-none hover:text-red-700"
                    onClick={() => handleDeleteEmployee(employee)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Employees;