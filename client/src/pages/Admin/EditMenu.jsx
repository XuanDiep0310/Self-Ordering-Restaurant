import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/Admin_header";
import editIcon from "../../assets/images/Change_Icon.png";
import deleteIcon from "../../assets/images/Delete_Icon.png";
import { getCategories } from "../../services/categoriesService";
import { getFoodItemsByCategory } from "../../services/foodService";
import "../../assets/styles/scrollbar.css";

const EditMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const categoryList = await getCategories();
      const categoriesWithItems = await Promise.all(
        categoryList.map(async (cat) => {
          const items = await getFoodItemsByCategory(cat.id);
          return { ...cat, items };
        })
      );
      setCategories(categoriesWithItems);
    };
    fetchData();
  }, []);

  const handleMenuClick = () => {
    navigate("/");
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleAddItemModalClose = () => {
    setIsAddItemModalOpen(false);
  };

  const handleAddItem = () => {
    setIsAddItemModalOpen(true);
  };

  return (
    <div className="min-h-screen background-image">
      {/* Header */}
      <AdminHeader title="QUẢN LÝ MENU" />

      {/* Nội dung */}
      <div className="px-15">
        {/* Thanh hành động */}
        <div className="flex justify-end mb-2">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md mr-4 flex items-center text-md shadow-md"
            onClick={handleAddItem}
          >
            <span className="cursor-pointer">Thêm món</span>
            <span className="ml-2 text-2xl">+</span>
          </button>
          <button
            className="bg-white text-[#124035] px-8 py-2 rounded-md flex items-center text-xl shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="cursor-pointer">Thêm danh mục</span>
            <span className="ml-2 text-2xl">+</span>
          </button>
        </div>

        {/* Thanh chứa danh mục và món ăn */}
        <div className="bg-black/70 rounded-lg overflow-hidden w-[100%] h-[550px]">
          {/* Thanh tiêu đề */}
          <div className="flex bg-[#124035] text-white text-xl font-bold p-3">
            <div className="w-29/100 text-center">Danh mục</div>
            <div className="w-71/100 text-center">Món ăn</div>
          </div>

          <div className="flex">
            {/* Danh mục */}
            <div className="w-3/10 border-r border-gray-300 p-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex justify-between items-center p-4 mb-4 rounded-md cursor-pointer text-2xl ${
                    selectedCategory === category.id
                      ? "bg-[#124035] text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <div className="flex space-x-4">
                    <button
                      className="scale-125 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(category);
                      }}
                    >
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="w-10 h-10"
                        style={{
                          filter: selectedCategory === category.id ? "brightness(0) invert(1)" : "none",
                        }}
                      />
                    </button>
                    <button
                      className="focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="w-10 h-9"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Món ăn */}
            <div className="w-7/10 p-3">
              {categories.find((cat) => cat.id === selectedCategory)?.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between p-1 mb-4 bg-gray-100 rounded-md relative"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "https://via.placeholder.com/64"}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <p className="font-bold text-lg">{item.name}</p>
                  </div>
                  <div className="absolute left-[500px] text-gray-600 text-base">
                    {item.price} VND
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <button className="focus:outline-none">
                      <img src={editIcon} alt="Edit" className="w-10 h-10" />
                    </button>
                    <button className="focus:outline-none">
                      <img src={deleteIcon} alt="Delete" className="w-10 h-9" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm Danh Mục */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#124035] rounded-lg p-8 w-1/3">
            <h2 className="text-2xl font-bold text-center text-white p-2">
              SỬA DANH MỤC
            </h2>
            <div className="bg-white p-2 rounded-lg">
              
              <div className="mb-4">
                <label className="block text-lg mb-2 space-x-3">
                  Tên danh mục:
                </label>
                <input
                className="space-x-7"
                  placeholder="Nhập tên danh mục"
                  type="text"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-[#124035] text-white px-4 py-2 rounded-md"
                  onClick={handleModalClose}
                >
                  Sửa
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

      {/* Modal Thêm Món */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-2xl font-bold text-[#124035] mb-4">THÊM MÓN</h2>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Tên món:</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Giá:</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-[#124035] text-white px-4 py-2 rounded-md"
                onClick={handleAddItemModalClose}
              >
                Thêm
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={handleAddItemModalClose}
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

export default EditMenu;