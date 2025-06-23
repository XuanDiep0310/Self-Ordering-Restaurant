import React, { useState, useEffect } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "../../services/categoriesService";
import { getFoodItemsByCategory } from "../../services/foodService";
import "../../assets/styles/scrollbar.css";
import { Link } from "react-router-dom";

const Header = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("tableNumber");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].categoryId); // Chọn danh mục đầu tiên mặc định
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [setSelectedCategory]);

  return (
    <div className="bg-white shadow-md sticky top-0 left-0 w-full z-10">
      <div className="flex items-center justify-between p-4">
        <AiOutlineHome
          className="text-2xl text-yellow-500 cursor-pointer"
          onClick={() => navigate(`/customer?tableNumber=${tableNumber}`)}
        />
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 mx-4 px-4 py-2 border rounded-lg text-sm"
        />
        <AiOutlineSearch className="text-xl text-gray-500" />
      </div>

      {loading ? (
        <p className="text-center py-2">Đang tải danh mục...</p>
      ) : (
        <div className="flex overflow-x-auto whitespace-nowrap bg-white py-2 px-2 scrollbar-custom">
          {categories.map((category) => (
            <button
              key={category.categoryId}
              className={`font-semibold mx-2 ${
                selectedCategory === category.categoryId
                  ? "text-yellow-500 border-b-2 border-yellow-500"
                  : "text-gray-500"
              } hover:text-yellow-500`}
              onClick={() => setSelectedCategory(category.categoryId)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MenuList = ({
  selectedCategory,
  searchTerm,
  cart,
  setCart,
  tableNumber,
}) => {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await getFoodItemsByCategory(selectedCategory);
        const filteredDishes = data.filter((dish) =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDishes(filteredDishes);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) {
      fetchDishes();
    }
  }, [selectedCategory, searchTerm]);

  const handleQuantityChange = (dishId, type) => {
    const updatedCart = cart
      .map((item) => {
        if (item.dishId === dishId) {
          if (type === "increase") {
            return { ...item, quantity: item.quantity + 1 };
          } else if (type === "decrease") {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Loại bỏ sản phẩm có số lượng <= 0

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddToCart = (dish) => {
    const existingItem = cart.find((item) => item.dishId === dish.dishId);

    if (existingItem) {
      // Nếu món ăn đã tồn tại, tăng số lượng
      const updatedCart = cart.map((item) =>
        item.dishId === dish.dishId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // Nếu món ăn chưa tồn tại, thêm mới
      const updatedCart = [
        ...cart,
        {
          dishId: dish.dishId,
          name: dish.name,
          price: dish.price,
          quantity: 1,
        },
      ];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  if (loading) {
    return <p className="text-center py-4">Đang tải món ăn...</p>;
  }

  if (dishes.length === 0) {
    return <p className="text-center py-4">Không có món ăn nào</p>;
  }

  return (
    <div className="p-4 pb-25">
      {dishes.length === 0 ? (
        <p className="text-center py-4">Không có món ăn nào</p>
      ) : (
        dishes.map((dish) => {
          const cartItem = cart.find((item) => item.dishId === dish.dishId); // Kiểm tra món ăn trong giỏ hàng
          const isAvailable = dish.status === "Available";
          return (
            <div
              key={dish.dishId}
              className={`flex items-center shadow-md justify-between p-4 bg-white mb-4 transition-opacity ${
                !isAvailable
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                if (isAvailable) {
                  navigate(`/food/${dish.dishId}?tableNumber=${tableNumber}`);
                }
              }}
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1 mx-4">
                <h3 className="font-semibold">{dish.name}</h3>
                <p className="text-gray-500">{dish.price.toLocaleString()}Đ</p>
              </div>
              {isAvailable ? (
                cartItem ? (
                  <div className="flex items-center">
                    <button
                      className="text-2xl px-2 border rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(dish.dishId, "decrease");
                      }}
                    >
                      -
                    </button>
                    <span className="mx-2">{cartItem.quantity}</span>
                    <button
                      className="text-2xl px-2 border rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(dish.dishId, "increase");
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-yellow-500 text-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(dish);
                    }}
                  >
                    +
                  </button>
                )
              ) : (
                <button
                  className="text-gray-400 text-sm px-3 py-1 border rounded-lg cursor-not-allowed"
                  disabled
                >
                  Hết món
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("tableNumber");

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage khi trang được tải
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  return (
    <div className="bg-gray-100 h-screen overflow-y-auto">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <MenuList
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        cart={cart}
        setCart={setCart}
        tableNumber={tableNumber}
      />
      <div className="fixed shadow-md bottom-0 left-0 w-full bg-white p-4 flex justify-between items-center z-10">
        <span className="font-bold text-lg">
          {cart
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toLocaleString()}
          Đ
        </span>
        <Link
          to={`/cart?tableNumber=${tableNumber}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-center"
        >
          Xem và xác nhận
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;
