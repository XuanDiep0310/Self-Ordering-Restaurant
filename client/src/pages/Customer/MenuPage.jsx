import React, { useState, useEffect } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { getCategories } from "../../services/categoriesService";
import { getFoodItemsByCategory } from "../../services/foodService";
import "../../assets/styles/scrollbar.css"; // Import CSS cho scrollbar
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

const Header = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const tableId = location.state?.tableId; // Lấy tableId từ state
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories(); // Gọi API để lấy danh sách danh mục
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0].id); // Chọn danh mục đầu tiên mặc định
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
            {/* Thanh điều hướng */}
            <div className="flex items-center justify-between p-4">
                <AiOutlineHome
                    className="text-2xl text-yellow-500 cursor-pointer"
                    onClick={() => navigate(`/table/${tableId}`)} // Quay lại HomePage với tableId
                />
                <input
                    type="text"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
                    className="flex-1 mx-4 px-4 py-2 border rounded-lg text-sm"
                />
                <AiOutlineSearch className="text-xl text-gray-500" />
            </div>

            {/* Tabs danh mục */}
            {loading ? (
                <p className="text-center py-2">Đang tải danh mục...</p>
            ) : (
                <div className="flex overflow-x-auto whitespace-nowrap bg-white py-2 px-2 scrollbar-custom">
                    {categories.map((category) => (
                        <button
                            key={category.cartegoryId}
                            className={`font-semibold mx-2 ${selectedCategory === category.categoryId
                                    ? "text-yellow-500 border-b-2 border-yellow-500"
                                    : "text-gray-500"
                                } hover:text-yellow-500`}
                            onClick={() => setSelectedCategory(category.categoryId)} // Cập nhật danh mục đã chọn
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const MenuList = ({ selectedCategory, searchTerm, cart, setCart, setTotal }) => {
    const navigate = useNavigate();
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const data = await getFoodItemsByCategory(selectedCategory); // Gọi API để lấy danh sách món ăn theo danh
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

    const handleQuantityChange = (id, type) => {
        let updatedCart = cart.map((item) => {
            if (item.id === id) {
                if (type === "increase") item.quantity += 1;
                else if (type === "decrease") item.quantity -= 1;
            }
            return item;
        });

        // Xóa sản phẩm nếu số lượng là 0
        updatedCart = updatedCart.filter((item) => item.quantity > 0);

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    const handleAddToCart = (dish) => {
        const existingItem = cart.find((item) => item.id === dish.id);

        if (existingItem) {
            handleQuantityChange(dish.id, "increase");
        } else {
            const updatedCart = [...cart, { ...dish, quantity: 1 }];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
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
            {dishes.map((dish) => {
                const cartItem = cart.find((item) => item.id === dish.id);
                return (
                    <div
                        key={dish.id}
                        className="flex items-center shadow-md justify-between p-4 bg-white mb-4 cursor-pointer"
                        onClick={() => navigate(`/food/${dish.id}`)} // Chuyển hướng khi nhấn vào món ăn
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
                        {cartItem ? (
                            <div className="flex items-center">
                                <button
                                    className="text-2xl px-2 border rounded-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuantityChange(dish.id, "decrease");
                                    }}
                                >
                                    -
                                </button>
                                <span className="mx-2">{cartItem.quantity}</span>
                                <button
                                    className="text-2xl px-2 border rounded-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuantityChange(dish.id, "increase");
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
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const MenuPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
    const [cart, setCart] = useState([]); // Giỏ hàng
    const [total, setTotal] = useState(0); // Tổng tiền

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        setTotal(storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, []);

    return (
        <div className="bg-gray-100 h-screen">
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
                setTotal={setTotal}
            />
            {/* Tổng tiền */}
            <div className="fixed shadow-md bottom-0 left-0 w-full bg-white p-4 flex justify-between items-center z-10">
                <span className="font-bold text-lg">{total.toLocaleString()}Đ</span>
                <Link
                    to="/cart" // Chuyển hướng đến trang giỏ hàng
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-center"
                >
                    Xem và xác nhận
                </Link>
            </div>
        </div>
    );
};

export default MenuPage;