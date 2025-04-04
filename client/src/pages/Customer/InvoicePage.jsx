import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png"; // Import logo

const InvoicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderList, total, tableNumber } = location.state || {}; // Lấy dữ liệu từ state khi chuyển hướng

    const [showPaymentOptions, setShowPaymentOptions] = useState(false); // Hiển thị hộp thoại thanh toán
    const [paymentMethod, setPaymentMethod] = useState("VNPay"); // Phương thức thanh toán mặc định

    const handleCompletePayment = () => {
        if (paymentMethod === "VNPay") {
            // Hiển thị mã QR cho VNPay
            alert("Hiển thị mã QR VNPay để thanh toán!");
        } else {
            // Xử lý thanh toán tiền mặt
            alert("Thanh toán bằng tiền mặt thành công!");
        }

        // Xóa giỏ hàng khỏi localStorage
        localStorage.removeItem("cart");

        // Sau khi thanh toán, chuyển về trang chủ
        navigate("/");
    };

    return (
        <div className="max-w-sm mx-auto bg-gray-100 min-h-screen ">
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
                <img src={Logo} alt="Logo" className="w-25 mx-auto " />
                <p className="text-center text-sm">Số 450 Lê Văn Việt - TP Thủ Đức</p>
                <p className="text-center text-sm">SDT: 0389379012</p>
                <hr className="my-2" />
                <p className="text-sm">Bàn: {tableNumber || "N/A"}</p>
                <p className="text-sm">Phiếu thanh toán: 121</p>
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
                        {orderList?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-right">{item.price.toLocaleString()}Đ</td>
                                <td className="text-right">
                                    {(item.price * item.quantity).toLocaleString()}Đ
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