import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoodById } from "../../services/foodService"; // Import hàm gọi API

const FoodDetailPage = () => {
    const { foodId } = useParams(); // Lấy ID món ăn từ URL
    const navigate = useNavigate();
    const [food, setFood] = useState(null); // State để lưu thông tin món ăn
    const [quantity, setQuantity] = useState(1); // State để lưu số lượng món ăn

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const data = await getFoodById(foodId); // Gọi API để lấy thông tin món ăn
                setFood(data);
            } catch (error) {
                console.error("Error fetching food details:", error);
            }
        };

        fetchFood();
    }, [foodId]);

    if (!food) {
        return <p className="text-center py-4">Đang tải chi tiết món ăn...</p>;
    }

    const handleQuantityChange = (type) => {
        if (type === "increase") {
            setQuantity(quantity + 1);
        } else if (type === "decrease" && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        // Lấy giỏ hàng hiện tại từ localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cart.findIndex((item) => item.id === food.id);

        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
            cart.push({
                id: food.id,
                name: food.name,
                price: food.price,
                image: food.image,
                quantity: quantity,
            });
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Chuyển hướng về trang MenuPage
        navigate("/menu");
    };

    return (
        <div className="max-w-sm mx-auto bg-gray-100 min-h-screen p-4">
            <button
                className="text-yellow-500 text-4xl mb-4 p-2 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
                onClick={() => navigate(-1)} // Quay lại trang trước
            >
                &#8592;
            </button>
            <img
                src={food.image}
                alt={food.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">{food.name}</h1>
            <p className="text-gray-500 text-lg mb-4">{food.price.toLocaleString()}Đ</p>
            <textarea
                placeholder="Bạn có nhắn gì với nhà hàng không?"
                className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        className="text-2xl px-4 py-2 border rounded-lg"
                        onClick={() => handleQuantityChange("decrease")}
                    >
                        -
                    </button>
                    <span className="mx-4">{quantity}</span>
                    <button
                        className="text-2xl px-4 py-2 border rounded-lg"
                        onClick={() => handleQuantityChange("increase")}
                    >
                        +
                    </button>
                </div>
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleAddToCart}
                >
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default FoodDetailPage;