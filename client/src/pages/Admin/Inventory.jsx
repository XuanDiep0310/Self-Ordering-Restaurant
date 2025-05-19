import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/Admin/Admin_header";
import Sidebar from "./Sidebar";
import {
  getInventoryItems,
  addInventoryItem,
  getIngredients,
  addIngredient,
  getSuppliers,
} from "../../services/InventoryService";

const Inventory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newItem, setNewItem] = useState({
    ingredientId: "",
    supplierId: "",
    quantity: "",
    unit: "",
  });
  const [newIngredient, setNewIngredient] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const items = await getInventoryItems();
      const ingredientsList = await getIngredients();
      const suppliersList = await getSuppliers();
      setInventoryItems(items);
      setIngredients(ingredientsList);
      setSuppliers(suppliersList);
    };
    fetchData();
  }, []);

  const handleAddItem = async () => {
    // Kiểm tra các trường bắt buộc
    if (!newItem.ingredientId || !newItem.supplierId || !newItem.quantity || !newItem.unit) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      // Chuẩn bị dữ liệu theo đúng định dạng yêu cầu
      const payload = {
        ingredientId: parseInt(newItem.ingredientId, 10), // Đảm bảo `ingredientId` là số
        supplierId: parseInt(newItem.supplierId, 10),    // Đảm bảo `supplierId` là số
        quantity: parseFloat(newItem.quantity),          // Đảm bảo `quantity` là số
        unit: newItem.unit.trim(),                       // Loại bỏ khoảng trắng thừa
      };

      // Gửi dữ liệu đến API
      const addedItem = await addInventoryItem(payload);

      // Cập nhật danh sách sản phẩm trong kho
      setInventoryItems([...inventoryItems, addedItem]);

      // Reset form nhập liệu
      setNewItem({ ingredientId: "", supplierId: "", quantity: "", unit: "" });
      setIsModalOpen(false);
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm sản phẩm vào kho!");
    }
  };

  const handleAddIngredient = async () => {
    if (!newIngredient) {
      alert("Vui lòng nhập tên nguyên liệu mới!");
      return;
    }
    try {
      const addedIngredient = await addIngredient({ name: newIngredient });
      setIngredients([...ingredients, addedIngredient]);
      setNewIngredient("");
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm nguyên liệu mới!");
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplier) {
      alert("Vui lòng nhập tên nhà cung cấp mới!");
      return;
    }
    try {
      const addedSupplier = await addSupplier({ name: newSupplier });
      setSuppliers([...suppliers, addedSupplier]);
      setNewSupplier("");
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm nhà cung cấp mới!");
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
              <label className="block text-lg font-bold mb-2">Nguyên liệu:</label>
              <select
                value={newItem.ingredientId || ""} // Đảm bảo giá trị không phải NaN
                onChange={(e) => setNewItem({ ...newItem, ingredientId: parseInt(e.target.value, 10) || "" })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Chọn nguyên liệu</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
              <div className="flex mt-2">
                <input
                  type="text"
                  placeholder="Thêm nguyên liệu mới"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2"
                />
                <button
                  className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={handleAddIngredient}
                >
                  Thêm
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Nhà cung cấp:</label>
              <select
                value={newItem.supplierId || ""} // Đảm bảo giá trị không phải NaN
                onChange={(e) => setNewItem({ ...newItem, supplierId: parseInt(e.target.value, 10) || "" })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <div className="flex mt-2">
                <input
                  type="text"
                  placeholder="Thêm nhà cung cấp mới"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2"
                />
                <button
                  className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={handleAddSupplier}
                >
                  Thêm
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Số lượng:</label>
              <input
                type="number"
                value={newItem.quantity || ""} // Đảm bảo giá trị không phải NaN
                onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || "" })}
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
                className="bg-green-500 text-white px-4 py-2 rounded-md"
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