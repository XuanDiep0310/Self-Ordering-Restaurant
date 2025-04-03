import React, { useState } from "react";

const EditMenu = () => {
  const [categories, setCategories] = useState([
    { name: "Món chính", items: [] },
    { name: "Tráng miệng", items: [] },
    {
      name: "Đồ uống",
      items: [
        {
          name: "Cocacola",
          price: 15000,
          image: new URL("../assets/images/cocacola.png", import.meta.url).href,
        },
        {
          name: "Pepsi",
          price: 15000,
          image: new URL("../assets/images/pepsi.png", import.meta.url).href,
        },
      ],
    },
    { name: "Khai vị", items: [] },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("Đồ uống");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleMenuClick = () => {
    console.log("Menu icon clicked");
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    console.log("Delete clicked for:", item);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleAddItemModalClose = () => {
    setIsAddItemModalOpen(false);
  };

  const handleSaveCategory = () => {
    console.log("Category saved:", editingCategory);
    setIsModalOpen(false);
  };

  const handleAddItem = () => {
    console.log("Add item clicked");
    setIsAddItemModalOpen(true);
  };

  return (
    <div className="min-h-screen background-image">
      {/* Header */}
      <header className="flex items-center bg-green-700 text-white px-4 py-3 w-1/4">
        <button
          className="text-2xl mr-4 focus:outline-none"
          onClick={handleMenuClick}
        >
          ☰
        </button>
        <h1 className="text-xl font-bold">QUẢN LÝ MENU</h1>
      </header>

      {/* Nội dung */}
      <div className="p-8">
        {/* Thanh hành động */}
        <div className="flex justify-end mb-6">
          <button
            className="bg-white text-green-600 px-8 py-4 rounded-md mr-4 flex items-center text-xl shadow-md"
            onClick={handleAddItem}
          >
            <span className="cursor-pointer">Thêm món</span>
            <span className="ml-2 text-2xl">+</span>
          </button>
          <button
            className="bg-white text-green-600 px-8 py-4 rounded-md flex items-center text-xl shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="cursor-pointer">Thêm danh mục</span>
            <span className="ml-2 text-2xl">+</span>
          </button>
        </div>

        {/* Thanh chứa danh mục và món ăn */}
        <div className="bg-black bg-opacity-40 rounded-lg overflow-hidden">
          {/* Thanh tiêu đề */}
          <div className="flex bg-green-700 text-white text-xl font-bold p-6">
            <div className="w-1/3 text-center">Danh mục</div>
            <div className="w-2/3 text-center">Món ăn</div>
          </div>

          <div className="flex">
            {/* Danh mục */}
            <div className="w-1/3 border-r border-gray-300 p-8">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`flex justify-between items-center p-6 mb-6 rounded-md cursor-pointer text-lg ${
                    selectedCategory === category.name
                      ? "bg-green-600 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span>{category.name}</span>
                  <div className="flex space-x-4">
                    <button
                      className="text-blue-500 focus:outline-none"
                      onClick={() => handleEditClick(category)}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500 focus:outline-none"
                      onClick={() => handleDeleteClick(category)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Món ăn */}
{/* <div className="w-2/3 p-8">
{categories
                .find((cat) => cat.name === selectedCategory)
                ?.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 mb-6 bg-gray-100 rounded-md text-lg h-24"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-md mr-6"
                      />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price} VND</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        className="text-blue-500 focus:outline-none"
                        onClick={() => handleEditClick(item)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-500 focus:outline-none"
                        onClick={() => handleDeleteClick(item)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div> */}
            {/* <div className="w-2/3 p-8">
              {categories
                .find((cat) => cat.name === selectedCategory)
                ?.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 mb-6 bg-gray-100 rounded-md text-lg h-24"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-md mr-6"
                      />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price} VND</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        className="text-blue-500 focus:outline-none"
                        onClick={() => handleEditClick(item)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-500 focus:outline-none"
                        onClick={() => handleDeleteClick(item)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div> */}
            {/* <div className="w-2/3 p-8">
              {categories
                .find((cat) => cat.name === selectedCategory)
                ?.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 mb-6 bg-gray-100 rounded-md text-lg h-24"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-md mr-6"
                      />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price} VND</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        className="text-blue-500 focus:outline-none"
                        onClick={() => handleEditClick(item)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-500 focus:outline-none"
                        onClick={() => handleDeleteClick(item)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div> */}
            <div className="w-2/3 p-8">
              {categories
                .find((cat) => cat.name === selectedCategory)
                ?.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 mb-6 bg-gray-100 rounded-md text-lg h-24"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-md mr-6"
                      />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price} VND</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        className="text-blue-500 focus:outline-none"
                        onClick={handleAddItem} // Mở Modal Thêm Món
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-500 focus:outline-none"
                        onClick={() => handleDeleteClick(item)}
                      >
                        🗑️
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              SỬA DANH MỤC
            </h2>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">
                Tên danh mục:
              </label>
              <input
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
                className="bg-green-700 text-white px-4 py-2 rounded-md"
                onClick={handleSaveCategory}
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
      )}

      {/* Modal Thêm Món */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-2xl font-bold text-green-700 mb-4">THÊM MÓN</h2>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Tên món:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Giá:</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-md"
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