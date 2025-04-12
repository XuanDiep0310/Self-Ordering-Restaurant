import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getFoodById } from "../../services/foodService";
import HeaderDetail from "../../components/Customer/HeaderDetail";
import FoodDetails from "../../components/Customer/FoodDetail";
import CartActions from "../../components/Customer/CartActions";
import FoodImageDetail from "../../components/Customer/FoodImageDetail";
import CustomerNote from "../../components/Customer/CustomerNote";

const FoodDetailPage = () => {
    const { foodId } = useParams(); // Lấy ID món ăn từ URL
    const navigate = useNavigate(); // Điều hướng
    const [searchParams] = useSearchParams(); // Lấy tableNumber từ URL
    const tableNumber = searchParams.get("tableNumber"); // Lấy tableNumber từ URL
    const [food, setFood] = useState(null); // State để lưu thông tin món ăn
    const [quantity, setQuantity] = useState(1); // State để lưu số lượng món ăn
    const [note, setNote] = useState(""); // State để lưu lời nhắn của khách hàng

    // Lấy thông tin món ăn từ API
    useEffect(() => {
        const fetchFood = async () => {
            try {
                const data = await getFoodById(foodId); // Gọi API để lấy thông tin món ăn
                if (!data) {
                    alert("Không tìm thấy thông tin món ăn. Vui lòng thử lại!");
                    navigate(-1); // Quay lại trang trước
                    return;
                }
                setFood(data);

                // Kiểm tra số lượng món ăn trong giỏ hàng
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingItem = cart.find((item) => item.id === data.id);
                if (existingItem) {
                    setQuantity(existingItem.quantity); // Cập nhật số lượng từ giỏ hàng
                    setNote(existingItem.note || ""); // Cập nhật lời nhắn nếu có
                }
            } catch (error) {
                console.error("Error fetching food details:", error);
                alert("Đã xảy ra lỗi khi tải thông tin món ăn. Vui lòng thử lại!");
                navigate(-1); // Quay lại trang trước
            }
        };

        fetchFood();
    }, [foodId, navigate]);

    // Xử lý tăng/giảm số lượng món ăn
    const handleQuantityChange = (type) => {
        if (type === "increase") {
            setQuantity(quantity + 1);
        } else if (type === "decrease" && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Xử lý thêm món ăn vào giỏ hàng
    const handleAddToCart = () => {
        try {
            // Lấy giỏ hàng hiện tại từ localStorage
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItemIndex = cart.findIndex((item) => item.id === food.id);

            if (existingItemIndex !== -1) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng và lời nhắn
                cart[existingItemIndex].quantity = quantity; // Cập nhật số lượng
                cart[existingItemIndex].note = note; // Cập nhật lời nhắn
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
                cart.push({
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    image: food.image,
                    quantity: quantity,
                    note: note, // Thêm lời nhắn
                });
            }

            // Lưu giỏ hàng vào localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Chuyển hướng về trang MenuPage
            navigate(`/menu?tableNumber=${tableNumber}`);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    if (!food) {
        return <p className="text-center py-4">Đang tải chi tiết món ăn...</p>;
    }

    return (
        <div className="bg-gray-100 h-screen ">
            {/* Header */}
            <HeaderDetail />

            {/* Hình ảnh món ăn */}
            <FoodImageDetail image={food?.image || ""} name={food?.name || "Unknown"} />

            {/* Thông tin món ăn */}
            <FoodDetails name={food?.name || "Unknown"} price={food?.price || 0} />

            {/* Lời nhắn của khách hàng */}
            <CustomerNote note={note} setNote={setNote} />

            {/* Hành động thêm vào giỏ hàng */}
            <CartActions
                quantity={quantity}
                onIncrease={() => handleQuantityChange("increase")}
                onDecrease={() => handleQuantityChange("decrease")}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default FoodDetailPage;