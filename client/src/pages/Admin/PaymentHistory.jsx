import React, { useState, useEffect } from "react";
import { getPaymentHistory } from "../../services/revenueService";
import { downloadBillPDF } from "../../services/orderService";
import AdminHeader from "../../components/Admin/Admin_header";
import Sidebar from "./Sidebar";

const PaymentHistory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const data = await getPaymentHistory();
      setPaymentHistory(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch payment history");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Group payments by orderId
  const groupedPayments = paymentHistory.reduce((acc, payment) => {
    const orderId = payment.orderId;
    if (!acc[orderId]) {
      acc[orderId] = {
        orderId,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        tableNumber: payment.tableNumber,
        items: [],
        totalAmount: 0,
      };
    }
    acc[orderId].items.push({
      dishName: payment.dishName,
      quantity: payment.quantity,
      unitPrice: payment.unitPrice,
      subTotal: payment.subTotal || payment.quantity * payment.unitPrice,
    });
    acc[orderId].totalAmount +=
      payment.subTotal || payment.quantity * payment.unitPrice;
    return acc;
  }, {});

  const ordersArray = Object.values(groupedPayments).sort(
    (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
  ); // Sắp xếp theo ngày mới nhất

  const filteredOrders = ordersArray.filter(
    (order) =>
      order.orderId.toString().includes(searchTerm) ||
      order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.dishName.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="LỊCH SỬ HÓA ĐƠN"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="px-4 md:px-8 lg:px-10 py-6 h-[calc(100vh-64px)]">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, món ăn hoặc phương thức..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-80px)]">
          {/* Summary Stats Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-0">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 uppercase">
                Thống kê tổng quan
              </h3>
              <div className="space-y-4 mt-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="text-2xl font-bold mb-1">
                    {filteredOrders.length}
                  </div>
                  <div className="text-blue-100 text-sm">Tổng hóa đơn</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="text-2xl font-bold mb-1">
                    {filteredOrders.reduce(
                      (sum, order) => sum + order.items.length,
                      0
                    )}
                  </div>
                  <div className="text-green-100 text-sm">Tổng món ăn</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="text-2xl font-bold mb-1">
                    {formatCurrency(
                      filteredOrders.reduce(
                        (sum, order) => sum + order.totalAmount,
                        0
                      )
                    )}
                  </div>
                  <div className="text-purple-100 text-sm">Tổng doanh thu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-160">
              <div className="h-full overflow-y-auto pr-2">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <p className="text-gray-500 text-lg">
                      Không tìm thấy hóa đơn nào
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.orderId}
                        className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                      >
                        {/* Order Header */}
                        <div
                          className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer"
                          onClick={() => toggleOrderExpansion(order.orderId)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-lg font-bold">
                                Hóa đơn #{order.orderId}
                              </h3>
                              <p className="text-blue-100 text-sm">
                                {formatDate(order.paymentDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">
                                {formatCurrency(order.totalAmount)}
                              </div>
                              <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs">
                                {order.paymentMethod}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        {expandedOrders.has(order.orderId) && (
                          <div className="p-4">
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-800">
                                      {item.dishName}
                                    </h4>
                                    <p className="text-gray-500 text-sm">
                                      {formatCurrency(item.unitPrice)} ×{" "}
                                      {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-gray-800">
                                      {formatCurrency(item.subTotal)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                              <div className="text-sm text-gray-600">
                                {order.items.length} món
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadBillPDF(
                                    order.orderId,
                                    order.tableNumber
                                  );
                                }}
                                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-1 text-sm"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                <span>In hóa đơn</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
