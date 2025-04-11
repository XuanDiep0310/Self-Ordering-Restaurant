import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import OrderModal from "./OrderModal";

const TableItem = ({ table }) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/api/orders/pending-items/${table.tableNumber}`
      );
      setPendingItems(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu, vui lòng thử lại sau");
      console.error("Error fetching pending items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const handleBellClick = () => {
    setShowOrderModal(true);
    fetchPendingItems();
  };

  const closeModal = () => {
    setShowOrderModal(false);
  };

  const pendingItemCount = pendingItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="text-white flex flex-col">
      <div className="flex justify-between items-center bg-[#124035] p-4">
        <p className="text-lg font-bold">Bàn {table.tableNumber}</p>
        <button className="cursor-pointer">
          <i className="fa-solid fa-bell text-3xl"></i>
        </button>
      </div>
      <div className="flex justify-between items-center bg-[#737373] p-4">
        <button className="cursor-pointer" onClick={handleBellClick}>
          <i className="fa-solid fa-bell-concierge text-4xl relative">
            {pendingItemCount > 0 && (
              <span className="absolute top-[2px] left-[24px] bg-red-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                {pendingItemCount}
              </span>
            )}
          </i>
        </button>
        <button className="cursor-pointer">
          <i className="fa-solid fa-receipt text-4xl"></i>
        </button>
      </div>
      <div className="bg-[#124035] p-2 pl-4">
        <p className="">Sức chứa: {table.capacity}</p>
      </div>

      {/* Hiển thị modal */}
      {showOrderModal && (
        <OrderModal
          tableNumber={table.tableNumber}
          pendingItems={pendingItems}
          loading={loading}
          error={error}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default TableItem;
