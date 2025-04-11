import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/Admin/Admin_header";
import Sidebar from "./Sidebar";
import editIcon from "../../assets/images/Change_Icon.png";
import deleteIcon from "../../assets/images/Delete_Icon.png";
import TableModal from "../../components/Admin/TableModal";
import {
  getTableData,
  updateTableStatus,
  deleteTable,
} from "../../services/tableService";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  useEffect(() => {
    getTableData()
      .then((data) => setTables(data))
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  const handleEditClick = (table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleDeleteTable = (tableNumber) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bàn này?")) {
      deleteTable(tableNumber)
        .then(() => {
          setTables((prevTables) =>
            prevTables.filter((table) => table.tableNumber !== tableNumber)
          );
          alert("Xóa bàn thành công!");
        })
        .catch((error) => console.error("Error deleting table:", error));
    }
  };

  const handleSaveTable = () => {
    if (editingTable) {
      updateTableStatus(editingTable.tableNumber, editingTable.status)
        .then((updatedTable) => {
          setTables((prevTables) =>
            prevTables.map((table) =>
              table.tableNumber === updatedTable.tableNumber
                ? updatedTable
                : table
            )
          );
          alert("Cập nhật trạng thái bàn thành công!");
          handleModalClose();
        })
        .catch((error) => console.error("Error updating table status:", error));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTable((prev) => ({ ...prev, [name]: value }));
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const availableTables = tables.filter((table) => table.status === "Available");
  const occupiedTables = tables.filter((table) => table.status === "Occupied");

  const allTables = [...availableTables, ...occupiedTables].sort(
    (a, b) => a.tableNumber - b.tableNumber
  );

  return (
    <div className="min-h-screen background-image relative">
      <AdminHeader title="QUẢN LÝ BÀN" onToggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="p-8">
        <div className="flex justify-end mb-6">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md flex items-center text-md shadow-md"
            onClick={() => alert("Chỉ có thể chỉnh sửa trạng thái bàn.")}
          >
            <span className="cursor-pointer">Thêm</span>
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
        </div>

        <div className="bg-black/50 p-4  h-[400px]">
        <div className="grid grid-cols-3 gap-4">
        {allTables.map((table) => (
            <div
              key={table.tableNumber}
              className={`flex items-center justify-between p-6 rounded-md shadow-md border border-white h-[100px] ${
                table.status === "Available" ? "bg-[#7bb7e0]" : "bg-white"
              }`}
            >
              <p className="font-bold text-lg">{table.name || `Bàn ${table.tableNumber}`}</p>
              <p className="font-bold text-lg">Sức chứa: {table.capacity}</p>
              <div className="flex space-x-2">
                <button
                  className="text-blue-500 focus:outline-none"
                  onClick={() => handleEditClick(table)}
                >
                  <img src={editIcon} alt="Edit" className="w-10 h-10" />
                </button>
                <button
                  className="text-red-500 focus:outline-none"
                  onClick={() => handleDeleteTable(table.tableNumber)}
                >
                  <img src={deleteIcon} alt="Delete" className="w-10 h-9" />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <div className="flex items-center space-x-2">
            <span className="bg-[#7bb7e0] text-black rounded-2xl p-4">Còn trống</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-white text-black rounded-2xl p-4">Hết chỗ</span>
          </div>
        </div>
      </div>

      <TableModal
        isOpen={isModalOpen}
        table={editingTable}
        onClose={handleModalClose}
        onSave={handleSaveTable}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TableManagement;