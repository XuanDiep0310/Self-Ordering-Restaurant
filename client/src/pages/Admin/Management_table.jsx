import React, { useState } from "react";

const TableManagement = () => {
  const [tables, setTables] = useState([
    { name: "Bàn 1", capacity: 4, status: "available" },
    { name: "Bàn 2", capacity: 4, status: "occupied" },
    { name: "Bàn 3", capacity: 4, status: "available" },
    { name: "Bàn 4", capacity: 4, status: "available" },
    { name: "Bàn 5", capacity: 4, status: "occupied" },
    { name: "Bàn 6", capacity: 4, status: "available" },
    { name: "Bàn 7", capacity: 4, status: "available" },
    { name: "Bàn 8", capacity: 4, status: "occupied" },
    { name: "Bàn 9", capacity: 4, status: "available" },
    { name: "Bàn 10", capacity: 4, status: "available" },
    { name: "Bàn 11", capacity: 4, status: "occupied" },
    { name: "Bàn 12", capacity: 4, status: "available" },
    { name: "Bàn 13", capacity: 4, status: "available" },
    { name: "Bàn 14", capacity: 4, status: "occupied" },
    { name: "Bàn 15", capacity: 4, status: "available" },
    { name: "Bàn 16", capacity: 4, status: "available" },
    { name: "Bàn 17", capacity: 4, status: "occupied" },
    { name: "Bàn 18", capacity: 4, status: "available" },
    { name: "Bàn 19", capacity: 4, status: "available" },
    { name: "Bàn 20", capacity: 4, status: "available" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  const handleEditClick = (table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleAddTable = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleSaveTable = () => {
    console.log("Table saved:", editingTable);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen background-image">
      {/* Header */}
      <header className="flex items-center bg-green-700 text-white px-4 py-3 w-1/4">
        <button className="text-2xl mr-4 focus:outline-none">☰</button>
        <h1 className="text-xl font-bold">QUẢN LÝ BÀN</h1>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <button
            className="bg-white text-green-600 px-8 py-4 rounded-md flex items-center text-xl shadow-md"
            onClick={handleAddTable}
          >
            <span className="cursor-pointer">Thêm</span>
            <span className="ml-2 text-2xl">+</span>
          </button>
        </div>

        {/* Table List */}
        <div className="grid grid-cols-4 gap-4">
          {tables.map((table, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-4 rounded-md text-lg ${
                table.status === "occupied"
                  ? "bg-blue-200"
                  : "bg-gray-100"
              }`}
            >
              <div>
                <p className="font-bold">{table.name}</p>
                <p className="text-sm text-gray-600">Sức chứa: {table.capacity}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  className="text-blue-500 focus:outline-none"
                  onClick={() => handleEditClick(table)}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500 focus:outline-none"
                  onClick={() => console.log("Delete clicked for:", table)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {editingTable ? "SỬA BÀN" : "THÊM BÀN"}
            </h2>
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
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-md"
                onClick={handleSaveTable}
              >
                {editingTable ? "Sửa" : "Thêm"}
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
      )}
    </div>
  );
};

export default TableManagement;