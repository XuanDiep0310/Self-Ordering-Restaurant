import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import { getBillByTable, downloadBillPDF } from "../../services/orderService";
import { completeCashPayment } from "../../services/paymentService";

const BillModal = ({ tableNumber, isOpen, onClose }) => {
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [completingPayment, setCompletingPayment] = useState(false);

  const handlePrintBill = async () => {
    try {
      setDownloading(true);
      await downloadBillPDF(tableNumber);
    } catch (error) {
      console.error("Error printing bill:", error);
      setError("Không thể tải hóa đơn PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleCompletePayment = async () => {
    try {
      setCompletingPayment(true);
      const orderId = billItems[0]?.orderId;
      if (!orderId) {
        throw new Error("Không tìm thấy mã đơn hàng");
      }
      await completeCashPayment(orderId);
      onClose();
    } catch (error) {
      console.error("Error completing payment:", error);
      setError("Không thể hoàn tất thanh toán");
    } finally {
      setCompletingPayment(false);
    }
  };

  useEffect(() => {
    const fetchBillData = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        const data = await getBillByTable(tableNumber);
        setBillItems(data);
      } catch (error) {
        setError("Không thể tải thông tin hóa đơn");
        console.error("Error fetching bill:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillData();
  }, [tableNumber, isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-50 bg-white p-6 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-50 bg-white p-6 rounded-lg text-red-500">
          {error}
        </div>
      </div>
    );
  }

  const orderDate = billItems[0]?.orderDate
    ? new Date(billItems[0].orderDate).toLocaleString("vi-VN")
    : "";
  const totalAmount = billItems[0]?.totalAmount || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-white text-black rounded-lg w-[600px] max-h-[80vh] overflow-y-auto z-50">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <img src={Logo} alt="Chef Hats" className="h-12" />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="text-center mt-2">
            <p>Số 450 Lê Văn Việt - TP Thủ Đức</p>
            <p>SĐT: 0389379012</p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            HOÁ ĐƠN THANH TOÁN
          </h2>
          <div className="flex justify-between mb-4">
            <p className="text-lg">Bàn {tableNumber}</p>
            <p className="text-lg">{orderDate}</p>
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">STT</th>
                <th className="text-left p-2">Tên món</th>
                <th className="text-center p-2">SL</th>
                <th className="text-right p-2">Đơn giá</th>
                <th className="text-right p-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.dishName}</td>
                  <td className="text-center p-2">{item.quantity}</td>
                  <td className="text-right p-2">
                    {item.unitPrice.toLocaleString()}đ
                  </td>
                  <td className="text-right p-2">
                    {item.subTotal.toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right border-t pt-4">
            <p className="text-lg font-bold">
              Tổng tiền: {totalAmount.toLocaleString()}đ
            </p>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={downloading || completingPayment}
          >
            Thoát
          </button>
          <button
            onClick={handlePrintBill}
            disabled={downloading || completingPayment}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                <span>Đang tải...</span>
              </>
            ) : (
              <span>In phiếu</span>
            )}
          </button>
          <button
            onClick={handleCompletePayment}
            disabled={downloading || completingPayment}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            {completingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Hoàn tất thanh toán</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
