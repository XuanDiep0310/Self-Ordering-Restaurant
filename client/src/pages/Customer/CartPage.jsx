import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder } from "../../services/orderService"; // Import hàm tạo đơn hàng

const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Lấy thông tin từ URL hoặc state
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [showConfirmClear, setShowConfirmClear] = useState(false); // Trạng thái hiển thị hộp thoại xác nhận xóa giỏ
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);

    // Lấy tableId từ state được truyền từ HomePage
    const tableId = location.state?.tableId;

    useEffect(() => {
        // Lấy giỏ hàng từ localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        setTotal(storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, []);

    
    const handleClearCart = () => {
        // Xóa giỏ hàng
        setCart([]);
        localStorage.removeItem("cart");
        setTotal(0);
        setShowConfirmClear(false); // Đóng hộp thoại xác nhận
    };

    const handleOrder = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống. Vui lòng thêm món trước khi gọi món!");
            return;
        }

        try {
            const orderData = {
                table_number: tableId, // ID bàn
                items: cart.map((item) => ({
                    dish_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                })),
                total_price: total,
                status: "Ordered", // Trạng thái đơn hàng
                order_date: new Date().toISOString(), // Ngày giờ hiện tại
            };

            await createOrder(orderData);

            setShowOrderSuccess(true);

            // Xóa giỏ hàng sau khi gọi món
            setCart([]);
            localStorage.removeItem("cart");
            setTotal(0);

            setTimeout(() => {
                setShowOrderSuccess(false);
                navigate(`/table/${tableId}`); // Quay lại trang HomePage
            }, 2000);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Đã xảy ra lỗi khi gửi yêu cầu gọi món. Vui lòng thử lại!");
        }
    };

    return (
        <div className="bg-gray-100 h-screen">
            {/* Header */}
            <div className="bg-white shadow-md p-4 sticky top-0 left-0 w-full z-10 items-center justify-between flex h-[10%]">
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
            <div className="p-4 pb-25">
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
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">Bạn có chắc chắn muốn xóa giỏ hàng?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                onClick={handleClearCart} // Xóa giỏ hàng
                            >
                                Xóa
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                                onClick={() => setShowConfirmClear(false)} // Đóng hộp thoại
                            >
                                Hủy
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
                <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
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