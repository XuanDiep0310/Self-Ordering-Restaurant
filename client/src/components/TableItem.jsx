import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableItem = ({ table }) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const fetchPendingItems = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await axios.get(`http://localhost:8080/api/orders/pending-items/${table.tableNumber}`);
  //     setPendingItems(response.data);
  //   } catch (err) {
  //     setError('Không thể tải dữ liệu, vui lòng thử lại sau');
  //     console.error('Error fetching pending items:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:8080/api/orders/pending-items/${table.tableNumber}`);
      setPendingItems(response.data);
    } catch (err) {
      setError('Không thể tải dữ liệu, vui lòng thử lại sau');
      console.error('Error fetching pending items:', err);
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

  const pendingItemCount = pendingItems.reduce((sum, item) => sum + item.quantity, 0);

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

      {/* Modal hiển thị thông tin đơn hàng */}
      {showOrderModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-md w-full max-w-3xl overflow-hidden">
            <div className="bg-[#124035] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Bàn {table.tableNumber}</h2>
              <button onClick={closeModal} className="text-white">
                <span className="text-3xl cursor-pointer">×</span>
              </button>
            </div>

            <div className="bg-[#124035] text-white">
              <div className="grid grid-cols-12 p-3">
                <div className="col-span-1 font-bold">STT</div>
                <div className="col-span-8 font-bold">Tên món</div>
                <div className="col-span-3 font-bold text-right">Số lượng</div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto text-black">
              {loading ? (
                <div className="p-4 text-center">Đang tải...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                pendingItems.map((item, index) => (
                  <div key={index} className="border-b p-4 bg-gray-100">
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-1"><p className="font-bold">{index + 1}</p></div>
                      <div className="col-span-8">
                        <div className="flex items-center">
                          {item.image && (
                            <img
                              src={`${item.image}`}
                              alt={item.dishName}
                              className="w-12 h-12 object-cover rounded-full mr-3"
                            />
                          )}
                          <div>
                            <h3 className="font-medium">{item.dishName}</h3>
                            {item.notes && <p className="text-sm text-gray-600">Ghi chú: {item.notes}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <div className="bg-gray-700 text-white rounded-md py-1 px-3 inline-block min-w-[40px] text-center">
                          {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {!loading && pendingItems.length === 0 && (
                <div className="p-4 text-center text-gray-500">Không có món ăn nào đang chờ</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableItem;