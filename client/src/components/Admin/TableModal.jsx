import React from "react";

const TableModal = ({ isOpen, table, onClose, onSave, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          {table?.tableNumber ? "Sửa Bàn" : "Thêm Bàn"}
        </h2>
        <div className="mb-4">
          <label className="block font-bold mb-2">Tên Bàn</label>
          <input
            type="text"
            name="name"
            value={table.name}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Sức Chứa</label>
          <input
            type="number"
            name="capacity"
            value={table.capacity}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Trạng Thái</label>
          <select
            name="status"
            value={table.status}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Available">Trống</option>
            <option value="Occupied">Đã Đặt</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;