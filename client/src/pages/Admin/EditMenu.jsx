import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/Admin/Admin_header";
import editIcon from "../../assets/images/Change_Icon.png";
import deleteIcon from "../../assets/images/Delete_Icon.png";
import { getCategories } from "../../services/categoriesService";
import { getFoodItemsByCategory } from "../../services/foodService";
import "../../assets/styles/scrollbar.css";
import CategoryList from "../../components/Admin/CategoryList";
import Sidebar from "./Sidebar";

const EditMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [newItemImage, setNewItemImage] = useState(null); // Thêm trạng thái cho hình ảnh

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const categoryList = await getCategories();
      const categoriesWithItems = await Promise.all(
        categoryList.map(async (cat) => {
          const items = await getFoodItemsByCategory(cat.categoryId);
          return { ...cat, items };
        })
      );
      setCategories(categoriesWithItems);
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
  };

  const handleAddItem = () => {
    setIsAddItemModalOpen(true);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category); // Lưu toàn bộ đối tượng danh mục
    console.log("Selected Category:", category);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory?.name) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    const newCategory = {
      categoryId: editingCategory.categoryId || Date.now().toString(), // Tạo ID mới nếu không có
      name: editingCategory.name,
      description: editingCategory.description || "",
      image: editingCategory.image || "default.jpg",
      status: "Active",
    };

    try {
      const method = editingCategory.categoryId ? "PUT" : "POST";
      const url = editingCategory.categoryId
        ? `http://localhost:8080/api/categories/${editingCategory.categoryId}`
        : "http://localhost:8080/api/categories";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        console.log("Danh mục đã được cập nhật:", updatedCategory);

        // Cập nhật danh sách danh mục trong giao diện
        const updatedCategories = editingCategory.categoryId
          ? categories.map((cat) =>
              cat.categoryId === updatedCategory.categoryId ? updatedCategory : cat
            )
          : [...categories, updatedCategory];

        setCategories(updatedCategories);
        setIsModalOpen(false);
        setEditingCategory(null);
      } else {
        alert("Cập nhật danh mục thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      alert("Đã xảy ra lỗi khi cập nhật danh mục!");
    }
  };

  const handleAddNewItem = async () => {
    if (!selectedCategory || !newItem.name || !newItem.price) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newDish = {
      categoryId: selectedCategory.categoryId, // Lấy ID danh mục đã chọn
      name: newItem.name,
      price: parseFloat(newItem.price),
      image: newItemImage ? URL.createObjectURL(newItemImage) : null, // Tạm thời sử dụng URL preview
      description: "", // Có thể thêm mô tả nếu cần
      status: "Available", // Trạng thái mặc định
    };

    try {
      const response = await fetch("http://localhost:8080/api/dishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDish),
      });

      if (response.ok) {
        const addedDish = await response.json();
        console.log("Món ăn mới đã được thêm:", addedDish);

        // Cập nhật danh sách món ăn trong giao diện
        const updatedCategories = categories.map((cat) => {
          if (cat.categoryId === selectedCategory.categoryId) {
            return {
              ...cat,
              items: [...cat.items, addedDish],
            };
          }
          return cat;
        });
        setCategories(updatedCategories);

        // Reset form
        setNewItem({ name: "", price: "" });
        setNewItemImage(null);
        setIsAddItemModalOpen(false);
      } else {
        alert("Thêm món ăn thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm món ăn:", error);
      alert("Đã xảy ra lỗi khi thêm món ăn!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItemImage(file); // Lưu trữ file hình ảnh được chọn
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/categories/${categoryId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setCategories(categories.filter((cat) => cat.categoryId !== categoryId));
          alert("Danh mục đã được xóa thành công!");
        } else {
          alert("Xóa danh mục thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Đã xảy ra lỗi khi xóa danh mục!");
      }
    }
  };

  const handleDeleteDish = async (dishId, categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/dishes/${dishId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const updatedCategories = categories.map((cat) => {
            if (cat.categoryId === categoryId) {
              return {
                ...cat,
                items: cat.items.filter((item) => item.categoryId !== dishId),
              };
            }
            return cat;
          });

          setCategories(updatedCategories);
          alert("Món ăn đã được xóa thành công!");
        } else {
          alert("Xóa món ăn thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa món ăn:", error);
        alert("Đã xảy ra lỗi khi xóa món ăn!");
      }
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen background-image">
      {/* <AdminHeader title="QUẢN LÝ MENU" /> */}
      <AdminHeader title="QUẢN LÝ MENU" onToggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="px-15">
        <div className="flex justify-end mb-2">
          <button
            className="bg-white text-[#124035] px-6 py-3 rounded-md mr-4 flex items-center text-md shadow-md"
            onClick={handleAddItem}
          >
            <span className="cursor-pointer">Thêm món</span>
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
          <button
            className="bg-white text-[#124035] px-8 py-2 rounded-md flex items-center text-xl shadow-md"
            onClick={handleAddCategoryClick}
          >
            <span className="cursor-pointer">Thêm danh mục</span>
            <span className="ml-2 text-2xl">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
          </button>
        </div>

        <div className="bg-black/70 rounded-lg overflow-hidden w-[100%] h-[550px]">
          <div className="flex bg-[#124035] text-white text-xl font-bold p-3">
            <div className="w-29/100 text-center">Danh mục</div>
            <div className="w-71/100 text-center">Món ăn</div>
          </div>

          <div className="flex">
            <div className="w-3/10 border-r border-gray-300 p-3 overflow-y-auto max-h-[450px]">
              {categories.map((category) => (
                <div
                  key={category.categoryId}
                  className={`flex justify-between items-center p-4 mb-4 rounded-md cursor-pointer text-2xl ${
                    selectedCategory === category.categoryId
                      ? "bg-[#124035] text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category.categoryId)}
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
                          filter:
                            selectedCategory === category.categoryId
                              ? "brightness(0) invert(1)"
                              : "none",
                        }}
                      />
                    </button>
                    <button
                      className="focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.categoryId);
                      }}
                    >
                      <img src={deleteIcon} alt="Delete" className="w-10 h-9" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-7/10 p-3 overflow-y-auto max-h-[450px]">
              {categories.find((cat) => cat.categoryId === selectedCategory)?.items.map((item, index) => (
                <div
                  key={item.dishId || index}
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
                    <button
                      className="focus:outline-none"
                      onClick={() => handleDeleteDish(item.id, selectedCategory)}
                    >
                      <img src={deleteIcon} alt="Delete" className="w-10 h-9" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#124035] rounded-lg p-8 w-2/3">
            <h2 className="text-3xl font-bold text-center text-white py-5">
              {editingCategory?.categoryId ? "SỬA DANH MỤC" : "THÊM DANH MỤC"}
            </h2>
            <div className="bg-white p-2 rounded-lg">
              <div className="mb-4 text-2xl">
                <label className="text-2xl block mb-2">Tên danh mục:</label>
                <input
                  placeholder="Nhập tên danh mục"
                  type="text"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full border bg-gray-300 border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end space-x-4 text-xl">
                <button
                  className="bg-gray-300 text-gray-700 px-8 py-6 rounded-md"
                  onClick={handleUpdateCategory}
                >
                  {editingCategory?.categoryId ? "Sửa" : "Thêm"}
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-8 py-6 rounded-md"
                  onClick={handleModalClose}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#124035] rounded-lg p-8 w-2/3">
            <h2 className="text-2xl font-bold text-center text-white mb-4">THÊM MÓN</h2>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex flex-wrap">
                {/* Danh mục */}
                <div className="w-1/2 px-2 mb-4">
                  <label className="block text-lg font-bold mb-2">Danh mục:</label>
                  <CategoryList
                    categories={categories}
                    onSelectCategory={handleSelectCategory}
                    selectedCategory={selectedCategory}
                  />
                  <label className="block text-lg p-2 font-bold mb-2">Tên món:</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-4"
                  />
                  <label className="block text-lg p-2 font-bold mb-2">Giá:</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-4"
                  />
                </div>

                {/* Hình ảnh */}
                <div className="w-1/2 px-2 mb-4">
                  <label className="block text-lg font-bold mb-2">Hình ảnh:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  {newItemImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(newItemImage)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={handleAddNewItem}
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
        </div>
      )}
    </div>
  );
};

export default EditMenu;
