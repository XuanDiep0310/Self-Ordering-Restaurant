import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/Admin/Admin_header";
import axios from "axios";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Fetch tables from API
  useEffect(() => {
    axios.get("http://localhost:3000/tables")
      .then((response) => setTables(response.data))
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  const handleEditClick = (table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleAddTable = () => {
    setEditingTable({ name: "", capacity: "", status: "available" });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleDeleteTable = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bàn này?")) {
      axios.delete(`http://localhost:3000/tables/${id}`)
        .then(() => {
          setTables((prevTables) => prevTables.filter((table) => table.id !== id));
          alert("Xóa bàn thành công!");
        })
        .catch((error) => console.error("Error deleting table:", error));
    }
  };

  return (
    <div className="min-h-screen background-image relative">
      {/* Header */}
      <AdminHeader title="QUẢN LÝ BÀN" />

      {/* Content */}
      <div className="p-8">
        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md flex items-center text-md shadow-md"
            onClick={handleAddTable}
          >
            <span className="cursor-pointer">Thêm</span>
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
        </div>

        {/* Table List */}
        <div className="grid grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`flex items-center justify-between p-6 rounded-md shadow-md border border-white ${
                table.status === "available" ? "bg-[#7bb7e0]" : "bg-white"
              }`}
            >
              <p className="font-bold text-lg">{table.name}</p>
              <p className="font-bold text-lg">Sức chứa: {table.capacity}</p>
              <div className="flex space-x-2">
                <button
                  className="text-blue-500 focus:outline-none"
                  onClick={() => handleEditClick(table)}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  className="text-red-500 focus:outline-none"
                  onClick={() => handleDeleteTable(table.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-[#124035] rounded-lg p-8 w-2/3">
              <h2 className="text-3xl font-bold text-center text-white py-5">
                {editingTable?.id ? "SỬA BÀN" : "THÊM BÀN"}
              </h2>
              <div className="bg-white p-4 rounded-lg">
                <div className="mb-4">
                  <label className="block text-lg font-bold mb-2">Tên bàn:</label>
                  <input
                    type="text"
                    value={editingTable?.name || ""}
                    onChange={(e) =>
                      setEditingTable({ ...editingTable, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-bold mb-2">Sức chứa:</label>
                  <input
                    type="number"
                    value={editingTable?.capacity || ""}
                    onChange={(e) =>
                      setEditingTable({ ...editingTable, capacity: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-lg font-bold mb-2">Trạng thái:</label>
                  <select
                    value={editingTable?.status || "available"}
                    onChange={(e) =>
                      setEditingTable({ ...editingTable, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="available">Còn trống</option>
                    <option value="occupied">Đã đặt</option>
                  </select>
                </div> */}
                {/* <div className="mb-4">
                  <label className="block text-lg font-bold mb-2">Vị trí:</label>
                  <input
                    type="text"
                    value={editingTable?.location || ""}
                    onChange={(e) =>
                      setEditingTable({ ...editingTable, location: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div> */}
                {/* <div className="mb-4">
                  <label className="block text-lg font-bold mb-2">QR Code:</label>
                  <input
                    type="text"
                    value={editingTable?.qrcode || ""}
                    onChange={(e) =>
                      setEditingTable({ ...editingTable, qrcode: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div> */}
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-green-700 text-white px-4 py-2 rounded-md"
                    onClick={() => console.log("Save table")}
                  >
                    {editingTable?.id ? "Sửa" : "Thêm"}
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
    </div>
  );
};

export default TableManagement;