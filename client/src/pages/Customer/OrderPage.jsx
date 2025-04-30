import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPendingItemsByTable } from "../../services/orderService";

const OrderPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("tableNumber");
    const [pendingItems, setPendingItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchPendingItems = async () => {
            try {
                const data = await getPendingItemsByTable(tableNumber);
                setPendingItems(data);

                // Tính tổng tiền
                const totalAmount = data.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
                setTotal(totalAmount);
            } catch (error) {
                console.error("Error fetching pending items:", error);
                alert("Đã xảy ra lỗi khi tải danh sách món ăn. Vui lòng thử lại!");
            }
        };

        fetchPendingItems();
    }, [tableNumber]);

    const handlePayment = () => {
        // Điều hướng đến trang hóa đơn
        navigate(`/invoice/customer?tableNumber=${tableNumber}`, {
            state: {
                pendingItems,
                total,
                tableNumber,
            },
        });
    };

    return (
        <div className="bg-gray-100 h-screen overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 h-[10%] flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
                <button
                    className="text-white text-lg"
                    onClick={() => navigate(-1)}
                >
                    &#8592; Quay lại
                </button>
                <h1 className="font-bold text-lg">Món ăn bàn {tableNumber}</h1>
            </div>

            {/* Content */}
            <div className="p-4 pb-25">
                {pendingItems.length === 0 ? (
                    <p className="text-center text-gray-500">Không có món ăn nào đang chờ xử lý</p>
                ) : (
                    pendingItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4"
                        >
                            <img
                                src={item.image}
                                alt={item.dishName}
                                className="w-16 h-16 rounded-lg"
                            />
                            <div className="flex-1 mx-4">
                                <h4 className="font-semibold">{item.dishName}</h4>
                                <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                {item.notes && <p className="text-gray-400 italic">Ghi chú: {item.notes}</p>}
                            </div>
                            <span className="font-bold">
                                {(item.quantity * item.unit_price).toLocaleString()}Đ
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {pendingItems.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
                    <span className="font-bold text-lg">Tổng: {total.toLocaleString()}Đ</span>
                    <button
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg"
                        onClick={handlePayment}
                    >
                        Thanh toán
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderPage;