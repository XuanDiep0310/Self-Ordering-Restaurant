import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBillByTable } from "../../services/orderService";

const OrderPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("tableNumber");
    const [billItems, setBillItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchBillItems = async () => {
            try {
                const data = await getBillByTable(tableNumber);
                setBillItems(data);

                // Tính tổng tiền
                const totalAmount = data.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
                setTotal(totalAmount);
            } catch (error) {
                console.error(`Error fetching bill for table ${tableNumber}:`, error);
                alert("Đã xảy ra lỗi khi tải hóa đơn. Vui lòng thử lại!");
            }
        };

        fetchBillItems();
    }, [tableNumber]);

    const handlePayment = () => {
        // Điều hướng đến trang hóa đơn
        navigate(`/invoice?tableNumber=${tableNumber}`, {
            state: {
                billItems,
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
                <h1 className="font-bold text-lg">Hóa đơn bàn {tableNumber}</h1>
            </div>

            {/* Content */}
            <div className="p-4 pb-25">
                {billItems.length === 0 ? (
                    <p className="text-center text-gray-500">Không có món ăn nào trong hóa đơn</p>
                ) : (
                    billItems.map((item, index) => (
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
                                {(item.quantity * item.unitPrice).toLocaleString()}Đ
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {billItems.length > 0 && (
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