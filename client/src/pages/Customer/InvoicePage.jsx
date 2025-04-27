import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png"; // Import logo
import { updateTableStatus } from "../../services/tableService"; // Import hàm cập nhật trạng thái bàn
import { updateOrderPaymentStatus } from "../../services/orderService"; // Import hàm cập nhật trạng thái thanh toán

const InvoicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderList, total, tableNumber } = location.state || {}; // Lấy dữ liệu từ state khi chuyển hướng

    const [showPaymentOptions, setShowPaymentOptions] = useState(false); // Hiển thị hộp thoại thanh toán
    const [paymentMethod, setPaymentMethod] = useState("VNPay"); // Phương thức thanh toán mặc định
    const [mergedItems, setMergedItems] = useState([]); // Danh sách món đã gộp

    useEffect(() => {
        // Gộp các món từ nhiều đơn hàng thành một danh sách duy nhất
        const merged = {};
        orderList?.forEach((order) => {
            order.items.forEach((item) => {
                if (merged[item.dish_id]) {
                    merged[item.dish_id].quantity += item.quantity;
                } else {
                    merged[item.dish_id] = { ...item };
                }
            });
        });
        setMergedItems(Object.values(merged)); // Chuyển từ object sang array
    }, [orderList]);

    const handleCompletePayment = async () => {
        try {
            if (!orderList || !tableNumber) {
                alert("Dữ liệu không hợp lệ. Vui lòng thử lại!");
                return;
            }

            // Cập nhật trạng thái thanh toán cho tất cả các đơn hàng liên quan đến bàn
            for (const order of orderList) {
                await updateOrderPaymentStatus(order.id, "Paid"); // Gọi API cập nhật trạng thái thanh toán
            }

            // Cập nhật trạng thái bàn về "Available"
            await updateTableStatus(tableNumber, "Available");

            // Hiển thị thông báo thanh toán thành công
            if (paymentMethod === "VNPay") {
                alert("Thanh toán qua VNPay thành công!");
            } else {
                alert("Thanh toán bằng tiền mặt thành công!");
            }

            // Xóa giỏ hàng khỏi localStorage
            localStorage.removeItem("cart");

            // Chuyển về trang HomePage của bàn
            if (tableNumber) {
                navigate(`/customer/home?tableNumber=${tableNumber}`); // Cập nhật link về trang HomePage
            } else {
                alert("Số bàn không hợp lệ. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Error completing payment:", error);
            alert("Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại!");
        }
    };

    return (
        <div className="bg-gray-100 h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
                <button
                    className="text-white text-lg"
                    onClick={() => navigate(-1)} // Quay lại trang trước
                >
                    &#8592; Quay lại
                </button>
                <h1 className="font-bold text-lg">Hóa đơn</h1>
            </div>

            {/* Thông tin hóa đơn */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <img src={Logo} alt="Logo" className="w-25 mx-auto" />
                <p className="text-center text-sm">Số 450 Lê Văn Việt - TP Thủ Đức</p>
                <p className="text-center text-sm">SDT: 0389379012</p>
                <hr className="my-2" />
                <p className="text-sm">Bàn: {tableNumber || "N/A"}</p>
                <p className="text-sm">Phiếu thanh toán: { }</p>
                <hr className="my-2" />

                {/* Danh sách món */}
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className="text-left">Tên món</th>
                            <th>SL</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedItems.map((item, index) => (
                            <tr key={item.dish_id}>
                                <td>{item.dish_name}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-right">{item.unit_price.toLocaleString()}Đ</td>
                                <td className="text-right">
                                    {(item.unit_price * item.quantity).toLocaleString()}Đ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr className="my-2" />
                <p className="text-right font-bold">Tổng tiền: {total.toLocaleString()}Đ</p>
            </div>

            {/* Nút hoàn tất thanh toán */}
            <div className="mt-4">
                <button
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 rounded-lg"
                    onClick={() => setShowPaymentOptions(true)} // Hiển thị tùy chọn thanh toán
                >
                    Hoàn tất thanh toán
                </button>
            </div>

            {/* Hộp thoại tùy chọn thanh toán */}
            {showPaymentOptions && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4 text-center">Tùy chọn thanh toán</h2>
                        <div className="mb-4">
                            <p className="text-sm">Phương thức thanh toán:</p>
                            <select
                                className="w-full border p-2 rounded-lg"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="VNPay">VNPay</option>
                                <option value="Cash">Tiền mặt</option>
                            </select>
                        </div>
                        <p className="text-right font-bold mb-4">
                            Tổng tiền: {total.toLocaleString()}Đ
                        </p>
                        <button
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 rounded-lg"
                            onClick={handleCompletePayment} // Xử lý thanh toán
                        >
                            Thanh toán
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoicePage;