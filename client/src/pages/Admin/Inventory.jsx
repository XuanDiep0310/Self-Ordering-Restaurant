import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/Admin/Admin_header";
import Sidebar from "./Sidebar";
import { getInventoryItems, addInventoryItem } from "../../services/InventoryService";

const Inventory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ ingredientName: "", supplierName: "", quantity: "", unit: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      const items = await getInventoryItems();
      setInventoryItems(items);
    };
    fetchInventory();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.ingredientName || !newItem.supplierName || !newItem.quantity || !newItem.unit) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const addedItem = await addInventoryItem(newItem);
      setInventoryItems([...inventoryItems, addedItem]);
      setNewItem({ ingredientName: "", supplierName: "", quantity: "", unit: "" });
      setIsModalOpen(false);
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm sản phẩm!");
    }
  };

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ KHO"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="px-10">
        <div className="flex justify-end mb-4">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            Nhập kho
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#124035] text-white">
              <tr>
                <th className="p-4">Mã sản phẩm</th>
                <th className="p-4">Tên nguyên liệu</th>
                <th className="p-4">Nhà cung cấp</th>
                <th className="p-4">Số lượng</th>
                <th className="p-4">Đơn vị</th>
                <th className="p-4">Cập nhật lần cuối</th>
              </tr>
            </thead>
          </table>
          {/* Thêm thanh cuộn cho nội dung */}
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.inventoryId} className="border-b">
                    <td className="p-4">{item.inventoryId}</td>
                    <td className="p-4">{item.ingredientName}</td>
                    <td className="p-4">{item.supplierName}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">{item.unit}</td>
                    <td className="p-4">{new Date(item.lastUpdated).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-2xl font-bold mb-4">Nhập sản phẩm</h2>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Tên nguyên liệu:</label>
              <input
                type="text"
                value={newItem.ingredientName}
                onChange={(e) => setNewItem({ ...newItem, ingredientName: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Nhà cung cấp:</label>
              <input
                type="text"
                value={newItem.supplierName}
                onChange={(e) => setNewItem({ ...newItem, supplierName: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Số lượng:</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Đơn vị:</label>
              <input
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={handleAddItem}
              >
                Thêm
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)}
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

export default Inventory;