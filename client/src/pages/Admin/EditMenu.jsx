import "../../assets/styles/scrollbar.css";
import CategoryList from "../../components/Admin/CategoryList";
import Sidebar from "./Sidebar";
import AdminHeader from "../../components/Admin/Admin_header";
import editIcon from "../../assets/images/Change_Icon.png";
import deleteIcon from "../../assets/images/Delete_Icon.png";
import axiosInstance from "../../config/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categoriesService";
import { getFoodItemsByCategory } from "../../services/foodService";
import { deleteFoodItem } from "../../services/foodService";

const EditMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Will be set to first category ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [newItemImage, setNewItemImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryList = await getCategories();
        const categoriesWithItems = await Promise.all(
          categoryList.map(async (cat) => {
            const items = await getFoodItemsByCategory(cat.categoryId);
            return { ...cat, items };
          })
        );
        setCategories(categoriesWithItems);

        // Set default selected category to the first one if available
        if (categoriesWithItems.length > 0) {
          setSelectedCategory(categoriesWithItems[0].categoryId);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAddCategoryClick = () => {
    setEditingCategory({ name: "" });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleAddItemModalClose = () => {
    setIsAddItemModalOpen(false);
    setNewItem({ name: "", price: "" });
    setNewItemImage(null);
  };

  const handleAddItem = () => {
    setIsAddItemModalOpen(true);
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory?.name) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    const newCategory = {
      categoryId: editingCategory.categoryId || Date.now().toString(),
      name: editingCategory.name,
      description: editingCategory.description || "",
      image: editingCategory.image || "default.jpg",
      status: "Active",
    };

    try {
      const method = editingCategory.categoryId ? "put" : "post";
      const url = editingCategory?.categoryId
        ? `api/categories/${editingCategory.categoryId}`
        : "api/categories";

      const response = await axiosInstance({
        method,
        url,
        data: newCategory,
      });

      const updatedCategory = response.data;
      console.log("Danh mục đã được cập nhật:", updatedCategory);

      // Reload categories
      const categoryList = await getCategories();
      const categoriesWithItems = await Promise.all(
        categoryList.map(async (cat) => {
          const items = await getFoodItemsByCategory(cat.categoryId);
          return { ...cat, items };
        })
      );
      setCategories(categoriesWithItems);

      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      alert("Đã xảy ra lỗi khi cập nhật danh mục!");
    }
  };

  const handleEditDish = (dish) => {
    setNewItem({
      name: dish.name,
      price: dish.price,
    });
    setNewItemImage(null); // Reset image
    setIsAddItemModalOpen(true);
  };

  const handleAddNewItem = async () => {
    if (!selectedCategory || !newItem.name || !newItem.price) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("categoryId", selectedCategory);
    if (newItemImage) {
      formData.append("imageFile", newItemImage);
    }

    try {
      await axiosInstance.post("/api/dishes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Làm mới danh sách món ăn sau khi thêm
      const updatedDishes = await getFoodItemsByCategory(selectedCategory);
      const updatedCategories = categories.map((cat) => {
        if (cat.categoryId === selectedCategory) {
          return { ...cat, items: updatedDishes };
        }
        return cat;
      });

      setCategories(updatedCategories);
      setNewItem({ name: "", price: "" });
      setNewItemImage(null);
      setIsAddItemModalOpen(false);
    } catch (error) {
      console.error("Error adding dish:", error);
      alert("Đã xảy ra lỗi khi thêm món ăn!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItemImage(file);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await axiosInstance.delete(`api/categories/${categoryId}`);

        // Remove category from state
        const updatedCategories = categories.filter(
          (cat) => cat.categoryId != categoryId
        );
        setCategories(updatedCategories);

        // If the deleted category was selected, select another one if available
        if (selectedCategory == categoryId) {
          if (updatedCategories.length > 0) {
            setSelectedCategory(updatedCategories[0].categoryId);
          } else {
            setSelectedCategory(null);
          }
        }

        alert("Danh mục đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Đã xảy ra lỗi khi xóa danh mục!");
      }
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      try {
        await deleteFoodItem(dishId);

        const updatedCategories = categories.map((cat) => {
          if (cat.categoryId === selectedCategory) {
            return {
              ...cat,
              items: cat.items.filter((item) => item.dishId !== dishId),
            };
          }
          return cat;
        });

        setCategories(updatedCategories);
        alert("Món ăn đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting dish:", error);
        alert("Đã xảy ra lỗi khi xóa món ăn!");
      }
    }
  };

  // Get current category's items
  const currentCategoryItems =
    categories.find((cat) => cat.categoryId == selectedCategory)?.items || [];

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ MENU"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="px-8 py-4">
        <div className="flex justify-end mb-4">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-lg mr-4 flex items-center text-md shadow-md hover:bg-gray-100 transition-all"
            onClick={handleAddItem}
          >
            <span className="cursor-pointer font-medium">Thêm món</span>
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
          <button
            className="bg-white text-[#124035] px-8 py-3 rounded-lg flex items-center text-md shadow-md hover:bg-gray-100 transition-all"
            onClick={handleAddCategoryClick}
          >
            <span className="cursor-pointer font-medium">Thêm danh mục</span>
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
        </div>

        <div className="bg-black/70 rounded-lg overflow-hidden w-full h-[600px] shadow-xl">
          <div className="flex bg-[#124035] text-white text-xl font-bold p-4">
            <div className="w-3/10 text-center">Danh mục</div>
            <div className="w-7/10 text-center">Món ăn</div>
          </div>

          <div className="flex h-[calc(600px-64px)]">
            {/* Categories column */}
            <div className="w-3/10 border-r border-gray-700 p-4 overflow-y-auto max-h-[536px] bg-black/20">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className={`flex justify-between items-center p-4 mb-4 rounded-lg cursor-pointer text-xl transition-all ${
                      selectedCategory == category.categoryId
                        ? "bg-[#124035] text-white shadow-md"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category.categoryId)}
                  >
                    <span className="font-medium">{category.name}</span>
                    <div className="flex space-x-3">
                      <button
                        className="focus:outline-none hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(category);
                        }}
                      >
                        <img
                          src={editIcon}
                          alt="Edit"
                          className="w-8 h-8"
                          style={{
                            filter:
                              selectedCategory == category.categoryId
                                ? "brightness(0) invert(1)"
                                : "none",
                          }}
                        />
                      </button>
                      <button
                        className="focus:outline-none hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.categoryId);
                        }}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          className="w-8 h-8"
                        />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white py-8">
                  Không có danh mục nào. Hãy thêm danh mục mới!
                </div>
              )}
            </div>

            {/* Food items column */}
            <div className="w-7/10 p-4 overflow-y-auto max-h-[536px] bg-black/10">
              {selectedCategory ? (
                currentCategoryItems.length > 0 ? (
                  currentCategoryItems.map((item) => (
                    <div
                      key={item.dishId}
                      className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || "https://via.placeholder.com/64"}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                        />
                        <p className="font-bold text-lg text-gray-800">
                          {item.name}
                        </p>
                      </div>
                      <div className="text-gray-700 font-medium mx-8">
                        {new Intl.NumberFormat("vi-VN").format(item.price)} VND
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          className="focus:outline-none hover:scale-110 transition-transform"
                          onClick={() => handleEditDish(item)}
                          title="Sửa món ăn"
                        >
                          <img src={editIcon} alt="Edit" className="w-8 h-8" />
                        </button>
                        <button
                          className="focus:outline-none hover:scale-110 transition-transform"
                          onClick={() => handleDeleteDish(item.dishId)}
                          title="Xóa món ăn"
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            className="w-8 h-8"
                          />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white py-12 text-lg">
                    Chưa có món ăn nào trong danh mục này. Hãy thêm món mới!
                  </div>
                )
              ) : (
                <div className="text-center text-white py-12 text-lg">
                  Vui lòng chọn một danh mục
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#124035] rounded-lg p-6 w-1/2 shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-white py-4">
              {editingCategory?.categoryId ? "SỬA DANH MỤC" : "THÊM DANH MỤC"}
            </h2>
            <div className="bg-white p-6 rounded-lg">
              <div className="mb-6">
                <label className="text-xl block mb-2 font-medium">
                  Tên danh mục:
                </label>
                <input
                  placeholder="Nhập tên danh mục"
                  type="text"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#124035]"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-[#124035] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
                  onClick={handleUpdateCategory}
                >
                  {editingCategory?.categoryId
                    ? "Lưu thay đổi"
                    : "Thêm danh mục"}
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all"
                  onClick={handleModalClose}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#124035] rounded-lg p-6 w-2/3 shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-white py-3">
              THÊM MÓN ĂN MỚI
            </h2>
            <div className="bg-white p-6 rounded-lg">
              <div className="flex flex-wrap -mx-2">
                {/* Left column */}
                <div className="w-1/2 px-2 mb-4">
                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">
                      Tên món:
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="Nhập tên món ăn"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#124035]"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">
                      Giá (VND):
                    </label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                      placeholder="Nhập giá món ăn"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#124035]"
                    />
                  </div>
                </div>

                {/* Right column - Image upload */}
                <div className="w-1/2 px-2 mb-4">
                  <label className="block text-lg font-medium mb-2">
                    Hình ảnh món ăn:
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="food-image-upload"
                    />
                    <label
                      htmlFor="food-image-upload"
                      className="cursor-pointer text-[#124035] hover:text-opacity-80"
                    >
                      {newItemImage ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(newItemImage)}
                            alt="Preview"
                            className="max-w-full h-48 object-contain mb-2 rounded-md"
                          />
                          <span className="text-sm">Nhấn để thay đổi</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <i className="fa-solid fa-cloud-arrow-up text-5xl mb-3"></i>
                          <span>Nhấn để tải lên hình ảnh</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-[#124035] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
                  onClick={handleAddNewItem}
                >
                  Thêm món
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all"
                  onClick={handleAddItemModalClose}
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

export default EditMenu;
