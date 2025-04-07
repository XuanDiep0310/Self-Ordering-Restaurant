import { useEffect, useState } from "react";
import { getPendingFoodItems } from "../services/foodService";

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
    return <p className="text-center text-white">Đang tải dữ liệu...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl text-center text-white bg-[#124035] p-4 rounded shadow-md">
        DANH SÁCH MÓN ĂN CẦN LÀM
      </h2>
      <div className="bg-black/60 p-6 rounded" style={{ maxHeight: "480px", overflowY: "auto" }}>
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2a413c] text-white p-4 rounded shadow-md mb-4">
          <p className="w-1/6 text-center font-bold">STT</p>
          <p className="w-4/6 text-center font-bold">Tên món</p>
          <p className="w-1/6 text-center font-bold">Số lượng</p>
        </div>
        {/* Items */}
        <div className="space-y-4">
          {foodItems.map((food, index) => (
            <div
              key={food.id}
              className="flex justify-between items-center bg-[#ced4d5] text-black p-4 rounded shadow-md"
            >
              <p className="w-1/6 text-center font-bold">{index + 1}</p>
              <p className="w-4/6 text-left font-semibold">{food.name}</p>
              <p className="w-1/6 text-center font-semibold">{food.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodList;