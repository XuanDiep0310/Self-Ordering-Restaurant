import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [showConfirmClear, setShowConfirmClear] = useState(false); // Hiển thị hộp thoại xác nhận xóa giỏ
    const [showOrderSuccess, setShowOrderSuccess] = useState(false); // Hiển thị hộp thoại gọi món thành công

    useEffect(() => {
        // Lấy giỏ hàng từ localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        setTotal(storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, []);

    const handleQuantityChange = (id, type) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id) {
                if (type === "increase") {
                    item.quantity += 1;
                } else if (type === "decrease" && item.quantity > 1) {
                    item.quantity -= 1;
                }
            }
            return item;
        });

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    const handleClearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
        setTotal(0);
        setShowConfirmClear(false); // Ẩn hộp thoại xác nhận
    };

    const handleOrder = () => {
        // Hiển thị hộp thoại gọi món thành công
        setShowOrderSuccess(true);

        // Xóa giỏ hàng sau khi gọi món
        setCart([]);
        localStorage.removeItem("cart");
        setTotal(0);

        // Ẩn hộp thoại sau 2 giây
        setTimeout(() => {
            setShowOrderSuccess(false);
            navigate("/"); // Chuyển hướng về trang menu
        }, 2000);
    };

    return (
        <div className="max-w-sm mx-auto bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white shadow-md">
                <button
                    className="text-gray-500 text-lg"
                    onClick={() => navigate(-1)} // Quay lại trang trước
                >
                    &#8592; Quay lại
                </button>
                <h1 className="font-bold text-lg">Giỏ hàng</h1>
                <button
                    className="text-red-500 text-sm"
                    onClick={() => setShowConfirmClear(true)} // Hiển thị hộp thoại xác nhận xóa giỏ
                >
                    Xóa giỏ
                </button>
            </div>

            {/* Danh sách món ăn */}
            <div className="p-4">
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500">Giỏ hàng trống</p>
                ) : (
                    cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg"
                            />
                            <div className="flex-1 mx-4">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-500">
                                    {item.price.toLocaleString()}Đ
                                </p>
                                <div className="flex items-center mt-2">
                                    <button
                                        className="text-2xl px-2 border rounded-lg"
                                        onClick={() => handleQuantityChange(item.id, "decrease")}
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{item.quantity}</span>
                                    <button
                                        className="text-2xl px-2 border rounded-lg"
                                        onClick={() => handleQuantityChange(item.id, "increase")}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                className="text-red-500 text-lg"
                                onClick={() => handleRemoveItem(item.id)}
                            >
                                &#10005;
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Hộp thoại xác nhận xóa giỏ */}
            {showConfirmClear && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
                        <p className="text-sm font-semibold mb-4">
                            Bạn có chắc muốn xóa toàn bộ giỏ hàng không?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm"
                                onClick={() => setShowConfirmClear(false)} // Hủy xóa giỏ
                            >
                                Không
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
                                onClick={handleClearCart} // Xóa giỏ hàng
                            >
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hộp thoại gọi món thành công */}
            {showOrderSuccess && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
                        <div className="text-green-500 text-4xl mb-4">✔</div>
                        <p className="text-sm font-semibold">Gọi món thành công</p>
                    </div>
                </div>
            )}

            {/* Tổng tiền và nút xác nhận */}
            {cart.length > 0 && (
                <div className="sticky bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
                    <span className="font-bold text-lg">{total.toLocaleString()}Đ</span>
                    <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleOrder} // Gọi món
                    >
                        Xác nhận và gửi yêu cầu gọi món
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;