import { useEffect, useState } from "react";
import { getPendingFoodItems } from "../../services/foodService";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const data = await getPendingFoodItems(); // Gọi API từ foodService
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching food items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-8xl">
      <h2 className="text-2xl text-center text-white bg-[#124035] p-4 rounded-t-lg shadow-md font-bold">
        DANH SÁCH MÓN ĂN CẦN LÀM
      </h2>
      <div
        className="bg-black/60 p-4 rounded-b-lg"
        style={{ maxHeight: "66vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-[#124035] text-white p-3 rounded-lg shadow-md mb-4">
          <p className="w-1/12 text-center font-bold">STT</p>
          <p className="w-8/12 text-left pl-4 font-bold">Tên món</p>
          <p className="w-3/12 text-center font-bold">Số lượng</p>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {foodItems.length === 0 ? (
            <div className="text-center py-8 text-white">
              Không có món ăn nào cần làm
            </div>
          ) : (
            foodItems.map((food, index) => (
              <div
                key={food.id || index}
                className="flex items-center bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors text-black p-2 rounded-lg shadow-md"
              >
                <p className="w-1/12 text-center font-bold">{index + 1}</p>
                <div className="w-8/12 flex items-center">
                  {food.image && (
                    <div className="h-12 w-12 mr-4 flex-shrink-0 relative">
                      <img
                        src={`${food.image}`}
                        alt={food.dishName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-food.png"; // Fallback nếu ảnh không tải được
                        }}
                        className="h-full w-full object-cover rounded-full border-2 border-[#124035] shadow-md"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-lg">{food.dishName}</p>
                    {food.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">Ghi chú:</span>{" "}
                        {food.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-3/12 flex justify-center">
                  <span className="bg-[#124035] text-white py-2 px-8 rounded-4xl font-bold inline-block min-w-[40px] text-center">
                    {food.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodList;
