import React, { useState } from "react";
import { updateOrderItemStatus } from "../../services/orderService";

const OrderModal = ({
  tableNumber,
  pendingItems,
  loading,
  error,
  closeModal,
  onStatusUpdate,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [localItems, setLocalItems] = useState(pendingItems);

  // Update localItems when pendingItems changes
  React.useEffect(() => {
    setLocalItems(pendingItems);
  }, [pendingItems]);

  const handleStatusUpdate = async (orderItemId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateOrderItemStatus(orderItemId, newStatus);

      // Update local state immediately
      setLocalItems((prevItems) =>
        prevItems.map((item) =>
          item.orderItemId === orderItemId
            ? { ...item, status: newStatus }
            : item
        )
      );

      // Notify parent component to refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ordered":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Served":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-[#124035] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Bàn {tableNumber}</h2>
          <button
            onClick={closeModal}
            className="text-white hover:bg-white/10 rounded-full p-1 transition-colors"
          >
            <span className="text-3xl cursor-pointer">×</span>
          </button>
        </div>

        {/* Table Header */}
        <div className="bg-[#124035] text-white">
          <div className="grid grid-cols-12 p-3">
            <div className="col-span-1 font-bold">STT</div>
            <div className="col-span-6 font-bold">Tên món</div>
            <div className="col-span-2 font-bold text-right">Số lượng</div>
            <div className="col-span-3 font-bold text-center">Trạng thái</div>
          </div>
        </div>

        {/* Table Content */}
        <div className="max-h-[60vh] overflow-y-auto text-black">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#124035] mx-auto mb-2"></div>
              Đang tải...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 bg-red-50">
              {error}
            </div>
          ) : (
            localItems.map((item, index) => (
              <div
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 items-center p-4">
                  <div className="col-span-1">
                    <p className="font-bold text-gray-600">{index + 1}</p>
                  </div>
                  <div className="col-span-6">
                    <div className="flex items-center">
                      {item.image && (
                        <img
                          src={`${item.image}`}
                          alt={item.dishName}
                          className="w-12 h-12 object-cover rounded-lg mr-3 shadow-sm"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {item.dishName}
                        </h3>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-1">
                            Ghi chú: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="bg-gray-700 text-white rounded-md py-1 px-3 inline-block min-w-[40px] text-center shadow-sm">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <select
                      className={`border rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#124035] focus:border-transparent transition-all ${getStatusColor(
                        item.status || "Ordered"
                      )}`}
                      value={item.status || "Ordered"}
                      onChange={(e) =>
                        handleStatusUpdate(item.orderItemId, e.target.value)
                      }
                      disabled={updatingStatus}
                    >
                      <option value="Ordered">Chưa lên món</option>
                      <option value="Served">Đã phục vụ</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && localItems.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-gray-50">
              Không có món ăn nào đang chờ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
