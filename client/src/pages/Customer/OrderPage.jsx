import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrdersByTable } from "../../services/orderService"; // Import hàm lấy danh sách order

const OrderPage = () => {
    const navigate = useNavigate();
    const { tableId } = useParams(); // Lấy tableId từ URL
    const [orderList, setOrderList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByTable(tableId); // Gọi API để lấy danh sách đơn hàng
                setOrderList(data);

                // Tính tổng tiền
                const totalAmount = data.reduce((sum, order) => sum + order.total_price, 0);
                setTotal(totalAmount);
            } catch (error) {
                console.error("Error fetching orders:", error);
                alert("Đã xảy ra lỗi khi tải danh sách đơn hàng. Vui lòng thử lại!");
            }
        };

        fetchOrders();
    }, [tableId]);

    const handlePayment = () => {
        // Chuyển hướng sang trang hóa đơn và truyền dữ liệu đơn hàng
        navigate("/invoice", {
            state: {
                orderList,
                total,
                tableNumber: tableId, // Truyền số bàn
            },
        });
    };

    return (
        <div className="bg-gray-100 h-screen">
            {/* Header */}
            <div className="sticky top-0 h-[10%] flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
                <button
                    className="text-white text-lg"
                    onClick={() => navigate(-1)} // Quay lại trang trước
                >
                    &#8592; Quay lại
                </button>
                <h1 className="font-bold text-lg">Đơn hàng bàn {tableId}</h1>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="p-4 pb-25">
                {orderList.length === 0 ? (
                    <p className="text-center text-gray-500">Không có món nào chưa thanh toán</p>
                ) : (
                    orderList.map((order, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white shadow-md rounded-lg mb-4"
                        >
                            <h3 className="font-semibold mb-2">Đơn hàng #{order.id}</h3>
                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg"
                                        />
                                        <div className="flex-1 mx-4">
                                            <h4 className="font-semibold">{item.name}</h4>
                                            <p className="text-gray-500">
                                                {item.quantity} x {item.unit_price.toLocaleString()}Đ
                                            </p>
                                        </div>
                                        <span className="font-bold">
                                            {(item.quantity * item.unit_price).toLocaleString()}Đ
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Tổng tiền và nút Thanh toán */}
            {orderList.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
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