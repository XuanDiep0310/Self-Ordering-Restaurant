import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import { updateTableStatus } from "../../services/tableService";
import { getFoodById } from "../../services/foodService"; // Đảm bảo có hàm này

const CartPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("tableNumber");
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);

    // Lấy giỏ hàng từ localStorage khi trang được tải
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        setTotal(storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, []);

    // Bổ sung: Lấy lại ảnh từ API nếu thiếu
    useEffect(() => {
        const fetchImages = async () => {
            const updatedCart = await Promise.all(
                cart.map(async (item) => {
                    if (!item.image || item.image.trim() === "") {
                        try {
                            const food = await getFoodById(item.dishId);
                            return { ...item, image: food.image || "" };
                        } catch {
                            return item;
                        }
                    }
                    return item;
                })
            );
            setCart(updatedCart);
        };
        if (cart.length > 0) fetchImages();
        // eslint-disable-next-line
    }, [cart.length]);
    // Xử lý tăng/giảm số lượng món ăn
    const handleQuantityChange = (dishId, type) => {
        const updatedCart = cart.map((item) => {
            if (item.dishId === dishId) {
                if (type === "increase") {
                    return { ...item, quantity: item.quantity + 1 };
                } else if (type === "decrease" && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
            }
            return item;
        });

        const filteredCart = updatedCart.filter((item) => item.quantity > 0);

        setCart(filteredCart);
        localStorage.setItem("cart", JSON.stringify(filteredCart));
        setTotal(filteredCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    // Xóa một món ăn khỏi giỏ hàng
    const handleRemoveItem = (dishId) => {
        const updatedCart = cart.filter((item) => item.dishId !== dishId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    // Xóa toàn bộ giỏ hàng
    const handleClearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
        setTotal(0);
        setShowConfirmClear(false);
    };

    // Gửi yêu cầu gọi món
    const handleOrder = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống. Vui lòng thêm món trước khi gọi món!");
            return;
        }

        try {
            const orderData = {
                tableId: parseInt(tableNumber), // Đảm bảo tableId là số
                items: cart.map((item) => ({
                    dishId: item.dishId,
                    quantity: item.quantity,
                    note: item.note || "",
                })),
            };

            console.log("Order Data:", orderData); // Kiểm tra dữ liệu gửi đi

            // Gửi yêu cầu tạo đơn hàng
            await createOrder(orderData);

            // Cập nhật trạng thái bàn về "Occupied"
            console.log("Updating table status...");
            await updateTableStatus(tableNumber, "Occupied");

            setShowOrderSuccess(true); // Hiển thị thông báo thành công

            // Xóa giỏ hàng sau khi gọi món
            setCart([]);
            localStorage.removeItem("cart");
            setTotal(0);

            // Điều hướng về trang HomePage sau 2 giây
            setTimeout(() => {
                setShowOrderSuccess(false);
                navigate(`/customer?tableNumber=${tableNumber}`); // Quay lại HomePage
            }, 2000);
        } catch (error) {
            if (error.response) {
                console.error("Server response error:", error.response.data); // Log lỗi từ server
            } else if (error.request) {
                console.error("No response received:", error.request); // Log lỗi khi không nhận được phản hồi
            } else {
                console.error("Error:", error.message); // Log lỗi khác
            }
            alert("Đã xảy ra lỗi khi gửi yêu cầu gọi món hoặc cập nhật trạng thái bàn. Vui lòng thử lại!");
        }
    };

    return (
        <div className="bg-gray-100 h-screen overflow-y-auto">
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
                            key={item.dishId}
                            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4"
                        >
                            <img
                                src={
                                    item.image && typeof item.image === "string" && item.image.trim() !== ""
                                        ? (item.image.startsWith("http")
                                            ? item.image
                                            : "/images/" + item.image)
                                        : "/images/no-image.png"
                                }
                                alt={item.name}
                                className="w-16 h-16 rounded-lg"
                                onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/no-image.png";
                                }}
                            />
                            <div className="flex-1 mx-4">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-500">
                                    {item.price.toLocaleString()}Đ
                                </p>
                                <div className="flex items-center mt-2">
                                    <button
                                        className="text-2xl px-2 border rounded-lg"
                                        onClick={() => handleQuantityChange(item.dishId, "decrease")}
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{item.quantity}</span>
                                    <button
                                        className="text-2xl px-2 border rounded-lg"
                                        onClick={() => handleQuantityChange(item.dishId, "increase")}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                className="text-red-500 text-lg"
                                onClick={() => handleRemoveItem(item.dishId)}
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
                        <p className="text-sm font-semibold">Gọi món thành công!</p>
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