import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Lấy danh sách đơn hàng từ localStorage
        const storedOrders = JSON.parse(localStorage.getItem("cart")) || [];
        setOrderList(storedOrders);

        // Tính tổng tiền
        const totalAmount = storedOrders.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);
    }, []);

    const handlePayment = () => {
        // Chuyển hướng sang trang hóa đơn và truyền dữ liệu đơn hàng
        navigate("/invoice", {
            state: {
                orderList,
                total,
                tableNumber: 7, // Thay bằng số bàn thực tế
            },
        });
    };

    return (
        <div className="max-w-sm mx-auto bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
                <button
                    className="text-white text-lg"
                    onClick={() => navigate(-1)} // Quay lại trang trước
                >
                    &#8592; Quay lại
                </button>
                <h1 className="font-bold text-lg">Đơn hàng</h1>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="p-4">
                {orderList.length === 0 ? (
                    <p className="text-center text-gray-500">Không có món nào trong đơn hàng</p>
                ) : (
                    orderList.map((item, index) => (
                        <div
                            key={index}
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
                            </div>
                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg">
                                {item.quantity}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Tổng tiền và nút Thanh toán */}
            {orderList.length > 0 && (
                <div className="sticky bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
                    <span className="font-bold text-lg">Tổng: {total.toLocaleString()}Đ</span>
                    <button
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg"
                        onClick={handlePayment} // Xử lý thanh toán
                    >
                        Thanh toán
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderPage;