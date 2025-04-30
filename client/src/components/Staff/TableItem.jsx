import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import OrderModal from "./OrderModal";
import BillModal from "./BillModal";
import { subscribeTopic } from "../../config/websocket";

const TableItem = ({ table }) => {
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showBillModal, setShowBillModal] = useState(false);
    const [pendingItems, setPendingItems] = useState([]); // Đảm bảo giá trị mặc định là mảng
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPendingItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(
                `/api/orders/pending-items/${table.tableNumber}`
            );
            const data = Array.isArray(response.data) ? response.data : [];
            setPendingItems(data);
        } catch (err) {
            setError("Không thể tải dữ liệu, vui lòng thử lại sau");
            console.error("Error fetching pending items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingItems();
        let subscriptions = [];
        let mounted = true;

        const setupSubscriptions = async () => {
            try {
                console.log(`Setting up subscriptions for table ${table.tableNumber}`);

                // Subscribe to table-specific dish updates
                const dishSubscription = await subscribeTopic(
                    `/topic/table-dishes/${table.tableNumber}`,
                    (data) => {
                        if (!mounted) return;
                        console.log(`Received dish update for table ${table.tableNumber}:`, data);
                        if (Array.isArray(data)) {
                            setPendingItems(data);
                        }
                    }
                );

                // Subscribe to table status updates
                const tableSubscription = await subscribeTopic(
                    `/topic/tables`,
                    (data) => {
                        if (!mounted) return;
                        console.log(`Received tables update:`, data);
                    }
                );

                if (dishSubscription) subscriptions.push(dishSubscription);
                if (tableSubscription) subscriptions.push(tableSubscription);
            } catch (error) {
                console.error('Error setting up subscriptions:', error);
            }
        };

        setupSubscriptions();

        return () => {
            mounted = false;
            console.log(`Cleaning up WebSocket for table ${table.tableNumber}`);
            subscriptions.forEach(sub => {
                if (sub) sub.unsubscribe();
            });
            // Don't disconnect here as other components might be using the connection
        };
    }, [table.tableNumber]);

    const handleBellClick = () => {
        setShowOrderModal(true);
        fetchPendingItems();
    };

    const closeModal = () => {
        setShowOrderModal(false);
    };

    const pendingItemCount = Array.isArray(pendingItems)
        ? pendingItems.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

    const handleReceiptClick = () => {
        setShowBillModal(true);
    };

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
                <button className="cursor-pointer" onClick={handleReceiptClick}>
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

            {/* Add BillModal */}
            <BillModal
                tableNumber={table.tableNumber}
                isOpen={showBillModal}
                onClose={() => setShowBillModal(false)}
            />
        </div>
    );
};

export default TableItem;