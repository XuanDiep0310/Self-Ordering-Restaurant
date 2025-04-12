import React from "react";

const OrderModal = ({ tableNumber, pendingItems, loading, error, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-md w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#124035] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Bàn {tableNumber}</h2>
          <button onClick={closeModal} className="text-white">
            <span className="text-3xl cursor-pointer">×</span>
          </button>
        </div>

        {/* Table Header */}
        <div className="bg-[#124035] text-white">
          <div className="grid grid-cols-12 p-3">
            <div className="col-span-1 font-bold">STT</div>
            <div className="col-span-8 font-bold">Tên món</div>
            <div className="col-span-3 font-bold text-right">Số lượng</div>
          </div>
        </div>

        {/* Table Content */}
        <div className="max-h-96 overflow-y-auto text-black">
          {loading ? (
            <div className="p-4 text-center">Đang tải...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            pendingItems.map((item, index) => (
              <div key={index} className="border-b p-4 bg-gray-100">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-1">
                    <p className="font-bold">{index + 1}</p>
                  </div>
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
                        {item.notes && (
                          <p className="text-sm text-gray-600">
                            Ghi chú: {item.notes}
                          </p>
                        )}
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
            <div className="p-4 text-center text-gray-500">
              Không có món ăn nào đang chờ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;