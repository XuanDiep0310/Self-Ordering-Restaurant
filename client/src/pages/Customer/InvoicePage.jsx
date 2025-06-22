import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { getBillByTable } from "../../services/orderService";
import { sendNotification } from "../../services/notificationService";
import { createVNPayPayment } from "../../services/paymentService";

const InvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber } = location.state || {};
  const [billItems, setBillItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    const fetchBillItems = async () => {
      try {
        setLoading(true);
        const data = await getBillByTable(tableNumber);
        setBillItems(data);
        const totalAmount = data.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0
        );
        setTotal(totalAmount);
      } catch (error) {
        setError("Không thể tải thông tin hóa đơn. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    if (tableNumber) {
      fetchBillItems();
    } else {
      setError("Không tìm thấy số bàn. Vui lòng thử lại!");
      setLoading(false);
    }
  }, [tableNumber]);

  const handleCompletePayment = async () => {
    try {
      if (!tableNumber) {
        setPaymentMessage("Dữ liệu không hợp lệ. Vui lòng thử lại!");
        return;
      }

      await sendNotification({
        tableNumber: parseInt(tableNumber, 10),
        content: `Khách tại bàn ${tableNumber} đã yêu cầu thanh toán.`,
      });

      if (paymentMethod === "VNPay") {
        const paymentData = {
          total,
          orderId: billItems[0]?.orderId,
          orderInfo: `Thanh toán bàn ${tableNumber}`,
          returnUrl: `http://localhost:3000/vnpay-redirect?tableNumber=${tableNumber}&...`        };
        const response = await createVNPayPayment(paymentData);
        if (response && response.paymentUrl) {
          setPaymentMessage("Đang chuyển hướng đến VNPay...");
          setTimeout(() => {
            window.location.href = response.paymentUrl;
          }, 2000);
        } else {
          setPaymentMessage("Không thể tạo thanh toán VNPay. Vui lòng thử lại!");
        }
      } else {
        setPaymentMessage("Vui lòng chờ nhân viên xác nhận thanh toán...");
        setTimeout(() => {
          navigate(`/customer?tableNumber=${tableNumber}`);
        }, 10000);
      }
    } catch (error) {
      setPaymentMessage("Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
        <button
          className="text-white text-lg"
          onClick={() => navigate(-1)}
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
            {billItems.map((item, index) => (
              <tr key={index}>
                <td>{item.dishName}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">
                  {item.unitPrice.toLocaleString()}Đ
                </td>
                <td className="text-right">
                  {(item.unitPrice * item.quantity).toLocaleString()}Đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr className="my-2" />
        <p className="text-right font-bold">
          Tổng tiền: {total.toLocaleString()}Đ
        </p>
      </div>

      {/* Nút hoàn tất thanh toán */}
      <div className="mt-4">
        <button
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 rounded-lg"
          onClick={() => setShowPaymentOptions(true)}
        >
          Hoàn tất thanh toán
        </button>
      </div>

      {/* Hộp thoại tùy chọn thanh toán */}
      {showPaymentOptions && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPaymentOptions(false)}
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">
              Tùy chọn thanh toán
            </h2>
            <div className="mb-4">
              <p className="text-sm">Phương thức thanh toán:</p>
              <select
                className="w-50 border p-2 rounded-lg"
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
              onClick={handleCompletePayment}
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}

      {/* Thông báo thanh toán */}
      {paymentMessage && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-center text-lg font-bold">{paymentMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;